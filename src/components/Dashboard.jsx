import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";

const Dashboard = ({ setCurrentView }) => {
  const [userName, setUserName] = useState("Utente");
  const [currentDate, setCurrentDate] = useState("");
  const [motivationalMessage] = useState([
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
  ][Math.floor(Math.random() * 10)]);

  useEffect(() => {
    const user = auth?.currentUser;
    if (user) {
      setUserName(user.displayName || user.email?.split("@")[0] || "Utente");
    }

    // Formatta data corrente: "Lunedì, 23 Settembre 2024"
    const today = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = today.toLocaleDateString('it-IT', options).replace(/^\w/, (c) => c.toUpperCase());
    setCurrentDate(formattedDate);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentView("login");
    } catch (error) {
      console.error("Errore durante il logout:", error);
    }
  };

  const buttonEmojis = {
    motivation: "💪",
    nutrition: "🥗",
    workoutDetail: "🏋️‍♀️",
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

          .dashboard-container {
            min-height: 100vh;
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
          }

          .dashboard-container::before {
            content: '';
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTEwIDBoLTEwdi0xMCBMMCAyMC41IDMuNSAyNCAwIDMwIDAgNDAgNSA0NSA1IDM1IDEwIDMwIDEwIDIwIDE1IDI1IDE1IDE1IDEwIDEwek0yMCAwaC0xMHYxMGgxMHYtMTB6bTEwIDBoLTEwdjEwaDEwdi0xMHptMTAgMGgtMTB2MTBoMTB2LTEwem0xMCAwaC0xMHYxMGgxMHYtMTB6bTEwIDBoLTEwdjEwaDEwdi0xMHptMTAgMGgtMTB2MTBoMTB2LTEwek0wIDMwdi0xMGgxMHYxMGgtMTB6bTEwIDBoLTEwdjEwaDEwdi0xMHptMTAgMGgtMTB2MTBoMTB2LTEwem0xMCAwaC0xMHYxMGgxMHYtMTB6bTEwIDBoLTEwdjEwaDEwdi0xMHoiIGZpbGw9IiNmZmZmZmYwMSIvPjwvc3ZnPg==');
            opacity: 0.03;
            pointer-events: none;
            z-index: -1;
          }

          .dashboard-header {
            width: 100%;
            max-width: 1200px;
            margin-bottom: 2.5rem;
            padding: 1.8rem 2.5rem;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(20px);
            border: var(--border);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1.5rem;
            position: relative;
            overflow: hidden;
          }

          .dashboard-header::after {
            content: '';
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: linear-gradient(45deg, transparent, rgba(255, 107, 0, 0.1), transparent);
            pointer-events: none;
            animation: shine 4s ease-in-out infinite;
          }

          @keyframes shine {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }

          .user-info {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.6rem;
          }

          .welcome-title {
            font-size: 2.2rem;
            font-weight: 800;
            color: var(--light);
            margin: 0;
            line-height: 1.2;
          }

          .welcome-name {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--accent);
            margin: 0;
          }

          .current-date {
            font-size: 1.1rem;
            color: var(--gray);
            font-weight: 500;
            margin-top: 0.4rem;
          }

          .logout-button {
            padding: 0.75rem 1.75rem;
            background: linear-gradient(135deg, #e60000, #cc0000);
            color: white;
            font-weight: 700;
            border: none;
            border-radius: var(--radius-md);
            cursor: pointer;
            box-shadow: 0 6px 16px rgba(230, 0, 0, 0.3);
            transition: var(--transition);
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .logout-button:hover {
            transform: translateY(-3px) scale(1.04);
            box-shadow: 0 8px 20px rgba(230, 0, 0, 0.4);
          }

          .logout-button:active {
            transform: translateY(-1px);
          }

          .motivational-card {
            width: 100%;
            max-width: 800px;
            background: rgba(255, 255, 255, 0.12);
            backdrop-filter: blur(16px);
            border: var(--border);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-md);
            padding: 2.5rem;
            margin-bottom: 2.5rem;
            text-align: center;
            transition: var(--transition);
            position: relative;
            overflow: hidden;
          }

          .motivational-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 5px;
            background: linear-gradient(90deg, var(--secondary), var(--accent));
          }

          .motivational-card:hover {
            transform: translateY(-6px);
            box-shadow: var(--shadow-lg);
          }

          .motivational-text {
            font-size: 1.4rem;
            font-weight: 500;
            color: var(--light);
            line-height: 1.7;
            margin: 0;
            max-width: 600px;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          }

          .start-workout-button {
            width: 90%;
            max-width: 500px;
            padding: 1.8rem 2rem;
            margin: 2rem auto 3rem;
            background: linear-gradient(135deg, var(--secondary), #cc5a00);
            color: white;
            font-weight: 800;
            font-size: 1.5rem;
            border: none;
            border-radius: var(--radius-lg);
            cursor: pointer;
            box-shadow: 0 15px 30px rgba(255, 107, 0, 0.4);
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
          }

          .start-workout-button::before {
            content: '';
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            pointer-events: none;
            animation: shine 3s ease-in-out infinite;
          }

          .start-workout-button:hover {
            transform: translateY(-10px) scale(1.05);
            box-shadow: 0 20px 40px rgba(255, 107, 0, 0.5);
          }

          .start-workout-button:active {
            transform: translateY(-5px);
          }

          .workout-emoji {
            font-size: 2.8rem;
            text-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
          }

          .buttons-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 1.75rem;
            width: 100%;
            max-width: 1200px;
            margin-top: 2rem;
          }

          .dashboard-button {
            padding: 1.6rem 1.3rem;
            border-radius: var(--radius-md);
            font-weight: 700;
            color: white;
            font-size: 1.15rem;
            border: none;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.6rem;
            box-shadow: var(--shadow-md);
            transition: var(--transition);
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
            position: relative;
            overflow: hidden;
          }

          .dashboard-button::before {
            content: '';
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3));
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
          }

          .dashboard-button:hover::before {
            opacity: 1;
          }

          .dashboard-button:hover {
            transform: translateY(-8px) scale(1.04);
            box-shadow: 0 15px 30px rgba(0, 102, 255, 0.3);
          }

          .dashboard-button:active {
            transform: translateY(-3px);
          }

          .button-motivation { background: linear-gradient(135deg, #059669, #047857); }
          .button-nutrition { background: linear-gradient(135deg, #0891b2, #065f46); }
          .button-workout-detail { background: linear-gradient(135deg, #0891b2, #0e7490); }

          .button-emoji {
            font-size: 2.2rem;
          }

          .button-label {
            font-size: 1.2rem;
            font-weight: 600;
          }
        `}
      </style>

      <div className="dashboard-container">
        {/* Header */}
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="dashboard-header"
          whileHover={{ translateY: -4 }}
        >
          <div className="user-info">
            <h1 className="welcome-title">Benvenuto,</h1>
            <p className="welcome-name">{userName}</p>
            <p className="current-date">{currentDate}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.08, boxShadow: "0 8px 20px rgba(230, 0, 0, 0.4)" }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </motion.button>
        </motion.div>

        {/* Card Motivazionale */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="motivational-card"
          whileHover={{ translateY: -6 }}
        >
          <p className="motivational-text">"{motivationalMessage}"</p>
        </motion.div>

        {/* Bottone Gigante: INIZIA AD ALLENARTI */}
        <motion.button
          onClick={() => setCurrentView("program")}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          whileHover={{ scale: 1.05, y: -10 }}
          whileTap={{ scale: 0.98 }}
          className="start-workout-button"
        >
          <span className="workout-emoji">🔥</span>
          <span>INIZIA AD ALLENARTI</span>
        </motion.button>

        {/* Griglia pulsanti (senza "Programmi") */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="buttons-grid"
        >
          {[
            { label: "Motivazione", view: "motivation", cls: "button-motivation" },
            { label: "Nutrizione", view: "nutrition", cls: "button-nutrition" },
            { label: "Dettaglio Allenamenti", view: "workoutDetail", cls: "button-workout-detail" },
          ].map((btn, index) => (
            <motion.button
              key={btn.view}
              onClick={() => setCurrentView(btn.view)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.05, y: -8 }}
              whileTap={{ scale: 0.98 }}
              className={`dashboard-button ${btn.cls}`}
            >
              <span className="button-emoji">{buttonEmojis[btn.view]}</span>
              <span className="button-label">{btn.label}</span>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </>
  );
};

export default Dashboard;