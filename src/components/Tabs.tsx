import { useState } from "react";

const tabs = ["Overview", "Features", "Requirements", "Screenshots", "Tutorials", "FAQ"];

export default function Tabs() {
    const [activeTab, setActiveTab] = useState("Overview");

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            {/* Onglets */}
            <div className="flex flex-wrap border-b">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-medium ${activeTab === tab
                            ? "border-b-2 border-green-500 text-green-600"
                            : "text-gray-600 hover:text-green-500"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Contenu */}
            <div className="py-6">
                <h2 className="text-xl font-bold mb-4">{activeTab}</h2>
                <p>
                    Ici, tu peux mettre le contenu spécifique à <b>{activeTab}</b>.
                    Exemple : description, images, tutoriels, FAQ, etc.
                </p>
            </div>
        </div>
    );
}
