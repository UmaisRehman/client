import React from 'react';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { HiOutlineMail, HiArrowUp } from 'react-icons/hi';
import type { Profile } from '../../services/api';

interface FooterProps {
    profile: Profile | null;
}

export const Footer: React.FC<FooterProps> = ({ profile }) => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-inner">
                    <div className="footer-copy">
                        <p>© {new Date().getFullYear()} {profile?.name || 'Developer'}. Crafted with precision.</p>
                    </div>

                    <div className="footer-socials">
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
                        {profile?.email && (
                            <a
                                href={`mailto:${profile.email}`}
                                className="social-circle-btn"
                                aria-label="Send Email"
                            >
                                <HiOutlineMail />
                            </a>
                        )}
                        <button
                            onClick={scrollToTop}
                            className="social-circle-btn"
                            aria-label="Back to Top"
                            title="Back to Top"
                        >
                            <HiArrowUp />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
