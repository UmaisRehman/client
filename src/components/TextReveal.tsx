import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
    children: ReactNode;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
    mode?: 'words' | 'chars' | 'lines';
    trigger?: 'scroll' | 'load';
    delay?: number;
    stagger?: number;
    className?: string;
    style?: React.CSSProperties;
}

const TextReveal = ({
    children,
    as: Tag = 'div',
    mode = 'words',
    trigger = 'scroll',
    delay = 0,
    stagger = 0.03,
    className = '',
    style = {},
}: TextRevealProps) => {
    const containerRef = useRef<HTMLElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container || hasAnimated.current) return;

        const text = container.textContent || '';
        if (!text.trim()) return;

        // Split text into spans
        let elements: string[] = [];
        if (mode === 'chars') {
            elements = text.split('');
        } else if (mode === 'words') {
            elements = text.split(/(\s+)/);
        } else {
            elements = text.split(/\n/);
        }

        container.innerHTML = '';
        const spans: HTMLElement[] = [];

        elements.forEach((item) => {
            if (item.match(/^\s+$/)) {
                // Whitespace - preserve it
                const space = document.createTextNode(item);
                container.appendChild(space);
            } else if (item.trim()) {
                const span = document.createElement('span');
                span.style.display = 'inline-block';
                span.style.overflow = 'hidden';

                const inner = document.createElement('span');
                inner.textContent = item;
                inner.style.display = 'inline-block';
                inner.style.transform = 'translateY(120%)';
                inner.style.opacity = '0';

                span.appendChild(inner);
                container.appendChild(span);
                spans.push(inner);
            }
        });

        const innerElements = spans;

        if (trigger === 'scroll') {
            gsap.to(innerElements, {
                y: '0%',
                opacity: 1,
                duration: 0.8,
                ease: 'power3.out',
                stagger: stagger,
                delay: delay,
                scrollTrigger: {
                    trigger: container,
                    start: 'top 85%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none none',
                },
            });
        } else {
            gsap.to(innerElements, {
                y: '0%',
                opacity: 1,
                duration: 0.8,
                ease: 'power3.out',
                stagger: stagger,
                delay: delay,
            });
        }

        hasAnimated.current = true;

        return () => {
            ScrollTrigger.getAll().forEach(st => {
                if (st.trigger === container) st.kill();
            });
        };
    }, [children, mode, trigger, delay, stagger]);

    return (
        <Tag
            ref={containerRef as any}
            className={`text-reveal ${className}`}
            style={{ overflow: 'hidden', ...style }}
        >
            {children}
        </Tag>
    );
};

export default TextReveal;
