import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 Charge ton .env
dotenv.config({ path: path.join(__dirname, ".env") });

// Affiche toutes les variables disponibles
console.log("🔍 Variables disponibles :", Object.keys(process.env));

// Affiche la clé Stripe
if (process.env.STRIPE_SECRET_KEY) {
    console.log("✅ STRIPE_SECRET_KEY trouvée !");
    console.log("Valeur sécurisée :", process.env.STRIPE_SECRET_KEY.substring(0, 8) + "..." + process.env.STRIPE_SECRET_KEY.slice(-6));
} else {
    console.error("❌ STRIPE_SECRET_KEY introuvable");
}
