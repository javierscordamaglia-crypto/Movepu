using UnityEngine;

/// <summary>
/// Singleton per la gestione delle regole di gioco e moltiplicatori.
/// </summary>
public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }

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

    /// <summary>
    /// Restituisce 2.0f se il player è in sync con il giorno corrente, 1.0f altrimenti.
    /// </summary>
    public float GetBonusMultiplier(int frequency)
    {
        if (WorldClock.Instance == null)
        {
            return 1.0f;
        }

        bool isSync = (frequency == WorldClock.Instance.CurrentDay);
        return isSync ? 2.0f : 1.0f;
    }
}
