import { useState, useEffect } from "react";
import { Scores } from "../interfaces/scores";
import { fetchScores, addScores, updateScores, deleteScores } from "../api/scoresApi";
import Adminnav from "./adminnav";
import "../styles/addscores.css";
import { sign } from "crypto";

const AddScores = () => {
    const [scoresList, setScoresList] = useState<Scores[]>([]);
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    const loadScores = async () => {
        try {
            const data = await fetchScores();
            setScoresList(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Tuntematon virhe");
        } finally {
            setLoading(false);
            if (loading) return <p>Ladataan tuloksia...</p>;
            if (error) return <p>Virhe: {error}</p>;
        }
    };

    useEffect(() => {
        loadScores();
    }, []);

    // Add scores
    const handleAddScores = async () => {
        if (!title || !content) {
            alert("Täytä kaikki kentät!");
            return;
        }

        try {
            await addScores({ title, content });
            setSuccessMessage("Tulokset lisätty onnistuneesti!");
            setTimeout(() => {
                setSuccessMessage(null);
            }, 4000);
            loadScores();
            setTitle("");
            setContent("");
        } catch (error) {
            alert("Tulosten lisääminen epäonnistui.");
        }
    };

    // Delete scores
    const handleDeleteScores = async (id: number) => {
        try {
            await deleteScores(id);
            setSuccessMessage("Tulokset poistettu onnistuneesti!");
            setTimeout(() => {
                setSuccessMessage(null);
            }, 4000);
            loadScores();
        } catch (error) {
            alert("Tulosten poistaminen epäonnistui.");
        }
    };

    // Edit scores
    const handleEditScores = async (scores: Scores) => {
        setEditMode(true);
        setEditId(scores.id);
        setTitle(scores.title);
        setContent(scores.content);
    };

    // Update scores
    const handleUpdateScores = async () => {
        if (!editId) return;

        try {
            await updateScores(editId, title, content);
            setEditMode(false);
            setEditId(null);
            setTitle("");
            setContent("");

            setSuccessMessage("Tulokset muokattu onnistuneesti!");
            setTimeout(() => {
                setSuccessMessage(null);
            }, 4000);
            loadScores();
        } catch (error) {
            alert("Tulosten muokkaaminen epäonnistui.");
        }
    };
    

    return (
        <div className="admin-panel">
            <h1>Hallintapaneeli</h1>
            <Adminnav />
            <div className="add-scores">
                <h2>{editMode ? "Muokkaa Tuloksia" : "Lisää Tulokset"}</h2>
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Otsikko"
                />
                <textarea
                    placeholder="Tulokset"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                {editMode ? (
                    <button onClick={handleUpdateScores} className="update-button">Päivitä</button>
                ) : (
                    <button onClick={handleAddScores} className="publish-button">Julkaise</button>
                )}
            </div>
            <div className="scores-list">
                <h2 className="scores-title">Lisätyt Tulokset</h2>
                {scoresList.length === 0 ? (
                    <p>Ei lisätyjä tuloksia</p>
                ) : (
                    <ul>
                       {scoresList.map((scores) => (
                           <li key={scores.id}>
                                <h3>{scores.title}</h3>
                                <p className="score-content">
                                {scores.content.split('\n').map((line, idx) => {
                                    const trimmed = line.trim();
                                    const isHeading = /^[A-ZÄÖÅ\s\d]+$/.test(trimmed) && !/^\d/.test(trimmed);
                                    return (
                                    <span key={idx}
                                     style={{
                                        display: "block",
                                        fontWeight: isHeading ? "bold" : "normal",
                                        fontSize: isHeading ? "1.2em" : "1em",
                                        marginBottom: isHeading ? "10px" : "4px",
                                        marginTop: isHeading ? "10px" : "0px",
                                        }}
                                    >
                                        {trimmed}
                                    </span>
                                    );
                                })}
                                </p>
                                <div className="button-group">
                                    <button onClick={() => handleEditScores(scores)} className="editScores-button">Muokkaa</button>
                                    <button onClick={() => handleDeleteScores(scores.id)} className="deleteScores-button">Poista</button>
                                </div>
                           </li>
                       ))} 
                    </ul>
                )}
            </div>
            {successMessage && (
                <div style={{
                    position: "fixed",
                    bottom: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "#d4edda",
                    color: "#155724",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    zIndex: 9999,
                    border: "1px solid #c3e6cb"
                }}>
                    {successMessage}
                </div>
            )}
        </div>
    );
};


export default AddScores;