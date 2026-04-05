import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ResetPassword.css";

const API_URL =
    import.meta.env.MODE === "production"
        ? "https://api.edendisk.com"
        : "http://localhost:4242";

const ResetPassword: React.FC = () => {
    const query = new URLSearchParams(useLocation().search);
    const token = query.get("token");
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch(`${API_URL}/api/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });
            const data = await res.json();

            setMessage(data.message);
            if (data.success) {
                setSuccess(true);
                setTimeout(() => navigate("/login"), 3000); // 🚀 redirection douce
            }
        } catch {
            setMessage("💥 Erreur de connexion au serveur.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="reset-page">
            <div className={`reset-card ${success ? "success-mode" : ""}`}>
                {!success ? (
                    <>
                        <h2>🔒 Nouveau mot de passe</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="password"
                                placeholder="Nouveau mot de passe"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button type="submit" disabled={loading}>
                                {loading ? "⏳ Réinitialisation..." : "Réinitialiser"}
                            </button>
                        </form>

                        {message && <p className="msg">{message}</p>}
                    </>
                ) : (
                    <>
                        <div className="success-icon">✅</div>
                        <h2 className="success-text">Mot de passe modifié avec succès !</h2>
                        <p className="redirect-text">
                            Redirection vers la connexion...
                        </p>
                    </>
                )}
            </div>
        </section>
    );
};

export default ResetPassword;
