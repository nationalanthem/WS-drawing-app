const express = require('express')
const WebSocket = require('ws')

const app = express()
const server = require('http').createServer(app)
const wss = new WebSocket.Server({ server })

const PORT = process.env.PORT || 3000

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    ws.send(`[Server]: got message from client: ${message}`)
    wss.clients.forEach((client) => {
      if (client !== ws) {
        client.send('Broadcasting...')
      }
    })
  })
})

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
