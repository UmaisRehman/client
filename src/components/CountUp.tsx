import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CountUpProps {
    end: number;
    suffix?: string;
    duration?: number;
    className?: string;
}

const CountUp = ({ end, suffix = '', duration = 2, className = '' }: CountUpProps) => {
    const numberRef = useRef<HTMLSpanElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const el = numberRef.current;
        if (!el || hasAnimated.current) return;

        const counter = { value: 0 };

        ScrollTrigger.create({
            trigger: el,
            start: 'top 90%',
            onEnter: () => {
                if (hasAnimated.current) return;
                hasAnimated.current = true;

                gsap.to(counter, {
                    value: end,
                    duration: duration,
                    ease: 'power2.out',
                    onUpdate: () => {
                        if (el) {
                            el.textContent = Math.round(counter.value).toString();
                        }
                    },
                });
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach(st => {
                if (st.trigger === el) st.kill();
            });
        };
    }, [end, duration]);

    return (
        <span className={className}>
            <span ref={numberRef}>0</span>
            {suffix && <span>{suffix}</span>}
        </span>
    );
};

export default CountUp;
