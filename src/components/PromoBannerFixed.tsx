import React, { useEffect, useState } from "react";

const PromoBanner: React.FC = () => {
    const [visible, setVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                // Scroll vers le bas → cache le bandeau
                setVisible(false);
            } else {
                // Scroll vers le haut → affiche le bandeau
                setVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    return (
        <div className={`promo-banner ${visible ? "show" : "hide"}`}>
            <div className="marquee">
                🚀 Profitez dès maintenant de la version d’essai gratuite d’EdenDisk !
            </div>
        </div>
    );
};

export default PromoBanner;
