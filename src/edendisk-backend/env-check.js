import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, ".env");

console.log("📂 Chargement du fichier .env depuis :", envPath);

// 🔍 On vide les éventuelles variables déjà présentes
delete process.env.STRIPE_SECRET_KEY;

// On recharge le fichier .env
dotenv.config({ path: envPath });

console.log("🔎 Résultat du chargement :");
console.log("STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY);
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("JWT_SECRET:", process.env.JWT_SECRET);

if (!process.env.STRIPE_SECRET_KEY) {
    console.error("❌ Toujours rien !");
} else {
    console.log("✅ Clé Stripe trouvée !");
}
