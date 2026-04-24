using UnityEngine;

namespace EcoSync.Player
{
    public class CameraSwitcher : MonoBehaviour
    {
        [Header("Riferimenti")]
        public Transform playerCamera;
        public Transform handsObject;

        [Header("Offset Camera")]
        public Vector3 fpsOffset = new Vector3(0f, 1.6f, 0f);
        public Vector3 tpsOffset = new Vector3(0f, 2.5f, -4f);

        [Header("Orbita TPS")]
        public float orbitYaw = 0f;
        public float orbitPitch = 10f;
        public float orbitSpeed = 5f;

        [Header("Transizione")]
        public float transitionSpeed = 5f;

        private bool _isTPS = false;
        private Transform _playerTransform;
        private Vector3 _currentOffset;

        private void Awake()
        {
            _playerTransform = transform.parent;
            _currentOffset = fpsOffset;

            if (playerCamera == null)
            {
                Camera cam = FindFirstObjectByType<Camera>();
                if (cam != null)
                {
                    playerCamera = cam.transform;
                }
            }
        }

        private void Update()
        {
            if (Input.GetKeyDown(KeyCode.V))
            {
                ToggleCamera();
            }

            HandleCameraPosition();
            HandleHandsVisibility();
        }

        private void ToggleCamera()
        {
            _isTPS = !_isTPS;
            _currentOffset = _isTPS ? tpsOffset : fpsOffset;
        }

        private void HandleCameraPosition()
        {
            if (_playerTransform == null || playerCamera == null) return;

            Vector3 targetPosition;

            if (_isTPS)
            {
                // Gestione orbita per TPS
                orbitYaw += Input.GetAxis("Mouse X") * orbitSpeed * Time.deltaTime;
                orbitPitch -= Input.GetAxis("Mouse Y") * orbitSpeed * Time.deltaTime;
                orbitPitch = Mathf.Clamp(orbitPitch, -30f, 60f);

                Quaternion rotation = Quaternion.Euler(orbitPitch, orbitYaw, 0f);
                Vector3 offset = rotation * new Vector3(0f, 0f, -tpsOffset.z);

                targetPosition = _playerTransform.position + new Vector3(0f, tpsOffset.y, 0f) + offset;

                playerCamera.position = Vector3.Lerp(playerCamera.position, targetPosition, transitionSpeed * Time.deltaTime);
                playerCamera.LookAt(_playerTransform.position + new Vector3(0f, 1.6f, 0f));
            }
            else
            {
                // FPS: camera locale al player
                targetPosition = _playerTransform.position + _playerTransform.TransformDirection(fpsOffset);
                playerCamera.position = Vector3.Lerp(playerCamera.position, targetPosition, transitionSpeed * Time.deltaTime);

                // Mantieni la rotazione verticale della camera FPS
                float currentX = playerCamera.localEulerAngles.x;
                if (currentX > 180f) currentX -= 360f;
                playerCamera.localRotation = Quaternion.Euler(currentX, 0f, 0f);
            }
        }

        private void HandleHandsVisibility()
        {
            if (handsObject != null)
            {
                // Mani sempre visibili in entrambe le modalità
                handsObject.gameObject.SetActive(true);
            }
        }
    }
}
