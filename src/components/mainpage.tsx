import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/main.css";
import mainpagepicture from '../assets/mainpageheader.jpg';

const Mainpage = () => {
    const [newsList, setNewsList] = useState<{ id: number; title: string; content: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLatestNews = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/news`);
                if (!response.ok) {
                    throw new Error("Uutisten haku epäonnistui");
                }
                const data = await response.json();
                // Sort newest events first and take just two.
                const latestNews = data
                    .sort((a: { createdAt: string }, b: { createdAt: string }) =>
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    )
                    .slice(0, 2);

                setNewsList(latestNews);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Tuntematon virhe");
            } finally {
                setLoading(false);
            }
        };

        fetchLatestNews();
    }, []);

    return (
        <div className="mainpage">
        <h1>Tervetuloa seuramme sivuille!</h1>
        <h3>Yhdessä autourheilun parissa</h3>
        <div className="mainpagewelcome">
            <p>Seuramme tavoitteena on yhdistää autourheilusta kiinnostuneet ja edistää eri lajien harrastamista Hirvensalmella ja sen ympäristössä.</p>
            <p> Järjestämme kilpailuja ja muita autoiluun liittyviä tapahtumia, jotka tarjoavat elämyksiä kaikille lajin ystäville.</p>
        </div>
        <div className="mainpagepicture">
            <img src={mainpagepicture} alt="Main Picture" className="mainpagepicture" />
            <p style={{ marginTop: "0px", textAlign: "center" }}>Hirvensalmen autourheilijat on perustettu vuonna 1997. </p>
        </div>

        <h1>Viimeisimmät uutiset</h1>
        {loading ? <p>Ladataan...</p> : error ? <p style={{ color: "red" }}>{error}</p> : (
            <div className="latest-news">
                {newsList.map((news) => (
                    <div key={news.id} className="news-item">
                        <h3>{news.title}</h3>
                        <p>{news.content.substring(0, 100)}...</p> {/* Näytetään vain osa tekstistä */}
                    </div>
                ))}
                <Link to="/events" className="read-more">Lue lisää</Link> {/* Tämän vietävä /events */}
            </div>
        )}

        {/* //This is development branch */}

        <h1>Kuka voi liittyä mukaan?</h1>
        <div className="whocanjoin">
            <p>Seuraamme kuuluu ja voi liittyä:</p>
            <ul className="whocanjoinlist">
                <li>• Kilpailijoita</li>
                <li>• Toimitsijoita</li>
                <li>• Mekaanikkoja</li>
                <li>• Muuten lajista kiinnostuneita</li>
            </ul>
            <p>Jäsenmäärämme on tällä hetkellä noin 180 henkilöä.</p>
        </div>
        <h1>Lajit, joita tuemme</h1>
        <div className="supported">
            <ul className="supportedclass">
                <li>• Ralli</li>
                <li>• Sprint</li>
                <li>• Jokamiesluokka</li>
                <li>• Rallicross</li>
            </ul>
        </div>
        <h1>Talvella tapahtuu!</h1>
        <h3>Jäärata talvikaudella</h3>
        <div className="winter">
            <ul className="winterlist">
                <li>• Ylläpidämme jäärataa, jossa järjestetään jäsentenvälisiä kilpailuja.</li>
                <li>• Rataa voi vuokrata esimerkiksi autokerhojen talviharjoitteluun.</li>
                <li>• Siviiliautot ovat myös tervetulleita harjoittelemaan radalle.</li>
            </ul>
        </div>
    </div>
    )    
};

export default Mainpage;