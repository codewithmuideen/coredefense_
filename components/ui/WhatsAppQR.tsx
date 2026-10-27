import Image from "next/image";
import { CONTACT } from "@/lib/contact";
import { cn } from "@/lib/utils";

interface WhatsAppQRProps {
  size: number;
  /** Corner brackets and the scan-line sweep; off for small placements like the footer. */
  scanner?: boolean;
  className?: string;
}

// The branded WhatsApp QR inside a glowing frame. The whole frame is also a tap target for phone users.
export default function WhatsAppQR({ size, scanner = false, className }: WhatsAppQRProps) {
  return (
    <a
      href={CONTACT.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Scan or tap to chat with CoreDefense on WhatsApp, ${CONTACT.phoneDisplay}`}
      className={cn("focus-ring group relative block w-fit rounded-[22px] transition-transform duration-300 hover:scale-[1.03]", className)}
    >
      {/* Gradient frame with a soft glow behind it */}
      <span className="absolute -inset-3 rounded-[28px] bg-gradient-to-br from-emerald-400/40 via-primary-500/30 to-emerald-500/40 blur-xl opacity-70 transition-opacity group-hover:opacity-100" aria-hidden />
      <span className="relative block rounded-[22px] bg-gradient-to-br from-emerald-400 via-primary-400 to-emerald-500 p-[2px] shadow-2xl shadow-emerald-500/20">
        <span className={cn("relative block overflow-hidden rounded-[20px] bg-white", scanner ? "p-4" : "p-1.5")}>
          <Image src={CONTACT.whatsappQr} alt="WhatsApp QR code for CoreDefense" width={size} height={size} unoptimized className="block" />
          {scanner && (
            <>
              {[
                "left-1.5 top-1.5 border-l-[3px] border-t-[3px] rounded-tl-lg",
                "right-1.5 top-1.5 border-r-[3px] border-t-[3px] rounded-tr-lg",
                "bottom-1.5 left-1.5 border-b-[3px] border-l-[3px] rounded-bl-lg",
                "bottom-1.5 right-1.5 border-b-[3px] border-r-[3px] rounded-br-lg",
              ].map((pos) => (
                <span key={pos} className={cn("pointer-events-none absolute h-6 w-6 border-emerald-500", pos)} aria-hidden />
              ))}
              <span
                className="pointer-events-none absolute inset-x-3 top-3 h-10 animate-scan bg-gradient-to-b from-transparent via-emerald-400/25 to-transparent motion-reduce:hidden"
                aria-hidden
              />
            </>
          )}
        </span>
      </span>
    </a>
  );
}
