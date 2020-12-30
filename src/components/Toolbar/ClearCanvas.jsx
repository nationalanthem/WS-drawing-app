import React from 'react'
import { IconButton } from '@material-ui/core'
import { BackspaceOutlined } from '@material-ui/icons/'
import { useDispatch } from 'react-redux'
import { setClearState } from '../../features'

export const ClearCanvas = () => {
  const dispatch = useDispatch()

  const handleClick = () => {
    dispatch(setClearState(true))
  }

  return (
    <IconButton onClick={handleClick}>
      <BackspaceOutlined />
    </IconButton>
  )
}
