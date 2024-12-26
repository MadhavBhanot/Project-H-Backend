import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import GitHubLogin from 'react-github-login'

const GitHub = () => {
  const navigate = useNavigate()
  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID // GitHub client ID

  // Function to handle the successful GitHub login
  const handleGitHubLogin = async (response) => {
    console.log(response)
    try {
      // Check if the response contains the code
      if (response.code) {
        // Send the code to your backend for exchange
        const res = await axios.post('http://localhost:5001/api/auth/github', {
          code: response.code, // Send the code received from GitHub
        })

        console.log(res)

        // If the backend returns success (200 status), store the token and user data
        if (res.status === 200) {
          localStorage.setItem('user', JSON.stringify(res.data)) // Store user data

          // Redirect to the dashboard
          navigate('/dashboard')
        } else {
          // Store error message in localStorage
          localStorage.setItem(
            'errorMessage',
            'Failed to authenticate with GitHub.',
          )
          navigate('/error') // Redirect to the error page
        }
      }
    } catch (error) {
      console.error('Error during GitHub login:', error)
      // Store error message in localStorage
      localStorage.setItem(
        'errorMessage',
        error.message || 'An error occurred during login.',
      )
      navigate('/error') // Redirect to the error page
    }
  }

  // Function to handle failed login
  const handleGitHubLoginFailure = (error) => {
    console.error('GitHub login failed:', error)
    navigate('/error') // You can customize this to any route you prefer
  }

  return (
    <div>
      <GitHubLogin
        clientId={clientId} // Your GitHub client ID
        onSuccess={handleGitHubLogin} // Success handler
        onFailure={handleGitHubLoginFailure} // Failure handler
        redirectUri="http://localhost:5173/dashboard" // Redirect URI after login
      />
    </div>
  )
}

export default GitHub
