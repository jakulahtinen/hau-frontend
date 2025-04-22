import React, { useState, useEffect, useRef } from "react";
import { Picture } from "../interfaces/picture";
import { fetchPictures, addPicture, deletePicture, updateCaption } from "../api/picturesApi";
import Adminnav from "./adminnav";
import "../styles/addpicture.css";

const AddPicture = () => {
    const [pictures, setPictures] = useState<Picture[]>([]);
    const [title, setTitle] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [successMessage, setSuccesMessage] = useState<string | null>(null);

    useEffect(() => {
        loadPictures();
    }, []);

    const loadPictures = async () => {
        try {
            const data = await fetchPictures();
            setPictures(data);
        } catch (error) {
            console.error("Error loading pictures:", error);
        }
    };

    const handleDeleteImage = () => {
        setImageFile(null);
        setImagePreview(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

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

    const handleAddPicture = async () => {
        if (!imageFile) {
            alert("Valitse kuva.");
            return;
        }
        try {
            await addPicture(title, imageFile);
            setSuccesMessage("Kuva lisatty onnistuneesti!");
            setTimeout(() => {
                setSuccesMessage(null);
            }, 4000);
            setTitle("");
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            setImageFile(null);
            setImagePreview(null);
            loadPictures();
        } catch (error) {
            console.error("Error adding picture:", error);
            alert("Kuvan lisääminen epäonnistui.");
        }
    };

    const handleUpdateCaption = async () => {
        if (!editId) return;
        try {
            await updateCaption(editId, title);
            setEditMode(false);
            setEditId(null);
            setTitle("");
            setImageFile(null);

            setSuccesMessage("Kuvateksti päivitetty onnistuneesti!");
            setTimeout(() => {  
                setSuccesMessage(null);
            }, 4000);
            loadPictures();
        } catch (error) {
            console.error("Error updating caption:", error);
            alert("Kuvatekstin muokkaaminen epäonnistui.");
        }
    };

    const handleEditCaption = (picture: Picture) => {
        setEditMode(true);
        setEditId(picture.id);
        setTitle(picture.title);
    };

    const handleDeletePicture = async (id: number) => {
        try {
            await deletePicture(id);
            setSuccesMessage("Kuva poistettu onnistuneesti!");

            //Hide message after 2 seconds>
            setTimeout(() => {  
                setSuccesMessage(null);
            }, 4000);
            loadPictures();
        } catch (error) {
            console.error("Error deleting picture:", error);
            alert("Kuvan poistaminen epäonnistui.");
        }
    };

    return (
        <div className="admin-panel">
            <h1>Admin Panel</h1>
            <Adminnav />
            <div className="add-picture">
                <h2>Lisää uusi kuva</h2>
                <input
                 type="file" 
                 accept="image/*" 
                 onChange={handleFileChange} 
                 ref={fileInputRef}
                />
                {imagePreview && (
                    <div>
                        <img src={imagePreview} alt="Preview" style={{ maxWidth: "50%", maxHeight: "50%", margin: "10px 0", borderRadius: "15px" }} />
                        <br />
                        <button onClick={handleDeleteImage} className="delete-picture">Poista kuva</button>
                    </div>
                )}
                <textarea
                placeholder="Kuvateksti..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                />
                {editMode ? (
                    <button onClick={handleUpdateCaption} className="publish-button">Päivitä</button>
                ) : (
                    <button onClick={handleAddPicture} className="publish-button">Julkaise</button>
                )}
            </div>
            <div className="image-list">
                <h2>Lisätyt kuvat</h2>
                {pictures.length === 0 ? (
                    <p>Ei lisättyjä kuvia.</p>
                ) : (
                    <ul>
                        {pictures.map((picture) => (
                            <li key={picture.id}>

                                {picture.imageData && (
                                    <img
                                        src={`data:image/png;base64,${picture.imageData}`}
                                        alt="News Image"
                                        style={{ maxWidth: "50%", maxHeight: "50%" }}
                                    />
                                )}
                                <p>{picture.title}</p>
                                <button onClick={() => handleEditCaption(picture)} className="edit-button">Muokkaa</button>
                                <button onClick={() => handleDeletePicture(picture.id)} className="delete-picture">Poista</button>
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

export default AddPicture;