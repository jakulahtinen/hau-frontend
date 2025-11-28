import React, { useState, useEffect, useRef } from "react";
import { Picture } from "../interfaces/picture";
import { Folder } from "../interfaces/folder";
import { fetchPictures, addPicture, deletePicture, updateCaption, fetchFolders, createFolder } from "../api/picturesApi";
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

    const [folders, setFolders] = useState<Folder[]>([]);
    const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
    const [newFolderName, setNewFolderName] = useState("");
    const [isCreatingNewFolder, setIsCreatingNewFolder] = useState(false);



    useEffect(() => {
        loadData(); // Combined data loading function
    }, []);

    const loadData = async () => {
        try {
            // Load Pictures (only needed for the existing gallery list)
            const picturesData = await fetchPictures(); 
            setPictures(picturesData);

            // Load Folders (New)
            const foldersData = await fetchFolders();
            setFolders(foldersData);
            
            // Set the latest folder as default selection if available
            if (foldersData.length > 0) {
                setSelectedFolderId(foldersData[0].id);
            }
        } catch (error) {
            console.error("Error loading data:", error);
        }
    };

    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) {
            alert("Syötä kansion nimi.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Et ole kirjautunut sisään!");
            return;
        }

        try {
            const newFolder = await createFolder(newFolderName.trim(), token);
            setFolders([newFolder, ...folders]); // Add new folder to the top
            setSelectedFolderId(newFolder.id); // Select the new folder
            setNewFolderName("");
            setIsCreatingNewFolder(false);
        } catch (error) {
            console.error("Error creating folder:", error);
            alert("Kansion luominen epäonnistui.");
        }
    };

    const handleAddPicture = async () => {
        if (!imageFile || !selectedFolderId) {
            alert("Valitse kuva JA kansio.");
            return;
        }

        try {
            // Pass the selectedFolderId to the API call
            await addPicture(title, imageFile, selectedFolderId); 
            setSuccesMessage("Kuva lisätty onnistuneesti!");
            // ... [Reset form fields] ...
            setTitle("");
            if (fileInputRef.current) fileInputRef.current.value = "";
            setImageFile(null);
            setImagePreview(null);
            loadData(); 

        } catch (error) {
            console.error("Error adding picture:", error);
            alert("Kuvan lisääminen epäonnistui.");
        }
    };


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
            alert("Kuvan poistaminen epäonnistui.");
        }
    };

    return (
        <div className="admin-panel">
            <h1>Hallintapaneeli</h1>
            <Adminnav />
            <div className="add-picture">
                <h2>Lisää uusi kuva</h2>

                {/* --- FOLDER SELECTION/CREATION --- */}
                <div className="folder-management">
                    <select
                        value={selectedFolderId ?? ""}
                        onChange={(e) => setSelectedFolderId(Number(e.target.value))}
                        disabled={isCreatingNewFolder}
                    >
                        <option value="" disabled>Valitse kansio</option>
                        {folders.map(folder => (
                            <option key={folder.id} value={folder.id}>{folder.name}</option>
                        ))}
                    </select>

                    <button 
                        onClick={() => setIsCreatingNewFolder(prev => !prev)}
                        className="create-folder-toggle"
                    >
                        {isCreatingNewFolder ? "Peruuta" : "Luo uusi kansio"}
                    </button>
                    
                    {isCreatingNewFolder && (
                        <div className="new-folder-input">
                            <input
                                type="text"
                                placeholder="Uuden kansion nimi"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                            />
                            <button onClick={handleCreateFolder}>Luo</button>
                        </div>
                    )}
                </div>

                <input
                 type="file" 
                 accept="image/*" 
                 onChange={handleFileChange} 
                 ref={fileInputRef}
                 disabled={editMode}
                />

                {imagePreview && (
                    <div>
                        <img src={imagePreview} alt="Preview" className="add-preview-image"/>
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
                                {picture.imageUrl && (
                                    <img
                                        src={picture.imageUrl}
                                        alt="News Image"
                                        className="add-images-admin"
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