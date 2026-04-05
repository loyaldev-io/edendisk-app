import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import "./Cancel.css"; // (optionnel si tu veux séparer le style)

const Cancel: React.FC = () => {
    return (
        <div className="success-page">
            <div className="success-card">
                <div className="success-icon" style={{ backgroundColor: "#f8d7da" }}>
                    ❌
                </div>
                <h2 className="success-title" style={{ color: "#c0392b" }}>
                    Paiement annulé
                </h2>
                <p className="success-text">
                    Aucun débit n’a été effectué.<br />
                    Vous pouvez réessayer quand vous le souhaitez.
                </p>
                <Link to="/licenses" className="success-button">
                    Retour à mes licences
                </Link>
            </div>
        </div>
    );
};

export default Cancel;
