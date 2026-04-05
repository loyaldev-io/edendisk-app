import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Title, Meta } from "react-head";
import "../App.css";

const Login: React.FC = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // ✅ Soumission du formulaire de connexion
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("http://localhost:4242/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (data.success) {
                // ⚡ Stocker les infos utilisateur
                localStorage.setItem("token", data.token);
                localStorage.setItem("email", data.email);
                localStorage.setItem("username", data.username || data.name || "");

                setMessage("✅ Connexion réussie !");
                setTimeout(() => navigate("/dashboard"), 1000); // Redirection douce
            } else {
                setMessage("❌ " + data.message);
            }
        } catch (err) {
            console.error("💥 Erreur connexion :", err);
            setMessage("❌ Erreur serveur");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Balises SEO - Page de connexion */}
            <Title>Connexion – Espace utilisateur EdenDisk</Title>
            <Meta name="author" content="EdenDisk - CHRIXCODE" />
            <Meta
                name="description"
                content="Connectez-vous à votre espace EdenDisk pour gérer vos licences, télécharger vos clés et accéder à votre tableau de bord utilisateur."
            />
            <Meta
                name="keywords"
                content="EdenDisk, connexion, espace client, login, compte, CHRIXCODE, logiciel, licence"
            />
            <Meta name="robots" content="index, follow" />
            <Meta
                name="copyright"
                content="© Tous droits réservés - 2025 EdenDisk / CHRIXCODE"
            />

            {/* Open Graph */}
            <Meta
                property="og:title"
                content="Connexion – Espace utilisateur EdenDisk"
            />
            <Meta
                property="og:description"
                content="Connectez-vous à votre espace EdenDisk pour consulter vos licences et gérer vos téléchargements."
            />
            <Meta property="og:type" content="website" />
            <Meta property="og:url" content="https://www.edendisk.fr/login" />
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
                content="Connexion – Espace utilisateur EdenDisk"
            />
            <Meta
                name="twitter:description"
                content="Connectez-vous à votre compte EdenDisk pour accéder à vos licences, téléchargements et paramètres utilisateur."
            />
            <Meta
                name="twitter:image"
                content="https://www.edendisk.fr/src/assets/img/edendisk_logo.png"
            />


            <div className="login-page">
                <div className="login-card">
                    <h2>
                        Connexion à <span>EdenDisk</span>
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Votre email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Votre mot de passe"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />

                        <button type="submit" disabled={loading}>
                            {loading ? "⏳ Connexion..." : "Se connecter"}
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

                    {/* 🔗 Lien mot de passe oublié */}
                    <p className="forgot-link">
                        <Link to="/forgot-password" className="link">
                            Mot de passe oublié ?
                        </Link>
                    </p>

                    {/* 🔗 Lien inscription */}
                    <p className="register-link">
                        Pas encore de compte ?{" "}
                        <Link to="/register" className="link">
                            Inscription
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Login;
