import { v4 as uuidv4 } from "uuid";
import User from "../models/User.js";

/**
 * Génère et assigne une licence payante à un utilisateur.
 * @param {string} userId - L'ID MongoDB de l'utilisateur
 * @param {number} years - Durée en années
 * @returns {object|null} La licence créée ou null si échec
 */
export const generateLicenseForUser = async (userId, years) => {
    try {
        if (!userId) {
            console.error("❌ Impossible de générer une licence : userId manquant");
            return null;
        }

        const user = await User.findById(userId);
        if (!user) {
            console.error(`❌ Utilisateur introuvable : ${userId}`);
            return null;
        }

        // ⏳ Calcul de la date d’expiration
        const expiresAt = new Date();
        expiresAt.setFullYear(expiresAt.getFullYear() + Number(years));

        const newLicense = {
            key: uuidv4(),
            type: "paid",
            expiresAt,
        };

        user.licenses.push(newLicense);
        await user.save();

        console.log(`✅ Licence payante générée pour ${user.email} (${years} an${years > 1 ? "s" : ""})`);
        return newLicense;
    } catch (err) {
        console.error("❌ Erreur génération licence payante :", err);
        return null;
    }
};
