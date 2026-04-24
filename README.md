# EcoSync - Progetto Unity 6.3

## 📁 Struttura del Progetto

```
Assets/
├── Scripts/
│   ├── Core/
│   │   ├── GameManager.cs
│   │   ├── WorldClock.cs
│   │   └── UIManager.cs
│   ├── Player/
│   │   ├── FirstPersonController.cs
│   │   ├── PlayerResonance.cs
│   │   ├── PlayerInteractor.cs
│   │   └── CameraSwitcher.cs
│   ├── World/
│   │   └── Collectible3D.cs
│   └── Utilities/
│       └── HandSway.cs
├── Prefabs/
│   ├── Player.prefab
│   └── Collectible_Crystal.prefab
├── Materials/
│   ├── Ground.mat
│   ├── Crystal_Normal.mat
│   └── Crystal_Sync.mat
└── Scenes/
    └── MainScene.unity
```

## ⚙️ Configurazione Unity

### 1. Creare il Player

1. Crea un GameObject vuoto chiamato "Player"
2. Aggiungi i seguenti componenti:
   - **CharacterController**
     - Radius: 0.5
     - Height: 2
     - Center: (0, 1, 0)
   - **FirstPersonController**
     - playerCamera: assegna la Main Camera
   - **PlayerResonance**
     - Frequency: scegli un valore 1-9 (es. 5)
   - **PlayerInteractor**
     - interactDistance: 4
   - **CameraSwitcher**
     - playerCamera: assegna la Main Camera
     - hands: assegna l'oggetto Hands (vedi sotto)
3. Imposta il Tag del GameObject su "Player"

### 2. Configurare la Main Camera

1. Crea la Main Camera come figlio di "Player"
2. Position iniziale: (0, 0, 0)
3. Assicurati che il Tag sia "MainCamera"

### 3. Creare le Mani (Hands)

1. Crea un GameObject vuoto chiamato "Hands" come figlio della Main Camera
2. All'interno di Hands, crea due Cylinder:
   - **LeftArm**: Position (-0.3, -0.2, 0.5), Rotation (90, 0, 0)
   - **RightArm**: Position (0.3, -0.2, 0.5), Rotation (90, 0, 0)
3. Rimuovi i Collider dai Cylinder
4. Aggiungi lo script **HandSway** al GameObject "Hands"

### 4. Creare WorldClock

1. Crea un GameObject vuoto chiamato "WorldClock"
2. Aggiungi lo script **WorldClock**
3. Imposta dayDurationSeconds: 300 (5 minuti per test, ridurre per debug)

### 5. Creare GameManager

1. Crea un GameObject vuoto chiamato "GameSystem"
2. Aggiungi lo script **GameManager**

### 6. Creare UIManager

1. Crea un Canvas (GameObject → UI → Canvas)
2. Aggiungi 4 TextMeshProUGUI al Canvas:
   - **syncText**: mostra stato SYNC
   - **collectFeedbackText**: mostra feedback raccolta
   - **dayInfoText**: mostra giorno corrente
   - **playerFreqText**: mostra frequenza player
3. Crea un GameObject vuoto chiamato "UIManager"
4. Aggiungi lo script **UIManager** e assegna i riferimenti ai testi

### 7. Creare il Terreno (Ground)

1. Crea un 3D Object → Plane
2. Scale: (10, 1, 10)
3. Crea un Material in Assets/Materials chiamato "Ground.mat"
4. Assegna il materiale al Plane

### 8. Creare i Collectible

1. Crea un 3D Object → Sphere o Cylinder
2. Aggiungi lo script **Collectible3D**
3. Configura:
   - resourceName: "Cristallo"
   - baseAmount: 10
   - normalMaterial: Crystal_Normal.mat
   - syncMaterial: Crystal_Sync.mat
4. Salva come Prefab in Assets/Prefabs/Collectible_Crystal.prefab
5. Distribuisci vari cristalli nella scena

## 🎮 Controlli

| Tasto | Azione |
|-------|--------|
| W/A/S/D | Movimento relativo alla direzione del player |
| Mouse Orizzontale | Ruota il personaggio (asse Y) |
| Mouse Verticale | Guarda su/giù (camera locale) |
| Spazio | Salto |
| Shift Sinistro | Corsa |
| V | Toggle Prima/Terza Persona |
| E | Interagisci/Raccogli oggetti |

## 🔧 Meccaniche di Gioco

### Resonance System
- Ogni player ha una **Frequency** (1-9) impostabile nell'Inspector
- Il **WorldClock** cicla automaticamente i giorni da 1 a 9
- Quando Frequency == CurrentDay → **SYNC ATTIVO**
- Bonus: risorse raddoppiate (x2) quando in sync

### Collectibles
- I cristalli ruotano su se stessi
- Cambiano colore/materiale quando il player è in sync
- Raccogli con **E** (distanza massima: 4m)
- Feedback UI temporaneo con colore diverso per sync/non-sync

### Camera System
- **FPS**: Camera a (0, 1.6, 0) locale al player
- **TPS**: Camera orbita dietro al player con LookAt sul busto
- Transizione fluida con Lerp
- Mani visibili in ENTRAMBE le modalità

## ✅ Test di Funzionalità

1. **Play** → Muovi il mouse: il personaggio ruota sull'asse Y
2. **WASD** → Il movimento è relativo alla direzione del personaggio
3. **Spazio** → Salto con gravità funzionante
4. **V** → Transizione fluida FPS/TPS, controllo identico in entrambe
5. **Mani** → Visibili in prima e terza persona
6. **Cristallo + E** → Raccolta con bonus x2 se Frequency == WorldDay
7. **UI** → Mostra giorno corrente, frequenza player e stato sync

## 📝 Note Tecniche

- Tutti gli Singleton usano `FindFirstObjectByType<T>()` per riferimenti runtime
- `IsInSync` è una PROPRIETÀ bool, chiamare SENZA parentesi: `player.IsInSync`
- Codice formattato con 4 spazi per indentazione
- Compatibile con Unity 6.3
