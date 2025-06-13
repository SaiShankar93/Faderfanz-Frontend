import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const CreateEvent = () => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/create-event')
  }, [navigate])

  return (
    <div>
      
    </div>
  )
}

export default CreateEvent
