import { performance } from 'perf_hooks'
const s = performance.now()
import express from 'express'
import ws from 'ws'
import http from 'http'
import WebSocket from 'ws'
import { readFile } from 'fs/promises'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

console.log(performance.now() - s)

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

server.listen(8080, () => {
  console.log(performance.now() - s)
})
