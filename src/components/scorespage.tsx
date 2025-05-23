import React, { useEffect, useState } from "react";
import { Scores } from "../interfaces/scores";
import { fetchScores } from "../api/scoresApi";
import "../styles/scorespage.css";

const Scorespage = () => {
    const [scoresList, setScoresList] = useState<Scores[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedScore, setSelectedScore] = useState<Scores | null>(null);

    useEffect(() => {
        const loadScores = async () => {
            try {
                setLoading(true);
                const data = await fetchScores();
                setScoresList(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Tuntematon virhe");
            } finally {
                setLoading(false);
            }
        };
        loadScores();
    }, []);

    const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };
        return new Date(dateString).toLocaleDateString("fi-FI", options);
    };

    if (loading) return <p>Ladataan tuloksia...</p>;
    if (error) return <p>Virhe: {error}</p>;

    return (
            <div className="scores-container">
                {/* Left-side */}
                <div className="scorespage-list">
                    <h2 className="section-title">Tulokset</h2>
                    {scoresList.map((score) => (
                        <button
                            key={score.id}
                            onClick={() => setSelectedScore(score)}
                            className={`score-title-button ${selectedScore?.id === score.id ? "selected" : ""}`}
                        >
                            {score.title}
                        </button>
                    ))}
                </div>

                {/* Right-side */}
                <div className="scores-details">
                    {selectedScore ? (
                        <div>
                            <h2 className="score-title">{selectedScore.title}</h2>
                            <p className="score-date">{formatDate(selectedScore.publishedAt)}</p>
                                <p className="score-content">
                                    {selectedScore.content.split('\n').map((line, idx) => {
                                        const trimmed = line.trim();
                                        const isHeading = /^[A-ZÄÖÅ\s\d]+$/.test(trimmed) && !/^\d/.test(trimmed);
                                        return (
                                        <span key={idx}
                                        style={{
                                            display: "block",
                                            fontWeight: isHeading ? "bold" : "normal",
                                            fontSize: isHeading ? "1.2em" : "1em",
                                            marginBottom: isHeading ? "10px" : "4px",
                                            marginTop: isHeading ? "40px" : "0px",
                                            }}
                                        >
                                            {trimmed}
                                        </span>
                                        );
                                    })}
                                </p>
                        </div>
                    ) : (
                        <p>Valitse tulos vasemmalta nähdäksesi sisällön.</p>
                    )}
            </div>
        </div>
    );
};

export default Scorespage;