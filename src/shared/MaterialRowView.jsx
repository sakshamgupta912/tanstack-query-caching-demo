const nextStepByStatus = {
  Active: { action: 'restock', label: 'Request restock' },
  Pending: { action: 'approve', label: 'Approve order' },
  Completed: { action: 'reset', label: 'Reset' },
}

export function MaterialRowView({ material, onAction, isProcessing, error }) {
  const nextStep = nextStepByStatus[material.status]

  return (
    <tr>
      <td>{material.id}</td>
      <td>{material.materialNumber}</td>
      <td className="description-cell">{material.description}</td>
      <td>{material.manufacturer}</td>
      <td>{material.manufacturerItem}</td>
      <td>{material.uom}</td>
      <td>{material.quantity}</td>
      <td>{material.parLevel}</td>
      <td>{material.onOrder || '—'}</td>
      <td>
        <span className={`risk risk-${material.risk.toLowerCase()}`}>
          {material.risk}
        </span>
      </td>
      <td>
        <div className="action-cell">
          <button
            type="button"
            className="action-button"
            disabled={isProcessing}
            onClick={() => onAction(nextStep.action)}
          >
            {isProcessing ? 'Processing...' : nextStep.label}
          </button>
          {error && (
            <span className="action-error" role="alert">
              {error.message}
            </span>
          )}
        </div>
      </td>
    </tr>
  )
}
