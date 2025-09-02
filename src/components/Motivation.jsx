import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Motivation = ({ setCurrentView }) => {
  const [activeGuide, setActiveGuide] = useState(null);

  const guides = [
    {
      title: "🔥 Il Perché di Move Up",
      content: (
        <>
          <p>Move Up non è un'app di fitness.</p>
          <p>È un <strong>manifesto per chi ha capito che lo sport è vita</strong>.</p>
          <p>Per chi non allena per dimagrire, ma per <strong>sentirsi potente</strong>.</p>
          <p>Abbiamo creato tutto ciò che avremmo voluto trovare quando abbiamo iniziato:</p>
          <ul style={{ textAlign: "left", margin: "1rem 0 0 1.5rem" }}>
            <li>✅ Allenamenti completi, senza segreti</li>
            <li>✅ Nutrizione pratica, senza dogmi</li>
            <li>✅ Mindset chiaro, senza frasi fatte</li>
          </ul>
          <p><strong>Perché chi sceglie lo sport come stile di vita merita tutto.</strong></p>
        </>
      ),
    },
    {
      title: "🎯 Allenamento: Coerenza > Intensità",
      content: (
        <>
          <p>L'intensità è inutile senza coerenza.</p>
          <p>Non serve fare 100 squat se poi smetti domani.</p>
          <p><strong>Fai 10 squat. Ogni. Singolo. Giorno.</strong></p>
          <p>La progressione non è lineare. È un labirinto.</p>
          <p>Non cercare il "miglior esercizio".<br />Cerca il <strong>miglior esercizio PER TE OGGI</strong>.</p>
        </>
      ),
    },
    {
      title: "🥗 Nutrizione: Semplice, Non Perfetta",
      content: (
        <>
          <p>Dimentica le diete. Pensa a <strong>abitudini sostenibili</strong>.</p>
          <p>3 regole d'oro:</p>
          <ol style={{ textAlign: "left", margin: "1rem 0 0 1.5rem" }}>
            <li><strong>Bevi acqua</strong> prima di sentire sete.</li>
            <li><strong>Mangia proteine</strong> a ogni pasto.</li>
            <li><strong>Prepara i pasti</strong> prima di aver fame.</li>
          </ol>
          <p>Il cibo è carburante. Non un premio. Non un nemico.</p>
        </>
      ),
    },
    {
      title: "🧠 Mindset: Disciplina = Libertà",
      content: (
        <>
          <p>La disciplina non toglie libertà. La crea.</p>
          <p>Quando ti alleni ogni giorno, non sei "obbligato".<br />Sei <strong>libero di scegliere</strong> di farlo.</p>
          <p>Non aspettare la motivazione.<br />Agisci, e la motivazione verrà.</p>
          <p><strong>Il tuo corpo è il tuo primo tempio.</strong><br />Trattalo come tale.</p>
        </>
      ),
    },
    {
      title: "💡 Micro-Azioni che Cambiano Tutto",
      content: (
        <>
          <p>Non serve fare tutto. Basta fare <strong>una cosa</strong>.</p>
          <ul style={{ textAlign: "left", margin: "1rem 0 0 1.5rem" }}>
            <li>✅ Fai 5 minuti di stretching appena sveglio</li>
            <li>✅ Bevi un bicchiere d’acqua prima di colazione</li>
            <li>✅ Cammina 10 minuti dopo pranzo</li>
            <li>✅ Scrivi 1 obiettivo ogni lunedì</li>
          </ul>
          <p>Le grandi trasformazioni nascono da <strong>piccole azioni ripetute</strong>.</p>
        </>
      ),
    },
  ];

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
          :root {
            --primary: #0066ff;
            --primary-dark: #004cbb;
            --accent: #00e080;
            --dark: #121826;
            --light: #ffffff;
            --gray: #e0e6f0;
            --border: 1px solid rgba(255, 255, 255, 0.18);
            --radius-lg: 2rem;
            --radius-md: 1.25rem;
          }
          .motivation-container {
            min-height: 100vh;
            padding: 1.5rem;
            background: linear-gradient(135deg, #0f1b3a 0%, #1a365d 50%, #0066ff 100%);
            font-family: 'Poppins', sans-serif;
            color: var(--light);
            position: relative;
            overflow: hidden;
          }
          .motivation-container::before {
            content: '';
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTEwIDBoLTEwdi0xMCBMMCAyMC41IDMuNSAyNCAwIDMwIDAgNDAgNSA0NSA1IDM1IDEwIDMwIDEwIDIwIDE1IDI1IDE1IDE1IDEwIDEwek0yMCAwaC0xMHYxMGgxMHYtMTB6bTEwIDBoLTEwdjEwaDEwdi0xMHptMTAgMGgtMTB2MTBoMTB2LTEwem0xMCAwaC0xMHYxMGgxMHYtMTB6bTEwIDBoLTEwdjEwaDEwdi0xMHptMTAgMGgtMTB2MTBoMTB2LTEwek0wIDMwdi0xMGgxMHYxMGgtMTB6bTEwIDBoLTEwdjEwaDEwdi0xMHptMTAgMGgtMTB2MTBoMTB2LTEwem0xMCAwaC0xMHYxMGgxMHYtMTB6bTEwIDBoLTEwdjEwaDEwdi0xMHoiIGZpbGw9IiNmZmZmZmYwMSIvPjwvc3ZnPg==');
            opacity: 0.03;
            pointer-events: none;
            z-index: -1;
          }
          .motivation-content {
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
          }
          .motivation-title {
            font-size: 2.4rem;
            font-weight: 800;
            color: var(--light);
            text-align: center;
            margin-bottom: 2rem;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          }
          .guides-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 2rem;
          }
          .guide-button {
            padding: 1rem 1.5rem;
            background: rgba(255, 255, 255, 0.1);
            border: var(--border);
            border-radius: var(--radius-md);
            color: var(--light);
            text-align: left;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
          }
          .guide-button:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
          }
          .guide-button.active {
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            box-shadow: 0 6px 16px rgba(0, 102, 255, 0.3);
          }
          .guide-content {
            background: rgba(255, 255, 255, 0.12);
            backdrop-filter: blur(16px);
            border: var(--border);
            border-radius: var(--radius-md);
            padding: 1.5rem;
            margin-top: 1rem;
            line-height: 1.8;
            color: rgba(255, 255, 255, 0.95);
            animation: fadeIn 0.4s ease;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .back-button {
            display: block;
            margin: 2rem auto 0;
            padding: 0.8rem 1.6rem;
            border-radius: var(--radius-md);
            font-weight: 600;
            color: var(--light);
            background: rgba(255, 255, 255, 0.1);
            border: var(--border);
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            text-align: center;
          }
          .back-button:hover {
            background: rgba(255, 255, 255, 0.2);
          }
        `}
      </style>

      <div className="motivation-container">
        <div className="motivation-content">
          <h1 className="motivation-title">Move Up</h1>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.8)', marginBottom: '2rem' }}>
            Strumenti per chi ha capito che lo sport è vita.
          </p>

          <div className="guides-list">
            {guides.map((guide, index) => (
              <div key={index}>
                <button
                  className={`guide-button ${activeGuide === index ? 'active' : ''}`}
                  onClick={() => setActiveGuide(activeGuide === index ? null : index)}
                >
                  {guide.title}
                </button>

                <AnimatePresence>
                  {activeGuide === index && (
                    <motion.div
                      className="guide-content"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {guide.content}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <button
            className="back-button"
            onClick={() => setCurrentView("dashboard")}
          >
            ← Torna alla Dashboard
          </button>
        </div>
      </div>
    </>
  );
};

export default Motivation;
