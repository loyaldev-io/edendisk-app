import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

dotenv.config();
const router = express.Router();

// ===================================================
// 📩 Création du transporteur dynamique (Gmail / Outlook)
// ===================================================
function createTransporter() {
    const email = process.env.EMAIL_USER || "";
    const isOutlook =
        email.includes("outlook") || email.includes("hotmail") || email.includes("live");

    const transporter = nodemailer.createTransport({
        host: isOutlook ? "smtp.office365.com" : "smtp.gmail.com",
        port: isOutlook ? 587 : 465,
        secure: !isOutlook,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    return transporter;
}

// ===================================================
// 🧠 Test automatique du transporteur SMTP au lancement
// ===================================================
(async () => {
    try {
        const transporter = createTransporter();
        await transporter.verify();
        console.log("📧 SMTP prêt :", process.env.EMAIL_USER);
    } catch (error) {
        console.error("❌ Erreur SMTP :", error.message);
        console.error("💡 Vérifie EMAIL_USER / EMAIL_PASS / port SMTP dans ton .env");
    }
})();

// ===================================================
// 🌍 Détection de domaine auto (prod / local)
// ===================================================
const BASE_URL =
    process.env.NODE_ENV === "production"
        ? "https://edendisk.com"
        : "http://localhost:5173";

// ===================================================
// 🧾 REGISTER : inscription + e-mail de vérification
// ===================================================
router.post("/register", async (req, res) => {
    try {
        const { email, password, name } = req.body;
        console.log("📥 Données reçues REGISTER:", req.body);

        if (!email || !password || !name)
            return res.json({ success: false, message: "Tous les champs sont requis." });

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.json({ success: false, message: "Cet e-mail est déjà utilisé." });

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const verificationExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min

        const newUser = new User({
            email,
            name,
            password: hashedPassword,
            verified: false,
            verificationToken,
            verificationExpires,
        });
        await newUser.save();

        const verifyLink = `${BASE_URL}/verify-email?token=${verificationToken}`;
        const transporter = createTransporter();

        // 🧠 Test d’envoi d’e-mail
        try {
            await transporter.sendMail({
                from: `"EdenDisk" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: "🔐 Confirmez votre adresse e-mail - EdenDisk",
                html: `
                    <div style="font-family:'Segoe UI',sans-serif;background:#0d1b25;color:#e5e5e5;padding:40px;border-radius:16px;max-width:600px;margin:auto;box-shadow:0 0 25px rgba(0,230,170,0.3);">
                        <div style="text-align:center;margin-bottom:30px;">
                            <img src="https://edendisk.com/assets/img/edendisk.png" alt="EdenDisk" style="width:70px;height:70px;border-radius:12px;box-shadow:0 0 10px rgba(0,230,170,0.4);" />
                            <h1 style="color:#00e6aa;font-size:26px;margin-top:12px;">Bienvenue sur EdenDisk 🚀</h1>
                        </div>
                        <p>Bonjour <b>${name || "utilisateur"}</b>,</p>
                        <p>Cliquez sur le bouton ci-dessous pour confirmer votre adresse e-mail :</p>
                        <div style="text-align:center;margin:40px 0;">
                            <a href="${verifyLink}" style="background:linear-gradient(135deg,#00c896,#00e6aa);color:#fff;font-weight:bold;text-decoration:none;padding:14px 32px;border-radius:12px;box-shadow:0 0 20px rgba(0,230,170,0.5);display:inline-block;">✅ Confirmer mon adresse e-mail</a>
                        </div>
                        <p style="font-size:14px;color:#ccc;text-align:center;">Ce lien est valable <b>15 minutes</b>.</p>
                        <hr style="border:none;border-top:1px solid rgba(255,255,255,0.1);margin:30px 0;">
                        <p style="font-size:13px;color:#aaa;text-align:center;">© ${new Date().getFullYear()} <b>EdenDisk</b> – Développé par 
                        <a href="https://chrixcode.com/" target="_blank" rel="noopener noreferrer" style="color:#00e6aa;text-decoration:none;">CHRIXCODE</a>.</p>
                    </div>`,
            });

            console.log("✅ Utilisateur créé et e-mail envoyé à:", email);
            res.json({
                success: true,
                message: "Inscription réussie. Vérifiez votre e-mail pour activer votre compte.",
            });
        } catch (mailErr) {
            console.error("💥 Erreur lors de l’envoi du mail :", mailErr.message);
            res.status(500).json({
                success: false,
                message:
                    "Erreur lors de l’envoi de l’e-mail de vérification. Vérifie ta configuration SMTP.",
            });
        }
    } catch (err) {
        console.error("❌ Erreur REGISTER complète :", err.message);
        console.error(err.stack);
        res.status(500).json({ success: false, message: "Erreur serveur lors de l'inscription." });
    }
});

// ===================================================
// 📬 VERIFY EMAIL : vérifie le token depuis l’e-mail
// ===================================================
router.get("/verify-email", async (req, res) => {
    const { token } = req.query;

    try {
        if (!token)
            return res.status(400).json({ success: false, message: "Token manquant." });

        const user = await User.findOne({
            verificationToken: token,
            verificationExpires: { $gt: Date.now() },
        });

        if (!user)
            return res.status(400).json({ success: false, message: "Lien invalide ou expiré." });

        user.verified = true;
        user.verificationToken = undefined;
        user.verificationExpires = undefined;
        await user.save();

        console.log("✅ E-mail vérifié pour :", user.email);
        return res.json({
            success: true,
            message: "Adresse e-mail vérifiée avec succès !",
        });
    } catch (err) {
        console.error("💥 Erreur VERIFY EMAIL:", err);
        res.status(500).json({
            success: false,
            message: "Erreur serveur lors de la vérification.",
        });
    }
});

// ===================================================
// 🔁 RESEND VERIFICATION : renvoi d’un nouvel e-mail
// ===================================================
router.post("/resend-verification", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email)
            return res.status(400).json({ success: false, message: "E-mail manquant." });

        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ success: false, message: "Utilisateur introuvable." });

        if (user.verified)
            return res
                .status(400)
                .json({ success: false, message: "Cet e-mail est déjà confirmé." });

        const newToken = crypto.randomBytes(32).toString("hex");
        const verificationExpires = new Date(Date.now() + 15 * 60 * 1000);

        user.verificationToken = newToken;
        user.verificationExpires = verificationExpires;
        await user.save();

        const verifyLink = `${BASE_URL}/verify-email?token=${newToken}`;
        const transporter = createTransporter();

        await transporter.sendMail({
            from: `"EdenDisk" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "🔁 Nouveau lien de confirmation - EdenDisk",
            html: `
                <div style="font-family:'Segoe UI',sans-serif;background:#0d1b25;color:#e5e5e5;padding:40px;border-radius:16px;max-width:600px;margin:auto;box-shadow:0 0 25px rgba(0,230,170,0.3);">
                    <div style="text-align:center;margin-bottom:30px;">
                        <img src="https://edendisk.com/assets/img/edendisk.png" alt="EdenDisk" style="width:70px;height:70px;border-radius:12px;box-shadow:0 0 10px rgba(0,230,170,0.4);" />
                        <h2 style="color:#00e6aa;font-size:24px;margin-top:12px;">Renvoyer la confirmation ✉️</h2>
                    </div>
                    <p>Bonjour <b>${user.name || "utilisateur"}</b>,</p>
                    <p>Voici votre nouveau lien de confirmation :</p>
                    <div style="text-align:center;margin:40px 0;">
                        <a href="${verifyLink}" style="background:linear-gradient(135deg,#00c896,#00e6aa);color:#fff;font-weight:bold;text-decoration:none;padding:14px 32px;border-radius:12px;box-shadow:0 0 20px rgba(0,230,170,0.5);display:inline-block;">✅ Confirmer mon e-mail</a>
                    </div>
                    <p style="font-size:14px;color:#ccc;text-align:center;">Ce lien est valable <b>15 minutes</b>.</p>
                </div>`,
        });

        console.log(`📩 Lien de vérification renvoyé à ${email}`);
        res.json({ success: true, message: "E-mail de vérification renvoyé avec succès." });
    } catch (err) {
        console.error("❌ Erreur resend-verification:", err);
        res.status(500).json({
            success: false,
            message: "Erreur serveur lors du renvoi de l’e-mail.",
        });
    }
});

// ===================================================
// 🔑 LOGIN : connexion avec vérification d’e-mail
// ===================================================
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user)
            return res.status(404).json({ success: false, message: "Utilisateur introuvable." });

        if (!user.verified)
            return res.status(403).json({
                success: false,
                message: "Veuillez confirmer votre e-mail avant de vous connecter.",
            });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ success: false, message: "Mot de passe incorrect." });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.json({
            success: true,
            token,
            email: user.email,
            username: user.name || "",
        });
    } catch (err) {
        console.error("💥 Erreur LOGIN:", err);
        res.status(500).json({ success: false, message: "Erreur serveur interne." });
    }
});

