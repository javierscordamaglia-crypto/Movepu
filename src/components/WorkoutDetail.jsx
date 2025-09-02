import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Dati Statici del Programma ---
// Definizione delle fasce elastiche con il loro peso e emoji rappresentativa.
const fasce = {
  verde: { peso: "2,27 kg", emoji: "🟢" },
  blu: { peso: "4,54 kg", emoji: "🔵" },
  gialla: { peso: "9,07 kg", emoji: "🟡" },
  rossa: { peso: "13,62 kg", emoji: "🔴" },
  nera: { peso: "18,16 kg", emoji: "⚫" },
};

// Elenco degli esercizi di riscaldamento consigliati.
const warmUpExercises = [
  "Jumping Jack (leggeri) – 1 min",
  "Cerchi con le braccia – 30 sec avanti / 30 sec indietro",
  "World’s Greatest Stretch – 30 sec per lato",
  "Bodyweight Squat – 10 rip",
  "Swing della gamba (laterale e posteriore) – 10x per gamba",
  "Glute Bridge con fascia verde – 10 rip (per attivare i glutei)",
];

// Elenco degli esercizi di defaticamento consigliati.
const coolDownExercises = [
  "Allungamento quadricipiti – 30 sec per gamba",
  "Allungamento flessori (hamstring) – 30 sec per gamba",
  "Piriforme stretch (in posizione incrociata) – 30 sec per lato",
  "Cat-Cow (micio-mucca) – 1 min",
  "Respirazione consapevole (addominale) – 1 min",
];

