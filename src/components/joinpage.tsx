import React from "react";
import "../styles/join.css";
import joinpicture from '../assets/joinpagepic.jpg';

const Joinpage = () => (
    <div className="joinpage">
        <h1>Liity seuraan!</h1>
        <div className="jointext">
            <p>Jos haluat liittyä Hirvensalmen Autourheilijoiden jäseneksi, ota yhteyttä sähköpostitse osoitteeseen hauinfonet@gmail.com</p>
            <p> Liitymistä varten tarvitsemme seuraavat tiedot:</p>
            <ul className="joininfo">
                <li>• Nimi</li>
                <li>• Syntymäaika</li>
                <li>• Osoite</li>
                <li>• Puhelinnumero</li>
            </ul>
        </div>
        <h2>Seuran jäsenmaksut:</h2>
        <div className="joinprice">
            <p>Aikuiset <b>yli 15v</b>: 40€</p>
            <p>Nuoret <b>alle 15v</b>: 20€</p>
        </div>
        <div className="joinpicture">
            <img src={joinpicture} alt="Join Picture" className="joinpicture" />
        </div>
    </div>
);

export default Joinpage;