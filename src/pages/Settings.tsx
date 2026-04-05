import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Settings: React.FC = () => {
    const [form, setForm] = useState({
        email: localStorage.getItem("email") || "",
        name: localStorage.getItem("username") || "",
        password: "",
    });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("http://localhost:4242/api/auth/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (data.success) {
                setMessage("✅ Profil mis à jour avec succès !");
                if (form.email) localStorage.setItem("email", form.email);
                if (form.name) localStorage.setItem("username", form.name);

                setTimeout(() => navigate("/dashboard"), 1500);
            } else {
                setMessage("❌ " + data.message);
            }
        } catch {
            setMessage("❌ Erreur serveur");
        }
    };

    return (
        <div className="dashboard-wrapper">
            {/* === Barre de navigation === */}

            {/* === Contenu principal === */}
            <div className="dashboard-card">
                <h2>⚙️ Paramètres du compte</h2>
                <p className="subtitle">Mettez à jour vos informations personnelles.</p>

                <form className="settings-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Pseudo</label>
                        <input
                            type="text"
                            placeholder="Votre pseudo"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Votre nouvel email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Nouveau mot de passe</label>
                        <input
                            type="password"
                            placeholder="Laissez vide pour ne pas changer"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                        />
                    </div>

                    <div className="settings-buttons">
                        <button type="submit" className="btn-update">
                            💾 Mettre à jour
                        </button>
                        <button
                            type="button"
                            className="btn-back"
                            onClick={() => navigate(-1)}
                        >
                            🔙 Retour
                        </button>
                    </div>
                </form>

                {message && (
                    <p className={`message ${message.startsWith("✅") ? "success" : "error"}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Settings;
