
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Auth.css';

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formInfo, setInfo] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    function formData(event) {
        setInfo({
            ...formInfo,
            [event.target.name]: event.target.value
        });
    }

    async function submition(event) {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(
                'http://localhost:5000/api/auth/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formInfo)
                }
            );

            const data = await response.json();

            if (response.ok) {
                if (!data.user || !data.user._id) {
                    setError('User information was not returned.');
                    return;
                }

                login(data.user);
                navigate('/home');
            } else {
                setError(data.message || 'Login failed.');
            }

        } catch (error) {
            console.error('Login request error:', error);
            setError('Could not connect to the server.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="body">
            <h1 className="title">Login</h1>
            <p id="welcome">Welcome Back</p>

            <form className="form" onSubmit={submition}>

                <label className="label">Email:</label>
                <input
                    className="input"
                    type="email"
                    name="email"
                    value={formInfo.email}
                    onChange={formData}
                    required
                />

                <label className="label">Password:</label>
                <input
                    className="input"
                    type="password"
                    name="password"
                    value={formInfo.password}
                    onChange={formData}
                    required
                />

                {error && <p className="error">{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <div className="register-section">
                    <p>
                        Don't have an account? <Link to="/">Register</Link>
                    </p>
                </div>

            </form>
        </div>
    );
}

export default Login;
