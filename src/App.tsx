import { useState, useEffect } from 'react';
import { getProjects, getProfile, type Project, type Profile } from './services/api';
import {
  HiOutlineExternalLink, HiOutlineCode, HiOutlineDocumentDownload,
  HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker,
  HiOutlineGlobe, HiX, HiMenuAlt3
} from 'react-icons/hi';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import './index.css';

function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchData();
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  
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
  }, [loading]);

  const fetchData = async () => {
    try {
      const [profileRes, projectsRes] = await Promise.all([
        getProfile(),
        getProjects()
      ]);
      setProfile(profileRes.data.profile);
      setProjects(projectsRes.data.projects);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
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

  return (
    <>
      {}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="nav-logo">
            <div className="nav-logo-icon">⚡</div>
            {profile?.name?.split(' ')[0] || 'Portfolio'}
          </div>
          <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            <li><a onClick={() => scrollToSection('hero')}>Home</a></li>
            <li><a onClick={() => scrollToSection('about')}>About</a></li>
            <li><a onClick={() => scrollToSection('projects')}>Projects</a></li>
            <li><a onClick={() => scrollToSection('contact')}>Contact</a></li>
            {profile?.resumeUrl && (
              <li>
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="nav-resume-btn">
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

      {}
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
              {profile?.tagline || 'Full Stack Developer'} — {profile?.bio?.substring(0, 150) || 'Building beautiful, functional web experiences with modern technologies.'}
              {profile?.bio && profile.bio.length > 150 ? '...' : ''}
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary" onClick={() => scrollToSection('projects')}>
                <HiOutlineCode /> View My Work
              </button>
              <button className="btn btn-outline" onClick={() => scrollToSection('contact')}>
                <HiOutlineMail /> Get In Touch
              </button>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <h3>{projects.length}<span>+</span></h3>
                <p>Projects</p>
              </div>
              <div className="hero-stat">
                <h3>{new Set(projects.flatMap(p => p.techStack)).size}<span>+</span></h3>
                <p>Technologies</p>
              </div>
              <div className="hero-stat">
                <h3>{new Date().getFullYear() - 2022}<span>+</span></h3>
                <p>Years Experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section id="about" className="section">
        <div className="container">
          <div className="section-header reveal">
            <div className="section-label">About Me</div>
            <h2 className="section-title">Get To Know Me</h2>
            <div className="section-divider" />
          </div>
          <div className="about-grid">
            <div className="about-image-wrapper reveal">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="about-image" />
              ) : (
                <div className="about-image-placeholder">👨‍💻</div>
              )}
            </div>
            <div className="about-text reveal reveal-delay-2">
              <h3>A Passionate {profile?.tagline || 'Developer'}</h3>
              <p>{profile?.bio || 'I love building things for the web. My goal is to always build products that provide pixel-perfect, performant experiences.'}</p>

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
                      <span key={i} className="skill-chip reveal-delay-{i}">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {}
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

      {}
      {profile?.resumeUrl && (
        <section id="resume" className="section resume-section">
          <div className="container">
            <div className="section-header reveal">
              <div className="section-label">Resume</div>
              <h2 className="section-title">Download My CV</h2>
              <div className="section-divider" />
            </div>
            <div className="reveal">
              <div className="resume-card">
                <div className="resume-icon">
                  <HiOutlineDocumentDownload />
                </div>
                <h3>My Resume</h3>
                <p>Download my latest resume to learn more about my experience and skills.</p>
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <HiOutlineDocumentDownload /> Download Resume
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {}
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
        </div>
      </section>

      {}
      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} {profile?.name || 'Portfolio'}. Built with ❤️</p>
          <div className="footer-links">
            {profile?.github && (
              <a href={profile.github} target="_blank" rel="noopener noreferrer"><FaGithub /></a>
            )}
            {profile?.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
            )}
            {profile?.email && (
              <a href={`mailto:${profile.email}`}><HiOutlineMail /></a>
            )}
          </div>
        </div>
      </footer>

      {}
      {selectedProject && (
        <div className="project-modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="project-modal" onClick={(e) => e.stopPropagation()}>
            <button className="project-modal-close" onClick={() => setSelectedProject(null)}>
              <HiX />
            </button>
            {selectedProject.thumbnail && (
              <img src={selectedProject.thumbnail} alt={selectedProject.title} className="project-modal-image" />
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
}

export default App;
