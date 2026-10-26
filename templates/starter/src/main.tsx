import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@nomosui/react/tokens/theme.css'
import '@nomosui/react/tokens/tokens.generated.css'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
