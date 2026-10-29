import { escapeHtml } from "@/lib/email/send";

// Table-based, inline-styled HTML so it renders the same in Gmail, Outlook and Apple Mail.
// The wordmark is text, not an image, so it shows even before the site is hosted.

interface LayoutInput {
  preheader: string;
  heading: string;
  intro: string;
  body?: string;
  cta?: { label: string; href: string };
  footnote?: string;
}

function layout({ preheader, heading, intro, body = "", cta, footnote }: LayoutInput) {
  const button = cta
    ? `<tr><td style="padding:8px 0 4px"><a href="${cta.href}" style="display:inline-block;background:#1E6AFF;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:13px 24px;border-radius:10px">${escapeHtml(cta.label)}</a></td></tr>
       <tr><td style="padding:14px 0 0;font-size:12px;color:#6B7280;line-height:1.6">Button not working? Paste this link into your browser:<br><a href="${cta.href}" style="color:#1E6AFF;word-break:break-all">${cta.href}</a></td></tr>`
    : "";
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(heading)}</title></head>
<body style="margin:0;padding:0;background:#F1F4F9">
<span style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F1F4F9;padding:32px 12px">
<tr><td align="center">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;font-family:Manrope,'Segoe UI',Arial,sans-serif">
    <tr><td style="padding:0 4px 18px">
      <span style="display:inline-block;width:26px;height:26px;border-radius:7px;background:#1E6AFF;vertical-align:middle"></span>
      <span style="font-size:20px;font-weight:800;color:#0A0D16;vertical-align:middle;margin-left:8px;letter-spacing:-0.3px">CoreDefense</span>
    </td></tr>
    <tr><td style="background:#ffffff;border-radius:16px;border:1px solid #E3E8F0;padding:36px 32px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="font-size:22px;font-weight:800;color:#0A0D16;letter-spacing:-0.4px;padding-bottom:12px">${escapeHtml(heading)}</td></tr>
        <tr><td style="font-size:15px;line-height:1.65;color:#374151;padding-bottom:18px">${intro}</td></tr>
        ${body ? `<tr><td style="padding-bottom:18px">${body}</td></tr>` : ""}
        ${button}
      </table>
    </td></tr>
    <tr><td style="padding:20px 8px 0;font-size:12px;line-height:1.6;color:#6B7280;text-align:center">
      ${footnote ? `${footnote}<br><br>` : ""}
      CoreDefense will never ask for your password or sign-in code by email or phone.<br>
      © ${new Date().getFullYear()} CoreDefense · United Kingdom
    </td></tr>
  </table>
</td></tr></table></body></html>`;
}

function detailsTable(rows: [string, string][]) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6F8FB;border-radius:12px;border:1px solid #E3E8F0">
${rows
  .map(
    ([k, v], i) =>
      `<tr><td style="padding:11px 16px;font-size:13px;color:#6B7280;${i ? "border-top:1px solid #E3E8F0;" : ""}width:38%">${escapeHtml(k)}</td><td style="padding:11px 16px;font-size:13px;color:#0A0D16;font-weight:600;${i ? "border-top:1px solid #E3E8F0;" : ""}">${escapeHtml(v)}</td></tr>`
  )
  .join("")}
