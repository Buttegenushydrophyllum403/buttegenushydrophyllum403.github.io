"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { Boop } from "@/components/effects/Boop";
import { SmartMedia } from "@/components/media/SmartMedia";
import type { Project } from "@/content";
import { accentVar } from "@/lib/utils";

const CATEGORY_LABEL: Record<Project["category"], string> = { app: "App", ai: "AI", robotics: "Robotics" };

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false);
  const color = accentVar[project.accent];
  const cover = project.cover;
  const isPhone = cover.placeholder === "phone";

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 120, damping: 20, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-card"
    >
      <div className="relative h-52 overflow-hidden bg-surface-2">
        {isPhone ? (
          <div className="flex h-full items-end justify-center pt-5">
            <div className="w-28 translate-y-6 overflow-hidden rounded-t-[1.4rem] border-[6px] border-b-0 border-[#1c2135] transition-transform duration-300 group-hover:translate-y-2">
              <SmartMedia media={cover} sizes="112px" />
            </div>
          </div>
        ) : (
          <div className="h-full transition-transform duration-500 group-hover:scale-105">
            <SmartMedia media={cover} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
          </div>
        )}
        <span className="absolute top-3 left-3 rounded-full bg-bg/85 px-2.5 py-1 font-mono text-[0.68rem] tracking-widest uppercase backdrop-blur" style={{ color }}>
          {CATEGORY_LABEL[project.category]}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-bold">
            <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0">
              {project.title}
            </Link>
          </h3>
          <Boop active={hovered} rotation={45} timing={200} className="inline-block shrink-0 text-muted">
            <ArrowUpRight size={20} aria-hidden />
          </Boop>
        </div>
        <p className="text-[0.95rem] text-muted">{project.tagline}</p>
        <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {project.badges.slice(0, 3).map((b) => (
            <li key={b} className="rounded-full border px-2.5 py-0.5 text-xs font-medium" style={{ borderColor: color }}>
              {b}
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}
