import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

const API_URL =
    import.meta.env.MODE === "production"
        ? "https://api.edendisk.com"
        : "http://localhost:4242";

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            setMessage(data.message);

            if (data.success) {
                setSuccess(true);
                setTimeout(() => navigate("/login"), 3500); // 🚀 redirection douce
            }
        } catch {
            setMessage("💥 Erreur serveur, veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="forgot-page">
            <div className={`forgot-card ${success ? "success-mode" : ""}`}>
                {!success ? (
                    <>
                        <h2>📩 Mot de passe oublié</h2>
                        <p className="forgot-info">
                            Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.
                        </p>

                        <form onSubmit={handleSubmit}>
                            <input
                                type="email"
                                placeholder="Votre adresse e-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit" disabled={loading}>
                                {loading ? "⏳ Envoi en cours..." : "Envoyer le lien"}
                            </button>
                        </form>

                        {message && <p className="msg">{message}</p>}
                    </>
                ) : (
                    <>
                        <div className="success-icon">✅</div>
                        <h2 className="success-text">Lien envoyé avec succès !</h2>
                        <p className="redirect-text">
                            Vérifiez votre boîte mail 📩 <br />
                            Redirection vers la connexion...
                        </p>
                    </>
                )}
            </div>
        </section>
    );
};

export default ForgotPassword;
