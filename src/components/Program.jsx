import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
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

// Elenco degli esercizi di riscaldamento con descrizione.
const warmUpExercisesData = [
    {
        name: "Jumping Jack (leggeri) – 1 min",
        description: "Inizia in piedi con i piedi uniti e le braccia lungo i fianchi. Salta divaricando le gambe alla larghezza delle spalle e contemporaneamente porta le braccia sopra la testa. Ritorna alla posizione di partenza con un altro salto. Mantieni un ritmo leggero e costante per attivare il sistema cardiovascolare.",
    },
    {
        name: "Cerchi con le braccia – 30 sec avanti / 30 sec indietro",
        description: "Stai in piedi con i piedi alla larghezza delle spalle e le braccia estese ai lati, parallele al pavimento. Esegui piccoli cerchi controllati in avanti per 30 secondi, poi inverti il movimento eseguendo cerchi all'indietro per altri 30 secondi. Aumenta gradualmente l'ampiezza dei cerchi.",
    },
    {
        name: "World’s Greatest Stretch – 30 sec per lato",
        description: "Fai un passo avanti in una posizione di affondo. Piega il busto e appoggia la mano opposta alla gamba anteriore a terra. L'altra mano va vicino al piede. Ruota il busto verso la gamba anteriore, portando il braccio verso il soffitto. Mantieni la posizione per qualche secondo e ripeti dall'altro lato.",
    },
    {
        name: "Bodyweight Squat – 10 rip",
        description: "Stai in piedi con i piedi alla larghezza delle spalle. Abbassa i fianchi come se ti stessi sedendo su una sedia, mantenendo il petto alto e la schiena dritta. Scendi finché le cosce non sono parallele al suolo (o fin dove riesci comodamente), poi torna in piedi. Esegui 10 ripetizioni controllate.",
    },
    {
        name: "Swing della gamba (laterale e posteriore) – 10x per gamba",
        description: "Appoggiati a un muro o a un supporto stabile. Dondola una gamba avanti e indietro in modo controllato per 10 volte. Poi, girati di 90 gradi e dondola la stessa gamba lateralmente (da un lato all'altro) per 10 volte. Ripeti con l'altra gamba.",
    },
    {
        name: "Glute Bridge con fascia verde – 10 rip (per attivare i glutei)",
        description: "Sdraiati sulla schiena con le ginocchia piegate e i piedi appoggiati a terra. Posiziona una fascia elastica leggera appena sopra le ginocchia. Spingi le ginocchia verso l'esterno contro la resistenza della fascia e solleva i fianchi verso il soffitto, contraendo i glutei. Mantieni la posizione per un secondo e abbassa lentamente.",
    },
];

// Elenco degli esercizi di defaticamento con descrizione.
const coolDownExercisesData = [
    {
        name: "Allungamento quadricipiti – 30 sec per gamba",
        description: "In piedi, appoggiati a un supporto se necessario. Afferra la caviglia destra con la mano destra e tira delicatamente il tallone verso il gluteo, mantenendo le ginocchia vicine. Dovresti sentire un allungamento nella parte anteriore della coscia. Mantieni per 30 secondi e cambia gamba.",
    },
    {
        name: "Allungamento flessori (hamstring) – 30 sec per gamba",
        description: "Siediti a terra con una gamba distesa davanti a te. Piega l'altra gamba portando la pianta del piede contro l'interno coscia della gamba distesa. Piegati lentamente in avanti verso la punta del piede della gamba distesa fino a sentire un allungamento. Mantieni per 30 secondi e cambia lato.",
    },
    {
        name: "Piriforme stretch (in posizione incrociata) – 30 sec per lato",
        description: "Sdraiati sulla schiena con le ginocchia piegate. Accavalla la caviglia destra sul ginocchio sinistro. Afferra la coscia sinistra con entrambe le mani e tira delicatamente verso il petto fino a sentire un allungamento nel gluteo destro. Mantieni per 30 secondi e cambia lato.",
    },
    {
        name: "Cat-Cow (micio-mucca) – 1 min",
        description: "Mettiti a quattro zampe con le mani sotto le spalle e le ginocchia sotto i fianchi. Inspira, inarca la schiena portando la pancia verso il basso e guarda in alto (posizione della mucca). Espira, arrotonda la colonna vertebrale verso il soffitto e guarda verso l'ombelico (posizione del gatto). Alterna i due movimenti lentamente per un minuto.",
    },
    {
        name: "Respirazione consapevole (addominale) – 1 min",
        description: "Siediti o sdraiati in una posizione comoda. Chiudi gli occhi e appoggia una mano sulla pancia. Inspira lentamente dal naso, sentendo la pancia che si gonfia. Espira lentamente dalla bocca, sentendo la pancia che si sgonfia. Concentrati solo sul tuo respiro per un minuto.",
    },
];