</table>`;
}

export interface SignInContext {
  device: string;
  ip: string;
  location: string;
  time: string;
}

export function verifyEmailTemplate(name: string, link: string) {
  return {
    subject: "Confirm your CoreDefense account",
    html: layout({
      preheader: "One click to activate your workspace.",
      heading: `Welcome, ${name}`,
      intro: "Confirm your email address to activate your CoreDefense account. The link expires in 24 hours.",
      cta: { label: "Confirm email address", href: link },
      footnote: "If you didn't create this account you can ignore this email; nothing will be activated.",
    }),
  };
}

export function loginCodeTemplate(name: string, code: string, ctx: SignInContext) {
  const spaced = `${code.slice(0, 3)} ${code.slice(3)}`;
  return {
    subject: `${spaced} is your CoreDefense sign-in code`,
    text: `Your CoreDefense sign-in code is ${code}. It expires in 10 minutes.`,
    html: layout({
      preheader: `Your sign-in code is ${spaced}. It expires in 10 minutes.`,
      heading: "Your sign-in code",
      intro: `Hi ${escapeHtml(name)}, enter this code to finish signing in. It expires in <strong>10 minutes</strong> and works once.`,
      body: `<div style="text-align:center;background:#0A0D16;border-radius:14px;padding:22px 12px;margin-bottom:18px">
          <span style="font-family:'SFMono-Regular',Consolas,monospace;font-size:34px;font-weight:700;letter-spacing:10px;color:#ffffff">${code}</span>
        </div>${detailsTable([
          ["Device", ctx.device],
          ["Location", ctx.location],
          ["IP address", ctx.ip],
          ["Requested", ctx.time],
        ])}`,
      footnote: "Didn't try to sign in? Someone may know your password. Reset it straight away from the login page.",
    }),
  };
}

export function newSignInTemplate(name: string, ctx: SignInContext, securityUrl: string) {
  return {
    subject: "New sign-in to your CoreDefense account",
    html: layout({
      preheader: `Signed in from ${ctx.device}, ${ctx.location}.`,
      heading: "New sign-in detected",
      intro: `Hi ${escapeHtml(name)}, your account was just signed in to. If this was you, there's nothing to do.`,
      body: detailsTable([
        ["Device", ctx.device],
        ["Location", ctx.location],
        ["IP address", ctx.ip],
        ["Time", ctx.time],
      ]),
      cta: { label: "Review account security", href: securityUrl },
      footnote: "Not you? Change your password and sign out of all devices from the Security page.",
    }),
  };
}

export function passwordResetTemplate(name: string, link: string) {
  return {
    subject: "Reset your CoreDefense password",
    html: layout({
      preheader: "Use this link to choose a new password.",
      heading: "Reset your password",
      intro: `Hi ${escapeHtml(name)}, we received a request to reset your password. The link expires in 1 hour and can be used once.`,
      cta: { label: "Choose a new password", href: link },
      footnote: "If you didn't ask for this, ignore this email. Your password stays the same.",
    }),
  };
}

export function securityChangeTemplate(name: string, change: string, ctx: SignInContext, securityUrl: string) {
  return {
    subject: `Security alert: ${change}`,
    html: layout({
      preheader: `${change} on your CoreDefense account.`,
      heading: "Your security settings changed",
      intro: `Hi ${escapeHtml(name)}, this is a record of a change to your account: <strong>${escapeHtml(change)}</strong>.`,
      body: detailsTable([
        ["Change", change],
        ["Device", ctx.device],
        ["Location", ctx.location],
        ["Time", ctx.time],
      ]),
      cta: { label: "Open security settings", href: securityUrl },
      footnote: "If you didn't make this change, reset your password now and contact info@coredefense.co.uk.",
    }),
  };
}

export function welcomeTemplate(name: string, dashboardUrl: string) {
  return {
    subject: "Your CoreDefense workspace is ready",
    html: layout({
      preheader: "Three quick steps to get the most from your workspace.",
      heading: `You're in, ${name}`,
      intro: "Your email is confirmed and your workspace is live. Three things worth doing first:",
      body: `<ol style="margin:0;padding-left:20px;font-size:14px;line-height:1.9;color:#374151">
          <li>Add a profile photo and job title so your team recognises you.</li>
          <li>Turn on an authenticator app under <strong>Security</strong>.</li>
          <li>Triage the critical findings at the top of your queue.</li>
        </ol>`,
      cta: { label: "Open your dashboard", href: dashboardUrl },
    }),
  };
}

export function broadcastTemplate(title: string, message: string, link: string) {
  return {
    subject: title,
    html: layout({
      preheader: message.slice(0, 110),
      heading: title,
      intro: escapeHtml(message).replace(/\n/g, "<br>"),
      cta: { label: "Open CoreDefense", href: link },
    }),
  };
}

export function ticketReplyTemplate(name: string, subject: string, reply: string, link: string) {
  return {
    subject: `Re: ${subject}`,
    html: layout({
      preheader: reply.slice(0, 110),
      heading: "Our team replied to your request",
      intro: `Hi ${escapeHtml(name)}, there's an update on <strong>${escapeHtml(subject)}</strong>:`,
      body: `<div style="border-left:3px solid #1E6AFF;background:#F6F8FB;padding:14px 16px;border-radius:0 10px 10px 0;font-size:14px;line-height:1.7;color:#1F2937">${escapeHtml(reply).replace(/\n/g, "<br>")}</div>`,
      cta: { label: "View the conversation", href: link },
    }),
  };
}
