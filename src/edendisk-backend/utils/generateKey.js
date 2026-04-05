import crypto from "crypto";

const SECRET_KEY = "mon_secret_tres_confidentiel"; // Même clé que Python

// Générer une base aléatoire de 20 caractères
export function generateBaseKey(length = 20) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Générer la clé licence format identique à Python
export function generateLicenseKey(baseKey, expiryDate) {
    // YYMMDD
    const dateStr = expiryDate.toISOString().slice(2, 10).replace(/-/g, "");

    // Base + date
    const rawKey = baseKey + dateStr;

    // Signature HMAC SHA256 (8 chars en majuscules)
    const signature = crypto
        .createHmac("sha256", SECRET_KEY)
        .update(rawKey)
        .digest("hex")
        .toUpperCase()
        .slice(0, 8);

    // Concat base + date + signature
    const fullKey = rawKey + signature;

    // Découpe en blocs de 4 caractères
    let blocks = [];
    for (let i = 0; i < fullKey.length; i += 4) {
        blocks.push(fullKey.substring(i, i + 4));
    }

    // ⚡ Forcer le dernier bloc à être de 2 caractères (comme Python)
    if (blocks[blocks.length - 1].length === 4) {
        const lastBlock = blocks.pop();
        blocks.push(lastBlock.substring(0, 2));
    }

    return blocks.join("-");
}
