import React, { useState, useEffect } from "react";
import "../styles/admin.css";
import Adminnav from "./adminnav";

interface News {
    id: number;
    title: string;
    content: string;
    imageData?: string;
}

const Addpicture = () => {
    const [newsList, setNewsList] = useState<News[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // HERE FETCH PICTURES FROM BACKEND
    // const fetchNews = async () => {
    //     try {
    //         const response = await fetch(`${process.env.REACT_APP_API_URL}/News`);
    //         if (!response.ok) {
    //             throw new Error(`HTTP Error: ${response.status}`);
    //         }
    //         const data = await response.json();
    //         setNewsList(data);
    //     } catch (err) {
    //         console.error("Failed to fetch news:", err);
    //     }
    // };

    // useEffect(() => {
    //     fetchNews();
    // }, []);

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
    };

    // const handleAddNews = async () => {
    //     if (!title || !content) {
    //       return alert("Täytä kaikki kentät!");
    //     }

    //     let imageData = null;

    //     if (imageFile) {
    //         const reader = new FileReader();
    //         reader.readAsDataURL(imageFile);

    //         reader.onload = async () => {
    //             imageData = reader.result?.toString().split(",")[1]; // Base64 data

    //             const response = await fetch(`${process.env.REACT_APP_API_URL}/News`, {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify({ title, content, imageData }),
    //             });

    //             if (response.ok) {
    //                 fetchNews();
    //                 setTitle("");
    //                 setContent("");
    //                 setImageFile(null);
    //                 setImagePreview(null);
    //             } else {
    //                 alert("Failed to add news.");
    //             }
    //         };
    //     } else {
    //         // Send without image
    //         const response = await fetch(`${process.env.REACT_APP_API_URL}/News`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({ title, content, imageData: null }), // Image is null
    //         });

    //         if (response.ok) {
    //             fetchNews();
    //             setTitle("");
    //             setContent("");
    //             setImageFile(null);
    //             setImagePreview(null);
    //         } else {
    //             alert("Failed to add news.");
    //         }
    //     }
    // };

    // const handleDeleteNews = async (id: number) => {
    //     const response = await fetch(`${process.env.REACT_APP_API_URL}/News/${id}`, {
    //         method: "DELETE",
    //     });

    //     if (response.ok) {
    //         fetchNews();
    //     } else {
    //         alert("Failed to delete news.");
    //     }
    // };

    // const handleEditNews = (news: News) => {
    //     setEditMode(true);
    //     setEditId(news.id);
    //     setTitle(news.title);
    //     setContent(news.content);
    // };

    // const handleUpdateNews = async () => {
    //     if (!editId) return;

    //     const response = await fetch(`${process.env.REACT_APP_API_URL}/News/${editId}`, {
    //         method: "PUT",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({ title, content }),
    //     });

    //     if (response.ok) {
    //         fetchNews();
    //         setEditMode(false);
    //         setEditId(null);
    //         setTitle("");
    //         setContent("");
    //     } else {
    //         alert("Failed to edit news.");
    //     }
    // };

    return (
        <div className="admin-panel">
            <h1>Admin Panel</h1>
            <Adminnav/>
            <div className="add-news">
                <h2>{editMode ? "Edit News" : "Add News"}</h2>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {imagePreview && (
                    <div>
                        <img src={imagePreview} alt="Preview" style={{ maxWidth: "200px", maxHeight: "200px", margin: "10px 0" }} />
                        <button onClick={handleDeleteImage}>Delete Image</button>
                    </div>
                )}
                {/* {editMode ? (
                    <button onClick={handleUpdateNews}>Update</button>
                ) : (
                    <button onClick={handleAddNews}>Publish</button>
                )} */}
            </div>
            <div className="news-list">
                <h2>Current News</h2>
                {newsList.length === 0 ? (
                    <p>No news.</p>
                ) : (
                    <ul>
                        {newsList.map((news) => (
                            <li key={news.id}>
                                <h3>{news.title}</h3>
                                <p>{news.content}</p>
                                {news.imageData && (
                                    <img
                                        src={`data:image/png;base64,${news.imageData}`}
                                        alt="News Image"
                                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                                    />
                                )}
                                {/* <button onClick={() => handleEditNews(news)}>Edit</button>
                                <button onClick={() => handleDeleteNews(news.id)}>Delete</button> */}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Addpicture;