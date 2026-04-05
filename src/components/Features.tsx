import React, { useEffect, useRef, useState } from "react";

const Features: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const featuresRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.2 }
        );

        if (featuresRef.current) observer.observe(featuresRef.current);

        return () => {
            if (featuresRef.current) observer.unobserve(featuresRef.current);
        };
    }, []);

    const features = [
        {
            icon: "⚡",
            title: "Performance",
            desc: "Optimisation disque en un clic pour une rapidité maximale.",
        },
        {
            icon: "🔒",
            title: "Sécurité",
            desc: "Sauvegardes fiables et cryptées pour protéger vos données.",
        },
        {
            icon: "🎨",
            title: "Interface",
            desc: "Design moderne et intuitif, pensé pour la simplicité.",
        },
        {
            icon: "📂",
            title: "Copie intelligente",
            desc: "Copiez vos fichiers utilisateurs en un clic, sans chercher dans vos dossiers.",
        },
        {
            icon: "🤖",
            title: "Recherche automatisée",
            desc: "L’IA intégrée localise automatiquement vos fichiers importants.",
        },
        {
            icon: "🚀",
            title: "Gain de temps",
            desc: "Gagnez un temps précieux grâce à la détection et la copie rapide.",
        },
    ];

    return (
        <section id="features" className="features" ref={featuresRef}>
            <h2>Pourquoi choisir EdenDisk ?</h2>
            <div className="features-grid">
                {features.map((f, index) => (
                    <div
                        className={`feature-card ${isVisible ? "fade-in-up" : ""}`}
                        style={{ animationDelay: `${index * 0.2}s` }}
                        key={index}
                    >
                        <div className="feature-icon">{f.icon}</div>
                        <h3>{f.title}</h3>
                        <p>{f.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Features;
