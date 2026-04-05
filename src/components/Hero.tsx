import React, { useEffect, useRef, useState } from "react";
import "./Hero.css";

const Hero: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const heroRef = useRef<HTMLDivElement | null>(null);

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

        if (heroRef.current) observer.observe(heroRef.current);

        return () => {
            if (heroRef.current) observer.unobserve(heroRef.current);
        };
    }, []);

    return (
        <section id="hero" className="hero" ref={heroRef}>
            <div className="hero-container">
                <div className={`hero-text ${isVisible ? "fade-in-right" : ""}`}>
                    <h1>Votre gestionnaire de <br />disques 🚀</h1>
                    <p>
                        Gérez, clonez et formatez vos disques en toute simplicité avec <strong>EdenDisk</strong>.
                        Un logiciel intelligent, rapide et fiable, conçu en <strong>Python</strong> et <strong>React </strong>
                        pour offrir une expérience fluide et professionnelle.
                    </p>

                    <ul className="hero-list">
                        <ul className="hero-list">
                            <li>Clonage et sauvegarde rapides de vos disques</li>
                            <li>Interface fluide, moderne et intuitive</li>
                            <li>Analyse et formatage sécurisés des partitions</li>
                        </ul>

                    </ul>

                    <div className="hero-buttons">
                        <a href="/download" className="btn btn-primary">Téléchargez la version d’essai</a>
                        <a href="#pricing" className="btn btn-secondary">Passez au niveau supérieur</a>
                    </div>
                </div>
            </div>
        </section>

    );
};

export default Hero;