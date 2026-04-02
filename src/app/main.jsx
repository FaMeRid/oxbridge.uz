import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import '@/styles/globals.css'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'test-client-id'

// Проверяем, что контейнер существует
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

// Проверяем, не был ли уже создан root
if (!rootElement._react_root) {
  const root = ReactDOM.createRoot(rootElement)
  rootElement._react_root = root
  
  root.render(
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  )
}