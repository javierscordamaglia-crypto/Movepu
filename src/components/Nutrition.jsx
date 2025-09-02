import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Nutrition = ({ setCurrentView }) => {
  // --- Stati per il calcolo calorico ---
  const [userInfo, setUserInfo] = useState({ peso: "", altezza: "", eta: "", sesso: "f", attivita: "sedentario" });
  const [misurazioni, setMisurazioni] = useState({ collo: "", vita: "", fianchi: "" });
  
  // --- Stati per la ricerca e i risultati ---
  const [tdee, setTdee] = useState(null);
  const [grasso, setGrasso] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Per la ricerca Google

  // --- Tab attiva e modale ---
  const [activeTab, setActiveTab] = useState("calcoli");
  const [modalContent, setModalContent] = useState(null); // Per il pop-up delle ricette

  // --- Database Alimenti (Ampliato) ---
  const alimentiDb = {
    pollo: [23, 0, 1.5], uova: [13, 1.1, 11], tonno: [26, 0, 0.5], salmone: [20, 0, 13],
    pettoindisalume: [18, 0, 2], tofu: [8, 2, 4], lenticchie: [9, 20, 0.4], ceci: [19, 61, 6],
    manzo_magro: [26, 0, 5], merluzzo: [18, 0, 0.7], tempeh: [19, 9, 11], proteine_piselli: [80, 1, 5],
    riso: [2.7, 28, 0.3], pane: [8, 49, 3], farro: [15, 72, 2], quinoa: [4.4, 21, 1.9],
    patate: [2, 17, 0.1], pasta_integrale: [13, 64, 2.5], avena: [17, 66, 7], pane_integrale: [13, 41, 3.5],
    avocado: [2, 9, 15], mandorle: [21, 22, 49], noci: [15, 14, 65], olio_oliva: [0, 0, 100],
    cioccolato_fondente: [8, 46, 43], semi_di_chia: [17, 42, 31],
    yogurt: [10, 12, 3], yogurt_greco: [10, 4, 5], formaggialegero: [15, 3, 5],
    fiocchi_di_latte: [11, 3.4, 4.3], parmigiano: [38, 0, 29], latte_mandorla: [0.4, 0.6, 1.1],
    broccoletti: [2.8, 7, 0.4], spinaci: [2.9, 3.6, 0.4], mela: [0.3, 14, 0.2],
    banana: [1.1, 23, 0.3], pomodoro: [0.9, 3.9, 0.2], carote: [0.9, 10, 0.2],
    latte_ps: [3.3, 5, 1.6], cereali_integrali: [12, 65, 5], fesa_di_tacchino: [24, 0, 1.5],
    pesto: [5, 4, 50], funghi: [3, 3.3, 0.3], frutti_di_bosco: [0.7, 14, 0.3], pancetta: [14, 1.4, 42],
    burro: [0.9, 0.1, 81], maionese: [1.1, 0.6, 75]
  };

  // --- Calcola TDEE ---
  const calcolaTdee = () => {
    const p = parseFloat(userInfo.peso), a = parseFloat(userInfo.altezza), e = parseFloat(userInfo.eta);
    if (isNaN(p) || isNaN(a) || isNaN(e) || p <= 0 || a <= 0 || e <= 0) { setTdee(null); return; }
    let bmr = userInfo.sesso === "m" ? 88.362 + 13.397 * p + 4.799 * a - 5.677 * e : 447.593 + 9.247 * p + 3.098 * a - 4.330 * e;
    const f = { sedentario: 1.2, leggero: 1.375, moderato: 1.55, attivo: 1.725, molto: 1.9 };
    setTdee(Math.round(bmr * f[userInfo.attivita]));
  };

  // --- Calcola % grasso ---
  const calcolaGrasso = () => {
    const c = parseFloat(misurazioni.collo), v = parseFloat(misurazioni.vita), f = parseFloat(misurazioni.fianchi), h = parseFloat(userInfo.altezza);
    if (isNaN(c) || isNaN(v) || isNaN(h) || c <= 0 || v <= 0 || h <= 0 || (userInfo.sesso === "f" && (isNaN(f) || f <= 0))) { setGrasso(null); return; }
    let pgrasso;
    if (userInfo.sesso === "m") {
      if (v - c <= 0) { setGrasso(null); return; }
      pgrasso = 495 / (1.0324 - 0.19077 * Math.log10(v - c) + 0.15456 * Math.log10(h)) - 450;
    } else {
      if (v + f - c <= 0) { setGrasso(null); return; }
      pgrasso = 495 / (1.29579 - 0.35004 * Math.log10(v + f - c) + 0.221 * Math.log10(h)) - 450;
    }
    setGrasso(parseFloat(pgrasso.toFixed(1)));
  };
  
  // --- Ricerca Macro su Google ---
  const handleSearchMacro = () => {
    if (searchTerm.trim() !== "") {
      const query = encodeURIComponent(`${searchTerm} valori nutrizionali`);
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }
  };

  // --- Funzione per calcolare i macro di una singola ricetta ---
  const calcolaMacroRicetta = (ingredienti) => {
    if (!ingredienti) return { p: 0, c: 0, f: 0, kcal: 0 };
    let p = 0, c = 0, f = 0;
    ingredienti.forEach(ing => {
      const data = alimentiDb[ing.alimento];
      if (data) {
        const factor = ing.grammi / 100;
        p += data[0] * factor;
        c += data[1] * factor;
        f += data[2] * factor;
      }
    });
    const kcal = (p * 4) + (c * 4) + (f * 9);
    return { p: Math.round(p), c: Math.round(c), f: Math.round(f), kcal: Math.round(kcal) };
  };

  // --- Logica per la tab "Idee Ricette" con MACRO ---
  const ideeRicetteDb = {
    classica: [
        { 
          colazione: { titolo: "Latte e Cereali Integrali", ingredienti: [{alimento: 'latte_ps', grammi: 200}, {alimento: 'cereali_integrali', grammi: 50}, {alimento: 'banana', grammi: 100}], dettagli: "Versa il latte in una tazza. Aggiungi i cereali integrali e la banana a pezzi." }, 
          pranzo: { titolo: "Pasta al Pomodoro e Pollo", ingredienti: [{alimento: 'pasta_integrale', grammi: 80}, {alimento: 'pollo', grammi: 150}, {alimento: 'pomodoro', grammi: 200}, {alimento: 'olio_oliva', grammi: 10}], dettagli: "Cuoci la pasta. Salta il petto di pollo a cubetti in padella con l'olio. Aggiungi la salsa di pomodoro e servi con la pasta." }, 
          cena: { titolo: "Salmone al Forno con Patate", ingredienti: [{alimento: 'salmone', grammi: 180}, {alimento: 'patate', grammi: 250}, {alimento: 'olio_oliva', grammi: 10}], dettagli: "Inforna il salmone con le patate a spicchi a 200°C per 20 minuti. Condisci con rosmarino e olio." } 
        },
        { 
          colazione: { titolo: "Toast con Uova e Succo", ingredienti: [{alimento: 'pane_integrale', grammi: 80}, {alimento: 'uova', grammi: 120}], dettagli: "Prepara due uova all'occhio di bue o strapazzate. Servile su due fette di pane integrale tostato. Accompagna con un bicchiere di succo d'arancia fresco." }, 
          pranzo: { titolo: "Panino con Tacchino", ingredienti: [{alimento: 'pane_integrale', grammi: 100}, {alimento: 'fesa_di_tacchino', grammi: 100}, {alimento: 'formaggialegero', grammi: 30}], dettagli: "Farcisci due fette di pane integrale con la fesa di tacchino, formaggio light, lattuga e pomodoro." }, 
          cena: { titolo: "Bistecca e Riso", ingredienti: [{alimento: 'manzo_magro', grammi: 180}, {alimento: 'riso', grammi: 70}, {alimento: 'broccoletti', grammi: 200}], dettagli: "Cuoci una bistecca di manzo magro alla griglia. Servila con riso basmati e una porzione di broccoli al vapore." } 
        }
    ],
    vegetariana: [
        { 
          colazione: { titolo: "Yogurt Greco e Mandorle", ingredienti: [{alimento: 'yogurt_greco', grammi: 200}, {alimento: 'mandorle', grammi: 20}], dettagli: "Unisci lo yogurt greco con le mandorle e un cucchiaino di miele o sciroppo d'acero." }, 
          pranzo: { titolo: "Quinoa con Lenticchie", ingredienti: [{alimento: 'quinoa', grammi: 70}, {alimento: 'lenticchie', grammi: 150}, {alimento: 'spinaci', grammi: 100}], dettagli: "Cuoci la quinoa. Aggiungi le lenticchie precotte e gli spinaci freschi. Condisci con limone e olio." }, 
          cena: { titolo: "Tofu Saltato con Verdure", ingredienti: [{alimento: 'tofu', grammi: 200}, {alimento: 'olio_oliva', grammi: 10}], dettagli: "Taglia il tofu a cubetti e saltalo in padella con verdure miste (es. zucchine, peperoni) e salsa di soia." } 
        },
        { 
          colazione: { titolo: "Omelette con Funghi", ingredienti: [{alimento: 'uova', grammi: 120}, {alimento: 'funghi', grammi: 150}, {alimento: 'parmigiano', grammi: 20}], dettagli: "Sbatti due uova e cuocile in una padella antiaderente con i funghi champignon trifolati e una spolverata di parmigiano." }, 
          pranzo: { titolo: "Pasta di Ceci al Pesto", ingredienti: [{alimento: 'ceci', grammi: 80}, {alimento: 'pesto', grammi: 50}], dettagli: "Cuoci la pasta di ceci. Condiscila con pesto e pomodorini freschi." }, 
          cena: { titolo: "Fiocchi di Latte e Frutta", ingredienti: [{alimento: 'fiocchi_di_latte', grammi: 200}, {alimento: 'frutti_di_bosco', grammi: 100}, {alimento: 'noci', grammi: 20}], dettagli: "Servi i fiocchi di latte in una ciotola con i frutti di bosco e le noci tritate." } 
        }
    ],
    vegano: [
        { 
          colazione: { titolo: "Porridge di Avena e Noci", ingredienti: [{alimento: 'avena', grammi: 50}, {alimento: 'latte_mandorla', grammi: 200}, {alimento: 'noci', grammi: 20}], dettagli: "Cuoci i fiocchi d'avena nel latte di mandorla. Guarnisci con le noci e frutta a piacere." }, 
          pranzo: { titolo: "Buddha Bowl con Ceci", ingredienti: [{alimento: 'riso', grammi: 70}, {alimento: 'ceci', grammi: 150}, {alimento: 'avocado', grammi: 50}], dettagli: "Crea una bowl con una base di riso integrale, ceci, verdure crude (carote, cetrioli) e avocado. Condisci con tahini." }, 
          cena: { titolo: "Curry di Ceci con Riso", ingredienti: [{alimento: 'ceci', grammi: 200}, {alimento: 'riso', grammi: 80}], dettagli: "Prepara un curry veloce scaldando i ceci con 150ml di latte di cocco, curry in polvere e spinaci. Servi con riso basmati." } 
        },
        {
          colazione: { titolo: "Smoothie Proteico", ingredienti: [{alimento: 'proteine_piselli', grammi: 30}, {alimento: 'banana', grammi: 100}, {alimento: 'latte_mandorla', grammi: 250}], dettagli: "Frulla le proteine in polvere con la banana e il latte di mandorla fino ad ottenere un composto omogeneo." },
          pranzo: { titolo: "Insalata di Tofu e Semi", ingredienti: [{alimento: 'tofu', grammi: 150}, {alimento: 'spinaci', grammi: 100}, {alimento: 'semi_di_chia', grammi: 15}], dettagli: "Taglia il tofu a cubetti e griglialo. Uniscilo agli spinaci freschi e condisci con olio, limone e semi di chia." },
          cena: { titolo: "Zuppa di Lenticchie", ingredienti: [{alimento: 'lenticchie', grammi: 200}, {alimento: 'carote', grammi: 100}], dettagli: "Prepara una zuppa cuocendo le lenticchie con carote, sedano e cipolla. Aggiungi brodo vegetale e spezie a piacere." }
        }
    ],
    chetogenica: [
        { 
          colazione: { titolo: "Uova e Avocado", ingredienti: [{alimento: 'uova', grammi: 180}, {alimento: 'avocado', grammi: 100}, {alimento: 'pancetta', grammi: 50}], dettagli: "Sbatti 3 uova e cuocile in padella con una noce di burro. Servi con mezzo avocado a fette e 2 fette di pancetta croccante." }, 
          pranzo: { titolo: "Insalata di Tonno", ingredienti: [{alimento: 'tonno', grammi: 150}, {alimento: 'maionese', grammi: 30}], dettagli: "Unisci il tonno sott'olio (sgocciolato), olive verdi, un gambo di sedano a pezzi e maionese. Servi su foglie di lattuga." }, 
          cena: { titolo: "Pollo e Broccoli", ingredienti: [{alimento: 'pollo', grammi: 200}, {alimento: 'broccoletti', grammi: 200}, {alimento: 'burro', grammi: 15}], dettagli: "Griglia il petto di pollo. Cuoci i broccoli al vapore e condiscili con burro, sale e pepe." } 
        },
        {
          colazione: { titolo: "Salmone e Avocado", ingredienti: [{alimento: 'salmone', grammi: 100}, {alimento: 'avocado', grammi: 100}], dettagli: "Servi 100g di salmone affumicato con mezzo avocado a fette. Condisci con succo di limone e pepe nero." },
          pranzo: { titolo: "Bistecca e Spinaci", ingredienti: [{alimento: 'manzo_magro', grammi: 200}, {alimento: 'spinaci', grammi: 200}, {alimento: 'burro', grammi: 10}], dettagli: "Cuoci la bistecca alla griglia. Salta gli spinaci in padella con una noce di burro e aglio." },
          cena: { titolo: "Merluzzo al Forno", ingredienti: [{alimento: 'merluzzo', grammi: 200}, {alimento: 'pomodoro', grammi: 100}, {alimento: 'olio_oliva', grammi: 15}], dettagli: "Inforna il filetto di merluzzo con pomodorini, olive e un filo d'olio a 180°C per 15-20 minuti." }
        }
    ],
    celiaca: [
        { 
          colazione: { titolo: "Yogurt con Frutta e Semi", ingredienti: [{alimento: 'yogurt', grammi: 200}, {alimento: 'mela', grammi: 150}, {alimento: 'semi_di_chia', grammi: 10}], dettagli: "In una ciotola, unisci lo yogurt (senza glutine), la frutta fresca e un cucchiaio di semi di chia." }, 
          pranzo: { titolo: "Riso con Salmone", ingredienti: [{alimento: 'riso', grammi: 80}, {alimento: 'salmone', grammi: 150}], dettagli: "Cuoci il riso. Salta in padella il salmone a cubetti con asparagi. Unisci tutto e condisci con olio e limone." }, 
          cena: { titolo: "Pollo con Patate Dolci", ingredienti: [{alimento: 'pollo', grammi: 200}, {alimento: 'patate', grammi: 250}], dettagli: "Inforna il petto di pollo con le patate dolci a cubetti a 200°C per circa 25 minuti." } 
        },
        {
          colazione: { titolo: "Frullato di Banana", ingredienti: [{alimento: 'banana', grammi: 150}, {alimento: 'latte_mandorla', grammi: 200}], dettagli: "Frulla la banana con latte di mandorla (o altro latte vegetale). Aggiungi proteine in polvere certificate senza glutine se desideri." },
          pranzo: { titolo: "Insalata di Quinoa e Ceci", ingredienti: [{alimento: 'quinoa', grammi: 80}, {alimento: 'ceci', grammi: 150}], dettagli: "Prepara un'insalata unendo la quinoa cotta, i ceci, pomodorini e mais. Condisci con olio e aceto." },
          cena: { titolo: "Tacchino alla Griglia", ingredienti: [{alimento: 'fesa_di_tacchino', grammi: 200}, {alimento: 'patate', grammi: 200}], dettagli: "Griglia la fesa di tacchino. Servi con un contorno di patate al vapore o al forno." }
        }
    ],
  };
  const [indiceRicette, setIndiceRicette] = useState({ classica: 0, vegetariana: 0, vegano: 0, chetogenica: 0, celiaca: 0 });
  const cambiaSingolaRicetta = (tipo) => {
    setIndiceRicette(prev => {
        const nuovoIndice = (prev[tipo] + 1) % ideeRicetteDb[tipo].length;
        return { ...prev, [tipo]: nuovoIndice };
    });
  };


  return (
    <>
      <style>{`
         @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
         :root { --primary: #0066ff; --primary-dark: #004cbb; --secondary: #ff6b00; --accent: #00e080; --dark: #121826; --light: #ffffff; --gray: #e0e6f0; --shadow-md: 0 10px 25px rgba(0, 102, 255, 0.2); --shadow-lg: 0 20px 40px rgba(0, 102, 255, 0.25); --border: 1px solid rgba(0, 102, 255, 0.2); --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); --radius-lg: 2rem; --radius-md: 1.25rem; --radius-sm: 0.75rem; }
         
         body { 
            margin: 0; 
            font-family: 'Poppins', sans-serif; 
            color: var(--light); 
            background: linear-gradient(135deg, #0f1b3a 0%, #1a365d 50%, #0066ff 100%); 
            min-height: 100%; 
            background-attachment: fixed; 
            overflow-x: hidden; 
            -webkit-user-select: none; 
            user-select: none; 
         }

         .nutrition-container { 
            padding: 1.5rem; 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            position: relative; 
         }

         .nutrition-header { width: 100%; max-width: 1200px; margin-bottom: 2.5rem; padding: 1.8rem 2.5rem; background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(20px); border: var(--border); border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem; }
         .welcome-title { font-size: 2.2rem; font-weight: 800; margin: 0; }
         .back-button { padding: 0.75rem 1.75rem; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white; font-weight: 700; border: none; border-radius: var(--radius-md); cursor: pointer; box-shadow: 0 6px 16px rgba(0, 102, 255, 0.3); transition: var(--transition); text-transform: uppercase; }
         .back-button:hover { transform: translateY(-3px) scale(1.04); box-shadow: 0 8px 20px rgba(0, 102, 255, 0.4); }
         .tabs { display: flex; gap: 0.5rem; margin-bottom: 2rem; width: 100%; max-width: 1000px; justify-content: center; }
         .tab { padding: 0.8rem 1.5rem; background: rgba(255, 255, 255, 0.1); color: var(--gray); border: none; border-radius: var(--radius-md) var(--radius-md) 0 0; cursor: pointer; font-weight: 600; transition: var(--transition); }
         .tab.active { background: var(--primary); color: white; }

         .main-content-wrapper { 
            width: 100%; 
            max-width: 1000px; 
         }

         .main-content-tab { width: 100%; display: flex; flex-direction: column; align-items: center; padding-top: 1px; padding-bottom: 1px; }
         .horizontal-scroll-wrapper { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; width: 100%; padding-bottom: 0.5rem; scrollbar-width: none; }
         .horizontal-scroll-wrapper::-webkit-scrollbar { display: none; }
         .horizontal-scroll-wrapper > .section-card { flex-shrink: 0; width: calc(100% - 2rem); margin: 0 1rem; scroll-snap-align: center; box-sizing: border-box; margin-bottom: 0; }
         .section-card { width: 100%; max-width: 1000px; background: rgba(255, 255, 255, 0.12); backdrop-filter: blur(16px); border: var(--border); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); padding: 2.2rem; margin-bottom: 2rem; transition: var(--transition); overflow: hidden; }
         .section-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); }
         .section-title { font-size: 1.9rem; font-weight: 800; color: var(--light); margin-bottom: 1.5rem; text-align: center; position: relative; }
         .section-title::after { content: ''; position: absolute; left: 50%; bottom: -8px; transform: translateX(-50%); width: 60px; height: 4px; background: linear-gradient(90deg, var(--secondary), var(--accent)); border-radius: 2px; }
         .form-group { margin-bottom: 1.2rem; display: flex; flex-direction: column; gap: 0.4rem; }
         .form-label { font-size: 1.1rem; color: var(--gray); font-weight: 500; }
         .form-input, .form-select { padding: 0.8rem 1rem; border-radius: var(--radius-sm); border: 1px solid rgba(255, 255, 255, 0.2); background: rgba(255, 255, 255, 0.1); color: var(--light); font-size: 1rem; outline: none; transition: var(--transition); }
         .form-input:focus, .form-select:focus { border-color: var(--secondary); background: rgba(255, 255, 255, 0.15); box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.2); }
         .form-select option { background: #1a365d; color: white; }
         .btn-calculate { padding: 0.8rem 2rem; background: linear-gradient(135deg, var(--secondary), #cc5a00); color: white; font-weight: 700; border: none; border-radius: var(--radius-md); cursor: pointer; box-shadow: 0 6px 16px rgba(255, 107, 0, 0.3); transition: var(--transition); align-self: flex-start; margin-top: 1rem; }
         .btn-calculate:hover { transform: translateY(-3px) scale(1.04); box-shadow: 0 8px 20px rgba(255, 107, 0, 0.4); }
         .result-box { background: rgba(0, 0, 0, 0.2); padding: 1.5rem; border-radius: var(--radius-md); margin-top: 1.5rem; text-align: center; font-size: 1.3rem; font-weight: 700; color: var(--accent); }
         .instructions { font-size: 0.9rem; color: var(--gray); margin-top: 0.5rem; line-height: 1.5; font-style: italic; }
         .scroll-hint-container { width: 100%; max-width: 1000px; display: flex; justify-content: center; padding: 0.5rem 0; margin-top: 1rem; }
         .scroll-hint-track { width: 60px; height: 3px; background: rgba(255, 255, 255, 0.15); border-radius: 2px; position: relative; overflow: hidden; }
         .scroll-hint-thumb { width: 30%; height: 100%; background: var(--secondary); border-radius: 2px; position: absolute; left: 0%; animation: scrollHint 3s infinite ease-in-out; }
         @keyframes scrollHint { 0% { transform: translateX(0%);} 50% { transform: translateX(230%);} 51% { transform: translateX(-130%);} 100% { transform: translateX(0%);} }
         .recipe-idea-card { background: rgba(255, 255, 255, 0.1); padding: 1.2rem; border-radius: var(--radius-md); margin-bottom: 1rem; border: 1px solid rgba(255, 255, 255, 0.1); }
         .recipe-idea-title { font-weight: 700; color: var(--accent); margin-bottom: 0.5rem; text-transform: capitalize; }
         .recipe-meal { cursor: pointer; transition: var(--transition); padding: 0.4rem 0.6rem; border-radius: var(--radius-sm); margin: 0.2rem 0; }
         .recipe-meal:hover { color: var(--secondary); background: rgba(255, 255, 255, 0.1); }
         .info-icon { display: inline-block; margin-left: 8px; color: var(--primary); font-weight: bold; transition: var(--transition); }
         .recipe-meal:hover .info-icon { transform: scale(1.2); color: var(--accent); }
         .btn-random { padding: 0.6rem 1.5rem; background: linear-gradient(135deg, #6c5ce7, #a29bfe); color: white; border: none; border-radius: var(--radius-sm); cursor: pointer; font-weight: 600; margin-top: 1rem; transition: var(--transition); }
         .btn-random:hover { transform: translateY(-2px); box-shadow: 0 6px 14px rgba(108, 92, 231, 0.3); }
         .modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 1rem; }
         .modal-content { background: var(--dark); border-radius: var(--radius-md); padding: 2rem; width: 100%; max-width: 500px; border: var(--border); box-shadow: var(--shadow-lg); }
         .modal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 1rem; margin-bottom: 1rem; }
         .modal-header h3 { margin: 0; color: var(--accent); }
         .close-button { background: none; border: none; color: white; font-size: 2rem; cursor: pointer; }
         .modal-body p { margin: 0; line-height: 1.6; color: var(--gray); }
         .modal-macros { margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border); text-align: center; }
         .modal-macros h4 { margin: 0 0 0.8rem 0; color: var(--secondary); }
         .modal-macros-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem 1rem; color: var(--light); }
         
         @media (min-width: 769px) { 
            .horizontal-scroll-wrapper { 
                display: block; 
                overflow-x: visible; 
                scroll-snap-type: none; 
            } 
            .horizontal-scroll-wrapper > .section-card { 
                width: 100%; 
                margin: 0 auto 2rem auto; 
            } 
            .scroll-hint-container { 
                display: none; 
            } 
         }

         @media (max-width: 768px) { 
            .welcome-title { font-size: 1.8rem; text-align: center; width: 100%; } 
            .back-button { width: 100%; } 
            .tabs { flex-wrap: wrap; } 
            .tab { flex: 1; text-align: center; } 
            .section-title { font-size: 1.5rem; } 
            .btn-calculate { align-self: stretch; } 
            .horizontal-scroll-wrapper > .section-card { width: calc(100% - 1rem); margin: 0 0.5rem; padding: 1.5rem; } 
         }
      `}</style>

      <div className="nutrition-container">
        <div className="nutrition-header">
          <h1 className="welcome-title">Nutrizione Personalizzata</h1>
          <button onClick={() => setCurrentView("dashboard")} className="back-button">Indietro</button>
        </div>

        <div className="tabs">
          <button className={`tab ${activeTab === "calcoli" ? "active" : ""}`} onClick={() => setActiveTab("calcoli")}>Calcoli</button>
          <button className={`tab ${activeTab === "idee" ? "active" : ""}`} onClick={() => setActiveTab("idee")}>Idee Ricette</button>
        </div>

        <div className="main-content-wrapper">
          <AnimatePresence mode="wait">
            {activeTab === "calcoli" && (
              <motion.div key="calcoli" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="main-content-tab">
                <div className="horizontal-scroll-wrapper">
                  <div className="section-card">
                    <h2 className="section-title">Calcola il tuo Fabbisogno</h2>
                    <div className="form-group"><label className="form-label">Peso (kg)</label><input type="number" step="0.1" className="form-input" value={userInfo.peso} onChange={(e) => setUserInfo({ ...userInfo, peso: e.target.value })} placeholder="es. 65"/></div>
                    <div className="form-group"><label className="form-label">Altezza (cm)</label><input type="number" className="form-input" value={userInfo.altezza} onChange={(e) => setUserInfo({ ...userInfo, altezza: e.target.value })} placeholder="es. 170"/></div>
                    <div className="form-group"><label className="form-label">Età</label><input type="number" className="form-input" value={userInfo.eta} onChange={(e) => setUserInfo({ ...userInfo, eta: e.target.value })} placeholder="es. 30"/></div>
                    <div className="form-group"><label className="form-label">Sesso</label><select className="form-select" value={userInfo.sesso} onChange={(e) => setUserInfo({ ...userInfo, sesso: e.target.value })}><option value="f">Donna</option><option value="m">Uomo</option></select></div>
                    <div className="form-group"><label className="form-label">Attività Fisica</label><select className="form-select" value={userInfo.attivita} onChange={(e) => setUserInfo({ ...userInfo, attivita: e.target.value })}><option value="sedentario">Sedentario</option><option value="leggero">Leggero</option><option value="moderato">Moderato</option><option value="attivo">Attivo</option><option value="molto">Molto attivo</option></select></div>
                    <button onClick={calcolaTdee} className="btn-calculate">Calcola TDEE</button>
                    {tdee && <div className="result-box">TDEE: <strong>{tdee} kcal/giorno</strong></div>}
                  </div>
                  <div className="section-card">
                    <h2 className="section-title">Calcola la tua % di Grasso</h2>
                    <div className="form-group"><label className="form-label">Collo (cm)</label><input type="number" step="0.1" className="form-input" value={misurazioni.collo} onChange={(e) => setMisurazioni({ ...misurazioni, collo: e.target.value })} placeholder="es. 35"/></div>
                    <div className="form-group"><label className="form-label">Vita (cm)</label><input type="number" step="0.1" className="form-input" value={misurazioni.vita} onChange={(e) => setMisurazioni({ ...misurazioni, vita: e.target.value })} placeholder="es. 78"/></div>
                    {userInfo.sesso === "f" && <div className="form-group"><label className="form-label">Fianchi (cm)</label><input type="number" step="0.1" className="form-input" value={misurazioni.fianchi} onChange={(e) => setMisurazioni({ ...misurazioni, fianchi: e.target.value })} placeholder="es. 95"/></div>}
                    <button onClick={calcolaGrasso} className="btn-calculate">Calcola % Grasso</button>
                    {grasso !== null && <div className="result-box">Grasso Corporeo: <strong>{grasso}%</strong></div>}
                  </div>
                   <div className="section-card">
                    <h2 className="section-title">Cerca Macro Alimenti</h2>
                    <p className="instructions">Cerca online i valori nutrizionali di qualsiasi alimento.</p>
                    <div className="form-group"><label className="form-label">Nome Alimento</label><input type="text" className="form-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="es. Mirtilli"/></div>
                    <button onClick={handleSearchMacro} className="btn-calculate" style={{alignSelf: 'stretch'}}>Cerca su Google</button>
                  </div>
                </div>
                <div className="scroll-hint-container"><div className="scroll-hint-track"><div className="scroll-hint-thumb"></div></div></div>
              </motion.div>
            )}

            {activeTab === "idee" && (
                <motion.div key="idee" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="main-content-tab">
                    <div className="section-card">
                        <h2 className="section-title">Idee Rapide per Pasti</h2>
                        <p className="instructions" style={{textAlign: 'center', marginBottom: '1.5rem'}}>Cerca ispirazione per i tuoi pasti. Clicca su un pasto per vedere i dettagli.</p>
                        {Object.entries(ideeRicetteDb).map(([tipo, ricetteTipo]) => {
                            const ricetta = ricetteTipo[indiceRicette[tipo]];
                            return (
                                <div key={tipo} className="recipe-idea-card">
                                    <div className="recipe-idea-title">{tipo}</div>
                                    <div className="recipe-meal" onClick={() => setModalContent(ricetta.colazione)}>
                                      <strong>Colazione:</strong> {ricetta.colazione.titolo}
                                      <span className="info-icon">ⓘ</span>
                                    </div>
                                    <div className="recipe-meal" onClick={() => setModalContent(ricetta.pranzo)}>
                                      <strong>Pranzo:</strong> {ricetta.pranzo.titolo}
                                      <span className="info-icon">ⓘ</span>
                                    </div>
                                    <div className="recipe-meal" onClick={() => setModalContent(ricetta.cena)}>
                                      <strong>Cena:</strong> {ricetta.cena.titolo}
                                      <span className="info-icon">ⓘ</span>
                                    </div>
                                    <button onClick={() => cambiaSingolaRicetta(tipo)} className="btn-random">🔁 Nuova Idea</button>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <AnimatePresence>
        {modalContent && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalContent(null)}>
            <motion.div className="modal-content" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{modalContent.titolo}</h3>
                <button onClick={() => setModalContent(null)} className="close-button">&times;</button>
              </div>
              <div className="modal-body">
                <p>{modalContent.dettagli}</p>
                <div className="modal-macros">
                    <h4>Valori Nutrizionali (stima)</h4>
                    <div className="modal-macros-grid">
                        <span>Calorie: <strong>{calcolaMacroRicetta(modalContent.ingredienti).kcal} kcal</strong></span>
                        <span>Proteine: <strong>{calcolaMacroRicetta(modalContent.ingredienti).p} g</strong></span>
                        <span>Carboidrati: <strong>{calcolaMacroRicetta(modalContent.ingredienti).c} g</strong></span>
                        <span>Grassi: <strong>{calcolaMacroRicetta(modalContent.ingredienti).f} g</strong></span>
                    </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nutrition;
