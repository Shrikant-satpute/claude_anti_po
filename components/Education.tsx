'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Award } from 'lucide-react';

export default function Education() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const itemVariants: any = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
    };

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-6xl">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                    {/* Education */}
                    <motion.div variants={itemVariants} className="glass-card p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <GraduationCap className="w-32 h-32 text-primary" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="bg-primary/20 p-4 rounded-2xl">
                                    <GraduationCap className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-3xl font-bold font-space text-foreground">Education</h3>
                            </div>

                            <div className="space-y-2 border-l-2 border-primary/30 pl-6">
                                <h4 className="text-xl font-bold text-foreground font-space">B.Tech in Computer Science & Engineering</h4>
                                <p className="text-secondary font-medium">Shivaji University, Kolhapur</p>
                                <div className="inline-flex items-center px-3 py-1 mt-4 rounded-full bg-foreground/5 border border-foreground/20 text-muted text-sm">
                                    CGPA: 8.4
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Certifications */}
                    <motion.div variants={itemVariants} className="glass-card p-10 relative overflow-hidden group border-t-4 border-tertiary">
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-tertiary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="bg-tertiary/20 p-4 rounded-2xl">
                                    <Award className="w-8 h-8 text-tertiary" />
                                </div>
                                <h3 className="text-3xl font-bold font-space text-foreground">Certifications</h3>
                            </div>

                            <div className="space-y-8">
                                <div className="group/cert">
                                    <h4 className="text-lg font-bold text-foreground group-hover/cert:text-tertiary transition-colors">Full Stack Web Development</h4>
                                    <p className="text-muted text-sm">SHAPEAI (Jul–Oct 2021)</p>
                                </div>

                                <div className="group/cert">
                                    <h4 className="text-lg font-bold text-foreground group-hover/cert:text-tertiary transition-colors">AI-ML Virtual Internship</h4>
                                    <p className="text-muted text-sm border-l-2 border-tertiary/30 pl-4 mt-2">AICTE-EduSkills + AWS (Mar–May 2022)</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