// Funzione per generare l'intero programma di allenamento di 12 settimane.
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

// --- Componente ausiliario per l'indicatore visivo delle serie ---
const SeriesIndicator = ({ completed, total, isCurrentActive }) => {
  return (
    <div className="series-indicator-group">
      {[...Array(total)].map((_, i) => (
        <motion.div
          key={i}
          className={`series-dot ${i < completed ? 'completed-dot' : ''} ${isCurrentActive && i === completed ? 'active-dot' : 'pending-dot'}`}
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: (i < completed || (isCurrentActive && i === completed)) ? 1 : 0.8, opacity: (i < completed || (isCurrentActive && i === completed)) ? 1 : 0.5 }}
          transition={{ duration: 0.2 }}
        />
      ))}
    </div>
  );
};

// --- Componente Popup di Controllo Esercizio ---
const ExerciseControlPopup = ({
  exercise,
  exerciseKey,
  completedState,
  timerState,
  onCompleteSeries,
  onSkipBreak,
  onFinishExercise,
  onClose,
  fasce
}) => {
  const currentProgress = completedState[exerciseKey] || { completedSeriesCount: 0, isFinished: false, hasStartedCurrentSeries: false };
  const { completedSeriesCount, isFinished } = currentProgress;
  const isTimerRunningForThisExercise = timerState.active && timerState.workoutKey === exerciseKey;

  const getYoutubeLink = (suggestion) => {
    const searchTerms = suggestion.replace(/YouTube:\s*/i, "").trim();
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerms)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="popup-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="popup-content exercise-control-popup"
        onClick={(e) => e.stopPropagation()} // Impedisce la chiusura cliccando all'interno del popup
      >
        <h3>{exercise.nome}</h3>
        <p className="exercise-popup-details">
          Serie: {completedSeriesCount} / {exercise.serie} | Ripetizioni: {exercise.ripetizioni}
          {exercise.fascia && ` | Fascia: ${fasce[exercise.fascia].emoji} ${exercise.fascia}`}
        </p>

        {exercise.bandPlacement && <p className="exercise-popup-info"><strong>Posizionamento Fascia:</strong> {exercise.bandPlacement}</p>}
        {exercise.bandSuggestionDetail && <p className="exercise-popup-info"><strong>Suggerimento Fascia:</strong> {exercise.bandSuggestionDetail}</p>}

        <SeriesIndicator
          completed={completedSeriesCount}
          total={exercise.serie}
          isCurrentActive={completedSeriesCount < exercise.serie}
        />

        <div className="popup-actions-group">
          {!isFinished && !isTimerRunningForThisExercise && (
            <motion.button
              onClick={() => onCompleteSeries(exercise)}
              disabled={isTimerRunningForThisExercise}
              whileHover={{ scale: 1.05, boxShadow: '0 6px 20px rgba(0, 102, 255, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              className={`exercise-button ${isTimerRunningForThisExercise ? "disabled" : ""}`}
            >
              Completa Serie {completedSeriesCount + 1} / {exercise.serie}
            </motion.button>
          )}

          {isTimerRunningForThisExercise && (
            <motion.button
              onClick={onSkipBreak}
              whileHover={{ scale: 1.05, boxShadow: '0 6px 20px rgba(255, 107, 0, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              className="exercise-button timer-active"
            >
              Salta Pausa ({timerState.seconds}s)
            </motion.button>
          )}

          {isFinished && (
            <motion.button className="exercise-button disabled" disabled>
              ✔ Completato
            </motion.button>
          )}

          {exercise.suggerimento && (
            <motion.a
              href={getYoutubeLink(exercise.suggerimento)}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, boxShadow: '0 6px 20px rgba(230, 0, 0, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              className={`exercise-button youtube-button`}
            >
              Guarda Video su YouTube
            </motion.a>
          )}

          <motion.button
            onClick={() => onFinishExercise(exercise)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="popup-button-close"
          >
            {isFinished ? "Chiudi" : "Termina Esercizio"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Componente Program ---
const Program = ({ setCurrentView }) => {
  const [completed, setCompleted] = useState({});
  const [currentWeek, setCurrentWeek] = useState(0);
  const [exerciseDetailsPopup, setExerciseDetailsPopup] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [activeExerciseInPopup, setActiveExerciseInPopup] = useState(null);
  const [activeExerciseKeyInPopup, setActiveExerciseKeyInPopup] = useState(null);
  const [infoPopupContent, setInfoPopupContent] = useState(null); // Stato per il popup di riscaldamento/defaticamento

  const weekButtonsContainerRef = useRef(null);

  const [timer, setTimer] = useState({
    active: false,
    seconds: 0,
    workoutKey: null,
    pauseDuration: 0,
    exerciseName: '',
  });
  const [showBreakEndPopup, setShowBreakEndPopup] = useState(false);
  const timerRef = useRef(null);
  
  useEffect(() => {
    if (timer.active && timer.seconds > 0) {
      timerRef.current = setInterval(() => {
        setTimer(prev => ({ ...prev, seconds: prev.seconds - 1 }));
      }, 1000);
    } else if (timer.active && timer.seconds === 0) {
      clearInterval(timerRef.current);
      setShowBreakEndPopup(true);
      setTimer(prev => ({ ...prev, active: false }));
    } else if (!timer.active && timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timer.active, timer.seconds]);

  useLayoutEffect(() => { // Changed to useLayoutEffect to fix centering scroll on mobile
    if (weekButtonsContainerRef.current) {
      const activeWeekButton = weekButtonsContainerRef.current.querySelector('.week-button.active');
      if (activeWeekButton) {
        activeWeekButton.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [currentWeek]);

  const handleStartSeries = (weekIdx, workoutIdx, exerciseIdx, exercise) => {
    const key = `w${weekIdx}_a${workoutIdx}_e${exerciseIdx}`;
    setCompleted(prev => ({
      ...prev,
      [key]: { completedSeriesCount: prev[key]?.completedSeriesCount || 0, isFinished: false, hasStartedCurrentSeries: true }
    }));
    setActiveExerciseInPopup(exercise);
    setActiveExerciseKeyInPopup(key);
  };

  const handleCompleteSeries = (exercise) => {
    const key = activeExerciseKeyInPopup;
    const currentProgress = completed[key] || { completedSeriesCount: 0 };
    const { serie: totalSeries, pausa, nome: exerciseName } = exercise;

    const newCompletedSeriesCount = currentProgress.completedSeriesCount + 1;
    const newIsFinished = newCompletedSeriesCount === totalSeries;

    setCompleted(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        completedSeriesCount: newCompletedSeriesCount,
        isFinished: newIsFinished,
      }
    }));

    if (!newIsFinished && pausa > 0) {
      setTimer({
        active: true,
        seconds: pausa,
        workoutKey: key,
        pauseDuration: pausa,
        exerciseName: exerciseName,
      });
    }
  };

  const handleFinishExercise = () => {
    const key = activeExerciseKeyInPopup;
    setCompleted(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        isFinished: true,
        hasStartedCurrentSeries: false,
      }
    }));
    setActiveExerciseInPopup(null);
    setActiveExerciseKeyInPopup(null);
    setTimer(prev => ({ ...prev, active: false, workoutKey: null }));
  };

  const skipBreak = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setShowBreakEndPopup(true);
    setTimer(prev => ({ ...prev, active: false, seconds: 0 }));
  };

  const getYoutubeLink = (suggestion) => {
    const searchTerms = suggestion.replace(/YouTube:\s*/i, "").trim();
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerms)}`;
  };

  const toggleSection = (sectionName) => {
    setExpandedSection(expandedSection === sectionName ? null : sectionName);
  };
  
  const overviewSections = [
        { title: "1️⃣ Introduzione", content: "Benvenuta nel tuo percorso di trasformazione di 12 settimane! Questo programma è stato creato per aiutarti a costruire forza, resistenza e a raggiungere i tuoi obiettivi di fitness, il tutto utilizzando le pratiche fasce elastiche. Preparati a sfidare il tuo corpo e a vedere risultati reali!" },
        { title: "2️⃣ Guida alle Fasce Elastiche", content: "Le fasce elastiche sono il tuo strumento segreto per un allenamento efficace. Il programma utilizza fasce ad anello chiuso da 60 cm, disponibili in diversi livelli di resistenza. Ogni colore corrisponde a un peso (verde: 2,27 kg; blu: 4,54 kg; gialla: 9,07 kg; rossa: 13,62 kg; nera: 18,16 kg). Utilizzarle correttamente ti garantirà il massimo beneficio per ogni esercizio! Ricorda che per alcuni esercizi che coinvolgono spinte verticali con carichi molto elevati (come la Military Press), le fasce da 60 cm potrebbero non essere ottimali come le fasce tubolari con maniglie, ma possono essere comunque utilizzate con il giusto posizionamento sotto i piedi." },
        { title: "3️⃣ Struttura del Programma", content: "Il programma è strategicamente diviso in 3 fasi da 4 settimane ciascuna. Ogni fase è progettata per progredire in termini di intensità e complessità, assicurandoti di costruire una base solida e di avanzare costantemente verso i tuoi obiettivi. Segui la progressione per massimizzare i risultati e prevenire stalli." },
        { title: "4️⃣ Riscaldamento", type: 'warmup' },
        { title: "5️⃣ Defaticamento", type: 'cooldown' },
  ];

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

          .program-container {
            min-height: 100vh;
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
          }

          .program-container::before {
            content: '';
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTEwIDBoLTEwdi0xMCBMMCAyMC41IDMuNSAyNCAwIDMwIDAgNDAgNSA0NSA1IDM1IDEwIDMwIDEwIDIwIDE1IDI1IDE1IDE1IDEwIDEwek0yMCAwaC0xMHYxMGgxMHYtMTB6bTEwIDBoLTEwdjEwaDEwdi0xMHptMTAgMGgtMTB2MTBoMTB2LTEwemm1MCAwaC0xMHYxMGgxMHYtMTB6bTEwIDBoLTEwdjEwaDEwdi0xMHptMTAgMGgtMTB2MTBoMTB2LTEwek0wIDMwdi0xMGgxMHYxMGgtMTB6bTEwIDBoLTEwdjEwaDEwdi0xMHptMTAgMGgtMTB2MTBoMTB2LTEwemm10IDBoLTEwdjEwaDEwdi0xMHptMTAgMGgtMTB2MTBoMTB2LTEwemm1MCAwaC0xMHYxMGgxMHYtTAwek00MCAwdi0xMGgxMHYxMHoiIGZpbGw9IiNmZmZmZmYwMSIvPjwvc3ZnPg==');
            opacity: 0.03;
            pointer-events: none;
            z-index: -1;
          }

          .header-section {
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
            gap: 1rem;
            position: relative;
            overflow: hidden;
          }

          .header-section::after {
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

          .header-title {
            font-size: 2.8rem;
            font-weight: 900;
            color: var(--light);
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            z-index: 2;
            letter-spacing: -0.5px;
          }
          @media (max-width: 767px) {
            .header-title {
              font-size: 2.2rem;
              text-align: center;
              width: 100%;
            }
          }

          .dashboard-button, .progress-button {
            padding: 1rem 2.2rem;
            color: white;
            font-weight: 700;
            border: none;
            border-radius: var(--radius-md);
            transition: var(--transition);
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 1px;
            position: relative;
            z-index: 2;
          }

          .dashboard-button {
             background: linear-gradient(135deg, var(--secondary), #cc5a00);
             box-shadow: 0 8px 20px rgba(255, 107, 0, 0.4);
          }
          .dashboard-button:hover {
            transform: translateY(-5px) scale(1.04);
            box-shadow: 0 12px 25px rgba(255, 107, 0, 0.5);
          }
           .dashboard-button:active {
            transform: translateY(-2px);
          }
         
          .progress-button {
             background: linear-gradient(135deg, var(--accent), #00b368);
             box-shadow: 0 8px 20px rgba(0, 224, 128, 0.4);
          }
          .progress-button:hover {
            transform: translateY(-5px) scale(1.04);
            box-shadow: 0 12px 25px rgba(0, 224, 128, 0.5);
          }
           .progress-button:active {
            transform: translateY(-2px);
          }

          .program-overview-card, .workout-card {
            width: 100%;
            max-width: 1200px;
            background: rgba(255, 255, 255, 0.12);
            backdrop-filter: blur(16px);
            border: var(--border);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-md);
            margin-bottom: 2.5rem;
            padding: 2.2rem;
            transition: var(--transition);
            overflow: hidden;
          }

          .program-overview-card:hover, .workout-card:hover {
            transform: translateY(-6px);
            box-shadow: var(--shadow-lg);
          }

          .overview-title, .workouts-title, .workout-day-title {
            font-size: 2.2rem;
            font-weight: 800;
            color: var(--light);
            margin-bottom: 1.8rem;
            text-align: center;
            position: relative;
          }

          .overview-title::after, .workouts-title::after, .workout-day-title::after {
            content: '';
            position: absolute;
            left: 50%;
            bottom: -10px;
            transform: translateX(-50%);
            width: 80px;
            height: 5px;
            background: linear-gradient(90deg, var(--secondary), var(--accent));
            border-radius: 10px;
          }

          .section-item {
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding: 1.2rem 0;
          }
          .section-item:last-child {
            border-bottom: none;
          }

          .section-button {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            text-align: left;
            font-weight: 600;
            font-size: 1.4rem;
            color: var(--light);
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.6rem 0;
            transition: var(--transition);
          }

          .section-button:hover {
            color: var(--accent);
            transform: translateX(8px);
          }

          .section-button span {
            font-size: 0.9rem;
            color: var(--gray);
            transition: transform 0.3s ease;
          }

          .section-button span.rotated {
            transform: rotate(180deg);
            color: var(--accent);
          }

          .section-content {
            margin-top: 1rem;
            color: rgba(255, 255, 255, 0.9);
            padding-left: 1.5rem;
            line-height: 1.8;
            font-weight: 400;
          }

          .section-content ul {
            list-style: none;
            padding-left: 0;
          }

          .section-content li {
            position: relative;
            padding-left: 1.8rem;
            margin: 0.6rem 0;
          }
          
          .section-content li.clickable-list-item {
             cursor: pointer;
             transition: all 0.2s ease-in-out;
             padding: 0.5rem 0.8rem;
             border-radius: var(--radius-sm);
             margin-left: -0.8rem;
          }
          
          .section-content li.clickable-list-item:hover {
              background-color: rgba(0, 224, 128, 0.15);
              color: var(--accent);
              transform: translateX(5px);
          }

          .section-content li::before {
            content: '•';
            color: var(--accent);
            font-size: 1.4rem;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
          
           .section-content li.clickable-list-item::before {
             top: calc(50% + 0.1rem);
           }
           
          .section-content p {
            margin-bottom: 1em;
          }
          .section-content strong {
            color: var(--accent);
            font-weight: 600;
          }
         
          .details-hint-message {
            text-align: center;
            font-size: 0.95rem;
            margin-bottom: 2rem;
            color: rgba(255, 255, 255, 0.7);
            font-style: italic;
          }

          .details-hint-message .link {
            color: var(--accent);
            text-decoration: underline;
            cursor: pointer;
            font-weight: 600;
            transition: color 0.2s ease;
          }

          .details-hint-message .link:hover {
            color: var(--light);
          }

          .week-selector-container {
            width: 100%;
            max-width: 1200px;
            overflow-x: auto;
            margin-bottom: 2.5rem;
            display: flex; /* MODIFICA: Aggiunto per permettere il centraggio del wrapper interno */
            scrollbar-width: thin;
            scrollbar-color: var(--secondary) transparent;
          }
          .week-selector-container::-webkit-scrollbar {
            height: 6px;
          }
          .week-selector-container::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
          }
          .week-selector-container::-webkit-scrollbar-thumb {
            background: var(--secondary);
            border-radius: 3px;
          }

          .week-buttons-wrapper {
            display: flex;
            gap: 1.2rem;
            padding: 0.8rem 24px; 
            min-width: fit-content;
            margin: 0 auto; /* MODIFICA: Centra il wrapper. Sostituisce justify-content */
          }

          .week-button {
            padding: 1rem 2rem;
            border-radius: var(--radius-md);
            font-weight: 700;
            font-size: 1.1rem;
            color: var(--light);
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            transition: var(--transition);
            white-space: nowrap;
          }

          .week-button.active {
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: white;
            box-shadow: 0 0 0 4px rgba(0, 224, 128, 0.3), var(--shadow-sm);
            transform: translateY(-3px) scale(1.05);
            font-weight: 800;
          }

          .week-button:hover:not(.active) {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
            box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);
          }
          
          .workouts-section {
            width: 100%;
            max-width: 1200px;
          }

          .workout-day-title {
            font-size: 1.9rem;
            color: var(--light);
          }

          .exercise-item {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            padding: 1.4rem;
            background: rgba(255, 255, 255, 0.08);
            border-radius: var(--radius-md);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: var(--transition);
            margin-bottom: 0.8rem;
          }

          .exercise-item.active-exercise {
            border-color: var(--primary);
            box-shadow: 0 0 15px rgba(0, 102, 255, 0.7);
            transform: scale(1.01);
          }

          @media (min-width: 640px) {
            .exercise-item {
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
            }
          }

          .exercise-item:hover:not(.active-exercise) {
            background: rgba(255, 255, 255, 0.15);
            transform: translateX(6px);
            border-left: 3px solid var(--accent);
          }

          .exercise-details-clickable-area {
            flex-grow: 1;
            cursor: pointer;
            padding: 0.5rem 0;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            position: relative;
          }
          .exercise-details-clickable-area:hover .exercise-name-display {
            color: var(--accent);
          }

          .exercise-name-display {
            transition: color 0.3s ease;
            font-weight: 600;
            font-size: 1.1rem;
          }
          .exercise-name-completed {
            text-decoration: line-through;
            color: var(--accent);
            font-weight: 600;
            opacity: 0.8;
          }

          .series-indicator-group {
            display: flex;
            gap: 0.4rem;
            margin-left: 0.8rem;
          }

          .series-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 2px solid var(--gray);
            background-color: transparent;
            transition: all 0.2s ease-in-out;
          }

          .series-dot.completed-dot {
            background-color: var(--accent);
            border-color: var(--accent);
          }

          .series-dot.active-dot {
            background: linear-gradient(45deg, var(--primary), var(--primary-dark));
            border-color: var(--primary);
            animation: pulse-active-dot 1s infinite alternate;
          }

          @keyframes pulse-active-dot {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(1.1); opacity: 0.8; }
          }

          .exercise-buttons-group {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
          }

          .exercise-button {
            padding: 0.7rem 1.4rem;
            border-radius: var(--radius-sm);
            border: none;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.95rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
            transition: var(--transition);
            min-width: 110px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
          }

          .exercise-button.disabled {
            background: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.5);
            cursor: not-allowed;
            box-shadow: none;
          }

          .exercise-button:not(.disabled) {
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: white;
          }

          .exercise-button.timer-active {
            background: linear-gradient(135deg, var(--secondary), #cc5a00);
            animation: pulse 1.5s infinite;
          }

          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(255, 107, 0, 0.4); }
            70% { box-shadow: 0 0 0 8px rgba(255, 107, 0, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 107, 0, 0); }
          }

          .exercise-button:not(.disabled):hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 16px rgba(0, 102, 255, 0.3);
          }

          .youtube-button {
            background: linear-gradient(135deg, #e60000, #b30000);
          }

          .youtube-button:hover:not(.disabled) {
            transform: translateY(-3px);
            box-shadow: 0 6px 16px rgba(230, 0, 0, 0.35);
          }

          .popup-overlay {
            position: fixed;
            inset: 0;
            background: linear-gradient(135deg, rgba(0, 102, 255, 0.6), rgba(18, 24, 38, 0.9));
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            backdrop-filter: blur(4px);
            padding: 1rem;
          }

          .popup-content {
            background: rgba(255, 255, 255, 0.98);
            color: var(--dark);
            padding: 2.5rem;
            border-radius: var(--radius-lg);
            width: 100%;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.5);
            position: relative;
            overflow: hidden;
          }

          .popup-content::before {
            content: '';
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 5px;
            background: linear-gradient(90deg, var(--secondary), var(--accent));
          }

          .popup-content h3 {
            font-size: 1.8rem;
            color: var(--primary);
            margin-bottom: 1rem;
            font-weight: 800;
          }

          .popup-content p {
            margin-bottom: 1.5rem;
            color: #333;
            font-size: 1.1rem;
            line-height: 1.6;
          }

          .popup-link {
            color: #e60000;
            text-decoration: none;
            font-weight: 600;
            display: inline-block;
            margin-top: 1rem;
          }
          .popup-link:hover {
            text-decoration: underline;
          }

          .popup-button-close, .popup-break-end-button {
            padding: 0.8rem 1.8rem;
            border: none;
            border-radius: var(--radius-sm);
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition);
            color: white;
            margin-top: 1rem;
          }

          .popup-button-close {
            background: #6c757d;
          }
          .popup-button-close:hover {
            background: #5a6268;
            transform: translateY(-2px);
          }

          .popup-break-end-button {
            background: linear-gradient(135deg, var(--accent), #00b368);
          }
          .popup-break-end-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 14px rgba(0, 224, 128, 0.4);
          }

          .exercise-control-popup {
            padding: 2rem 1.5rem;
          }
          .exercise-control-popup h3 {
            font-size: 1.8rem;
          }
          .exercise-popup-details {
            font-size: 0.9rem;
            color: #555;
            margin-bottom: 1.5rem;
          }
          .popup-actions-group {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-top: 1.5rem;
            width: 100%;
          }

          .exercise-popup-info {
            font-size: 0.95rem;
            text-align: left;
            color: #666;
            margin-bottom: 0.8rem;
            line-height: 1.5;
          }
          .exercise-popup-info strong {
            color: var(--primary-dark);
          }
        `}
      </style>

      <div className="program-container">
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="header-section"
        >
          <h1 className="header-title">Programma 12 Settimane</h1>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setCurrentView("dashboard")}
            className="dashboard-button"
          >
            Dashboard
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="program-overview-card"
        >
          <h2 className="overview-title">Panoramica del Programma</h2>
          {overviewSections.map((section, idx) => (
            <div key={idx} className="section-item">
              <button
                className="section-button"
                onClick={() => toggleSection(`section${idx}`)}
              >
                {section.title} <span className={expandedSection === `section${idx}` ? "rotated" : ""}>▼</span>
              </button>
              <AnimatePresence>
                {expandedSection === `section${idx}` && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="section-content"
                  >
                    {section.content ? (
                      <p>{section.content}</p>
                    ) : (
                      <ul>
                        {(section.type === 'warmup' ? warmUpExercisesData : coolDownExercisesData).map((ex, i) => (
                          <li
                            key={i}
                            className="clickable-list-item"
                            onClick={() => setInfoPopupContent(ex)}
                          >
                            {ex.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>

        <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="week-selector-container"
            ref={weekButtonsContainerRef}
        >
            <div className="week-buttons-wrapper">
                {programma.map((w, idx) => (
                <motion.button
                    key={w.settimana}
                    onClick={() => setCurrentWeek(idx)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + idx * 0.05, duration: 0.4 }}
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`week-button ${currentWeek === idx ? "active" : ""}`}
                >
                    Settimana {w.settimana}
                </motion.button>
                ))}
            </div>
        </motion.div>


        <div className="workouts-section">
          <h2 className="workouts-title">
            Settimana {programma[currentWeek].settimana} - {programma[currentWeek].fase}
          </h2>
          {programma[currentWeek].allenamenti.map((workout, wi) => (
            <motion.div
              key={wi}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 + wi * 0.1, duration: 0.6 }}
              className="workout-card"
            >
              <h3 className="workout-day-title">{workout.giorno}</h3>
              {workout.esercizi.map((ex, ei) => {
                const key = `w${currentWeek}_a${wi}_e${ei}`;
                const currentExerciseProgress = completed[key] || { completedSeriesCount: 0, isFinished: false, hasStartedCurrentSeries: false };
                const { completedSeriesCount, isFinished, hasStartedCurrentSeries } = currentExerciseProgress;
                const isAnyTimerActive = timer.active;

                return (
                  <motion.div
                    key={ei}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + ei * 0.05, duration: 0.4 }}
                    className={`exercise-item ${hasStartedCurrentSeries && !isFinished ? 'active-exercise' : ''}`}
                  >
                    <div
                      className="exercise-details-clickable-area"
                      onClick={() => setExerciseDetailsPopup(ex)}
                    >
                      <div>
                        <span className={`${isFinished ? "exercise-name-completed" : "exercise-name-display"}`}>
                          {ex.nome} ({ex.serie}x{ex.ripetizioni})
                          {ex.fascia && <span> {fasce[ex.fascia].emoji}</span>}
                        </span>
                      </div>
                      <SeriesIndicator
                        completed={completedSeriesCount}
                        total={ex.serie}
                        isCurrentActive={hasStartedCurrentSeries && completedSeriesCount < ex.serie}
                      />
                    </div>

                    <div className="exercise-buttons-group">
                       {!isFinished && (
                          <motion.button
                            onClick={() => handleStartSeries(currentWeek, wi, ei, ex)}
                            disabled={isAnyTimerActive && !(activeExerciseKeyInPopup === key)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`exercise-button ${isAnyTimerActive && !(activeExerciseKeyInPopup === key) ? "disabled" : ""}`}
                          >
                            {hasStartedCurrentSeries ? 'Continua' : 'Inizia'}
                          </motion.button>
                        )}
                        {isFinished && (
                            <motion.button className="exercise-button disabled" disabled>
                                ✔ Completato
                            </motion.button>
                        )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
            {infoPopupContent && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="popup-overlay"
                    onClick={() => setInfoPopupContent(null)}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="popup-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>{infoPopupContent.name}</h3>
                        <p style={{textAlign: 'left', whiteSpace: 'pre-wrap'}}>{infoPopupContent.description}</p>
                        <motion.button
                            onClick={() => setInfoPopupContent(null)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="popup-button-close"
                        >
                            Chiudi
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

        <AnimatePresence>
          {exerciseDetailsPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="popup-overlay"
              onClick={() => setExerciseDetailsPopup(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="popup-content"
                onClick={(e) => e.stopPropagation()}
              >
                <h3>{exerciseDetailsPopup.nome}</h3>
                <p className="exercise-popup-info"><strong>Serie x Ripetizioni:</strong> {exerciseDetailsPopup.serie}x{exerciseDetailsPopup.ripetizioni}</p>
                 {exerciseDetailsPopup.fascia && <p className="exercise-popup-info"><strong>Fascia:</strong> {fasce[exerciseDetailsPopup.fascia].emoji} {exerciseDetailsPopup.fascia} ({fasce[exerciseDetailsPopup.fascia].peso})</p>}
                {exerciseDetailsPopup.bandPlacement && <p className="exercise-popup-info"><strong>Posizionamento:</strong> {exerciseDetailsPopup.bandPlacement}</p>}
                {exerciseDetailsPopup.bandSuggestionDetail && <p className="exercise-popup-info"><strong>Suggerimento:</strong> {exerciseDetailsPopup.bandSuggestionDetail}</p>}
                {exerciseDetailsPopup.suggerimento && (
                  <a href={getYoutubeLink(exerciseDetailsPopup.suggerimento)} target="_blank" rel="noopener noreferrer" className="popup-link">
                    Guarda Video su YouTube
                  </a>
                )}
                <motion.button
                  onClick={() => setExerciseDetailsPopup(null)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="popup-button-close"
                >
                  Chiudi
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeExerciseInPopup && (
            <ExerciseControlPopup
              exercise={activeExerciseInPopup}
              exerciseKey={activeExerciseKeyInPopup}
              completedState={completed}
              timerState={timer}
              onCompleteSeries={handleCompleteSeries}
              onSkipBreak={skipBreak}
              onFinishExercise={handleFinishExercise}
              onClose={handleFinishExercise}
              fasce={fasce}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showBreakEndPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="popup-overlay"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="popup-content"
              >
                <h3>Tempo scaduto!</h3>
                <p>La tua pausa per "{timer.exerciseName}" è terminata. Puoi continuare!</p>
                <motion.button
                  onClick={() => {
                    setShowBreakEndPopup(false);
                    setTimer(prev => ({ ...prev, workoutKey: null, pauseDuration: 0, exerciseName: '' }));
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="popup-break-end-button"
                >
                  Continua
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Program;
