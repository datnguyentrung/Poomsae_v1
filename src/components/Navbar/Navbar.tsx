import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/sigma">Sigma</Link>
                </li>
                <li>
                    <Link to="/login">Login</Link>
                </li>
                <li>
                    <Link to="/sign-up-account">Sign Up</Link>
                </li>
            </ul>
        </nav>
    );
}
