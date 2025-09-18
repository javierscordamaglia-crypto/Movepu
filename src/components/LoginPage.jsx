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
const MASTER_ACCESS_CODE = "MU-8XKQ-2025";

// --- COMPONENTE POPUP DI ATTIVAZIONE (MOBILE-FRIENDLY + COUNTDOWN) ---
const ActivationGate = ({ children }) => {
  const [isActivated, setIsActivated] = useState(() => {
    return localStorage.getItem('moveup_activated') === 'true';
  });
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const handleSubmit = (e) => {
    e.preventDefault();
    const submittedCode = code.toUpperCase().trim();
    if (submittedCode === MASTER_ACCESS_CODE) {
      setShowCountdown(true);
      setCountdown(3);

      // Countdown di 3 secondi
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            localStorage.setItem('moveup_activated', 'true');
            setIsActivated(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
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
        transition={{ duration: 0.6 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(135deg, #0f1b3a 0%, #1a365d 50%, #0055aa 100%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '1rem',
          boxSizing: 'border-box',
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <motion.div
          initial={{ scale: 0.92, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.92, y: 30 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(30px)',
            padding: '2rem 1.5rem', // 👈 Adattato per mobile
            borderRadius: '2rem',
            textAlign: 'center',
            color: 'white',
            width: '100%',
            maxWidth: '480px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 30px 60px rgba(0, 85, 170, 0.25)',
            boxSizing: 'border-box',
          }}
        >
          {/* 🌀 Icona animata fluttuante */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            style={{ marginBottom: '1.5rem' }}
          >
            <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
              <path d="M32 8L52 28H44V52H20V28H12L32 8Z" fill="url(#grad1)" />
              <defs>
                <linearGradient id="grad1" x1="32" y1="8" x2="32" y2="52" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4facfe" />
                  <stop offset="1" stopColor="#00f2fe" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          <h2 style={{
            fontSize: '1.75rem', // 👈 Ridotto per mobile
            fontWeight: '800',
            marginBottom: '0.75rem',
            letterSpacing: '-0.5px',
            lineHeight: '1.2'
          }}>
            Benvenuto in <span style={{ background: 'linear-gradient(90deg, #4facfe, #00f2fe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Move Up</span>
          </h2>
          <p style={{
            fontSize: '0.95rem', // 👈 Adattato
            color: '#c5d0eb',
            marginBottom: '1.75rem',
            lineHeight: '1.5',
            fontWeight: '300',
            padding: '0 1rem'
          }}>
            Per accedere all’esperienza esclusiva, inserisci il codice di attivazione presente nella confezione del prodotto.
          </p>

          {showCountdown ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                padding: '2rem 1rem',
                fontSize: '3rem',
                fontWeight: '800',
                color: '#00f2fe',
                background: 'rgba(0, 242, 254, 0.1)',
                borderRadius: '1.5rem',
                margin: '2rem auto',
                width: 'fit-content',
                border: '2px solid rgba(0, 242, 254, 0.3)'
              }}
            >
              {countdown}
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Guarda nella confezione del prodotto"
                style={{
                  width: '100%',
                  padding: '1.1rem', // 👈 Adattato
                  borderRadius: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  background: 'rgba(0, 30, 70, 0.3)',
                  color: 'white',
                  fontSize: '1rem', // 👈 Più leggibile su mobile
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  textAlign: 'center',
                  boxSizing: 'border-box',
                  fontWeight: '500',
                  margin: '0 auto',
                  maxWidth: '320px' // 👈 Evita che sia troppo largo su mobile
                }}
                required
                autoFocus
              />
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    marginTop: '1.25rem',
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    background: 'rgba(255, 200, 100, 0.12)',
                    color: '#ffd166',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    border: '1px solid rgba(255, 200, 100, 0.25)',
                    maxWidth: '320px',
                    margin: '0 auto'
                  }}
                >
                  {error}
                </motion.div>
              )}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  maxWidth: '320px', // 👈 Bottone non troppo largo
                  marginTop: '1.5rem',
                  padding: '1.1rem 0',
                  borderRadius: '1.25rem',
                  border: 'none',
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  fontSize: '1.05rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(79, 172, 254, 0.3)',
                  transition: 'all 0.3s ease',
                  margin: '0 auto',
                  display: 'block'
                }}
              >
                ✨ Attiva la mia esperienza
              </motion.button>
            </form>
          )}

          {/* 📜 Avviso legale — mobile-friendly */}
          <div
            style={{
              background: 'rgba(90, 100, 140, 0.15)',
              border: '1px solid rgba(110, 120, 160, 0.2)',
              borderRadius: '1rem',
              padding: '1rem',
              fontSize: '0.75rem',
              color: 'rgba(210, 220, 255, 0.8)',
              lineHeight: '1.5',
              fontStyle: 'italic',
              marginTop: '1.5rem',
              maxWidth: '320px',
              margin: '0 auto'
            }}
          >
            <strong style={{ color: '#a0b0ff', fontWeight: '500' }}>Nota per te:</strong> questo codice è personale e unico. 
            La sua condivisione non autorizzata viola i nostri Termini d’Uso e la normativa sul diritto d’autore.
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // ✅ Transizione fluida quando si passa dal popup al login
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
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
              box-sizing: border-box;
            }
            .login-card {
              background: rgba(255, 255, 255, 0.15);
              backdrop-filter: blur(20px);
              padding: 2rem 1.5rem; /* 👈 Adattato per mobile */
              border-radius: 2rem;
              text-align: center;
              color: white;
              width: 100%;
              max-width: 450px;
              border: 1px solid rgba(255, 255, 255, 0.2);
              box-shadow: 0 20px 40px rgba(0, 102, 255, 0.25);
              box-sizing: border-box;
            }
            .login-title {
              font-size: 2rem; /* 👈 Ridotto per mobile */
              font-weight: 800;
              margin-bottom: 0.5rem;
              line-height: 1.2;
            }
            .login-subtitle {
              font-size: 0.95rem; /* 👈 Adattato */
              color: #e0e6f0;
              margin-bottom: 1.5rem;
              line-height: 1.5;
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
              font-size: 0.95rem;
            }
            .separator {
              display: flex;
              align-items: center;
              text-align: center;
              color: rgba(255, 255, 255, 0.5);
              margin: 1.5rem 0;
              font-size: 0.9rem;
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
              padding: 1rem;
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
              margin-right: 0.75rem;
            }
            .feedback-message {
              margin-top: 1rem;
              padding: 0.8rem;
              border-radius: 0.5rem;
              font-weight: 500;
              font-size: 0.9rem;
            }
            .error {
              background-color: rgba(239, 68, 68, 0.2);
              color: #f87171;
            }
            .success {
              background-color: rgba(16, 185, 129, 0.2);
              color: #34d399;
            }

            /* 👇 Extra: migliora il layout su iPhone e mobile piccoli */
            @media (max-width: 480px) {
              .login-card {
                margin: 0 0.5rem;
                padding: 1.5rem 1rem;
              }
              .login-title {
                font-size: 1.75rem;
              }
              .login-subtitle {
                font-size: 0.9rem;
              }
              .auth-input {
                font-size: 0.95rem;
                padding: 0.875rem;
              }
              .auth-button, .google-login-button {
                font-size: 0.95rem;
                padding: 0.875rem;
              }
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
                padding: '1rem',
                boxSizing: 'border-box',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(20px)',
                  padding: '2rem 1.5rem',
                  borderRadius: '2rem',
                  textAlign: 'center',
                  color: 'white',
                  width: '100%',
                  maxWidth: '400px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 20px 40px rgba(0, 102, 255, 0.25)',
                  boxSizing: 'border-box',
                }}
              >
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                  Attiva il tuo Account
                </h2>
                <p style={{ fontSize: '0.9rem', color: '#e0e6f0', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                  Inserisci il codice che hai trovato nella confezione del tuo prodotto MOVE UP.
                </p>
                <form onSubmit={handleAccessCodeSubmit}>
                  <input
                    name="accessCode"
                    type="text"
                    placeholder="Guarda nella confezione"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      borderRadius: '0.75rem',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '1rem',
                      textTransform: 'uppercase',
                      boxSizing: 'border-box',
                      marginBottom: '1rem'
                    }}
                    required
                  />
                  {error && <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>}
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <motion.button
                      type="button"
                      onClick={handleCancelPopup}
                      style={{
                        padding: '0.875rem 1.5rem',
                        borderRadius: '0.75rem',
                        border: 'none',
                        background: 'grey',
                        color: 'white',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        flex: 1
                      }}
                    >
                      Annulla
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={loading}
                      style={{
                        padding: '0.875rem 1.5rem',
                        borderRadius: '0.75rem',
                        border: 'none',
                        background: 'linear-gradient(135deg, #0066ff, #004cbb)',
                        color: 'white',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        flex: 1
                      }}
                    >
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
                      placeholder="Guarda nella confezione"
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
            {verificationSent && <div className="feedback-message success">Account creato! Controlla la tua email per la verifica.</div>}

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
