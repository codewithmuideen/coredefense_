"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Linkedin, Plus } from "lucide-react";
import { teamMembers } from "@/lib/team-data";

// Framing per photo. "bottom" is for wider cut-outs: the whole photo rests on the bottom edge,
// leaving the same headroom as the taller photos instead of cropping the shoulders.
const PHOTO_FIT = {
  cover: "object-cover object-top",
  bottom: "object-contain object-bottom origin-bottom",
} as const;

export default function TeamGrid() {
  return (
    <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
      {teamMembers.map((member, i) => (
        <motion.article
          key={member.name}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="group relative"
        >
          <div className="relative overflow-hidden rounded-lg ring-1 ring-white/10 transition-all duration-500 group-hover:-translate-y-1.5 group-hover:shadow-[0_24px_60px_-20px_rgba(30,106,255,0.65)] group-hover:ring-primary-400/50">
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} on LinkedIn`}
              className="focus-ring relative block"
            >
              {/* Brand backdrop: blue-to-navy gradient, faint grid, and a glow behind the head */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary-500 via-primary-700 to-ink-900" aria-hidden />
              <div className="absolute inset-0 bg-grid-dark opacity-60" aria-hidden />
              <div
                className="absolute left-1/2 top-[18%] h-2/3 w-[120%] -translate-x-1/2 rounded-full bg-primary-300/40 blur-3xl transition-opacity duration-500 group-hover:opacity-80"
                aria-hidden
              />

              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={member.photo}
                  alt={`${member.name}, ${member.role} at CoreDefense`}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className={`${PHOTO_FIT[member.photoFit ?? "cover"]} transition-transform duration-700 ease-out group-hover:scale-[1.05]`}
                  priority={i < 2}
                />
              </div>
            </a>

            {/* Action tile: the plus turns away and the LinkedIn mark springs up in its place */}
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${member.name}'s LinkedIn profile`}
              className="focus-ring absolute right-4 top-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-md bg-white text-primary-600 shadow-lg transition-all duration-300 hover:bg-primary-500 hover:text-white"
            >
              <Plus
                className="absolute h-5 w-5 transition-all duration-500 group-hover:rotate-90 group-hover:scale-0 group-hover:opacity-0 [@media(hover:none)]:opacity-0"
                aria-hidden
              />
              <Linkedin
                className="absolute h-5 w-5 translate-y-8 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-y-0 group-hover:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100"
                aria-hidden
              />
            </a>
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-400">{member.role}</p>
            <h3 className="mt-2 text-xl font-bold text-white transition-colors duration-300 group-hover:text-primary-300">
              {member.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/55">{member.focus}</p>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
