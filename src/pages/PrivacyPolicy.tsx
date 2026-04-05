import React from "react";
import "./PrivacyPolicy.css";

const PrivacyPolicy: React.FC = () => {
    return (
        <section className="privacy">
            <div className="privacy-container">
                <h1>Politique de Confidentialité & Conditions d’Utilisation</h1>
                <p className="intro">
                    Dernière mise à jour : <strong>05 octobre 2025</strong>
                </p>

                <h2>1. Présentation de l’entreprise</h2>
                <p>
                    Le présent site <strong>EdenDisk</strong> est édité et exploité par la société
                    <strong> CHRIXCODE</strong>, immatriculée sous le SIREN{" "}
                    <strong>845 379 981</strong> et le SIRET{" "}
                    <strong>845 379 981 00028</strong>.
                    <br />
                    Activité principale : <em>Programmation informatique (Code NAF 62.01Z)</em>
                    <br />
                    Forme d’exercice : <em>Libérale non réglementée</em>
                    <br />
                    Adresse : <strong>Rue St Exupéry, 97351 Matoury, Guyane française</strong>
                </p>

                <h2>2. Collecte et utilisation des données</h2>
                <p>
                    Les informations collectées sur le site <strong>EdenDisk</strong> sont destinées exclusivement
                    à des fins de gestion client, de support technique, de facturation et
                    d’amélioration des services proposés.
                </p>
                <p>
                    Aucune donnée personnelle n’est vendue, partagée ou transmise à des
                    tiers sans consentement préalable de l’utilisateur, sauf en cas
                    d’obligation légale. Les données sont hébergées sur des serveurs
                    sécurisés et accessibles uniquement par le personnel autorisé de
                    CHRIXCODE.
                </p>

                <h2>3. Comptes et licences</h2>
                <p>
                    Lors de l’achat d’une licence ou de l’utilisation d’une clé d’essai,
                    l’utilisateur s’engage à ne pas partager, revendre ou distribuer la clé
                    fournie. Chaque licence est nominative et associée à un seul appareil.
                </p>
                <p>
                    Les clés d’essai ont une durée limitée (7 jours) et expirent
                    automatiquement à la fin de la période d’essai. L’achat d’une licence
                    complète permet l’utilisation du logiciel pour la durée choisie au
                    moment du paiement.
                </p>

                <h2>4. Paiements et remboursements</h2>
                <p>
                    Les paiements sont gérés via la plateforme sécurisée{" "}
                    <strong>Stripe</strong>. CHRIXCODE ne stocke aucune donnée bancaire sur
                    ses serveurs.
                </p>
                <p className="warning">
                    ⚠️ Aucun remboursement n’est possible après l’achat d’une licence
                    numérique, conformément à l’article L221-28 du Code de la Consommation
                    relatif aux contenus numériques fournis immédiatement après paiement.
                </p>

                <h2>5. Propriété intellectuelle</h2>
                <p>
                    Tous les éléments du site <strong>EdenDisk</strong> (textes, images,
                    logos, design, code source, et structure logicielle) sont la propriété
                    exclusive de CHRIXCODE. Toute reproduction, distribution ou
                    modification sans autorisation écrite est strictement interdite.
                </p>

                <h2>6. Sécurité et confidentialité</h2>
                <p>
                    CHRIXCODE met en œuvre des mesures techniques et organisationnelles
                    pour assurer la protection des données personnelles contre toute
                    perte, utilisation abusive ou accès non autorisé.
                </p>
                <p>
                    Les utilisateurs peuvent exercer leurs droits d’accès, de rectification
                    ou de suppression de leurs données en contactant :
                </p>
                <p>
                    📧 <a href="mailto:support@chrixcode.com">support@chrixcode.com</a>
                </p>

                <h2>7. Contact et réclamations</h2>
                <p>
                    Pour toute question relative à la présente politique ou pour une
                    demande liée à la protection des données, vous pouvez contacter le
                    service client CHRIXCODE à l’adresse e-mail ci-dessus.
                </p>

                <h2>8. Acceptation</h2>
                <p>
                    En utilisant le site <strong>EdenDisk</strong>, vous acceptez sans
                    réserve la présente politique de confidentialité et les conditions
                    d’utilisation. CHRIXCODE se réserve le droit de la modifier à tout
                    moment pour s’adapter aux évolutions légales ou techniques.
                </p>

                <footer className="privacy-footer">
                    <p>
                        © {new Date().getFullYear()} EdenDisk. Tous droits réservés. Développé par{" "}
                        <a
                            href="https://chrixcode.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            CHRIXCODE
                        </a>.
                    </p>
                </footer>
            </div>
        </section>
    );
};

export default PrivacyPolicy;
