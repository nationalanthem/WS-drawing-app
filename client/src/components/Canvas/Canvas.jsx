import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import './Canvas.css'
import { useSelector, useDispatch } from 'react-redux'
import {
  setClearState,
  setCanvasDataUrl,
  setToolbarDisplay,
  setConnectedUsers,
} from '../../features'
import { useParams } from 'react-router-dom'

const socket = new WebSocket('ws://localhost:3000')

const Canvas = () => {
  const [width, setWidth] = useState(window.innerWidth)
  const [height, setHeight] = useState(window.innerHeight)

  const { canvasId } = useParams()

  const dispatch = useDispatch()
  const lineWidth = useSelector((state) => state.tools.lineWidth)
  const strokeStyle = useSelector((state) => state.tools.strokeStyle)
  const readyToClear = useSelector((state) => state.canvas.readyToClear)

  const canvasRef = useRef()
  const [ctx, setCtx] = useState()
  const [canvasState, setCanvasState] = useState()
  const [isMouseDown, setIsMouseDown] = useState()

  useEffect(() => {
    if (ctx) {
      fetch(`/api/canvas?id=${canvasId}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.canvasUrl) {
            const img = new Image()
            img.onload = () => {
              ctx.drawImage(img, 0, 0, res.w, res.h)
            }
            img.src = res.canvasUrl
          }
        })
    }
  }, [ctx])

  useEffect(() => {
    if (ctx) {
      socket.onmessage = ({ data }) => {
        const message = JSON.parse(data)

        switch (message.type) {
          case 'connection':
          case 'closeConnection':
            dispatch(setConnectedUsers(message.users))
            break
          case 'drawing':
            ctx.lineTo(message.x, message.y)
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'
            ctx.lineWidth = message.lineWidth
            ctx.strokeStyle = message.strokeStyle
            ctx.stroke()
            break
          case 'beginPath':
            ctx.beginPath()
            break
          case 'closePath':
            ctx.closePath()
            break
          case 'clearCanvas':
            ctx.clearRect(0, 0, message.width, message.height)
            break
        }
      }

      socket.onopen = () => {
        socket.send(JSON.stringify({ type: 'connection', canvasId }))
      }
    }
  }, [ctx])

  useLayoutEffect(() => {
    const handleResize = () => {
      setCanvasState(canvasRef.current.toDataURL())
      setWidth(window.innerWidth)
      setHeight(window.innerHeight)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [canvasRef])

  useEffect(() => {
    if (canvasRef?.current) {
      setCtx(canvasRef.current.getContext('2d'))
    }
  }, [canvasRef])

  useEffect(() => {
    if (readyToClear) {
      ctx.clearRect(0, 0, width, height)
      dispatch(setClearState(false))
      socket.send(JSON.stringify({ type: 'clearCanvas', canvasId, width, height }))
      const canvasUrl = canvasRef.current.toDataURL()
      fetch(`/api/canvas?id=${canvasId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ canvasUrl, w: width, h: height }),
      })
    }
  }, [readyToClear, width, height, ctx, canvasRef])

  useEffect(() => {
    if (ctx && canvasState) {
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height)
      }
      img.src = canvasState
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
        socket.send(JSON.stringify({ type: 'beginPath', canvasId }))
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
        const canvasUrl = canvasRef.current.toDataURL()
        dispatch(setCanvasDataUrl(canvasUrl))
        socket.send(JSON.stringify({ type: 'closePath', canvasId }))
        fetch(`/api/canvas?id=${canvasId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ canvasUrl, w: width, h: height }),
        })
      }
      canvasRef.current.addEventListener('mouseup', handleMouseUp)
      return () => canvasRef.current.removeEventListener('mouseup', handleMouseUp)
    }
  }, [ctx, canvasRef, width, height])

  useEffect(() => {
    if (ctx) {
      const handleMove = (e) => {
        if (isMouseDown) {
          ctx.lineTo(e.clientX, e.clientY)
          ctx.lineWidth = lineWidth
          ctx.strokeStyle = strokeStyle
          ctx.stroke()
          socket.send(
            JSON.stringify({
              type: 'drawing',
              canvasId,
              x: e.clientX,
              y: e.clientY,
              lineWidth,
              strokeStyle,
            })
          )
        }
      }

      canvasRef.current.addEventListener('mousemove', handleMove)
      return () => canvasRef.current.removeEventListener('mousemove', handleMove)
    }
  }, [ctx, isMouseDown, lineWidth, strokeStyle])

  return <canvas ref={canvasRef} id="canvas" width={width} height={height} />
}

export default Canvas
