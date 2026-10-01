import React, { useEffect, useRef, useState } from 'react';
import {
    SiReact,
    SiNextdotjs,
    SiNodedotjs,
    SiMongodb,
    SiDotnet,
    SiFirebase,
    SiTypescript,
} from 'react-icons/si';

interface CharacterConfig {
    id: string;
    name: string;
    brandColor: string;
    glowColor: string;
    icon: React.ComponentType<{ style?: React.CSSProperties }>;
}

const CHARACTERS: CharacterConfig[] = [
    { id: 'react', name: 'React', brandColor: '#61DAFB', glowColor: 'rgba(97, 218, 251, 0.6)', icon: SiReact },
    { id: 'node', name: 'Node.js', brandColor: '#339933', glowColor: 'rgba(51, 153, 51, 0.6)', icon: SiNodedotjs },
    { id: 'mongo', name: 'MongoDB', brandColor: '#47A248', glowColor: 'rgba(71, 162, 72, 0.6)', icon: SiMongodb },
    { id: 'dotnet', name: '.NET', brandColor: '#8855F7', glowColor: 'rgba(136, 85, 247, 0.6)', icon: SiDotnet },
    { id: 'next', name: 'Next.js', brandColor: '#ffffff', glowColor: 'rgba(255, 255, 255, 0.5)', icon: SiNextdotjs },
    { id: 'firebase', name: 'Firebase', brandColor: '#FFCA28', glowColor: 'rgba(255, 202, 40, 0.6)', icon: SiFirebase },
    { id: 'ts', name: 'TypeScript', brandColor: '#3178C6', glowColor: 'rgba(49, 120, 198, 0.6)', icon: SiTypescript },
];

interface Shockwave {
    id: number;
    x: number;
    y: number;
    color: string;
    radius: number;
    maxRadius: number;
    opacity: number;
}

interface PlayerBot {
    config: CharacterConfig;
    x: number;
    y: number;
    vx: number;
    vy: number;
    facingLeft: boolean;
    isColliding: boolean;
    isDitching: boolean;
    stride: number;
    spin: number;
    recoilScale: number;
}

