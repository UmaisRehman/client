import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { THEMES, type ThemePreset, applyTheme } from '../../config/theme';
import type { Profile } from '../../services/api';

interface NavbarProps {
    profile: Profile | null;
    activeSection: string;
    onThemeChange?: (theme: ThemePreset) => void;
    currentTheme?: ThemePreset;
}

export const Navbar = ({
    profile,
    activeSection,
    onThemeChange,
    currentTheme = 'midnight',
}: NavbarProps) => {
    const [hidden, setHidden] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [themeMenuOpen, setThemeMenuOpen] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            if (currentY > lastScrollY && currentY > 240) {
                setHidden(true);
            } else {
                setHidden(false);
            }
            setLastScrollY(currentY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const scrollTo = (id: string) => {
        setMobileOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleThemeSelect = (themeKey: ThemePreset) => {
        applyTheme(themeKey);
        if (onThemeChange) onThemeChange(themeKey);
        setThemeMenuOpen(false);
    };

    const navItems = [
        { id: 'hero', label: 'Home' },
        { id: 'about', label: 'About' },
        { id: 'projects', label: 'Projects' },
        { id: 'why-hire-me', label: 'Why Hire Me' },
        ...(profile?.resumeUrl ? [{ id: 'resume', label: 'Resume' }] : []),
        { id: 'contact', label: 'Contact' },
    ];

    return (
        <>
            <header className={`navbar-wrapper ${hidden ? 'nav-hidden' : ''}`}>
                <nav className="navbar">
                    <div className="nav-brand" onClick={() => scrollTo('hero')} style={{ cursor: 'pointer' }}>
                        {profile?.avatarUrl && (
                            <img
                                src={profile.avatarUrl}
                                alt={profile.name}
                                className="nav-brand-avatar"
                            />
                        )}
                        <span>{profile?.name || 'Portfolio'}</span>
                    </div>

                    <ul className="nav-links">
                        {navItems.map((item) => (
                            <li key={item.id}>
                                <button
                                    className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                                    onClick={() => scrollTo(item.id)}
                                >
                                    {item.label}
                                    {activeSection === item.id && (
                                        <motion.div
                                            layoutId="navIndicator"
                                            className="nav-indicator"
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="nav-cta">
                        {/* Theme Switcher Quick Dropdown */}
                        <div style={{ position: 'relative' }}>
                            <button
                                className="btn btn-sm btn-ghost"
                                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                                title="Switch Brand Theme"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    border: '1px solid rgb(var(--border-rgb) / 0.2)',
                                    borderRadius: 'var(--radius-full)',
                                }}
                            >
                                <span
                                    style={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, rgb(var(--primary-rgb)), rgb(var(--accent-rgb)))',
                                    }}
                                />
                                <span style={{ fontSize: '0.8rem', textTransform: 'capitalize' }}>
                                    {currentTheme}
                                </span>
                            </button>

                            <AnimatePresence>
                                {themeMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        style={{
                                            position: 'absolute',
                                            top: '110%',
                                            right: 0,
                                            marginTop: 8,
                                            background: 'rgb(var(--surface-rgb))',
                                            border: '1px solid rgb(var(--border-rgb) / 0.2)',
                                            borderRadius: 'var(--radius-md)',
                                            padding: 8,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 4,
                                            minWidth: 160,
                                            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                                            zIndex: 100,
                                        }}
                                    >
                                        {(Object.keys(THEMES) as ThemePreset[]).map((key) => (
                                            <button
                                                key={key}
                                                onClick={() => handleThemeSelect(key)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 10,
                                                    padding: '8px 12px',
                                                    borderRadius: 'var(--radius-sm)',
                                                    color: currentTheme === key ? '#ffffff' : 'rgb(var(--text-muted-rgb))',
                                                    background: currentTheme === key ? 'rgb(var(--primary-rgb) / 0.2)' : 'transparent',
                                                    fontSize: '0.85rem',
                                                    textAlign: 'left',
                                                    cursor: 'pointer',
                                                    width: '100%',
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        width: 12,
                                                        height: 12,
                                                        borderRadius: '50%',
                                                        background: `rgb(${THEMES[key].primaryRgb})`,
                                                    }}
                                                />
                                                {THEMES[key].name}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            className="btn btn-sm btn-primary"
                            onClick={() => scrollTo('contact')}
                        >
                            Let's Talk
                        </button>

                        <button
                            className="mobile-menu-btn"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Toggle navigation menu"
                        >
                            {mobileOpen ? <HiX /> : <HiMenuAlt3 />}
                        </button>
                    </div>
                </nav>
            </header>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        className="mobile-nav-drawer"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                className={`mobile-nav-link ${activeSection === item.id ? 'active' : ''}`}
                                onClick={() => scrollTo(item.id)}
                            >
                                {item.label}
                            </button>
                        ))}

                        <div style={{ marginTop: 20 }}>
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={() => scrollTo('contact')}
                            >
                                Let's Talk
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
