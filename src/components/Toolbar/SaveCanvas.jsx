import React from 'react'
import { IconButton, Link } from '@material-ui/core'
import { Save } from '@material-ui/icons/'
import { useSelector } from 'react-redux'

export const SaveCanvas = () => {
  const canvasDataUrl = useSelector((state) => state.canvas.canvasDataUrl)

  return (
    <Link
      download="my_greatest_work"
      href={canvasDataUrl ? canvasDataUrl : undefined}
      component={IconButton}
    >
      <Save />
    </Link>
  )
}
