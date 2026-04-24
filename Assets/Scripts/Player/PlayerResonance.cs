using UnityEngine;
using System;

/// <summary>
/// Gestisce la risonanza del player, le statistiche e lo stato di sync.
/// </summary>
public class PlayerResonance : MonoBehaviour
{
    [Header("Risonanza")]
    [Range(1, 9)]
    public int Frequency = 5;

    [Header("Statistiche")]
    [Range(0, 100)]
    public float Hunger = 100f;
    [Range(0, 100)]
    public float Thirst = 100f;
    [Range(0, 100)]
    public float Fatigue = 0f;
    [Range(0, 100)]
    public float Stress = 0f;

    [Header("Degrado statistiche (per secondo)")]
    public float hungerDecay = 0.5f;
    public float thirstDecay = 0.7f;
    public float fatigueGrowth = 0.2f;
    public float stressGrowth = 0.3f;

    /// <summary>
    /// True se la frequenza del player corrisponde al giorno corrente.
    /// </summary>
    public bool IsInSync
    {
        get
        {
            if (WorldClock.Instance == null)
            {
                return false;
            }
            return Frequency == WorldClock.Instance.CurrentDay;
        }
    }

    public event Action OnStatsChanged;

    private void Update()
    {
        // Degrado statistiche
        Hunger -= hungerDecay * Time.deltaTime;
        Thirst -= thirstDecay * Time.deltaTime;
        Fatigue += fatigueGrowth * Time.deltaTime;
        Stress += stressGrowth * Time.deltaTime;

        // Clamp valori
        Hunger = Mathf.Clamp(Hunger, 0f, 100f);
        Thirst = Mathf.Clamp(Thirst, 0f, 100f);
        Fatigue = Mathf.Clamp(Fatigue, 0f, 100f);
        Stress = Mathf.Clamp(Stress, 0f, 100f);

        // Aggiorna UI
        if (UIManager.Instance != null)
        {
            UIManager.Instance.UpdateUI(
                WorldClock.Instance != null ? WorldClock.Instance.CurrentDay : 1,
                Frequency,
                IsInSync
            );
        }
    }
}
