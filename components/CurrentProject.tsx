'use client';

import { motion } from 'framer-motion';
import { CURRENT_PROJECT } from '@/lib/constants';
import { Brain, Blocks, DatabaseZap, LucideIcon } from 'lucide-react'; // Mapping icons from constant strings

const iconMap: Record<string, LucideIcon> = {
    Brain,
    Blocks,
    DatabaseZap,
};

export default function CurrentProject() {
    return (
        <section className="py-24 relative overflow-hidden bg-transparent">
            {/* Animated gradient mesh background */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-r from-primary to-purple-600 blur-[120px] mix-blend-screen animate-blob" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-l from-tertiary to-pink-600 blur-[120px] mix-blend-screen animate-blob animation-delay-2000" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="mb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-green-500/30 bg-green-500/10 mb-8"
                    >
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-green-400 text-sm font-semibold tracking-wide uppercase">In Progress</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold font-space text-foreground mb-6"
                    >
                        {CURRENT_PROJECT.title}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-xl text-primary font-medium"
                    >
                        {CURRENT_PROJECT.subtitle}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {CURRENT_PROJECT.features.map((feature, idx) => {
                        const IconComponent = iconMap[feature.icon];

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 + idx * 0.1, duration: 0.6 }}
                                className="glass-card p-8 group hover:-translate-y-2 transition-transform duration-300"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-foreground/5 border border-foreground/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 group-hover:border-primary/50 transition-all duration-300">
                                    {IconComponent && <IconComponent className="w-8 h-8 text-secondary group-hover:text-foreground" />}
                                </div>

                                <h3 className="text-2xl font-bold font-space text-foreground mb-4">
                                    {feature.title}
                                </h3>

                                <p className="text-muted leading-relaxed font-inter">
                                    {feature.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
