import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { generateBaseKey, generateLicenseKey } from "../utils/generateKey.js";

const router = express.Router();

/**
 * 📌 Générer une licence d’essai (7 jours)
 */
router.post("/trial", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user)
            return res.status(404).json({ success: false, message: "Utilisateur introuvable" });

        // Vérifie si l'utilisateur a déjà une licence d’essai
        const alreadyTrial = user.licenses.find((l) => l.type === "trial");
        if (alreadyTrial) {
            return res.json({
                success: false,
                message: "Vous avez déjà utilisé un essai gratuit.",
            });
        }

        // Génère la clé
        const baseKey = generateBaseKey();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // +7 jours
        const licenseKey = generateLicenseKey(baseKey, expiresAt);

        // Ajoute la licence à l'utilisateur
        user.licenses.push({
            key: licenseKey,
            type: "trial",
            expiresAt,
        });

        await user.save();

        res.json({
            success: true,
            license: { key: licenseKey, type: "trial", expiresAt },
        });
    } catch (err) {
        console.error("❌ Erreur création licence d’essai:", err);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

/**
 * 📌 Récupérer toutes les licences de l'utilisateur connecté
 */
router.get("/", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user)
            return res.status(404).json({ success: false, message: "Utilisateur introuvable" });

        res.json({ success: true, licenses: user.licenses });
    } catch (err) {
        console.error("❌ Erreur récupération licences:", err);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

export default router;
