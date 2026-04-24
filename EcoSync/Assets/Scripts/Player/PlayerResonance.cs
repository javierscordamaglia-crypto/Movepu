using UnityEngine;
using System;

namespace EcoSync.Player
{
    public class PlayerResonance : MonoBehaviour
    {
        [Header("Risonanza")]
        [Range(1, 9)]
        public int Frequency = 5;

        [Header("Stats")]
        public float hunger = 100f;
        public float thirst = 100f;
        public float fatigue = 0f;
        public float stress = 0f;

        [Header("Degrado Stats")]
        public float hungerDecayRate = 0.5f;
        public float thirstDecayRate = 0.7f;
        public float fatigueGrowthRate = 0.2f;
        public float stressGrowthRate = 0.3f;

        public bool IsInSync
        {
            get
            {
                if (WorldClock.Instance == null) return false;
                return Frequency == WorldClock.Instance.CurrentDay;
            }
        }

        public event Action OnStatsChanged;

        private void Update()
        {
            DegradeStats();
        }

        private void DegradeStats()
        {
            float deltaTime = Time.deltaTime;

            hunger -= hungerDecayRate * deltaTime;
            thirst -= thirstDecayRate * deltaTime;
            fatigue += fatigueGrowthRate * deltaTime;
            stress += stressGrowthRate * deltaTime;

            // Clamp valori tra 0 e 100
            hunger = Mathf.Clamp(hunger, 0f, 100f);
            thirst = Mathf.Clamp(thirst, 0f, 100f);
            fatigue = Mathf.Clamp(fatigue, 0f, 100f);
            stress = Mathf.Clamp(stress, 0f, 100f);

            OnStatsChanged?.Invoke();
        }

        public void RestoreHunger(float amount)
        {
            hunger = Mathf.Clamp(hunger + amount, 0f, 100f);
            OnStatsChanged?.Invoke();
        }

        public void RestoreThirst(float amount)
        {
            thirst = Mathf.Clamp(thirst + amount, 0f, 100f);
            OnStatsChanged?.Invoke();
        }

        public void Rest(float amount)
        {
            fatigue = Mathf.Clamp(fatigue - amount, 0f, 100f);
            OnStatsChanged?.Invoke();
        }

        public void ReduceStress(float amount)
        {
            stress = Mathf.Clamp(stress - amount, 0f, 100f);
            OnStatsChanged?.Invoke();
        }
    }
}
