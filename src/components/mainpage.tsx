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
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);

    // Fade the news to next one in every 30 seconds.
    useEffect(() => {
        if (!newsList || newsList.length === 0) return;
      
        const interval = setInterval(() => {
          setFade(false); 
          setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % newsList.length);
            setFade(true);
          }, 300); 
        }, 30000);
      
        return () => clearInterval(interval);
    }, [newsList]);


    // Touch swipe events
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (touchStartX === null) return;
        const touchEndX = e.touches[0].clientX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
        if (diff > 0) {
            setCurrentIndex((prev) => (prev + 1) % newsList.length);
        } else {
            setCurrentIndex((prev) => (prev - 1 + newsList.length) % newsList.length);
        }
        setTouchStartX(null);
        }
    };

    // Fetch news from API
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

    const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };
        return new Date(dateString).toLocaleDateString("fi-FI", options);
    };

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

            <h1 className="latest-news-title">Viimeisimmät uutiset</h1>
            {loading ? (
            <p>Ladataan...</p>
            ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
            ) : newsList.length > 0 ? (
            <div 
            className="latest-news-carousel"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            >
                <div
                    className="carousel-arrow left"
                    onClick={() =>
                        setCurrentIndex((prev) =>
                            prev === 0 ? newsList.length - 1 : prev - 1
                        )
                    }
                >
                    ‹
                </div>
                <div
                    className="carousel-arrow right"
                    onClick={() =>
                        setCurrentIndex((prev) =>
                            (prev + 1) % newsList.length
                        )
                    }
                >
                    ›
                </div>
                <Link to={`/news/${newsList[currentIndex].id}`} state={{ from: "mainpage" }} className="news-item-link">
                <div className={`news-item-frontpage ${fade ? "fade-in" : "fade-out"} ${!newsList[currentIndex].imageData ? "no-image" : ""}`}>
                    <div className="news-title">
                        <h3>{newsList[currentIndex].title}</h3>
                        <p className="news-date">{formatDate(newsList[currentIndex].publishedAt ?? "")}</p>
                    </div>
                    {newsList[currentIndex].imageData && (
                    <div className="news-image-frontpage">
                        <img
                        src={`data:image/jpeg;base64,${newsList[currentIndex].imageData}`}
                        alt={newsList[currentIndex].title}
                        className="main-news-image"
                        />
                    </div>
                    )}
                    <div className="news-content">
                        <p>{newsList[currentIndex].content}</p>
                    </div>
                </div>
                </Link>

                <div className="carousel-indicators">
                {/* Indicators*/}
                {newsList.map((_, index) => (
                    <span
                    key={index}
                    className={`indicator-dot ${index === currentIndex ? "active" : ""}`}
                    onClick={() => setCurrentIndex(index)}
                    />
                ))}
                </div>
            </div>
            ) : null}
        <div className="read-more-wrapper">
            <Link to="/events" className="read-more">
                Lue lisää
            </Link>
        </div>
        <br />

        {/*Bottom text-area */}
        <h1>Kuka voi liittyä mukaan?</h1>
        <div className="whocanjoin">
            <p>Seuraamme kuuluu ja voi liittyä:</p>
            <ul className="whocanjoinlist">
                <li>• Kilpailijoita</li>
                <li>• Toimitsijoita</li>
                <li>• Mekaanikkoja</li>
                <li>• Muuten lajista kiinnostuneita</li>
            </ul>
            <p>Jäsenmäärämme on tällä hetkellä noin 180.</p>
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
                <li>Ylläpidämme jäärataa, jossa järjestetään jäsentenvälisiä kilpailuja.</li>
                <br />
                <li>Rataa voi vuokrata esimerkiksi autokerhojen talviharjoitteluun.</li>
                <br />
                <li>Siviiliautot ovat myös tervetulleita harjoittelemaan radalle.</li>
            </ul>
        </div>
    </div>
    )    
};

export default Mainpage;