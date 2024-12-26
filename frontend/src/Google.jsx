import React from 'react'
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Google = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  const navigate = useNavigate()

  const retrieveDataFromBackend = async (codeResponse) => {
    try {
      console.log('Authorization Code:', codeResponse.code)

      // Send authorization code to the backend for token exchange
      const response = await axios.post(
        'http://localhost:5001/api/auth/google',
        { code: codeResponse.code }, // Make sure you're sending the proper data
      )

      // Check for success status
      if (response.status === 200) {
        // Assuming your backend responds with user data and possibly a JWT
        localStorage.setItem('user', JSON.stringify(response.data))
        navigate('/dashboard')
      } else {
        alert('Error during authentication')
      }
    } catch (error) {
      console.error('Error during backend call:', error)
      alert('Something went wrong')
    }
  }

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      retrieveDataFromBackend(codeResponse)
    },
    onError: (error) => {
      console.error('Login failed:', error)
    },
    flow: 'auth-code', // Correct flow for Google OAuth
  })

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <button onClick={() => login()}>Sign in with Google</button>
    </GoogleOAuthProvider>
  )
}

export default Google
