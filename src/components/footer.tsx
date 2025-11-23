import "../styles/footer.css";
import FacebookIcon from '@mui/icons-material/Facebook';

const Footer = () => (
    <footer className="footer">
        <div className="footer-content">
            
            {/* 1. Contact Info Section (Left/Left-Center) */}
            <div className="footer-contact">
                <h3 className="footer-heading">Yhteystiedot</h3>
                <p>Hirvensalmen Autourheilijat RY</p>
                <p>Hirvensalmentie 8D</p>
                <p>52550 Hirvensalmi</p>
                <p>Puh: 050 0982 867 (Kari Liimatainen)</p>
                <p>Sähköposti: hauinfonet@gmail.com</p>
            </div>

            {/* 2. Social Media Section (Center) */}
            <div className="footer-social">
                <h3 className="footer-heading">Seuraa somessa!</h3>
                <a 
                    href="https://www.facebook.com/HirvensalmenAutoUrheilijat/?locale=fi_FI" 
                    aria-label="Facebook linkki" 
                    className="footer-social-link"
                >
                    <span className="footer-icon-container"><FacebookIcon className="footer-icon" /></span>
                </a> 
            </div>
            
        </div>
        
        {/* Copyright is centered at the bottom */}
        <p className="copyright">&copy; 2025 Jaku. All Rights Reserved.</p>
    </footer>
);
 
export default Footer;