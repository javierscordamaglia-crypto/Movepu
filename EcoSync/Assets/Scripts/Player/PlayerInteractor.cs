using UnityEngine;

namespace EcoSync.Player
{
    public class PlayerInteractor : MonoBehaviour
    {
        [Header("Configurazione Interazione")]
        public float interactDistance = 4f;
        public KeyCode interactKey = KeyCode.E;

        private Camera _playerCamera;

        private void Awake()
        {
            _playerCamera = GetComponentInChildren<Camera>();
            if (_playerCamera == null)
            {
                _playerCamera = FindFirstObjectByType<Camera>();
            }
        }

        private void Update()
        {
            if (Input.GetKeyDown(interactKey))
            {
                TryInteract();
            }
        }

        private void TryInteract()
        {
            if (_playerCamera == null) return;

            Ray ray = new Ray(_playerCamera.transform.position, _playerCamera.transform.forward);
            RaycastHit hit;

            if (Physics.Raycast(ray, out hit, interactDistance))
            {
                Collectible3D collectible = hit.collider.GetComponent<Collectible3D>();
                if (collectible != null)
                {
                    collectible.Collect();
                }
            }
        }
    }
}
