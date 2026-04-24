using UnityEngine;

/// <summary>
/// Gestisce l'interazione del player con gli oggetti raccoglibili.
/// Raycast dal centro schermo, distanza 4m, tasto E.
/// </summary>
public class PlayerInteractor : MonoBehaviour
{
    [Header("Interazione")]
    public float interactDistance = 4f;
    public LayerMask collectibleLayer;

    private Camera _mainCamera;

    private void Start()
    {
        _mainCamera = Camera.main;
    }

    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.E))
        {
            TryInteract();
        }
    }

    private void TryInteract()
    {
        if (_mainCamera == null) return;

        Ray ray = new Ray(_mainCamera.transform.position, _mainCamera.transform.forward);

        if (Physics.Raycast(ray, out RaycastHit hit, interactDistance, collectibleLayer))
        {
            Collectible3D collectible = hit.collider.GetComponent<Collectible3D>();

            if (collectible != null)
            {
                collectible.Collect();
            }
        }
        else if (Physics.Raycast(ray, out hit, interactDistance))
        {
            // Fallback: controlla qualsiasi collider senza layer mask
            Collectible3D collectible = hit.collider.GetComponent<Collectible3D>();

            if (collectible != null)
            {
                collectible.Collect();
            }
        }
    }
}
