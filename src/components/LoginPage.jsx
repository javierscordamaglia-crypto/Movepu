import React, { useState, useEffect } from "react";
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";

const LoginPage = ({ setCurrentView, setUser }) => {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setCurrentView("dashboard");
      }
    });
    return () => unsubscribe();
  }, [setUser, setCurrentView]);

  const handleLogin = async (providerType) => {
    setLoading(providerType);
    setError(null);
    const provider =
      providerType === "google"
        ? new GoogleAuthProvider()
        : providerType === "facebook"
        ? new FacebookAuthProvider()
        : null;

    try {
      if (provider) await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Errore durante l'accesso:", err);
      setError("Errore durante l'accesso. Riprova.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #d1fae5, #ecfdf5, #f0fdf4)",
        fontFamily: "'Inter', sans-serif",
        padding: "1.5rem",
        boxSizing: "border-box",
      }}
    >
      {/* Card con animazione iniziale */}
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.96)",
          borderRadius: "2rem",
          boxShadow: "0 30px 60px rgba(0, 0, 0, 0.18), 0 15px 25px rgba(0, 0, 0, 0.12)",
          padding: "3rem 2.5rem",
          width: "100%",
          maxWidth: "460px",
          textAlign: "center",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.7)",
          transform: "translateY(20px)",
          opacity: 0,
          animation: "fadeInUp 0.8s ease-out forwards",
          transition: "transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "translateY(-8px)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {/* Titolo */}
        <h1
          style={{
            fontSize: "4.4rem",
            fontWeight: "900",
            color: "#047857",
            margin: "0 0 0.5rem 0",
            letterSpacing: "-0.04em",
            textShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
          }}
        >
          MoveUP
        </h1>
        <h2
          style={{
            fontSize: "1.35rem",
            fontWeight: "500",
            color: "#065f46",
            marginBottom: "2.8rem",
            fontStyle: "italic",
            letterSpacing: "1.8px",
            opacity: 0.9,
          }}
        >
          RIPARTI LEGGERA
        </h2>

        {/* Pulsante Google */}
        <button
          onClick={() => handleLogin("google")}
          disabled={!!loading}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.3rem",
            backgroundColor: "white",
            border: "1px solid #e2e2e2",
            borderRadius: "9999px",
            padding: "1rem 1.6rem",
            marginBottom: "1.3rem",
            boxShadow: "0 6px 14px rgba(0, 0, 0, 0.1)",
            fontWeight: "700",
            color: "#333",
            fontSize: "1.12rem",
            transition: "all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)",
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
            transform: "translateY(0)",
            animation: "pulse 5s ease-in-out infinite",
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.18)";
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 6px 14px rgba(0, 0, 0, 0.1)";
          }}
        >
          <svg width="24" height="24" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
            <path fill="#4285F4" d="M24 9.5c3.54-1 5.78-3.8 6.7-6.5-3.5 2-7.8 3.2-12.7 3.2C12.9 6.2 8.7 3 6.2 0 2.5 3.5 0 7.8 0 12.7c0 4.9 3.2 9.2 7.8 11.8 1.1.6 2.3.9 3.6.9 1.3 0 2.5-.3 3.6-.9 2.5-1.3 4.5-3.6 5.6-6.4 1.1-2.8 1.5-5.8 1.2-8.8z" />
            <path fill="#34A853" d="M6.2 0C2.5 3.5 0 7.8 0 12.7c0 4.9 3.2 9.2 7.8 11.8 1.1.6 2.3.9 3.6.9 1.3 0 2.5-.3 3.6-.9 2.5-1.3 4.5-3.6 5.6-6.4 1.1-2.8 1.5-5.8 1.2-8.8-3.5 2-7.8 3.2-12.7 3.2-4.9 0-9.2-1.2-12.7-3.2z" />
            <path fill="#FBBC05" d="M41.8 24c0-1.3-.2-2.5-.5-3.7h-20v7.4h11.6c-.5 2.5-2 4.6-4.3 5.8 2.5 1.2 5.4 1.8 8.2 1.8 4.9 0 9.2-1.2 12.7-3.2-1.1-2.8-3.1-5.1-5.6-6.4z" />
            <path fill="#EA4335" d="M6.2 0C2.5 3.5 0 7.8 0 12.7c0 4.9 3.2 9.2 7.8 11.8 1.1.6 2.3.9 3.6.9 1.3 0 2.5-.3 3.6-.9 2.5-1.3 4.5-3.6 5.6-6.4 1.1-2.8 1.5-5.8 1.2-8.8-3.5 2-7.8 3.2-12.7 3.2-4.9 0-9.2-1.2-12.7-3.2z" />
          </svg>
          {loading === "google" ? (
            <span style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <span
                style={{
                  display: "inline-block",
                  width: "1.2rem",
                  height: "1.2rem",
                  border: "2px solid #10b981",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              ></span>
              Accesso in corso...
            </span>
          ) : (
            "Accedi con Google"
          )}
        </button>

        {/* Pulsante Facebook */}
        <button
          onClick={() => handleLogin("facebook")}
          disabled={!!loading}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.3rem",
            backgroundColor: "#1877F3",
            borderRadius: "9999px",
            padding: "1rem 1.6rem",
            marginBottom: "1.3rem",
            boxShadow: "0 6px 14px rgba(0, 0, 0, 0.12)",
            fontWeight: "700",
            color: "white",
            fontSize: "1.12rem",
            transition: "all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)",
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
            transform: "translateY(0)",
            animation: "pulse 5s ease-in-out 1.5s infinite",
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = "#1668d0";
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.2)";
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#1877F3";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 6px 14px rgba(0, 0, 0, 0.12)";
          }}
        >
          <svg width="24" height="24" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
            <path fill="#1877F3" d="M24 0C10.7 0 0 10.7 0 24s10.7 24 24 24 24-10.7 24-24S37.3 0 24 0z" />
            <path fill="white" d="M26.5 35.5v-9.5h3.5l0.5-3.5h-4v-2.3c0-1.1 0.3-1.9 1.8-1.9h2.2v-3.2c-0.4-0.1-1.7-0.3-3.2-0.3-3.2 0-5.4 1.9-5.4 5.4v2.4h-3v3.5h3v9.5h3.5z" />
          </svg>
          {loading === "facebook" ? (
            <span style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <span
                style={{
                  display: "inline-block",
                  width: "1.2rem",
                  height: "1.2rem",
                  border: "2px solid white",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              ></span>
              Accesso in corso...
            </span>
          ) : (
            "Accedi con Facebook"
          )}
        </button>

        {/* Pulsante Apple */}
        <button
          onClick={() => handleLogin("apple")} // Nota: non implementato in Firebase di default, ma l'UI è pronta
          disabled={!!loading || true} // Disabilitato finché non aggiungi AppleAuthProvider
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.3rem",
            backgroundColor: "#000",
            borderRadius: "9999px",
            padding: "1rem 1.6rem",
            marginBottom: "1.5rem",
            boxShadow: "0 6px 14px rgba(0, 0, 0, 0.15)",
            fontWeight: "700",
            color: "white",
            fontSize: "1.12rem",
            transition: "all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)",
            opacity: loading ? 0.6 : 0.95,
            cursor: "not-allowed",
            transform: "translateY(0)",
            animation: "pulse 5s ease-in-out 3s infinite",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
            <path fill="white" d="M38.853 24.01c0-3.842-2.011-6.528-5.671-6.528-2.771 0-4.616 1.838-5.568 3.258-1.059-1.42-3.148-3.258-6.007-3.258-3.685 0-6.925 2.992-6.925 8.047 0 5.057 3.066 8.049 6.925 8.049 2.773 0 4.742-1.657 5.67-3.051.942 1.395 3.421 3.051 6.804 3.051 4.108 0 6.358-2.686 6.358-6.53-.001-3.844-2.251-6.527-6.359-6.527zm-2.812 10.282c-.712 1.16-2.219 2.17-4.032 2.17-2.396 0-4.616-1.781-4.616-5.123 0-3.267 2.22-5.125 4.498-5.125 2.279 0 3.592 1.858 3.592 5.125 0 1.357-.424 2.715-1.459 3.923z" />
          </svg>
          Accedi con Apple
        </button>

        {/* Errore */}
        {error && (
          <div
            style={{
              width: "100%",
              textAlign: "center",
              color: "#b91c1c",
              fontWeight: "600",
              marginTop: "1.6rem",
              fontSize: "1.05rem",
              padding: "1.1rem 1rem",
              borderRadius: "0.75rem",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              boxShadow: "0 4px 8px rgba(248, 113, 113, 0.1)",
            }}
          >
            {error}
          </div>
        )}
      </div>

      {/* Animazioni globali */}
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes pulse {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-3px);
            }
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoginPage;