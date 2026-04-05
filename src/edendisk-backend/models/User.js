import mongoose from "mongoose";

// ===================================================
// 🧾 Sous-schéma : Licences utilisateur
// ===================================================
const LicenseSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ["trial", "paid"],
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "expired"],
        default: "active",
    },
});

// ===================================================
// 👤 Schéma principal : Utilisateur EdenDisk
// ===================================================
const UserSchema = new mongoose.Schema(
    {
        // --- Identifiants de connexion ---
        email: {
            type: String,
            required: [true, "L'adresse email est requise."],
            unique: true,
            lowercase: true,
            trim: true,
        },
        name: {
            type: String,
            default: "",
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Le mot de passe est requis."],
        },

        // --- Vérification d'email ---
        verified: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
            default: null,
        },
        verificationExpires: {
            type: Date,
            default: null,
        },

        // --- 🔑 Réinitialisation de mot de passe ---
        resetToken: {
            type: String,
            default: null,
        },
        resetExpires: {
            type: Date,
            default: null,
        },

        // --- Licences utilisateur ---
        licenses: [LicenseSchema],
    },
    {
        timestamps: true, // ajoute automatiquement createdAt et updatedAt
    }
);

// ===================================================
// 🔁 Méthodes utilitaires (optionnelles)
// ===================================================

// Vérifie si une licence est encore valide
UserSchema.methods.hasActiveLicense = function () {
    return this.licenses.some(
        (lic) => lic.status === "active" && lic.expiresAt > new Date()
    );
};

// Nettoyage automatique avant export (supprime les tokens sensibles)
UserSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.verificationToken;
    delete obj.resetToken;
    delete obj.__v;
    return obj;
};

// ===================================================
// ✅ Export du modèle
// ===================================================
export default mongoose.model("User", UserSchema);
