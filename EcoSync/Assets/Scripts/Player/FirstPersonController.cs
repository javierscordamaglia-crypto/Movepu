using UnityEngine;

namespace EcoSync.Player
{
    [RequireComponent(typeof(CharacterController))]
    public class FirstPersonController : MonoBehaviour
    {
        [Header("Camera")]
        public Transform playerCamera;
        public float mouseSensitivity = 2f;
        public float minVerticalAngle = -80f;
        public float maxVerticalAngle = 80f;

        [Header("Movimento")]
        public float walkSpeed = 5f;
        public float runSpeed = 8f;
        public float jumpForce = 7f;
        public float gravity = -20f;

        private CharacterController _characterController;
        private float _verticalRotation = 0f;
        private Vector3 _velocity;
        private bool _isGrounded;

        private void Awake()
        {
            _characterController = GetComponent<CharacterController>();

            if (playerCamera == null)
            {
                Camera mainCam = FindFirstObjectByType<Camera>();
                if (mainCam != null)
                {
                    playerCamera = mainCam.transform;
                }
            }

            // Nascondi il cursore
            Cursor.lockState = CursorLockMode.Locked;
            Cursor.visible = false;
        }

        private void Update()
        {
            HandleLook();
            HandleMovement();
            HandleJump();
        }

        private void HandleLook()
        {
            if (playerCamera == null) return;

            float mouseX = Input.GetAxis("Mouse X") * mouseSensitivity;
            float mouseY = Input.GetAxis("Mouse Y") * mouseSensitivity;

            // Ruota il personaggio sull'asse Y (orizzontale)
            transform.Rotate(Vector3.up, mouseX);

            // Ruota la camera localmente sull'asse X (verticale)
            _verticalRotation -= mouseY;
            _verticalRotation = Mathf.Clamp(_verticalRotation, minVerticalAngle, maxVerticalAngle);

            playerCamera.localRotation = Quaternion.Euler(_verticalRotation, 0f, 0f);
        }

        private void HandleMovement()
        {
            float horizontal = Input.GetAxis("Horizontal");
            float vertical = Input.GetAxis("Vertical");

            bool isRunning = Input.GetKey(KeyCode.LeftShift);
            float currentSpeed = isRunning ? runSpeed : walkSpeed;

            // Movimento relativo alla direzione del personaggio
            Vector3 moveDirection = transform.right * horizontal + transform.forward * vertical;
            moveDirection = moveDirection.normalized;

            _characterController.Move(moveDirection * currentSpeed * Time.deltaTime);
        }

        private void HandleJump()
        {
            _isGrounded = _characterController.isGrounded;

            if (_isGrounded && _velocity.y < 0)
            {
                _velocity.y = -2f;
            }

            if (Input.GetKeyDown(KeyCode.Space) && _isGrounded)
            {
                _velocity.y = jumpForce;
            }

            _velocity.y += gravity * Time.deltaTime;
            _characterController.Move(_velocity * Time.deltaTime);
        }
    }
}
