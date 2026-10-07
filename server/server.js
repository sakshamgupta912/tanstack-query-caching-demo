import { setTimeout as delay } from 'node:timers/promises'
import express from 'express'
import { seedMaterials } from './data.js'
import { workflowActions } from './workflow.js'

const app = express()
const port = process.env.PORT || 3001

// Simulates backend processing so the "Processing..." state is visible.
const PROCESSING_DELAY_MS = 600

const materials = structuredClone(seedMaterials)

function findMaterial(id) {
  return materials.find((material) => material.id === Number(id))
}

function sendError(response, status, message) {
  return response.status(status).json({ message })
}

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' })
})

app.get('/api/materials', (_request, response) => {
  response.json(materials)
})

app.get('/api/materials/:id', (request, response) => {
  const material = findMaterial(request.params.id)

  if (!material) return sendError(response, 404, 'Material not found')

  return response.json(material)
})

app.post('/api/materials/:id/:action', async (request, response) => {
  const material = findMaterial(request.params.id)
  const actionName = request.params.action
  const action = Object.hasOwn(workflowActions, actionName) ? workflowActions[actionName] : null

  if (!material) return sendError(response, 404, 'Material not found')
  if (!action) return sendError(response, 404, `Unknown action "${actionName}"`)

  await delay(PROCESSING_DELAY_MS)

  if (material.status !== action.allowedFrom) {
    return sendError(response, 409, `Cannot ${actionName} a material that is ${material.status}`)
  }

  action.apply(material)
  return response.json(material)
})

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`)
})
