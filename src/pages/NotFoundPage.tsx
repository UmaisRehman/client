import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            textAlign: 'center',
            padding: 40,
            background: 'var(--bg-primary)'
        }}>
            <div style={{ fontSize: 80, marginBottom: 16 }}>🔍</div>
            <h1 style={{ fontSize: 48, fontWeight: 800, color: 'var(--neutral-100)', marginBottom: 12 }}>404</h1>
            <p style={{ fontSize: 20, color: 'var(--neutral-400)', marginBottom: 8 }}>Portfolio Not Found</p>
            <p style={{ fontSize: 15, color: 'var(--neutral-500)', marginBottom: 32, maxWidth: 400 }}>
                This username doesn't exist or the portfolio hasn't been set up yet.
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
                Go Home
            </button>
        </div>
    );
};

export default NotFoundPage;
