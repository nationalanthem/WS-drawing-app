import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import './Canvas.css'

const Canvas = () => {
  const [width, setWidth] = useState(window.innerWidth)
  const [height, setHeight] = useState(window.innerHeight)

  const canvasRef = useRef()
  const [ctx, setCtx] = useState()
  const [isMouseDown, setIsMouseDown] = useState()

  useLayoutEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
      setHeight(window.innerHeight)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (canvasRef.current) setCtx(canvasRef.current.getContext('2d'))
  }, [canvasRef])

  useEffect(() => {
    const handleMouseDown = (e) => {
      setIsMouseDown(true)
      ctx.beginPath()
      ctx.moveTo(e.clientX, e.clientY)
    }

    if (ctx) {
      canvasRef.current.addEventListener('mousedown', handleMouseDown)
      return () => canvasRef.current.removeEventListener('mousedown', handleMouseDown)
    }
  }, [ctx])

  useEffect(() => {
    const handleMouseUp = () => {
      setIsMouseDown(false)
    }

    if (ctx) {
      canvasRef.current.addEventListener('mouseup', handleMouseUp)
      return () => canvasRef.current.removeEventListener('mouseup', handleMouseUp)
    }
  }, [ctx])

  useEffect(() => {
    const handleMove = (e) => {
      if (isMouseDown) {
        ctx.lineTo(e.clientX, e.clientY)
        ctx.stroke()
      }
    }

    if (ctx) {
      canvasRef.current.addEventListener('mousemove', handleMove)
      return () => canvasRef.current.removeEventListener('mousemove', handleMove)
    }
  }, [ctx, isMouseDown])

  return <canvas ref={canvasRef} id="canvas" width={width} height={height} />
}

export default Canvas
