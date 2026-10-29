-- CoreDefense database schema.
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste this file → Run.
-- Safe to re-run: every statement is idempotent.

-- ─── Helpers ──────────────────────────────────────────────────────────────────

-- Admin rights come from app_metadata, which only the server (service role) can change.
create or replace function public.is_admin() returns boolean
language sql stable as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)
$$;

create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ─── Profiles ─────────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id              uuid primary key references auth.users on delete cascade,
  email           text not null,
  first_name      text,
  last_name       text,
  company         text,
  job_title       text,
  phone           text,
  bio             text,
  avatar_url      text,
  timezone        text not null default 'Europe/London',
  role            text not null default 'user' check (role in ('user', 'admin')),
  status          text not null default 'active' check (status in ('active', 'suspended')),
  notify_sign_in  boolean not null default true,
  notify_product  boolean not null default true,
  notify_weekly   boolean not null default false,
  last_sign_in_at timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles: read own or admin" on public.profiles;
create policy "profiles: read own or admin" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Users may edit their own details but never role, status, email or timestamps.
revoke update on public.profiles from authenticated, anon;
grant update (first_name, last_name, company, job_title, phone, bio, avatar_url, timezone,
              notify_sign_in, notify_product, notify_weekly) on public.profiles to authenticated;

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- ─── Findings (the security queue each workspace works through) ──────────────

create table if not exists public.findings (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  title       text not null,
  description text,
  severity    text not null check (severity in ('critical', 'high', 'medium', 'low', 'info')),
  status      text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'accepted')),
  asset       text not null,
  category    text not null,
  cvss        numeric(3,1),
  cve         text,
  detected_at timestamptz not null default now(),
  due_at      timestamptz,
  resolved_at timestamptz,
  created_at  timestamptz not null default now()
);
create index if not exists findings_user_idx on public.findings (user_id, detected_at desc);

alter table public.findings enable row level security;

drop policy if exists "findings: read own or admin" on public.findings;
create policy "findings: read own or admin" on public.findings
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "findings: update own" on public.findings;
create policy "findings: update own" on public.findings
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

revoke update on public.findings from authenticated, anon;
grant update (status, resolved_at) on public.findings to authenticated;

-- ─── Activity feed ────────────────────────────────────────────────────────────

create table if not exists public.activity (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users on delete cascade,
  action     text not null,
  detail     text,
  created_at timestamptz not null default now()
);
create index if not exists activity_user_idx on public.activity (user_id, created_at desc);

alter table public.activity enable row level security;

drop policy if exists "activity: read own" on public.activity;
create policy "activity: read own" on public.activity
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "activity: insert own" on public.activity;
create policy "activity: insert own" on public.activity
  for insert with check (auth.uid() = user_id);

-- ─── Notifications ────────────────────────────────────────────────────────────

create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users on delete cascade,
  kind       text not null default 'system' check (kind in ('security', 'finding', 'system', 'support')),
  title      text not null,
  body       text,
  link       text,
  read_at    timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_idx on public.notifications (user_id, created_at desc);

alter table public.notifications enable row level security;

drop policy if exists "notifications: read own" on public.notifications;
create policy "notifications: read own" on public.notifications
  for select using (auth.uid() = user_id);

drop policy if exists "notifications: mark own read" on public.notifications;
create policy "notifications: mark own read" on public.notifications
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "notifications: delete own" on public.notifications;
create policy "notifications: delete own" on public.notifications
  for delete using (auth.uid() = user_id);

revoke update on public.notifications from authenticated, anon;
grant update (read_at) on public.notifications to authenticated;

-- Live notification bell: stream inserts to the browser.
do $$ begin
  alter publication supabase_realtime add table public.notifications;
exception when duplicate_object then null; when undefined_object then null; end $$;

-- ─── Support tickets ──────────────────────────────────────────────────────────

create table if not exists public.tickets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles on delete cascade,
  subject     text not null check (char_length(subject) between 3 and 140),
  category    text not null default 'General',
  priority    text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  status      text not null default 'open' check (status in ('open', 'pending', 'resolved')),
  message     text not null check (char_length(message) between 10 and 4000),
  admin_reply text,
  replied_at  timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists tickets_user_idx on public.tickets (user_id, created_at desc);

alter table public.tickets enable row level security;

drop policy if exists "tickets: read own or admin" on public.tickets;
create policy "tickets: read own or admin" on public.tickets
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "tickets: create own" on public.tickets;
create policy "tickets: create own" on public.tickets
  for insert with check (auth.uid() = user_id and status = 'open' and admin_reply is null);

