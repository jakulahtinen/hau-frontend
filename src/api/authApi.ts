import { LoginResponse } from "../interfaces/auth";

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const login = async (
    username: string,
    password: string
): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/authAuth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        throw new Error("Kirjautuminen epäonnistui");
    }

    return await response.json();
};