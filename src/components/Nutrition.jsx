import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Nutrition = ({ setCurrentView }) => {
  // --- Stati per il calcolo calorico ---
  const [userInfo, setUserInfo] = useState({
    peso: "",
    altezza: "",
    eta: "",
    sesso: "f",
    attivita: "sedentario",
  });

  // --- Stati per % grasso ---
  const [misurazioni, setMisurazioni] = useState({
    collo: "",
    vita: "",
    fianchi: "",
  });

  // --- Stati per macro ---
  const [obiettivo, setObiettivo] = useState("mantenimento");

  // --- Stati per convertitore alimento ---
  const [alimento, setAlimento] = useState("");
  const [grammi, setGrammi] = useState("");
  const [risultato, setRisultato] = useState(null);

  // --- Risultati calcoli ---
  const [tdee, setTdee] = useState(null);
  const [grasso, setGrasso] = useState(null);

  // --- Tab attiva ---
  const [activeTab, setActiveTab] = useState("calcoli");

  // --- Esempi di alimenti (nome: [proteine, carboidrati, grassi] per 100g) ---
  const alimentiDb = {
    pollo: [23, 0, 1.5],
    riso: [2.7, 28, 0.3],
    avocado: [2, 9, 15],
    uova: [13, 1.1, 11],
    pane: [8, 49, 3],
    tonno: [26, 0, 0.5],
    yogurt: [10, 12, 3],
    cioccolato: [5, 60, 30],
    salmone: [20, 0, 13],
    lenticchie: [9, 20, 0.4],
    quinoa: [4.4, 21, 1.9],
    mandorle: [21, 22, 49],
    pettoindisalume: [18, 0, 2],
    formaggialegero: [15, 3, 5],
    tofu: [8, 2, 4],
    farro: [15, 72, 2],
    broccoletti: [2.8, 7, 0.4],
  };

  // --- Calcola TDEE ---
  const calcolaTdee = () => {
    const p = parseFloat(userInfo.peso);
    const a = parseFloat(userInfo.altezza);
    const e = parseFloat(userInfo.eta);
    if (!p || !a || !e) return;

    let bmr;
    if (userInfo.sesso === "m") {
      bmr = 88.362 + 13.397 * p + 4.799 * a - 5.677 * e;
    } else {
      bmr = 447.593 + 9.247 * p + 3.098 * a - 4.330 * e;
    }

    const fattori = {
      sedentario: 1.2,
      leggero: 1.375,
      moderato: 1.55,
      attivo: 1.725,
      molto: 1.9,
    };

    const tdeeVal = Math.round(bmr * fattori[userInfo.attivita]);
    setTdee(tdeeVal);
  };

  // --- Calcola % grasso (US Navy) ---
  const calcolaGrasso = () => {
    const c = parseFloat(misurazioni.collo);
    const v = parseFloat(misurazioni.vita);
    const f = parseFloat(misurazioni.fianchi);
    const h = parseFloat(userInfo.altezza);
    if (!c || !v || !h || (userInfo.sesso === "f" && !f)) return;

    let pgrasso;
    if (userInfo.sesso === "m") {
      pgrasso = 495 / (1.0324 - 0.19077 * Math.log10(v - c) + 0.15456 * Math.log10(h)) - 450;
    } else {
      pgrasso = 495 / (1.29579 - 0.35004 * Math.log10(v + f - c) + 0.221 * Math.log10(h)) - 450;
    }

    setGrasso(parseFloat(pgrasso.toFixed(1)));
  };

  // --- Calcola macro (proteine fisse a 2g/kg per ricomposizione) ---
  const calcolaMacro = () => {
    if (!tdee || !userInfo.peso) return;

    const peso = parseFloat(userInfo.peso);
    const proteine = Math.round(2 * peso); // ✅ FISSO a 2g/kg per ricomposizione
    const proteineKcal = proteine * 4;

    // Grassi: stabili ~1g/kg
    const grassi = Math.round(1.0 * peso);
    const grassiKcal = grassi * 9;

    // Carboidrati: resto delle calorie
    const carboidrati = Math.round((tdee - proteineKcal - grassiKcal) / 4);

    return { proteine, carboidrati: Math.max(carboidrati, 30), grassi };
  };

  const macro = calcolaMacro();

  // --- Converti alimento ---
  const convertiAlimento = () => {
    if (!grammi || !alimento) return;
    const nome = alimento.toLowerCase().trim();
    const g = parseFloat(grammi);
    if (isNaN(g)) return;

    const alimentoTrovato = Object.keys(alimentiDb).find(key => key.includes(nome));
    if (!alimentoTrovato) {
      setRisultato({ errore: `Alimento "${alimento}" non trovato. Prova: pollo, avocado, uova, tonno, lenticchie, ecc.` });
      return;
    }

    const [p100, c100, f100] = alimentiDb[alimentoTrovato];
    const fattore = g / 100;
    setRisultato({
      nome: alimentoTrovato,
      proteine: (p100 * fattore).toFixed(1),
      carboidrati: (c100 * fattore).toFixed(1),
      grassi: (f100 * fattore).toFixed(1),
    });
  };

  // --- Alimenti suggeriti per input ---
  const alimentiSuggeriti = Object.keys(alimentiDb).join(", ");

  // --- Ricette dinamiche ---
  const tutteLeRicette = {
    chetogenica: [
      { colazione: "Uova strapazzate con avocado e pancetta", pranzo: "Insalata di tonno con olive e cetrioli", cena: "Pollo alla griglia con broccoli al burro" },
      { colazione: "Smoothie di avocado, cocco e proteine", pranzo: "Salmone con spinaci saltati in burro", cena: "Bistecca con funghi al limone" },
      { colazione: "Yogurt greco con noci e olio MCT", pranzo: "Taco di pollo con guacamole (senza tortilla)", cena: "Costolette di maiale con cavolo riccio arrostito" },
    ],
    vegetariana: [
      { colazione: "Yogurt greco con mandorle e mirtilli", pranzo: "Quinoa con lenticchie, spinaci e hummus", cena: "Tofu saltato con verdure e sesamo" },
      { colazione: "Omelette con funghi e formaggio", pranzo: "Pasta di lenticchie con pomodoro e basilico", cena: "Falafel con tabbouleh e tzatziki" },
      { colazione: "Porridge di avena con banana e cannella", pranzo: "Melanzane al forno con ricotta e pomodoro", cena: "Couscous con verdure grigliate e feta" },
    ],
    vegana: [
      { colazione: "Porridge di avena con banana e noci", pranzo: "Buddha bowl con ceci, quinoa, avocado", cena: "Curry di ceci con riso basmati" },
      { colazione: "Smoothie di banana, spinaci, latte di mandorle e proteine vegetali", pranzo: "Tacos di fagioli neri con guacamole", cena: "Tempeh saltato con riso integrale e verdure" },
      { colazione: "Tostato di pane integrale con hummus e pomodoro", pranzo: "Zuppa di lenticchie rosse con cocco", cena: "Pasta di piselli con pesto di basilico e pinoli" },
    ],
    celiaca: [
      { colazione: "Uova sode con avocado e frutta", pranzo: "Riso integrale con salmone e asparagi", cena: "Pollo al forno con patate dolci" },
      { colazione: "Yogurt senza glutine con frutta e semi di chia", pranzo: "Quinoa con verdure e pollo", cena: "Burger di fagioli (senza panino) con insalata" },
      { colazione: "Smoothie di frutta, latte di cocco e proteine", pranzo: "Insalata di riso nero con tonno e olive", cena: "Salmone con miglio e cavolfiore al forno" },
    ],
  };

  const [indiceRicette, setIndiceRicette] = useState({
    chetogenica: 0,
    vegetariana: 0,
    vegana: 0,
    celiaca: 0,
  });

  const cambiaRicette = () => {
    setIndiceRicette({
      chetogenica: Math.floor(Math.random() * 3),
      vegetariana: Math.floor(Math.random() * 3),
      vegana: Math.floor(Math.random() * 3),
      celiaca: Math.floor(Math.random() * 3),
    });
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

          .nutrition-container {
            min-height: 100vh;
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
          }

          .nutrition-container::before {
            content: '';
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTEwIDBoLTEwdi0xMCBMMCAyMC41IDMuNSAyNCAwIDMwIDAgNDAgNSA0NSA1IDM1IDEwIDMwIDEwIDIwIDE1IDI1IDE1IDE1IDEwIDEwek0yMCAwaC0xMHYxMGgxMHYtMTB6bTEwIDBoLTEwdjEwaDEwdi0xMHptMTAgMGgtMTB2MTBoMTB2LTEwem0xMCAwaC0xMHYxMGgxMHYtMTB6bTEwIDBoLTEwdjEwaDEwdi0xMHptMTAgMGgtMTB2MTBoMTB2LTEwek0wIDMwdi0xMGgxMHYxMGgtMTB6bTEwIDBoLTEwdjEwaDEwdi0xMHptMTAgMGgtMTB2MTBoMTB2LTEwem0xMCAwaC0xMHYxMGgxMHYtMTB6bTEwIDBoLTEwdjEwaDEwdi0xMHoiIGZpbGw9IiNmZmZmZmYwMSIvPjwvc3ZnPg==');
            opacity: 0.03;
            pointer-events: none;
            z-index: -1;
          }

          .nutrition-header {
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

          .nutrition-header::after {
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

          .welcome-title {
            font-size: 2.2rem;
            font-weight: 800;
            color: var(--light);
            margin: 0;
            line-height: 1.2;
          }

          .back-button {
            padding: 0.75rem 1.75rem;
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: white;
            font-weight: 700;
            border: none;
            border-radius: var(--radius-md);
            cursor: pointer;
            box-shadow: 0 6px 16px rgba(0, 102, 255, 0.3);
            transition: var(--transition);
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .back-button:hover {
            transform: translateY(-3px) scale(1.04);
            box-shadow: 0 8px 20px rgba(0, 102, 255, 0.4);
          }

          .tabs {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 2rem;
            width: 100%;
            max-width: 1000px;
            justify-content: center;
          }

          .tab {
            padding: 0.8rem 1.5rem;
            background: rgba(255, 255, 255, 0.1);
            color: var(--gray);
            border: none;
            border-radius: var(--radius-md) var(--radius-md) 0 0;
            cursor: pointer;
            font-weight: 600;
            transition: var(--transition);
          }

          .tab.active {
            background: var(--primary);
            color: white;
          }

          .section-card {
            width: 100%;
            max-width: 1000px;
            background: rgba(255, 255, 255, 0.12);
            backdrop-filter: blur(16px);
            border: var(--border);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-md);
            padding: 2.2rem;
            margin-bottom: 2rem;
            transition: var(--transition);
            overflow: hidden;
          }

          .section-card:hover {
            transform: translateY(-6px);
            box-shadow: var(--shadow-lg);
          }

          .section-title {
            font-size: 1.9rem;
            font-weight: 800;
            color: var(--light);
            margin-bottom: 1.5rem;
            text-align: center;
            position: relative;
          }

          .section-title::after {
            content: '';
            position: absolute;
            left: 50%;
            bottom: -8px;
            transform: translateX(-50%);
            width: 60px;
            height: 4px;
            background: linear-gradient(90deg, var(--secondary), var(--accent));
            border-radius: 2px;
          }

          .form-group {
            margin-bottom: 1.2rem;
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
          }

          .form-label {
            font-size: 1.1rem;
            color: var(--gray);
            font-weight: 500;
          }

          .form-input, .form-select {
            padding: 0.8rem 1rem;
            border-radius: var(--radius-sm);
            border: 1px solid rgba(255, 255, 255, 0.2);
            background: rgba(255, 255, 255, 0.1);
            color: var(--light);
            font-size: 1rem;
            outline: none;
            transition: var(--transition);
          }

          .form-input:focus, .form-select:focus {
            border-color: var(--secondary);
            background: rgba(255, 255, 255, 0.15);
            box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.2);
          }

          /* Dropdown chiaro */
          .form-select option {
            background: #1a365d;
            color: white;
            padding: 0.5rem;
          }

          .btn-calculate {
            padding: 0.8rem 2rem;
            background: linear-gradient(135deg, var(--secondary), #cc5a00);
            color: white;
            font-weight: 700;
            border: none;
            border-radius: var(--radius-md);
            cursor: pointer;
            box-shadow: 0 6px 16px rgba(255, 107, 0, 0.3);
            transition: var(--transition);
            align-self: flex-start;
            margin-top: 1rem;
          }

          .btn-calculate:hover {
            transform: translateY(-3px) scale(1.04);
            box-shadow: 0 8px 20px rgba(255, 107, 0, 0.4);
          }

          .result-box {
            background: rgba(0, 0, 0, 0.2);
            padding: 1.5rem;
            border-radius: var(--radius-md);
            margin-top: 1.5rem;
            text-align: center;
            font-size: 1.3rem;
            font-weight: 700;
            color: var(--accent);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }

          .macro-box {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 1rem;
            margin-top: 1.5rem;
            text-align: center;
          }

          .macro-item {
            background: rgba(255, 255, 255, 0.1);
            padding: 1rem;
            border-radius: var(--radius-sm);
            font-weight: 700;
          }

          .macro-label {
            font-size: 0.9rem;
            color: var(--gray);
          }

          .macro-value {
            font-size: 1.4rem;
            color: var(--accent);
          }

          .macro-chart {
            width: 200px;
            height: 200px;
            border-radius: 50%;
            background: conic-gradient(
              from 0deg,
              var(--accent) 0% calc(${macro?.proteine * 4 / (tdee || 1) * 100}%),
              var(--secondary) calc(${macro?.proteine * 4 / (tdee || 1) * 100}%) calc(${(macro?.proteine * 4 + macro?.carboidrati * 4) / (tdee || 1) * 100}%),
              #004cbb calc(${(macro?.proteine * 4 + macro?.carboidrati * 4) / (tdee || 1) * 100}%)
            );
            margin: 2rem auto;
            position: relative;
          }

          .macro-chart::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 60%;
            height: 60%;
            background: #121826;
            border-radius: 50%;
            transform: translate(-50%, -50%);
          }

          .chart-legend {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-top: 1rem;
            font-size: 0.9rem;
            color: var(--gray);
          }

          .legend-item {
            display: flex;
            align-items: center;
            gap: 0.4rem;
          }

          .legend-color {
            width: 12px;
            height: 12px;
            border-radius: 50%;
          }

          .instructions {
            font-size: 0.9rem;
            color: var(--gray);
            margin-top: 0.5rem;
            line-height: 1.5;
            font-style: italic;
          }

          .suggestions {
            font-size: 0.85rem;
            color: var(--accent);
            margin-top: 0.3rem;
            font-weight: 500;
          }

          .converter-row {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            align-items: end;
          }

          .recipe-card {
            background: rgba(255, 255, 255, 0.1);
            padding: 1.2rem;
            border-radius: var(--radius-md);
            margin-bottom: 1rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }

          .recipe-title {
            font-weight: 700;
            color: var(--accent);
            margin-bottom: 0.5rem;
          }

          .btn-random {
            padding: 0.6rem 1.5rem;
            background: linear-gradient(135deg, #6c5ce7, #a29bfe);
            color: white;
            border: none;
            border-radius: var(--radius-sm);
            cursor: pointer;
            font-weight: 600;
            margin-top: 1rem;
            transition: var(--transition);
          }

          .btn-random:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 14px rgba(108, 92, 231, 0.3);
          }

          @media (max-width: 640px) {
            .converter-row {
              flex-direction: column;
            }
          }
        `}
      </style>

      <div className="nutrition-container">
        {/* Header */}
        <div className="nutrition-header">
          <h1 className="welcome-title">Nutrizione Personalizzata</h1>
          <button onClick={() => setCurrentView("dashboard")} className="back-button">
            Indietro
          </button>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === "calcoli" ? "active" : ""}`}
            onClick={() => setActiveTab("calcoli")}
          >
            Calcoli
          </button>
          <button
            className={`tab ${activeTab === "ricette" ? "active" : ""}`}
            onClick={() => setActiveTab("ricette")}
          >
            Ricette
          </button>
        </div>

        {/* Tab Calcoli */}
        {activeTab === "calcoli" && (
          <>
            {/* Calcolo TDEE */}
            <div className="section-card">
              <h2 className="section-title">Calcola il tuo Fabbisogno Calorico</h2>
              <div className="form-group">
                <label className="form-label">Peso (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={userInfo.peso}
                  onChange={(e) => setUserInfo({ ...userInfo, peso: e.target.value })}
                  placeholder="es. 65"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Altezza (cm)</label>
                <input
                  type="number"
                  className="form-input"
                  value={userInfo.altezza}
                  onChange={(e) => setUserInfo({ ...userInfo, altezza: e.target.value })}
                  placeholder="es. 170"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Età</label>
                <input
                  type="number"
                  className="form-input"
                  value={userInfo.eta}
                  onChange={(e) => setUserInfo({ ...userInfo, eta: e.target.value })}
                  placeholder="es. 30"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Sesso</label>
                <select
                  className="form-select"
                  value={userInfo.sesso}
                  onChange={(e) => setUserInfo({ ...userInfo, sesso: e.target.value })}
                >
                  <option value="f">Donna</option>
                  <option value="m">Uomo</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Attività Fisica</label>
                <select
                  className="form-select"
                  value={userInfo.attivita}
                  onChange={(e) => setUserInfo({ ...userInfo, attivita: e.target.value })}
                >
                  <option value="sedentario">Sedentario</option>
                  <option value="leggero">Leggero (1-3 gg)</option>
                  <option value="moderato">Moderato (3-5 gg)</option>
                  <option value="attivo">Attivo (6-7 gg)</option>
                  <option value="molto">Molto attivo</option>
                </select>
              </div>
              <button onClick={calcolaTdee} className="btn-calculate">
                Calcola TDEE
              </button>
              {tdee && (
                <div className="result-box">
                  TDEE: <strong>{tdee} kcal/giorno</strong>
                </div>
              )}
            </div>

            {/* Calcolo % Grasso */}
            <div className="section-card">
              <h2 className="section-title">Calcola la tua % di Grasso</h2>
              <p className="instructions">
                Misura in cm. Usa un metro morbido, senza stringere.
              </p>
              <div className="form-group">
                <label className="form-label">Collo (sotto la laringe)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={misurazioni.collo}
                  onChange={(e) => setMisurazioni({ ...misurazioni, collo: e.target.value })}
                  placeholder="es. 35"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Vita (all’ombelico)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={misurazioni.vita}
                  onChange={(e) => setMisurazioni({ ...misurazioni, vita: e.target.value })}
                  placeholder="es. 78"
                />
              </div>
              {userInfo.sesso === "f" && (
                <div className="form-group">
                  <label className="form-label">Fianchi (punto più largo)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-input"
                    value={misurazioni.fianchi}
                    onChange={(e) => setMisurazioni({ ...misurazioni, fianchi: e.target.value })}
                    placeholder="es. 95"
                  />
                </div>
              )}
              <button onClick={calcolaGrasso} className="btn-calculate">
                Calcola % Grasso
              </button>
              {grasso !== null && (
                <div className="result-box">
                  Grasso Corporeo: <strong>{grasso}%</strong>
                </div>
              )}
            </div>

            {/* Macro suggeriti */}
            {tdee && (
              <div className="section-card">
                <h2 className="section-title">Macronutrienti Consigliati</h2>
                <p className="instructions">
                  Per una <strong>ricomposizione corporea efficace</strong>, si consigliano almeno 
                  <strong> 2.0 g di proteine per kg di peso corporeo</strong> al giorno.
                </p>
                <div className="form-group">
                  <label className="form-label">Obiettivo</label>
                  <select
                    className="form-select"
                    value={obiettivo}
                    onChange={(e) => setObiettivo(e.target.value)}
                  >
                    <option value="mantenimento">Mantenimento</option>
                    <option value="deficit">Deficit (dimagrimento)</option>
                    <option value="superfluo">Superfluo (massa)</option>
                  </select>
                </div>
                <div className="macro-box">
                  <div className="macro-item">
                    <div className="macro-label">Proteine</div>
                    <div className="macro-value">{macro.proteine}g</div>
                  </div>
                  <div className="macro-item">
                    <div className="macro-label">Carboidrati</div>
                    <div className="macro-value">{macro.carboidrati}g</div>
                  </div>
                  <div className="macro-item">
                    <div className="macro-label">Grassi</div>
                    <div className="macro-value">{macro.grassi}g</div>
                  </div>
                  <div className="macro-item">
                    <div className="macro-label">Totale Calorie</div>
                    <div className="macro-value">{tdee}</div>
                  </div>
                </div>
                <div className="macro-chart" />
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: 'var(--accent)' }} />
                    Proteine
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: 'var(--secondary)' }} />
                    Carboidrati
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: '#004cbb' }} />
                    Grassi
                  </div>
                </div>
              </div>
            )}

            {/* Convertitore Alimenti */}
            <div className="section-card">
              <h2 className="section-title">Convertitore Alimenti → Macro</h2>
              <div className="converter-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Alimento (es: pollo, avocado)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={alimento}
                    onChange={(e) => setAlimento(e.target.value)}
                    placeholder="es. tonno"
                    list="alimenti-list"
                  />
                  <datalist id="alimenti-list">
                    {Object.keys(alimentiDb).map((nome) => (
                      <option key={nome} value={nome} />
                    ))}
                  </datalist>
                  <div className="suggestions">
                    Sugg: {alimentiSuggeriti}
                  </div>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Quantità (g)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={grammi}
                    onChange={(e) => setGrammi(e.target.value)}
                    placeholder="es. 150"
                  />
                </div>
                <button onClick={convertiAlimento} className="btn-calculate">
                  Converti
                </button>
              </div>
              {risultato && !risultato.errore && (
                <div className="result-box" style={{ marginTop: "1.5rem" }}>
                  <strong>{risultato.nome}</strong>: {risultato.proteine}g P • {risultato.carboidrati}g C • {risultato.grassi}g G
                </div>
              )}
              {risultato?.errore && (
                <div className="result-box" style={{ backgroundColor: '#6c757d', marginTop: "1.5rem" }}>
                  {risultato.errore}
                </div>
              )}
            </div>
          </>
        )}

        {/* Tab Ricette */}
        {activeTab === "ricette" && (
          <div className="section-card">
            <h2 className="section-title">Ricette per Obiettivi Alimentari</h2>
            {Object.entries(tutteLeRicette).map(([tipo, ricetteTipo]) => {
              const ricetta = ricetteTipo[indiceRicette[tipo]];
              return (
                <div key={tipo} className="recipe-card">
                  <div className="recipe-title">{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</div>
                  <div><strong>Colazione:</strong> {ricetta.colazione}</div>
                  <div><strong>Pranzo:</strong> {ricetta.pranzo}</div>
                  <div><strong>Cena:</strong> {ricetta.cena}</div>
                </div>
              );
            })}
            <button onClick={cambiaRicette} className="btn-random">
              🔁 Altra combinazione
            </button>
            <p className="instructions" style={{ marginTop: "1rem" }}>
              Tutte le ricette sono naturali, non processate, adatte al tuo stile di vita.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Nutrition;