drop trigger if exists tickets_touch on public.tickets;
create trigger tickets_touch before update on public.tickets
  for each row execute function public.touch_updated_at();

-- ─── Sign-in security (server-only: no policies, so only the service role can touch them) ──

create table if not exists public.login_events (
  id         bigint generated always as identity primary key,
  user_id    uuid references public.profiles on delete set null,
  email      text,
  event      text not null,
  ip         text,
  user_agent text,
  device     text,
  location   text,
  created_at timestamptz not null default now()
);
create index if not exists login_events_user_idx on public.login_events (user_id, created_at desc);
create index if not exists login_events_email_idx on public.login_events (email, created_at desc);

alter table public.login_events enable row level security;

drop policy if exists "login_events: read own or admin" on public.login_events;
create policy "login_events: read own or admin" on public.login_events
  for select using (auth.uid() = user_id or public.is_admin());

create table if not exists public.login_challenges (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  code_hash   text not null,
  remember    boolean not null default true,
  next_path   text,
  attempts    int not null default 0,
  expires_at  timestamptz not null,
  consumed_at timestamptz,
  created_at  timestamptz not null default now()
);
alter table public.login_challenges enable row level security;

create table if not exists public.audit_log (
  id          bigint generated always as identity primary key,
  actor_id    uuid references auth.users on delete set null,
  actor_email text,
  action      text not null,
  target      text,
  detail      jsonb not null default '{}',
  created_at  timestamptz not null default now()
);
alter table public.audit_log enable row level security;

drop policy if exists "audit_log: admin read" on public.audit_log;
create policy "audit_log: admin read" on public.audit_log
  for select using (public.is_admin());

-- ─── New-user setup: profile, starter findings, welcome notification ─────────

