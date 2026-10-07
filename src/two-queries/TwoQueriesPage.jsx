import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMaterial, getMaterials, runWorkflowAction } from '../shared/api.js'
import { MaterialRowView } from '../shared/MaterialRowView.jsx'
import { MaterialsPage } from '../shared/MaterialsPage.jsx'

// Two caches: the list says which rows exist, and each row owns its own detail cache.
const materialKeys = {
  list: ['materials', 'list'],
  detail: (id) => ['materials', 'detail', id],
}

// Reads every row from its own detail cache, seeded once from the list response.
function useMaterialDetails(listMaterials) {
  return useQueries({
    queries: listMaterials.map((material) => ({
      queryKey: materialKeys.detail(material.id),
      queryFn: () => getMaterial(material.id),
      initialData: material,
      staleTime: Infinity,
    })),
    combine: (results) => results.map((result) => result.data),
  })
}

function MaterialRow({ material }) {
  const queryClient = useQueryClient()

  const actionMutation = useMutation({
    mutationFn: runWorkflowAction,
    // Mark only this row stale; it is on screen, so TanStack Query refetches just this row.
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: materialKeys.detail(material.id),
        exact: true,
      })
    },
  })

  return (
    <MaterialRowView
      material={material}
      onAction={(action) => actionMutation.mutate({ id: material.id, action })}
      isProcessing={actionMutation.isPending}
      error={actionMutation.error}
    />
  )
}

export default function TwoQueriesPage() {
  const listQuery = useQuery({
    queryKey: materialKeys.list,
    queryFn: getMaterials,
  })

  // Sections are grouped from the row caches, because the list cache keeps old statuses.
  const materials = useMaterialDetails(listQuery.data ?? [])

  return (
    <MaterialsPage
      currentPage="two-queries"
      description="A list query provides the rows, and each row has its own detail query. An action refetches only that row (POST, then GET /api/materials/:id), so it moves to its new section."
      materials={materials}
      isPending={listQuery.isPending}
      error={listQuery.error}
      renderRow={(material) => <MaterialRow key={material.id} material={material} />}
    />
  )
}
