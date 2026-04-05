// ===================================================
// 🌱 Initialisation & Configuration
// ===================================================
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cron from "node-cron";

// ===================================================
// 📦 Imports internes
// ===================================================
import User from "./models/User.js";
import authMiddleware from "./middleware/authMiddleware.js";
import authRoutes from "./routes/auth.js";
import checkoutRoutes from "./routes/checkout.js";
import webhookRoutes from "./routes/webhook.js";
import licenseRoutes from "./routes/license.js";

// ===================================================
// 🚀 Initialisation de l’application
// ===================================================
const app = express();

// ⚠️ Le Webhook Stripe doit être défini avant express.json()
app.use("/api", webhookRoutes);

// ✅ Middlewares globaux
app.use(cors());
app.use(express.json());

// ===================================================
// 🧩 Déclaration des routes principales
// ===================================================
app.use("/api/auth", authRoutes); // Auth (login/register/update)
app.use("/api", checkoutRoutes);  // Stripe Checkout
app.use("/api", licenseRoutes);   // Licences
app.use("/api/license", licenseRoutes);

// ===================================================
// 🧠 Route test simple
// ===================================================
app.get("/hello", (req, res) => {
    res.json({ success: true, message: "🚀 Backend + Mongo opérationnel" });
});

// ===================================================
// 🧾 Route protégée : Récupération des licences utilisateur
// ===================================================
app.get("/api/license", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("licenses");
        if (!user) {
            return res.status(404).json({ success: false, message: "Utilisateur introuvable" });
        }
        res.json({ success: true, licenses: user.licenses });
    } catch (err) {
        console.error("❌ Erreur récupération licences:", err);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// ===================================================
// 📡 Connexion à MongoDB
// ===================================================
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connecté"))
    .catch((err) => console.error("❌ Erreur de connexion MongoDB:", err));

// ===================================================
// 🧹 CRON JOB : Suppression auto des comptes non vérifiés (toutes les 15 min)
// ===================================================
cron.schedule("*/15 * * * *", async () => {
    try {
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000); // ⏳ 1h en arrière

        const result = await User.deleteMany({
            isVerified: false,
            createdAt: { $lte: oneHourAgo },
        });

        if (result.deletedCount > 0) {
            console.log(
                `🧹 [CLEANUP] ${result.deletedCount} compte(s) non vérifié(s) supprimé(s) à ${now.toLocaleTimeString()}`
            );
        } else {
            console.log(`🧼 [CLEANUP] Aucun compte à supprimer (${now.toLocaleTimeString()})`);
        }
    } catch (err) {
        console.error("💥 Erreur CRON nettoyage comptes :", err);
    }
});

// ===================================================
// 🌐 Lancement du serveur
// ===================================================
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`✅ Serveur lancé sur : http://localhost:${PORT}`);
    console.log(`🔑 STRIPE_SECRET_KEY : ${process.env.STRIPE_SECRET_KEY ? "✅ OK" : "❌ MISSING"}`);
    console.log(`🔑 JWT_SECRET : ${process.env.JWT_SECRET ? "✅ OK" : "❌ MISSING"}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
});

export default app;
