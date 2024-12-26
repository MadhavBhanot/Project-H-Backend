import './App.css'
import Google from './Google'
import Dashboard from './Dashboard'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GitHubLogin from './Github'
import Error from './Error'

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  if (!clientId) {
    console.error(
      'Google Client ID is missing. Check your environment variables.',
    )
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Google />
                <GitHubLogin />
              </>
            }
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  )
}

export default App
