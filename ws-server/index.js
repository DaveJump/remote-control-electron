import { WebSocketServer } from 'ws'
import { internalIpV4 } from 'internal-ip'

const PORT = 8010

const wss = new WebSocketServer({ port: PORT })

const code2ws = new Map()

wss.on('listening', async () => {
  const ip = await internalIpV4()
  console.log(`ws server listening on:\n   local: ws://127.0.0.1:${PORT}\n   internal-network: ws://${ip}:8010`)
})

wss.on('connection', (ws, req) => {
  const code = Math.floor(Math.random() * 899999) + 100000

  code2ws.set(code, ws)

  ws.sendData = (event, data) => {
    ws.send(JSON.stringify({ event, data }))
  }

  ws.sendError = (ws, msg) => {
    ws.sendData('error', { msg })
  }

  ws.on('message', (message) => {
    let parsedMessage = {}
    try {
      parsedMessage = JSON.parse(message)
    } catch (err) {
      ws.sendError('message invalid')
      console.error('parse message error: ', err)
      return
    }
    const { event, data } = parsedMessage
    if (event === 'login') {
      ws.sendData('logined', { code })
    } else if (event === 'control') {
      // control 事件只有控制端能触发，所以这里的 ws 全部为控制端，code2ws.get(remote) 为傀儡端
      const remote = +data.remote
      if (code2ws.has(remote)) {
        ws.sendData('controlled', { remote })

        ws.sendRemote = code2ws.get(remote).sendData

        code2ws.get(remote).sendRemote = ws.sendData

        ws.sendRemote('be-controlled', { remote: code })
      }
    } else if (event === 'forward') {
      ws.sendRemote(data.event, data.data)
    }
  })

  ws.on('close', () => {
    code2ws.delete(code)
    clearTimeout(ws._closeTimeout)
  })

  ws._closeTimeout = setTimeout(() => {
    ws.terminate()
  }, 10 * 60 * 1000)
})
