import { useEffect, useRef, type ReactNode } from 'react';
import Lenis from 'lenis';

interface SmoothScrollProps {
    children: ReactNode;
}

export const SmoothScroll = ({ children }: SmoothScrollProps) => {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.1,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true,
        });

        lenisRef.current = lenis;
        (window as any).__lenis = lenis;

        let frameId: number;
        function raf(time: number) {
            lenis.raf(time);
            frameId = requestAnimationFrame(raf);
        }
        frameId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(frameId);
            lenis.destroy();
            delete (window as any).__lenis;
        };
    }, []);

    return <>{children}</>;
};

export default SmoothScroll;
