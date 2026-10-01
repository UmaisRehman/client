import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const AmbientBackground = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const smoothX = useSpring(mouseX, { damping: 40, stiffness: 60 });
    const smoothY = useSpring(mouseY, { damping: 40, stiffness: 60 });

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window;
            const xOffset = (e.clientX / innerWidth - 0.5) * 40;
            const yOffset = (e.clientY / innerHeight - 0.5) * 40;
            mouseX.set(xOffset);
            mouseY.set(yOffset);
        };

        window.addEventListener('mousemove', handleMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMove);
    }, [mouseX, mouseY]);

    return (
        <div className="ambient-bg" aria-hidden="true">
            <motion.div
                className="ambient-orb ambient-orb-1"
                style={{ x: smoothX, y: smoothY }}
            />
            <motion.div
                className="ambient-orb ambient-orb-2"
                style={{
                    x: useSpring(mouseX, { damping: 50, stiffness: 45 }),
                    y: useSpring(mouseY, { damping: 50, stiffness: 45 }),
                }}
            />
            <motion.div
                className="ambient-orb ambient-orb-3"
                style={{ x: smoothX, y: smoothY }}
            />
            <div className="ambient-grid" />
        </div>
    );
};

export default AmbientBackground;
