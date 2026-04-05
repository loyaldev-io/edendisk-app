import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import ReCAPTCHA from "react-google-recaptcha";
import "./Contact.css";

const Contact: React.FC = () => {
    const formRef = useRef<HTMLFormElement | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess(null);
        setError(null);

        if (!captchaToken) {
            setError("⚠️ Veuillez valider le reCAPTCHA avant d’envoyer votre message.");
            return;
        }

        if (formRef.current) {
            setLoading(true);
            emailjs
                .sendForm("service_c2wt2fm", "template_3sn0o5c", formRef.current, "N6cDMsKlw4ZvI52LU")
                .then(
                    () => {
                        setSuccess("✅ Message envoyé avec succès !");
                        setLoading(false);
                        formRef.current?.reset();
                        setCaptchaToken(null);
                        setTimeout(() => setSuccess(null), 4000);
                    },
                    (err) => {
                        console.error("Erreur EmailJS :", err);
                        setError("❌ Une erreur est survenue, veuillez réessayer plus tard.");
                        setLoading(false);
                        setTimeout(() => setError(null), 4000);
                    }
                );
        }
    };

    return (
        <section id="contact" className="contact-section">
            <div className="contact-container">
                <div className="contact-text">
                    <h2>Besoin d’informations ?</h2>
                    <p>
                        Contactez-nous ! <br />
                        Notre équipe vous répond rapidement.
                    </p>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="contact-form">
                    <div className="form-group">
                        <label>Nom</label>
                        <input type="text" name="name" placeholder="Votre nom complet" required />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="email" placeholder="votre@email.com" required />
                        </div>
                        <div className="form-group">
                            <label>Téléphone</label>
                            <input type="tel" name="phone" placeholder="Votre téléphone" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Message</label>
                        <textarea name="message" placeholder="Rédigez votre message..." required />
                    </div>

                    <div className="captcha">
                        <ReCAPTCHA
                            sitekey="6LcX7N4rAAAAAGZGBEaQyzAEx5DDKuyxO2yjZxU4"
                            onChange={(token) => setCaptchaToken(token)}
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "⏳ Envoi en cours..." : "Envoyer le message"}
                    </button>

                    {success && <div className="alert success">{success}</div>}
                    {error && <div className="alert error">{error}</div>}
                </form>
            </div>
        </section>
    );
};

export default Contact;
