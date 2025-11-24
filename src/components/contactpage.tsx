import "../styles/contact.css";

const Contactpage = () => (
    <div className="contactpage">
        <h1>Yhteystiedot</h1>
        <h4>Hirvensalmen Autourheilijat RY</h4>
        <div className="contact-info">
            <p>Hirvensalmentie 8D</p>
            <p>52550</p>
            <p>Hirvensalmi</p>
            <p>050 0982 867 Kari Liimatainen</p>
            <p>hauinfonet@gmail.com</p>
        </div>
        <h1>Hallitus 2025</h1>
        <div className="leadmembers">
            <p><b>Puheenjohtaja:</b> Kari Liimatainen 050 0982 867</p>
            <p><b>Varapuheenjohtaja:</b> Jani Rautiainen 050 3632 645</p>
            <p><b>Jäsenrekisterin hoitaja:</b> Satu Liukkonen 044 5123 404</p>
            <p><b>Sihteeri:</b> Milla Liimatainen</p>
        </div>
        <h3>Varsinaiset jäsenet:</h3>
        <div className="members1">
            <p>Joni Liukkonen</p>
            <p>Markku Liukkonen</p>
            <p>Henri Taivalantti</p>
            <p>Jani Rautiainen</p>
            <p>Arto Sokolin</p>
            <p>Tino Puhakka</p>
        </div>
        <h3>Varajäsenet:</h3>
        <div className="mebers2">
            <p>Hannu Ripatti</p>
            <p>Kimmo Mättö</p>
        </div>
        <h2>Jaa valokuvia tai videoita HAU:n kotisivulla tai somessa:</h2>
        <div className="sharetext">
            <p>Voit lähetättää ottamisia valokuvia/videoita meille sähköpostitse, tai Millalle whatsappilla: 045 8697 475</p>
            <p>Liitä mukaan viesti josta selviää missä kuva on otettu, ketä kuvassa on ja kuka kuvan on ottanut.</p>
        </div>
    </div>
);

export default Contactpage;