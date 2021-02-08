import express from 'express'
import { readFile } from 'fs/promises'
import http from 'http'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import WebSocket from 'ws'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()

app.use(
  express.static(`${__dirname}/../public`, {
    immutable: true,
    maxAge: 31536000,
  }),
)

const server = http.createServer(app)

const wss = new WebSocket.Server({ server })

wss.on('connection', function connection(ws) {
  ws.on('message', async function incoming(message) {
    const data = JSON.parse(message)
    switch (data.command) {
      case 'readFile':
        const buffer = await readFile(data.path)
        const text = buffer.toString()
        ws.send(
          JSON.stringify({
            command: 'readFileResult',
            text,
          }),
        )
        break
      default:
        console.log('unknown command')
    }
  })

  ws.send('something')
})

export { server }
