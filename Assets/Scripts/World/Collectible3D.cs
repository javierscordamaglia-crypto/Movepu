using UnityEngine;

/// <summary>
/// Oggetto collezionabile 3D che ruota e cambia materiale in base allo stato di sync.
/// </summary>
public class Collectible3D : MonoBehaviour
{
    [Header("Informazioni Risorsa")]
    public string resourceName = "Cristallo";
    public int baseAmount = 10;

    [Header("Materiali")]
    public Material normalMaterial;
    public Material syncMaterial;

    private MeshRenderer _meshRenderer;
    private PlayerResonance _playerResonance;

    private void Start()
    {
        _meshRenderer = GetComponent<MeshRenderer>();

        // Trova il player per controllare lo stato di sync
        GameObject player = GameObject.FindGameObjectWithTag("Player");
        if (player != null)
        {
            _playerResonance = player.GetComponent<PlayerResonance>();
        }
    }

    private void Update()
    {
        // Rotazione su se stesso
        transform.Rotate(Vector3.up, 90f * Time.deltaTime, Space.World);

        // Aggiorna materiale in base allo stato di sync
        UpdateMaterial();
    }

    private void UpdateMaterial()
    {
        if (_meshRenderer == null || _playerResonance == null) return;

        bool isSync = _playerResonance.IsInSync;

        if (isSync && syncMaterial != null)
        {
            _meshRenderer.material = syncMaterial;
        }
        else if (!isSync && normalMaterial != null)
        {
            _meshRenderer.material = normalMaterial;
        }
    }

    /// <summary>
    /// Raccolgi l'oggetto, calcola il bonus e distruggi.
    /// </summary>
    public void Collect()
    {
        if (_playerResonance == null)
        {
            GameObject player = GameObject.FindGameObjectWithTag("Player");
            if (player != null)
            {
                _playerResonance = player.GetComponent<PlayerResonance>();
            }
        }

        bool isSync = _playerResonance != null && _playerResonance.IsInSync;

        // Calcola moltiplicatore bonus
        float multiplier = 1.0f;
        if (GameManager.Instance != null && _playerResonance != null)
        {
            multiplier = GameManager.Instance.GetBonusMultiplier(_playerResonance.Frequency);
        }

        int finalAmount = Mathf.RoundToInt(baseAmount * multiplier);

        // Feedback UI
        if (UIManager.Instance != null)
        {
            UIManager.Instance.ShowCollectFeedback(resourceName, finalAmount, isSync);
        }

        Debug.Log($"Raccolto: {finalAmount} {resourceName} (Sync: {isSync}, Moltiplicatore: {multiplier})");

        // Distruggi oggetto
        Destroy(gameObject);
    }
}