// Funzione per generare l'intero programma di allenamento di 12 settimane.
// La logica è divisa in 3 fasi (4 settimane ciascuna), con progressione degli esercizi.
// Ho aggiunto suggerimenti dettagliati sul posizionamento della fascia e sulla scelta del peso.
const generateProgramData = () => {
  const allWeeks = [];

  // FASE 1: Settimane 1-4 - Focus sui fondamentali e l'attivazione.
  for (let i = 1; i <= 4; i++) {
    const weekNum = i;
    let squatFascia = "verde";
    let ponteFascia = "gialla";
    let sideLegRaiseFascia = "verde";
    if (weekNum >= 3) {
      ponteFascia = "blu";
      sideLegRaiseFascia = "blu";
    }
    allWeeks.push({
      settimana: weekNum,
      fase: "Fase 1 – Fondamentali & Attivazione",
      allenamenti: [
        {
          giorno: "Lunedì – Gambe + Glutei",
          esercizi: [
            {
              nome: "Squat con fascia", serie: 3, ripetizioni: 12, fascia: squatFascia, pausa: 60,
              suggerimento: "YouTube: Squat con fascia attivazione glutei",
              bandPlacement: "Posiziona la fascia appena sopra le ginocchia. Mantieni la tensione spingendo le ginocchia verso l'esterno per attivare i glutei.",
              bandSuggestionDetail: `Per iniziare, usa la fascia ${fasce[squatFascia].emoji} ${squatFascia} (${fasce[squatFascia].peso}). Se l'esecuzione è facile e controllata, puoi passare a una fascia più resistente come la blu per aumentare l'intensità.`
            },
            {
              nome: "Affondo statico", serie: 3, ripetizioni: 10, fascia: "blu", pausa: 60,
              suggerimento: "YouTube: Affondo statico con fascia",
              bandPlacement: "Posiziona la fascia appena sopra le ginocchia. Assicurati che non scivoli durante l'esercizio.",
              bandSuggestionDetail: `La fascia ${fasce["blu"].emoji} blu (${fasce["blu"].peso}) è ideale per questo esercizio, fornendo una buona resistenza senza compromettere la forma. Concentrati sulla stabilità.`
            },
            {
              nome: "Ponte con fascia", serie: 3, ripetizioni: 15, fascia: ponteFascia, pausa: 60,
              suggerimento: "YouTube: Ponte con fascia glutei",
              bandPlacement: "Posiziona la fascia appena sopra le ginocchia. Premi attivamente le ginocchia verso l'esterno per coinvolgere i glutei medi.",
              bandSuggestionDetail: `Inizia con la fascia ${fasce[ponteFascia].emoji} ${ponteFascia} (${fasce[ponteFascia].peso}). Se l'attivazione è insufficiente o troppo facile, passa alla rossa (${fasce["rossa"].peso}).`
            },
            {
              nome: "Side leg raise", serie: 3, ripetizioni: 15, fascia: sideLegRaiseFascia, pausa: 45,
              suggerimento: "YouTube: Side leg raise con fascia",
              bandPlacement: "Posiziona la fascia attorno alle caviglie o appena sopra le ginocchia, a seconda del livello di difficoltà desiderato.",
              bandSuggestionDetail: `La fascia ${fasce[sideLegRaiseFascia].emoji} ${sideLegRaiseFascia} (${fasce[sideLegRaiseFascia].peso}) è adatta per questo esercizio. Per un maggiore isolamento, usa la fascia attorno alle caviglie.`
            },
            {
              nome: "Bird Dog con fascia", serie: 3, ripetizioni: 10, fascia: "verde", pausa: 45,
              suggerimento: "YouTube: Bird Dog con fascia",
              bandPlacement: "Posiziona la fascia attorno alle caviglie, assicurandoti che sia tesa tra le gambe.",
              bandSuggestionDetail: `La fascia ${fasce["verde"].emoji} verde (${fasce["verde"].peso}) offre una resistenza leggera, perfetta per mantenere la stabilità del core e migliorare la coordinazione senza eccessivo stress.`
            },
          ],
        },
        {
          giorno: "Martedì – Superiori + Core",
          esercizi: [
            {
              nome: "Push-up (ginocchia o muro)", serie: 3, ripetizioni: 8, fascia: null, pausa: 60,
              suggerimento: "YouTube: Push-up principianti",
              bandPlacement: "Nessuna fascia richiesta.",
              bandSuggestionDetail: "Questo esercizio non prevede l'uso della fascia. Concentrati sulla forma corretta e sulla progressione verso i push-up standard."
            },
            {
              nome: "Remata con fascia", serie: 3, ripetizioni: 12, fascia: "blu", pausa: 60,
              suggerimento: "YouTube: Remata con fascia",
              bandPlacement: "Siediti con le gambe tese, avvolgi la fascia attorno ai piedi e afferra le estremità con le mani. Oppure, puoi legare la fascia a un punto fisso davanti a te e tirarla.",
              bandSuggestionDetail: `La fascia ${fasce["blu"].emoji} blu (${fasce["blu"].peso}) è un ottimo punto di partenza. Assicurati di mantenere la schiena dritta e di tirare con i dorsali.`
            },
            {
              nome: "Plank con fascia", serie: 3, ripetizioni: 20, fascia: "verde", pausa: 45,
              suggerimento: "YouTube: Plank con fascia",
              bandPlacement: "Posiziona la fascia appena sopra le ginocchia. Spingi attivamente le ginocchia verso l'esterno.",
              bandSuggestionDetail: `La fascia ${fasce["verde"].emoji} verde (${fasce["verde"].peso}) aggiunge una leggera resistenza che intensifica l'attivazione del core e dei glutei, migliorando la stabilità generale.`
            },
            {
              nome: "Shoulder press con fascia", serie: 3, ripetizioni: 12, fascia: "blu", pausa: 60,
              suggerimento: "YouTube: Shoulder press con fascia",
              bandPlacement: "Metti i piedi sulla fascia, larghezza spalle, afferrando le estremità con le mani all'altezza delle spalle, palmi in avanti. Premi sopra la testa.",
              bandSuggestionDetail: `Usa la fascia ${fasce["blu"].emoji} blu (${fasce["blu"].peso}). Le fasce da 60 cm sono usabili per questo esercizio se ti posizioni sopra di esse. Per una resistenza maggiore, puoi raddoppiare la fascia o usare una più spessa.`
            },
            {
              nome: "Dead Bug con fascia", serie: 3, ripetizioni: 12, fascia: "verde", pausa: 45,
              suggerimento: "YouTube: Dead Bug con fascia",
              bandPlacement: "Posiziona la fascia attorno alle caviglie o sotto la pianta dei piedi per un'estensione più controllata.",
              bandSuggestionDetail: `La fascia ${fasce["verde"].emoji} verde (${fasce["verde"].peso}) è ottima per iniziare a sentire la resistenza senza compromettere la forma. Mantiene il core attivo durante il movimento.`
            },
          ],
        },
        {
          giorno: "Giovedì – Gambe + Core",
          esercizi: [
            {
              nome: "Side squat (affondo laterale)", serie: 3, ripetizioni: 10, fascia: "blu", pausa: 60,
              suggerimento: "YouTube: Side squat esecuzione",
              bandPlacement: "Posiziona la fascia appena sopra le ginocchia. Mantieni la tensione costante.",
              bandSuggestionDetail: `La fascia ${fasce["blu"].emoji} blu (${fasce["blu"].peso}) è ideale per aggiungere resistenza ai glutei e all'interno coscia. Assicurati di mantenere il busto eretto.`
            },
            {
              nome: "Ponte con gamba sollevata", serie: 3, ripetizioni: 10, fascia: ponteFascia, pausa: 60,
              suggerimento: "YouTube: Ponte con gamba sollevata",
              bandPlacement: "Posiziona la fascia appena sopra le ginocchia. L'altra gamba è sollevata e tesa.",
              bandSuggestionDetail: `Usa la fascia ${fasce[ponteFascia].emoji} ${ponteFascia} (${fasce[ponteFascia].peso}). Concentrati sull'attivazione di un singolo gluteo. Un peso maggiore può essere usato se senti l'esercizio troppo facile.`
            },
            {
              nome: "Marching bridge", serie: 3, ripetizioni: 12, fascia: "verde", pausa: 45,
              suggerimento: "YouTube: Marching bridge",
              bandPlacement: "Posiziona la fascia appena sopra le ginocchia. Mentre sollevi un ginocchio, spingi l'altro ginocchio contro la fascia.",
              bandSuggestionDetail: `La fascia ${fasce["verde"].emoji} verde (${fasce["verde"].peso}) aiuta a mantenere l'attivazione dei glutei e del core durante il movimento dinamico.`
            },
            {
              nome: "Clamshell", serie: 3, ripetizioni: 15, fascia: sideLegRaiseFascia, pausa: 45,
              suggerimento: "YouTube: Clamshell con fascia",
              bandPlacement: "Posiziona la fascia appena sopra le ginocchia, mantenendo i piedi uniti.",
              bandSuggestionDetail: `La fascia ${fasce[sideLegRaiseFascia].emoji} ${sideLegRaiseFascia} (${fasce[sideLegRaiseFascia].peso}) è perfetta per isolare e rafforzare i glutei medi, essenziali per la stabilità del bacino.`
            },
            {
              nome: "Side plank con fascia", serie: 3, ripetizioni: 20, fascia: "verde", pausa: 45,
              suggerimento: "YouTube: Side plank con fascia",
              bandPlacement: "Posiziona la fascia appena sopra le ginocchia. Mantieni i piedi uniti o uno sopra l'altro.",
              bandSuggestionDetail: `La fascia ${fasce["verde"].emoji} verde (${fasce["verde"].peso}) aggiunge una leggera resistenza che impegna maggiormente gli obliqui e i muscoli stabilizzatori dell'anca.`
            },
          ],
        },
        {
          giorno: "Venerdì – Total Body + Stabilità",
          esercizi: [
            {
              nome: "Squat to overhead press", serie: 3, ripetizioni: 10, fascia: "blu", pausa: 60,
              suggerimento: "YouTube: Squat to overhead press con fascia",
              bandPlacement: "Metti i piedi sulla fascia, larghezza spalle, afferra le estremità della fascia con le mani all'altezza delle spalle, palmi in avanti. Premi sopra la testa.",
              bandSuggestionDetail: `Per questo esercizio composto, la fascia ${fasce["blu"].emoji} blu (${fasce["blu"].peso}) offre un buon equilibrio tra resistenza per le gambe e per le spalle. Concentrati sulla fluidità del movimento.`
            },
            {
              nome: "Walking lunge", serie: 3, ripetizioni: 8, fascia: "blu", pausa: 60,
              suggerimento: "YouTube: Walking lunge con fascia",
              bandPlacement: "Posiziona la fascia appena sopra le ginocchia. Assicurati che rimanga in posizione durante il movimento.",
              bandSuggestionDetail: `La fascia ${fasce["blu"].emoji} blu (${fasce["blu"].peso}) aumenta l'attivazione dei glutei e dei quadricipiti. Mantieni il core attivo per la stabilità.`
            },
            {
              nome: "Plank con ginocchio al gomito", serie: 3, ripetizioni: 10, fascia: "verde", pausa: 45,
              suggerimento: "YouTube: Plank con ginocchio al gomito",
              bandPlacement: "Posiziona la fascia attorno alle caviglie. Porta il ginocchio al gomito opponente contro la resistenza della fascia.",
              bandSuggestionDetail: `La fascia ${fasce["verde"].emoji} verde (${fasce["verde"].peso}) offre una resistenza leggera ma efficace per intensificare l'attivazione del core e migliorare la coordinazione.`
            },
            {
              nome: "Glute bridge roll", serie: 3, ripetizioni: 12, fascia: ponteFascia, pausa: 60,
              suggerimento: "YouTube: Glute bridge roll con fascia",
              bandPlacement: "Posiziona la fascia appena sopra le ginocchia. Durante la spinta, contrai i glutei e mantieni la tensione.",
              bandSuggestionDetail: `Usa la fascia ${fasce[ponteFascia].emoji} ${ponteFascia} (${fasce[ponteFascia].peso}). Questo esercizio aiuta a migliorare la mobilità della colonna lombare e l'attivazione dei glutei.`
            },
            {
              nome: "Pallof press", serie: 3, ripetizioni: 10, fascia: "blu", pausa: 60,
              suggerimento: "YouTube: Pallof press con fascia",
              bandPlacement: "Avvolgi la fascia attorno a un punto fisso (es. un palo). Afferra entrambe le estremità della fascia con le mani, posizionandoti lateralmente.",
              bandSuggestionDetail: `La fascia ${fasce["blu"].emoji} blu (${fasce["blu"].peso}) è ideale per questo esercizio anti-rotazione del core. Metti più distanza tra te e il punto fisso per aumentare la resistenza.`
            },
          ],
        },
      ],
    });
  }

  // FASE 2: Settimane 5-8 - Costruzione della forza con intensità aumentata.
  for (let i = 5; i <= 8; i++) {
    const weekNum = i;
    allWeeks.push({
      settimana: weekNum,
      fase: "Fase 2 – Costruzione Forza",
      allenamenti: [
        {
          giorno: "Lunedì – Gambe + Glutei (Intensità aumentata)",
          esercizi: [
            {
              nome: "Squat con fascia", serie: 4, ripetizioni: 12, fascia: "gialla", pausa: 75,
              suggerimento: "YouTube: Squat con fascia attivazione glutei avanzato",
              bandPlacement: "Posiziona la fascia appena sopra le ginocchia, concentrandoti sulla massima tensione esterna durante lo squat.",
              bandSuggestionDetail: `Per questa fase, la fascia ${fasce["gialla"].emoji} gialla (${fasce["gialla"].peso}) è consigliata. Se la forma è compromessa, torna alla blu. L'obiettivo è la tensione costante.`
            },
            {
              nome: "Affondo camminato", serie: 4, ripetizioni: 10, fascia: "gialla", pausa: 60,
              suggerimento: "YouTube: Affondo camminato con fascia",
              bandPlacement: "Fascia appena sopra le ginocchia. Concentrati sulla stabilità e sul controllo del movimento mentre cammini.",
              bandSuggestionDetail: `La fascia ${fasce["gialla"].emoji} gialla (${fasce["gialla"].peso}) aggiunge una resistenza significativa. Se senti troppa tensione, passa alla blu.`
            },
            {
              nome: "Hip Thrust con fascia", serie: 4, ripetizioni: 12, fascia: "rossa", pausa: 75,
              suggerimento: "YouTube: Hip Thrust con fascia",
              bandPlacement: "Posiziona la fascia appena sopra le ginocchia. Alza i fianchi e premi le ginocchia verso l'esterno con forza.",
              bandSuggestionDetail: `Per massimizzare l'attivazione dei glutei in questa fase, la fascia ${fasce["rossa"].emoji} rossa (${fasce["rossa"].peso}) è eccellente. Assicurati una buona esecuzione prima di aumentare ulteriormente la resistenza.`
            },
            {
              nome: "Clamshells con fascia", serie: 4, ripetizioni: 20, fascia: "verde", pausa: 45,
              suggerimento: "YouTube: Clamshells con fascia",
              bandPlacement: "Fascia appena sopra le ginocchia, mantenendo i piedi uniti. Movimento lento e controllato.",
              bandSuggestionDetail: `La fascia ${fasce["verde"].emoji} verde (${fasce["verde"].peso}) è ancora efficace qui per un alto numero di ripetizioni, concentrandosi sulla resistenza muscolare e la forma.`
            },
            {
              nome: "Donkey Kicks con fascia", serie: 4, ripetizioni: 15, fascia: "blu", pausa: 45,
              suggerimento: "YouTube: Donkey Kicks con fascia",
              bandPlacement: "Fascia appena sopra le ginocchia o attorno alle caviglie per maggiore difficoltà. Spingi il tallone verso l'alto.",
              bandSuggestionDetail: `La fascia ${fasce["blu"].emoji} blu (${fasce["blu"].peso}) fornisce una resistenza sufficiente per isolare i glutei. Evita di inarcare la schiena.`
            },
          ],
        },
        {
          giorno: "Martedì – Superiori + Core (Intensità aumentata)",
          esercizi: [
            {
              nome: "Push-up (regolari o inclinati)", serie: 4, ripetizioni: 10, fascia: null, pausa: 75,
              suggerimento: "YouTube: Push-up corretta esecuzione",
              bandPlacement: "Nessuna fascia richiesta.",
              bandSuggestionDetail: "Questo esercizio è a corpo libero. Concentrati sull'aumento delle ripetizioni o sulla diminuzione dell'inclinazione se li fai inclinati."
            },
            {
              nome: "Pull Apart con fascia", serie: 4, ripetizioni: 15, fascia: "verde", pausa: 45,
              suggerimento: "YouTube: Band Pull Apart",
              bandPlacement: "Tieni la fascia con entrambe le mani, larghezza spalle, all'altezza del petto. Tira le mani all'esterno, contraendo le scapole.",
              bandSuggestionDetail: `La fascia ${fasce["verde"].emoji} verde (${fasce["verde"].peso}) è ideale per riscaldare i muscoli della schiena e migliorare la postura, consentendo un alto numero di ripetizioni.`
            },
            {
              nome: "Side Plank", serie: 4, ripetizioni: 30, fascia: null, pausa: 45,
              suggerimento: "YouTube: Side Plank benefici",
              bandPlacement: "Nessuna fascia richiesta.",
              bandSuggestionDetail: "Esercizio a corpo libero per il core. Mantieni la linea retta dal capo ai piedi."
            },
            {
              nome: "Rear Delt Fly con fascia", serie: 4, ripetizioni: 12, fascia: "blu", pausa: 60,
              suggerimento: "YouTube: Rear Delt Fly con fascia",
              bandPlacement: "Tieni la fascia con entrambe le mani, larghezza spalle. Con le braccia leggermente piegate, tira la fascia verso l'esterno e all'indietro.",
              bandSuggestionDetail: `La fascia ${fasce["blu"].emoji} blu (${fasce["blu"].peso}) è efficace per isolare i deltoidi posteriori. Controlla il movimento in entrambe le fasi.`
            },
            {
              nome: "Leg Raises", serie: 4, ripetizioni: 15, fascia: null, pausa: 45,
              suggerimento: "YouTube: Leg Raises per addominali bassi",
              bandPlacement: "Nessuna fascia richiesta.",
              bandSuggestionDetail: "Esercizio a corpo libero per gli addominali. Mantieni la zona lombare aderente al pavimento."
            },
          ],
        },
        {
          giorno: "Giovedì – Gambe + Core (con progressione)",
          esercizi: [
            {
              nome: "Bulgarian Split Squat", serie: 4, ripetizioni: 8, fascia: "blu", pausa: 90,
              suggerimento: "YouTube: Bulgarian Split Squat forma",
              bandPlacement: "Posiziona la fascia appena sopra le ginocchia. La gamba posteriore è elevata su una panca.",
              bandSuggestionDetail: `La fascia ${fasce["blu"].emoji} blu (${fasce["blu"].peso}) aggiunge un'ottima resistenza per i glutei e i quadricipiti. Concentrati sulla profondità e sulla stabilità.`
            },
            {
              nome: "Stacco Rumeno con fascia", serie: 4, ripetizioni: 12, fascia: "gialla", pausa: 60,
              suggerimento: "YouTube: Stacco Rumeno con fascia",
              bandPlacement: "Metti i piedi sulla fascia, larghezza fianchi, afferrando le estremità con le mani. Mantieni le gambe quasi tese e fletti il busto in avanti.",
              bandSuggestionDetail: `La fascia ${fasce["gialla"].emoji} gialla (${fasce["gialla"].peso}) è eccellente per attivare i posteriori della coscia e i glutei. Mantieni la schiena dritta e il movimento controllato.`
            },
            {
              nome: "Crunch inversi", serie: 4, ripetizioni: 15, fascia: null, pausa: 45,
              suggerimento: "YouTube: Crunch inversi esecuzione",
              bandPlacement: "Nessuna fascia richiesta.",
              bandSuggestionDetail: "Esercizio a corpo libero per gli addominali bassi. Solleva il bacino dal pavimento usando il core."
            },
            {
              nome: "Pistol Squat (assistito)", serie: 4, ripetizioni: 5, fascia: null, pausa: 90,
              suggerimento: "YouTube: Pistol Squat principianti",
              bandPlacement: "Nessuna fascia richiesta.",
              bandSuggestionDetail: "Questo esercizio a corpo libero si concentra sulla forza unilaterale. Usa un supporto (sedia, muro) per assistere se necessario."
            },
            {
              nome: "Jump squat (atterraggio morbido)", serie: 3, ripetizioni: 8, fascia: "verde", pausa: 60,
              suggerimento: "YouTube: Jump squat esecuzione corretta",
              bandPlacement: "Fascia appena sopra le ginocchia. L'obiettivo è esplosività e atterraggio controllato.",
              bandSuggestionDetail: `La fascia ${fasce["verde"].emoji} verde (${fasce["verde"].peso}) aggiunge una leggera resistenza per l'attivazione dei glutei durante l'esplosività.`
            },
          ],
        },
        {
          giorno: "Venerdì – Total Body + Stabilità (con progressione)",
          esercizi: [
            {
              nome: "Military Press con fascia", serie: 4, ripetizioni: 10, fascia: "gialla", pausa: 90,
              suggerimento: "YouTube: Military Press con fascia",
              bandPlacement: "Metti i piedi sulla fascia, larghezza spalle, afferra le estremità della fascia con le mani all'altezza delle spalle, palmi in avanti. Premi sopra la testa.",
              bandSuggestionDetail: `La fascia ${fasce["gialla"].emoji} gialla (${fasce["gialla"].peso}) offre una buona resistenza. Le fasce da 60 cm (loop chiuse) sono utilizzabili in questo modo. Se cerchi più resistenza, puoi raddoppiare la fascia o usare un tipo diverso (tubolare con maniglie) per carichi maggiori.`
            },
            {
              nome: "Face Pulls con fascia", serie: 4, ripetizioni: 15, fascia: "blu", pausa: 60,
              suggerimento: "YouTube: Face Pulls con fascia",
              bandPlacement: "Avvolgi la fascia attorno a un punto fisso (es. una colonna) all'altezza del petto. Afferra le estremità con entrambe le mani e tira verso il viso, separando le mani.",
              bandSuggestionDetail: `La fascia ${fasce["blu"].emoji} blu (${fasce["blu"].peso}) è ottima per rafforzare la parte alta della schiena e la postura. Concentrati sul movimento delle scapole.`
            },
            {
              nome: "Dips (assistiti)", serie: 4, ripetizioni: 8, fascia: null, pausa: 75,
              suggerimento: "YouTube: Dips assistiti per tricipiti",
              bandPlacement: "Nessuna fascia richiesta. Puoi usare una sedia o una panca per l'assistenza.",
              bandSuggestionDetail: "Esercizio a corpo libero per tricipiti e petto. Se necessario, posiziona i piedi a terra per ridurre il carico."
            },
            {
              nome: "Hammer Curls con fascia", serie: 4, ripetizioni: 12, fascia: "blu", pausa: 60,
              suggerimento: "YouTube: Hammer Curls con fascia",
              bandPlacement: "Metti un piede sulla fascia, afferra l'altra estremità con la mano, palmo rivolto verso il corpo. Fletti l'avambraccio.",
              bandSuggestionDetail: `La fascia ${fasce["blu"].emoji} blu (${fasce["blu"].peso}) è una buona scelta per i bicipiti. Mantieni il gomito fisso e controlla il movimento.`
            },
          ],
        },
      ],
    });
  }

  // FASE 3: Settimane 9-12 - Massima intensificazione e potenza.
  for (let i = 9; i <= 12; i++) {
    const weekNum = i;
    allWeeks.push({
      settimana: weekNum,
      fase: "Fase 3 – Intensificazione",
      allenamenti: [
        {
          giorno: `Lunedì – Gambe + Glutei (Intensità Massima)`,
          esercizi: [
            {
              nome: "Squat con fascia profondo", serie: 4, ripetizioni: 10, fascia: "rossa", pausa: 90,
              suggerimento: "YouTube: Squat con fascia profondo avanzato",
              bandPlacement: "Posiziona la fascia appena sopra le ginocchia. Scendi il più possibile, mantenendo la schiena dritta e le ginocchia spinte all'esterno.",
              bandSuggestionDetail: `La fascia ${fasce["rossa"].emoji} rossa (${fasce["rossa"].peso}) è per l'intensità massima. Assicurati che la tua mobilità e forma siano impeccabili per evitare infortuni. Se senti dolore, riduci la resistenza.`
            },
            {
              nome: "Bulgarian Split Squat con Fascia", serie: 4, ripetizioni: 8, fascia: "gialla", pausa: 90,
              suggerimento: "YouTube: Bulgarian Split Squat con fascia avanzato",
              bandPlacement: "Fascia appena sopra le ginocchia. La gamba posteriore elevata. Concentrati sull'equilibrio e sulla spinta.",
              bandSuggestionDetail: `La fascia ${fasce["gialla"].emoji} gialla (${fasce["gialla"].peso}) eleva la sfida per i glutei e i quadricipiti. Questo esercizio richiede un ottimo controllo. `
            },
            {
              nome: "Ponte con fascia (con pausa isometrica)", serie: 4, ripetizioni: 10, fascia: "nera", pausa: 75,
              suggerimento: "YouTube: Ponte con fascia con pausa isometrica",
              bandPlacement: "Posiziona la fascia appena sopra le ginocchia. Quando raggiungi il picco, mantieni la contrazione isometrica per 2-3 secondi, spingendo le ginocchia verso l'esterno.",
              bandSuggestionDetail: `La fascia ${fasce["nera"].emoji} nera (${fasce["nera"].peso}) offre la massima resistenza. La pausa isometrica aumenta ulteriormente l'attivazione e la forza dei glutei. `
            },
            {
              nome: "Affondo laterale con fascia (pesante)", serie: 4, ripetizioni: 10, fascia: "rossa", pausa: 60,
              suggerimento: "YouTube: Affondo laterale con fascia pesante",
              bandPlacement: "Fascia appena sopra le ginocchia. Fai un passo laterale ampio, mantenendo la tensione sulla fascia.",
              bandSuggestionDetail: `La fascia ${fasce["rossa"].emoji} rossa (${fasce["rossa"].peso}) è per un allenamento intenso di interno ed esterno coscia. Controlla il ritorno alla posizione iniziale.`
            },
            {
              nome: "Deadlift rumeno a una gamba (assistito)", serie: 4, ripetizioni: 8, fascia: "blu", pausa: 60,
              suggerimento: "YouTube: Deadlift rumeno a una gamba con fascia",
              bandPlacement: "Posiziona la fascia attorno alle caviglie o sotto il piede della gamba di appoggio e tieni l'altra estremità con le mani. L'altra gamba si estende all'indietro.",
              bandSuggestionDetail: `La fascia ${fasce["blu"].emoji} blu (${fasce["blu"].peso}) offre un buon feedback sulla tensione. Se non hai un buon equilibrio, usa un supporto leggero.`
            },
          ],
        },
        {
          giorno: `Martedì – Superiori + Core (Forza esplosiva)`,
          esercizi: [
            {
              nome: "Explosive Push-up (ginocchia/regolari)", serie: 4, ripetizioni: 6, fascia: null, pausa: 90,
              suggerimento: "YouTube: Explosive Push-up",
              bandPlacement: "Nessuna fascia richiesta.",
              bandSuggestionDetail: "Esercizio a corpo libero per sviluppare forza esplosiva. Cerca di staccare le mani da terra. Se troppo difficile, fallo dalle ginocchia."
            },
            {
              nome: "Remata con fascia (intensa)", serie: 4, ripetizioni: 10, fascia: "rossa", pausa: 75,
              suggerimento: "YouTube: Remata con fascia intensa",
              bandPlacement: "Siediti con le gambe tese, avvolgi la fascia attorno ai piedi e afferra le estremità con le mani. Oppure lega a un punto fisso.",
              bandSuggestionDetail: `La fascia ${fasce["rossa"].emoji} rossa (${fasce["rossa"].peso}) offre una resistenza significativa. Concentrati sulla contrazione della schiena e sul mantenimento della postura.`
            },
            {
              nome: "Plank dinamico con fascia", serie: 4, ripetizioni: 15, fascia: "verde", pausa: 60,
              suggerimento: "YouTube: Plank dinamico con fascia",
              bandPlacement: "Posiziona la fascia appena sopra le ginocchia. Esegui movimenti laterali delle gambe o delle braccia mantenendo la stabilità del core.",
              bandSuggestionDetail: `La fascia ${fasce["verde"].emoji} verde (${fasce["verde"].peso}) è sufficiente per aggiungere un elemento di instabilità e dinamismo, costringendo il core a lavorare di più.`
            },
            {
              nome: "Shoulder press con fascia (pesante)", serie: 4, ripetizioni: 10, fascia: "rossa", pausa: 75,
              suggerimento: "YouTube: Shoulder press con fascia pesante",
              bandPlacement: "Metti i piedi sulla fascia, larghezza spalle, afferrando le estremità con le mani. Premi con forza sopra la testa.",
              bandSuggestionDetail: `Per un'alta intensità, usa la fascia ${fasce["rossa"].emoji} rossa (${fasce["rossa"].peso}). Puoi anche raddoppiare la fascia per un extra carico. Ricorda che le fasce da 60 cm sono usabili, ma per carichi molto pesanti potresti preferire fasce tubolari.`
            },
            {
              nome: "Dead Bug con fascia (con resistenza aggiunta)", serie: 4, ripetizioni: 10, fascia: "blu", pausa: 60,
              suggerimento: "YouTube: Dead Bug con fascia resistenza",
              bandPlacement: "Posiziona la fascia attorno alle caviglie o incrociata tra mano e piede opposto per una maggiore resistenza diagonale.",
              bandSuggestionDetail: `La fascia ${fasce["blu"].emoji} blu (${fasce["blu"].peso}) con un posizionamento strategico (es. incrociato) aumenta la sfida per il core, migliorando la stabilità e il controllo.`
            },
          ],
        },
        {
          giorno: `Giovedì – Gambe + Core (Potenza & Resistenze)`,
          esercizi: [
            {
              nome: "Jump squat con fascia (alta intensità)", serie: 4, ripetizioni: 8, fascia: "gialla", pausa: 75,
              suggerimento: "YouTube: Jump squat con fascia alta intensità",
              bandPlacement: "Fascia appena sopra le ginocchia. Spingi con forza per saltare, atterrando morbidamente.",
              bandSuggestionDetail: `La fascia ${fasce["gialla"].emoji} gialla (${fasce["gialla"].peso}) è eccellente per aumentare la potenza nelle gambe e l'attivazione dei glutei durante il salto.`
            },
            {
              nome: "Pistol Squat (assistito/completo)", serie: 4, ripetizioni: 5, fascia: null, pausa: 90,
              suggerimento: "YouTube: Pistol Squat principianti",
              bandPlacement: "Nessuna fascia richiesta.",
              bandSuggestionDetail: "L'obiettivo è eseguire il Pistol Squat completo. Continua a usare un'assistenza minima se necessario."
            },
            {
              nome: "Mountain Climbers (veloci)", serie: 4, ripetizioni: 30, fascia: null, pausa: 45,
              suggerimento: "YouTube: Mountain Climbers veloci",
              bandPlacement: "Nessuna fascia richiesta.",
              bandSuggestionDetail: "Esercizio cardio e per il core. Concentrati sulla velocità e sul mantenimento della posizione di plank."
            },
            {
              nome: "Box Jumps (su scalino/panca)", serie: 4, ripetizioni: 8, fascia: null, pausa: 60,
              suggerimento: "YouTube: Box Jumps per principianti",
              bandPlacement: "Nessuna fascia richiesta.",
              bandSuggestionDetail: "Esercizio pliometrico per la potenza delle gambe. Scegli un'altezza sicura e concentrati sull'atterraggio morbido."
            },
            {
              nome: "Russian Twist con peso", serie: 4, ripetizioni: 20, fascia: null, pausa: 45,
              suggerimento: "YouTube: Russian Twist con peso",
              bandPlacement: "Nessuna fascia richiesta.",
              bandSuggestionDetail: "Puoi usare un manubrio leggero, una bottiglia d'acqua o qualsiasi peso per aumentare l'intensità per gli obliqui. Gira solo il busto, non le braccia."
            },
          ],
        },
        {
          giorno: `Venerdì – Circuito Finale Total Body (Settimana ${weekNum})`,
          esercizi: [
            {
              nome: "Circuito: 10x Jump squat (verde)", serie: 1, ripetizioni: 1, fascia: "verde", pausa: 0,
              suggerimento: "Eseguire in circuito con gli altri esercizi. 3 round – Riposa 1 min tra i round.",
              bandPlacement: "Fascia appena sopra le ginocchia. Mantieni l'esplosività anche con fatica.",
              bandSuggestionDetail: `Per il circuito, la fascia ${fasce["verde"].emoji} verde (${fasce["verde"].peso}) è un buon compromesso per mantenere l'intensità attraverso tutti i round.`
            },
            {
              nome: "Circuito: 15x Ponte con fascia (rossa)", serie: 1, ripetizioni: 1, fascia: "rossa", pausa: 0,
              suggerimento: "Eseguire in circuito con gli altri esercizi. 3 round – Riposa 1 min tra i round.",
              bandPlacement: "Fascia appena sopra le ginocchia. Spingi con forza i fianchi verso l'alto.",
              bandSuggestionDetail: `La fascia ${fasce["rossa"].emoji} rossa (${fasce["rossa"].peso}) per i ponti glutei manterrà alta l'attivazione in questo circuito.`
            },
            {
              nome: "Circuito: 10x Push-up", serie: 1, ripetizioni: 1, fascia: null, pausa: 0,
              suggerimento: "Eseguire in circuito con gli altri esercizi. 3 round – Riposa 1 min tra i round.",
              bandPlacement: "Nessuna fascia richiesta.",
              bandSuggestionDetail: "Esegui i push-up (ginocchia o regolari) mantenendo una buona forma nonostante la fatica."
            },
            {
              nome: "Circuito: 30 sec Plank con fascia", serie: 1, ripetizioni: 1, fascia: "verde", pausa: 0,
              suggerimento: "Eseguire in circuito con gli altri esercizi. 3 round – Riposa 1 min tra i round.",
              bandPlacement: "Fascia appena sopra le ginocchia. Mantieni il corpo in linea retta.",
              bandSuggestionDetail: `La fascia ${fasce["verde"].emoji} verde (${fasce["verde"].peso}) aggiunge una sfida al plank, attivando maggiormente i glutei.`
            },
            {
              nome: "Circuito: 20x Pallof press (10 per lato)", serie: 1, ripetizioni: 1, fascia: "blu", pausa: 0,
              suggerimento: "Eseguire in circuito con gli altri esercizi. 3 round – Riposa 1 min tra i round.",
              bandPlacement: "Avvolgi la fascia attorno a un punto fisso, afferra le estremità e pressa in avanti dal petto, resistendo alla rotazione.",
              bandSuggestionDetail: `La fascia ${fasce["blu"].emoji} blu (${fasce["blu"].peso}) è ottima per mantenere l'intensità nel Pallof Press durante il circuito.`
            },
          ],
        },
      ],
    });
  }

  return allWeeks;
};

