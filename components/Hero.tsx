'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import SearchBar from './SearchBar';
import { SplineScene } from './ui/SplineScene';
import { HeroNameParticle } from './ui/hero-name-particle';
import { AnswerParticle } from './ui/answer-particle';

const HeroCanvas          = dynamic(() => import('./HeroCanvas'),          { ssr: false });
const HeroPerspectiveGrid = dynamic(() => import('./HeroPerspectiveGrid'), { ssr: false });
const RunningCharacter    = dynamic(() => import('./RunningCharacter'),    { ssr: false });

export default function Hero() {
    const [cardAnswer, setCardAnswer]     = useState('');
    const [cardQuestion, setCardQuestion] = useState('');
    const [isAnswering, setIsAnswering]   = useState(false);
    const [showCard, setShowCard]         = useState(false);
    const [robotVisible, setRobotVisible] = useState(false);

    const handleAnswerStart = (question: string) => {
        setCardQuestion(question);
        setCardAnswer('');
        setIsAnswering(true);
        setShowCard(true);
    };

    const handleAnswerComplete = (answer: string, question: string) => {
        setCardAnswer(answer);
        setCardQuestion(question);
        setIsAnswering(false);
    };

    const handleClose = () => {
        setShowCard(false);
        setCardAnswer('');
        setCardQuestion('');
    };

    return (
        <section className="relative w-full min-h-screen min-h-[800px] flex flex-col overflow-x-clip">
            {/* 3D Canvas Background */}
            <HeroCanvas />

            {/* Perspective grid — bottom of hero, draws in on load, vanishes on scroll */}
            <HeroPerspectiveGrid />

            {/* Main Content — two columns on desktop, stacked on mobile */}
            <div className="relative z-10 flex flex-col md:flex-row items-center w-full h-full min-h-screen px-6 md:px-12 lg:px-16 gap-0">

                {/* LEFT — Text content */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left w-full md:flex-1 pt-28 md:pt-0 pb-8 md:pb-0">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 1.0, ease: 'easeOut' }}
                    >
                        {/* w-fit shrinks to the h1 text width — RunningCharacter uses this to know run distance */}
                        <div className="relative w-fit mx-auto md:mx-0">
                            <RunningCharacter />
                            {/* h1 kept invisible for layout: gives the parent correct width for RunningCharacter */}
                            <h1
                                className="text-5xl md:text-6xl lg:text-7xl font-bold font-space tracking-tight invisible min-h-[56px] md:min-h-[84px] lg:min-h-[96px]"
                                style={{ display: 'flex', alignItems: 'center' }}
                                aria-hidden="true"
                            >
                                <span className="text-foreground">SHRIKANT </span>
                                <span style={{ color: '#ff781e' }}>SATPUTE</span>
                            </h1>
                            {/* Particle canvas — top-left anchored, self-sizes via canvas.style in useEffect */}
                            <div className="absolute top-0 left-0">
                                <HeroNameParticle />
                            </div>
                        </div>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.9, duration: 0.9 }}
                        className="text-lg md:text-xl text-muted font-inter max-w-xl mb-10 mt-4"
                    >
                        Deeply passionate about AI-driven coding, with a profound love for building intelligent systems and an unyielding enthusiasm for the future of Artificial Intelligence.
                    </motion.p>

                    {/* Custom Search Bar */}
                    <SearchBar
                        onAnswerStart={handleAnswerStart}
                        onAnswerComplete={handleAnswerComplete}
                    />

                    {/* Badges/Pills — hidden on mobile when answer card is open */}
                    <div className={showCard ? 'hidden md:block' : 'block'}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 2.8, duration: 0.9 }}
                            className="flex flex-wrap gap-4 mt-10 justify-center md:justify-start"
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
                </div>

                {/* RIGHT — Robot with card base */}
                <div className="relative w-full h-[420px] sm:h-[540px] md:flex-[1.4] md:h-screen md:self-stretch">
                    {/* Spline Robot — hidden until onLoad fires, then fades in (avoids Spline's built-in scale animation) */}
                    <div
                        className="absolute inset-0 w-full h-full transition-opacity duration-1000"
                        style={{ opacity: robotVisible ? 1 : 0 }}
                    >
                        <SplineScene
                            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                            className="absolute inset-0 w-full h-full"
                            onLoad={() => setRobotVisible(true)}
                        />
                    </div>

                    {/* Card base — appears after robot loads, taller on mobile when answer open */}
                    <div
                        className={`
                            absolute bottom-0 left-2 right-2 sm:left-4 sm:right-4 md:left-6 md:right-6
                            ${showCard ? 'h-[78%]' : 'h-[55%]'} md:h-[42%]
                            z-20
                            rounded-t-[2rem]
                            bg-gradient-to-b from-transparent via-white/80 to-[#f1f5f9]/95
                            backdrop-blur-sm
                            border-t border-l border-r border-white/90
                            shadow-[0_-8px_40px_rgba(108,99,255,0.12),0_-1px_0_rgba(255,255,255,0.8)]
                            overflow-hidden
                            transition-all duration-700
                        `}
                        style={{
                            opacity: robotVisible ? 1 : 0,
                            transitionProperty: 'opacity, height',
                            transitionDuration: '700ms',
                            transitionDelay: robotVisible ? '4000ms' : '0ms',
                        }}
                    >
                        {/* Bottom fade-out overlay — softens the sharp glass edge */}
                        <div
                            className="absolute bottom-0 left-0 right-0 h-14 z-10 pointer-events-none rounded-b-[2rem]"
                            style={{ background: 'linear-gradient(to bottom, transparent, rgba(241,245,249,0.97))' }}
                        />
                        <AnimatePresence>
                            {showCard && (
                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 12 }}
                                    transition={{ duration: 0.3, ease: 'easeOut' }}
                                    className="absolute inset-x-0 bottom-0 flex flex-col px-4 pb-3 pt-4"
                                    style={{ top: 0 }}
                                >
                                    {/* Question + close */}
                                    <div className="flex items-center justify-between mb-[5px] flex-shrink-0">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <Sparkles className="w-3 h-3 flex-shrink-0" style={{ color: '#6C63FF' }} />
                                            <p
                                                className="text-[11px] italic truncate"
                                                style={{
                                                    fontFamily: "'Space Grotesk', Arial, sans-serif",
                                                    fontWeight: 600,
                                                    color: 'rgba(0,0,0,0.5)',
                                                }}
                                            >
                                                {cardQuestion}
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleClose}
                                            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ml-2 transition-colors"
                                            style={{ background: 'rgba(0,0,0,0.07)', color: 'rgba(0,0,0,0.4)' }}
                                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.15)')}
                                            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.07)')}
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>

                                    {/* Thin gradient divider */}
                                    <div
                                        className="h-px mb-[6px] flex-shrink-0"
                                        style={{ background: 'linear-gradient(90deg,#6C63FF50,#00000015,#ff781e50)' }}
                                    />

                                    {/* Answer — scrollable when content overflows */}
                                    <div className="flex-1 overflow-y-auto relative" style={{ minHeight: 80 }}>
                                        {isAnswering ? (
                                            <div className="flex items-center gap-[6px] pt-2 pl-1">
                                                {[0, 1, 2].map(i => (
                                                    <span
                                                        key={i}
                                                        className="inline-block w-[7px] h-[7px] rounded-full"
                                                        style={{
                                                            background: '#111',
                                                            animation: `answerDot 1.1s ease-in-out ${i * 0.18}s infinite`,
                                                        }}
                                                    />
                                                ))}
                                                <style>{`
                                                    @keyframes answerDot {
                                                        0%,80%,100%{transform:scale(1);opacity:.3}
                                                        40%{transform:scale(1.5);opacity:1}
                                                    }
                                                `}</style>
                                            </div>
                                        ) : (
                                            <AnswerParticle text={cardAnswer} />
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

        </section>
    );
}
