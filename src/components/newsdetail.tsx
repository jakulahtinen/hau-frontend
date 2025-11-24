import { useEffect, useState, useRef } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import "../styles/newsdetail.css";
import { fetchNews } from "../api/newsApi";

const NewsDetail = () => {
    const { id } = useParams(); 
    const [news, setNews] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const newsRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const backLink = location.state?.from === "events" ? "/events" : "/";

    useEffect(() => {
        const loadNews = async () => {
            try {
                setLoading(true);
                const data = await fetchNews();
                const found = data.find((news: any) => news.id === parseInt(id!));
                setNews(found || null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Tuntematon virhe");
            } finally {
                setLoading(false);
            }
        };
        loadNews();
    }, [id]);

    const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };
        return new Date(dateString).toLocaleDateString("fi-FI", options);
    };

    useEffect(() => {
        if (news) {
            setTimeout(() => {
                const navbarHeight = document.querySelector(".navbar")?.clientHeight || 80; 
                const offset = navbarHeight + 50; 
                const top = newsRef.current!.getBoundingClientRect().top + window.scrollY - offset;
    
                window.scrollTo({ top, behavior: "smooth" });
            }, 200);
        }
    }, [news]);

    if (loading) return <p>Ladataan...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className="news-detail" ref={newsRef}>
            {news ? (
                <>
                    <div className="news-header">
                        <Link to={backLink}>
                            <ArrowBackIosNewRoundedIcon className="back-button" fontSize="large" style={{ color: "black" }}/>
                        </Link>
                    </div>
                    <h1>{news.title}</h1>
                    <p className="news-date">{formatDate(news.publishedAt)}</p>
                    {news.imageUrl && (
                        <img
                            src={news.imageUrl}
                            alt={news.title}
                            className="news-detail-image"
                        />
                    )}
                    <p>{news.content}</p>
                </>
            ) : (
                <p>Uutista ei löytynyt.</p>
            )}
        </div>
    );
};

export default NewsDetail;