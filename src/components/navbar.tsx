import "../styles/navbar.css";
import { Link, useNavigate } from "react-router-dom";
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

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
        navigate("/login");
    };

    return (
        <nav>
            <ul className="navbar">
                <li><Link to="/">Etusivu</Link></li>
                <li><Link to="/events">Uutiset</Link></li>
                <li><Link to="/photos">Kuvat</Link></li>
                <li><Link to="/videos">Videot</Link></li>
                <li><Link to="/join">Liity</Link></li>
                <li><Link to="/contact">Yhteystiedot</Link></li>
                <div className="navbar-icons">
                    {isAuthenticated ? (
                        <>
                            <li><Link to="/admin"><AccountCircleIcon fontSize="large" style={{marginTop: "5px"}}/></Link></li>
                            <li><button onClick={handleLogout}><LogoutIcon fontSize="medium" /></button></li>
                        </>
                    ) : (
                        <li><Link to="/login"><LoginIcon fontSize="medium" /></Link></li>
                    )}
                </div>
            </ul>
        </nav>
    );
};

export default Navbar;