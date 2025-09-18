import React, { useState } from "react";
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
// CAMBIA QUESTO CODICE CON QUELLO CHE VUOI USARE
const MASTER_ACCESS_CODE = "MOVEUP2025";

// --- COMPONENTE POPUP PER INSERIRE IL CODICE DI ATTIVAZIONE (PER UTENTI GOOGLE) ---
const AccessCodePopup = ({ onSubmit, onCancel, error, loading }) => (
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
            <form onSubmit={onSubmit}>
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
                    <motion.button type="button" onClick={onCancel} className="auth-button" style={{ background: 'grey' }}>
                        Annulla
                    </motion.button>
                    <motion.button type="submit" disabled={loading} className="auth-button">
                        {loading ? 'Verifico...' : 'Attiva'}
                    </motion.button>
                </div>
            </form>
        </motion.div>
    </motion.div>
);


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
      
      const isNewUser = result._tokenResponse.isNewUser;
      if (isNewUser) {
        // NUOVO UTENTE GOOGLE: deve inserire il codice di attivazione
        setPendingUser(user);
        setShowAccessCodePopup(true);
      } else {
        // Utente Google già esistente: accesso diretto
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
          // Codice corretto, login completato
          setUserName(pendingUser.displayName || pendingUser.email?.split('@')[0] || 'Atleta');
          setCurrentView('dashboard');
          setShowAccessCodePopup(false);
          setPendingUser(null);
          setLoading(null);
      } else {
          // Codice errato
          setError("Codice di Attivazione non valido.");
          setLoading(null);
      }
  };

  const handleCancelPopup = async () => {
      setLoading('cancel');
      if (pendingUser) {
          try {
              await pendingUser.delete(); // Cancella l'utente Firebase creato
          } catch (deleteError) {
              console.error("Errore durante la cancellazione dell'utente:", deleteError);
          }
      }
      setShowAccessCodePopup(false);
      setPendingUser(null);
      setLoading(null);
      setError(null);
  };

  return (
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
            <AccessCodePopup
                onSubmit={handleAccessCodeSubmit}
                onCancel={handleCancelPopup}
                error={error}
                loading={loading === 'code'}
            />
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
  );
};

export default Login;

