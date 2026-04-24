using UnityEngine;

namespace EcoSync.Utilities
{
    public class HandSway : MonoBehaviour
    {
        [Header("Sway da Mouse")]
        public float swayAmount = 0.5f;
        public float swaySmoothness = 10f;

        [Header("Bobbing quando si muove")]
        public float bobAmount = 0.3f;
        public float bobSpeed = 10f;

        [Header("Configurazione")]
        public KeyCode runKey = KeyCode.LeftShift;

        private Vector3 _originalPosition;
        private float _defaultBobSpeed;

        private void Awake()
        {
            _originalPosition = transform.localPosition;
            _defaultBobSpeed = bobSpeed;
        }

        private void Update()
        {
            HandleMouseSway();
            HandleMovementBobbing();
        }

        private void HandleMouseSway()
        {
            float mouseX = Input.GetAxis("Mouse X") * swayAmount;
            float mouseY = Input.GetAxis("Mouse Y") * swayAmount;

            Vector3 targetPosition = _originalPosition + new Vector3(-mouseX, -mouseY, 0f);

            transform.localPosition = Vector3.Lerp(
                transform.localPosition,
                targetPosition,
                swaySmoothness * Time.deltaTime
            );
        }

        private void HandleMovementBobbing()
        {
            PlayerResonance player = FindFirstObjectByType<PlayerResonance>();
            if (player == null) return;

            float horizontal = Input.GetAxis("Horizontal");
            float vertical = Input.GetAxis("Vertical");

            bool isMoving = Mathf.Abs(horizontal) > 0.1f || Mathf.Abs(vertical) > 0.1f;
            bool isRunning = Input.GetKey(runKey);

            float currentBobSpeed = isRunning ? bobSpeed * 1.5f : _defaultBobSpeed;

            if (isMoving)
            {
                float bobX = Mathf.Sin(Time.time * currentBobSpeed) * bobAmount;
                float bobY = Mathf.Abs(Mathf.Cos(Time.time * currentBobSpeed)) * bobAmount;

                Vector3 bobOffset = new Vector3(bobX, bobY, 0f);

                transform.localPosition = Vector3.Lerp(
                    transform.localPosition,
                    _originalPosition + bobOffset,
                    swaySmoothness * Time.deltaTime
                );
            }
        }
    }
}
