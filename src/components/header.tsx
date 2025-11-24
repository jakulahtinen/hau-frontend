import HauCoverWinter from '../assets/HauCoverWinter.png';
import "../styles/header.css";

const Header = () => (
    <header className='header'>
        <img src={HauCoverWinter} alt="Header Picture" className='headerPicture' />

        {/* Header text */}
        <div className="headerTextContainer">
            <h1 className="clubNameAnimated">
                Hirvensalmen Autourheilijat
            </h1>
            <p className="sinceText">
                Since 1997
            </p>
        </div>
    </header>
);

export default Header;