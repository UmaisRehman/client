import React from 'react';
import { TECH_REGISTRY } from '../../config/techStack';

interface TechMarqueeProps {
    direction?: 'left' | 'right';
    speed?: number;
}

export const TechMarquee: React.FC<TechMarqueeProps> = ({
    direction = 'left',
    speed = 35,
}) => {
    // Duplicate array 3 times for continuous uninterrupted loop
    const items = [...TECH_REGISTRY, ...TECH_REGISTRY, ...TECH_REGISTRY];

    return (
        <div
            className="tech-marquee-wrapper"
            style={{
                position: 'relative',
                width: '100%',
                overflow: 'hidden',
                padding: '24px 0',
                background: 'rgb(var(--surface-rgb) / 0.25)',
                borderTop: '1px solid rgb(var(--border-rgb) / 0.08)',
                borderBottom: '1px solid rgb(var(--border-rgb) / 0.08)',
                maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
            }}
        >
            <div
                className={`tech-marquee-track ${direction === 'right' ? 'marquee-reverse' : ''}`}
                style={{
                    display: 'flex',
                    gap: 20,
                    width: 'max-content',
                    animation: `marqueeLoop ${speed}s linear infinite`,
                    animationDirection: direction === 'right' ? 'reverse' : 'normal',
                }}
            >
                {items.map((skill, index) => {
                    const Icon = skill.icon;
                    return (
                        <div
                            key={`${skill.id}-${index}`}
                            className="tech-marquee-card"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 12,
                                padding: '10px 22px',
                                borderRadius: 'var(--radius-full)',
                                background: 'rgb(var(--surface-rgb) / 0.75)',
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                                border: '1px solid rgb(var(--border-rgb) / 0.12)',
                                transition: 'all 0.3s ease',
                                cursor: 'default',
                                userSelect: 'none',
                            }}
                        >
                            <span
                                style={{
                                    fontSize: '1.35rem',
                                    color: skill.brandColor,
                                    display: 'flex',
                                    alignItems: 'center',
                                    filter: `drop-shadow(0 0 8px ${skill.glowColor})`,
                                }}
                            >
                                <Icon />
                            </span>

                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'rgb(var(--text-rgb))' }}>
                                    {skill.name}
                                </span>
                                <span style={{ fontSize: '0.72rem', color: 'rgb(var(--text-muted-rgb))' }}>
                                    {skill.category}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <style>{`
                @keyframes marqueeLoop {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.333%); }
                }
                .tech-marquee-track:hover {
                    animation-play-state: paused !important;
                }
                .tech-marquee-card:hover {
                    border-color: rgb(var(--primary-rgb) / 0.5) !important;
                    transform: translateY(-2px);
                }
            `}</style>
        </div>
    );
};

export default TechMarquee;
