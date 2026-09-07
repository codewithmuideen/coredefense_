"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "text";
type Size = "md" | "lg";

interface CTAButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  href?: string;
  variant?: Variant;
  size?: Size;
  icon?: boolean;
  external?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
}

const base =
  "focus-ring inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-[0_0_0_0_rgba(30,106,255,0)] hover:shadow-[0_8px_24px_-8px_rgba(30,106,255,0.6)]",
  secondary: "bg-transparent text-current border border-current/25 hover:border-current/60 hover:bg-current/5",
  ghost: "bg-white/10 text-white border border-white/15 hover:bg-white/20",
  text: "text-primary-500 hover:text-primary-600 px-0",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export const CTAButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, CTAButtonProps>(
  function CTAButton(
    { href, variant = "primary", size = "md", icon = true, external, className, children, ...props },
    ref
  ) {
    const classes = cn(base, variants[variant], variant !== "text" && sizes[size], className);

    if (href) {
      const isExternal = external || href.startsWith("http");
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
          {icon && <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />}
        </Link>
      );
    }

    return (
      <button ref={ref as React.Ref<HTMLButtonElement>} className={classes} {...props}>
        {children}
        {icon && <ArrowRight className="h-4 w-4" aria-hidden />}
      </button>
    );
  }
);

export default CTAButton;
