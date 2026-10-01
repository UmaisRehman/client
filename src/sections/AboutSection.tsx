import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineGlobe } from 'react-icons/hi';
import SectionHeader from '../components/ui/SectionHeader';
import ScrollReveal from '../components/animation/ScrollReveal';
import type { Profile } from '../services/api';

interface AboutSectionProps {
    profile: Profile | null;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
    return (
        <section id="about" className="section">
            <div className="container">
                <SectionHeader
                    badge="Background"
                    title="Engineered with"
                    gradientTitle="Precision & Passion"
                    subtitle="A glimpse into my engineering journey, problem-solving mindset, and core competencies."
                />

                <div className="about-bento">
                    {/* Left: Detailed Bio & Philosophy */}
                    <ScrollReveal direction="up" delay={0.1}>
                        <div className="glass-card about-main-card" style={{ height: '100%' }}>
                            <div>
                                <h3 style={{ fontSize: '1.65rem', marginBottom: 20 }}>
                                    About <span className="gradient-text">{profile?.name || 'Me'}</span>
                                </h3>

                                <div className="about-bio-text">
                                    {profile?.bio ||
                                        'Passionate Full Stack Software Engineer focused on crafting resilient, scalable web architectures and fluid user interfaces.'}
                                </div>
                            </div>

                            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgb(var(--border-rgb) / 0.12)' }}>
                                <p style={{ fontSize: '0.92rem', color: 'rgb(var(--accent-rgb))', fontWeight: 600 }}>
                                    💡 Philosophy: Write clean code, minimize tech debt, and optimize for end-user delight.
                                </p>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Right: Avatar, Quick Info & Skills */}
                    <div className="about-side-stack">
                        {/* Avatar & Contact Snapshot */}
                        <ScrollReveal direction="left" delay={0.2}>
                            <div className="glass-card about-avatar-card">
                                {profile?.avatarUrl && (
                                    <img
                                        src={profile.avatarUrl}
                                        alt={profile.name}
                                        className="about-avatar-img"
                                    />
                                )}
                                <div className="about-info-list">
                                    {profile?.location && (
                                        <div className="about-info-item">
                                            <HiOutlineLocationMarker />
                                            <span>{profile.location}</span>
                                        </div>
                                    )}
                                    {profile?.email && (
                                        <div className="about-info-item">
                                            <HiOutlineMail />
                                            <span>{profile.email}</span>
                                        </div>
                                    )}
                                    {profile?.phone && (
                                        <div className="about-info-item">
                                            <HiOutlinePhone />
                                            <span>{profile.phone}</span>
                                        </div>
                                    )}
                                    {profile?.website && (
                                        <div className="about-info-item">
                                            <HiOutlineGlobe />
                                            <span>{profile.website}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* Core Skills & Tech Stack */}
                        {profile?.skills && profile.skills.length > 0 && (
                            <ScrollReveal direction="left" delay={0.3}>
                                <div className="glass-card skills-card">
                                    <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'rgb(var(--text-rgb))', marginBottom: 16 }}>
                                        Skills & Core Technologies
                                    </h4>

                                    <div className="skills-wrapper">
                                        {profile.skills.map((skill, i) => (
                                            <motion.span
                                                key={i}
                                                className="skill-chip"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                            >
                                                {skill.trim()}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>
                            </ScrollReveal>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
