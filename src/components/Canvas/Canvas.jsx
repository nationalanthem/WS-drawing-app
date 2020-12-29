import React, { useState, useLayoutEffect } from 'react'
import './Canvas.css'

const Canvas = () => {
  const [width, setWidth] = useState(window.innerWidth)
  const [height, setHeight] = useState(window.innerHeight)

  useLayoutEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
      setHeight(window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return <canvas id="canvas" width={width} height={height} />
}

export default Canvas
