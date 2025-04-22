import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/login.css";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/authAuth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
    
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.token);
    
                // Lähetetään storage-event, jotta Navbar huomaa tokenin päivityksen
                window.dispatchEvent(new Event("storage"));
    
                navigate("/admin");
            } else {
                setError("Kirjautuminen epäonnistui. Tarkista tiedot.");
            }
        } catch (err) {
            setError("Jotain meni pieleen.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <h1>Kirjaudu sisään</h1>
            <form onSubmit={handleSubmit}>
                <label>Käyttäjänimi</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <label>Salasana</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Kirjaudu sisään</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default LoginPage;