export const TechBuddiesArena: React.FC = () => {
    const arenaRef = useRef<HTMLDivElement>(null);
    const playersRef = useRef<PlayerBot[]>([]);
    const shockwavesRef = useRef<Shockwave[]>([]);
    const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });
    const animRef = useRef<number>(0);
    const shockwaveIdCounter = useRef(0);
    const [, setRenderTrigger] = useState(0);

    // Initialize players
    useEffect(() => {
        const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
        const height = typeof window !== 'undefined' ? Math.max(window.innerHeight * 0.9, 650) : 700;

        playersRef.current = CHARACTERS.map((config, index) => {
            const angle = (index / CHARACTERS.length) * Math.PI * 2;
            const r = Math.min(width, height) * 0.32;
            const cx = width / 2 + Math.cos(angle) * r;
            const cy = height / 2 + Math.sin(angle) * r;

            return {
                config,
                x: Math.max(90, Math.min(width - 90, cx)),
                y: Math.max(100, Math.min(height - 110, cy)),
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                facingLeft: Math.random() > 0.5,
                isColliding: false,
                isDitching: false,
                stride: Math.random() * Math.PI * 2,
                spin: 0,
                recoilScale: 1,
            };
        });

        const handleMouseMove = (e: MouseEvent) => {
            if (!arenaRef.current) return;
            const rect = arenaRef.current.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                active: true,
            };
        };

        const handleMouseLeave = () => {
            mouseRef.current.active = false;
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        const arena = arenaRef.current;
        if (arena) arena.addEventListener('mouseleave', handleMouseLeave);

        let lastTime = performance.now();

        // Physics & Animation Loop
        const tick = (now: number) => {
            const dt = Math.min((now - lastTime) / 1000, 0.05);
            lastTime = now;

            const w = arenaRef.current?.clientWidth || window.innerWidth;
            const h = arenaRef.current?.clientHeight || 750;
            const players = playersRef.current;
            const mouse = mouseRef.current;

            // Update each player
            for (let i = 0; i < players.length; i++) {
                const p = players[i];

                // Stride speed matches velocity
                const speed = Math.hypot(p.vx, p.vy);
                p.stride += speed * 6 * dt;

                // Cruising speed regulation
                if (speed < 0.8) {
                    p.vx += (Math.random() - 0.5) * 0.5;
                    p.vy += (Math.random() - 0.5) * 0.5;
                } else if (speed > 4.5) {
                    p.vx *= 0.95;
                    p.vy *= 0.95;
                }

                // Move
                p.x += p.vx * 60 * dt;
                p.y += p.vy * 60 * dt;

                if (Math.abs(p.vx) > 0.25) {
                    p.facingLeft = p.vx < 0;
                }

                // Bounce off arena walls
                const radius = 42;
                if (p.x < radius) {
                    p.x = radius;
                    p.vx = Math.abs(p.vx) * 0.85;
                } else if (p.x > w - radius) {
                    p.x = w - radius;
                    p.vx = -Math.abs(p.vx) * 0.85;
                }

                if (p.y < radius + 10) {
                    p.y = radius + 10;
                    p.vy = Math.abs(p.vy) * 0.85;
                } else if (p.y > h - radius - 15) {
                    p.y = h - radius - 15;
                    p.vy = -Math.abs(p.vy) * 0.85;
                }

                // Cursor Ditch / Evade Mechanics
                if (mouse.active) {
                    const dx = p.x - mouse.x;
                    const dy = p.y - mouse.y;
                    const dist = Math.hypot(dx, dy);
                    const evadeRadius = 140;

                    if (dist < evadeRadius && dist > 1) {
                        const evadeFactor = (1 - dist / evadeRadius) * 4.2;
                        p.vx += (dx / dist) * evadeFactor;
                        p.vy += (dy / dist) * evadeFactor;
                        p.isDitching = true;
                    } else {
                        p.isDitching = false;
                    }
                } else {
                    p.isDitching = false;
                }

                // Recoil return
                p.recoilScale += (1 - p.recoilScale) * 0.12;

                // Spin return
                if (p.spin > 0) {
                    p.spin = (p.spin + 14) % 360;
                    if (p.spin < 14) p.spin = 0;
                }
            }

            // Pair-Wise Multiplayer Collisions (Push & Dakhelna)
            for (let i = 0; i < players.length; i++) {
                for (let j = i + 1; j < players.length; j++) {
                    const p1 = players[i];
                    const p2 = players[j];

                    const dx = p2.x - p1.x;
                    const dy = p2.y - p1.y;
                    const dist = Math.hypot(dx, dy);
                    const collisionDist = 80;

                    if (dist < collisionDist && dist > 0) {
                        const nx = dx / dist;
                        const ny = dy / dist;

                        // Separate bodies
                        const overlap = (collisionDist - dist) * 0.5;
                        p1.x -= nx * overlap;
                        p1.y -= ny * overlap;
                        p2.x += nx * overlap;
                        p2.y += ny * overlap;

                        // Mutual Push Impulse
                        const pushPower = 3.2;
                        p1.vx -= nx * pushPower;
                        p1.vy -= ny * pushPower;
                        p2.vx += nx * pushPower;
                        p2.vy += ny * pushPower;

                        p1.isColliding = true;
                        p2.isColliding = true;
                        p1.recoilScale = 0.85;
                        p2.recoilScale = 0.85;

                        // Create impact shockwave ring
                        const midX = (p1.x + p2.x) / 2;
                        const midY = (p1.y + p2.y) / 2;
                        shockwavesRef.current.push({
                            id: shockwaveIdCounter.current++,
                            x: midX,
                            y: midY,
                            color: p1.config.brandColor,
                            radius: 10,
                            maxRadius: 55,
                            opacity: 0.85,
                        });

                        setTimeout(() => {
                            p1.isColliding = false;
                            p2.isColliding = false;
                        }, 280);
                    }
                }
            }

            // Update shockwaves
            for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
                const sw = shockwavesRef.current[i];
                sw.radius += (sw.maxRadius - sw.radius) * 0.2 + 1.5;
                sw.opacity -= 0.04;
                if (sw.opacity <= 0 || sw.radius >= sw.maxRadius) {
                    shockwavesRef.current.splice(i, 1);
                }
            }

            setRenderTrigger((t) => (t + 1) % 100000);
            animRef.current = requestAnimationFrame(tick);
        };

        animRef.current = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(animRef.current);
            window.removeEventListener('mousemove', handleMouseMove);
            if (arena) arena.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    const pokePlayer = (index: number) => {
        const p = playersRef.current[index];
        if (p) {
            p.spin = 14;
            p.vx = (Math.random() - 0.5) * 6;
            p.vy = (Math.random() - 0.5) * 6;
            p.recoilScale = 0.75;
        }
    };

    return (
        <div
            ref={arenaRef}
            className="tech-buddies-arena"
            style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                overflow: 'hidden',
                zIndex: 1,
            }}
            aria-hidden="true"
        >
            {/* Impact Shockwaves */}
            <svg
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 2,
                }}
            >
                {shockwavesRef.current.map((sw) => (
                    <circle
                        key={sw.id}
                        cx={sw.x}
                        cy={sw.y}
                        r={sw.radius}
                        fill="none"
                        stroke={sw.color}
                        strokeWidth="2.5"
                        opacity={sw.opacity}
                    />
                ))}
            </svg>

            {/* Living Game Character Players */}
            {playersRef.current.map((p, idx) => {
                const Icon = p.config.icon;
                const legSwing = Math.sin(p.stride) * 14;
                const armReach = p.isColliding ? 28 : Math.sin(p.stride) * 12;

                return (
                    <div
                        key={p.config.id}
                        onClick={() => pokePlayer(idx)}
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            transform: `translate3d(${p.x - 45}px, ${p.y - 45}px, 0) scale(${p.recoilScale}) rotate(${p.spin}deg)`,
                            width: 90,
                            height: 90,
                            pointerEvents: 'auto',
                            cursor: 'pointer',
                            userSelect: 'none',
                            transition: 'transform 0.04s linear',
                            zIndex: 3,
                        }}
                        title={`Poke ${p.config.name} bot!`}
                    >
                        {/* Unified Character SVG with Connected Limbs & Boots */}
                        <svg
                            width="90"
                            height="90"
                            viewBox="0 0 100 100"
                            style={{ overflow: 'visible' }}
                        >
                            <defs>
                                <filter id={`glow-${p.config.id}`} x="-20%" y="-20%" width="140%" height="140%">
                                    <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={p.config.brandColor} floodOpacity="0.6" />
                                </filter>
                            </defs>

                            {/* ================= CONNECTED LEGS & BOOTS ================= */}
                            {/* Left Leg: Hips (38, 66) -> Knee -> Boot */}
                            <path
                                d={`M 38 64 Q ${36 - legSwing * 0.3} ${76 + legSwing * 0.2} ${34 - legSwing} ${85 + (legSwing > 0 ? -3 : 0)}`}
                                stroke={p.config.brandColor}
                                strokeWidth="4"
                                strokeLinecap="round"
                                fill="none"
                            />
                            {/* Left Cyber Boot */}
                            <ellipse
                                cx={34 - legSwing}
                                cy={87 + (legSwing > 0 ? -3 : 0)}
                                rx="7"
                                ry="4.5"
                                fill={p.config.brandColor}
                                stroke="#ffffff"
                                strokeWidth="1.2"
                            />

                            {/* Right Leg: Hips (62, 66) -> Knee -> Boot */}
                            <path
                                d={`M 62 64 Q ${64 + legSwing * 0.3} ${76 - legSwing * 0.2} ${66 + legSwing} ${85 + (legSwing < 0 ? -3 : 0)}`}
                                stroke={p.config.brandColor}
                                strokeWidth="4"
                                strokeLinecap="round"
                                fill="none"
                            />
                            {/* Right Cyber Boot */}
                            <ellipse
                                cx={66 + legSwing}
                                cy={87 + (legSwing < 0 ? -3 : 0)}
                                rx="7"
                                ry="4.5"
                                fill={p.config.brandColor}
                                stroke="#ffffff"
                                strokeWidth="1.2"
                            />

                            {/* ================= CONNECTED ARMS & GLOVES ================= */}
                            {/* Left Arm: Shoulder (22, 42) -> Glove */}
                            <path
                                d={`M 24 42 Q ${14 - armReach * 0.4} ${45 + armReach * 0.3} ${8 - armReach} ${48}`}
                                stroke={p.config.brandColor}
                                strokeWidth="4"
                                strokeLinecap="round"
                                fill="none"
                            />
                            {/* Left Power Glove */}
                            <circle
                                cx={8 - armReach}
                                cy={48}
                                r="6.5"
                                fill={p.config.brandColor}
                                stroke="#ffffff"
                                strokeWidth="1.5"
                                filter={`url(#glow-${p.config.id})`}
                            />

                            {/* Right Arm: Shoulder (78, 42) -> Glove */}
                            <path
                                d={`M 76 42 Q ${86 + armReach * 0.4} ${45 - armReach * 0.3} ${92 + armReach} ${48}`}
                                stroke={p.config.brandColor}
                                strokeWidth="4"
                                strokeLinecap="round"
                                fill="none"
                            />
                            {/* Right Power Glove */}
                            <circle
                                cx={92 + armReach}
                                cy={48}
                                r="6.5"
                                fill={p.config.brandColor}
                                stroke="#ffffff"
                                strokeWidth="1.5"
                                filter={`url(#glow-${p.config.id})`}
                            />

                            {/* ================= ROBOTIC TORSO / CHASSIS ================= */}
                            <rect
                                x="22"
                                y="18"
                                width="56"
                                height="50"
                                rx="18"
                                fill="rgba(15, 23, 42, 0.94)"
                                stroke={p.config.brandColor}
                                strokeWidth="2.5"
                                filter={`url(#glow-${p.config.id})`}
                            />

                            {/* Cyber Helmet Visor (Cleanly placed at top, doesn't obscure logo) */}
                            <path
                                d="M 34 23 Q 50 19 66 23"
                                stroke={p.config.brandColor}
                                strokeWidth="3"
                                strokeLinecap="round"
                                fill="none"
                            />
                            {/* Visor Scanner Lights */}
                            <circle
                                cx={p.facingLeft ? 40 : 46}
                                cy="24"
                                r="2"
                                fill="#ffffff"
                            />
                            <circle
                                cx={p.facingLeft ? 48 : 54}
                                cy="24"
                                r="2"
                                fill="#ffffff"
                            />
                        </svg>

                        {/* ================= PRISTINE LOGO EMBEDDED IN CHEST ================= */}
                        <div
                            style={{
                                position: 'absolute',
                                top: 31,
                                left: 24,
                                width: 42,
                                height: 32,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: p.config.brandColor,
                                fontSize: '1.75rem',
                                filter: `drop-shadow(0 0 8px ${p.config.glowColor})`,
                                pointerEvents: 'none',
                            }}
                        >
                            <Icon />
                        </div>

                        {/* Player Gamer Tag */}
                        <div
                            style={{
                                position: 'absolute',
                                top: -6,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'rgba(2, 6, 23, 0.9)',
                                border: `1px solid ${p.config.brandColor}`,
                                borderRadius: '9999px',
                                padding: '2px 8px',
                                fontSize: '0.66rem',
                                fontWeight: 800,
                                color: '#ffffff',
                                whiteSpace: 'nowrap',
                                pointerEvents: 'none',
                                boxShadow: `0 4px 10px rgba(0,0,0,0.6)`,
                                letterSpacing: '0.04em',
                            }}
                        >
                            {p.config.name}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TechBuddiesArena;