create or replace function public.seed_workspace(uid uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  insert into public.findings (user_id, title, description, severity, status, asset, category, cvss, cve, detected_at, due_at, resolved_at) values
  (uid, 'Edge VPN appliance missing critical firmware patch', 'The perimeter VPN is two releases behind and exposed to an actively exploited authentication bypass. Patch, then rotate VPN credentials and review session logs for the last 30 days.', 'critical', 'open', 'vpn-edge-01', 'Vulnerability', 9.8, 'CVE-2026-20352', now() - interval '3 days', now() + interval '2 days', null),
  (uid, 'Cloud access key committed to public repository', 'A long-lived access key with write access to production storage appears in a public commit. Revoke the key, rotate dependants and enable secret scanning on push.', 'critical', 'in_progress', 'github.com/acme/web', 'Secrets', 9.1, null, now() - interval '6 days', now() + interval '1 day', null),
  (uid, 'Domain admin accounts without MFA', 'Four privileged identities can sign in with a password alone. Enforce phishing-resistant MFA through conditional access.', 'high', 'open', 'Entra ID tenant', 'Identity', 8.1, null, now() - interval '9 days', now() + interval '5 days', null),
  (uid, 'Internet-facing RDP on file server', 'Port 3389 is reachable from the internet. Close it at the firewall and move admin access behind the VPN or a bastion host.', 'high', 'open', 'fs-02.corp', 'Exposure', 8.8, null, now() - interval '12 days', now() + interval '3 days', null),
  (uid, 'Outdated OpenSSL on payment API containers', 'Base image ships an OpenSSL build with a known denial-of-service flaw. Rebuild from the patched base image.', 'high', 'resolved', 'payments-api', 'Vulnerability', 7.5, 'CVE-2026-0119', now() - interval '41 days', now() - interval '27 days', now() - interval '30 days'),
  (uid, 'Storage bucket allows public listing', 'Anonymous users can list object names in the marketing assets bucket. Turn off public listing; serve files through the CDN only.', 'medium', 'in_progress', 's3://acme-marketing', 'Cloud', 5.3, null, now() - interval '15 days', now() + interval '10 days', null),
  (uid, 'TLS 1.0 still enabled on partner portal', 'Legacy protocol versions remain negotiable. Restrict to TLS 1.2 and above.', 'medium', 'open', 'partners.acme.co.uk', 'Configuration', 5.9, null, now() - interval '19 days', now() + interval '14 days', null),
  (uid, 'Missing DMARC enforcement', 'DMARC is set to p=none, so spoofed mail claiming to be from your domain is still delivered. Move to quarantine, then reject.', 'medium', 'resolved', 'acme.co.uk', 'Email', 5.0, null, now() - interval '52 days', now() - interval '38 days', now() - interval '40 days'),
  (uid, 'Stale user accounts with active licences', 'Twenty-three accounts have not signed in for 90+ days. Disable them and recover licences.', 'medium', 'open', 'Microsoft 365', 'Identity', 4.3, null, now() - interval '24 days', now() + interval '21 days', null),
  (uid, 'Verbose server banner discloses version', 'The web server reveals its exact version in response headers, which helps attackers target exploits.', 'low', 'resolved', 'www.acme.co.uk', 'Configuration', 3.1, null, now() - interval '63 days', now() - interval '33 days', now() - interval '50 days'),
  (uid, 'Security headers incomplete on intranet', 'Content-Security-Policy and Strict-Transport-Security are missing.', 'low', 'open', 'intranet.corp', 'Web', 3.7, null, now() - interval '28 days', now() + interval '30 days', null),
  (uid, 'Unsupported Windows Server 2012 host', 'One host is past end of support and no longer receives security updates. Plan migration or isolate it.', 'high', 'accepted', 'legacy-erp-01', 'Lifecycle', 7.0, null, now() - interval '74 days', null, null),
  (uid, 'Printer management page uses default credentials', 'The floor-two printer accepts the vendor default admin password.', 'medium', 'resolved', 'prn-floor2', 'OT / IoT', 6.5, null, now() - interval '81 days', now() - interval '60 days', now() - interval '70 days'),
  (uid, 'SPF record exceeds DNS lookup limit', 'The SPF record triggers more than 10 DNS lookups, so some receivers treat it as a permanent error.', 'low', 'in_progress', 'acme.co.uk', 'Email', 2.6, null, now() - interval '33 days', now() + interval '20 days', null),
  (uid, 'Third-party script loaded without integrity check', 'A marketing tag is loaded from a CDN without Subresource Integrity.', 'info', 'open', 'www.acme.co.uk', 'Web', null, null, now() - interval '5 days', null, null),
  (uid, 'Backup restore not tested this quarter', 'Policy requires a quarterly restore test; the last recorded test was 104 days ago.', 'medium', 'open', 'Veeam backup', 'Resilience', null, null, now() - interval '1 day', now() + interval '7 days', null);

  insert into public.activity (user_id, action, detail, created_at) values
  (uid, 'Workspace created', 'Starter findings imported from the baseline assessment', now());
end $$;

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, first_name, last_name, company, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.raw_user_meta_data ->> 'company',
    coalesce(new.raw_app_meta_data ->> 'role', 'user')
  )
  on conflict (id) do nothing;

  perform public.seed_workspace(new.id);

  insert into public.notifications (user_id, kind, title, body, link) values
  (new.id, 'system', 'Welcome to CoreDefense', 'Your workspace is ready. Start with the two critical findings at the top of your queue.', '/dashboard/findings'),
  (new.id, 'security', 'Protect your account', 'Add an authenticator app for the strongest sign-in protection.', '/dashboard/security');
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep the profile mirror in step with Auth (email changes, sign-ins, role changes).
create or replace function public.handle_user_updated() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update public.profiles set
    email = new.email,
    last_sign_in_at = new.last_sign_in_at,
    role = coalesce(new.raw_app_meta_data ->> 'role', 'user')
  where id = new.id;
  return new;
end $$;

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated after update of email, last_sign_in_at, raw_app_meta_data on auth.users
  for each row execute function public.handle_user_updated();

-- ─── Avatars (public bucket; each user writes only inside their own folder) ──

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152, array['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
on conflict (id) do update set public = true, file_size_limit = 2097152,
  allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

drop policy if exists "avatars: public read" on storage.objects;
create policy "avatars: public read" on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists "avatars: upload own" on storage.objects;
create policy "avatars: upload own" on storage.objects
  for insert to authenticated with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "avatars: update own" on storage.objects;
create policy "avatars: update own" on storage.objects
  for update to authenticated using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "avatars: delete own" on storage.objects;
create policy "avatars: delete own" on storage.objects
  for delete to authenticated using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- ─── Backfill: profiles for any users created before this script ran ─────────

insert into public.profiles (id, email, first_name, last_name, company, role)
select u.id, u.email, u.raw_user_meta_data ->> 'first_name', u.raw_user_meta_data ->> 'last_name',
       u.raw_user_meta_data ->> 'company', coalesce(u.raw_app_meta_data ->> 'role', 'user')
from auth.users u
on conflict (id) do nothing;

-- ─── Make yourself an admin (edit the email, run, then sign out and back in) ──
-- update auth.users set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}' where email = 'you@yourcompany.com';
