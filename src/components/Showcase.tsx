import React, { useState } from "react";
import { FaFolderOpen, FaRobot, FaLock, FaBolt } from "react-icons/fa";
import { SiGoogletranslate } from "react-icons/si";
import frFlag from "../assets/img/flags/fr.png";
import gbFlag from "../assets/img/flags/gb.png";

const Showcase: React.FC = () => {
    const [activeTab, setActiveTab] = useState("Aperçu");
    const [animationDirection, setAnimationDirection] = useState("fade-in");
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const tabs = [
        "Aperçu",
        "Fonctionnalités",
        "Configuration requise",
        "Captures d’écran",
        "Tutoriels",
        "FAQ",
    ];

    const handleTabClick = (tab: string) => {
        const currentIndex = tabs.indexOf(activeTab);
        const newIndex = tabs.indexOf(tab);
        setAnimationDirection(newIndex > currentIndex ? "slide-left" : "slide-right");
        setActiveTab(tab);
    };

    // Liste des images
    const screenshots = [
        { src: "/src/assets/img/screenshot/copy.png", alt: "Copie - EdenDisk" },
        { src: "/src/assets/img/screenshot/clone.png", alt: "Clonage - EdenDisk" },
        { src: "/src/assets/img/screenshot/format.png", alt: "Formatage - EdenDisk" },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "Aperçu":
                return (
                    <div>
                        <h3>Bienvenue sur EdenDisk</h3>
                        <p>
                            EdenDisk est un logiciel professionnel conçu pour simplifier la gestion
                            de vos disques et de vos données. Avec son interface intuitive et ses
                            outils puissants, il vous permet de{" "}
                            <strong>copier, sauvegarder, cloner et formater</strong> vos disques en
                            quelques clics seulement.
                        </p>
                        <p>
                            Contrairement aux méthodes traditionnelles qui nécessitent de parcourir
                            manuellement vos dossiers, EdenDisk est doté d’une
                            <strong> intelligence intégrée</strong> capable de localiser
                            automatiquement vos fichiers utilisateurs (documents, images, vidéos…)
                            pour vous faire gagner un temps précieux.
                        </p>
                        <p>
                            Que vous soyez un <strong>particulier</strong> souhaitant sécuriser vos
                            données personnelles, ou un <strong>professionnel</strong> en quête
                            d’efficacité, EdenDisk est la solution idéale.
                        </p>

                        <p className="languages">
                            <SiGoogletranslate className="lang-icon" /> Disponible en :
                            <span className="lang">
                                <img src={frFlag} alt="Français" className="flag-icon" /> Français
                            </span>
                            <span className="lang">
                                <img src={gbFlag} alt="Anglais" className="flag-icon" /> Anglais
                            </span>
                        </p>

                        <div className="showcase-buttons">
                            <a href="/download"><button className="btn btn-primary">Télécharger gratuitement</button></a>
                            <a href="#pricing"><button className="btn btn-secondary">Acheter maintenant</button></a>
                        </div>
                    </div>
                );

            case "Fonctionnalités":
                return (
                    <div>
                        <h3>Fonctionnalités principales</h3>
                        <ul>
                            <li><FaFolderOpen className="icon" /> Copie intelligente des fichiers utilisateurs</li>
                            <li><FaRobot className="icon" /> Localisation automatique des données importantes</li>
                            <li><FaLock className="icon" /> Sauvegarde sécurisée et cryptée</li>
                            <li><FaBolt className="icon" /> Performance et rapidité maximales</li>
                            <li><FaFolderOpen className="icon" /> Clonage complet de disques (système & partitions)</li>
                            <li><FaFolderOpen className="icon" /> Formatage rapide et sécurisé</li>
                            <li><FaRobot className="icon" /> Interface intuitive et facile à prendre en main</li>
                            <li><SiGoogletranslate className="icon" /> Multilingue : Français & Anglais</li>
                            <li><FaBolt className="icon" /> Optimisation automatique des performances</li>
                            <li><FaFolderOpen className="icon" /> Rapports détaillés et journaux de chaque opération</li>
                        </ul>
                    </div>
                );


            case "Configuration requise":
                return (
                    <div>
                        <h3>Configuration requise</h3>
                        <div className="config-grid">
                            <div className="config-card">
                                <h4>🚀 Configuration recommandée</h4>
                                <p>
                                    <strong>OS :</strong> Windows 11 (64-bit) <br />
                                    <strong>RAM :</strong> 8 Go ou plus <br />
                                    <strong>Stockage :</strong> SSD avec au moins 500 Mo libres <br />
                                    <strong>Processeur :</strong> Intel i5/i7 ou AMD équivalent <br />
                                    <strong>Écran :</strong> Résolution Full HD 1920x1080 <br />
                                    <strong>Connexion :</strong> Internet haut débit pour mises à jour
                                </p>
                            </div>
                            <div className="config-card">
                                <h4>✅ Configuration minimale</h4>
                                <p>
                                    <strong>OS :</strong> Windows 10/11 <br />
                                    <strong>RAM :</strong> 4 Go <br />
                                    <strong>Stockage :</strong> 200 Mo libres <br />
                                    <strong>Processeur :</strong> Intel i3 ou équivalent <br />
                                    <strong>Écran :</strong> Résolution 1280x720 minimum
                                </p>
                            </div>
                        </div>
                    </div>
                );



            case "Captures d’écran":
                return (
                    <div>
                        <h3>Captures d’écran</h3>
                        <p>Voici quelques aperçus de l’interface d’EdenDisk :</p>
                        <div className="screenshots-gallery">
                            {screenshots.map((img, index) => (
                                <img
                                    key={index}
                                    src={img.src}
                                    alt={img.alt}
                                    onClick={() => setLightboxIndex(index)}
                                />
                            ))}
                        </div>

                        {/* Lightbox */}
                        {lightboxIndex !== null && (
                            <div className="lightbox">
                                <button
                                    className="lightbox-close"
                                    onClick={() => setLightboxIndex(null)}
                                >
                                    ✖
                                </button>
                                <button
                                    className="lightbox-arrow left"
                                    onClick={() =>
                                        setLightboxIndex(
                                            (lightboxIndex - 1 + screenshots.length) %
                                            screenshots.length
                                        )
                                    }
                                >
                                    ⬅
                                </button>
                                <img
                                    src={screenshots[lightboxIndex].src}
                                    alt={screenshots[lightboxIndex].alt}
                                    className="lightbox-img"
                                />
                                <button
                                    className="lightbox-arrow right"
                                    onClick={() =>
                                        setLightboxIndex((lightboxIndex + 1) % screenshots.length)
                                    }
                                >
                                    ➡
                                </button>
                            </div>
                        )}
                    </div>
                );


            case "Tutoriels":
                return (
                    <div>
                        <h3>Tutoriels vidéo et guide</h3>
                        <p>Regardez cette vidéo explicative pour bien démarrer avec EdenDisk :</p>
                        <div className="tutorial-video">
                            <iframe
                                width="100%"
                                height="400"
                                src="https://www.youtube.com/embed/VIDEO_ID"
                                title="Tutoriel EdenDisk"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                );


            case "FAQ":
                return (
                    <div>
                        <h3>Foire aux questions</h3>
                        <div className="faq">
                            <details>
                                <summary>💾 Est-ce que EdenDisk est compatible avec Windows 10 et 11 ?</summary>
                                <div className="faq-content">
                                    <p>✅ Oui, EdenDisk est entièrement compatible avec Windows 10 et Windows 11 (32/64 bits).</p>
                                </div>
                            </details>

                            <details>
                                <summary>🔑 Comment activer ma licence ?</summary>
                                <div className="faq-content">
                                    <p>Après votre achat, vous recevrez une clé de licence par email. Il suffit de la saisir dans l’onglet <strong>Licence</strong> du logiciel.</p>
                                </div>
                            </details>

                            <details>
                                <summary>🌍 Le logiciel est-il disponible en plusieurs langues ?</summary>
                                <div className="faq-content">
                                    <p>Oui, EdenDisk est disponible en <strong>Français</strong> et <strong>Anglais</strong>, et d’autres langues seront ajoutées prochainement.</p>
                                </div>
                            </details>

                            <details>
                                <summary>📂 Puis-je copier uniquement certains fichiers ?</summary>
                                <div className="faq-content">
                                    <p>Oui, EdenDisk intègre une intelligence de détection automatique qui localise vos fichiers utilisateurs (documents, images, vidéos, etc.) sans recherche manuelle.</p>
                                </div>
                            </details>

                            <details>
                                <summary>🔒 Mes données sont-elles protégées ?</summary>
                                <div className="faq-content">
                                    <p>Absolument, EdenDisk applique une sauvegarde sécurisée et cryptée afin de protéger vos fichiers sensibles.</p>
                                </div>
                            </details>
                        </div>
                    </div>
                );


            default:
                return null;
        }
    };

    return (
        <section id="showcase" className="showcase">
            <h2>Présentation d’EdenDisk</h2>
            <div className="tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                        onClick={() => handleTabClick(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <div className={`tab-panel ${animationDirection}`}>
                <div className="tab-content">{renderContent()}</div>
            </div>
        </section>
    );
};

export default Showcase;