// ===================================================
// ⚙️ UPDATE PROFIL
// ===================================================
router.put("/update", authMiddleware, async (req, res) => {
    try {
        const { email, name, password } = req.body;
        const user = await User.findById(req.userId);

        if (!user)
            return res.status(404).json({ success: false, message: "Utilisateur introuvable." });

        if (email) user.email = email;
        if (name) user.name = name;
        if (password) user.password = await bcrypt.hash(password, 10);

        await user.save();
        res.json({ success: true, message: "Profil mis à jour avec succès !" });
    } catch (err) {
        console.error("❌ Erreur UPDATE:", err);
        res.status(500).json({ success: false, message: "Erreur serveur." });
    }
});


// ===================================================
// 🔒 MOT DE PASSE OUBLIÉ / RÉINITIALISATION
// ===================================================

// ===================================================
// 📨 FORGOT PASSWORD - Envoi du lien
// ===================================================
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email)
            return res.status(400).json({ success: false, message: "E-mail requis." });

        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ success: false, message: "Aucun compte trouvé avec cet e-mail." });

        // Génère un token temporaire
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min

        user.resetToken = resetToken;
        user.resetExpires = resetExpires;
        await user.save();

        // Lien vers la page de réinitialisation
        const resetLink = `${BASE_URL}/reset-password?token=${resetToken}`;
        const transporter = createTransporter();

        await transporter.sendMail({
            from: `"EdenDisk" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "🔑 Réinitialisation de votre mot de passe - EdenDisk",
            html: `
            <div style="font-family:'Segoe UI',sans-serif;background:#0d1b25;color:#e5e5e5;padding:40px;border-radius:16px;max-width:600px;margin:auto;box-shadow:0 0 25px rgba(0,230,170,0.3);">
                <div style="text-align:center;margin-bottom:30px;">
                    <img src="https://edendisk.com/assets/img/edendisk.png" alt="EdenDisk" style="width:70px;height:70px;border-radius:12px;box-shadow:0 0 10px rgba(0,230,170,0.4);" />
                    <h2 style="color:#00e6aa;font-size:24px;margin-top:12px;">Réinitialisation du mot de passe 🔒</h2>
                </div>
                <p>Bonjour <b>${user.name || "utilisateur"}</b>,</p>
                <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
                <div style="text-align:center;margin:40px 0;">
                    <a href="${resetLink}" style="background:linear-gradient(135deg,#00c896,#00e6aa);color:#0b1a26;font-weight:bold;text-decoration:none;padding:14px 32px;border-radius:12px;display:inline-block;">🔑 Réinitialiser mon mot de passe</a>
                </div>
                <p style="font-size:14px;color:#ccc;text-align:center;">Ce lien est valable <b>15 minutes</b>.</p>
            </div>
        `,
        });

        console.log("📩 Mail de réinitialisation envoyé à :", email);
        res.json({ success: true, message: "E-mail de réinitialisation envoyé avec succès." });
    } catch (err) {
        console.error("💥 Erreur FORGOT PASSWORD :", err);
        res.status(500).json({ success: false, message: "Erreur serveur." });
    }
});

// ===================================================
// 🧠 RÉINITIALISER LE MOT DE PASSE
// ===================================================
router.post("/reset-password", async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password)
            return res.status(400).json({ success: false, message: "Token ou mot de passe manquant." });

        const user = await User.findOne({
            resetToken: token,
            resetExpires: { $gt: Date.now() },
        });

        if (!user)
            return res.status(400).json({ success: false, message: "Lien invalide ou expiré." });

        // Met à jour le mot de passe
        user.password = await bcrypt.hash(password, 10);
        user.resetToken = undefined;
        user.resetExpires = undefined;
        await user.save();

        console.log("✅ Mot de passe réinitialisé pour :", user.email);
        res.json({ success: true, message: "Mot de passe réinitialisé avec succès." });
    } catch (err) {
        console.error("💥 Erreur RESET PASSWORD :", err);
        res.status(500).json({ success: false, message: "Erreur serveur lors de la réinitialisation." });
    }
});


export default router;
