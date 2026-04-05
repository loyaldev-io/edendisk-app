import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Showcase from "../components/Showcase";
import Pricing from "../components/Pricing";
import Footer from "../components/Footer";

const Home: React.FC = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <Features />
            <Showcase />
            <Pricing />
            <Footer />
        </>
    );
};

export default Home;
