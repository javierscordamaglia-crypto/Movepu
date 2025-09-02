import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GoogleAuthProvider, signInWithPopup,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebaseConfig";

// Componente per l'interfaccia di login
const LoginPage = ({ setCurrentView, setUser, showMessage }) => {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [motivationalMessage] = useState(
    [
      "Oggi è il giorno perfetto per superare i tuoi limiti!",
      "Il corpo raggiunge ciò che la mente crede possibile.",
      "Non smettere finché non senti 'Ce l'ho fatta!'",
      "Ogni goccia di sudore è un passo verso il tuo obiettivo.",
      "La disciplina batte il talento quando il talento non si allena.",
      "Sei più forte di quanto pensi. Inizia ora.",
      "Il successo è costruito un allenamento alla volta.",
      "Non aspettare il momento perfetto. Crea il tuo momento.",
      "La tua unica limitazione sei tu stesso. Vai!",
      "Il cambiamento inizia oggi. Forza!",
    ][Math.floor(Math.random() * 10)]
  );

  // Abbiamo rimosso la useEffect per evitare il reindirizzamento automatico.
  // La navigazione avverrà solo dopo un'azione diretta dell'utente.

  const handleSocialLogin = async (providerType) => {
    setLoading(providerType);
    setError(null);
    const provider =
      providerType === "google"
        ? new GoogleAuthProvider()
        : null;

    try {
      if (provider) {
        await signInWithPopup(auth, provider);
        // Dopo il login sociale, controlliamo se il profilo esiste già
        // Se non esiste, l'utente verrà reindirizzato alla pagina di setup del profilo
        // (Questa logica dovrà essere gestita in App.jsx)
        showMessage("Accesso effettuato con successo!", "success");
      }
    } catch (err) {
      console.error("Errore durante l'accesso sociale:", err);
      setError("Errore durante l'accesso. Riprova.");
      showMessage("Errore durante l'accesso.", "error");
    } finally {
      setLoading(null);
    }
  };

  const handleEmailAuth = async () => {
    setLoading('email');
    setError(null);
    try {
      if (isLoginView) {
        await signInWithEmailAndPassword(auth, email, password);
        showMessage("Accesso effettuato con successo!", "success");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Reindirizziamo l'utente alla schermata di setup del profilo
        setCurrentView("profileSetup");
        showMessage("Registrazione completata! Inserisci i tuoi dati.", "success");
      }
    } catch (err) {
      console.error("Errore di autenticazione email:", err);
      let errorMessage = "Si è verificato un errore.";
      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMessage = "Questa email è già in uso.";
          break;
        case 'auth/invalid-email':
          errorMessage = "L'indirizzo email non è valido.";
          break;
        case 'auth/weak-password':
          errorMessage = "La password deve contenere almeno 6 caratteri.";
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = "Email o password errati.";
          break;
        default:
          errorMessage = err.message;
      }
      setError(errorMessage);
      showMessage(errorMessage, "error");
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
          
          :root {
            --primary: #0066ff;
            --primary-dark: #004cbb;
            --secondary: #ff6b00;
            --accent: #00e080;
            --dark: #121826;
            --light: #ffffff;
            --gray: #e0e6f0;
            --shadow-sm: 0 4px 12px rgba(0, 102, 255, 0.16);
            --shadow-md: 0 10px 25px rgba(0, 102, 255, 0.2);
            --shadow-lg: 0 20px 40px rgba(0, 102, 255, 0.25);
            --border: 1px solid rgba(0, 102, 255, 0.2);
            --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            --radius-lg: 2rem;
            --radius-md: 1.25rem;
            --radius-sm: 0.75rem;
          }

          body {
            margin: 0;
            font-family: 'Poppins', sans-serif;
            color: var(--light);
            background: linear-gradient(135deg, #0f1b3a 0%, #1a365d 50%, #0066ff 100%);
            min-height: 100vh;
            background-attachment: fixed;
            overflow-x: hidden;
          }

          .login-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
            position: relative;
          }

          .login-container::before {
            content: '';
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTEwIDBoLTEwdi0xMCBMMCAyMC41IDMuNSAyNCAwIDMwIDAgNDAgNSA0NSA1IDM1IDEwIDMwIDEwIDIwIDE1IDI1IDE1IDE1IDEwIDEwek0yMCAwaC0xMHYxMGgxMHYtMTB6bTEwIDBoLTEwdjEwaDEwdi0xMHptMTAgMGgtMTB2MTBoMTB2LTEwemm1MCAwaC0xMHYxMGgxMHYtMTB6bTEwIDBoLTEwdjEwaDEwdi0xMHptMTAgMGgtMTB2MTBoMTB2LTEwek0wIDMwdi0xMGgxMHYxMGgtMTB6bTEwIDBoLTEwdjEwaDEwdi0xMHptMTAgMGgtMTB2MTBoMTB2LTEwemm10IDBoLTEwdjEwaDEwdi0xMHptMTAgMGgtMTB2MTBoMTB2LTEwemm1MCAwaC0xMHYxMGgxMHYtMTAwek00MCAwdi0xMGgxMHYxMHoiIGZpbGw9IiNmZmZmZmYwMSIvPjwvc3ZnPg==');
            opacity: 0.03;
            pointer-events: none;
            z-index: -1;
          }

          .login-card {
            width: 100%;
            max-width: 460px;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(20px);
            border: var(--border);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            padding: 3rem 2.5rem;
            text-align: center;
            transition: var(--transition);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .login-card:hover {
            transform: translateY(-8px);
            box-shadow: var(--shadow-lg);
          }

          .logo {
            font-size: 4.4rem;
            font-weight: 900;
            color: var(--light);
            margin: 0 0 0.5rem 0;
            letter-spacing: -0.04em;
            text-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
          }

          .tagline {
            font-size: 1.35rem;
            font-weight: 500;
            color: var(--accent);
            margin-bottom: 2.8rem;
            font-style: italic;
            letter-spacing: 1.8px;
            opacity: 0.9;
          }

          .motivational-text {
            font-size: 1.1rem;
            color: var(--gray);
            font-weight: 500;
            margin-bottom: 2.5rem;
            line-height: 1.6;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
          }

          .login-button {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1.3rem;
            background: white;
            border: 1px solid #e2e2e2;
            border-radius: var(--radius-md);
            padding: 1rem 1.6rem;
            margin-bottom: 1.3rem;
            box-shadow: 0 6px 14px rgba(0, 0, 0, 0.1);
            font-weight: 700;
            color: #333;
            font-size: 1.12rem;
            transition: var(--transition);
            cursor: pointer;
            opacity: 1;
            transform: translateY(0);
          }

          .login-button:hover:not(:disabled) {
            transform: translateY(-5px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.18);
          }

          .login-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .login-button.loading {
            transform: translateY(0);
          }

          .login-button.loading span {
            display: flex;
            align-items: center;
            gap: 0.6rem;
          }

          .spinner {
            display: inline-block;
            width: 1.2rem;
            height: 1.2rem;
            border: 2px solid #10b981;
            border-top-color: transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          .facebook-button {
            background: #1877F3;
            color: white;
            border: none;
            box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
          }

          .apple-button {
            background: #000;
            color: white;
            border: none;
            box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);
          }

          .error-message {
            width: 100%;
            text-align: center;
            color: #b91c1c;
            font-weight: 600;
            margin-top: 1.6rem;
            font-size: 1.05rem;
            padding: 1.1rem 1rem;
            border-radius: var(--radius-sm);
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(248, 113, 113, 0.3);
            box-shadow: 4px 8px rgba(248, 113, 113, 0.1);
          }
          
          .email-auth-container {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            margin-top: 1.5rem;
            animation: fadeInUp 0.5s ease-out forwards;
          }

          .input-group {
            position: relative;
          }
          
          .email-auth-input {
            width: 100%;
            padding: 1rem;
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            background-color: rgba(255, 255, 255, 0.1);
            color: white;
            font-size: 1rem;
            box-sizing: border-box;
          }

          .email-auth-input::placeholder {
            color: rgba(255, 255, 255, 0.6);
          }

          .separator {
            display: flex;
            align-items: center;
            text-align: center;
            margin: 1rem 0;
            color: rgba(255, 255, 255, 0.5);
            font-size: 0.9rem;
          }
          
          .separator::before,
          .separator::after {
            content: '';
            flex: 1;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .separator:not(:empty)::before {
            margin-right: .5em;
          }
          
          .separator:not(:empty)::after {
            margin-left: .5em;
          }

          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      <div className="login-container">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="login-card"
          whileHover={{ translateY: -8 }}
        >
          {/* Logo */}
          <h1 className="logo">MOVEUP</h1>
          <p className="tagline">RIPARTI LEGGERA</p>

          {/* Frase motivazionale */}
          <p className="motivational-text">"{motivationalMessage}"</p>
          
          <AnimatePresence mode="wait">
            {isLoginView ? (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="email-auth-container"
              >
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="email-auth-input"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="email-auth-input"
                />
                <motion.button
                  onClick={handleEmailAuth}
                  whileHover={{ scale: 1.05, boxShadow: '0 6px 20px rgba(0, 102, 255, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  className="login-button"
                  style={{
                    background: 'linear-gradient(135deg, #0066ff, #004cbb)',
                    boxShadow: '0 4px 15px rgba(0, 102, 255, 0.4)',
                    color: 'white'
                  }}
                >
                  {loading === 'email' ? 'Accesso in corso...' : 'Accedi'}
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="register-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="email-auth-container"
              >
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="email-auth-input"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="email-auth-input"
                />
                <motion.button
                  onClick={handleEmailAuth}
                  whileHover={{ scale: 1.05, boxShadow: '0 6px 20px rgba(0, 102, 255, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  className="login-button"
                  style={{
                    background: 'linear-gradient(135deg, #0066ff, #004cbb)',
                    boxShadow: '0 4px 15px rgba(0, 102, 255, 0.4)',
                    color: 'white'
                  }}
                >
                  {loading === 'email' ? 'Registrazione in corso...' : 'Registrati'}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          <button onClick={() => setIsLoginView(!isLoginView)} className="login-button" style={{ background: 'transparent', border: 'none', color: 'var(--gray)', fontSize: '0.9rem', padding: '0', marginBottom: '0' }}>
            {isLoginView ? 'Non hai un account? Registrati' : 'Hai già un account? Accedi'}
          </button>

          <div className="separator">o</div>
          
          <motion.button
            onClick={() => handleSocialLogin("google")}
            disabled={!!loading}
            className="login-button"
          >
            <svg width="24" height="24" viewBox="0 0 48 48">
              <path fill="#4285F4" d="M24 9.5c3.54-1 5.78-3.8 6.7-6.5-3.5 2-7.8 3.2-12.7 3.2C12.9 6.2 8.7 3 6.2 0 2.5 3.5 0 7.8 0 12.7c0 4.9 3.2 9.2 7.8 11.8 1.1.6 2.3.9 3.6.9 1.3 0 2.5-.3 3.6-.9 2.5-1.3 4.5-3.6 5.6-6.4 1.1-2.8 1.5-5.8 1.2-8.8z" />
              <path fill="#34A853" d="M6.2 0C2.5 3.5 0 7.8 0 12.7c0 4.9 3.2 9.2 7.8 11.8 1.1.6 2.3.9 3.6.9 1.3 0 2.5-.3 3.6-.9 2.5-1.3 4.5-3.6 5.6-6.4 1.1-2.8 1.5-5.8 1.2-8.8-3.5 2-7.8 3.2-12.7 3.2-4.9 0-9.2-1.2-12.7-3.2z" />
              <path fill="#FBBC05" d="M41.8 24c0-1.3-.2-2.5-.5-3.7h-20v7.4h11.6c-.5 2.5-2 4.6-4.3 5.8 2.5 1.2 5.4 1.8 8.2 1.8 4.9 0 9.2-1.2 12.7-3.2-1.1-2.8-3.1-5.1-5.6-6.4z" />
              <path fill="#EA4335" d="M6.2 0C2.5 3.5 0 7.8 0 12.7c0 4.9 3.2 9.2 7.8 11.8 1.1.6 2.3.9 3.6.9 1.3 0 2.5-.3 3.6-.9 2.5-1.3 4.5-3.6 5.6-6.4 1.1-2.8 1.5-5.8 1.2-8.8-3.5 2-7.8 3.2-12.7 3.2-4.9 0-9.2-1.2-12.7-3.2z" />
            </svg>
            {loading === "google" ? (
              <span className="loading">
                <span className="spinner"></span>
                Accesso in corso...
              </span>
            ) : (
              "Accedi con Google"
            )}
          </motion.button>
          
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;
