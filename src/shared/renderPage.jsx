import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './styles.css'

export function renderPage(Page) {
  const queryClient = new QueryClient()

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <Page />
      </QueryClientProvider>
    </StrictMode>,
  )
}
