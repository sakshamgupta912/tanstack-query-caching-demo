async function request(path, options) {
  const response = await fetch(path, options)
  const body = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(body?.message ?? `Request failed (${response.status})`)
  }

  return body
}

export function getMaterials() {
  return request('/api/materials')
}

export function getMaterial(id) {
  return request(`/api/materials/${id}`)
}

// The server decides the material's next status and returns the updated material.
export function runWorkflowAction({ id, action }) {
  return request(`/api/materials/${id}/${action}`, { method: 'POST' })
}
