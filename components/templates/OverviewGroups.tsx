import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { cn } from "@/lib/utils";

export interface OverviewItem {
  label: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
}

export interface OverviewGroup {
  number?: string;
  heading: string;
  href: string;
  description: string;
  image: string;
  ctaLabel: string;
  items: OverviewItem[];
}

// Landing page body for a top-level nav item: every page behind that menu, with a short description each.
export default function OverviewGroups({ groups }: { groups: OverviewGroup[] }) {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container-page space-y-20 sm:space-y-28">
        {groups.map((group, gi) => (
          <ScrollReveal key={group.heading}>
            <div id={group.href.split("/").pop()} className={cn(
                "grid scroll-mt-28 gap-10 lg:gap-14",
                gi % 2 === 1 ? "lg:grid-cols-[1fr_380px]" : "lg:grid-cols-[380px_1fr]"
              )}>
              <div className={cn("lg:sticky lg:top-28 lg:self-start", gi % 2 === 1 && "lg:order-2")}>
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-primary-50 via-white to-surface ring-1 ring-ink-900/5">
                  <div
                    className="absolute inset-0 opacity-60"
                    style={{ backgroundImage: "radial-gradient(circle, rgba(30,106,255,0.18) 1px, transparent 1px)", backgroundSize: "20px 20px" }}
                    aria-hidden
                  />
                  <div className="relative h-[78%] w-[78%]">
                    <Image src={group.image} alt="" fill sizes="380px" className="object-contain drop-shadow-xl mix-blend-multiply" />
                  </div>
                  {group.number && (
                    <span className="absolute left-5 top-4 text-sm font-bold tracking-widest text-primary-500">{group.number}</span>
                  )}
                </div>
                <h2 className="mt-6 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">{group.heading}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-600 sm:text-base">{group.description}</p>
                <Link
                  href={group.href}
                  className="focus-ring group mt-5 inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-primary-600 hover:text-primary-700"
                >
                  {group.ctaLabel}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              <div className={cn("grid content-start gap-4 sm:grid-cols-2", gi % 2 === 1 && "lg:order-1")}>
                {group.items.map((item) => (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    className="focus-ring group relative flex h-full gap-4 overflow-hidden rounded-2xl border border-ink-900/8 bg-surface-near p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-200 hover:bg-white hover:shadow-lg"
                  >
                    {item.icon && (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors duration-300 group-hover:bg-primary-500 group-hover:text-white">
                        <item.icon className="h-5 w-5" />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col justify-center">
                      <h3 className="flex items-start justify-between gap-2 text-sm font-bold text-ink-900 sm:text-base">
                        {item.label}
                        <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-ink-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary-500" />
                      </h3>
                      {item.description && <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{item.description}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
