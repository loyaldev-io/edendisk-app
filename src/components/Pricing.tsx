import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Pricing.css";

const Pricing: React.FC = () => {
    useEffect(() => {
        // 🎬 Apparition douce au scroll
        const cards = document.querySelectorAll(".pricing-card");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            { threshold: 0.2 }
        );

        cards.forEach((card) => observer.observe(card));

        return () => observer.disconnect();
    }, []);

    return (
        <section id="pricing" className="pricing-section">
            <h2 className="pricing-title">💰 Nos Offres</h2>
            <p className="pricing-subtitle">
                Choisissez la formule qui vous convient — sans engagement.
            </p>

            <div className="pricing-cards">
                {/* --- ESSAI GRATUIT --- */}
                <div className="pricing-card">
                    <h3>🎁 Essai Gratuit</h3>
                    <p className="pricing-desc">
                        Profitez de toutes les fonctionnalités pendant <strong>7 jours</strong>.
                    </p>
                    <div className="pricing-price">0 €</div>
                    <Link to="/register" className="btn btn-primary full-width">
                        Créer un compte et essayer
                    </Link>
                </div>

                {/* --- LICENCE PAYANTE --- */}
                <div className="pricing-card">
                    <h3>💎 Licence Standard</h3>
                    <p className="pricing-desc">
                        Bénéficiez d’une licence complète et d’un support prioritaire.
                    </p>
                    <div className="pricing-price">49 € / an</div>
                    <Link to="/register" className="btn btn-secondary full-width">
                        Créer un compte et acheter
                    </Link>
                </div>
            </div>

            {/* --- CTA vers inscription --- */}
            <div className="pricing-register">
                <p>Pas encore de compte ?</p>
                <Link to="/register" className="btn btn-outline">
                    Créer un compte gratuit
                </Link>
            </div>
        </section>
    );
};

export default Pricing;
