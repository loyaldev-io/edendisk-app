import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <p>
                © {new Date().getFullYear()} EdenDisk. Tous droits réservés. Développé par{" "}
                <a
                    href="https://chrixcode.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    CHRIXCODE
                </a>.
            </p>
            <p><a href="#contact">Contact</a> | <a href="/privacy">Politique de confidentialité</a></p>
        </footer>
    );
};

export default Footer;
