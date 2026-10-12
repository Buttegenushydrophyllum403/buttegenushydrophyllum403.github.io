"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { SmartMedia } from "@/components/media/SmartMedia";
import type { Project, ProjectsPageCopy } from "@/content";
import { accentTextVar } from "@/lib/utils";

// Index cards never sit perfectly straight on a desk.
const TILTS = [-1.2, 0.8, -0.5, 1.1, -0.9, 0.6];

export function ProjectCard({ project, index, copy }: { project: Project; index: number; copy: ProjectsPageCopy["card"] }) {
  const cover = project.cover;
  // The phone frame only makes sense around a real screenshot.
  const isPhone = cover.placeholder === "phone" && Boolean(cover.src);
  const tilt = TILTS[index % TILTS.length];

  return (
    <motion.article
      initial={{ opacity: 0, y: 24, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      whileHover={{ rotate: 0, y: -4 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 140, damping: 18, delay: index * 0.04 }}
      className="index-card group relative flex flex-col border border-border shadow-card"
    >
      <div className="flex h-[3.1rem] items-center justify-between gap-3 px-5">
        <span className="font-mono text-xs text-muted">{copy.number} {String(index + 1).padStart(2, "0")}</span>
        <span className="font-hand text-lg" style={{ color: accentTextVar[project.accent] }}>
          {copy.categories[project.category]}
          {project.status ? ` · ${project.status}` : ""}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-5 pt-2 pb-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-2xl leading-[1.6rem]">
            <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0">
              {project.title}
            </Link>
          </h3>
          <ArrowUpRight size={20} className="mt-0.5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" aria-hidden />
        </div>
        <p className="mt-[0.2rem] leading-[1.6rem]">{project.tagline}</p>

        <div className="relative mt-4 h-36 overflow-hidden border border-border">
          {isPhone ? (
            <div className="flex h-full items-end justify-center bg-surface-2 pt-4">
              <div className="w-24 translate-y-6 overflow-hidden rounded-t-[1.2rem] border-[5px] border-b-0 border-[#1c2135] transition-transform duration-300 group-hover:translate-y-3">
                <SmartMedia media={cover} sizes="96px" />
              </div>
            </div>
          ) : (
            <SmartMedia media={cover} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
          )}
        </div>

        <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted">
          {project.badges.slice(0, 3).map((b) => (
            <li key={b}>#{b.toLowerCase().replace(/\s+/g, "-")}</li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}
