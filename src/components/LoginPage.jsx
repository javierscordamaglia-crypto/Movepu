import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification
} from "firebase/auth";

// --- Codice di Attivazione Unico ---
const MASTER_ACCESS_CODE = "MOVEUP-ITALIA-2025"; // Puoi cambiarlo quando vuoi

// --- COMPONENTE POPUP DI ATTIVAZIONE (MOSTRATO ALL'APERTURA DEL SITO) ---
const ActivationGate = ({ children }) => {
  const [isActivated, setIsActivated] = useState(() => {
    return localStorage.getItem('moveup_activated') === 'true';
  });
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const submittedCode = code.toUpperCase().trim();
    if (submittedCode === MASTER_ACCESS_CODE) {
      localStorage.setItem('moveup_activated', 'true');
      setIsActivated(true);
      setError("");
    } else {
      setError("Codice non valido. Controlla la confezione del prodotto.");
    }
  };

  if (!isActivated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(135deg, #0f1b3a 0%, #1a365d 50%, #0066ff 100%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '1rem',
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="login-card"
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(25px)',
            padding: '2.5rem',
            borderRadius: '2rem',
            textAlign: 'center',
            color: 'white',
            maxWidth: '450px',
            width: '100%',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 25px 50px rgba(0, 102, 255, 0.2)',
          }}
        >
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            Benvenuto in Move Up 🌿
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#d0d8eb', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            Grazie per aver scelto il nostro prodotto. Per accedere all’esperienza esclusiva, inserisci il codice di attivazione trovato nella confezione.
          </p>
          <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="ES. MOVEUP-ITALIA-2025"
              className="auth-input"
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.08)',
                color: 'white',
                fontSize: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                textAlign: 'center',
                boxSizing: 'border-box',
              }}
              required
              autoFocus
            />
            {error && (
              <div
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  background: 'rgba(255, 200, 100, 0.1)',
                  color: '#ffd166',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  border: '1px solid rgba(255, 200, 100, 0.3)',
                }}
              >
                {error}
              </div>
            )}
            <motion.button
              type="submit"
              className="auth-button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%',
                marginTop: '1.25rem',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                fontWeight: '600',
              }}
            >
              Attiva la mia esperienza
            </motion.button>
          </form>

          {/* 📜 Avviso legale — tono soft ma chiaro */}
          <div
            style={{
              background: 'rgba(100, 120, 180, 0.1)',
              border: '1px solid rgba(120, 140, 200, 0.2)',
              borderRadius: '0.75rem',
              padding: '1rem',
              fontSize: '0.75rem',
              color: 'rgba(220, 230, 255, 0.85)',
              lineHeight: '1.5',
              fontStyle: 'italic',
              marginTop: '1.5rem',
            }}
          >
            <strong style={{ color: '#a0b0ff' }}>Nota importante:</strong> questo codice è personale e associato al prodotto acquistato. 
            La sua condivisione non autorizzata viola i nostri Termini d’Uso e la normativa sul diritto d’autore. 
            Ti ringraziamo per il rispetto della proprietà intellettuale.
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return <>{children}</>;
};

