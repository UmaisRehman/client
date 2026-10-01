import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface ScrollRevealProps extends HTMLMotionProps<'div'> {
    children: React.ReactNode;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    distance?: number;
    duration?: number;
    className?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
    children,
    delay = 0,
    direction = 'up',
    distance = 30,
    duration = 0.6,
    className = '',
    ...props
}) => {
    const getInitialOffsets = () => {
        switch (direction) {
            case 'up': return { y: distance, x: 0 };
            case 'down': return { y: -distance, x: 0 };
            case 'left': return { x: distance, y: 0 };
            case 'right': return { x: -distance, y: 0 };
            default: return { x: 0, y: 0 };
        }
    };

    const offsets = getInitialOffsets();

    return (
        <motion.div
            initial={{ opacity: 0, ...offsets }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
                duration,
                delay,
                ease: [0.16, 1, 0.3, 1],
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;
