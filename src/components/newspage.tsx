import React, { useEffect, useRef, useState } from "react";
import "../styles/news.css";
import { News } from "../interfaces/news";
import { fetchNews } from "../api/newsApi";

const NewsPage = () => {
    const [newsList, setNewsList] = useState<News[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadNews = async () => {
            try {
                setLoading(true);
                const data = await fetchNews();
                setNewsList(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Tuntematon virhe");
            } finally {
                setLoading(false);
            }
        };
        loadNews();
    }, []);

    useEffect(() => {
        if (newsList) {
            setTimeout(() => {
                const navbarHeight = document.querySelector(".navbar")?.clientHeight || 80; 
                const offset = navbarHeight + 50; 
                const top = navRef.current!.getBoundingClientRect().top + window.scrollY - offset;
    
                window.scrollTo({ top, behavior: "smooth" });
            }, 200);
        }
    }, [newsList]);

    if (loading) return <p>Ladataan uutisia...</p>;
    if (error) return <p>Virhe: {error}</p>;

    return (
        <div className="news-container" ref={navRef}>
            {newsList.map((news: any) => (
                <div className="news-item" key={news.id}>
                    <div className="news-image">
                        {news.imageData ? (
                            <img
                            src={news.imageData ? `data:image/jpeg;base64,${news.imageData}` : 'default-image.jpg'}
                            alt={news.title}
                            />
                        ) : (
                            <div className="placeholder">Ei kuvaa</div>
                        )}
                    </div>
                    <div className="news-content">
                        <div className="news-title">
                            <h3>{news.title}</h3>
                        </div>
                        <div className="news-summary">
                            <p>{news.content.substring(0, 50)}...</p>
                        </div>
                        <a href={`/news/${news.id}`} className="read-more">Lue lisää</a>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NewsPage;