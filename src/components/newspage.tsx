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

                const sortedData = data.sort(
                    (a: { publishedAt: string }, b: { publishedAt: string }) =>
                        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
                    );
                setNewsList(sortedData);
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
        <div className="news-container">
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
                        <h3 className="news-title">{news.title}</h3>
                        <p className="news-summary">{news.content.substring(0, 150)}...</p>
                        <a href={`/news/${news.id}`} className="read-more">Lue lisää</a>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NewsPage;