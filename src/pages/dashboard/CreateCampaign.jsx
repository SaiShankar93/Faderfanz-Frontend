import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const CreateCampaign = () => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/raise-fund')
  }, [navigate])

  return (
    <div>
      
    </div>
  )
}

export default CreateCampaign