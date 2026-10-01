import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlinePaperAirplane } from 'react-icons/hi';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import toast from 'react-hot-toast';
import SectionHeader from '../components/ui/SectionHeader';
import ScrollReveal from '../components/animation/ScrollReveal';
import { sendContactEmail, getErrorMessage, type Profile } from '../services/api';

interface ContactSectionProps {
    profile: Profile | null;
    username: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile, username }) => {
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !subject.trim() || !message.trim()) {
            toast.error('Please complete all required fields');
            return;
        }

        setSending(true);
        const toastId = toast.loading('Sending your message...');

        try {
            const formData = new FormData();
            formData.append('email', email.trim());
            formData.append('subject', subject.trim());
            formData.append('message', message.trim());
            if (file) {
                formData.append('file', file);
            }

            await sendContactEmail(username, formData);
            toast.success('Message delivered successfully! I will reply shortly.', { id: toastId });
            setEmail('');
            setSubject('');
            setMessage('');
            setFile(null);
        } catch (err: any) {
            toast.error(getErrorMessage(err), { id: toastId });
        } finally {
            setSending(false);
        }
    };

    return (
        <section id="contact" className="section" style={{ background: 'rgb(var(--surface-rgb) / 0.3)' }}>
            <div className="container">
                <SectionHeader
                    badge="Contact"
                    title="Let's Build"
                    gradientTitle="Something Great"
                    subtitle="Have an opportunity, project proposal, or inquiry? Send a message directly or connect across channels."
                />

                <div className="contact-layout">
                    {/* Left: Contact Info Cards */}
                    <div className="contact-info-cards">
                        {profile?.email && (
                            <ScrollReveal direction="right" delay={0.1}>
                                <a href={`mailto:${profile.email}`} className="contact-method-card">
                                    <div className="contact-method-icon">
                                        <HiOutlineMail />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', color: 'rgb(var(--text-muted-rgb))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            Email Address
                                        </div>
                                        <div style={{ fontWeight: 600, color: 'rgb(var(--text-rgb))', wordBreak: 'break-all' }}>
                                            {profile.email}
                                        </div>
                                    </div>
                                </a>
                            </ScrollReveal>
                        )}

                        {profile?.phone && (
                            <ScrollReveal direction="right" delay={0.2}>
                                <a href={`tel:${profile.phone}`} className="contact-method-card">
                                    <div className="contact-method-icon">
                                        <HiOutlinePhone />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', color: 'rgb(var(--text-muted-rgb))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            Phone / WhatsApp
                                        </div>
                                        <div style={{ fontWeight: 600, color: 'rgb(var(--text-rgb))' }}>
                                            {profile.phone}
                                        </div>
                                    </div>
                                </a>
                            </ScrollReveal>
                        )}

                        {profile?.location && (
                            <ScrollReveal direction="right" delay={0.3}>
                                <div className="contact-method-card">
                                    <div className="contact-method-icon">
                                        <HiOutlineLocationMarker />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', color: 'rgb(var(--text-muted-rgb))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            Location Base
                                        </div>
                                        <div style={{ fontWeight: 600, color: 'rgb(var(--text-rgb))' }}>
                                            {profile.location}
                                        </div>
                                    </div>
                                </div>
                            </ScrollReveal>
                        )}

                        {/* Social Links Bar */}
                        <ScrollReveal direction="right" delay={0.4}>
                            <div className="glass-card" style={{ padding: 24, marginTop: 8 }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 14 }}>
                                    Connect Professionally
                                </div>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    {profile?.github && (
                                        <a
                                            href={profile.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="social-circle-btn"
                                            aria-label="GitHub Profile"
                                        >
                                            <FaGithub />
                                        </a>
                                    )}
                                    {profile?.linkedin && (
                                        <a
                                            href={profile.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="social-circle-btn"
                                            aria-label="LinkedIn Profile"
                                        >
                                            <FaLinkedinIn />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Right: Direct Contact Form */}
                    <ScrollReveal direction="left" delay={0.2}>
                        <form className="contact-form-card" onSubmit={handleSubmit}>
                            <h3 style={{ fontSize: '1.45rem', marginBottom: 20 }}>
                                Send Me a <span className="gradient-text">Direct Message</span>
                            </h3>

                            <div className="form-group">
                                <label className="form-label" htmlFor="contact-email">
                                    Your Email Address <span style={{ color: 'rgb(var(--accent-rgb))' }}>*</span>
                                </label>
                                <input
                                    id="contact-email"
                                    type="email"
                                    required
                                    placeholder="e.g. client@company.com"
                                    className="form-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="contact-subject">
                                    Subject <span style={{ color: 'rgb(var(--accent-rgb))' }}>*</span>
                                </label>
                                <input
                                    id="contact-subject"
                                    type="text"
                                    required
                                    placeholder="Project inquiry / Opportunity"
                                    className="form-input"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="contact-message">
                                    Message <span style={{ color: 'rgb(var(--accent-rgb))' }}>*</span>
                                </label>
                                <textarea
                                    id="contact-message"
                                    required
                                    rows={4}
                                    placeholder="Describe your project, timeline, or requirements..."
                                    className="form-textarea"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="contact-file">
                                    Attachment (Optional Project Spec / Brief)
                                </label>
                                <input
                                    id="contact-file"
                                    type="file"
                                    className="form-input"
                                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                                    style={{ padding: '9px 14px' }}
                                />
                            </div>

                            <motion.button
                                type="submit"
                                disabled={sending}
                                className="btn btn-primary btn-lg"
                                style={{ width: '100%', marginTop: 8 }}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                {sending ? (
                                    'Delivering Message...'
                                ) : (
                                    <>
                                        <HiOutlinePaperAirplane style={{ transform: 'rotate(90deg)' }} /> Send Message
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
