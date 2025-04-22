import { Picture } from "../interfaces/picture";

const API_URL = process.env.REACT_APP_API_URL;

//GET PICTURE
export const fetchPictures = async (): Promise<Picture[]> => {
    const response = await fetch(`${API_URL}/Pictures`);
    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }
    return response.json();
};


//POST PICTURE
export const addPicture = async (title: string, imageFile: File): Promise<void> => {

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

    const response = await fetch(`${process.env.REACT_APP_API_URL}/Pictures`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ title, imageDataBase64: imageData }),
    });

    if (response.ok) {
        console.log("Kuva lisätty onnistuneesti!");
    } else {
        const errorText = await response.text();
        alert(`Kuvan lisääminen epäonnistui: ${errorText}`);
    }
};


//DELETE PICTURE
export const deletePicture = async (id: number): Promise<void> => {

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Et ole kirjautunut sisään!");
      return;
    }

    const response = await fetch(`${API_URL}/Pictures/${id}`, {
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

    const response = await fetch(`${API_URL}/Pictures/${id}`, {
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