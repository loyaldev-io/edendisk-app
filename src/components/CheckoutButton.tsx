import React from "react";

interface CheckoutButtonProps {
    amount: number; // prix en centimes (ex : 2999 = 29,99€)
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ amount }) => {
    const handleCheckout = async () => {
        try {
            const token = localStorage.getItem("token");
            const email = localStorage.getItem("email"); // stocké à la connexion

            if (!token || !email) {
                alert("Vous devez être connecté pour acheter une licence.");
                return;
            }

            const response = await fetch("http://localhost:4242/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ amount, email }),
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url; // redirection vers Stripe Checkout
            } else {
                alert("Erreur lors de la création de la session : " + (data.error || "inconnue"));
            }
        } catch (error) {
            console.error("❌ Erreur checkout :", error);
            alert("Une erreur est survenue lors du paiement.");
        }
    };

    return (
        <button
            onClick={handleCheckout}
            style={{
                backgroundColor: "#0d94d3",
                color: "white",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "16px",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
            }}
        >
            Acheter la licence
        </button>
    );
};

export default CheckoutButton;
