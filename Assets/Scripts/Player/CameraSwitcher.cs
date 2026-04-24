using UnityEngine;

/// <summary>
/// Gestisce il cambio di camera tra prima e terza persona.
/// Tasto V per toggle fluido.
/// </summary>
public class CameraSwitcher : MonoBehaviour
{
    [Header("Riferimenti")]
    public Transform playerCamera;
    public Transform hands;

    [Header("Offset Camera")]
    public Vector3 fpsOffset = new Vector3(0f, 1.6f, 0f);
    public Vector3 tpsOffset = new Vector3(0f, 2.5f, -4f);

    [Header("Orbita TPS")]
    public float orbitYaw = 0f;
    public float orbitPitch = 10f;
    public float orbitDistance = 5f;

    [Header("Transizione")]
    public float transitionSpeed = 5f;

    private bool _isTPS = false;
    private Vector3 _currentOffset;
    private Transform _playerTransform;

    private void Start()
    {
        if (playerCamera == null)
        {
            playerCamera = Camera.main.transform;
        }

        _playerTransform = transform.root;
        _currentOffset = fpsOffset;

        // Posiziona camera iniziale
        playerCamera.localPosition = fpsOffset;
        playerCamera.localRotation = Quaternion.identity;
    }

    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.V))
        {
            _isTPS = !_isTPS;
        }

        Vector3 targetOffset = _isTPS ? tpsOffset : fpsOffset;
        _currentOffset = Vector3.Lerp(_currentOffset, targetOffset, Time.deltaTime * transitionSpeed);

        if (_isTPS)
        {
            // Modalità TPS: camera orbita dietro al player
            playerCamera.localPosition = _currentOffset;

            // Calcola posizione orbita
            float yawRad = orbitYaw * Mathf.Deg2Rad;
            float pitchRad = orbitPitch * Mathf.Deg2Rad;

            Vector3 orbitPosition = new Vector3(
                Mathf.Sin(yawRad) * Mathf.Cos(pitchRad),
                Mathf.Sin(pitchRad),
                Mathf.Cos(yawRad) * Mathf.Cos(pitchRad)
            ) * orbitDistance;

            playerCamera.position = _playerTransform.position + orbitPosition;
            playerCamera.LookAt(_playerTransform.position + Vector3.up * 1.2f);
        }
        else
        {
            // Modalità FPS: camera locale al player
            playerCamera.localPosition = _currentOffset;
            playerCamera.localRotation = Quaternion.identity;
        }

        // Mani sempre attive in entrambe le modalità
        if (hands != null)
        {
            hands.gameObject.SetActive(true);
        }
    }
}
