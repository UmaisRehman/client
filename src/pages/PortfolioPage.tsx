import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjects, getProfile, getErrorMessage, type Project, type Profile } from '../services/api';
import { applyTheme, type ThemePreset, DEFAULT_THEME } from '../config/theme';

// Layout & Core UI Components
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SmoothScroll from '../components/SmoothScroll';
import CustomCursor from '../components/CustomCursor';
import Preloader from '../components/Preloader';
import AmbientBackground from '../components/animation/AmbientBackground';
import TechMarquee from '../components/animation/TechMarquee';

// Modular Sections
import HeroSection from '../sections/HeroSection';
import AboutSection from '../sections/AboutSection';
import ProjectsSection from '../sections/ProjectsSection';
import ValuePropositionSection from '../sections/ValuePropositionSection';
import ResumeSection from '../sections/ResumeSection';
import ContactSection from '../sections/ContactSection';

export const PortfolioPage = () => {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();

    const [profile, setProfile] = useState<Profile | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [preloaderDone, setPreloaderDone] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');
    const [currentTheme, setCurrentTheme] = useState<ThemePreset>(DEFAULT_THEME);

    // Initialize Theme Tokens on mount
    useEffect(() => {
        applyTheme(DEFAULT_THEME);
    }, []);

    // Load Profile & Project Data from API
    useEffect(() => {
        if (!username) return;

        const fetchData = async () => {
            try {
                const [profileRes, projectsRes] = await Promise.all([
                    getProfile(username),
                    getProjects(username),
                ]);

                const fetchedProfile = profileRes.data.profile;
                setProfile(fetchedProfile);

                // Show projects where featured is true (or fallback all if none marked featured)
                const allProjects = projectsRes.data.projects || [];
                const featured = allProjects.filter((p: Project) => p.featured);
                setProjects(featured.length > 0 ? featured : allProjects);

                // Update document title and favicon
                if (fetchedProfile?.name) {
                    document.title = `${fetchedProfile.name} — Senior Full Stack Portfolio`;
                }
                if (fetchedProfile?.avatarUrl) {
                    const favicon = document.getElementById('favicon') as HTMLLinkElement;
                    if (favicon) favicon.href = fetchedProfile.avatarUrl;
                }
            } catch (err: any) {
                if (err.response?.status === 404) {
                    navigate('/not-found', { replace: true });
                    return;
                }
                console.error('Failed to load portfolio:', getErrorMessage(err));
            }
        };

        fetchData();
    }, [username, navigate]);

    // Active Section Intersection Tracker
    useEffect(() => {
        const sections = ['hero', 'about', 'projects', 'why-hire-me', 'resume', 'contact'];

        const handleScroll = () => {
            const scrollMiddle = window.scrollY + window.innerHeight * 0.35;

            for (const sectionId of sections) {
                const el = document.getElementById(sectionId);
                if (el) {
                    const top = el.offsetTop;
                    const height = el.offsetHeight;
                    if (scrollMiddle >= top && scrollMiddle < top + height) {
                        setActiveSection(sectionId);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [profile]);

    return (
        <SmoothScroll>
            {/* Custom Interactive Cursor */}
            <CustomCursor />

            {/* Initial Preloader Screen */}
            {!preloaderDone && (
                <Preloader
                    name={profile?.name || username || 'Portfolio'}
                    onComplete={() => setPreloaderDone(true)}
                />
            )}

            {/* Ambient Background Aura Grid */}
            <AmbientBackground />

            {/* Navigation Bar with Theme Controls */}
            <Navbar
                profile={profile}
                activeSection={activeSection}
                currentTheme={currentTheme}
                onThemeChange={(theme) => setCurrentTheme(theme)}
            />

            {/* Main Content Sections */}
            <main>
                <HeroSection
                    profile={profile}
                    projectsCount={projects.length}
                />

                {/* Seamless Infinite Brand Tech Stack Marquee */}
                <TechMarquee direction="left" speed={40} />

                <AboutSection
                    profile={profile}
                />

                <ProjectsSection
                    projects={projects}
                />

                {/* Dedicated Client & Recruiter Advantage Section */}
                <ValuePropositionSection
                    profile={profile}
                />

                {profile?.resumeUrl && (
                    <ResumeSection
                        profile={profile}
                    />
                )}

                <ContactSection
                    profile={profile}
                    username={username || ''}
                />
            </main>

            {/* Site Footer */}
            <Footer profile={profile} />
        </SmoothScroll>
    );
};

export default PortfolioPage;