// Generazione del programma completo una sola volta all'avvio dell'applicazione.
const programma = generateProgramData();

const WorkoutDetail = ({ setCurrentView, selectedWeek = 1 }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExercise, setSelectedExercise] = useState(null);
  // expandedDay ora memorizza una chiave unica per il giorno espanso (es. "week_0_day_0")
  const [expandedDayKey, setExpandedDayKey] = useState(null);

  // Funzione per generare il link YouTube
  const getYoutubeLink = (suggestion) => {
    const searchTerms = suggestion.replace(/YouTube:\s*/i, "").trim();
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerms)}`;
  };

  // Creiamo un array flat di tutti gli esercizi con i loro contesti di settimana e giorno
  const allProgramExercises = useMemo(() => {
    return programma.flatMap((week) =>
      week.allenamenti.flatMap((day, dayIndex) =>
        day.esercizi.map((ex) => ({
          ...ex,
          dayName: day.giorno,
          weekNum: week.settimana,
          weekFase: week.fase,
          dayKey: `week_${week.settimana}_day_${dayIndex}` // Chiave unica per il giorno
        }))
      )
    );
  }, [programma]);

  // Filtra e raggruppa gli esercizi in base al termine di ricerca
  const filteredAndGroupedExercises = useMemo(() => {
    const filtered = allProgramExercises.filter((ex) =>
      ex.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.suggerimento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.bandPlacement?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.bandSuggestionDetail?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Raggruppa per settimana e poi per giorno
    return filtered.reduce((acc, ex) => {
      if (!acc[ex.weekNum]) {
        acc[ex.weekNum] = {
          weekNum: ex.weekNum,
          weekFase: ex.weekFase,
          days: {},
        };
      }
      if (!acc[ex.weekNum].days[ex.dayName]) {
        acc[ex.weekNum].days[ex.dayName] = {
          dayName: ex.dayName,
          exercises: [],
        };
      }
      acc[ex.weekNum].days[ex.dayName].exercises.push(ex);
      return acc;
    }, {});
  }, [searchTerm, allProgramExercises]);

  const displayWeeks = Object.values(filteredAndGroupedExercises);

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
            --border: 1px solid rgba(255, 255, 255, 0.18);
            --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            --radius-lg: 2rem;
            --radius-md: 1.25rem;
            --radius-sm: 0.75rem;
          }
          .dettaglio-container {
            min-height: 100vh;
            padding: 1.5rem;
            background: linear-gradient(135deg, #0f1b3a 0%, #1a365d 50%, #0066ff 100%);
            font-family: 'Poppins', sans-serif;
            color: var(--light);
            position: relative;
            overflow-x: hidden;
          }
          .dettaglio-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTEwIDBoLTEwdi0xMCBMMCAyMC41IDMuNSAyNCAwIDMwIDAgNDAgNSA0NSA1IDM1IDEwIDMwIDEwIDIwIDE1IDI1IDE1IDE1IDEwIDEwek0yMCAwaC0xMHYxMGgxMHYtMTB6bTEwIDBoLTEwdjEwaDEwdi0xMHptMTAgMGgtMTB2MTBoMTB2LTEwemm1MCAwaC0xMHYxMGgxMHYtMTB6bTEwIDBoLTEwdjEwaDEwdi0xMHptMTAgMGgtMTB2MTBoMTB2LTEwek0wIDMwdi0xMGgxMHYxMGgtMTB6bTEwIDBoLTEwdjEwaDEwdi0xMHptMTAgMGgtMTB2MTBoMTB2LTEwemm10IDBoLTEwdjEwaDEwdi0xMHptMTAgMGgtMTB2MTBoMTB2LTEwemm1MCAwaC0xMHYxMGgxMHYtMTAwek00MCAwdi0xMGgxMHYxMHoiIGZpbGw9IiNmZmZmZmYwMSIvPjwvc3ZnPg==');
            opacity: 0.03;
            pointer-events: none;
            z-index: -1;
          }
          .header-dettaglio {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding: 1rem 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
          .title-week {
            font-size: 2.2rem;
            font-weight: 800;
            color: var(--light);
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          }
          .back-button {
            padding: 0.8rem 1.6rem;
            border-radius: var(--radius-md);
            font-weight: 600;
            color: var(--light);
            background: rgba(255, 255, 255, 0.1);
            border: var(--border);
            cursor: pointer;
            transition: var(--transition);
            backdrop-filter: blur(10px);
          }
          .back-button:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
          }
          .search-container {
            margin-bottom: 2rem;
            position: relative;
            max-width: 800px; /* Aumentato la larghezza massima per il campo di ricerca */
            margin-left: auto;
            margin-right: auto;
          }
          .search-input {
            width: 100%;
            padding: 1rem 1.5rem 1rem 3.5rem;
            border-radius: var(--radius-md);
            border: var(--border);
            background: rgba(255, 255, 255, 0.1);
            color: var(--light);
            font-size: 1rem;
            backdrop-filter: blur(10px);
          }
          .search-input::placeholder {
            color: rgba(255, 255, 255, 0.6);
          }
          .search-icon {
            position: absolute;
            left: 1.2rem;
            top: 50%;
            transform: translateY(-50%);
            color: rgba(255, 255, 255, 0.6);
            font-size: 1.2rem;
          }
          .day-card {
            margin-bottom: 1.5rem;
            overflow: hidden;
            border-radius: var(--radius-md);
            background: rgba(255, 255, 255, 0.08);
            border: var(--border);
            backdrop-filter: blur(10px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
            transition: var(--transition);
            max-width: 1200px; /* Allineato con gli altri blocchi */
            margin-left: auto;
            margin-right: auto;
          }
          .day-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 25px rgba(0, 102, 255, 0.2);
          }
          .day-header {
            padding: 1rem 1.5rem;
            background: rgba(0, 102, 255, 0.1);
            font-size: 1.4rem;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .day-header:hover {
            background: rgba(0, 102, 255, 0.2);
          }
          .exercise-item {
            padding: 1rem 1.5rem;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            cursor: pointer;
            transition: var(--transition);
          }
          .exercise-item:hover {
            background: rgba(255, 255, 255, 0.05);
            transform: translateX(8px);
          }
          .exercise-name {
            font-weight: 600;
            color: var(--light);
            margin-bottom: 0.5rem; /* Spazio sotto il nome */
          }
          .exercise-info {
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.7);
            margin-top: 0.3rem;
            line-height: 1.4; /* Migliora la leggibilità */
          }
          .exercise-info strong {
            color: var(--light); /* Rende i strong più visibili */
          }
          .popup-overlay {
            position: fixed;
            inset: 0;
            background: linear-gradient(135deg, rgba(0, 102, 255, 0.7), rgba(18, 24, 38, 0.9));
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }
          .popup-content {
            background: rgba(255, 255, 255, 0.98);
            color: #333;
            padding: 2.5rem;
            border-radius: var(--radius-lg);
            max-width: 600px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            position: relative;
          }
          .popup-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: #6c757d;
            color: white;
            border: none;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: var(--transition);
          }
          .popup-close:hover {
            background: #5a6268;
            transform: rotate(90deg);
          }
          .popup-title {
            font-size: 1.8rem;
            color: var(--primary);
            margin-bottom: 1.2rem;
            text-align: center;
          }
          .popup-info {
            margin-bottom: 1rem;
            line-height: 1.7;
            color: #444;
          }
          .popup-info strong {
            color: #000;
          }
          .popup-band {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 600;
            color: #004cbb;
            margin: 0.8rem 0;
          }
          .popup-suggestion {
            font-style: italic;
            background: rgba(255, 107, 0, 0.1);
            padding: 1rem;
            border-radius: 0.5rem;
            border-left: 4px solid var(--secondary);
            margin: 1rem 0;
          }
          .popup-link {
            color: #e60000;
            text-decoration: underline;
            font-weight: 600;
            cursor: pointer;
          }
          .popup-link:hover {
            text-decoration: none;
          }
          .no-results {
            text-align: center;
            padding: 2rem;
            color: rgba(255, 255, 255, 0.6);
            font-style: italic;
            max-width: 1200px; /* Allineato con gli altri blocchi */
            margin-left: auto;
            margin-right: auto;
          }
        `}
      </style>

      <div className="dettaglio-container">
        <div className="header-dettaglio">
          <h1 className="title-week">Dettaglio Esercizi</h1> {/* Titolo più generico */}
          <button className="back-button" onClick={() => setCurrentView("dashboard")}>
            ← Indietro
          </button>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
          style={{ marginBottom: "2rem", color: "rgba(255,255,255,0.8)" }}
        >
          Esplora nel dettaglio tutti gli esercizi del programma. Cerca per nome, suggerimento o tipo di fascia.
        </motion.p>

        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Cerca un esercizio..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {displayWeeks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="no-results"
          >
            Nessun esercizio trovato per "{searchTerm}".
          </motion.div>
        ) : (
          displayWeeks.map((week, weekIndex) => (
            <div key={weekIndex}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--accent)', marginTop: '2.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                Settimana {week.weekNum} - {week.weekFase}
              </h2>
              {Object.values(week.days).map((day, dayIndex) => (
                <motion.div
                  key={`${week.weekNum}_${dayIndex}`}
                  className="day-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: dayIndex * 0.05 }}
                >
                  <div
                    className="day-header"
                    onClick={() => setExpandedDayKey(expandedDayKey === day.dayKey ? null : day.dayKey)}
                  >
                    <span>{day.dayName}</span>
                    <span>{expandedDayKey === day.dayKey ? '▲' : '▼'}</span>
                  </div>
                  <AnimatePresence>
                    {expandedDayKey === day.dayKey && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {day.exercises.map((ex, exerciseIndex) => (
                          <motion.div
                            key={exerciseIndex}
                            className="exercise-item"
                            onClick={() => setSelectedExercise(ex)}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: exerciseIndex * 0.03 }}
                          >
                            <div className="exercise-name">{ex.nome}</div>
                            <div className="exercise-info">
                              <strong>Serie:</strong> {ex.serie} | <strong>Ripetizioni:</strong> {ex.ripetizioni}
                              {ex.fascia && ` | ${fasce[ex.fascia].emoji} ${ex.fascia}`}
                              {ex.pausa > 0 && ` | Pausa: ${ex.pausa}s`}
                            </div>
                            {ex.bandPlacement && (
                              <div className="exercise-info">
                                <strong>Posizionamento Fascia:</strong> {ex.bandPlacement}
                              </div>
                            )}
                            {ex.bandSuggestionDetail && (
                              <div className="exercise-info">
                                <strong>Suggerimento Fascia:</strong> {ex.bandSuggestionDetail}
                              </div>
                            )}
                            {ex.suggerimento && (
                              <div className="exercise-info">
                                <a
                                  href={getYoutubeLink(ex.suggerimento)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="popup-link"
                                >
                                  Guarda Video su YouTube
                                </a>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          ))
        )}

        <AnimatePresence>
          {selectedExercise && (
            <motion.div
              className="popup-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedExercise(null)}
            >
              <motion.div
                className="popup-content"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="popup-close"
                  onClick={() => setSelectedExercise(null)}
                >
                  ×
                </button>
                <h2 className="popup-title">{selectedExercise.nome}</h2>

                <p className="popup-info">
                  <strong>Settimana:</strong> {selectedExercise.weekNum} | <strong>Giorno:</strong> {selectedExercise.dayName}
                </p>

                <p className="popup-info">
                  <strong>Serie:</strong> {selectedExercise.serie} | <strong>Ripetizioni:</strong> {selectedExercise.ripetizioni}
                  {selectedExercise.pausa > 0 && ` | Pausa: ${selectedExercise.pausa}s`}
                </p>

                {selectedExercise.fascia && (
                  <div className="popup-band">
                    {fasce[selectedExercise.fascia].emoji} <strong>Fascia:</strong> {selectedExercise.fascia} ({fasce[selectedExercise.fascia].peso})
                  </div>
                )}

                {selectedExercise.bandPlacement && (
                  <p className="popup-info">
                    <strong>Posizionamento fascia:</strong> {selectedExercise.bandPlacement}
                  </p>
                )}

                {selectedExercise.bandSuggestionDetail && (
                  <p className="popup-info">
                    <strong>Suggerimento aggiuntivo:</strong> {selectedExercise.bandSuggestionDetail}
                  </p>
                )}

                {selectedExercise.suggerimento && (
                  <p className="popup-info">
                    Hai dubbi sull'esecuzione?{" "}
                    <a
                      href={getYoutubeLink(selectedExercise.suggerimento)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="popup-link"
                    >
                      Cerca su YouTube
                    </a>
                  </p>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default WorkoutDetail;
