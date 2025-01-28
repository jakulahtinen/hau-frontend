import React, { useEffect, useState } from "react";
import "../styles/news.css";

interface News {
    id: number;
    title: string;
    content: string;
    imageData?: string;
}

const NewsPage = () => {
    const [newsList, setNewsList] = useState<News[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.REACT_APP_API_URL}/news`);
                if (!response.ok) {
                    throw new Error("Uutisten haku epäonnistui");
                }
                const data = await response.json();
                setNewsList(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Tuntematon virhe");
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    if (loading) return <p>Ladataan uutisia...</p>;
    if (error) return <p>Virhe: {error}</p>;

    return (
        <div className="news-page">
            <h1>Uutiset</h1>
            {newsList.length === 0 ? (
                <p>Ei uutisia saatavilla.</p>
            ) : (
                newsList.map((news) => (
                    <div key={news.id} className="news-item">
                        <h2>{news.title}</h2>
                        <p>{news.content}</p>
                        {news.imageData && (
                            <img
                                src={`data:image/png;base64,${news.imageData}`}
                                alt="Uutisen kuva"
                                style={{ maxWidth: "200px", maxHeight: "200px" }}
                            />
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default NewsPage;