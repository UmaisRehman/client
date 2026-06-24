import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjects, getProfile, sendContactEmail, getErrorMessage, type Project, type Profile } from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    HiOutlineExternalLink, HiOutlineCode, HiOutlineDocumentDownload,
    HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker,
    HiOutlineGlobe, HiX, HiMenuAlt3, HiOutlinePaperAirplane
} from 'react-icons/hi';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';

// Animation components
import SmoothScroll from '../components/SmoothScroll';
import CustomCursor from '../components/CustomCursor';
import Preloader from '../components/Preloader';
import TextReveal from '../components/TextReveal';
import MagneticButton from '../components/MagneticButton';
import InfiniteMarquee from '../components/InfiniteMarquee';
import CountUp from '../components/CountUp';

gsap.registerPlugin(ScrollTrigger);

// --- Helper: 3D Tilt Card ---
const TiltCard = ({ children, className = '', style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => {
    const ref = useRef<HTMLDivElement>(null);
    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);
    const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
    const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        rotateX.set(((y - centerY) / centerY) * -8);
        rotateY.set(((x - centerX) / centerX) * 8);
    };

    const handleMouseLeave = () => {
        rotateX.set(0);
        rotateY.set(0);
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            style={{
                ...style,
                perspective: 1000,
                transformStyle: 'preserve-3d',
                rotateX: springRotateX,
                rotateY: springRotateY,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </motion.div>
    );
};

// --- Helper: Stagger container for scroll-reveal ---
const StaggerReveal = ({
    children,
    className = '',
    style = {},
    staggerDelay = 0.08,
}: {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    staggerDelay?: number;
}) => {
    return (
        <motion.div
            className={className}
            style={style}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
                visible: {
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
        >
            {children}
        </motion.div>
    );
};

const fadeUpVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        },
    },
};

