import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Showcase from "./components/Showcase";
import Pricing from "./components/Pricing";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Licenses from "./pages/Licenses";
import Settings from "./pages/Settings";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import Download from "./pages/Download";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import VerifyNotice from "./pages/VerifyNotice";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import "./App.css";
import "./Responsive.css";

// ✅ Composant de protection pour les routes privées
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

// ✅ Layout global avec gestion conditionnelle de la Navbar et du Footer
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  // Liste des pages où la Navbar est masquée
  const hideNavbarOn = [
    "/licenses",
    "/success",
    "/cancel",
    "/download",
    "/privacy",
    "/verify-email",
    "/verify-notice",
    "/login",
    "/register",
  ];

  // Liste des pages où le Footer est masqué
  const hideFooterOn = [
    "/licenses",
    "/success",
    "/cancel",
    "/download",
    "/privacy",
    "/verify-email",
    "/verify-notice",
    "/login",
    "/register",
  ];

  const hideNavbar = hideNavbarOn.includes(location.pathname);
  const hideFooter = hideFooterOn.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
      {!hideFooter && <Footer />}
    </>
  );
};

// ✅ Application principale
function App() {
  return (
    <Layout>
      <Routes>
        {/* 🌍 Page d'accueil publique */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Features />
              <Showcase />
              <Pricing />
              <Contact />
            </>
          }
        />

        {/* 🔑 Authentification */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* 📩 Vérification d'email */}
        <Route path="/verify-notice" element={<VerifyNotice />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* 👤 Espace client protégé */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* 📜 Licences protégées */}
        <Route
          path="/licenses"
          element={
            <PrivateRoute>
              <Licenses />
            </PrivateRoute>
          }
        />

        {/* ⚙️ Paramètres protégés */}
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />

        {/* 💳 Pages Stripe (publiques, sans navbar) */}
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />

        {/* 📦 Téléchargement et légales */}
        <Route path="/download" element={<Download />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* 🚨 Forget password */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* 🚨 Redirection par défaut */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
