import HAUHeader from '../assets/HAUHeader.jpg';
import "../styles/header.css";

const Header = () => (
    <header className='header'>
        <img src={HAUHeader} alt="Header Picture" className='headerPicture' />
    </header>
);

export default Header;