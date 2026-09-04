"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

interface BookingModalProps {
  trigger: React.ReactNode;
  triggerClassName?: string;
  eventLabel?: string;
}

export default function BookingModal({
  trigger,
  triggerClassName,
  eventLabel = "Book a CoreDefense Consultation",
}: BookingModalProps) {
  const [open, setOpen] = useState(false);
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL;

  return (
    <>
      <span
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        role="button"
        tabIndex={0}
        className={cn("contents cursor-pointer", triggerClassName)}
      >
        {trigger}
      </span>
      <Modal open={open} onClose={() => setOpen(false)} title={eventLabel} size="xl" className="p-0">
        {calendlyUrl ? (
          <div className="h-[70vh] w-full overflow-hidden rounded-xl">
            <iframe
              title="Book a consultation with CoreDefense"
              src={`${calendlyUrl}?embed_domain=coredefense.co.uk&embed_type=Inline&hide_gdpr_banner=1`}
              className="h-full w-full border-0"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-10 text-center">
            <CalendarDays className="h-12 w-12 text-primary-500" />
            <h3 className="text-lg font-bold text-ink-900">Booking is being configured</h3>
            <p className="max-w-sm text-sm text-ink-600">
              Our consultation calendar isn&apos;t connected yet. In the meantime, send us a message via the
              contact form and we&apos;ll arrange a time that works for you.
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}