// ==============================
// MAIN PORTFOLIO PAGE
// ==============================
const PortfolioPage = () => {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [scrolled, setScrolled] = useState(false);
    const [filter, setFilter] = useState('All');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [preloaderDone, setPreloaderDone] = useState(false);
    const [navHidden, setNavHidden] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');

    const projectsWrapperRef = useRef<HTMLDivElement>(null);
    const projectsTrackRef = useRef<HTMLDivElement>(null);

    const [contactEmail, setContactEmail] = useState('');
    const [contactSubject, setContactSubject] = useState('');
    const [contactMessage, setContactMessage] = useState('');
    const [contactFile, setContactFile] = useState<File | null>(null);
    const [sendingContact, setSendingContact] = useState(false);

    // Mouse position for hero gradient follow
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });
    const smoothMouseY = useSpring(mouseY, { stiffness: 30, damping: 20 });

    // Scroll progress
    const { scrollYProgress } = useScroll();
    const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

    // Hero parallax
    const heroParallax = useTransform(scrollYProgress, [0, 0.3], [0, -100]);

    // Dynamic gradient transformations (defined at top level to satisfy Rules of Hooks)
    const heroGradient1X = useTransform(smoothMouseX, (val) => {
        const width = typeof window !== 'undefined' ? window.innerWidth : 1920;
        return ((val / (width || 1)) * 60) - 30;
    });
    const heroGradient1Y = useTransform(smoothMouseY, (val) => {
        const height = typeof window !== 'undefined' ? window.innerHeight : 1080;
        return ((val / (height || 1)) * 60) - 30;
    });
    const heroGradient2X = useTransform(smoothMouseX, (val) => {
        const width = typeof window !== 'undefined' ? window.innerWidth : 1920;
        return 20 - ((val / (width || 1)) * 40);
    });
    const heroGradient2Y = useTransform(smoothMouseY, (val) => {
        const height = typeof window !== 'undefined' ? window.innerHeight : 1080;
        return 20 - ((val / (height || 1)) * 40);
    });

    // Refs for GSAP scroll animations
    const heroRef = useRef<HTMLDivElement>(null);
    const lastScrollY = useRef(0);

    useEffect(() => {
        if (username) fetchData();
    }, [username]);

    // Smart navbar hide/show & active section tracking
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrolled(currentScrollY > 50);
            if (currentScrollY > lastScrollY.current && currentScrollY > 200) {
                setNavHidden(true);
            } else {
                setNavHidden(false);
            }
            lastScrollY.current = currentScrollY;

            // Track active section
            const sections = ['hero', 'about', 'projects', 'contact'];
            for (const section of sections) {
                const el = document.getElementById(section);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= window.innerHeight * 0.35 && rect.bottom >= window.innerHeight * 0.35) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        handleScroll();
        handleResize();

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Mouse tracking for hero gradients
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // GSAP scroll and intro animations after preloader
    useEffect(() => {
        if (!preloaderDone || loading) return;

        // Cinematic Hero Entry Stagger Timeline
        const introTl = gsap.timeline({ delay: 0.25 });
        
        introTl.fromTo('.hero-badge',
            { opacity: 0, scale: 0.8, y: 30, filter: 'blur(8px)' },
            { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: 1.0, ease: 'power4.out' }
        );

        introTl.fromTo('.hero-title-anim',
            { opacity: 0, y: 80, rotateX: 10 },
            { opacity: 1, y: 0, rotateX: 0, duration: 1.0, ease: 'power4.out', stagger: 0.12 },
            '-=0.75'
        );

        introTl.fromTo('.hero-desc-anim',
            { opacity: 0, y: 30, filter: 'blur(4px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' },
            '-=0.7'
        );

        introTl.fromTo('.hero-btn-anim',
            { opacity: 0, scale: 0.85, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 0.75, ease: 'back.out(1.5)', stagger: 0.15 },
            '-=0.6'
        );

        introTl.fromTo('.hero-stat-anim',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', stagger: 0.12 },
            '-=0.55'
        );

        // Animate hero floating shapes
        gsap.utils.toArray<HTMLElement>('.float-shape').forEach((el, i) => {
            gsap.to(el, {
                y: `${(i % 2 === 0 ? -1 : 1) * (20 + i * 10)}`,
                x: `${(i % 2 === 0 ? 1 : -1) * (10 + i * 5)}`,
                rotation: (i % 2 === 0 ? 1 : -1) * 15,
                duration: 4 + i,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
            });
        });

        // Animate about section items on scroll
        gsap.utils.toArray<HTMLElement>('.gsap-fade-up').forEach((el) => {
            gsap.fromTo(el,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                }
            );
        });

        // Stagger skill chips
        const skillChips = gsap.utils.toArray<HTMLElement>('.skill-chip-anim');
        if (skillChips.length > 0) {
            gsap.fromTo(skillChips,
                { opacity: 0, scale: 0, y: 20 },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.05,
                    ease: 'back.out(1.7)',
                    scrollTrigger: {
                        trigger: skillChips[0]?.parentElement,
                        start: 'top 80%',
                        toggleActions: 'play none none none',
                    },
                }
            );
        }

        // Contact cards alternate slide
        gsap.utils.toArray<HTMLElement>('.contact-card-anim').forEach((el, i) => {
            gsap.fromTo(el,
                { opacity: 0, x: i % 2 === 0 ? -60 : 60 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.7,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        toggleActions: 'play none none none',
                    },
                }
            );
        });

        // Pinned Horizontal Scroll Gallery (Desktop Only)
        let pinTrigger: gsap.core.Tween | null = null;
        if (!isMobile && projects.length > 0) {
            const track = projectsTrackRef.current;
            const wrapper = projectsWrapperRef.current;
            if (track && wrapper) {
                const trackWidth = track.scrollWidth;
                const scrollDistance = trackWidth - window.innerWidth;

                pinTrigger = gsap.to(track, {
                    x: -scrollDistance,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: wrapper,
                        start: 'top top',
                        end: () => `+=${scrollDistance}`,
                        scrub: 1,
                        pin: true,
                        invalidateOnRefresh: true,
                    }
                });
            }
        }

        return () => {
            if (pinTrigger) {
                pinTrigger.scrollTrigger?.kill();
                pinTrigger.kill();
            }
            ScrollTrigger.getAll().forEach(st => st.kill());
        };
    }, [preloaderDone, loading, projects, profile, isMobile, filter]);

    const fetchData = async () => {
        try {
            const [profileRes, projectsRes] = await Promise.all([
                getProfile(username!),
                getProjects(username!)
            ]);
            setProfile(profileRes.data.profile);

            // Only show projects that have the "Featured" toggle ON
            const visibleProjects = projectsRes.data.projects.filter((p: Project) => p.featured);
            setProjects(visibleProjects);

            const avatarUrl = profileRes.data.profile?.avatarUrl;
            if (avatarUrl) {
                const favicon = document.getElementById('favicon') as HTMLLinkElement;
                if (favicon) favicon.href = avatarUrl;
            }

            document.title = `${profileRes.data.profile?.name || username} - Portfolio`;
        } catch (err: any) {
            if (err.response?.status === 404) {
                navigate('/not-found', { replace: true });
                return;
            }
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!contactEmail || !contactSubject || !contactMessage) {
            toast.error('Please fill in all required fields');
            return;
        }

        setSendingContact(true);
        try {
            const formData = new FormData();
            formData.append('senderEmail', contactEmail);
            formData.append('subject', contactSubject);
            formData.append('message', contactMessage);
            if (contactFile) {
                formData.append('attachment', contactFile);
            }

            const { data } = await sendContactEmail(username!, formData);
            toast.success(data.message || 'Message sent successfully!');
            setContactEmail('');
            setContactSubject('');
            setContactMessage('');
            setContactFile(null);
        } catch (err: any) {
            toast.error(getErrorMessage(err));
        } finally {
            setSendingContact(false);
        }
    };

    const handlePreloaderComplete = useCallback(() => {
        setPreloaderDone(true);
    }, []);

    const categories = ['All', ...new Set(projects.map((p) => p.category))];
    const filteredProjects = filter === 'All' ? projects : projects.filter((p) => p.category === filter);

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
    };

    const allSkills = [
        ...(profile?.skills || []),
        ...projects.flatMap(p => p.techStack)
    ].map(t => t.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]+$/, ''));
    const uniqueSkillCount = new Set(allSkills).size;
    const marqueeItems = profile?.skills?.length ? profile.skills : ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Design'];

    // Error state
    if (error) {
        return (
            <div style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexDirection: 'column', textAlign: 'center',
                padding: 40, background: 'var(--bg-primary)'
            }}>
                <div style={{ fontSize: 60, marginBottom: 16 }}>⚠️</div>
                <h2 style={{ color: 'var(--neutral-100)', marginBottom: 8 }}>Something went wrong</h2>
                <p style={{ color: 'var(--neutral-400)', marginBottom: 24 }}>{error}</p>
                <button className="btn btn-primary" onClick={() => window.location.reload()}>Try Again</button>
            </div>
        );
    }

    // Show preloader while loading OR until preloader animation is done
    if (loading || !preloaderDone) {
        return (
            <Preloader
                name={profile?.name || username || 'Portfolio'}
                onComplete={handlePreloaderComplete}
            />
        );
    }

    return (
        <SmoothScroll>
            <CustomCursor />

            {/* Global cursor spotlight glow */}
            <motion.div
                className="global-spotlight"
                style={{
                    x: smoothMouseX,
                    y: smoothMouseY,
                }}
            />

            {/* Sleek Sidebar Dot Indicators */}
            <div className="sidebar-nav-dots">
                {['hero', 'about', ...(projects.length > 0 ? ['projects'] : []), 'contact'].map((section) => (
                    <button
                        key={section}
                        className={`sidebar-dot-wrapper ${activeSection === section ? 'active' : ''}`}
                        onClick={() => scrollToSection(section)}
                    >
                        <span className="sidebar-dot-label">
                            {section === 'hero' ? 'Home' : section}
                        </span>
                        <div className="sidebar-dot" />
                    </button>
                ))}
            </div>

            {/* Scroll Progress Bar */}
            <motion.div className="scroll-progress" style={{ scaleX }} />

            {/* ============ NAVBAR ============ */}
            <motion.nav
                className={`navbar ${scrolled ? 'scrolled' : ''}`}
                initial={{ y: -100 }}
                animate={{ y: navHidden ? -100 : 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="container">
                    <MagneticButton>
                        <div className="nav-logo" onClick={() => scrollToSection('hero')}>
                            {profile?.avatarUrl && (
                                <img src={profile.avatarUrl} alt={profile.name} className="nav-avatar" />
                            )}
                            <span>{profile?.name?.split(' ')[0] || 'Portfolio'}</span>
                        </div>
                    </MagneticButton>
                    <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
                        {['hero', 'about', ...(projects.length > 0 ? ['projects'] : []), 'contact'].map((section) => (
                            <li key={section}>
                                <MagneticButton strength={0.2}>
                                    <a onClick={() => scrollToSection(section)}>
                                        {section === 'hero' ? 'Home' : section.charAt(0).toUpperCase() + section.slice(1)}
                                    </a>
                                </MagneticButton>
                            </li>
                        ))}
                        {profile?.resumeUrl && (
                            <li>
                                <MagneticButton strength={0.2}>
                                    <a
                                        href={profile.resumeUrl}
                                        download
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="nav-resume-btn"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        Resume
                                    </a>
                                </MagneticButton>
                            </li>
                        )}
                    </ul>
                    <button className="nav-mobile-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <HiX /> : <HiMenuAlt3 />}
                    </button>
                </div>
            </motion.nav>

            {/* ============ HERO ============ */}
            <section id="hero" className="hero" ref={heroRef}>
                <div className="hero-bg">
                    <motion.div
                        className="hero-gradient-1"
                        style={{
                            x: heroGradient1X,
                            y: heroGradient1Y,
                        }}
                    />
                    <motion.div
                        className="hero-gradient-2"
                        style={{
                            x: heroGradient2X,
                            y: heroGradient2Y,
                        }}
                    />
                    <div className="hero-gradient-3" />
                    <div className="hero-grid" />

                    {/* Floating geometric shapes */}
                    <div className="float-shape float-shape-1" />
                    <div className="float-shape float-shape-2" />
                    <div className="float-shape float-shape-3" />
                    <div className="float-shape float-shape-4" />
                    <div className="float-shape float-shape-5" />
                </div>

                <motion.div className="container" style={{ y: heroParallax }}>
                    <div className="hero-content">
                        <div className="hero-badge" style={{ opacity: 0 }}>
                            Available for Work
                        </div>

                        <h1 className="hero-title" style={{ perspective: 1000 }}>
                            <div style={{ overflow: 'hidden' }}>
                                <span className="hero-title-anim" style={{ display: 'inline-block', opacity: 0 }}>
                                    Hi, I'm{" "}
                                </span>
                            </div>
                            <div style={{ overflow: 'hidden' }}>
                                <span className="hero-title-anim gradient-text gradient-text-shimmer" style={{ display: 'inline-block', opacity: 0 }}>
                                    {profile?.name || 'Developer'}
                                </span>
                            </div>
                        </h1>

                        <p className="hero-description hero-desc-anim" style={{ opacity: 0 }}>
                            {profile?.tagline ? profile.tagline + ' ' : ''}
                            {profile?.tagline && profile?.bio ? '— ' : ''}
                            {profile?.bio ? profile.bio.substring(0, 150) : ''}
                            {profile?.bio && profile.bio.length > 150 ? '...' : ''}
                        </p>

                        <div className="hero-buttons">
                            {projects.length > 0 && (
                                <div className="hero-btn-anim" style={{ opacity: 0, display: 'inline-block' }}>
                                    <MagneticButton>
                                        <button className="btn btn-primary" onClick={() => scrollToSection('projects')}>
                                            <HiOutlineCode /> View My Work
                                        </button>
                                    </MagneticButton>
                                </div>
                            )}
                            <div className="hero-btn-anim" style={{ opacity: 0, display: 'inline-block', marginLeft: projects.length > 0 ? 12 : 0 }}>
                                <MagneticButton>
                                    <button className="btn btn-outline" onClick={() => scrollToSection('contact')}>
                                        <HiOutlineMail /> Get In Touch
                                    </button>
                                </MagneticButton>
                            </div>
                        </div>

                        {projects.length > 0 && (
                            <div className="hero-stats">
                                <div className="hero-stat hero-stat-anim" style={{ opacity: 0 }}>
                                    <h3>
                                        <CountUp end={projects.length} />
                                        <span>+</span>
                                    </h3>
                                    <p>Projects</p>
                                </div>
                                <div className="hero-stat hero-stat-anim" style={{ opacity: 0 }}>
                                    <h3>
                                        <CountUp end={uniqueSkillCount} />
                                        <span>+</span>
                                    </h3>
                                    <p>Technologies</p>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </section>

            {/* ============ MARQUEE DIVIDER ============ */}
            {marqueeItems.length > 0 && (
                <div className="marquee-section">
                    <InfiniteMarquee items={marqueeItems} speed={60} direction="left" />
                </div>
            )}

            {/* ============ ABOUT ============ */}
            <section id="about" className="section">
                <div className="container">
                    <div className="section-header">
                        <motion.div
                            className="section-label"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            About Me
                        </motion.div>
                        <TextReveal as="h2" className="section-title" mode="words" trigger="scroll">
                            Get To Know Me
                        </TextReveal>
                        <motion.div
                            className="section-divider"
                            initial={{ width: 0 }}
                            whileInView={{ width: 60 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        />
                    </div>

                    <div className="about-content">
                        <div className="about-text">
                            <div className="gsap-fade-up">
                                <h3>{profile?.tagline ? profile.tagline : 'About Me'}</h3>
                            </div>
                            {profile?.bio && (
                                <div className="gsap-fade-up">
                                    <p>{profile.bio}</p>
                                </div>
                            )}

                            <StaggerReveal className="about-info-grid" staggerDelay={0.1}>
                                {profile?.location && (
                                    <motion.div className="about-info-item" variants={fadeUpVariant}>
                                        <HiOutlineLocationMarker />
                                        <span>{profile.location}</span>
                                    </motion.div>
                                )}
                                {profile?.email && (
                                    <motion.div className="about-info-item" variants={fadeUpVariant}>
                                        <HiOutlineMail />
                                        <span>{profile.email}</span>
                                    </motion.div>
                                )}
                                {profile?.phone && (
                                    <motion.div className="about-info-item" variants={fadeUpVariant}>
                                        <HiOutlinePhone />
                                        <span>{profile.phone}</span>
                                    </motion.div>
                                )}
                                {profile?.website && (
                                    <motion.div className="about-info-item" variants={fadeUpVariant}>
                                        <HiOutlineGlobe />
                                        <span>{profile.website}</span>
                                    </motion.div>
                                )}
                            </StaggerReveal>

                            {profile?.skills && profile.skills.length > 0 && (
                                <div className="skills-section gsap-fade-up">
                                    <h4>Skills & Technologies</h4>
                                    <div className="skills-grid">
                                        {profile.skills.map((skill, i) => (
                                            <span key={i} className="skill-chip skill-chip-anim">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ PROJECTS ============ */}
            {projects.length > 0 && (
                isMobile ? (
                    // Standard Vertical Grid on Mobile
                    <section id="projects" className="section" style={{ background: 'rgba(15,23,42,0.5)' }}>
                        <div className="container">
                            <div className="section-header">
                                <motion.div
                                    className="section-label"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}
                                >
                                    My Work
                                </motion.div>
                                <TextReveal as="h2" className="section-title" mode="words" trigger="scroll">
                                    Featured Projects
                                </TextReveal>
                                <motion.p
                                    className="section-subtitle"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                >
                                    Here are some of the projects I've worked on. Each one was built with passion and attention to detail.
                                </motion.p>
                                <motion.div
                                    className="section-divider"
                                    initial={{ width: 0 }}
                                    whileInView={{ width: 60 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                />
                            </div>

                            {/* Filter Buttons */}
                            {categories.length > 2 && (
                                <motion.div
                                    className="projects-filter"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}
                                >
                                    {categories.map((cat) => (
                                        <MagneticButton key={cat} strength={0.15}>
                                            <button
                                                className={`filter-btn ${filter === cat ? 'active' : ''}`}
                                                onClick={() => setFilter(cat)}
                                            >
                                                {cat}
                                                {filter === cat && (
                                                    <motion.div
                                                        className="filter-active-bg"
                                                        layoutId="activeFilter"
                                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                                    />
                                                )}
                                            </button>
                                        </MagneticButton>
                                    ))}
                                </motion.div>
                            )}

                            {/* Projects Grid */}
                            <motion.div className="projects-grid" layout>
                                <AnimatePresence mode="popLayout">
                                    {filteredProjects.map((project) => (
                                        <motion.div
                                            key={project._id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.85, y: 40 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.85, y: 20 }}
                                            transition={{
                                                type: 'spring',
                                                stiffness: 300,
                                                damping: 30,
                                                opacity: { duration: 0.3 },
                                            }}
                                        >
                                            <TiltCard className="project-card" data-cursor="View">
                                                <div className="project-thumb-wrapper">
                                                    {project.thumbnail ? (
                                                        <img src={project.thumbnail} alt={project.title} />
                                                    ) : (
                                                        <div className="project-thumb-placeholder">🚀</div>
                                                    )}
                                                    <div className="project-thumb-overlay">
                                                        <button className="project-overlay-btn" onClick={() => setSelectedProject(project)}>
                                                            <HiOutlineExternalLink /> Details
                                                        </button>
                                                        {project.liveUrl && (
                                                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-overlay-btn">
                                                                Live ↗
                                                            </a>
                                                        )}
                                                        {project.githubUrl && (
                                                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-overlay-btn">
                                                                <FaGithub /> Code
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="project-body">
                                                    <div className="project-category">{project.category}</div>
                                                    <h3>{project.title}</h3>
                                                    <p>{project.description}</p>
                                                    <div className="project-tech">
                                                        {project.techStack.map((tech, i) => (
                                                            <span key={i} className="project-tech-chip">{tech}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </TiltCard>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>

                            {filteredProjects.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{ textAlign: 'center', padding: 60, color: 'var(--neutral-500)' }}
                                >
                                    <p style={{ fontSize: 48, marginBottom: 16 }}>🔍</p>
                                    <p>No projects found in this category</p>
                                </motion.div>
                            )}
                        </div>
                    </section>
                ) : (
                    // Heavy Pinned Horizontal Scroll on Desktop
                    <section id="projects" ref={projectsWrapperRef} className="projects-scroll-wrapper">
                        <div className="projects-sticky-container">
                            {/* Floating category filter at top of sticky view */}
                            {categories.length > 2 && (
                                <div className="projects-filter" style={{
                                    position: 'absolute',
                                    top: '40px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    zIndex: 20,
                                    margin: 0
                                }}>
                                    {categories.map((cat) => (
                                        <MagneticButton key={cat} strength={0.15}>
                                            <button
                                                className={`filter-btn ${filter === cat ? 'active' : ''}`}
                                                onClick={() => setFilter(cat)}
                                            >
                                                {cat}
                                                {filter === cat && (
                                                    <motion.div
                                                        className="filter-active-bg"
                                                        layoutId="activeFilterHorizontal"
                                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                                    />
                                                )}
                                            </button>
                                        </MagneticButton>
                                    ))}
                                </div>
                            )}

                            <div ref={projectsTrackRef} className="projects-horizontal-track">
                                {/* Slide 1: Stylized Typography Header */}
                                <div className="projects-horizontal-header">
                                    <div className="section-label" style={{ marginBottom: 12 }}>My Work</div>
                                    <h2>Featured Projects</h2>
                                    <p>I build projects with a clean visual identity, fluid logic, and custom animations. Scroll down to browse my creations.</p>
                                    <div className="scroll-indicator-horizontal">
                                        <span>Scroll Down to Slide</span> →
                                    </div>
                                </div>

                                {/* Slide 2..N: Horizontal Project Cards */}
                                {filteredProjects.map((project) => (
                                    <div className="horizontal-project-card" key={project._id}>
                                        <TiltCard className="project-card" data-cursor="View">
                                            <div className="project-thumb-wrapper">
                                                {project.thumbnail ? (
                                                    <img src={project.thumbnail} alt={project.title} />
                                                ) : (
                                                    <div className="project-thumb-placeholder">🚀</div>
                                                )}
                                                <div className="project-thumb-overlay">
                                                    <button className="project-overlay-btn" onClick={() => setSelectedProject(project)}>
                                                        <HiOutlineExternalLink /> Details
                                                    </button>
                                                    {project.liveUrl && (
                                                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-overlay-btn">
                                                            Live ↗
                                                        </a>
                                                    )}
                                                    {project.githubUrl && (
                                                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-overlay-btn">
                                                            <FaGithub /> Code
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="project-body">
                                                <div className="project-category">{project.category}</div>
                                                <h3>{project.title}</h3>
                                                <p>{project.description}</p>
                                                <div className="project-tech">
                                                    {project.techStack.map((tech, i) => (
                                                        <span key={i} className="project-tech-chip">{tech}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </TiltCard>
                                    </div>
                                ))}

                                {filteredProjects.length === 0 && (
                                    <div style={{ padding: '0 100px', textAlign: 'center', color: 'var(--neutral-500)', width: 400 }}>
                                        <p style={{ fontSize: 48, marginBottom: 16 }}>🔍</p>
                                        <p>No projects found in this category</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )
            )}

            {/* ============ MARQUEE DIVIDER 2 ============ */}
            {marqueeItems.length > 0 && (
                <div className="marquee-section">
                    <InfiniteMarquee items={marqueeItems} speed={50} direction="right" />
                </div>
            )}

            {/* ============ RESUME ============ */}
            {profile?.resumeUrl && (
                <section id="resume" className="section" style={{ background: 'var(--neutral-900)' }}>
                    <div className="container">
                        <div className="section-header">
                            <motion.div
                                className="section-label"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                Resume
                            </motion.div>
                            <TextReveal as="h2" className="section-title" mode="words" trigger="scroll">
                                My Professional CV
                            </TextReveal>
                            <motion.div
                                className="section-divider"
                                initial={{ width: 0 }}
                                whileInView={{ width: 60 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                            />
                        </div>
                        <motion.div
                            className="resume-container gsap-fade-up"
                            style={{ marginTop: 40, height: '1150px', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--neutral-800)', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}
                        >
                            <iframe
                                src={`${profile.resumeUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                title="Resume"
                                style={{ width: '100%', height: '100%', border: 'none' }}
                            />
                        </motion.div>
                        <motion.div
                            style={{ textAlign: 'center', marginTop: 40 }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <MagneticButton>
                                <a href={profile.resumeUrl} download className="btn btn-primary">
                                    <HiOutlineDocumentDownload /> Download Full Resume
                                </a>
                            </MagneticButton>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* ============ CONTACT ============ */}
            <section id="contact" className="section" style={{ background: 'rgba(15,23,42,0.5)' }}>
                <div className="container">
                    <div className="section-header">
                        <motion.div
                            className="section-label"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            Contact
                        </motion.div>
                        <TextReveal as="h2" className="section-title" mode="words" trigger="scroll">
                            Let's Work Together
                        </TextReveal>
                        <motion.p
                            className="section-subtitle"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            Feel free to reach out if you have any questions or want to collaborate on a project.
                        </motion.p>
                        <motion.div
                            className="section-divider"
                            initial={{ width: 0 }}
                            whileInView={{ width: 60 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        />
                    </div>

                    <div className="contact-layout">
                        <div className="contact-grid">
                            {profile?.email && (
                                <a href={`mailto:${profile.email}`} className="contact-card contact-card-anim" style={{ textDecoration: 'none' }}>
                                    <div className="contact-icon"><HiOutlineMail /></div>
                                    <div>
                                        <h4>Email</h4>
                                        <p>{profile.email}</p>
                                    </div>
                                </a>
                            )}
                            {profile?.phone && (
                                <a href={`tel:${profile.phone}`} className="contact-card contact-card-anim" style={{ textDecoration: 'none' }}>
                                    <div className="contact-icon"><HiOutlinePhone /></div>
                                    <div>
                                        <h4>Phone</h4>
                                        <p>{profile.phone}</p>
                                    </div>
                                </a>
                            )}
                            {profile?.location && (
                                <div className="contact-card contact-card-anim">
                                    <div className="contact-icon"><HiOutlineLocationMarker /></div>
                                    <div>
                                        <h4>Location</h4>
                                        <p>{profile.location}</p>
                                    </div>
                                </div>
                            )}
                            {profile?.github && (
                                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="contact-card contact-card-anim" style={{ textDecoration: 'none' }}>
                                    <div className="contact-icon"><FaGithub /></div>
                                    <div>
                                        <h4>GitHub</h4>
                                        <p>View Profile</p>
                                    </div>
                                </a>
                            )}
                            {profile?.linkedin && (
                                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="contact-card contact-card-anim" style={{ textDecoration: 'none' }}>
                                    <div className="contact-icon"><FaLinkedinIn /></div>
                                    <div>
                                        <h4>LinkedIn</h4>
                                        <p>Connect</p>
                                    </div>
                                </a>
                            )}
                            {profile?.website && (
                                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="contact-card contact-card-anim" style={{ textDecoration: 'none' }}>
                                    <div className="contact-icon"><HiOutlineGlobe /></div>
                                    <div>
                                        <h4>Website</h4>
                                        <p>{profile.website}</p>
                                    </div>
                                </a>
                            )}
                        </div>

                        <motion.div
                            className="contact-form-wrapper"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <form className="contact-form" onSubmit={handleContactSubmit}>
                                <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--neutral-50)', marginBottom: 20 }}>
                                    <HiOutlinePaperAirplane style={{ verticalAlign: 'middle', marginRight: 8 }} />
                                    Send a Message
                                </h3>
                                <div className="form-group floating-label-group">
                                    <input
                                        type="email"
                                        className="form-input"
                                        placeholder=" "
                                        value={contactEmail}
                                        onChange={(e) => setContactEmail(e.target.value)}
                                        required
                                        id="contact-email"
                                    />
                                    <label htmlFor="contact-email">Your Email *</label>
                                </div>
                                <div className="form-group floating-label-group">
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder=" "
                                        value={contactSubject}
                                        onChange={(e) => setContactSubject(e.target.value)}
                                        required
                                        id="contact-subject"
                                    />
                                    <label htmlFor="contact-subject">Subject *</label>
                                </div>
                                <div className="form-group floating-label-group">
                                    <textarea
                                        className="form-textarea"
                                        placeholder=" "
                                        value={contactMessage}
                                        onChange={(e) => setContactMessage(e.target.value)}
                                        required
                                        rows={5}
                                        id="contact-message"
                                    />
                                    <label htmlFor="contact-message">Message *</label>
                                </div>
                                <div className="form-group">
                                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--neutral-400)', marginBottom: 6, display: 'block' }}>Attachment (optional, max 25MB)</label>
                                    <input
                                        type="file"
                                        className="form-input"
                                        accept=".pdf,.doc,.docx,.txt,image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file && file.size > 25 * 1024 * 1024) {
                                                toast.error('File size must be less than 25MB');
                                                e.target.value = '';
                                                setContactFile(null);
                                                return;
                                            }
                                            setContactFile(file || null);
                                        }}
                                        style={{ padding: '10px 14px' }}
                                    />
                                    {contactFile && (
                                        <p style={{ fontSize: 12, color: 'var(--neutral-400)', marginTop: 4 }}>
                                            📎 {contactFile.name} ({(contactFile.size / 1024 / 1024).toFixed(2)} MB)
                                        </p>
                                    )}
                                </div>
                                <MagneticButton style={{ width: '100%' }}>
                                    <button type="submit" className="btn btn-primary btn-send" disabled={sendingContact} style={{ width: '100%', justifyContent: 'center' }}>
                                        {sendingContact ? (
                                            <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                                        ) : (
                                            <><HiOutlinePaperAirplane /> Send Message</>
                                        )}
                                    </button>
                                </MagneticButton>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============ FOOTER ============ */}
            <footer className="footer" style={{ padding: '60px 0', background: 'var(--neutral-900)', borderTop: '1px solid var(--neutral-800)', position: 'relative', overflow: 'hidden' }}>
                {/* Giant marquee name behind footer */}
                <div className="footer-marquee">
                    <InfiniteMarquee
                        items={[profile?.name || 'Portfolio']}
                        speed={30}
                        separator="•"
                        direction="right"
                    />
                </div>
                <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
                    <p style={{ color: 'var(--neutral-400)', fontSize: 14 }}>© {new Date().getFullYear()} {profile?.name || 'Portfolio'}.</p>
                    <div className="footer-links" style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 20 }}>
                        {profile?.github && (
                            <MagneticButton>
                                <a href={profile.github} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--neutral-400)', fontSize: 20 }}><FaGithub /></a>
                            </MagneticButton>
                        )}
                        {profile?.linkedin && (
                            <MagneticButton>
                                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--neutral-400)', fontSize: 20 }}><FaLinkedinIn /></a>
                            </MagneticButton>
                        )}
                        {profile?.email && (
                            <MagneticButton>
                                <a href={`mailto:${profile.email}`} style={{ color: 'var(--neutral-400)', fontSize: 20 }}><HiOutlineMail /></a>
                            </MagneticButton>
                        )}
                    </div>
                </div>
            </footer>

            {/* ============ PROJECT MODAL ============ */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        className="project-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setSelectedProject(null)}
                        style={{ backdropFilter: 'blur(8px)' }}
                    >
                        <motion.div
                            className="project-modal"
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{
                                type: 'spring',
                                stiffness: 300,
                                damping: 30,
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {selectedProject.thumbnail ? (
                                <div style={{ position: 'relative' }}>
                                    <button className="project-modal-close" onClick={() => setSelectedProject(null)} style={{ position: 'absolute', zIndex: 10 }}>
                                        <HiX />
                                    </button>
                                    <motion.img
                                        src={selectedProject.thumbnail}
                                        alt={selectedProject.title}
                                        className="project-modal-image"
                                        initial={{ scale: 1.1 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                    />
                                </div>
                            ) : (
                                <button className="project-modal-close" onClick={() => setSelectedProject(null)} style={{ position: 'absolute', zIndex: 10 }}>
                                    <HiX />
                                </button>
                            )}
                            <motion.div
                                className="project-modal-body"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15, duration: 0.5 }}
                            >
                                <div className="project-category">{selectedProject.category}</div>
                                <h2>{selectedProject.title}</h2>
                                <p>{selectedProject.description}</p>

                                {selectedProject.techStack.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.25, duration: 0.5 }}
                                    >
                                        <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--neutral-300)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                                            Tech Stack
                                        </h4>
                                        <div className="skills-grid" style={{ marginBottom: 24 }}>
                                            {selectedProject.techStack.map((tech, i) => (
                                                <motion.span
                                                    key={i}
                                                    className="skill-chip"
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.3 + i * 0.05, type: 'spring', stiffness: 300 }}
                                                >
                                                    {tech}
                                                </motion.span>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                <motion.div
                                    className="project-modal-links"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.35, duration: 0.5 }}
                                >
                                    {selectedProject.liveUrl && (
                                        <MagneticButton>
                                            <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                                <HiOutlineExternalLink /> Live Demo
                                            </a>
                                        </MagneticButton>
                                    )}
                                    {selectedProject.githubUrl && (
                                        <MagneticButton>
                                            <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                                                <FaGithub /> Source Code
                                            </a>
                                        </MagneticButton>
                                    )}
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </SmoothScroll>
    );
};

export default PortfolioPage;
