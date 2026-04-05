import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import licenseImg from "../assets/img/logo.png"; // 🖼️ Ajoute ton image
import "../App.css";

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [license, setLicense] = useState<any>(null);
    const [message, setMessage] = useState<string>("");
    const [years, setYears] = useState<number>(1);

    useEffect(() => {
        const storedEmail = localStorage.getItem("email");
        const storedUsername = localStorage.getItem("username");
        if (storedEmail) setEmail(storedEmail);
        if (storedUsername) setUsername(storedUsername);
    }, []);

    // 🎁 Demander une licence d’essai
    const requestTrial = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("❌ Vous devez être connecté");
            return;
        }

        try {
            const res = await fetch("http://localhost:4242/api/license/trial", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (data.success) {
                setLicense(data.license);
                setMessage("✅ Licence d’essai générée avec succès !");
            } else {
                setMessage("❌ " + data.message);
            }
        } catch (err) {
            setMessage("❌ Erreur serveur");
        }
    };

    // 💳 Acheter une licence payante
    const startCheckout = async () => {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");
        if (!token || !email) return navigate("/login");

        try {
            const pricePerYear = 49 * 100;
            const amount = years * pricePerYear;

            const res = await fetch("http://localhost:4242/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ amount, email, years }),
            });

            const data = await res.json();
            console.log("💳 Réponse Stripe:", data); // <--- AJOUTE ÇA

            if (res.ok && data.url) {
                window.location.href = data.url;
            } else {
                setMessage("⚠️ Erreur lors de la création de la session Stripe.");
            }
        } catch (err) {
            console.error("Erreur checkout :", err);
            setMessage("❌ Erreur lors de la création de la session de paiement.");
        }
    };


    return (
        <div className="dashboard-wrapper">

            {/* CONTENU PRINCIPAL */}
            <div className="dashboard-card">
                <h2>
                    Bienvenue <span>{username ? username : email}</span> 🎉
                </h2>
                <p className="user-email">
                    Vous êtes connecté avec : <strong>{email}</strong>
                </p>

                {/* --- AUTRES ACTIONS --- */}
                {/* --- Boutons en haut --- */}
                <div className="top-actions">
                    <button className="btn-dashboard" onClick={() => navigate("/licenses")}>
                        📜 Voir mes licences
                    </button>
                    <button className="btn-dashboard" onClick={() => navigate("/settings")}>
                        ⚙️ Paramètres
                    </button>
                </div>

                {/* --- SECTION ACHAT LICENCE --- */}
                <div className="license-product-card">
                    <div className="license-left">
                        <img src={licenseImg} alt="Licence EdenDisk" className="license-image" />
                    </div>

                    <div className="license-right">
                        <h3>💳 Acheter une licence EdenDisk</h3>
                        <p className="license-desc">
                            Activez toutes les fonctionnalités professionnelles d’EdenDisk,
                            sans limitation de temps ni de fonctionnalités.
                            Choisissez la durée de votre licence et effectuez le paiement sécurisé.
                        </p>

                        <div className="license-options">
                            <label htmlFor="years">Durée :</label>
                            <select
                                id="years"
                                value={years}
                                onChange={(e) => setYears(Number(e.target.value))}
                                className="license-select"
                            >
                                <option value="1">1 an — 49 €</option>
                                <option value="2">2 ans — 98 €</option>
                                <option value="3">3 ans — 147 €</option>
                            </select>
                        </div>

                        <div className="license-actions">
                            <button className="btn-secondary" onClick={requestTrial}>
                                🎁 Essayer 7 jours
                            </button>
                            <button className="btn-primary" onClick={startCheckout}>
                                💳 Payer maintenant
                            </button>
                        </div>
                    </div>
                </div>



                {/* --- MESSAGES & LICENCE ESSAI --- */}
                {message && <p className="license-success">{message}</p>}

                {license && (
                    <div className="license-box">
                        <h3>📜 Licence générée :</h3>
                        <p><strong>Clé :</strong> {license.key}</p>
                        <p><strong>Type :</strong> {license.type}</p>
                        <p><strong>Expire le :</strong> {new Date(license.expiresAt).toLocaleDateString()}</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Dashboard;
