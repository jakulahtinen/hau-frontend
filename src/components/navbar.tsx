import "../styles/navbar.css";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const Navbar = () => (
    <nav>
      <ul className="navbar">
        <li><Link to="/">Etusivu</Link></li>
        <li><Link to="/photos">Kuvat</Link></li>
        <li><Link to="/videos">Videot</Link></li>
        <li><Link to="/join">Liity</Link></li>
        <li><Link to="/contact">Yhteystiedot</Link></li>
      </ul>
    </nav>
);

export default Navbar;