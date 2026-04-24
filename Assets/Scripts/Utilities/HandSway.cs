using UnityEngine;

/// <summary>
/// Gestisce il movimento oscillatorio delle mani (sway e bobbing).
/// </summary>
public class HandSway : MonoBehaviour
{
    [Header("Sway da Mouse")]
    public float swayAmount = 0.5f;
    public float swaySmoothness = 10f;

    [Header("Bobbing da Movimento")]
    public float bobAmount = 0.3f;
    public float bobSpeed = 10f;
    public float walkThreshold = 0.1f;

    private Vector3 _originalPosition;
    private float _bobTimer;
    private Vector3 _targetSway;

    private void Start()
    {
        _originalPosition = transform.localPosition;
    }

    private void Update()
    {
        HandleSway();
        HandleBobbing();
    }

    private void HandleSway()
    {
        float mouseX = Input.GetAxis("Mouse X");
        float mouseY = Input.GetAxis("Mouse Y");

        _targetSway.x = -mouseX * swayAmount;
        _targetSway.y = -mouseY * swayAmount;

        Vector3 swayPosition = Vector3.Lerp(transform.localPosition, _targetSway, Time.deltaTime * swaySmoothness);
        transform.localPosition = new Vector3(swayPosition.x, swayPosition.y, _originalPosition.z);
    }

    private void HandleBobbing()
    {
        float horizontal = Input.GetAxis("Horizontal");
        float vertical = Input.GetAxis("Vertical");

        float moveInput = Mathf.Abs(horizontal) + Mathf.Abs(vertical);

        if (moveInput > walkThreshold)
        {
            _bobTimer += Time.deltaTime * bobSpeed;
            float bobOffset = Mathf.Sin(_bobTimer) * bobAmount;

            transform.localPosition = new Vector3(
                transform.localPosition.x,
                _originalPosition.y + bobOffset,
                transform.localPosition.z
            );
        }
        else
        {
            _bobTimer = 0f;
            // Ritorna alla posizione originale con lerp
            transform.localPosition = Vector3.Lerp(transform.localPosition, _originalPosition, Time.deltaTime * 5f);
        }
    }
}
