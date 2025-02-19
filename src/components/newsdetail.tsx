import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import "../styles/newsdetail.css";

const NewsDetail = () => {
    const { id } = useParams<{ id: string }>(); // Haetaan uutisen ID URL:stä
    const [news, setNews] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const newsRef = useRef<HTMLDivElement>(null); // Ref uutisen sisällölle

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/news/${id}`);
                if (!response.ok) {
                    throw new Error("Uutisen haku epäonnistui");
                }
                const data = await response.json();
                setNews(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Tuntematon virhe");
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [id]);

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
                <Link to="/events"><ArrowBackIosNewRoundedIcon fontSize="large" style={{marginTop: "5px"}}/></Link>
                    <h1>{news.title}</h1>
                    {news.imageData && (
                        <img
                            src={`data:image/jpeg;base64,${news.imageData}`}
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