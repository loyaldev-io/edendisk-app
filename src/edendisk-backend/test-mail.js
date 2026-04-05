import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

transporter.sendMail({
    from: `"EdenDisk" <${process.env.EMAIL_USER}>`,
    to: "chris.balkumar@gmail.com",
    subject: "Test - Vérification Email EdenDisk",
    text: "Ceci est un test d’envoi de mail depuis Nodemailer 🚀",
})
    .then(() => console.log("✅ Mail envoyé avec succès !"))
    .catch(err => console.error("❌ Erreur d’envoi :", err));
