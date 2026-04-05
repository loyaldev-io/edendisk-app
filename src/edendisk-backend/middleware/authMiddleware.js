import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

// ===================================================
// 🔐 Middleware d’authentification pour EdenDisk
// ===================================================
const authMiddleware = async (req, res, next) => {
    try {
        // ✅ Vérifie la présence de la clé secrète JWT
        if (!process.env.JWT_SECRET) {
            console.error("❌ Erreur critique : JWT_SECRET manquant dans .env !");
            return res.status(500).json({
                success: false,
                message: "Erreur serveur (clé JWT absente).",
            });
        }

        // ✅ Vérifie la présence du header Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.warn("⚠️ Tentative d’accès sans token détectée.");
            return res.status(401).json({
                success: false,
                message: "Accès refusé : token manquant ou invalide.",
            });
        }

        // ✅ Extraction du token
        const token = authHeader.split(" ")[1];

        // ✅ Vérifie et décode le token JWT
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            console.error("❌ Erreur de vérification du token :", err.message);
            return res.status(401).json({
                success: false,
                message:
                    err.name === "TokenExpiredError"
                        ? "Session expirée, veuillez vous reconnecter."
                        : "Token invalide ou altéré.",
            });
        }

        // ✅ Vérifie que le token contient bien un ID utilisateur
        if (!decoded || !decoded.id) {
            console.error("❌ Token décodé sans ID utilisateur.");
            return res.status(401).json({
                success: false,
                message: "Token invalide : ID utilisateur manquant.",
            });
        }

        // ✅ Recherche l’utilisateur correspondant
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            console.warn(`⚠️ Aucun utilisateur trouvé avec l'ID : ${decoded.id}`);
            return res.status(404).json({
                success: false,
                message: "Utilisateur introuvable.",
            });
        }

        // 🚫 Vérifie si l’utilisateur a confirmé son adresse e-mail
        // (dans notre modèle, la propriété est `verified`)
        if (!user.verified) {
            console.warn(`⚠️ Accès refusé : email non vérifié pour ${user.email}`);
            return res.status(403).json({
                success: false,
                message:
                    "Veuillez confirmer votre adresse e-mail avant d'accéder à votre compte.",
            });
        }

        // ✅ Injection des informations utilisateur dans la requête
        req.user = user;
        req.userId = user._id; // utile pour Stripe, licences, etc.

        // ✅ Passage au prochain middleware / route
        next();
    } catch (err) {
        console.error("💥 Erreur interne dans authMiddleware :", err);
        return res.status(500).json({
            success: false,
            message: "Erreur serveur lors de la vérification du token.",
        });
    }
};

export default authMiddleware;
