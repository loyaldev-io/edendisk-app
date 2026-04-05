import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    Home,
    CheckCircle,
    Info,
    CreditCard,
    Mail,
    LayoutDashboard,
    LogOut
} from "lucide-react"; // ✅ icônes modernes
import logoImg from "../assets/img/edendisk.ico";

const Navbar: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const username = localStorage.getItem("username") || "";
    const email = localStorage.getItem("email") || "";

    const hideMenu =
        location.pathname === "/login" ||
        location.pathname === "/register" ||
        location.pathname === "/download" ||
        location.pathname === "/privacy" ||
        location.pathname === "/forgot-password" ||
        location.pathname === "/reset-password";

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("username");
        setIsAuthenticated(false);
        setMenuOpen(false);
        navigate("/login");
    };

    const toggleMenu = () => setMenuOpen(!menuOpen);

    if (hideMenu) return null; // ✅ Ne rien afficher sur ces pages
    return (
        <>
            <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
                <div className="logo">
                    <Link to="/">
                        <img src={logoImg} alt="EdenDisk Logo" className="logo-icon" />
                    </Link>
                    <span className="logo-text">EdenDisk</span>
                </div>

                {!hideMenu && (
                    <div
                        className={`burger ${menuOpen ? "open" : ""}`}
                        onClick={toggleMenu}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                )}
            </nav>

            <div className={`overlay ${menuOpen ? "show" : ""}`} onClick={toggleMenu}></div>

            <div className={`sidebar ${menuOpen ? "show" : ""}`}>
                <div className="sidebar-header">
                    <img src={logoImg} alt="User Avatar" className="avatar" />
                    <h3>{username || "Utilisateur"}</h3>
                    <p>{email || "email@edendisk.com"}</p>
                    <hr />
                </div>

                <ul className="sidebar-menu">
                    <li>
                        <a href="http://localhost:5173/" onClick={toggleMenu}>
                            <Home size={18} /> <span>Accueil</span>
                        </a>
                    </li>
                    <li>
                        <a href="#features" onClick={toggleMenu}>
                            <CheckCircle size={18} /> <span>Avantages</span>
                        </a>
                    </li>
                    <li>
                        <a href="#showcase" onClick={toggleMenu}>
                            <Info size={18} /> <span>Présentation</span>
                        </a>
                    </li>
                    <li>
                        <a href="#pricing" onClick={toggleMenu}>
                            <CreditCard size={18} /> <span>Tarifs</span>
                        </a>
                    </li>
                    <li>
                        <a href="#contact" onClick={toggleMenu}>
                            <Mail size={18} /> <span>Contact</span>
                        </a>
                    </li>
                </ul>

                <div className="sidebar-footer">
                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/dashboard"
                                onClick={() => setMenuOpen(false)}
                                className="btn-login"
                            >
                                <LayoutDashboard size={18} />
                                <span>Tableau de bord</span>
                            </Link>
                            <button onClick={handleLogout} className="btn-logout">
                                <LogOut size={18} />
                                <span>Déconnexion</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                onClick={() => setMenuOpen(false)}
                                className="btn-login"
                            >
                                Connexion
                            </Link>
                            <Link
                                to="/register"
                                onClick={() => setMenuOpen(false)}
                                className="btn-register"
                            >
                                Inscription
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Navbar;
