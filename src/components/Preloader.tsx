import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
    name?: string;
    onComplete: () => void;
}

const greetings = ['Hello', 'السلام علیکم', 'Bonjour', 'Hola', 'こんにちは', 'Welcome'];

export const Preloader = ({ name = 'Portfolio', onComplete }: PreloaderProps) => {
    const [counter, setCounter] = useState(0);
    const [greetingIndex, setGreetingIndex] = useState(0);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Fast greeting sequence
        const greetingInterval = setInterval(() => {
            setGreetingIndex((prev) => (prev + 1) % greetings.length);
        }, 180);

        // Progress counter to 100 in ~900ms
        const startTime = Date.now();
        const duration = 900;

        const counterTimer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(100, Math.round((elapsed / duration) * 100));
            setCounter(progress);

            if (progress >= 100) {
                clearInterval(counterTimer);
                clearInterval(greetingInterval);
                setTimeout(() => {
                    setIsExiting(true);
                    setTimeout(onComplete, 450);
                }, 150);
            }
        }, 20);

        return () => {
            clearInterval(greetingInterval);
            clearInterval(counterTimer);
        };
    }, [onComplete]);

    return (
        <AnimatePresence>
            {!isExiting && (
                <motion.div
                    className="preloader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="preloader-box">
                        <motion.div
                            key={greetingIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            style={{
                                color: 'rgb(var(--accent-rgb))',
                                fontSize: '1.25rem',
                                fontWeight: 600,
                                marginBottom: 12,
                                height: 32,
                            }}
                        >
                            {greetings[greetingIndex]}
                        </motion.div>

                        <div className="preloader-count">{counter}%</div>

                        <div className="preloader-bar-bg">
                            <div
                                className="preloader-bar-fill"
                                style={{ width: `${counter}%` }}
                            />
                        </div>

                        <div className="preloader-tagline">{name}</div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Preloader;
