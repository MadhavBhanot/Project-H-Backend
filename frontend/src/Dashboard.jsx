import React, { useEffect, useState } from 'react'

const Dashboard = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    console.log('\nstoredUser', storedUser)
    if (storedUser) {
      setData(JSON.parse(storedUser))
    }
  }, [])

  if (!data) {
    return <h1>Loading...</h1> // Fallback UI while data is being loaded
  }

  return (
    <>
      <h1>Authentication Successful</h1>
      <h2>Hello, {data.user.name}</h2>
      {data.password && <h3>Generated Password: {data.password}</h3>}
    </>
  )
}

export default Dashboard
