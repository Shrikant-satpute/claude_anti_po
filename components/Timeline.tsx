'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { EXPERIENCE_TIMELINE } from '@/lib/constants';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const ACCENTS = ['#6C63FF', '#ff781e'] as const;
const GLOWS   = ['rgba(108,99,255,0.22)', 'rgba(255,120,30,0.18)'] as const;

// Chronological order — Trainee first
const items = [...EXPERIENCE_TIMELINE].reverse();

export default function Timeline() {
    const sectionRef       = useRef<HTMLElement>(null);
    const containerRef     = useRef<HTMLDivElement>(null);
    const railWrapRef      = useRef<HTMLDivElement>(null);   // full-height 3px track
    const lineRef          = useRef<HTMLDivElement>(null);   // growing gradient rail
    const trainRef         = useRef<HTMLDivElement>(null);   // traveling light
    const cardsRef         = useRef<(HTMLDivElement | null)[]>([]);
    const nodesRef         = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {

            // ── Rail grows downward scrubbed to scroll ─────────────────────
            gsap.fromTo(
                lineRef.current,
                { height: '0%' },
                {
                    height: '100%',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 55%',
                        end: 'bottom 68%',
                        scrub: 0.7,
                    },
                }
            );

            // ── Train rides the rail continuously ─────────────────────────
            const railH = railWrapRef.current?.offsetHeight ?? 1200;
            gsap.fromTo(
                trainRef.current,
                { top: -140 },
                {
                    top: railH + 20,
                    ease: 'none',
                    duration: 2.6,
                    repeat: -1,
                }
            );

            // ── Cards slide in from opposite sides ────────────────────────
            cardsRef.current.forEach((card, i) => {
                if (!card) return;
                gsap.fromTo(
                    card,
                    { autoAlpha: 0, x: i % 2 === 0 ? -72 : 72, y: 20 },
                    {
                        autoAlpha: 1, x: 0, y: 0,
                        duration: 0.9,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 83%',
                            toggleActions: 'play none none reverse',
                        },
                    }
                );
            });

            // ── Nodes pop in ──────────────────────────────────────────────
            nodesRef.current.forEach((node) => {
                if (!node) return;
                gsap.fromTo(
                    node,
                    { scale: 0, autoAlpha: 0 },
                    {
                        scale: 1, autoAlpha: 1,
                        duration: 0.55,
                        ease: 'back.out(2.5)',
                        scrollTrigger: {
                            trigger: node,
                            start: 'top 83%',
                            toggleActions: 'play none none reverse',
                        },
                    }
                );
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            style={{ background: '#0c0814' }}
            className="py-32 relative overflow-hidden"
        >
            {/* ── Dot grid (same as Skills section) ─────────────────────── */}
            <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                    backgroundImage: 'radial-gradient(rgba(255,255,255,0.065) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                }}
            />

            {/* ── Ambient colour blobs ──────────────────────────────────── */}
            <div
                className="absolute top-1/4 -left-32 w-[640px] h-[640px] rounded-full blur-[180px] pointer-events-none"
                style={{ background: 'rgba(108,99,255,0.07)' }}
            />
            <div
                className="absolute bottom-1/4 -right-32 w-[640px] h-[640px] rounded-full blur-[180px] pointer-events-none"
                style={{ background: 'rgba(255,120,30,0.06)' }}
            />

            <div ref={containerRef} className="container mx-auto px-6 max-w-5xl relative z-10">

                {/* ── Section header ──────────────────────────────────────── */}
                <div className="text-center mb-24">
                    <h2 className="text-4xl md:text-5xl font-bold font-space text-white mb-4">
                        Experience{' '}
                        <span style={{ color: '#ff781e' }}>Timeline</span>
                    </h2>
                    <div
                        className="w-24 h-1 mx-auto rounded-full"
                        style={{ background: 'linear-gradient(90deg, #6C63FF, #ff781e)' }}
                    />
                </div>

                {/* ── Timeline body ────────────────────────────────────────── */}
                <div className="relative">

                    {/* Center track */}
                    <div
                        ref={railWrapRef}
                        className="hidden md:block absolute left-1/2 top-6 bottom-6 -translate-x-1/2 rounded-full"
                        style={{ width: '3px', background: 'rgba(255,255,255,0.05)' }}
                    >
                        {/* Glowing gradient rail — grows with scroll */}
                        <div
                            ref={lineRef}
                            className="absolute top-0 left-0 w-full rounded-full overflow-hidden"
                            style={{
                                height: '0%',
                                background: 'linear-gradient(to bottom, #6C63FF 0%, #9D4EDD 45%, #ff781e 100%)',
                                boxShadow: '0 0 10px rgba(108,99,255,0.9), 0 0 24px rgba(108,99,255,0.45)',
                            }}
                        >
                            {/* Train of light */}
                            <div
                                ref={trainRef}
                                className="absolute left-0 w-full"
                                style={{
                                    top: -140,
                                    height: 140,
                                    background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.95) 45%, rgba(255,255,255,0.95) 55%, transparent 100%)',
                                    filter: 'blur(1.5px)',
                                }}
                            />
                        </div>
                    </div>

                    {/* ── Entries ───────────────────────────────────────────── */}
                    <div className="flex flex-col gap-16 md:gap-24">
                        {items.map((item, index) => {
                            const isLeft = index % 2 === 0;
                            const accent = ACCENTS[index % 2];
                            const glow   = GLOWS[index % 2];

                            return (
                                <div
                                    key={index}
                                    className="flex flex-col md:flex-row items-stretch gap-6 md:gap-0"
                                >
                                    {/* Left slot */}
                                    <div className="w-full md:w-[45%] md:pr-10 flex items-start">
                                        {isLeft && (
                                            <div
                                                ref={el => { cardsRef.current[index] = el; }}
                                                className="w-full"
                                            >
                                                <TimelineCard item={item} accent={accent} glow={glow} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Centre node */}
                                    <div className="hidden md:flex w-[10%] flex-shrink-0 justify-center items-start pt-8 relative z-20">
                                        <div
                                            ref={el => { nodesRef.current[index] = el; }}
                                            className="relative flex items-center justify-center"
                                            style={{ width: 52, height: 52 }}
                                        >
                                            {/* Outer ping ring */}
                                            <span
                                                className="absolute inset-0 rounded-full animate-ping"
                                                style={{
                                                    background: `${accent}20`,
                                                    animationDuration: '2.4s',
                                                }}
                                            />
                                            {/* Border ring with glow */}
                                            <span
                                                className="absolute inset-0 rounded-full"
                                                style={{
                                                    border: `2px solid ${accent}`,
                                                    boxShadow: `0 0 16px ${accent}CC, 0 0 32px ${accent}44`,
                                                }}
                                            />
                                            {/* Inner glowing dot */}
                                            <span
                                                className="rounded-full"
                                                style={{
                                                    width: 20,
                                                    height: 20,
                                                    background: `radial-gradient(circle at 35% 35%, ${accent}FF, ${accent}88)`,
                                                    boxShadow: `0 0 14px ${accent}, 0 0 28px ${accent}88`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Right slot */}
                                    <div className="w-full md:w-[45%] md:pl-10 flex items-start">
                                        {!isLeft && (
                                            <div
                                                ref={el => { cardsRef.current[index] = el; }}
                                                className="w-full"
                                            >
                                                <TimelineCard item={item} accent={accent} glow={glow} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ── Card ─────────────────────────────────────────────────────────────────── */
function TimelineCard({
    item,
    accent,
    glow,
}: {
    item: (typeof EXPERIENCE_TIMELINE)[0];
    accent: string;
    glow: string;
}) {
    return (
        <div
            className="relative rounded-2xl overflow-hidden group"
            style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.015) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(18px)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.55)',
            }}
        >
            {/* Top accent bar */}
            <div
                style={{
                    height: '3px',
                    background: `linear-gradient(90deg, ${accent} 0%, ${accent}55 55%, transparent 100%)`,
                }}
            />

            {/* Hover inner glow */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 20% 50%, ${glow}, transparent 68%)` }}
            />

            {/* Bottom-right corner glow */}
            <div
                className="absolute bottom-0 right-0 w-48 h-48 pointer-events-none"
                style={{ background: `radial-gradient(circle at 100% 100%, ${accent}12, transparent 65%)` }}
            />

            <div className="relative z-10 p-8">

                {/* Role */}
                <h3
                    className="text-2xl md:text-3xl font-bold font-space text-white mb-2 leading-snug"
                >
                    {item.role}
                </h3>

                {/* Company */}
                <p className="text-sm font-semibold mb-1.5" style={{ color: accent }}>
                    {item.company}
                </p>

                {/* Period · Location */}
                <p
                    className="text-xs tracking-widest mb-6"
                    style={{ color: 'rgba(255,255,255,0.30)' }}
                >
                    {item.period}&nbsp;&nbsp;·&nbsp;&nbsp;{item.location}
                </p>

                {/* Divider */}
                <div
                    className="mb-6 h-px"
                    style={{ background: `linear-gradient(90deg, ${accent}50, transparent)` }}
                />

                {/* Bullets */}
                <ul className="space-y-3 mb-7">
                    {item.bullets.map((bullet, i) => (
                        <li
                            key={i}
                            className="flex items-start gap-3 text-sm leading-relaxed"
                            style={{ color: 'rgba(255,255,255,0.55)' }}
                        >
                            <span
                                className="flex-shrink-0 mt-[3px] text-xs"
                                style={{ color: accent }}
                            >
                                ▹
                            </span>
                            {bullet}
                        </li>
                    ))}
                </ul>

                {/* Tech chips */}
                <div className="flex flex-wrap gap-2">
                    {item.tech.map((tech, i) => (
                        <span
                            key={i}
                            className="px-3 py-1 rounded-full text-xs font-medium tracking-wide"
                            style={{
                                background: `${accent}14`,
                                border: `1px solid ${accent}38`,
                                color: accent,
                                boxShadow: `0 0 8px ${accent}20`,
                            }}
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
