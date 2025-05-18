import React, { useState, useEffect, useRef } from "react";
import "../styles/admin.css";
import Adminnav from "./adminnav";
import { News } from "../interfaces/news";
import { fetchNews, createNews, updateNews, deleteNews } from "../api/newsApi";

const AdminPanel = () => {
    const [newsList, setNewsList] = useState<News[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccesMessage] = useState<string | null>(null);


    const loadNews = async () => {
        try {
            setLoading(true);
            const data = await fetchNews(); 
            setNewsList(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Tuntematon virhe");
        } finally {
            setLoading(false);
            if (loading) return <p>Ladataan uutisia...</p>;
            if (error) return <p>Virhe: {error}</p>;
        }
    }; 

    useEffect(() => {
        loadNews();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleDeleteImage = () => {
        setImageFile(null);
        setImagePreview(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };


    const handleAddNews = async () => {
        if (!title || !content) {
            alert("Täytä kaikki kentät!");
            return;
        }
    
        try {
            await createNews({ title, content, imageData: imageFile ?? undefined });
            setSuccesMessage("Uutinen lisatty onnistuneesti!");
            setTimeout(() => {
                setSuccesMessage(null);
            }, 4000);
            loadNews();
            setTitle("");
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            setContent("");
            setImageFile(null);
            setImagePreview(null);
        } catch (error) {
            alert("Uutisen lisääminen epäonnistui.");
        }
    };
    
    const handleDeleteNews = async (id: number) => {
        try {
            await deleteNews(id);
            setSuccesMessage("Uutinen poistettu onnistuneesti!");
            setTimeout(() => {  
                setSuccesMessage(null);
            }, 4000);
            loadNews();
        } catch (error) {
            alert("Uutisen poistaminen epäonnistui.");
        }
    };

    const handleEditNews = (news: News) => {
        setEditMode(true);
        setEditId(news.id);
        setTitle(news.title);
        setContent(news.content);
    };

    const handleUpdateNews = async () => {
        if (!editId) return;
    
        try {
            await updateNews(editId, title, content);
            setEditMode(false);
            setEditId(null);
            setTitle("");
            setContent("");

            setSuccesMessage("Uutinen päivitetty onnistuneesti!");
            setTimeout(() => {  
                setSuccesMessage(null);
            }, 4000);
            loadNews();
        } catch (error) {
            alert("Failed to edit news. Please check your permissions.");
        }
    };

    return (
        <div className="admin-panel">
            <h1>Hallintapaneeli</h1>
            <Adminnav/>
            <div className="add-news">
                <h2>{editMode ? "Muokkaa uutista" : "Lisää uutinen"}</h2>
                <input
                    type="text"
                    placeholder="Otsikko"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="Sisältö..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <input
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    ref={fileInputRef}
                />

                {imagePreview && (
                    <div>
                        <img src={imagePreview} alt="Preview" className="preview-image" />
                        <br />
                        <button onClick={handleDeleteImage} className="delete-button" >Poista kuva</button>
                    </div>
                )}
                <br />
                {editMode ? (
                    <button onClick={handleUpdateNews} className="update-button">Päivitä</button>
                ) : (
                    <button onClick={handleAddNews} className="publish-button">Julkaise</button>
                )}
            </div>
            <div className="news-list">
                <h2 className="added-news-text">Lisätyt Uutiset</h2>
                {newsList.length === 0 ? (
                    <p>Ei uutisia.</p>
                ) : (
                    <ul>
                        {newsList.map((news) => (
                            <li key={news.id}>
                                <h3>{news.title}</h3>
                                {news.imageData && (
                                    <img
                                        src={`data:image/png;base64,${news.imageData}`}
                                        alt="News Image"
                                        className="news-image-admin"
                                    />
                                )}
                                <p>{news.content}</p>
                                <button onClick={() => handleEditNews(news)} className="edit-button">Muokkaa</button>
                                <button onClick={() => handleDeleteNews(news.id)} className="deleteNews-button">Poista</button>
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

export default AdminPanel;