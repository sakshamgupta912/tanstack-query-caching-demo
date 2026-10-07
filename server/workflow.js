import { seedMaterials } from './data.js'

// Business rule: orders for these risk levels must be approved before stock is received.
const RISKS_NEEDING_APPROVAL = new Set(['Severe', 'High'])

function receiveOrder(material) {
  material.quantity += material.onOrder
  material.onOrder = 0
  material.status = 'Completed'
}

export const workflowActions = {
  restock: {
    allowedFrom: 'Active',
    apply(material) {
      material.onOrder = Math.max(material.parLevel - material.quantity, 0)

      if (RISKS_NEEDING_APPROVAL.has(material.risk)) {
        material.status = 'Pending'
      } else {
        receiveOrder(material)
      }
    },
  },

  approve: {
    allowedFrom: 'Pending',
    apply: receiveOrder,
  },

  reset: {
    allowedFrom: 'Completed',
    apply(material) {
      const original = seedMaterials.find((item) => item.id === material.id)
      Object.assign(material, structuredClone(original))
    },
  },
}
