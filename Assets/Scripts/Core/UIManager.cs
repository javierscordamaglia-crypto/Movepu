using UnityEngine;
using TMPro;

/// <summary>
/// Singleton per la gestione dell'interfaccia utente.
/// </summary>
public class UIManager : MonoBehaviour
{
    public static UIManager Instance { get; private set; }

    [Header("UI References")]
    public TextMeshProUGUI syncText;
    public TextMeshProUGUI collectFeedbackText;
    public TextMeshProUGUI dayInfoText;
    public TextMeshProUGUI playerFreqText;

    private float _feedbackTimer;
    private string _currentFeedbackText = "";
    private Color _currentFeedbackColor = Color.white;

    private void Awake()
    {
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject);
            return;
        }
        Instance = this;
    }

    private void Update()
    {
        if (_feedbackTimer > 0f)
        {
            _feedbackTimer -= Time.deltaTime;
            if (collectFeedbackText != null)
            {
                collectFeedbackText.text = _currentFeedbackText;
                collectFeedbackText.color = _currentFeedbackColor;
            }
        }
        else
        {
            if (collectFeedbackText != null)
            {
                collectFeedbackText.text = "";
            }
        }
    }

    /// <summary>
    /// Aggiorna tutti i testi UI con le informazioni correnti.
    /// </summary>
    public void UpdateUI(int currentDay, int playerFreq, bool isSync)
    {
        if (dayInfoText != null)
        {
            dayInfoText.text = $"Giorno: {currentDay}/9";
        }

        if (playerFreqText != null)
        {
            playerFreqText.text = $"Frequenza: {playerFreq}";
        }

        if (syncText != null)
        {
            syncText.text = isSync ? "SYNC ATTIVO" : "NON SYNC";
            syncText.color = isSync ? Color.green : Color.red;
        }
    }

    /// <summary>
    /// Mostra feedback temporaneo per la raccolta oggetti.
    /// </summary>
    public void ShowCollectFeedback(string resourceName, int amount, bool isSync)
    {
        _currentFeedbackText = $"+{amount} {resourceName}";
        _currentFeedbackColor = isSync ? Color.yellow : Color.white;
        _feedbackTimer = 2f;
    }
}
