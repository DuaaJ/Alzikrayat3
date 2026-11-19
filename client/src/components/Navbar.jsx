
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Navbar.css';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/home" className="logo">
                Alzikrayat
            </Link>

            <div className="nav-links">
                <Link to="/home">Home</Link>
                <Link to="/about">About Us</Link>

                {user ? (
                    <>
                        <Link to="/profile">Profile</Link>
                        <span>Hi, {user.firstName}</span>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <Link to="/login">Please Login</Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
