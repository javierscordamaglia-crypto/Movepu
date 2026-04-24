using UnityEngine;

/// <summary>
/// Controller del player basato su CharacterController.
/// Movimento stile Skyrim/GTA: il mouse ruota il personaggio sull'asse Y.
/// </summary>
[RequireComponent(typeof(CharacterController))]
public class FirstPersonController : MonoBehaviour
{
    [Header("Camera")]
    public Transform playerCamera;

    [Header("Impostazioni Movimento")]
    public float walkSpeed = 5f;
    public float runSpeed = 8f;
    public float rotationSpeed = 10f;

    [Header("Salto e Gravità")]
    public float jumpForce = 7f;
    public float gravity = -20f;

    [Header("Look Verticale")]
    public float lookSensitivity = 2f;
    public float minLookAngle = -60f;
    public float maxLookAngle = 60f;

    private CharacterController _controller;
    private Vector3 _velocity;
    private float _verticalRotation = 0f;
    private bool _isGrounded;

    private void Start()
    {
        _controller = GetComponent<CharacterController>();

        if (playerCamera == null)
        {
            playerCamera = Camera.main.transform;
        }

        // Nascondi cursore
        Cursor.lockState = CursorLockMode.Locked;
        Cursor.visible = false;
    }

    private void Update()
    {
        HandleLook();
        HandleMovement();
        HandleJump();

        // Applica gravità
        if (!_isGrounded)
        {
            _velocity.y += gravity * Time.deltaTime;
        }

        _controller.Move(_velocity * Time.deltaTime);
    }

    private void HandleLook()
    {
        if (playerCamera == null) return;

        // Rotazione orizzontale del personaggio (asse Y)
        float mouseX = Input.GetAxis("Mouse X") * lookSensitivity;
        transform.Rotate(Vector3.up, mouseX * rotationSpeed * Time.deltaTime, Space.World);

        // Rotazione verticale della camera (locale, clamped)
        float mouseY = Input.GetAxis("Mouse Y") * lookSensitivity;
        _verticalRotation -= mouseY;
        _verticalRotation = Mathf.Clamp(_verticalRotation, minLookAngle, maxLookAngle);

        playerCamera.localRotation = Quaternion.Euler(_verticalRotation, 0f, 0f);
    }

    private void HandleMovement()
    {
        _isGrounded = _controller.isGrounded;

        if (_isGrounded && _velocity.y < 0f)
        {
            _velocity.y = -2f;
        }

        float horizontal = Input.GetAxis("Horizontal");
        float vertical = Input.GetAxis("Vertical");

        // Movimento relativo alla direzione del personaggio
        Vector3 moveDirection = transform.TransformDirection(new Vector3(horizontal, 0f, vertical));

        // Velocità (corsa con Shift)
        float speed = Input.GetKey(KeyCode.LeftShift) ? runSpeed : walkSpeed;

        if (moveDirection.magnitude > 0f)
        {
            _controller.Move(moveDirection.normalized * speed * Time.deltaTime);
        }
    }

    private void HandleJump()
    {
        if (Input.GetKeyDown(KeyCode.Space) && _isGrounded)
        {
            _velocity.y = jumpForce;
        }
    }
}
