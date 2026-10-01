import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineDocumentDownload, HiOutlineEye } from 'react-icons/hi';
import SectionHeader from '../components/ui/SectionHeader';
import ScrollReveal from '../components/animation/ScrollReveal';
import type { Profile } from '../services/api';

interface ResumeSectionProps {
    profile: Profile | null;
}

export const ResumeSection: React.FC<ResumeSectionProps> = ({ profile }) => {
    if (!profile?.resumeUrl) return null;

    return (
        <section id="resume" className="section">
            <div className="container">
                <SectionHeader
                    badge="Credentials"
                    title="Professional"
                    gradientTitle="Curriculum Vitae"
                    subtitle="Review my verified career trajectory, credentials, and technical milestone history."
                />

                <ScrollReveal direction="up" delay={0.15}>
                    <div className="resume-box">
                        <motion.div
                            className="resume-icon-circle"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        >
                            <HiOutlineDocumentDownload />
                        </motion.div>

                        <h3 style={{ fontSize: '1.75rem', marginBottom: 12 }}>
                            {profile.name}'s Official Resume
                        </h3>

                        <p style={{ color: 'rgb(var(--text-muted-rgb))', maxWidth: 560, margin: '0 auto 28px auto', fontSize: '1rem', lineHeight: 1.7 }}>
                            Ready for full-time roles, remote consulting, and technical leadership contracts.
                            Download the comprehensive PDF or view directly in your browser.
                        </p>

                        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <a
                                href={profile.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary btn-lg"
                            >
                                <HiOutlineDocumentDownload /> Download Resume (PDF)
                            </a>

                            <a
                                href={profile.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline btn-lg"
                            >
                                <HiOutlineEye /> View In New Tab
                            </a>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
};

export default ResumeSection;
