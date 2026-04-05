import express from "express";
import Stripe from "stripe";
import crypto from "crypto";
import User from "../models/User.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ⚠️ Stripe demande un raw body
router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
        const sig = req.headers["stripe-signature"];

        let event;
        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.error("❌ Erreur signature webhook:", err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // ✅ Paiement validé
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            console.log("💳 Paiement confirmé:", session);

            try {
                // Récupérer l'email du client (envoyé lors du checkout)
                const customerEmail = session.customer_email;

                // Générer une clé de licence unique
                const licenseKey = crypto.randomUUID();

                // Ajouter la licence à l’utilisateur
                const user = await User.findOne({ email: customerEmail });
                if (user) {
                    user.licenses.push({
                        key: licenseKey,
                        type: "paid",
                        expiresAt: new Date(
                            new Date().setFullYear(new Date().getFullYear() + 1) // 1 an
                        ),
                        status: "active",
                    });
                    await user.save();
                    console.log(`✅ Licence ajoutée pour ${customerEmail}`);
                } else {
                    console.warn(`⚠️ Utilisateur non trouvé: ${customerEmail}`);
                }
            } catch (error) {
                console.error("❌ Erreur traitement webhook:", error);
            }
        }

        res.json({ received: true });
    }
);

export default router;
