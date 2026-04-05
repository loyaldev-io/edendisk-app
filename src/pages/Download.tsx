import React from "react";
import { Title, Meta } from "react-head";
import "./Download.css";

interface Update {
    version: string;
    date: string;
    changes: string[];
}

const updates: Update[] = [
    {
        version: "v1.3.2",
        date: "05 octobre 2025",
        changes: [
            "Amélioration de la gestion des licences.",
            "Ajout du support complet pour Windows 11.",
            "Optimisation du clonage de disque et corrections mineures."
        ]
    },
    {
        version: "v1.3.1",
        date: "20 septembre 2025",
        changes: [
            "Correction de bugs dans le module de formatage.",
            "Amélioration des performances lors des sauvegardes."
        ]
    },
    {
        version: "v1.3.0",
        date: "01 septembre 2025",
        changes: [
            "Nouvelle interface utilisateur (CustomTkinter).",
            "Ajout du système de licence d’essai 7 jours.",
            "Optimisation générale du logiciel."
        ]
    }
];

const Download: React.FC = () => {
    const latest = updates[0];

    return (
        <>
            {/* Balises SEO - Page de téléchargement */}
            <Title>Téléchargement – Logiciel EdenDisk pour Windows</Title>
            <Meta name="author" content="EdenDisk - CHRIXCODE" />
            <Meta
                name="description"
                content="Téléchargez EdenDisk, le logiciel professionnel de gestion, formatage et sauvegarde de disques pour Windows. Version d’essai gratuite disponible dès maintenant."
            />
            <Meta
                name="keywords"
                content="EdenDisk, téléchargement, logiciel, formatage disque, sauvegarde, CHRIXCODE, Windows, outil disque, utilitaire, essai gratuit"
            />
            <Meta name="robots" content="index, follow" />
            <Meta
                name="copyright"
                content="© Tous droits réservés - 2025 EdenDisk / CHRIXCODE"
            />

            {/* Open Graph */}
            <Meta
                property="og:title"
                content="Téléchargement – Logiciel EdenDisk pour Windows"
            />
            <Meta
                property="og:description"
                content="Téléchargez EdenDisk gratuitement et découvrez un outil puissant de gestion, formatage et sauvegarde de disques, conçu par CHRIXCODE."
            />
            <Meta property="og:type" content="website" />
            <Meta property="og:url" content="https://www.edendisk.fr/download" />
            <Meta
                property="og:image"
                content="https://www.edendisk.fr/src/assets/img/edendisk_logo.png"
            />

            {/* Twitter Cards */}
            <Meta name="twitter:card" content="summary_large_image" />
            <Meta
                name="twitter:title"
                content="Téléchargement – Logiciel EdenDisk pour Windows"
            />
            <Meta
                name="twitter:description"
                content="Téléchargez EdenDisk gratuitement et profitez d'une version d'essai complète pour Windows."
            />
            <Meta
                name="twitter:image"
                content="https://www.edendisk.fr/src/assets/img/edendisk_logo.png"
            />

            <section className="download-section">
                <div className="download-container">
                    <h1 className="download-title">Téléchargement EdenDisk</h1>
                    <p className="download-subtitle">
                        Téléchargez la dernière version de <strong>EdenDisk</strong> et découvrez les nouveautés.
                    </p>

                    <div className="latest-card glass-card">
                        <h2>Dernière version : {latest.version}</h2>
                        <p className="update-date">Publié le {latest.date}</p>
                        <ul className="change-list">
                            {latest.changes.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                        <a
                            href="https://edendisk.com/download/EdenDisk_Setup.exe"
                            className="download-btn"
                            download
                        >
                            ⬇ Télécharger EdenDisk ({latest.version})
                        </a>
                    </div>

                    <h2 className="history-title">Historique des versions</h2>
                    <div className="updates-list">
                        {updates.slice(1).map((update, idx) => (
                            <div key={idx} className="update-card glass-card">
                                <h3>{update.version}</h3>
                                <p className="update-date">Publié le {update.date}</p>
                                <ul className="change-list">
                                    {update.changes.map((change, i) => (
                                        <li key={i}>{change}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Download;
