import "../styles/navbar.css";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import LoginIcon from '@mui/icons-material/Login';

const Navbar = () => (
    <nav>
      <ul className="navbar">
        <li><Link to="/">Etusivu</Link></li>
        <li><Link to="/events">Uutiset</Link></li>
        <li><Link to="/photos">Kuvat</Link></li>
        <li><Link to="/videos">Videot</Link></li>
        <li><Link to="/join">Liity</Link></li>
        <li><Link to="/contact">Yhteystiedot</Link></li>
        <div>
          <li><Link to="/login"><LoginIcon /></Link></li>
        </div>
      </ul>
    </nav>
);

export default Navbar;