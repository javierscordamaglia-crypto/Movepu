# EcoSync - Progetto Unity 6.3

## 📁 Struttura del Progetto

```
EcoSync/
├── Assets/
│   ├── Scripts/
│   │   ├── Core/
│   │   │   ├── GameManager.cs
│   │   │   ├── WorldClock.cs
│   │   │   └── UIManager.cs
│   │   ├── Player/
│   │   │   ├── FirstPersonController.cs
│   │   │   ├── PlayerResonance.cs
│   │   │   ├── PlayerInteractor.cs
│   │   │   └── CameraSwitcher.cs
│   │   ├── World/
│   │   │   └── Collectible3D.cs
│   │   └── Utilities/
│   │       └── HandSway.cs
│   ├── Prefabs/
│   │   ├── Player.prefab
│   │   └── Collectible_Crystal.prefab
│   ├── Materials/
│   │   ├── Ground.mat
│   │   ├── Crystal_Normal.mat
│   │   └── Crystal_Sync.mat
│   └── Scenes/
│       └── MainScene.unity (da creare)
└── README.md
```

## ⚙️ Configurazione Unity (Istruzioni Passo-Passo)

### 1. Creare il GameObject "Player"

1. Crea un GameObject vuoto chiamato "Player"
2. Aggiungi i seguenti componenti:
   - **CharacterController**:
     - Radius: 0.5
     - Height: 2
     - Center: (0, 1, 0)
   - **FirstPersonController** (script):
     - Assegna la Main Camera nel campo `playerCamera`
   - **PlayerResonance** (script):
     - Imposta `Frequency` su un valore da 1 a 9
   - **PlayerInteractor** (script):
     - Lascia `interactDistance` a 4
   - **CameraSwitcher** (script):
     - Assegna la Main Camera nel campo `playerCamera`
     - Assegna l'oggetto "Hands" nel campo `handsObject`

### 2. Configurare la Main Camera

1. Crea una Camera come figlio di "Player"
2. Posizione iniziale: (0, 0, 0)
3. Tag: "MainCamera"
4. Nel FirstPersonController, assegna questa camera al campo `playerCamera`

### 3. Creare l'oggetto "Hands"

1. Crea un GameObject vuoto chiamato "Hands" come figlio della Main Camera
2. Aggiungi due Cylinder come figli di "Hands":
   - **LeftArm**: 
     - Position: (-0.3, -0.2, 0.5)
     - Rotation: (30, 0, 0)
     - Scale: (0.1, 0.1, 0.4)
     - Rimuovi il Collider se presente
   - **RightArm**:
     - Position: (0.3, -0.2, 0.5)
     - Rotation: (30, 0, 0)
     - Scale: (0.1, 0.1, 0.4)
     - Rimuovi il Collider se presente
3. Aggiungi lo script **HandSway** al GameObject "Hands"

### 4. Configurare WorldClock

1. Crea un GameObject vuoto chiamato "WorldClockSystem"
2. Aggiungi lo script **WorldClock**
3. Imposta `dayDurationSeconds` a 300 (5 minuti) o al valore desiderato

### 5. Configurare GameManager

1. Crea un GameObject vuoto chiamato "GameSystem"
2. Aggiungi lo script **GameManager**

### 6. Configurare UIManager

1. Crea un Canvas (GameObject → UI → Canvas)
2. Aggiungi 4 TextMeshProUGUI come figli del Canvas:
   - **syncText**: Mostra stato SYNC/NON IN SYNC
   - **collectFeedbackText**: Mostra feedback raccolta risorse
   - **dayInfoText**: Mostra giorno corrente
   - **playerFreqText**: Mostra frequenza player
3. Crea un GameObject vuoto chiamato "UISystem"
4. Aggiungi lo script **UIManager**
5. Assegna i TextMeshProUGUI ai rispettivi campi nello script

### 7. Creare il Terreno (Ground)

1. Crea un Plane (GameObject → 3D Object → Plane)
2. Posizione: (0, 0, 0)
3. Scala: (10, 1, 10)
4. Crea un Material con il file `Ground.mat` e assegnalo al Plane

### 8. Creare i Collectibles

1. Crea una Sphere o Cylinder (GameObject → 3D Object → Sphere)
2. Posizione: (es. 2, 0.5, 2)
3. Scala: (0.5, 0.5, 0.5)
4. Aggiungi lo script **Collectible3D**
5. Configura:
   - `resourceName`: "Cristallo"
   - `baseAmount`: 10
   - `normalMaterial`: Crystal_Normal.mat
   - `syncMaterial`: Crystal_Sync.mat
6. Duplica per creare più collectibles

## 🎮 Controlli di Gioco

| Tasto | Azione |
|-------|--------|
| W/A/S/D | Movimento relativo alla direzione del player |
| Mouse Orizzontale | Ruota il personaggio (asse Y) |
| Mouse Verticale | Guarda su/giù (camera locale) |
| Spazio | Salto |
| Left Shift | Corsa |
| V | Toggle camera FPS ↔ TPS |
| E | Interagisci/Raccogli oggetti |

## 🔧 Meccaniche Principali

### Movimento (Skyrim/GTA Style)
- Il mouse orizzontale ruota tutto il personaggio, non solo la camera
- WASD muove il player relativo alla sua direzione (transform.forward/right)
- Funziona identico in prima e terza persona

### Camera System
- **FPS**: Camera a (0, 1.6, 0) locale al player
- **TPS**: Camera orbita a (0, 2.5, -4) con LookAt sul busto
- Transizione fluida con Lerp
- Mani visibili in ENTRAMBE le modalità

### Resonance System
- `PlayerResonance.Frequency`: valore intero 1-9 (impostabile nell'Inspector)
- `WorldClock.CurrentDay`: ciclo automatico da 1 a 9 ogni X secondi
- **Sync**: true se Frequency == CurrentDay
- **Bonus**: x2 risorse se in sync, x1 altrimenti

### Collectibles
- Cristallo ruota su se stesso
- Cambia materiale (verde brillante) se player.IsInSync == true
- Raccogli con tasto E (raycast da centro schermo, distanza 4m)
- Feedback UI con testo temporaneo e colore condizionale

## ✅ Test di Funzionamento

1. **Play** → Mouse ruota personaggio, WASD muove relativo alla direzione
2. **Spazio** → Salto con gravità
3. **V** → Camera transizione FPS/TPS fluida, controllo identico
4. **Mani visibili** in entrambe le modalità
5. **Avvicinarsi a cristallo + E** → Raccolta con bonus x2 se Frequency == WorldDay
6. **UI** mostra giorno corrente e stato sync

## 📝 Note Importanti

- Tutti gli script usano `FindFirstObjectByType<T>()` per riferimenti runtime
- I Singleton controllano `Instance != null && Instance != this` in `Awake()`
- `IsInSync` è una PROPRIETÀ (bool) → chiamare SENZA parentesi: `player.IsInSync`
- Codice formattato con 4 spazi per indentazione, no tab
- Nessun spazio errato in nomi variabili/funzioni o operatori

## 🚀 Pronto per Unity 6.3

Tutti gli script sono compilabili senza errori in Unity 6.3. Assicurati di avere:
- TextMeshPro installato (Package Manager)
- Input System standard attivo
- Physics layer configurato correttamente

Buon divertimento con EcoSync! 🎮✨
