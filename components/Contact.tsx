'use client';

import { motion } from 'framer-motion';
import { Mail, Linkedin, Phone } from 'lucide-react';

export default function Contact() {
    return (
        <footer className="relative py-24 overflow-hidden border-t border-foreground/20">
            {/* Glowing grid background pattern */}
            <div
                className="absolute inset-0 z-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(rgba(108, 99, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(108, 99, 255, 0.5) 1px, transparent 1px)',
                    backgroundSize: '80px 80px'
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-0" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-7xl font-bold font-space text-foreground mb-6"
                    >
                        Let&apos;s Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-glow-primary">Something Great</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted font-medium mb-16"
                    >
                        Open to exciting opportunities and collaborations
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col md:flex-row items-center justify-center gap-6 mb-24"
                    >
                        <a
                            href="mailto:satpute.connect@gmail.com"
                            className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-full glass border border-primary/30 hover:bg-primary/10 hover:border-primary transition-all text-foreground font-medium interactive shadow-[0_0_15px_rgba(108,99,255,0.2)] hover:shadow-[0_0_25px_rgba(108,99,255,0.5)] group"
                        >
                            <Mail className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                            satpute.connect@gmail.com
                        </a>

                        <a
                            href="https://linkedin.com/in/shrikant"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-full glass border border-[#0A66C2]/30 hover:bg-[#0A66C2]/10 hover:border-[#0A66C2] transition-all text-foreground font-medium interactive shadow-[0_0_15px_rgba(10,102,194,0.2)] hover:shadow-[0_0_25px_rgba(10,102,194,0.5)] group"
                        >
                            <Linkedin className="w-5 h-5 text-[#0A66C2] group-hover:scale-110 transition-transform" />
                            linkedin.com/in/shrikant
                        </a>

                        <a
                            href="tel:+919158128414"
                            className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-full glass border border-secondary/30 hover:bg-secondary/10 hover:border-secondary transition-all text-foreground font-medium interactive shadow-[0_0_15px_rgba(0,245,255,0.2)] hover:shadow-[0_0_25px_rgba(0,245,255,0.5)] group"
                        >
                            <Phone className="w-5 h-5 text-secondary group-hover:scale-110 transition-transform" />
                            +91-9158128414
                        </a>
                    </motion.div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-foreground/20 text-muted text-sm pb-8">
                    <p>© 2025 Shrikant Satpute</p>
                    <p className="mt-4 md:mt-0 flex items-center gap-1">
                        Built with <span className="text-red-500 animate-pulse">❤️</span> and Next.js
                    </p>
                </div>
            </div>
        </footer>
    );
}
