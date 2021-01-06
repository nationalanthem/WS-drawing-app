import React from 'react'
import { useSelector } from 'react-redux'
import { Slide, Typography } from '@material-ui/core'
import PersonIcon from '@material-ui/icons/Person'
import './UserCounter.css'

const UserCounter = () => {
  const displayToolbar = useSelector((state) => state.tools.displayToolbar)
  const userCounter = useSelector((state) => state.network.connectedUsers)

  return (
    <Slide in={displayToolbar} transition={500} direction="up">
      <div className="users">
        <PersonIcon />
        <Typography>{userCounter}</Typography>
      </div>
    </Slide>
  )
}

export default UserCounter
