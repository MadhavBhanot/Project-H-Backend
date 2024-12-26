import React, { useEffect, useState } from 'react'

const Error = () => {
  const [errorMessage, setErrorMessage] = useState(null)

  const data = localStorage.getItem('errorMessage')
  useEffect(() => {
    localStorage.removeItem('errorMessage')
    if (data) {
      setErrorMessage(data)
    }
  }, [data])
  return (
    <>
      <h1>Error While Authenticating</h1>
      <p>{errorMessage}</p>
      <button>
        <a href="/">Try Again</a>
      </button>
    </>
  )
}

export default Error
