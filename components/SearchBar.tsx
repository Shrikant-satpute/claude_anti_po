'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchBar() {
    const [isFocused, setIsFocused]         = useState(false);
    const [query, setQuery]                 = useState('');
    const [isLoading, setIsLoading]         = useState(false);
    const [showCard, setShowCard]           = useState(false);
    const [askedQuestion, setAskedQuestion] = useState('');

    const [displayed, setDisplayed]         = useState('');
    const rawBufferRef                      = useRef('');
    const displayedLenRef                   = useRef(0);
    const isStreamingRef                    = useRef(false);

    // Placeholder typewriter
    const [placeholder, setPlaceholder]     = useState('');
    const [phIndex, setPhIndex]             = useState(0);
    const [phDeleting, setPhDeleting]       = useState(false);

    const QUESTIONS = [
        'AI projects built?',
        'Years of .NET experience?',
        'Expertise in Agentic AI?',
        'Enterprise SaaS scaling?',
        'Building intelligent systems?',
    ];

    // ── Placeholder typewriter ──
    useEffect(() => {
        const full  = QUESTIONS[phIndex];
        const speed = phDeleting ? 38 : 75;
        const t = setTimeout(() => {
            if (!phDeleting && placeholder === full) { setTimeout(() => setPhDeleting(true), 2400); return; }
            if (phDeleting && placeholder === '')    { setPhDeleting(false); setPhIndex(i => (i + 1) % QUESTIONS.length); return; }
            setPlaceholder(p => phDeleting ? full.slice(0, p.length - 1) : full.slice(0, p.length + 1));
        }, speed);
        return () => clearTimeout(t);
    }, [placeholder, phDeleting, phIndex]);

    // ── Answer typewriter — one char every 14 ms ──
    useEffect(() => {
        const iv = setInterval(() => {
            const raw  = rawBufferRef.current;
            const curr = displayedLenRef.current;
            if (curr < raw.length) {
                displayedLenRef.current = curr + 1;
                setDisplayed(raw.slice(0, curr + 1));
            }
        }, 14);
        return () => clearInterval(iv);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim() || isLoading) return;

        rawBufferRef.current    = '';
        displayedLenRef.current = 0;
        setDisplayed('');
        setAskedQuestion(query);
        setShowCard(true);
        setIsLoading(true);
        isStreamingRef.current = true;

        try {
            const res = await fetch('/api/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: query }),
            });
            if (!res.ok || !res.body) throw new Error('Bad response');
            const reader  = res.body.getReader();
            const decoder = new TextDecoder();
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                rawBufferRef.current += decoder.decode(value, { stream: true });
            }
        } catch {
            rawBufferRef.current = 'Something went wrong. Please try again.';
        } finally {
            isStreamingRef.current = false;
            setIsLoading(false);
            setQuery('');
        }
    };

    const handleClose = () => {
        setShowCard(false);
        setDisplayed('');
        rawBufferRef.current    = '';
        displayedLenRef.current = 0;
    };

    const isCursorVisible = displayed.length < rawBufferRef.current.length || isLoading;

    // Render answer lines — bullets get a dot, rest is a paragraph
    const renderLines = (text: string) =>
        text.split('\n').map((line, i) => {
            const isBullet = /^[\s•\-]/.test(line) && line.trim().length > 1;
            if (isBullet) {
                const content = line.replace(/^[\s•\-]+/, '');
                return (
                    <div key={i} className="flex items-start gap-2.5 mt-2.5">
                        <span
                            className="flex-shrink-0 mt-[7px] w-[5px] h-[5px] rounded-full"
                            style={{ background: 'linear-gradient(135deg,#6C63FF,#ff781e)' }}
                        />
                        <span style={{ color: '#1a1a1a' }}>{content}</span>
                    </div>
                );
            }
            if (!line.trim()) return <div key={i} className="h-1.5" />;
            return (
                <p key={i} className="font-semibold leading-snug" style={{ color: '#000000' }}>
                    {line}
                </p>
            );
        });

    return (
        <div className="w-full max-w-[620px] flex flex-col gap-3">

            {/* ── Search bar ── */}
            <motion.form
                onSubmit={handleSubmit}
                className={`relative w-full h-16 rounded-full glass transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] ${
                    isFocused ? 'ring-2 ring-primary shadow-[0_0_30px_rgba(108,99,255,0.4)]' : ''
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.4, duration: 0.9 }}
            >
                <AnimatePresence>
                    {isFocused && (
                        <motion.div
                            className="absolute -inset-[2px] rounded-full bg-gradient-to-r from-primary via-secondary to-tertiary opacity-50 z-[-1]"
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                        />
                    )}
                </AnimatePresence>

                <div className="flex items-center w-full h-full px-6">
                    <Sparkles className="w-5 h-5 text-primary animate-pulse mr-4 flex-shrink-0" />
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={isFocused ? 'Ask anything about Shrikant…' : placeholder + '|'}
                        className="flex-1 bg-transparent border-none outline-none text-foreground placeholder-muted font-inter text-base"
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="ml-3 h-10 px-5 rounded-full font-semibold flex items-center gap-2 interactive disabled:opacity-60 transition-all duration-300 flex-shrink-0 text-sm"
                        style={{
                            background: 'linear-gradient(135deg,#ff781e,#ff5000)',
                            color: '#fff',
                            boxShadow: '0 0 18px rgba(255,120,30,0.7)',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 30px rgba(255,120,30,1)')}
                        onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 18px rgba(255,120,30,0.7)')}
                    >
                        {isLoading
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <><span>Ask</span><ArrowRight className="w-4 h-4" /></>
                        }
                    </button>
                </div>
            </motion.form>

            {/* ── Answer card — absolute so search bar never moves ── */}
            <AnimatePresence>
                {showCard && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="w-full rounded-2xl overflow-hidden"
                        style={{
                            background: '#ffffff',
                            border: '1px solid rgba(108,99,255,0.25)',
                            boxShadow: '0 4px 40px rgba(0,0,0,0.18), 0 0 0 1px rgba(108,99,255,0.08)',
                        }}
                    >
                        {/* Top gradient bar */}
                        <div
                            className="h-[3px] w-full"
                            style={{ background: 'linear-gradient(90deg,#6C63FF,#00F5FF 50%,#ff781e)' }}
                        />

                        {/* Question echo + close */}
                        <div className="flex items-center justify-between gap-3 px-5 pt-3 pb-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                                <Sparkles className="w-3 h-3 flex-shrink-0" style={{ color: '#6C63FF' }} />
                                <p className="text-[11px] truncate italic" style={{ color: 'rgba(0,0,0,0.35)' }}>
                                    {askedQuestion}
                                </p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all interactive"
                                style={{ background: 'rgba(0,0,0,0.06)', color: 'rgba(0,0,0,0.35)' }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.12)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.06)')}
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="mx-5 h-px" style={{ background: 'rgba(0,0,0,0.07)' }} />

                        {/* Answer body */}
                        <div className="px-5 py-4 text-sm leading-relaxed font-inter">
                            {!displayed && isLoading ? (
                                <div className="flex items-center gap-2.5">
                                    {[0, 1, 2].map(i => (
                                        <span
                                            key={i}
                                            className="w-1.5 h-1.5 rounded-full animate-bounce"
                                            style={{ background: '#6C63FF', animationDelay: `${i * 0.15}s` }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <>
                                    {renderLines(displayed)}
                                    {isCursorVisible && (
                                        <span
                                            className="inline-block w-[2px] h-[13px] ml-[2px] align-middle"
                                            style={{ background: '#6C63FF', borderRadius: 2, animation: 'blink 0.9s step-end infinite' }}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0; }
                }
            `}</style>
        </div>
    );
}
