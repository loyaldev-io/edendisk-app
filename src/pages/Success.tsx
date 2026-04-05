import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import "./Success.css";

const Success: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="success-page">
            <div className="success-card">
                <div className="success-icon">✅</div>
                <h1 className="success-title">Paiement réussi !</h1>
                <p className="success-text">
                    Merci pour votre achat. <br />
                    Votre licence a été générée et envoyée par email.
                </p>
                <button className="success-btn" onClick={() => navigate("/licenses")}>
                    Voir mes licences
                </button>
            </div>
        </div>
    );
};

export default Success;
