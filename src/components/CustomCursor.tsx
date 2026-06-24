import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [hoverText, setHoverText] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        // Detect touch device
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        setIsTouchDevice(isTouch);
        if (isTouch) return;

        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseEnter = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const interactive = target.closest('a, button, [data-cursor], input, textarea, select, .project-card, .skill-chip, .contact-card, .filter-btn');
            if (interactive) {
                setIsHovering(true);
                const cursorText = interactive.getAttribute('data-cursor') || '';
                setHoverText(cursorText);
            }
        };

        const handleMouseLeave = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const interactive = target.closest('a, button, [data-cursor], input, textarea, select, .project-card, .skill-chip, .contact-card, .filter-btn');
            if (interactive) {
                setIsHovering(false);
                setHoverText('');
            }
        };

        window.addEventListener('mousemove', moveCursor);
        document.addEventListener('mouseover', handleMouseEnter);
        document.addEventListener('mouseout', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mouseover', handleMouseEnter);
            document.removeEventListener('mouseout', handleMouseLeave);
        };
    }, [isVisible]);

    if (isTouchDevice) return null;

    return (
        <>
            {/* Main cursor circle */}
            <motion.div
                ref={cursorRef}
                className="custom-cursor"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    opacity: isVisible ? 1 : 0,
                }}
                animate={{
                    width: isHovering ? 64 : 20,
                    height: isHovering ? 64 : 20,
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
                {hoverText && (
                    <motion.span
                        className="cursor-text"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                    >
                        {hoverText}
                    </motion.span>
                )}
            </motion.div>

            {/* Small dot */}
            <motion.div
                className="custom-cursor-dot"
                style={{
                    x: cursorX,
                    y: cursorY,
                    opacity: isVisible ? 1 : 0,
                }}
                animate={{
                    scale: isHovering ? 0 : 1,
                }}
            />
        </>
    );
};

export default CustomCursor;
