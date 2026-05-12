import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import GuestNfcCheck from './GuestNfcCheck.jsx'

const root = createRoot(document.getElementById('root'))

if (window.location.pathname === '/ceknfc') {
  root.render(
    <StrictMode>
      <GuestNfcCheck />
    </StrictMode>
  )
} else {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}
