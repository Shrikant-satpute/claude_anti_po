'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
    onAnswerStart?:    (question: string) => void;
    onAnswerComplete?: (answer: string, question: string) => void;
}

export default function SearchBar({ onAnswerStart, onAnswerComplete }: SearchBarProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [query, setQuery]         = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Placeholder typewriter
    const [placeholder, setPlaceholder] = useState('');
    const [phIndex, setPhIndex]         = useState(0);
    const [phDeleting, setPhDeleting]   = useState(false);

    const QUESTIONS = [
        'AI projects built?',
        'Years of .NET experience?',
        'Expertise in Agentic AI?',
        'Enterprise SaaS scaling?',
        'Building intelligent systems?',
    ];

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim() || isLoading) return;

        const currentQuery = query;
        setIsLoading(true);
        setQuery('');
        onAnswerStart?.(currentQuery);

        try {
            const res = await fetch('/api/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: currentQuery }),
            });
            if (!res.ok || !res.body) throw new Error('Bad response');

            const reader  = res.body.getReader();
            const decoder = new TextDecoder();
            let fullAnswer = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                fullAnswer += decoder.decode(value, { stream: true });
            }
            onAnswerComplete?.(fullAnswer, currentQuery);
        } catch {
            onAnswerComplete?.('Something went wrong. Please try again.', currentQuery);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[620px]">
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
        </div>
    );
}
