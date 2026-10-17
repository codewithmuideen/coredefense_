"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Linkedin, Plus, ArrowUpRight } from "lucide-react";
import { teamMembers } from "@/lib/team-data";

// Card photos get a clipped top-right corner, echoing the angled cut in the CoreDefense mark.
const CLIP = "polygon(0 0, calc(100% - 44px) 0, 100% 44px, 100% 100%, 0 100%)";

export default function TeamGrid() {
  return (
    <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
      {teamMembers.map((member, i) => (
        <motion.article
          key={member.name}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="group relative"
        >
          <div className="relative">
            {/* Glow that blooms behind the photo on hover */}
            <div
              className="pointer-events-none absolute -inset-3 rounded-3xl bg-primary-500/0 blur-2xl transition-all duration-500 group-hover:bg-primary-500/25"
              aria-hidden
            />

            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} on LinkedIn`}
              className="focus-ring relative block overflow-hidden bg-ink-800"
              style={{ clipPath: CLIP }}
            >
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={member.photo}
                  alt={`${member.name}, ${member.role} at CoreDefense`}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover object-top grayscale-[35%] transition-all duration-700 ease-out group-hover:scale-[1.06] group-hover:grayscale-0"
                  priority={i < 2}
                />
              </div>

              {/* Darkening gradient + scan line sweep on hover */}
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-24 -translate-y-full bg-gradient-to-b from-transparent via-primary-400/25 to-transparent opacity-0 transition-all duration-1000 ease-out group-hover:translate-y-[480%] group-hover:opacity-100"
                aria-hidden
              />

              {/* "Connect" label slides up from the bottom edge */}
              <span className="absolute bottom-5 left-5 flex translate-y-4 items-center gap-1.5 text-sm font-semibold text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                Connect on LinkedIn
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </a>

            {/* Blue action tile: the plus turns away and the LinkedIn mark springs up in its place */}
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${member.name}'s LinkedIn profile`}
              className="focus-ring absolute -bottom-6 right-6 flex h-14 w-14 items-center justify-center overflow-hidden bg-primary-500 text-white shadow-[0_12px_30px_-10px_rgba(30,106,255,0.8)] transition-all duration-300 hover:bg-white hover:text-primary-600 group-hover:-translate-y-1"
            >
              <Plus
                className="absolute h-6 w-6 transition-all duration-500 group-hover:rotate-90 group-hover:scale-0 group-hover:opacity-0 [@media(hover:none)]:opacity-0"
                aria-hidden
              />
              <Linkedin
                className="absolute h-5 w-5 translate-y-8 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-y-0 group-hover:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100"
                aria-hidden
              />
              <span className="absolute inset-0 animate-ping bg-primary-400/40 opacity-0 group-hover:opacity-100 [animation-iteration-count:1]" aria-hidden />
            </a>
          </div>

          <div className="mt-10">
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
