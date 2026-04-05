import React, { useState } from "react";
import "./VerifyNotice.css";

// 🌍 URL dynamique selon environnement
const API_URL =
    import.meta.env.MODE === "production"
        ? "https://api.edendisk.com" // ton backend en ligne
        : "http://localhost:5000";   // ton backend local

const VerifyNotice: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean | null>(null);

    // 🔁 Fonction : renvoi de l’e-mail de vérification
    const handleResend = async () => {
        setLoading(true);
        setMessage(null);

        try {
            const email = localStorage.getItem("email");
            if (!email) {
                setMessage("❌ Impossible de renvoyer : e-mail introuvable.");
                setSuccess(false);
                setLoading(false);
                return;
            }

            const res = await fetch(`${API_URL}/api/auth/resend-verification`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setMessage("✅ E-mail de confirmation renvoyé avec succès !");
                setSuccess(true);
            } else {
                setMessage("❌ " + (data.message || "Erreur lors du renvoi de l’e-mail."));
                setSuccess(false);
            }
        } catch (err) {
            console.error("💥 Erreur lors du renvoi :", err);
            setMessage("💥 Erreur serveur, veuillez réessayer plus tard.");
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="verify-page">
            <div className="verify-card">
                {/* --- En-tête avec icône --- */}
                <div className="verify-header">
                    <h2>📩 Confirmation requise</h2>
                </div>

                {/* --- Texte d’instructions --- */}
                <p className="verify-text">
                    Un e-mail de confirmation vous a été envoyé.
                    <br />
                    Cliquez sur le lien reçu pour activer votre compte.
                    <br />
                    Si vous ne le trouvez pas, vérifiez votre dossier <strong>Spam</strong>.
                </p>

                {/* --- Bouton de renvoi --- */}
                <button
                    onClick={handleResend}
                    className={`resend-btn ${loading ? "loading" : ""}`}
                    disabled={loading}
                >
                    {loading ? "⏳ Envoi en cours..." : "↻ Renvoyer l’e-mail de confirmation"}
                </button>

                {/* --- Message dynamique --- */}
                {message && (
                    <p
                        className={`verify-message ${success ? "success" : "error"
                            } animate-message`}
                    >
                        {message}
                    </p>
                )}
            </div>
        </section>
    );
};

export default VerifyNotice;
