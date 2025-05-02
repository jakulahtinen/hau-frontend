import "../styles/navbar.css";
import { Link, useNavigate } from "react-router-dom";
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);


    const handleMenuToggle = () => {
        setMenuOpen((prev) => !prev);

      };

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token");
    
            if (!token) {
                setIsAuthenticated(false);
                return;
            }
    
            try {
                const decodedToken: { exp?: number } = jwtDecode(token);
                const currentTime = Date.now() / 1000;
    
                if (decodedToken.exp && decodedToken.exp > currentTime) {
                    setIsAuthenticated(true);
                } else {
                    handleLogout();
                }
            } catch (error) {
                console.error("Virhe tokenin dekoodauksessa:", error);
                handleLogout();
            }
        };
    
        checkAuth(); // Check authorization immediatly here !
    
        window.addEventListener("storage", checkAuth);
    
        return () => {
            window.removeEventListener("storage", checkAuth);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setMenuOpen(false);
        navigate("/login");
    };

    return (
        <nav className="navbar-container">
            <div className="navbar-top">
                {isMobile && (
                    <div 
                        className="menu-icon" 
                        onClick={handleMenuToggle}
                    >
                        <MenuIcon style={{ fontSize: "36px" }} />
                    </div>
                )}
            </div>
    
            {isMobile ? (
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        className="mobile-menu-fullscreen"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setMenuOpen(false)}
                    >
                        <ul 
                            className="mobile-menu-list" 
                            onClick={(e) => e.stopPropagation()}
                        >
                            <li><Link to="/" onClick={() => setMenuOpen(false)}>Etusivu</Link></li>
                            <li><Link to="/events" onClick={() => setMenuOpen(false)}>Uutiset</Link></li>
                            <li><Link to="/photos" onClick={() => setMenuOpen(false)}>Kuvat</Link></li>
                            <li><Link to="/join" onClick={() => setMenuOpen(false)}>Liity</Link></li>
                            <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Yhteystiedot</Link></li>
                            <div className="navbar-icons">
                                {isAuthenticated ? (
                                    <>
                                        <li><Link to="/admin" onClick={() => setMenuOpen(false)}><AccountCircleIcon fontSize="large" /></Link></li>
                                        <li><button onClick={handleLogout} ><LogoutIcon fontSize="medium" /></button></li>
                                    </>
                                ) : (
                                    <li><button><Link to="/login" onClick={() => setMenuOpen(false)}><LoginIcon fontSize="medium" /></Link></button></li>
                                )}
                            </div>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
            ) : (
                <ul className="navbar desktop">
                    <li><Link to="/">Etusivu</Link></li>
                    <li><Link to="/events">Uutiset</Link></li>
                    <li><Link to="/photos">Kuvat</Link></li>
                    <li><Link to="/join">Liity</Link></li>
                    <li><Link to="/contact">Yhteystiedot</Link></li>
                    <div className="navbar-icons">
                        {isAuthenticated ? (
                            <>
                                <li><Link to="/admin"><AccountCircleIcon fontSize="large" /></Link></li>
                                <li><button onClick={handleLogout}><LogoutIcon fontSize="medium" /></button></li>
                            </>
                        ) : (
                            <li><Link to="/login"><LoginIcon fontSize="medium" /></Link></li>
                        )}
                    </div>
                </ul>
            )}
        </nav>
    );
};

export default Navbar;