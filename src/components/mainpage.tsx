import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/main.css";
import HauPhotoSub from '../assets/HauPhotoSub.png';
import HauWinter from '../assets/Hau_winter.jpg';
import { News } from "../interfaces/news";
import { fetchNews } from "../api/newsApi";

const Mainpage = () => {
    const [newsList, setNewsList] = useState<News[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [offsetX, setOffsetX] = useState(0);
    const THRESHOLD = 50;
    const hasSlides = newsList.length > 0;
    const hasMultipleSlides = newsList.length > 1;
    const SLIDE_WIDTH_PERCENTAGE = 100;
    const translatePercentage = currentIndex * SLIDE_WIDTH_PERCENTAGE;
    const shouldAnimate = touchStartX === null && offsetX === 0;

    const trimText = (text: string, maxLength: number) => {
        if (!text) return "";
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    // Fade the news to next one in every 30 seconds.
    useEffect(() => {
        if (!hasMultipleSlides) return;

        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setCurrentIndex((prevIndex) => {
                    if (!hasSlides) return 0;
                    return (prevIndex + 1) % newsList.length;
                });
                setFade(true);
            }, 300);
        }, 30000);
      
        return () => clearInterval(interval);
    }, [hasMultipleSlides, hasSlides, newsList.length]);

    useEffect(() => {
        if (!hasSlides) {
            setCurrentIndex(0);
            return;
        }

        setCurrentIndex((prev) => (prev >= newsList.length ? newsList.length - 1 : prev));
    }, [hasSlides, newsList.length]);


    // Touch swipe events
    const handleTouchStart = (e: React.TouchEvent) => {
        if (!hasMultipleSlides) return;
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (touchStartX === null || !hasMultipleSlides) return;
        
        const touchEndX = e.touches[0].clientX;
        const diff = touchStartX - touchEndX;
        
        setOffsetX(diff);
        
    };

    const handleTouchEnd = () => {
        if (touchStartX === null) return;
        if (!hasSlides) {
            setTouchStartX(null);
            setOffsetX(0);
            return;
        }

        if (!hasMultipleSlides) {
            setTouchStartX(null);
            setOffsetX(0);
            return;
        }
        
        if (Math.abs(offsetX) > THRESHOLD) {
            if (offsetX > 0) {
                // Swipe Left (Go to Next Item)
                setCurrentIndex((prev) => (prev + 1) % newsList.length);
            } else {
                // Swipe Right (Go to Previous Item)
                setCurrentIndex((prev) => (prev - 1 + newsList.length) % newsList.length);
            }
        }
        
        setTouchStartX(null);
        setOffsetX(0); 
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

    const goToPrevious = () => {
        if (!hasMultipleSlides) return;
        setCurrentIndex((prev) => (prev - 1 + newsList.length) % newsList.length);
    };

    const goToNext = () => {
        if (!hasMultipleSlides) return;
        setCurrentIndex((prev) => (prev + 1) % newsList.length);
    };

    return (
        <div className="mainpage">
        <h1 className="welcomeText">Tervetuloa seuramme sivuille!</h1>
        <h3>Yhdessä autourheilun parissa</h3>
            <div className="mainpagewelcome">
                <p>Seuramme tavoitteena on yhdistää autourheilusta kiinnostuneet ja edistää eri lajien harrastamista Hirvensalmella ja sen ympäristössä.</p>
                <p> Järjestämme kilpailuja ja muita autoiluun liittyviä tapahtumia, jotka tarjoavat elämyksiä kaikille lajin ystäville.</p>
            </div>
            <div className="mainpagepicture">
                <img src={HauPhotoSub} alt="Main Picture" className="mainpagepicture" />
                <p style={{ marginTop: "0px", textAlign: "center" }}>Hirvensalmen autourheilijat on perustettu vuonna 1997. </p>
            </div>

            <h1 className="latest-news-title">Viimeisimmät uutiset</h1>
            {loading ? (
                <p>Ladataan...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : newsList.length > 0 ? (
                <div className="latest-news-carousel-viewport"> 
                    
                    <div 
                        className="news-slider-track"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd} 
                        style={{
                            transform: `translateX(calc(-${translatePercentage}% - ${offsetX}px))`,
                            transition: shouldAnimate ? 'transform 0.3s ease-out' : 'none'
                        }}
                        onTouchCancel={handleTouchEnd}
                    >
                        {newsList.map((news, index) => (
                            <div key={news.id} className="news-slide-item">
                                <Link to={`/news/${news.id}`} state={{ from: "mainpage" }} className="news-item-link">
                                    <div className={`news-item-frontpage ${news.imageUrl ? "has-image" : "no-image"}`}>
                                        <div className="news-title">
                                            <h3>{news.title}</h3>
                                            <p className="news-date">{formatDate(news.publishedAt ?? "")}</p>
                                        </div>
                                        {news.imageUrl && (
                                            <div className="news-image-frontpage">
                                                <img src={`${news.imageUrl}`} alt={news.title} className="main-news-image" />
                                            </div>
                                        )}
                                        <div className="news-content">
                                            <p>
                                                {news.imageUrl ? trimText(news.content, 150) : news.content}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}

                    </div>
                        <div
                            className="carousel-arrow left"
                            onClick={() =>
                                goToPrevious()

                            }
                        >
                        ‹
                        </div>
                                <div
                            className="carousel-arrow right"
                            onClick={() =>
                                goToNext()
                            }
                        >
                        ›
                        </div>
                    
                    <div className="carousel-indicators">
                        {newsList.map((_, index) => (
                            <span
                                key={index}
                                className={`indicator-dot ${index === currentIndex ? "active" : ""}`}
                                onClick={() => setCurrentIndex(index)}
                            />
                        ))}
                    </div>

                </div>
            ) : (
                <p>Ei löytynyt.</p>
            )}
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
        <img src={HauWinter} alt="winter" className="winter-image"/>
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