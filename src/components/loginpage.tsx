import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/login.css";
import { login } from '../api/authApi';

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
            const data = await login(username, password);
            localStorage.setItem("token", data.token);
            window.dispatchEvent(new Event("storage"));
            navigate("/admin");
        } catch (err) {
            setError("Kirjautuminen epäonnistui. Tarkista tiedot.");
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