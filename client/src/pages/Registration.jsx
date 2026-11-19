
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

function Registration() {
    const navigate = useNavigate();

    const [formInfo, setInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        location: '',
        description: '',
        occupation: ''
    });

    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);

    function formData(event) {
        setInfo({
            ...formInfo,
            [event.target.name]: event.target.value
        });
    }

    function validation() {
        const errors = {};
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(formInfo.email)) {
            errors.email = 'Email is not valid';
        }

        if (formInfo.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        }

        setError(errors);

        return Object.keys(errors).length === 0;
    }

    async function submition(event) {
        event.preventDefault();

        if (!validation()) {
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                'http://localhost:5000/api/auth/register',
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
                alert('Registration successful!');
                navigate('/login');
            } else {
                setError({ general: data.message || 'Registration failed.' });
            }

        } catch (error) {
            console.error('Registration request error:', error);
            setError({
                general: 'Could not connect to the server.'
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="body">
            <h1 className="title">Create an Account</h1>

            <form className="form" onSubmit={submition} noValidate>

                <label className="label">First Name:</label>
                <input
                    className="input"
                    type="text"
                    name="firstName"
                    value={formInfo.firstName}
                    onChange={formData}
                    required
                />

                <label className="label">Last Name:</label>
                <input
                    className="input"
                    type="text"
                    name="lastName"
                    value={formInfo.lastName}
                    onChange={formData}
                    required
                />

                <label className="label">Email:</label>
                <input
                    className="input"
                    type="email"
                    name="email"
                    value={formInfo.email}
                    onChange={formData}
                    required
                />

                {error.email && <p className="error">{error.email}</p>}

                <label className="label">Password:</label>
                <input
                    className="input"
                    type="password"
                    name="password"
                    value={formInfo.password}
                    onChange={formData}
                    required
                />

                {error.password && <p className="error">{error.password}</p>}

                <label className="label">Location:</label>
                <input
                    className="input"
                    type="text"
                    name="location"
                    value={formInfo.location}
                    onChange={formData}
                />

                <label className="label">Description:</label>
                <textarea
                    className="input"
                    name="description"
                    value={formInfo.description}
                    onChange={formData}
                />

                <label className="label">Occupation:</label>
                <input
                    className="input"
                    type="text"
                    name="occupation"
                    value={formInfo.occupation}
                    onChange={formData}
                />

                {error.general && (
                    <p className="error">{error.general}</p>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>

                <div className="login-section">
                    <p>
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </div>

            </form>
        </div>
    );
}

export default Registration;
