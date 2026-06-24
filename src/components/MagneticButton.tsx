import { useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
    children: ReactNode;
    strength?: number;
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
}

const MagneticButton = ({
    children,
    strength = 0.3,
    className = '',
    style = {},
    onClick,
}: MagneticButtonProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) * strength;
        const deltaY = (e.clientY - centerY) * strength;

        setPosition({ x: deltaX, y: deltaY });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <motion.div
            ref={ref}
            className={`magnetic-wrap ${className}`}
            style={{ display: 'inline-block', ...style }}
            onMouseMove={handleMouse}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            animate={{
                x: position.x,
                y: position.y,
            }}
            transition={{
                type: 'spring',
                stiffness: 350,
                damping: 15,
                mass: 0.2,
            }}
        >
            {children}
        </motion.div>
    );
};

export default MagneticButton;
