import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import './Canvas.css'
import { useSelector, useDispatch } from 'react-redux'
import { setClearState, setCanvasDataUrl, setToolbarDisplay } from '../../features'

const Canvas = () => {
  const [width, setWidth] = useState(window.innerWidth)
  const [height, setHeight] = useState(window.innerHeight)

  const dispatch = useDispatch()
  const lineWidth = useSelector((state) => state.tools.lineWidth)
  const strokeStyle = useSelector((state) => state.tools.strokeStyle)
  const readyToClear = useSelector((state) => state.canvas.readyToClear)

  const canvasRef = useRef()
  const [ctx, setCtx] = useState()
  const [canvasState, setCanvasState] = useState()
  const [isMouseDown, setIsMouseDown] = useState()

  useLayoutEffect(() => {
    const handleResize = () => {
      setCanvasState(canvasRef.current.toDataURL())
      setWidth(window.innerWidth)
      setHeight(window.innerHeight)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (canvasRef?.current) {
      setCtx(canvasRef.current.getContext('2d'))
    }
  }, [canvasRef])

  useEffect(() => {
    if (readyToClear) {
      ctx.clearRect(0, 0, width, height)
      dispatch(setClearState(false))
    }
  }, [readyToClear])

  useEffect(() => {
    if (ctx && canvasState) {
      const img = new Image()
      img.src = canvasState
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height)
      }
    }
  }, [ctx, canvasState])

  useEffect(() => {
    if (ctx) {
      const handleMouseDown = (e) => {
        setIsMouseDown(true)
        dispatch(setToolbarDisplay(false))
        ctx.beginPath()
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.moveTo(e.clientX, e.clientY)
      }

      canvasRef.current.addEventListener('mousedown', handleMouseDown)
      return () => canvasRef.current.removeEventListener('mousedown', handleMouseDown)
    }
  }, [ctx])

  useEffect(() => {
    if (ctx) {
      const handleMouseUp = () => {
        setIsMouseDown(false)
        dispatch(setToolbarDisplay(true))
        dispatch(setCanvasDataUrl(canvasRef.current.toDataURL()))
      }
      canvasRef.current.addEventListener('mouseup', handleMouseUp)
      return () => canvasRef.current.removeEventListener('mouseup', handleMouseUp)
    }
  }, [ctx])

  useEffect(() => {
    if (ctx) {
      const handleMove = (e) => {
        if (isMouseDown) {
          ctx.lineTo(e.clientX, e.clientY)
          ctx.lineWidth = lineWidth
          ctx.strokeStyle = strokeStyle
          ctx.stroke()
        }
      }

      canvasRef.current.addEventListener('mousemove', handleMove)
      return () => canvasRef.current.removeEventListener('mousemove', handleMove)
    }
  }, [ctx, isMouseDown])

  return <canvas ref={canvasRef} id="canvas" width={width} height={height} />
}

export default Canvas
