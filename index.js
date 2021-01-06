const express = require('express')
const WebSocket = require('ws')

const app = express()
const server = require('http').createServer(app)
const wss = new WebSocket.Server({ server })

const PORT = process.env.PORT || 3000

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const parsedMsg = JSON.parse(message)

    switch (parsedMsg.type) {
      case 'connection':
        ws.canvasId = parsedMsg.canvasId
      case 'drawing':
      case 'beginPath':
      case 'closePath':
      case 'clearCanvas':
        broadcast(ws, parsedMsg)
        break
    }
  })

  ws.on('close', () => {
    broadcast(ws, { type: 'closeConnection', canvasId: ws.canvasId })
  })
})

const broadcast = (ws, msg) => {
  let users = 0

  wss.clients.forEach((client) => {
    if (client.canvasId === msg.canvasId) {
      users++
    }
  })

  wss.clients.forEach((client) => {
    if (ws !== client && client.canvasId === msg.canvasId) {
      switch (msg.type) {
        case 'connection':
          client.send(JSON.stringify({ type: 'connection', users }))
          break
        case 'closeConnection':
          client.send(JSON.stringify({ type: 'closeConnection', users }))
          break
        case 'drawing':
          client.send(
            JSON.stringify({
              type: 'drawing',
              x: msg.x,
              y: msg.y,
              lineWidth: msg.lineWidth,
              strokeStyle: msg.strokeStyle,
            })
          )
          break
        case 'beginPath':
          client.send(JSON.stringify({ type: 'beginPath' }))
          break
        case 'closePath':
          client.send(JSON.stringify({ type: 'closePath' }))
          break
        case 'clearCanvas':
          client.send(JSON.stringify({ type: 'clearCanvas', width: msg.width, height: msg.height }))
          break
      }
    } else if (ws === client) {
      switch (msg.type) {
        case 'connection':
          client.send(JSON.stringify({ type: 'connection', users }))
          break
      }
    }
  })
}

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
