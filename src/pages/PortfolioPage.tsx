import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjects, getProfile, sendContactEmail, getErrorMessage, type Project, type Profile } from '../services/api';
import toast from 'react-hot-toast';
import {
    HiOutlineExternalLink, HiOutlineCode, HiOutlineDocumentDownload,
    HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker,
    HiOutlineGlobe, HiX, HiMenuAlt3, HiOutlinePaperAirplane
} from 'react-icons/hi';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';

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

    const [contactEmail, setContactEmail] = useState('');
    const [contactSubject, setContactSubject] = useState('');
    const [contactMessage, setContactMessage] = useState('');
    const [contactFile, setContactFile] = useState<File | null>(null);
    const [sendingContact, setSendingContact] = useState(false);

    useEffect(() => {
        if (username) fetchData();
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [username]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );

        document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [loading, projects, profile]);

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

    const categories = ['All', ...new Set(projects.map((p) => p.category))];
    const filteredProjects = filter === 'All' ? projects : projects.filter((p) => p.category === filter);

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
    };

    if (loading) {
        return (
            <div className="page-loader" style={{ animation: 'none' }}>
                <div className="loader-spinner" />
            </div>
        );
    }

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

    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="container">
                    <div className="nav-logo" onClick={() => scrollToSection('hero')}>
                        {profile?.avatarUrl && (
                            <img src={profile.avatarUrl} alt={profile.name} className="nav-avatar" />
                        )}
                        <span>{profile?.name?.split(' ')[0] || 'Portfolio'}</span>
                    </div>
                    <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
                        <li><a onClick={() => scrollToSection('hero')}>Home</a></li>
                        <li><a onClick={() => scrollToSection('about')}>About</a></li>
                        {projects.length > 0 && <li><a onClick={() => scrollToSection('projects')}>Projects</a></li>}
                        <li><a onClick={() => scrollToSection('contact')}>Contact</a></li>
                         {profile?.resumeUrl && (
                            <li>
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
                            </li>
                        )}
                    </ul>
                    <button className="nav-mobile-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <HiX /> : <HiMenuAlt3 />}
                    </button>
                </div>
            </nav>

            <section id="hero" className="hero">
                <div className="hero-bg">
                    <div className="hero-gradient-1" />
                    <div className="hero-gradient-2" />
                    <div className="hero-gradient-3" />
                    <div className="hero-grid" />
                </div>
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-badge">Available for Work</div>
                        <h1>
                            Hi, I'm{' '}
                            <span className="gradient-text">{profile?.name || 'Developer'}</span>
                        </h1>
                        <p className="hero-description">
                            {profile?.tagline && `${profile.tagline} `}
                            {profile?.bio && profile.tagline ? '— ' : ''}
                            {profile?.bio ? profile.bio.substring(0, 150) : ''}
                            {profile?.bio && profile.bio.length > 150 ? '...' : ''}
                        </p>
                        <div className="hero-buttons">
                            {projects.length > 0 && (
                                <button className="btn btn-primary" onClick={() => scrollToSection('projects')}>
                                    <HiOutlineCode /> View My Work
                                </button>
                            )}
                            <button className="btn btn-outline" onClick={() => scrollToSection('contact')}>
                                <HiOutlineMail /> Get In Touch
                            </button>
                        </div>
                         {projects.length > 0 && (
                            <div className="hero-stats">
                                <div className="hero-stat">
                                    <h3>{projects.length}<span>+</span></h3>
                                    <p>Projects</p>
                                </div>
                                <div className="hero-stat">
                                    <h3>
                                        {new Set([
                                            ...(profile?.skills || []),
                                            ...projects.flatMap(p => p.techStack)
                                        ].map(t => t.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]+$/, ''))).size}
                                        <span>+</span>
                                    </h3>
                                    <p>Technologies</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section id="about" className="section">
                <div className="container">
                    <div className="section-header reveal">
                        <div className="section-label">About Me</div>
                        <h2 className="section-title">Get To Know Me</h2>
                        <div className="section-divider" />
                    </div>
                    <div className="about-content">
                        <div className="about-text reveal">
                            <h3>{profile?.tagline ? profile.tagline : 'About Me'}</h3>
                            {profile?.bio && <p>{profile.bio}</p>}

                            <div className="about-info-grid">
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

                            {profile?.skills && profile.skills.length > 0 && (
                                <div className="skills-section">
                                    <h4>Skills & Technologies</h4>
                                    <div className="skills-grid">
                                        {profile.skills.map((skill, i) => (
                                            <span key={i} className={`skill-chip reveal reveal-delay-${(i % 5) + 1}`}>{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {projects.length > 0 && (
                <section id="projects" className="section" style={{ background: 'rgba(15,23,42,0.5)' }}>
                <div className="container">
                    <div className="section-header reveal">
                        <div className="section-label">My Work</div>
                        <h2 className="section-title">Featured Projects</h2>
                        <p className="section-subtitle">
                            Here are some of the projects I've worked on. Each one was built with passion and attention to detail.
                        </p>
                        <div className="section-divider" />
                    </div>

                    {categories.length > 2 && (
                        <div className="projects-filter reveal">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    className={`filter-btn ${filter === cat ? 'active' : ''}`}
                                    onClick={() => setFilter(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="projects-grid">
                        {filteredProjects.map((project, index) => (
                            <div
                                key={project._id}
                                className={`project-card reveal reveal-delay-${Math.min(index + 1, 5)}`}
                            >
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
                            </div>
                        ))}
                    </div>

                    {filteredProjects.length === 0 && (
                        <div className="reveal" style={{ textAlign: 'center', padding: 60, color: 'var(--neutral-500)' }}>
                            <p style={{ fontSize: 48, marginBottom: 16 }}>🔍</p>
                            <p>No projects found in this category</p>
                        </div>
                    )}
                </div>
                </section>
            )}

             {profile?.resumeUrl && (
                <section id="resume" className="section" style={{ background: 'var(--neutral-900)' }}>
                    <div className="container">
                        <div className="section-header reveal">
                            <div className="section-label">Resume</div>
                            <h2 className="section-title">My Professional CV</h2>
                            <div className="section-divider" />
                        </div>
                        <div className="resume-container reveal" style={{ marginTop: 40, height: '1150px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--neutral-800)', boxShadow: 'var(--shadow-lg)' }}>
                            <iframe 
                                src={`${profile.resumeUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
                                title="Resume" 
                                style={{ width: '100%', height: '100%', border: 'none' }} 
                            />
                        </div>
                        <div style={{ textAlign: 'center', marginTop: 40 }} className="reveal">
                            <a href={profile.resumeUrl} download className="btn btn-primary">
                                <HiOutlineDocumentDownload /> Download Full Resume
                            </a>
                        </div>
                    </div>
                </section>
            )}

            <section id="contact" className="section" style={{ background: 'rgba(15,23,42,0.5)' }}>
                <div className="container">
                    <div className="section-header reveal">
                        <div className="section-label">Contact</div>
                        <h2 className="section-title">Let's Work Together</h2>
                        <p className="section-subtitle">
                            Feel free to reach out if you have any questions or want to collaborate on a project.
                        </p>
                        <div className="section-divider" />
                    </div>

                    <div className="contact-layout">
                        <div className="contact-grid">
                            {profile?.email && (
                                <a href={`mailto:${profile.email}`} className="contact-card reveal reveal-delay-1" style={{ textDecoration: 'none' }}>
                                    <div className="contact-icon"><HiOutlineMail /></div>
                                    <div>
                                        <h4>Email</h4>
                                        <p>{profile.email}</p>
                                    </div>
                                </a>
                            )}
                            {profile?.phone && (
                                <a href={`tel:${profile.phone}`} className="contact-card reveal reveal-delay-2" style={{ textDecoration: 'none' }}>
                                    <div className="contact-icon"><HiOutlinePhone /></div>
                                    <div>
                                        <h4>Phone</h4>
                                        <p>{profile.phone}</p>
                                    </div>
                                </a>
                            )}
                            {profile?.location && (
                                <div className="contact-card reveal reveal-delay-3">
                                    <div className="contact-icon"><HiOutlineLocationMarker /></div>
                                    <div>
                                        <h4>Location</h4>
                                        <p>{profile.location}</p>
                                    </div>
                                </div>
                            )}
                            {profile?.github && (
                                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="contact-card reveal reveal-delay-4" style={{ textDecoration: 'none' }}>
                                    <div className="contact-icon"><FaGithub /></div>
                                    <div>
                                        <h4>GitHub</h4>
                                        <p>View Profile</p>
                                    </div>
                                </a>
                            )}
                            {profile?.linkedin && (
                                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="contact-card reveal reveal-delay-5" style={{ textDecoration: 'none' }}>
                                    <div className="contact-icon"><FaLinkedinIn /></div>
                                    <div>
                                        <h4>LinkedIn</h4>
                                        <p>Connect</p>
                                    </div>
                                </a>
                            )}
                            {profile?.website && (
                                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="contact-card reveal" style={{ textDecoration: 'none' }}>
                                    <div className="contact-icon"><HiOutlineGlobe /></div>
                                    <div>
                                        <h4>Website</h4>
                                        <p>{profile.website}</p>
                                    </div>
                                </a>
                            )}
                        </div>

                        <div className="contact-form-wrapper reveal reveal-delay-2">
                            <form className="contact-form" onSubmit={handleContactSubmit}>
                                <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--neutral-50)', marginBottom: 20 }}>
                                    <HiOutlinePaperAirplane style={{ verticalAlign: 'middle', marginRight: 8 }} />
                                    Send a Message
                                </h3>
                                <div className="form-group">
                                    <label>Your Email *</label>
                                    <input
                                        type="email"
                                        className="form-input"
                                        placeholder="your@email.com"
                                        value={contactEmail}
                                        onChange={(e) => setContactEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Subject *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="What's this about?"
                                        value={contactSubject}
                                        onChange={(e) => setContactSubject(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Message *</label>
                                    <textarea
                                        className="form-textarea"
                                        placeholder="Write your message here..."
                                        value={contactMessage}
                                        onChange={(e) => setContactMessage(e.target.value)}
                                        required
                                        rows={5}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Attachment (optional, max 25MB)</label>
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
                                <button type="submit" className="btn btn-primary" disabled={sendingContact} style={{ width: '100%', justifyContent: 'center' }}>
                                    {sendingContact ? (
                                        <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                                    ) : (
                                        <><HiOutlinePaperAirplane /> Send Message</>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>



            <footer className="footer" style={{ padding: '60px 0', background: 'var(--neutral-900)', borderTop: '1px solid var(--neutral-800)' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--neutral-400)', fontSize: 14 }}>© {new Date().getFullYear()} {profile?.name || 'Portfolio'}. Built with ❤️</p>
                    <div className="footer-links" style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 20 }}>
                        {profile?.github && (
                            <a href={profile.github} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--neutral-400)', fontSize: 20 }}><FaGithub /></a>
                        )}
                        {profile?.linkedin && (
                            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--neutral-400)', fontSize: 20 }}><FaLinkedinIn /></a>
                        )}
                        {profile?.email && (
                            <a href={`mailto:${profile.email}`} style={{ color: 'var(--neutral-400)', fontSize: 20 }}><HiOutlineMail /></a>
                        )}
                    </div>
                </div>
            </footer>

            {selectedProject && (
                <div className="project-modal-overlay" onClick={() => setSelectedProject(null)}>
                    <div className="project-modal" onClick={(e) => e.stopPropagation()}>
                        {selectedProject.thumbnail ? (
                            <div style={{ position: 'relative' }}>
                                <button className="project-modal-close" onClick={() => setSelectedProject(null)} style={{ position: 'absolute', zIndex: 10 }}>
                                    <HiX />
                                </button>
                                <img src={selectedProject.thumbnail} alt={selectedProject.title} className="project-modal-image" />
                            </div>
                        ) : (
                            <button className="project-modal-close" onClick={() => setSelectedProject(null)} style={{ position: 'absolute', zIndex: 10 }}>
                                <HiX />
                            </button>
                        )}
                        <div className="project-modal-body">
                            <div className="project-category">{selectedProject.category}</div>
                            <h2>{selectedProject.title}</h2>
                            <p>{selectedProject.description}</p>

                            {selectedProject.techStack.length > 0 && (
                                <div>
                                    <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--neutral-300)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                                        Tech Stack
                                    </h4>
                                    <div className="skills-grid" style={{ marginBottom: 24 }}>
                                        {selectedProject.techStack.map((tech, i) => (
                                            <span key={i} className="skill-chip">{tech}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="project-modal-links">
                                {selectedProject.liveUrl && (
                                    <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                        <HiOutlineExternalLink /> Live Demo
                                    </a>
                                )}
                                {selectedProject.githubUrl && (
                                    <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                                        <FaGithub /> Source Code
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PortfolioPage;
