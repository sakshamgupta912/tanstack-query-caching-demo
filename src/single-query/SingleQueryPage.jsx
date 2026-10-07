import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMaterials, runWorkflowAction } from '../shared/api.js'
import { MaterialRowView } from '../shared/MaterialRowView.jsx'
import { MaterialsPage } from '../shared/MaterialsPage.jsx'

// One cache: the list is the only source of truth, and every section reads from it.
const materialKeys = {
  list: ['materials', 'list'],
}

function MaterialRow({ material }) {
  const queryClient = useQueryClient()

  const actionMutation = useMutation({
    mutationFn: runWorkflowAction,
    // The response is the updated material, so write it into the list without another request.
    onSuccess: (updatedMaterial) => {
      queryClient.setQueryData(materialKeys.list, (materials) =>
        materials.map((item) =>
          item.id === updatedMaterial.id ? updatedMaterial : item,
        ),
      )
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

export default function SingleQueryPage() {
  const listQuery = useQuery({
    queryKey: materialKeys.list,
    queryFn: getMaterials,
    staleTime: 10 * 60 * 1000,
  })

  return (
    <MaterialsPage
      currentPage="single-query"
      description="One list query is the only cache. An action's response is written into the list with setQueryData (POST only), so the row moves to its new section."
      materials={listQuery.data ?? []}
      isPending={listQuery.isPending}
      error={listQuery.error}
      renderRow={(material) => <MaterialRow key={material.id} material={material} />}
    />
  )
}
