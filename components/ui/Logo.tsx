import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  dark?: boolean;
}

export default function Logo({ className, dark = false }: LogoProps) {
  const src = dark ? "/images/brand/logo-white.png" : "/images/brand/logo-black.png";

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
