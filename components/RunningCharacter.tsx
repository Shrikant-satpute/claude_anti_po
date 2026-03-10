'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

const CHAR_H = 96;

export default function RunningCharacter() {
    const laneRef   = useRef<HTMLDivElement>(null);
    const lottieRef = useRef<LottieRefCurrentProps>(null);

    const [animData,    setAnimData]    = useState<object | null>(null);
    const [containerW,  setContainerW]  = useState(0);
    const [offscreenEnd, setOffscreenEnd] = useState(0); // how far left to exit screen
    const [started,     setStarted]     = useState(false);
    const [runKey,      setRunKey]      = useState(0);

    // Load Lottie JSON
    useEffect(() => {
        fetch('/running-character.json')
            .then(r => { if (!r.ok) throw new Error(); return r.json(); })
            .then(setAnimData)
            .catch(() => {});
    }, []);

    // Measure container width (= h1 text width via w-fit parent)
    useEffect(() => {
        const measure = () => {
            if (!laneRef.current) return;
            const rect = laneRef.current.getBoundingClientRect();
            setContainerW(rect.width);
            // Distance needed to push character fully off the left edge of the viewport
            setOffscreenEnd(-(rect.left + CHAR_H + 10));
        };
        measure();
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
    }, []);

    // Delay first run until after hero text animates in
    useEffect(() => {
        if (!animData || containerW === 0) return;
        const t = setTimeout(() => setStarted(true), 2600);
        return () => clearTimeout(t);
    }, [animData, containerW]);

    // After each run completes, wait 10s then trigger next run via key change
    const handleComplete = () => {
        setTimeout(() => setRunKey(k => k + 1), 10_000);
    };

    return (
        <div
            ref={laneRef}
            className="absolute left-0 right-0 pointer-events-none select-none"
            style={{ bottom: 'calc(100% - 12px)', height: CHAR_H, overflow: 'visible' }}
        >
            {animData && started && containerW > 0 && (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={runKey}
                        className="absolute bottom-0"
                        initial={{ x: containerW }}          // starts at right edge of text
                        animate={{ x: offscreenEnd }}        // exits off the left of the screen
                        transition={{ duration: (containerW - offscreenEnd) / 155, ease: 'linear' }}
                        onAnimationComplete={handleComplete}
                        style={{ width: CHAR_H, height: CHAR_H, scaleX: -1, transformOrigin: 'center bottom' }}
                    >
                        <Lottie
                            lottieRef={lottieRef}
                            animationData={animData}
                            loop
                            autoplay
                            style={{ width: '100%', height: '100%' }}
                        />
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
}
