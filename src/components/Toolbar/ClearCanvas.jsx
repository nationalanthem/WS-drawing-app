import React from 'react'
import { IconButton } from '@material-ui/core'
import { BackspaceOutlined } from '@material-ui/icons/'

export const ClearCanvas = () => {
  return (
    <IconButton>
      <BackspaceOutlined />
    </IconButton>
  )
}
