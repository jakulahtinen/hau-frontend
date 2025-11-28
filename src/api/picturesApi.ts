import { Picture } from "../interfaces/picture";
import { Folder } from "../interfaces/folder";

const API_BASE_URL = process.env.REACT_APP_API_URL;

// FOLDERS API

export const fetchFolders = async (): Promise<Folder[]> => {
    const response = await fetch(`${API_BASE_URL}/api/Folders`);
    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }
    // Sort by creation date descending (newest first)
    const data: Folder[] = await response.json();
    return data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const createFolder = async (name: string, token: string): Promise<Folder> => {
    const response = await fetch(`${API_BASE_URL}/api/Folders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
    });
    if (!response.ok) {
        throw new Error("Kansion luominen epäonnistui");
    }
    return response.json();
};

// 1. Fetch pictures by folder (for Photospage album view)
export const fetchPicturesByFolder = async (folderId: number): Promise<Picture[]> => {
    const response = await fetch(`${API_BASE_URL}/api/Pictures/folder/${folderId}`);
    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }
    return response.json();
};

// 2. Fetch latest pictures (for Photospage preview)
export const fetchLatestPictures = async (count: number = 6): Promise<Picture[]> => {
    const response = await fetch(`${API_BASE_URL}/api/Pictures/latest?count=${count}`);
    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }
    return response.json();
};



//GET PICTURE
export const fetchPictures = async (): Promise<Picture[]> => {
    const response = await fetch(`${API_BASE_URL}/api/Pictures`);
    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }
    return response.json();
};


// 3. POST PICTURE (MODIFIED)
export const addPicture = async (title: string, imageFile: File, folderId: number): Promise<void> => {
    const token = localStorage.getItem("token");

	if (!token) {
		alert("Et ole kirjautunut sisään!");
		return;
    }
    
    let imageData = ""; 
    if (imageFile) {
        const reader = new FileReader();
        const imagePromise = new Promise<string>((resolve) => {
            reader.onload = () => {
                const base64Data = reader.result?.toString().split(",")[1] || "";
                resolve(base64Data);
            };
            reader.readAsDataURL(imageFile);
        });
        imageData = await imagePromise;
    }


    const response = await fetch(`${API_BASE_URL}/api/Pictures`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ 
            title, 
            imageDataBase64: imageData, 
            folderId 
        }), 
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Kuvan lisääminen epäonnistui: ${errorText}`);
    }
};















//DELETE PICTURE
export const deletePicture = async (id: number): Promise<void> => {

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Et ole kirjautunut sisään!");
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/Pictures/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Kuvan poistaminen epäonnistui");
    }
};


//UPDATE PICTURE-CAPTION
export const updateCaption = async (id: number, title: string): Promise<void> => {

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Et ole kirjautunut sisään!");
        return;
    }

    const response = await fetch(`${API_BASE_URL}/api/Pictures/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ id, title }),
    });

    if (!response.ok) {
        throw new Error("Kuvatekstin päivittäminen epäonnistui");
    }
}