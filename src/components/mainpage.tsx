import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/main.css";
import mainpagepicture from '../assets/mainpageheader.jpg';
import { News } from "../interfaces/news";
import { fetchNews } from "../api/newsApi";

const Mainpage = () => {
    const [newsList, setNewsList] = useState<News[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadNews = async () => {
            try {
                const data = (await fetchNews()).slice(0, 3);
                setNewsList(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Tuntematon virhe");
            } finally {
                setLoading(false);
            }
        };

        loadNews();
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
        {loading ? (
            <p>Ladataan...</p>
        ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
        ) : (
            <div className="latest-news">
            {newsList.map((news) => (
            <Link to={`/news/${news.id}`} className="news-item-link">
                <div key={news.id} className="news-item-frontpage">
                    <h3>{news.title}</h3>
            
                    {news.imageData && (
                        <div className="news-image-frontpage">
                            <img
                                src={`data:image/jpeg;base64,${news.imageData}`}
                                alt={news.title}
                            />
                        </div>
                    )}
            
                    <p>{news.content}</p>
                </div>
            </Link>
            ))}
            </div>
        )}
        <div className="read-more-wrapper">
            <Link to="/events" className="read-more">
                Lue lisää
            </Link>
        </div>
        <br />

        
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