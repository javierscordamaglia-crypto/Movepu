using UnityEngine;
using TMPro;

namespace EcoSync.Core
{
    public class UIManager : MonoBehaviour
    {
        private static UIManager _instance;
        public static UIManager Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = FindFirstObjectByType<UIManager>();
                }
                return _instance;
            }
        }

        [Header("Riferimenti UI")]
        public TextMeshProUGUI syncText;
        public TextMeshProUGUI collectFeedbackText;
        public TextMeshProUGUI dayInfoText;
        public TextMeshProUGUI playerFreqText;

        private float _feedbackTimer;
        private string _feedbackMessage;
        private Color _feedbackColor;
        private bool _showFeedback;

        private void Awake()
        {
            if (_instance != null && _instance != this)
            {
                Destroy(gameObject);
                return;
            }
            _instance = this;
        }

        private void Update()
        {
            if (_showFeedback)
            {
                _feedbackTimer -= Time.deltaTime;
                if (_feedbackTimer <= 0f)
                {
                    _showFeedback = false;
                    if (collectFeedbackText != null)
                    {
                        collectFeedbackText.text = "";
                    }
                }
            }

            UpdateUI();
        }

        public void UpdateUI()
        {
            PlayerResonance playerResonance = FindFirstObjectByType<PlayerResonance>();
            WorldClock worldClock = WorldClock.Instance;

            if (worldClock != null && dayInfoText != null)
            {
                dayInfoText.text = $"Giorno: {worldClock.CurrentDay}/9";
            }

            if (playerResonance != null)
            {
                if (playerFreqText != null)
                {
                    playerFreqText.text = $"Frequenza: {playerResonance.Frequency}";
                }

                if (syncText != null)
                {
                    bool isSync = playerResonance.IsInSync;
                    syncText.text = isSync ? "SYNC ATTIVO" : "NON IN SYNC";
                    syncText.color = isSync ? Color.green : Color.red;
                }
            }

            if (_showFeedback && collectFeedbackText != null)
            {
                collectFeedbackText.text = _feedbackMessage;
                collectFeedbackText.color = _feedbackColor;
            }
        }

        public void ShowCollectFeedback(string message, bool isSync)
        {
            _feedbackMessage = message;
            _feedbackColor = isSync ? Color.green : Color.yellow;
            _feedbackTimer = 2f;
            _showFeedback = true;
        }
    }
}
