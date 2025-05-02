import "../styles/footer.css";
import FacebookIcon from '@mui/icons-material/Facebook';

const Footer = () => (
  <footer className="footer">


      <div className="footer-info">
          <h3>Yhteystiedot</h3>
          <p>Hirvensalmen Autourheilijat RY</p>
          <p>Hirvensalmentie 8D</p>
          <p>52550 Hirvensalmi</p>
          <p>050 0982 867 Kari Liimatainen</p>
          <p>hauinfonet@gmail.com</p>
          <br />
          <a href="https://www.facebook.com/HirvensalmenAutoUrheilijat/?locale=fi_FI" className="text-white">
            <span className="footer-icon-container"><FacebookIcon className="footer-icon" /></span>
          </a> 
      </div>


      <div className="footer-links">
          <li><a href="/terms">Terms of Service</a></li>
          <p className="copyright">&copy; 2025 Jaku Lahtinen.</p>
      </div>
    </footer>
  );
  
  export default Footer;