import { useNavigate } from 'react-router-dom';
import { HiOutlineCode, HiOutlineGlobe } from 'react-icons/hi';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="home-landing">
            <div className="hero-bg">
                <div className="hero-gradient-1" />
                <div className="hero-gradient-2" />
                <div className="hero-gradient-3" />
                <div className="hero-grid" />
            </div>
            <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', paddingTop: '15vh' }}>
                <div className="hero-badge" style={{ margin: '0 auto 24px' }}>Portfolio Platform</div>
                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 800, marginBottom: 20, lineHeight: 1.1 }}>
                    Showcase Your Work<br />
                    <span className="gradient-text">With a Stunning Portfolio</span>
                </h1>
                <p style={{ fontSize: 18, color: 'var(--neutral-400)', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.7 }}>
                    Create your professional portfolio in minutes. Sign up, add your projects, and share your unique portfolio link with the world.
                </p>
                <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <a href={import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174'} className="btn btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>
                        <HiOutlineCode /> Get Started
                    </a>
                    <button className="btn btn-outline" style={{ fontSize: 16, padding: '14px 32px' }} onClick={() => {
                        const input = prompt('Enter a username to view their portfolio:');
                        if (input) navigate(`/${input.trim()}`);
                    }}>
                        <HiOutlineGlobe /> View a Portfolio
                    </button>
                </div>
            </div>
            <footer className="footer" style={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
                <div className="container">
                    <p>© {new Date().getFullYear()} Portfolio Platform.</p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
