import Image from "next/image";
import { cn } from "@/lib/utils";
import LiquidLogo from "@/components/ui/LiquidLogo";

interface LogoProps {
  className?: string;
  dark?: boolean;
  /** Liquid settle on load and ripple on hover (used in the site header). */
  liquid?: boolean;
}

export default function Logo({ className, dark = false, liquid = false }: LogoProps) {
  const src = dark ? "/images/brand/logo-white.png" : "/images/brand/logo-black.png";
  const [width, height] = dark ? [690, 97] : [606, 84];

  if (liquid) return <LiquidLogo src={src} width={width} height={height} className={className} />;

  return (
    <Image
      src={src}
      alt="CoreDefense"
      width={606}
      height={84}
      priority
      className={cn("h-7 w-auto object-contain sm:h-8", className)}
    />
  );
}
