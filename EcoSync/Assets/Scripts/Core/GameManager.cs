using UnityEngine;

namespace EcoSync.Core
{
    public class GameManager : MonoBehaviour
    {
        private static GameManager _instance;
        public static GameManager Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = FindFirstObjectByType<GameManager>();
                }
                return _instance;
            }
        }

        private void Awake()
        {
            if (_instance != null && _instance != this)
            {
                Destroy(gameObject);
                return;
            }
            _instance = this;
            DontDestroyOnLoad(gameObject);
        }

        /// <summary>
        /// Restituisce 2.0f se il player è in sync con il giorno corrente, 1.0f altrimenti
        /// </summary>
        public float GetBonusMultiplier(int frequency)
        {
            if (WorldClock.Instance == null) return 1.0f;
            
            bool isSync = frequency == WorldClock.Instance.CurrentDay;
            return isSync ? 2.0f : 1.0f;
        }
    }
}
