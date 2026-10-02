import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './app'
import { LanguageProvider } from './i18n'
import './styles.css'

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root')

createRoot(root).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)
