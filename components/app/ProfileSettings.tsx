"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, Camera, Mail, ShieldCheck, Trash2, UploadCloud } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Avatar, Badge, Card, CardHeader, Spinner, Switch, btn, field } from "@/components/app/ui";
import { useToast } from "@/components/app/Toaster";
import { formatDate, fullName, timeAgo } from "@/lib/app/format";
import type { Profile } from "@/types/app";
import { cn } from "@/lib/utils";

const MAX_BYTES = 5 * 1024 * 1024;
const TIMEZONES = ["Europe/London", "Europe/Dublin", "Europe/Paris", "Europe/Berlin", "America/New_York", "America/Chicago", "America/Los_Angeles", "Africa/Lagos", "Asia/Dubai", "Asia/Kolkata", "Asia/Singapore", "Australia/Sydney", "UTC"];

/** Centre-crops to a square and re-encodes as a 512px WebP, so uploads stay small whatever the camera produced. */
async function toSquareWebp(file: File, size = 512): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  canvas.getContext("2d")!.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, size, size);
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Couldn't process image"))), "image/webp", 0.88));
}

export default function ProfileSettings({ profile, isAdmin, emailConfirmed }: { profile: Profile; isAdmin: boolean; emailConfirmed: boolean }) {
  const router = useRouter();
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState(profile.avatar_url);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    first_name: profile.first_name ?? "",
    last_name: profile.last_name ?? "",
    job_title: profile.job_title ?? "",
    company: profile.company ?? "",
    phone: profile.phone ?? "",
    bio: profile.bio ?? "",
    timezone: profile.timezone ?? "Europe/London",
  });
  const [prefs, setPrefs] = useState({ notify_sign_in: profile.notify_sign_in, notify_product: profile.notify_product, notify_weekly: profile.notify_weekly });
  const dirty = Object.entries(form).some(([k, v]) => v !== ((profile as unknown as Record<string, string | null>)[k] ?? (k === "timezone" ? "Europe/London" : "")));
  const name = fullName({ ...profile, first_name: form.first_name || null, last_name: form.last_name || null });

  async function upload(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast({ tone: "error", title: "That isn't an image", description: "Use a PNG, JPG, WebP or GIF." });
    if (file.size > MAX_BYTES) return toast({ tone: "error", title: "Image too large", description: "Choose an image under 5 MB." });
    setUploading(true);
    try {
      const blob = await toSquareWebp(file);
      const supabase = createClient();
      const path = `${profile.id}/avatar-${Date.now()}.webp`;
      const { error } = await supabase.storage.from("avatars").upload(path, blob, { contentType: "image/webp", upsert: true, cacheControl: "31536000" });
      if (error) throw error;
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      const { error: updateError } = await supabase.from("profiles").update({ avatar_url: data.publicUrl }).eq("id", profile.id);
      if (updateError) throw updateError;
      // Tidy up the previous photo.
      const old = avatar?.split("/avatars/")[1];
      if (old) await supabase.storage.from("avatars").remove([decodeURIComponent(old)]);
      setAvatar(data.publicUrl);
      toast({ tone: "success", title: "Photo updated", description: "Your new photo shows everywhere straight away." });
      router.refresh();
    } catch (err) {
      toast({ tone: "error", title: "Upload failed", description: (err as Error).message });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function removeAvatar() {
    if (!avatar) return;
    setUploading(true);
    const supabase = createClient();
    const old = avatar.split("/avatars/")[1];
    if (old) await supabase.storage.from("avatars").remove([decodeURIComponent(old)]);
    await supabase.from("profiles").update({ avatar_url: null }).eq("id", profile.id);
    setAvatar(null);
    setUploading(false);
    toast({ tone: "info", title: "Photo removed" });
    router.refresh();
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.first_name.trim() || !form.last_name.trim()) return toast({ tone: "error", title: "Name required", description: "Enter your first and last name." });
    setSaving(true);
    const payload = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim() || null]));
    const { error } = await createClient().from("profiles").update(payload).eq("id", profile.id);
    setSaving(false);
    if (error) return toast({ tone: "error", title: "Couldn't save", description: error.message });
    toast({ tone: "success", title: "Profile saved" });
    router.refresh();
  }

  async function setPref(key: keyof typeof prefs, value: boolean) {
    setPrefs((p) => ({ ...p, [key]: value }));
    const { error } = await createClient().from("profiles").update({ [key]: value }).eq("id", profile.id);
    if (error) {
      setPrefs((p) => ({ ...p, [key]: !value }));
      toast({ tone: "error", title: "Couldn't update preference", description: error.message });
    } else toast({ tone: "success", title: "Preference saved" });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        {/* Photo */}
        <Card>
          <CardHeader title="Profile photo" description="Square images work best. We crop and resize automatically." />
          <div className="flex flex-col items-center gap-6 p-5 sm:flex-row sm:p-6">
            <div className="group relative">
              <Avatar src={avatar} name={name} size={112} className="ring-4 ring-white shadow-lg" />
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-ink-900/55 text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                aria-label="Change photo"
              >
                {uploading ? <Spinner className="h-6 w-6" /> : <Camera className="h-6 w-6" />}
              </button>
            </div>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); upload(e.dataTransfer.files[0]); }}
              onClick={() => fileRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
              className={cn(
                "focus-ring-light flex w-full flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-7 text-center transition-colors",
                dragging ? "border-primary-400 bg-primary-50" : "border-ink-900/12 hover:border-primary-300 hover:bg-slate-50"
              )}
            >
              <UploadCloud className={cn("h-7 w-7", dragging ? "text-primary-500" : "text-slate-400")} />
              <p className="mt-2 text-sm font-semibold text-ink-800">{uploading ? "Uploading…" : "Drop an image here or click to browse"}</p>
              <p className="mt-0.5 text-xs text-slate-500">PNG, JPG, WebP or GIF · up to 5 MB</p>
            </div>
            <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
          </div>
          {avatar && (
            <div className="border-t border-ink-900/[0.06] px-5 py-3 sm:px-6">
              <button onClick={removeAvatar} disabled={uploading} className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4" /> Remove photo
              </button>
            </div>
          )}
        </Card>

        {/* Details */}
        <Card>
          <CardHeader title="Personal information" description="Visible to admins in your organisation and to the analysts working your tickets." />
          <form onSubmit={save} className="space-y-5 p-5 sm:p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              {([
                ["first_name", "First name", "given-name"],
                ["last_name", "Last name", "family-name"],
                ["job_title", "Job title", "organization-title"],
                ["company", "Company", "organization"],
                ["phone", "Phone", "tel"],
              ] as const).map(([key, label, ac]) => (
                <label key={key} className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-ink-700">{label}</span>
                  <input value={form[key]} autoComplete={ac} maxLength={120} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className={field} />
                </label>
              ))}
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-ink-700">Time zone</span>
                <select value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} className={field}>
                  {TIMEZONES.map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
                </select>
              </label>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-ink-700">Bio</span>
              <textarea value={form.bio} maxLength={400} rows={3} onChange={(e) => setForm({ ...form, bio: e.target.value })} className={cn(field, "resize-y")} placeholder="A line about your role and what you look after." />
              <span className="mt-1 block text-right text-[11px] text-slate-400">{form.bio.length} / 400</span>
            </label>
            <div className="flex items-center justify-end gap-3 border-t border-ink-900/[0.06] pt-5">
              {dirty && <span className="text-xs font-medium text-amber-600">Unsaved changes</span>}
              <button type="submit" disabled={saving || !dirty} className={btn.primary}>{saving && <Spinner />} Save changes</button>
            </div>
          </form>
        </Card>

        {/* Email preferences */}
        <Card>
          <CardHeader title="Email preferences" description="Security changes such as a new password are always emailed, whatever you choose here." />
          <ul className="divide-y divide-ink-900/[0.05]">
            {([
              ["notify_sign_in", "New sign-in alerts", "An email each time your account is signed in to, with the device and location."],
              ["notify_product", "Product updates and announcements", "New platform features and messages from the CoreDefense team."],
              ["notify_weekly", "Weekly risk digest", "A Monday summary of new findings and remediation progress."],
            ] as const).map(([key, title, detail]) => (
              <li key={key} className="flex items-center gap-4 px-5 py-4 sm:px-6">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink-900">{title}</p>
                  <p className="mt-0.5 text-[13px] text-slate-500">{detail}</p>
                </div>
                <Switch checked={prefs[key]} onChange={(v) => setPref(key, v)} label={title} />
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Summary card */}
      <div className="space-y-6">
        <Card className="overflow-hidden">
          <div className="relative h-24 bg-gradient-to-br from-ink-900 via-primary-900 to-primary-600">
            <div className="absolute inset-0 bg-grid-dark opacity-50" aria-hidden />
          </div>
          <div className="-mt-12 px-6 pb-6 text-center">
            <Avatar src={avatar} name={name} size={88} className="mx-auto ring-4 ring-white shadow-lg" />
            <p className="mt-3 text-lg font-bold text-ink-900">{name}</p>
            <p className="text-sm text-slate-500">{form.job_title || "Add your job title"}{form.company ? ` · ${form.company}` : ""}</p>
            <div className="mt-3 flex justify-center gap-2">
              {isAdmin && <Badge className="bg-amber-50 text-amber-800 ring-amber-600/20"><ShieldCheck className="h-3 w-3" /> Admin</Badge>}
              {emailConfirmed && <Badge className="bg-emerald-50 text-emerald-700 ring-emerald-600/15"><BadgeCheck className="h-3 w-3" /> Verified</Badge>}
            </div>
            {form.bio && <p className="mt-4 text-sm leading-relaxed text-slate-600">{form.bio}</p>}
          </div>
          <dl className="space-y-3 border-t border-ink-900/[0.06] p-6 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="flex items-center gap-2 text-slate-500"><Mail className="h-4 w-4" /> Email</dt>
              <dd className="truncate font-medium text-ink-900">{profile.email}</dd>
            </div>
            <div className="flex justify-between"><dt className="text-slate-500">Member since</dt><dd className="font-medium text-ink-900">{formatDate(profile.created_at)}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Last sign-in</dt><dd className="font-medium text-ink-900">{timeAgo(profile.last_sign_in_at)}</dd></div>
          </dl>
          <p className="border-t border-ink-900/[0.06] bg-slate-50 px-6 py-3 text-xs text-slate-500">Need to change your email address? Open a support request so we can verify the change.</p>
        </Card>
      </div>
    </div>
  );
}