// --- IL TUO COMPONENTE LOGIN ORIGINALE (SENZA MODIFICHE FUNZIONALI) ---
const Login = ({ setCurrentView, setUserName }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const [showAccessCodePopup, setShowAccessCodePopup] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  const handleGoogleLogin = async () => {
    setLoading('google');
    setError(null);
    setVerificationSent(false);
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const isNewUser = result?._tokenResponse?.isNewUser ?? false;
      if (isNewUser) {
        setPendingUser(user);
        setShowAccessCodePopup(true);
      } else {
        setUserName(user.displayName || user.email?.split('@')[0] || 'Atleta');
        setCurrentView('dashboard');
      }
    } catch (error) {
      console.error("Errore durante il login con Google:", error);
      setError("Impossibile accedere con Google. Riprova.");
      setLoading(null);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading('email');
    setError(null);
    setVerificationSent(false);
    const auth = getAuth();
    
    try {
      if (isLoginView) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        if (accessCode.toUpperCase() !== MASTER_ACCESS_CODE) {
            throw new Error("Codice di Attivazione non valido.");
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        setVerificationSent(true);
      }
    } catch (err) {
      let errorMessage = "Si è verificato un errore. Riprova.";
      if (err.message === "Codice di Attivazione non valido.") {
          errorMessage = err.message;
      } else {
         switch (err.code) {
            case 'auth/email-already-in-use':
              errorMessage = "Questa email è già registrata."; break;
            case 'auth/invalid-email':
              errorMessage = "L'indirizzo email non è valido."; break;
            case 'auth/weak-password':
              errorMessage = "La password deve contenere almeno 6 caratteri."; break;
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
              errorMessage = "Email o password errati."; break;
            default:
              console.error("Errore di autenticazione email:", err);
          }
      }
      setError(errorMessage);
    } finally {
      setLoading(null);
    }
  };

  const handleAccessCodeSubmit = async (e) => {
      e.preventDefault();
      setLoading('code');
      setError(null);
      const code = e.target.accessCode.value;
      
      if (code.toUpperCase() === MASTER_ACCESS_CODE) {
          setUserName(pendingUser.displayName || pendingUser.email?.split('@')[0] || 'Atleta');
          setCurrentView('dashboard');
          setShowAccessCodePopup(false);
          setPendingUser(null);
          setLoading(null);
      } else {
          setError("Codice di Attivazione non valido.");
          setLoading(null);
      }
  };

  const handleCancelPopup = async () => {
      setLoading('cancel');
      if (pendingUser) {
          try {
              await pendingUser.delete();
          } catch (deleteError) {
              console.error("Errore durante la cancellazione dell'utente:", deleteError);
          }
      }
      setShowAccessCodePopup(false);
      setPendingUser(null);
      setLoading(null);
      setError(null);
  };

  // ✅ Avvolgi tutto il JSX del login con <ActivationGate>
  return (
    <ActivationGate>
      <>
        <style>
          {`
            .login-container {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: linear-gradient(135deg, #0f1b3a 0%, #1a365d 50%, #0066ff 100%);
              padding: 1rem;
              font-family: 'Poppins', sans-serif;
            }
            .login-card {
              background: rgba(255, 255, 255, 0.15);
              backdrop-filter: blur(20px);
              padding: 2.5rem;
              border-radius: 2rem;
              text-align: center;
              color: white;
              max-width: 450px;
              width: 100%;
              border: 1px solid rgba(255, 255, 255, 0.2);
              box-shadow: 0 20px 40px rgba(0, 102, 255, 0.25);
            }
            .login-title {
              font-size: 2.5rem;
              font-weight: 800;
              margin-bottom: 0.5rem;
            }
            .login-subtitle {
              font-size: 1rem;
              color: #e0e6f0;
              margin-bottom: 2rem;
            }
            .auth-form {
              display: flex;
              flex-direction: column;
              gap: 1rem;
              margin-bottom: 1rem;
            }
            .auth-input {
              width: 100%;
              padding: 1rem;
              border-radius: 0.75rem;
              border: 1px solid rgba(255, 255, 255, 0.3);
              background-color: rgba(255, 255, 255, 0.1);
              color: white;
              font-size: 1rem;
              box-sizing: border-box;
            }
            .auth-input::placeholder {
              color: rgba(255, 255, 255, 0.6);
            }
            .auth-button {
              padding: 1rem;
              background: linear-gradient(135deg, #0066ff, #004cbb);
              color: white;
              border: none;
              border-radius: 0.75rem;
              font-size: 1rem;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s ease;
            }
            .auth-button:hover:not(:disabled) {
              transform: translateY(-2px);
              box-shadow: 0 8px 20px rgba(0, 102, 255, 0.3);
            }
            .auth-button:disabled {
              background: #555;
              cursor: not-allowed;
            }
            .toggle-button {
              background: none;
              border: none;
              color: #e0e6f0;
              cursor: pointer;
              text-decoration: underline;
              margin-bottom: 1rem;
            }
            .separator {
              display: flex;
              align-items: center;
              text-align: center;
              color: rgba(255, 255, 255, 0.5);
              margin: 1.5rem 0;
            }
            .separator::before, .separator::after {
              content: '';
              flex: 1;
              border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            }
            .separator:not(:empty)::before { margin-right: .5em; }
            .separator:not(:empty)::after { margin-left: .5em; }
            .google-login-button {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              padding: 1rem 2rem;
              background-color: white;
              color: #333;
              border: none;
              border-radius: 1.25rem;
              font-size: 1rem;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s ease;
              box-shadow: 0 8px 20px rgba(0,0,0,0.1);
              width: 100%;
              box-sizing: border-box;
            }
            .google-login-button:hover:not(:disabled) {
              transform: translateY(-4px);
              box-shadow: 0 12px 25px rgba(0,0,0,0.2);
            }
            .google-icon {
              width: 24px;
              height: 24px;
              margin-right: 1rem;
            }
            .feedback-message {
              margin-top: 1rem;
              padding: 0.8rem;
              border-radius: 0.5rem;
              font-weight: 500;
            }
            .error {
              background-color: rgba(239, 68, 68, 0.2);
              color: #f87171;
            }
            .success {
              background-color: rgba(16, 185, 129, 0.2);
              color: #34d399;
            }
          `}
        </style>
        
        <AnimatePresence>
          {showAccessCodePopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,0.7)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="login-card" style={{ maxWidth: '400px' }}
              >
                <h2 className="login-title" style={{ fontSize: '1.8rem' }}>Attiva il tuo Account</h2>
                <p className="login-subtitle" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Per completare la registrazione, inserisci il codice che hai trovato nella confezione del tuo prodotto MOVE UP.
                </p>
                <form onSubmit={handleAccessCodeSubmit}>
                  <input
                    name="accessCode"
                    type="text"
                    placeholder="Il tuo codice di attivazione"
                    className="auth-input"
                    style={{ textTransform: 'uppercase' }}
                    required
                  />
                  {error && <div className="feedback-message error" style={{marginTop: '1rem'}}>{error}</div>}
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <motion.button type="button" onClick={handleCancelPopup} className="auth-button" style={{ background: 'grey' }}>
                      Annulla
                    </motion.button>
                    <motion.button type="submit" disabled={loading} className="auth-button">
                      {loading ? 'Verifico...' : 'Attiva'}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="login-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="login-card"
          >
            <h1 className="login-title">Move Up</h1>
            <p className="login-subtitle">{isLoginView ? 'Accedi per continuare' : 'Crea il tuo account'}</p>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={isLoginView ? 'login' : 'register'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleEmailAuth} className="auth-form">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="auth-input"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-input"
                    required
                  />
                  {!isLoginView && (
                    <motion.input
                      key="accessCode"
                      type="text"
                      placeholder="Codice di Attivazione"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      className="auth-input"
                      required
                      style={{ textTransform: 'uppercase' }}
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    />
                  )}
                  <motion.button
                    type="submit"
                    disabled={loading === 'email'}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="auth-button"
                  >
                    {loading === 'email' ? 'Caricamento...' : (isLoginView ? 'Accedi' : 'Registrati')}
                  </motion.button>
                </form>
              </motion.div>
            </AnimatePresence>
            
            <button onClick={() => { setIsLoginView(!isLoginView); setError(null); setVerificationSent(false); }} className="toggle-button">
              {isLoginView ? 'Non hai un account? Registrati' : 'Hai già un account? Accedi'}
            </button>

            {error && <div className="feedback-message error">{error}</div>}
            {verificationSent && <div className="feedback-message success">Account creato! Controlla la tua casella di posta per l'email di verifica.</div>}

            <div className="separator">o</div>

            <motion.button
              onClick={handleGoogleLogin}
              disabled={!!loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="google-login-button"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google Icon" className="google-icon" />
              {loading === 'google' ? 'Caricamento...' : 'Continua con Google'}
            </motion.button>
          </motion.div>
        </div>
      </>
    </ActivationGate>
  );
};

export default Login;

