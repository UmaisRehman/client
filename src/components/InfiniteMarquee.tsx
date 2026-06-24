import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface InfiniteMarqueeProps {
    items: string[];
    speed?: number;
    separator?: string;
    className?: string;
    direction?: 'left' | 'right';
}

const InfiniteMarquee = ({
    items,
    speed = 50,
    separator = '✦',
    className = '',
    direction = 'left',
}: InfiniteMarqueeProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const track = trackRef.current;
        const container = containerRef.current;
        if (!track || !container) return;

        // Measure track width
        const trackWidth = track.scrollWidth / 2;

        // Base animation
        const tween = gsap.to(track, {
            x: direction === 'left' ? -trackWidth : trackWidth,
            duration: trackWidth / speed,
            ease: 'none',
            repeat: -1,
            modifiers: {
                x: gsap.utils.unitize((x: number) => {
                    return direction === 'left'
                        ? ((parseFloat(String(x)) % trackWidth) + trackWidth) % trackWidth * -1
                        : parseFloat(String(x)) % trackWidth;
                }),
            },
        });

        // Speed up on scroll velocity
        ScrollTrigger.create({
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            onUpdate: (self) => {
                const velocity = Math.abs(self.getVelocity()) / 1000;
                const speedMultiplier = Math.min(1 + velocity * 0.5, 4);
                tween.timeScale(speedMultiplier);
            },
        });

        return () => {
            tween.kill();
            ScrollTrigger.getAll().forEach(st => {
                if (st.trigger === container) st.kill();
            });
        };
    }, [items, speed, direction]);

    const content = items.map(item => `${item} ${separator} `).join('');

    return (
        <div ref={containerRef} className={`marquee-container ${className}`}>
            <div ref={trackRef} className="marquee-track">
                <span className="marquee-content">{content}</span>
                <span className="marquee-content">{content}</span>
            </div>
        </div>
    );
};

export default InfiniteMarquee;
