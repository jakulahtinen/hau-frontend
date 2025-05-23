import "../styles/adminnav.css";
import { Link } from "react-router-dom";

const Adminnav = () => (
    <nav>
      <ul className="adminnavbar">
        <li><Link to="/admin">Lisää Uutinen</Link></li>
        <li><Link to="/addpicture">Lisää Kuva</Link></li>
        <li><Link to="/addscores">Lisää Tulokset</Link></li>
      </ul>
    </nav>
);

export default Adminnav;