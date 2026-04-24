using UnityEngine;

namespace EcoSync.World
{
    public class Collectible3D : MonoBehaviour
    {
        [Header("Configurazione Risorsa")]
        public string resourceName = "Cristallo";
        public int baseAmount = 10;

        [Header("Materiali")]
        public Material normalMaterial;
        public Material syncMaterial;

        private MeshRenderer _meshRenderer;
        private bool _isCollected = false;

        private void Awake()
        {
            _meshRenderer = GetComponent<MeshRenderer>();
            UpdateMaterial();
        }

        private void Update()
        {
            if (!_isCollected)
            {
                // Rotazione su se stesso
                transform.Rotate(Vector3.up, 90f * Time.deltaTime);
            }
        }

        private void UpdateMaterial()
        {
            if (_meshRenderer == null) return;

            PlayerResonance player = FindFirstObjectByType<PlayerResonance>();
            if (player != null && player.IsInSync)
            {
                if (syncMaterial != null)
                {
                    _meshRenderer.material = syncMaterial;
                }
            }
            else
            {
                if (normalMaterial != null)
                {
                    _meshRenderer.material = normalMaterial;
                }
            }
        }

        public void Collect()
        {
            if (_isCollected) return;
            _isCollected = true;

            PlayerResonance player = FindFirstObjectByType<PlayerResonance>();
            bool isSync = player != null && player.IsInSync;

            float multiplier = 1.0f;
            if (GameManager.Instance != null)
            {
                multiplier = GameManager.Instance.GetBonusMultiplier(player != null ? player.Frequency : 0);
            }

            int finalAmount = Mathf.RoundToInt(baseAmount * multiplier);

            Debug.Log($"[Collectible] Raccolto: {resourceName} x{finalAmount} (Sync: {isSync}, Bonus: {multiplier}x)");

            if (UIManager.Instance != null)
            {
                string feedbackText = $"+{finalAmount} {resourceName}";
                UIManager.Instance.ShowCollectFeedback(feedbackText, isSync);
            }

            Destroy(gameObject);
        }

        private void OnEnable()
        {
            InvokeRepeating(nameof(UpdateMaterial), 0f, 0.5f);
        }

        private void OnDisable()
        {
            CancelInvoke(nameof(UpdateMaterial));
        }
    }
}
