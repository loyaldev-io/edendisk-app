// ✅ routes/checkout.js
import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config(); // ⚠️ Charger les variables ici aussi

const router = express.Router();

// ⚙️ Initialisation Stripe après chargement de .env
let stripe;

if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith("sk_")) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    console.log("✅ Stripe initialisé avec succès !");
} else {
    console.warn("⚠️ Clé Stripe absente ou invalide dans .env — paiement désactivé !");
    stripe = null;
}

// ✅ Route principale de création de session de paiement
router.post("/checkout", async (req, res) => {
    if (!stripe) {
        console.error("❌ Stripe non configuré au moment de l'appel /checkout");
        return res.status(500).json({ error: "Stripe non configuré." });
    }

    try {
        const { amount, email, years } = req.body;

        if (!amount || !email || !years) {
            return res.status(400).json({ error: "amount, email et years sont requis." });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            customer_email: email,
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: `Licence EdenDisk (${years} an${years > 1 ? "s" : ""})`,
                        },
                        unit_amount: amount, // 💶 en centimes
                    },
                    quantity: 1,
                },
            ],
            success_url: "http://localhost:5173/success",
            cancel_url: "http://localhost:5173/cancel",
        });

        console.log("✅ Session Stripe créée :", session.id);

        res.json({ success: true, url: session.url });
    } catch (error) {
        console.error("❌ Erreur Stripe Checkout :", error.message);
        res.status(500).json({ error: "Erreur lors de la création de la session." });
    }
});

export default router;
