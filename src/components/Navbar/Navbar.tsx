import './Navbar.scss';
import { Link } from 'react-router-dom';
import { Boxes, CircleUserRound, UsersRound, ChevronDown, Menu, X, type LucideIcon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface NavbarItem {
    link: string;
    title: string;
    icon?: LucideIcon;
}

interface NavbarSection {
    title: string;
    items: NavbarItem[];
}

const navbarSections: NavbarSection[] = [
    {
        title: 'Quyền',
        items: [
            { link: '/poomsae/list', title: 'Danh Sách', icon: UsersRound },
            { link: '/poomsae/sigma', title: 'Sơ Đồ Thi Đấu', icon: Boxes },
        ]
    },
    {
        title: 'Đối Kháng',
        items: [
            { link: '/sparring/list', title: 'Danh Sách', icon: UsersRound },
            { link: '/sparring/sigma', title: 'Sơ Đồ Thi Đấu', icon: Boxes },
        ]
    },
    {
        title: 'Tài Khoản',
        items: [
            { link: '/sign-up-account', title: 'Đăng Ký', icon: CircleUserRound },
            { link: '/login', title: 'Đăng Nhập', icon: CircleUserRound },
        ]
    }
];

export default function Navbar() {
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const timeoutRef = useRef<number | null>(null);

    const handleMouseEnter = (index: number) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setActiveDropdown(index);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setActiveDropdown(null);
        }, 150); // Delay để tránh flicker khi di chuyển chuột
    };

    const handleDropdownClick = (index: number) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-brand">
                    <span>🥋 Taekwondo</span>
                </Link>

                {/* Desktop Menu */}
                <div className="navbar-menu">
                    {navbarSections.map((section, index) => (
                        <div
                            key={index}
                            className="navbar-dropdown"
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <button
                                className={`navbar-toggle ${activeDropdown === index ? 'active' : ''}`}
                                onClick={() => handleDropdownClick(index)}
                            >
                                {section.title}
                                <ChevronDown className="chevron-icon" />
                            </button>

                            <div className={`dropdown-menu ${activeDropdown === index ? 'show' : ''}`}>
                                {section.items.map((item, itemIndex) => (
                                    <Link
                                        key={itemIndex}
                                        to={item.link}
                                        className="dropdown-item"
                                        onClick={() => setActiveDropdown(null)}
                                    >
                                        {item.icon && <item.icon className="item-icon" />}
                                        {item.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu-button"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${mobileMenuOpen ? 'show' : ''}`}>
                {navbarSections.map((section, index) => (
                    <div key={index} className="mobile-section">
                        <div className="mobile-section-title">{section.title}</div>
                        {section.items.map((item, itemIndex) => (
                            <Link
                                key={itemIndex}
                                to={item.link}
                                className="mobile-item"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.icon && <item.icon className="item-icon" />}
                                {item.title}
                            </Link>
                        ))}
                    </div>
                ))}
            </div>
        </nav>
    );
}
