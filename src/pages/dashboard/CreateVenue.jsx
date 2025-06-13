import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const CreateVenue = () => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/register-venue')
  }, [navigate])

  return (
    <div>
      
    </div>
  )
}

export default CreateVenue
