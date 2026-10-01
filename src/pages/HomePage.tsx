import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineCode, HiOutlineGlobe, HiOutlineArrowRight } from 'react-icons/hi';
import { motion } from 'framer-motion';
import AmbientBackground from '../components/animation/AmbientBackground';
import CustomCursor from '../components/CustomCursor';

export const HomePage = () => {
    const navigate = useNavigate();
    const [searchUser, setSearchUser] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchUser.trim()) {
            navigate(`/${searchUser.trim()}`);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <CustomCursor />
            <AmbientBackground />

            {/* Top Minimal Header */}
            <header style={{ padding: '24px 0', borderBottom: '1px solid rgb(var(--border-rgb) / 0.1)' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: '1.2rem' }}>
                        <span style={{
                            width: 32,
                            height: 32,
                            borderRadius: 'var(--radius-sm)',
                            background: 'linear-gradient(135deg, rgb(var(--primary-rgb)), rgb(var(--accent-rgb)))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            fontWeight: 900
                        }}>
                            P
                        </span>
                        <span>Portfolio<span style={{ color: 'rgb(var(--accent-rgb))' }}>Hub</span></span>
                    </div>

                    <a
                        href={import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174'}
                        className="btn btn-sm btn-outline"
                    >
                        <HiOutlineCode /> Admin Portal
                    </a>
                </div>
            </header>

            {/* Hero Main Content */}
            <main style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '80px 0' }}>
                <div className="container" style={{ textAlign: 'center', maxWidth: 840 }}>
                    <motion.div
                        className="section-badge"
                        initial={{ opacity: 0, scale: 0.9, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        🚀 SaaS Developer Portfolio Platform
                    </motion.div>

                    <motion.h1
                        style={{
                            fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
                            lineHeight: 1.1,
                            fontWeight: 900,
                            marginBottom: 24,
                            letterSpacing: '-0.03em'
                        }}
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        Showcase Your Work with <br />
                        <span className="gradient-text">World-Class Polish</span>
                    </motion.h1>

                    <motion.p
                        style={{
                            fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
                            color: 'rgb(var(--text-muted-rgb))',
                            lineHeight: 1.75,
                            maxWidth: 640,
                            margin: '0 auto 40px auto'
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Zero configuration, ultra-fluid animations, and instant custom brand theming for engineers and designers.
                    </motion.p>

                    {/* Direct Search / Visit Bar */}
                    <motion.form
                        onSubmit={handleSearch}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        style={{
                            display: 'flex',
                            gap: 10,
                            maxWidth: 480,
                            margin: '0 auto 36px auto',
                            background: 'rgb(var(--surface-rgb) / 0.8)',
                            padding: 8,
                            borderRadius: 'var(--radius-full)',
                            border: '1px solid rgb(var(--border-rgb) / 0.2)',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                            backdropFilter: 'blur(16px)'
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Enter username (e.g. umaisrehman)"
                            value={searchUser}
                            onChange={(e) => setSearchUser(e.target.value)}
                            style={{
                                flex: 1,
                                background: 'transparent',
                                border: 'none',
                                color: 'rgb(var(--text-rgb))',
                                padding: '10px 18px',
                                outline: 'none',
                                fontSize: '0.95rem',
                                fontFamily: 'inherit'
                            }}
                        />
                        <button type="submit" className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)' }}>
                            <HiOutlineGlobe /> View <HiOutlineArrowRight />
                        </button>
                    </motion.form>

                    {/* Quick Demo Links */}
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            className="btn btn-outline btn-sm"
                            onClick={() => navigate('/umaisrehman')}
                        >
                            View Live Demo: @umaisrehman
                        </button>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer style={{ padding: '24px 0', borderTop: '1px solid rgb(var(--border-rgb) / 0.1)', textAlign: 'center' }}>
                <div className="container">
                    <p style={{ color: 'rgb(var(--text-muted-rgb))', fontSize: '0.88rem' }}>
                        © {new Date().getFullYear()} Portfolio Platform. Enterprise SaaS Architecture.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
