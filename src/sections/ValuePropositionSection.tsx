import React from 'react';
import {
    HiOutlineLightningBolt,
    HiOutlineShieldCheck,
    HiOutlineSparkles,
    HiOutlineUserGroup,
    HiOutlineMail,
    HiOutlinePhone,
    HiOutlineCheckCircle,
} from 'react-icons/hi';
import SectionHeader from '../components/ui/SectionHeader';
import ScrollReveal from '../components/animation/ScrollReveal';
import type { Profile } from '../services/api';

interface ValuePropositionSectionProps {
    profile: Profile | null;
}

export const ValuePropositionSection: React.FC<ValuePropositionSectionProps> = ({ profile }) => {
    const scrollToContact = () => {
        const el = document.getElementById('contact');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    const valuePillars = [
        {
            icon: HiOutlineLightningBolt,
            title: 'Full-Cycle Velocity',
            subtitle: 'Concept to Production',
            description:
                'From database modeling and secure backend APIs to polished 60fps frontend UIs. No gaps, no handoff bottlenecks, just fast, reliable releases.',
            badge: 'Speed & Execution',
            color: 'rgb(var(--accent-rgb))',
        },
        {
            icon: HiOutlineShieldCheck,
            title: 'Enterprise Clean Code',
            subtitle: 'Zero Tech Debt Standard',
            description:
                'Strict TypeScript, decoupled components, index-optimized database queries, and architectural guardrails that scale effortlessly as your users grow.',
            badge: 'Scalability',
            color: 'rgb(var(--primary-rgb))',
        },
        {
            icon: HiOutlineSparkles,
            title: 'Award-Winning Polish',
            subtitle: 'Sub-Second Performance',
            description:
                'Fluid micro-interactions, responsive layouts across every device, and lighthouse-optimized assets that make clients and users say "wow".',
            badge: 'UX Delight',
            color: 'rgb(var(--secondary-rgb))',
        },
        {
            icon: HiOutlineUserGroup,
            title: 'Proactive Ownership',
            subtitle: 'Clear, Transparent Comms',
            description:
                'Daily async status reports, clear milestone estimation, clean commit histories, and post-launch support to guarantee your project success.',
            badge: 'Reliability',
            color: 'rgb(var(--success-rgb))',
        },
    ];

    const hiringChecklist = [
        'Available for Full-time Roles & High-Value Freelance Projects',
        'Immediate Start / Flexible Global Timezone Collaboration',
        'MERN Stack + Next.js + .NET Core MVC Proficiency',
        '100% Code Quality Guarantee & Clean Documentation',
    ];

    return (
        <section id="why-hire-me" className="section" style={{ background: 'rgb(var(--surface-rgb) / 0.25)' }}>
            <div className="container">
                <SectionHeader
                    badge="Client & Recruiter Advantage"
                    title="Why Partner With"
                    gradientTitle="Umais Rehman"
                    subtitle="Proven technical competence, architectural rigor, and end-to-end execution that saves companies hundreds of engineering hours."
                />

                {/* 4 Pillars Grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: 24,
                        marginBottom: 48,
                    }}
                >
                    {valuePillars.map((pillar, i) => {
                        const Icon = pillar.icon;
                        return (
                            <ScrollReveal key={pillar.title} direction="up" delay={i * 0.1}>
                                <div
                                    className="glass-card"
                                    style={{
                                        padding: 32,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: -20,
                                            right: -20,
                                            width: 100,
                                            height: 100,
                                            borderRadius: '50%',
                                            background: pillar.color,
                                            opacity: 0.08,
                                            filter: 'blur(30px)',
                                        }}
                                    />

                                    <div
                                        style={{
                                            width: 52,
                                            height: 52,
                                            borderRadius: 'var(--radius-md)',
                                            background: `rgb(var(--surface-hover-rgb))`,
                                            border: `1px solid ${pillar.color}`,
                                            color: pillar.color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.6rem',
                                            marginBottom: 20,
                                            boxShadow: `0 4px 15px rgba(0,0,0,0.3)`,
                                        }}
                                    >
                                        <Icon />
                                    </div>

                                    <span
                                        style={{
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.08em',
                                            color: pillar.color,
                                            marginBottom: 8,
                                        }}
                                    >
                                        {pillar.badge}
                                    </span>

                                    <h3 style={{ fontSize: '1.35rem', marginBottom: 4 }}>{pillar.title}</h3>
                                    <h4 style={{ fontSize: '0.9rem', color: 'rgb(var(--text-muted-rgb))', fontWeight: 500, marginBottom: 16 }}>
                                        {pillar.subtitle}
                                    </h4>

                                    <p style={{ color: 'rgb(var(--text-muted-rgb))', fontSize: '0.92rem', lineHeight: 1.7, marginTop: 'auto' }}>
                                        {pillar.description}
                                    </p>
                                </div>
                            </ScrollReveal>
                        );
                    })}
                </div>

                {/* Instant Recruiter / Client Acquisition CTA Card */}
                <ScrollReveal direction="up" delay={0.3}>
                    <div
                        className="glass-card"
                        style={{
                            padding: '40px',
                            background: 'linear-gradient(135deg, rgb(var(--surface-rgb) / 0.9), rgb(var(--surface-hover-rgb) / 0.7))',
                            border: '1px solid rgb(var(--primary-rgb) / 0.35)',
                            boxShadow: '0 20px 50px -15px rgb(var(--primary-rgb) / 0.25)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 32,
                        }}
                    >
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
                            {hiringChecklist.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <HiOutlineCheckCircle style={{ color: 'rgb(var(--success-rgb))', fontSize: '1.4rem', flexShrink: 0 }} />
                                    <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'rgb(var(--text-rgb))' }}>
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: 20,
                                borderTop: '1px solid rgb(var(--border-rgb) / 0.15)',
                                paddingTop: 28,
                            }}
                        >
                            <div>
                                <h4 style={{ fontSize: '1.25rem', marginBottom: 4 }}>
                                    Ready to scale your product or hire a dedicated engineer?
                                </h4>
                                <p style={{ color: 'rgb(var(--text-muted-rgb))', fontSize: '0.95rem' }}>
                                    Let's connect for an introductory call or discuss your deliverables.
                                </p>
                            </div>

                            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                                <button
                                    className="btn btn-primary btn-lg"
                                    onClick={scrollToContact}
                                >
                                    <HiOutlineMail /> Hire / Get In Touch
                                </button>

                                {profile?.phone && (
                                    <a
                                        href={`https://wa.me/${profile.phone.replace(/[^0-9]/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-outline btn-lg"
                                    >
                                        <HiOutlinePhone /> Quick Chat (WhatsApp)
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
};

export default ValuePropositionSection;
