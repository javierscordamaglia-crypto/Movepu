using UnityEngine;

/// <summary>
/// Singleton per la gestione del ciclo giorno/notte e della frequenza mondiale.
/// CurrentDay cicla da 1 a 9 automaticamente.
/// </summary>
public class WorldClock : MonoBehaviour
{
    public static WorldClock Instance { get; private set; }

    [Tooltip("Durata di ogni giorno in secondi")]
    public float dayDurationSeconds = 300f;

    /// <summary>
    /// Giorno corrente (1-9)
    /// </summary>
    public int CurrentDay { get; private set; } = 1;

    private float _timer;

    private void Awake()
    {
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject);
            return;
        }
        Instance = this;
        DontDestroyOnLoad(gameObject);
    }

    private void Update()
    {
        _timer += Time.deltaTime;

        if (_timer >= dayDurationSeconds)
        {
            _timer = 0f;
            CurrentDay++;

            if (CurrentDay > 9)
            {
                CurrentDay = 1;
            }

            Debug.Log($"[WorldClock] Nuovo giorno: {CurrentDay}");
        }
    }
}
