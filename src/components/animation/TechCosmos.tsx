import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { TECH_REGISTRY, type TechSkill } from '../../config/techStack';

interface NodePosition {
    skill: TechSkill;
    top: string;
    left: string;
    delay: number;
    floatDuration: number;
    size: number;
}

const COSMOS_NODES: NodePosition[] = [
    { skill: TECH_REGISTRY[0], top: '15%', left: '8%', delay: 0, floatDuration: 6, size: 54 },   // React
    { skill: TECH_REGISTRY[1], top: '22%', left: '86%', delay: 1, floatDuration: 7.5, size: 50 }, // Next.js
    { skill: TECH_REGISTRY[2], top: '65%', left: '6%', delay: 0.5, floatDuration: 6.8, size: 52 }, // Node.js
    { skill: TECH_REGISTRY[3], top: '78%', left: '88%', delay: 1.5, floatDuration: 8, size: 48 },  // Express
    { skill: TECH_REGISTRY[4], top: '82%', left: '22%', delay: 2, floatDuration: 7.2, size: 52 }, // MongoDB
    { skill: TECH_REGISTRY[5], top: '18%', left: '68%', delay: 0.8, floatDuration: 6.5, size: 50 }, // .NET Core
    { skill: TECH_REGISTRY[6], top: '72%', left: '74%', delay: 1.8, floatDuration: 7, size: 48 },  // Firebase
    { skill: TECH_REGISTRY[8], top: '28%', left: '25%', delay: 1.2, floatDuration: 8.2, size: 46 }, // TypeScript
];

export const TechCosmos: React.FC = () => {
    const [hoveredSkill, setHoveredSkill] = useState<TechSkill | null>(null);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const smoothX = useSpring(mouseX, { stiffness: 45, damping: 25 });
    const smoothY = useSpring(mouseY, { stiffness: 45, damping: 25 });

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window;
            mouseX.set((e.clientX / innerWidth - 0.5) * 30);
            mouseY.set((e.clientY / innerHeight - 0.5) * 30);
        };

        window.addEventListener('mousemove', handleMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMove);
    }, [mouseX, mouseY]);

    return (
        <div
            className="tech-cosmos-container"
            style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                overflow: 'hidden',
                zIndex: 1,
            }}
            aria-hidden="true"
        >
            {COSMOS_NODES.map((node) => {
                const IconComponent = node.skill.icon;
                const isHovered = hoveredSkill?.id === node.skill.id;

                return (
                    <motion.div
                        key={node.skill.id}
                        style={{
                            position: 'absolute',
                            top: node.top,
                            left: node.left,
                            x: smoothX,
                            y: smoothY,
                            pointerEvents: 'auto',
                        }}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{
                            opacity: [0.65, 0.95, 0.65],
                            y: [0, -18, 0],
                            scale: isHovered ? 1.25 : 1,
                        }}
                        transition={{
                            opacity: { repeat: Infinity, duration: node.floatDuration, ease: 'easeInOut' },
                            y: { repeat: Infinity, duration: node.floatDuration, ease: 'easeInOut', delay: node.delay },
                            scale: { type: 'spring', stiffness: 350, damping: 20 },
                        }}
                        onMouseEnter={() => setHoveredSkill(node.skill)}
                        onMouseLeave={() => setHoveredSkill(null)}
                    >
                        <div
                            style={{
                                width: node.size,
                                height: node.size,
                                borderRadius: '50%',
                                background: 'rgb(var(--surface-rgb) / 0.85)',
                                backdropFilter: 'blur(12px)',
                                WebkitBackdropFilter: 'blur(12px)',
                                border: `1.5px solid ${isHovered ? node.skill.brandColor : 'rgb(var(--border-rgb) / 0.18)'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: node.skill.brandColor,
                                fontSize: node.size * 0.52,
                                boxShadow: isHovered
                                    ? `0 0 30px ${node.skill.glowColor}, inset 0 0 15px ${node.skill.glowColor}`
                                    : `0 8px 24px rgba(0,0,0,0.4), 0 0 15px ${node.skill.glowColor.replace('0.45', '0.12')}`,
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                            }}
                        >
                            <IconComponent />
                        </div>

                        {/* Interactive floating micro-badge on hover */}
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.85 }}
                                animate={{ opacity: 1, y: -4, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.85 }}
                                style={{
                                    position: 'absolute',
                                    top: '105%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: 'rgb(var(--surface-rgb) / 0.95)',
                                    border: `1px solid ${node.skill.brandColor}`,
                                    borderRadius: 'var(--radius-sm)',
                                    padding: '4px 10px',
                                    whiteSpace: 'nowrap',
                                    zIndex: 20,
                                    boxShadow: `0 10px 25px rgba(0,0,0,0.6), 0 0 15px ${node.skill.glowColor}`,
                                }}
                            >
                                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>
                                    {node.skill.name}
                                </div>
                                <div style={{ fontSize: '0.68rem', color: node.skill.brandColor, fontWeight: 600 }}>
                                    {node.skill.experienceLevel}
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
};

export default TechCosmos;
