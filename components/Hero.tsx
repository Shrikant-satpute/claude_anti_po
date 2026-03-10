'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import dynamic from 'next/dynamic';
import SearchBar from './SearchBar';

const HeroCanvas          = dynamic(() => import('./HeroCanvas'),          { ssr: false });
const HeroPerspectiveGrid = dynamic(() => import('./HeroPerspectiveGrid'), { ssr: false });
const RunningCharacter    = dynamic(() => import('./RunningCharacter'),    { ssr: false });

export default function Hero() {


    return (
        <section className="relative w-full min-h-screen min-h-[800px] flex flex-col overflow-x-clip">
            {/* 3D Canvas Background */}
            <HeroCanvas />

            {/* Perspective grid — bottom of hero, draws in on load, vanishes on scroll */}
            <HeroPerspectiveGrid />

            {/* Main Content Overlay — pt anchors content at fixed vertical position so it never jumps */}
            <div className="relative z-10 flex flex-col items-center w-full px-4 text-center pt-[max(80px,calc(40vh-180px))] pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 1.0, ease: 'easeOut' }}
                >
                    {/* w-fit shrinks to the h1 text width — RunningCharacter uses this to know run distance */}
                    <div className="relative w-fit mx-auto">
                        <RunningCharacter />
                        <h1 className="text-5xl md:text-7xl font-bold font-space tracking-tight mb-4">
                            <span className="text-foreground">SHRIKANT </span>
                            <span style={{ color: '#ff781e' }}>SATPUTE</span>
                        </h1>
                    </div>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.9, duration: 0.9 }}
                    className="text-lg md:text-xl text-muted font-inter max-w-2xl mb-12 mt-4"
                >
                    Deeply passionate about AI-driven coding, with a profound love for building intelligent systems and an unyielding enthusiasm for the future of Artificial Intelligence.
                </motion.p>

                {/* Custom Search Bar */}
                <SearchBar />

                {/* Badges/Pills */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.8, duration: 0.9 }}
                    className="flex flex-wrap gap-4 mt-12 justify-center"
                >
                    {['2+ Years Experience', 'Enterprise SaaS', 'AI & Cloud'].map((badge, i) => (
                        <div
                            key={i}
                            className="px-6 py-2 rounded-full glass border border-primary/20 text-sm font-medium text-foreground hover:border-primary transition-colors interactive shadow-sm hover:shadow-md"
                        >
                            {badge}
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.4, duration: 1.0 }}
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                >
                    <ChevronDown className="w-8 h-8 text-primary opacity-60" />
                </motion.div>
            </motion.div>
        </section>
    );
}
