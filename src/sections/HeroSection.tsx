import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineArrowDown, HiOutlineDocumentDownload, HiOutlineMail } from 'react-icons/hi';
import TechBuddiesArena from '../components/animation/TechBuddiesArena';
import type { Profile } from '../services/api';

interface HeroSectionProps {
    profile: Profile | null;
    projectsCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile, projectsCount }) => {
    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.15,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
        },
    };

    return (
        <section id="hero" className="section" style={{ minHeight: '92vh', display: 'flex', alignItems: 'center', position: 'relative' }}>
            {/* Interactive Multiplayer Tech Buddies Arena (Hands, Feet & Bumping Game Physics) */}
            <TechBuddiesArena />

            <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                <motion.div
                    className="hero-content"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={itemVariants}>
                        <div className="hero-status-pill">
                            <span className="hero-status-dot" />
                            <span>Available for high-impact roles & projects</span>
                        </div>
                    </motion.div>

                    <motion.h1 className="hero-headline" variants={itemVariants}>
                        Hi, I'm <span className="gradient-text">{profile?.name || 'Developer'}</span>
                        <br />
                        <span style={{ color: 'rgb(var(--text-rgb))' }}>
                            {profile?.tagline || 'Full Stack Engineer'}
                        </span>
                    </motion.h1>

                    <motion.p className="hero-bio" variants={itemVariants}>
                        {profile?.bio
                            ? profile.bio.split('\n')[0]
                            : 'Architecting resilient SaaS solutions, modern web apps, and ultra-smooth digital products.'}
                    </motion.p>

                    <motion.div className="hero-actions" variants={itemVariants}>
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={() => scrollTo('projects')}
                        >
                            Explore Projects <HiOutlineArrowDown />
                        </button>

                        <button
                            className="btn btn-outline btn-lg"
                            onClick={() => scrollTo('contact')}
                        >
                            <HiOutlineMail /> Contact Me
                        </button>

                        {profile?.resumeUrl && (
                            <a
                                href={profile.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-ghost btn-lg"
                            >
                                <HiOutlineDocumentDownload /> View CV
                            </a>
                        )}
                    </motion.div>

                    <motion.div className="hero-stats-bar" variants={itemVariants}>
                        <div className="hero-stat-card">
                            <div className="hero-stat-number">{projectsCount}+</div>
                            <div className="hero-stat-label">Featured Projects</div>
                        </div>

                        <div className="hero-stat-card">
                            <div className="hero-stat-number">
                                {profile?.skills ? profile.skills.length : 8}+
                            </div>
                            <div className="hero-stat-label">Core Technologies</div>
                        </div>

                        <div className="hero-stat-card">
                            <div className="hero-stat-number">100%</div>
                            <div className="hero-stat-label">Production Ready</div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
