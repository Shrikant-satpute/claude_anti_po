'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { PROJECTS } from '@/lib/constants';
import { Layers } from 'lucide-react';
import { FloatingPaths } from '@/components/ui/background-paths';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Projects() {
    const sectionRef         = useRef<HTMLElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mm = gsap.matchMedia();

        mm.add('(min-width: 1024px)', () => {
            const section         = sectionRef.current;
            const scrollContainer = scrollContainerRef.current;
            if (!section || !scrollContainer) return;

            const totalWidth = scrollContainer.scrollWidth - window.innerWidth;

            const tween = gsap.to(scrollContainer, {
                x: -totalWidth,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    pin: true,
                    scrub: 1,
                    end: `+=${totalWidth}`,
                    anticipatePin: 1,
                },
            });

            return () => { tween.kill(); };
        });

        return () => mm.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden py-24 lg:py-0 lg:h-screen flex flex-col justify-center bg-white dark:bg-neutral-950"
        >
            {/* Floating paths background */}
            <div className="absolute inset-0 z-0">
                <FloatingPaths position={1} />
                <FloatingPaths position={-1} />
            </div>

            {/* Header */}
            <div className="container mx-auto px-6 mb-12 lg:mb-20 relative z-10">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-space" style={{ color: '#0a0a0a' }}>
                    Featured{' '}
                    <span style={{ color: '#1a1a1a', textDecoration: 'underline', textDecorationColor: '#6C63FF', textUnderlineOffset: '6px' }}>
                        Projects
                    </span>
                </h2>
            </div>

            {/* Horizontal scroll container */}
            <div className="lg:w-full overflow-hidden relative z-10">
                <div
                    ref={scrollContainerRef}
                    className="flex flex-col lg:flex-row gap-8 lg:gap-10 px-6 lg:px-[10vw] flex-nowrap"
                >
                    {PROJECTS.map((project, index) => (
                        <div
                            key={index}
                            className="w-full lg:w-[480px] flex-shrink-0 h-auto lg:h-[62vh] rounded-3xl relative overflow-hidden group flex flex-col interactive"
                            style={{
                                background: '#ffffff',
                                boxShadow: '0 12px 48px rgba(0,0,0,0.22)',
                                border: '2px solid rgba(0,0,0,0.08)',
                            }}
                        >
                            {/* Top gradient accent bar */}
                            <div className={`h-2 w-full bg-gradient-to-r ${project.gradient} flex-shrink-0`} />

                            <div className="flex flex-col h-full p-8 lg:p-9">

                                {/* Icon + Role badge */}
                                <div className="flex items-center justify-between mb-6">
                                    <div
                                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${project.gradient} flex items-center justify-center p-2.5`}
                                        style={{ boxShadow: '0 4px 14px rgba(0,0,0,0.18)' }}
                                    >
                                        <Layers className="w-full h-full text-white" />
                                    </div>
                                    <span
                                        className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
                                        style={{
                                            background: '#000000',
                                            color: '#f5f500',
                                        }}
                                    >
                                        {project.role}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3
                                    className="text-2xl lg:text-[1.7rem] font-bold font-space mb-2 leading-snug"
                                    style={{ color: '#000000' }}
                                >
                                    {project.title}
                                </h3>

                                {/* Stack */}
                                <p
                                    className="text-xs font-bold mb-5 tracking-widest uppercase"
                                    style={{ color: '#000000', opacity: 0.45 }}
                                >
                                    {project.stack}
                                </p>

                                {/* Divider */}
                                <div className="h-px mb-5" style={{ background: 'rgba(0,0,0,0.1)' }} />

                                {/* Highlights */}
                                <div className="flex-grow">
                                    <h4
                                        className="text-[10px] uppercase tracking-widest mb-3 font-bold"
                                        style={{ color: '#000000', opacity: 0.4 }}
                                    >
                                        Highlights
                                    </h4>
                                    <ul className="space-y-2.5">
                                        {project.highlights.map((highlight, i) => (
                                            <li
                                                key={i}
                                                className="text-sm flex items-start gap-3 leading-relaxed font-medium"
                                                style={{ color: '#000000' }}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-gradient-to-r ${project.gradient}`}
                                                />
                                                {highlight}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* View Details button */}
                                <div
                                    className="mt-8 lg:mt-auto pt-5 lg:opacity-0 lg:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                                    style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }}
                                >
                                    <button
                                        className={`w-full py-3.5 rounded-xl bg-gradient-to-r ${project.gradient} text-white font-bold text-sm tracking-wide relative overflow-hidden group/btn`}
                                    >
                                        <span className="relative z-10">View Details</span>
                                        <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
