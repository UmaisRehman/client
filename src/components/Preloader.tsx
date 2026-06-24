import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

interface PreloaderProps {
    name?: string;
    onComplete: () => void;
}

const greetings = ['Hello', 'नमस्ते', 'السلام علیکم', 'Bonjour', 'Hola', 'こんにちは', '你好', 'Ciao'];

const Preloader = ({ name = 'Portfolio', onComplete }: PreloaderProps) => {
    const [currentGreeting, setCurrentGreeting] = useState(0);
    const [counter, setCounter] = useState(0);
    const progressRef = useRef<SVGCircleElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const topCurtainRef = useRef<HTMLDivElement>(null);
    const bottomCurtainRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Cycle through greetings
        const greetingInterval = setInterval(() => {
            setCurrentGreeting(prev => {
                if (prev >= greetings.length - 1) {
                    clearInterval(greetingInterval);
                    return prev;
                }
                return prev + 1;
            });
        }, 250);

        // Counter animation
        const counterObj = { value: 0 };
        gsap.to(counterObj, {
            value: 100,
            duration: 2.2,
            ease: 'power2.inOut',
            onUpdate: () => {
                setCounter(Math.round(counterObj.value));
            },
        });

        // Progress ring animation
        if (progressRef.current) {
            const circumference = 2 * Math.PI * 45;
            gsap.fromTo(
                progressRef.current,
                { strokeDashoffset: circumference },
                {
                    strokeDashoffset: 0,
                    duration: 2.2,
                    ease: 'power2.inOut',
                }
            );
        }

        // Curtain reveal after loading
        const timer = setTimeout(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    onComplete();
                },
            });

            tl.to(topCurtainRef.current, {
                yPercent: -100,
                duration: 0.8,
                ease: 'power4.inOut',
            }, 0);

            tl.to(bottomCurtainRef.current, {
                yPercent: 100,
                duration: 0.8,
                ease: 'power4.inOut',
            }, 0);

        }, 2600);

        return () => {
            clearInterval(greetingInterval);
            clearTimeout(timer);
        };
    }, [onComplete]);

    const circumference = 2 * Math.PI * 45;

    return (
        <motion.div
            ref={containerRef}
            className="preloader"
            initial={{ opacity: 1 }}
            style={{ position: 'fixed', inset: 0, zIndex: 9999 }}
        >
            {/* Top curtain */}
            <div
                ref={topCurtainRef}
                className="preloader-curtain preloader-curtain-top"
            />
            {/* Bottom curtain */}
            <div
                ref={bottomCurtainRef}
                className="preloader-curtain preloader-curtain-bottom"
            />

            {/* Center content */}
            <div className="preloader-content">
                {/* Progress ring */}
                <div className="preloader-ring">
                    <svg width="120" height="120" viewBox="0 0 100 100">
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="rgba(99, 102, 241, 0.15)"
                            strokeWidth="2"
                        />
                        <circle
                            ref={progressRef}
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="url(#preloaderGradient)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={circumference}
                            transform="rotate(-90 50 50)"
                        />
                        <defs>
                            <linearGradient id="preloaderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="50%" stopColor="#22d3ee" />
                                <stop offset="100%" stopColor="#a78bfa" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Counter in center */}
                    <div className="preloader-counter">
                        {counter}%
                    </div>
                </div>

                {/* Greeting text */}
                <div className="preloader-greeting">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={currentGreeting}
                            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
                            transition={{ duration: 0.2 }}
                        >
                            {greetings[currentGreeting]}
                        </motion.span>
                    </AnimatePresence>
                </div>

                {/* Name */}
                <motion.div
                    className="preloader-name"
                    initial={{ opacity: 0, letterSpacing: '0.5em' }}
                    animate={{ opacity: 1, letterSpacing: '0.2em' }}
                    transition={{ delay: 0.5, duration: 1.5, ease: 'easeOut' }}
                >
                    {name}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Preloader;
