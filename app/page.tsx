"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Sun, ArrowRight, ChevronDown } from 'lucide-react';
import { SITE_CONFIG, SOCIAL_LINKS, NAV_LINKS } from '@/lib/constants/site';
import { PROJECTS } from '@/lib/constants/projects';
import { motion, AnimatePresence } from 'framer-motion';
import { Senbonzakura } from '@/components/senbonzakura';

const FADE_UP = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

export default function Home() {
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  const toggleProject = (id: string) => {
    setExpandedProjectId(expandedProjectId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#a3a3a3] font-sans selection:bg-gray-800 relative overflow-hidden">
      <Senbonzakura />

      <div className="max-w-[640px] mx-auto px-6 pt-24 pb-24 relative z-10">
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>

          {/* SECTION 1: Avatar & Header */}
          <motion.div variants={FADE_UP} className="pb-8 border-b border-white/10 mb-8">
            <div className="relative w-12 h-12 mb-5">
              <Image
                src="https://avatars.githubusercontent.com/u/147980956?v=4"
                alt={SITE_CONFIG.name}
                fill
                className="rounded-full object-cover shadow-md border border-white/10"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mb-5">
              <h1 className="text-white text-[22px] font-semibold tracking-tight">
                {SITE_CONFIG.firstName} {SITE_CONFIG.lastName}
              </h1>
              <span className="text-gray-500 font-mono text-[13px]">
                {SITE_CONFIG.credentials.toLowerCase()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <nav className="flex gap-4 sm:gap-5 text-sm flex-wrap">
                {NAV_LINKS.map((link) => (
                  <Link key={link.name} href={link.href} className="hover:text-white transition-colors relative group">
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                ))}
              </nav>
              <button className="text-gray-500 hover:text-white transition-colors ml-4 flex-shrink-0 group">
                <Sun className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
              </button>
            </div>
          </motion.div>

          {/* SECTION 2: Stack & Tagline */}
          <motion.div variants={FADE_UP} className="pb-8 border-b border-white/10 mb-8 text-[15px] leading-[1.7]">
            <p>
              {SITE_CONFIG.tagline} I work mainly with <strong className="text-white font-medium">Next.js</strong>, <strong className="text-white font-medium">React</strong>, <strong className="text-white font-medium">C</strong>, <strong className="text-white font-medium">TypeScript</strong>, and <strong className="text-white font-medium">Linux</strong>.
            </p>
          </motion.div>

          {/* SECTION 3: Main Bio */}
          <motion.div variants={FADE_UP} className="pb-8 border-b border-white/10 mb-8 text-[15px] leading-[1.7]">
            <p>
              {SITE_CONFIG.bio}
            </p>
          </motion.div>

          {/* SECTION 4: Social Links & Contact */}
          <motion.div variants={FADE_UP} className="pb-8 border-b border-white/10 mb-8 text-[15px] leading-[1.7]">
            <p>
              Always open to interesting conversations about development, startups, and technology. <a href={SOCIAL_LINKS.email} className="text-white underline underline-offset-4 decoration-gray-600 hover:decoration-white hover:text-gray-100 transition-colors">Say hello</a> or follow me on <a href={SOCIAL_LINKS.github} target="_blank" className="text-white underline underline-offset-4 decoration-gray-600 hover:decoration-white hover:text-gray-100 transition-colors">GitHub</a>, <a href={SOCIAL_LINKS.twitter} target="_blank" className="text-white underline underline-offset-4 decoration-gray-600 hover:decoration-white hover:text-gray-100 transition-colors">Twitter</a>, or <a href={SOCIAL_LINKS.linkedin} target="_blank" className="text-white underline underline-offset-4 decoration-gray-600 hover:decoration-white hover:text-gray-100 transition-colors">LinkedIn</a>.
            </p>
          </motion.div>

          {/* SECTION 5: Work Status */}
          <motion.div variants={FADE_UP} className="pb-8 border-b border-white/10 mb-16 text-[15px] leading-[1.7]">
            <p>
              {SITE_CONFIG.openToWork ? "Currently open to new opportunities :)" : "At the end of the day I get the shit done :)"}
            </p>
          </motion.div>

          {/* SECTION 6: Projects Section with Expandable Content */}
          <motion.div variants={FADE_UP} className="pb-16 border-b border-white/10 mb-16">
            <h2 className="text-[12px] font-medium tracking-wider text-gray-500 mb-6 uppercase">
              Projects
            </h2>
            <div className="flex flex-col gap-3">
              {PROJECTS.map((project, idx) => {
                const hasImage = project.images && project.images.length > 0;
                const isExpanded = expandedProjectId === project.id;

                const firstLetter = project.title.charAt(0).toUpperCase();
                const colors = [
                  { bg: '#0f2e22', text: '#27c93f' },
                  { bg: '#2d1b1a', text: '#ff5f56' },
                  { bg: '#16291a', text: '#27c93f' },
                  { bg: '#231e0f', text: '#ffbd2e' },
                  { bg: '#1f1f1f', text: '#ffffff' }
                ];
                const color = colors[idx % colors.length];

                return (
                  <div key={project.id} className="flex flex-col">
                    <motion.div
                      variants={FADE_UP}
                      onClick={() => toggleProject(project.id)}
                      className="group flex items-center p-3 sm:p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 hover:border-white/10 hover:shadow-xl hover:shadow-black/40 cursor-pointer"
                    >
                      {/* Thumbnail Left Side */}
                      <div className="flex-shrink-0 w-24 h-16 sm:w-32 sm:h-20 rounded-xl overflow-hidden relative bg-black/50 border border-white/5">
                        {hasImage ? (
                          <Image
                            src={project.images![0]}
                            alt={project.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-500" style={{ backgroundColor: color.bg, color: color.text }}>
                            {project.id === 'cli-agent' ? 'C' : firstLetter}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
                      </div>

                      {/* Text Right Side */}
                      <div className="ml-4 sm:ml-5 flex flex-col justify-center overflow-hidden w-full">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-gray-200 font-medium text-[15px] sm:text-base group-hover:text-white transition-colors truncate">
                            {project.title}
                          </h3>
                          <ChevronDown className={`w-4 h-4 text-gray-500 group-hover:text-white transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                        <p className="text-gray-500 text-[13px] sm:text-sm line-clamp-2 leading-relaxed group-hover:text-gray-400 transition-colors pr-2">
                          {project.description}
                        </p>
                      </div>
                    </motion.div>

                    {/* Expandable Section with Media */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 mt-2 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col gap-4">
                            {/* Optional Project Video (if provided in project data, otherwise falls back or skips) */}
                            {project.video && (
                              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-white/10">
                                <video src={project.video} controls autoPlay muted loop className="w-full h-full object-cover" />
                              </div>
                            )}

                            {/* Project Images Gallery */}
                            {hasImage && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {project.images!.map((imgUrl, imgIdx) => (
                                  <div key={imgIdx} className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/40">
                                    <Image src={imgUrl} alt={`${project.title} preview ${imgIdx + 1}`} fill className="object-cover" />
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Action Link */}
                            {(project.link || project.github) && (
                              <div className="flex justify-end pt-2">
                                <a
                                  href={project.link || project.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-xs font-medium text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-colors"
                                >
                                  Visit Project <ArrowRight className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* SECTION 7: Separator Dots Bottom */}
          <motion.div variants={FADE_UP} className="flex justify-center gap-[6px] mb-8">
            <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
            <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
            <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
          </motion.div>

          {/* SECTION 8: Copyright */}
          <motion.div variants={FADE_UP} className="text-center text-xs text-gray-600">
            {SITE_CONFIG.copyright}
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
