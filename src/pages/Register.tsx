import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Title, Meta } from "react-head";
import "./Register.css";

// 🌍 Détection auto de l’API selon environnement
const API_URL =
    import.meta.env.MODE === "production"
        ? "https://api.edendisk.com" // 🔗 Backend production
        : "http://localhost:4242";   // 🔗 Backend local

const Register: React.FC = () => {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // ✅ Soumission du formulaire d’inscription
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            console.log("📬 Réponse REGISTER :", data);

            if (res.ok && data.success) {
                setMessage("✅ Compte créé avec succès ! Vérifiez votre e-mail pour activer votre compte.");

                // 💾 Stocke l’e-mail pour le renvoi de confirmation
                localStorage.setItem("email", form.email);

                // ⏳ Redirection vers la page de notice
                setTimeout(() => {
                    navigate("/verify-notice");
                }, 1500);
            } else {
                setMessage("❌ " + (data.message || "Erreur lors de l’inscription."));
            }
        } catch (err) {
            console.error("💥 Erreur lors de l’inscription :", err);
            setMessage("💥 Erreur serveur. Veuillez réessayer plus tard.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Balises SEO - Page d'inscription */}
            <Title>Inscription – Créez votre compte EdenDisk</Title>
            <Meta name="author" content="EdenDisk - CHRIXCODE" />
            <Meta
                name="description"
                content="Créez votre compte EdenDisk pour bénéficier d'une licence d'essai gratuite, gérer vos licences, télécharger vos clés et accéder à votre tableau de bord."
            />
            <Meta
                name="keywords"
                content="EdenDisk, inscription, créer compte, essai gratuit, CHRIXCODE, licence, logiciel, gestion disque, sauvegarde, formatage"
            />
            <Meta name="robots" content="index, follow" />
            <Meta
                name="copyright"
                content="© Tous droits réservés - 2025 EdenDisk / CHRIXCODE"
            />

            {/* Open Graph */}
            <Meta property="og:title" content="Inscription – Créez votre compte EdenDisk" />
            <Meta
                property="og:description"
                content="Rejoignez EdenDisk et profitez d'une licence d'essai gratuite pour découvrir notre logiciel de gestion et de formatage de disques."
            />
            <Meta property="og:type" content="website" />
            <Meta property="og:url" content="https://www.edendisk.fr/register" />
            <Meta
                property="og:image"
                content="https://www.edendisk.fr/src/assets/img/edendisk_logo.png"
            />
            <Meta property="og:locale" content="fr_FR" />
            <Meta property="og:site_name" content="EdenDisk" />

            {/* Twitter Cards */}
            <Meta name="twitter:card" content="summary_large_image" />
            <Meta
                name="twitter:title"
                content="Inscription – Créez votre compte EdenDisk"
            />
            <Meta
                name="twitter:description"
                content="Inscrivez-vous sur EdenDisk et obtenez une licence d’essai gratuite de 7 jours pour explorer toutes les fonctionnalités du logiciel."
            />
            <Meta
                name="twitter:image"
                content="https://www.edendisk.fr/src/assets/img/edendisk_logo.png"
            />
            <div className="register-page">
                <div className="register-card">
                    <h2>
                        Créer un compte <span>EdenDisk</span>
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <label htmlFor="name" className="visually-hidden">Nom d’utilisateur</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Votre nom ou pseudo"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />

                        <label htmlFor="email" className="visually-hidden">Adresse e-mail</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Votre e-mail"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />

                        <label htmlFor="password" className="visually-hidden">Mot de passe</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Votre mot de passe"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />

                        <button type="submit" disabled={loading}>
                            {loading ? "⏳ Création du compte..." : "S’inscrire"}
                        </button>
                    </form>

                    {message && (
                        <p
                            className={`message ${message.startsWith("✅") ? "success" : "error"
                                }`}
                        >
                            {message}
                        </p>
                    )}

                    <p className="login-link">
                        Déjà un compte ?{" "}
                        <Link to="/login" className="link">
                            Connexion
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Register;
