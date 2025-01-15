import "../styles/footer.css";
import FacebookIcon from '@mui/icons-material/Facebook';
import cooperation1 from '../assets/cooperation1.jpg';
import cooperation2 from '../assets/cooperation2.jpg';
import cooperation3 from '../assets/cooperation3.jpg';
import cooperation4 from '../assets/cooperation4.png';
import cooperation5 from '../assets/cooperation5.jpg';
import cooperation6 from '../assets/cooperation6.jpg';


const Footer = () => (
  <footer className="footer">
    <h1 className="cooperation-text">YHTEISTYÖSSÄ MUKANA</h1>


      <div className="cooperation-container">
        <img src={cooperation1} alt="footerPicture" className='cooperation1' />
        <img src={cooperation2} alt="footerPicture" className='cooperation2' />
        <img src={cooperation3} alt="footerPicture" className='cooperation3' />
        <img src={cooperation4} alt="footerPicture" className='cooperation4' />
        <img src={cooperation5} alt="footerPicture" className='cooperation5' />
        <img src={cooperation6} alt="footerPicture" className='cooperation6' />
      </div>


      <div className="footer-links">
          <a href="https://www.facebook.com/HirvensalmenAutoUrheilijat/?locale=fi_FI" className="text-white">
            <span className="footer-icon-container"><FacebookIcon className="footer-icon" /></span>
          </a> 
          <li><a href="/terms">Terms of Service</a></li>
          <p className="copyright">&copy; 2025 Jaku Lahtinen. All rights reserved.</p>
      </div>
    </footer>
  );
  
  export default Footer;