'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Linkedin, MapPin, Briefcase, Award, Layers, Code2 } from 'lucide-react';
import dynamic from 'next/dynamic';

const AboutPerspectiveGrid = dynamic(() => import('./AboutPerspectiveGrid'), { ssr: false });

function AnimatedCounter({ from, to, duration = 2 }: { from: number; to: number; duration?: number }) {
    const [count, setCount] = useState(from);
    const nodeRef = useRef<HTMLSpanElement>(null);
    const inView = useInView(nodeRef, { once: true, margin: '-50px' });

    useEffect(() => {
        if (inView) {
            let startTime: number;
            const step = (timestamp: number) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
                setCount(Math.floor(progress * (to - from) + from));
                if (progress < 1) window.requestAnimationFrame(step);
            };
            window.requestAnimationFrame(step);
        }
    }, [inView, from, to, duration]);

    return <span ref={nodeRef}>{count}</span>;
}

const STATS = [
    { value: 2,  suffix: '+', label: 'Years Experience',      Icon: Briefcase, color: '#6C63FF' },
    { value: 6,  suffix: '+', label: 'Projects Delivered',    Icon: Award,     color: '#0088cc' },
    { value: 3,  suffix: '+', label: 'Enterprise Modules',    Icon: Layers,    color: '#9D4EDD' },
    { value: 10, suffix: '+', label: 'Technologies Mastered', Icon: Code2,     color: '#ff781e' },
];

export default function About() {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, amount: 0.15 });

    return (
        <section id="about" className="py-20 relative overflow-hidden">
            <AboutPerspectiveGrid />
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px] pointer-events-none bg-[#6C63FF]/5" />

            <div className="container mx-auto px-6 max-w-6xl relative z-10" ref={containerRef}>

                {/* Section heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-bold font-space text-foreground mb-8"
                >
                    About <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C63FF] to-[#0088cc]">Me</span>
                </motion.h2>

                {/* ── Bento Grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* Identity tile — col 1, spans 2 rows */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="md:row-span-2 glass-card p-7 flex flex-col items-center text-center gap-5"
                    >
                        {/* Avatar */}
                        <div
                            className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-[0_0_28px_rgba(108,99,255,0.3)]"
                            style={{ background: 'linear-gradient(135deg, #6C63FF, #9D4EDD)' }}
                        >
                            <span className="text-3xl font-bold font-space text-white">SS</span>
                        </div>

                        {/* Name · role · location */}
                        <div className="space-y-1.5">
                            <h3 className="text-xl font-bold text-foreground font-space">Shrikant Satpute</h3>
                            <p className="text-sm font-semibold" style={{ color: '#6C63FF' }}>Full-Stack Software Engineer</p>
                            <div className="flex items-center justify-center gap-1.5 text-sm text-muted">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>Ahmedabad, India 🇮🇳</span>
                            </div>
                        </div>

                        <div className="w-full h-px bg-foreground/10" />

                        {/* Contact links */}
                        <div className="flex flex-col gap-2.5 w-full">
                            <a
                                href="mailto:satpute.connect@gmail.com"
                                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl glass border border-foreground/10 hover:border-[#6C63FF]/40 hover:bg-[#6C63FF]/5 transition-all text-foreground text-sm interactive"
                            >
                                <Mail className="w-4 h-4" style={{ color: '#6C63FF' }} />
                                satpute.connect@gmail.com
                            </a>
                            <a
                                href="https://linkedin.com/in/shrikant"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl glass border border-foreground/10 hover:border-[#0A66C2]/40 hover:bg-[#0A66C2]/5 transition-all text-foreground text-sm interactive"
                            >
                                <Linkedin className="w-4 h-4" style={{ color: '#0A66C2' }} />
                                LinkedIn Profile
                            </a>
                        </div>

                        {/* Status badge */}
                        <div
                            className="mt-auto flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium"
                            style={{ background: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.25)', color: '#16a34a' }}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            Available for opportunities
                        </div>
                    </motion.div>

                    {/* 4 Stat tiles — col 2 & 3, rows 1 & 2 */}
                    {STATS.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.18 + i * 0.09 }}
                            className="glass-card p-6 flex flex-col justify-between gap-3 hover:shadow-lg transition-shadow duration-300"
                        >
                            <stat.Icon className="w-5 h-5 opacity-40" style={{ color: stat.color }} />
                            <div className="text-4xl font-bold font-space flex items-end gap-0.5" style={{ color: stat.color }}>
                                <AnimatedCounter from={0} to={stat.value} />
                                <span>{stat.suffix}</span>
                            </div>
                            <p className="text-xs uppercase tracking-wider font-medium text-muted">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}

                    {/* Bio tile — full width row 3 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.55 }}
                        className="md:col-span-3 glass-card p-8"
                    >
                        <p className="text-base md:text-lg leading-relaxed font-inter text-muted">
                            I am a results-driven backend and full-stack engineer passionate about building scalable microservices
                            and AI-integrated applications. With a strong foundation in the .NET ecosystem and modern frontend
                            frameworks, I deliver robust enterprise SaaS platforms that simplify complex business workflows.
                        </p>
                    </motion.div>

                </div>
            </div>

        </section>
    );
}
