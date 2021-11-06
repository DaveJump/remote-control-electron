// 用于处理服务端与主进程的信令发送和接受(服务端转发到主进程)

const WebSocket = require('ws')
const EventEmitter = require('events')
const signal = new EventEmitter()

const ws = new WebSocket('ws://192.168.10.134:8010')

ws.on('open', () => {
  console.log('ws connected')
})

ws.on('message', (message) => {
  let data = {}
  try {
    data = JSON.parse(message)
  } catch (err) {
    console.log(`parse error: `, err)
  }
  signal.emit(data.event, data.data)
})

function send(event, data) {
  ws.send(JSON.stringify({ event, data }))
}

function invoke(event, data, replyEvent, once) {
  return new Promise((resolve, reject) => {
    send(event, data)
    signal[once ? 'once' : 'on'](replyEvent, resolve)
    setTimeout(() => {
      reject('timeout')
    }, 5000)
  })
}

signal.send = send
signal.invoke = invoke

module.exports = {
  signal
}
