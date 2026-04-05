import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./VerifyEmail.css";

const API_URL =
    import.meta.env.MODE === "production"
        ? "https://api.edendisk.com"
        : "http://localhost:4242";

const VerifyEmail: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState("⏳ Vérification en cours...");
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get("token");

            if (!token) {
                setMessage("❌ Lien invalide ou manquant.");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${API_URL}/api/auth/verify-email?token=${token}`);
                const data = await res.json();

                console.log("📬 Réponse verify-email :", data);

                if (res.ok && data.success) {
                    setVerified(true);
                    setMessage("✅ Votre adresse e-mail a été confirmée avec succès !");
                } else if (data.message?.includes("expiré") || data.message?.includes("invalide")) {
                    // 🧠 L'utilisateur est peut-être déjà vérifié
                    setMessage("✅ Votre compte est déjà vérifié !");
                    setVerified(true);
                } else {
                    setMessage("❌ " + (data.message || "Lien invalide ou expiré."));
                }
            } catch (err) {
                console.error("💥 Erreur de vérification :", err);
                setMessage("⚠️ Impossible de contacter le serveur. Réessayez plus tard.");
            } finally {
                setLoading(false);
            }
        };

        verifyEmail();
    }, [searchParams]);

    const handleDashboard = () => navigate("/dashboard");

    return (
        <section className="verify-email">
            <div className="verify-card">
                {loading ? (
                    <h2>⏳ Vérification de votre e-mail...</h2>
                ) : (
                    <>
                        <h2>{message}</h2>

                        {verified && (
                            <button className="verify-btn" onClick={handleDashboard}>
                                🚀 Accéder à mon espace
                            </button>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default VerifyEmail;
