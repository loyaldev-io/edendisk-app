import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Licenses.css";

interface License {
    key: string;
    type: string;
    expiresAt: string;
}

const Licenses: React.FC = () => {
    const [licenses, setLicenses] = useState<License[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    // 📦 Récupération des licences
    const fetchLicenses = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const res = await fetch("http://localhost:4242/api/license", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setLicenses(data.licenses || []);
            } else {
                setMessage("⚠️ Impossible de récupérer vos licences.");
            }
        } catch (err) {
            console.error("Erreur récupération licences :", err);
            setMessage("❌ Erreur lors du chargement des licences.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLicenses();
    }, []);

    // 📋 Copier la clé
    const copyKey = async (key: string) => {
        try {
            await navigator.clipboard.writeText(key);
            setMessage(" Clé copiée dans le presse-papiers !");
        } catch {
            setMessage("⚠️ Impossible de copier la clé.");
        }
    };

    // ✅ Statut
    const getStatus = (expiresAt: string) => {
        const now = new Date();
        const expDate = new Date(expiresAt);
        return expDate > now ? "active" : "expired";
    };

    return (
        <div className="licenses-page">

            {/* === Contenu principal === */}
            <div className="licenses-card">
                <h1 className="licenses-title">Mes Licences</h1>
                <p className="licenses-subtitle">
                    Consultez ici toutes vos licences d’essai et payantes associées à votre compte.
                </p>

                {message && <p className="license-message">{message}</p>}

                {loading ? (
                    <p>Chargement...</p>
                ) : licenses.length === 0 ? (
                    <p>Aucune licence disponible.</p>
                ) : (
                    <table className="licenses-table">
                        <thead>
                            <tr>
                                <th>Clé</th>
                                <th>Type</th>
                                <th>Expiration</th>
                                <th>Statut</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {licenses.map((license, idx) => {
                                const status = getStatus(license.expiresAt);
                                return (
                                    <tr key={idx}>
                                        <td>
                                            <span className="license-key">{license.key}</span>
                                            <button
                                                className="copy-btn"
                                                onClick={() => copyKey(license.key)}
                                            >
                                                📋
                                            </button>
                                        </td>
                                        <td>
                                            <span
                                                className={`badge ${license.type === "trial"
                                                    ? "badge-trial"
                                                    : "badge-paid"
                                                    }`}
                                            >
                                                {license.type === "trial" ? "Essai" : "Payante"}
                                            </span>
                                        </td>
                                        <td>
                                            {new Date(license.expiresAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            {status === "active" ? (
                                                <span className="badge-active">🟢 Active</span>
                                            ) : (
                                                <span className="badge-expired">🔴 Expirée</span>
                                            )}
                                        </td>
                                        <td>
                                            {license.type === "paid" && (
                                                <button className="btn-renew" disabled>
                                                    🔒 Verrouillée
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}

                {/* === Bouton Retour === */}
                <div className="licenses-footer">
                    <button className="btn-gray" onClick={() => navigate("/dashboard")}>
                        🔙 Retour au tableau de bord
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Licenses;
