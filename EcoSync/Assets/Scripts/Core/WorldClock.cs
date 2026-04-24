using UnityEngine;

namespace EcoSync.Core
{
    public class WorldClock : MonoBehaviour
    {
        private static WorldClock _instance;
        public static WorldClock Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = FindFirstObjectByType<WorldClock>();
                }
                return _instance;
            }
        }

        [Header("Configurazione Giorno")]
        [Range(1, 9)]
        public int currentDay = 1;
        public float dayDurationSeconds = 300f; // 5 minuti di default

        private float _timer;

        public int CurrentDay => currentDay;

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

        private void Update()
        {
            _timer += Time.deltaTime;

            if (_timer >= dayDurationSeconds)
            {
                _timer = 0f;
                currentDay++;

                if (currentDay > 9)
                {
                    currentDay = 1;
                }

                Debug.Log($"[WorldClock] Cambio giorno: {currentDay}");
            }
        }
    }
}
