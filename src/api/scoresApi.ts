import { Scores } from "../interfaces/scores";

const API_BASE_URL = process.env.REACT_APP_API_URL;

// GET Scores
export const fetchScores = async (): Promise<Scores[]> => {
    const response = await fetch (`${API_BASE_URL}/Scores`);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    const data: Scores[] = await response.json();
    
    //Sorting the scores
    const sortedScores = data.sort((a, b) => {
        const aPublishedAt = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const bPublishedAt = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;

        //Sorting scores by descending order
        return bPublishedAt - aPublishedAt;
    });

    return sortedScores;
}

// ADD Scores
export const addScores = async (scores: { title: string, content: string }): Promise<void> => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Et ole kirjautunut sisän!");
        return;
    }

    const response = await fetch (`${API_BASE_URL}/Scores`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            title: scores.title,
            content: scores.content
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Tuloksen lisääminen epäonnistui: ${errorText}`)
    }
};

// UPDATE Scores
export const updateScores = async (id: number, title: string, content: string): Promise<void> => {
    
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Et ole kirjautunut sisän!");
        return;
    }

    const response = await fetch (`${API_BASE_URL}/Scores/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, content }),
    });

    if (!response.ok) {
        throw new Error("Tuloksen päivitys epäonnistui");
    }
};

// DELETE Scores
export const deleteScores = async (id: number): Promise<void> => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Et ole kirjautunut sisän!");
        return;
    }

    const response = await fetch (`${API_BASE_URL}/Scores/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        },
    });

    if (!response.ok) {
        throw new Error("Tuloksen poistaminen epäonnistui");
    }
}