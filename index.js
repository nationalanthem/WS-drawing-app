const express = require('express')
const WebSocket = require('ws')
const fs = require('fs')
const path = require('path')

const app = express()
const server = require('http').createServer(app)
const wss = new WebSocket.Server({ server })

app.use(express.json({ limit: '10mb' }))

const PORT = 3000

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

app.get('/api/canvas', (req, res) => {
  const { id } = req.query
  if (!fs.existsSync(path.join(__dirname, 'canvases', id, 'canvas.png')))
    return res.json({ canvasUrl: null })
  const canvasRaw = fs.readFileSync(path.join(__dirname, 'canvases', id, 'canvas.png'))
  const canvasUrl = `data:image/png;base64,${canvasRaw.toString('base64')}`
  const { w, h } = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'canvases', id, 'size.txt'), 'utf8')
  )
  res.json({ canvasUrl, w, h })
})

app.post('/api/canvas', (req, res) => {
  const { canvasUrl, w, h } = req.body
  const { id } = req.query
  const base64Data = canvasUrl.replace(/^data:image\/png;base64,/, '')

  !fs.existsSync(path.join(__dirname, 'canvases')) && fs.mkdirSync(path.join(__dirname, 'canvases'))
  !fs.existsSync(path.join(__dirname, 'canvases', id)) &&
    fs.mkdirSync(path.join(__dirname, 'canvases', id))

  if (fs.existsSync(path.join(__dirname, 'canvases', id, 'size.txt'))) {
    const size = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'canvases', id, 'size.txt'), 'utf8')
    )

    if ((w >= size.w && h >= size.h) || true) {
      fs.writeFileSync(path.join(__dirname, 'canvases', id, 'size.txt'), JSON.stringify({ w, h }))
      fs.writeFileSync(path.join(__dirname, 'canvases', id, 'canvas.png'), base64Data, 'base64')
      return res.sendStatus(200)
    }
  }

  fs.writeFileSync(path.join(__dirname, 'canvases', id, 'size.txt'), JSON.stringify({ w, h }))
  fs.writeFileSync(path.join(__dirname, 'canvases', id, 'canvas.png'), base64Data, 'base64')
  res.sendStatus(200)
})

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
