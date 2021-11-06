const EventEmitter = require('events')
const peer = new EventEmitter()
const { ipcRenderer } = require('electron')
// project-common 需要在根 package.json 里指定 file 协议的 dependency 并安装（直接执行 yarn | npm i）
// 因为 create-react-app 用了 webpackScopePlugin 限制了模块只能在 src 目录内寻址
const { initIceCandidate } = require('project-common/ice-candidate')

const pc = new window.RTCPeerConnection({})

const iceCandidateInit = initIceCandidate(pc)

iceCandidateInit.listen('control-candidate')

async function createOffer() {
  const offer = await pc.createOffer({
    offerToReceiveAudio: false,
    offerToReceiveVideo: true
  })
  await pc.setLocalDescription(offer)
  console.log(JSON.stringify(pc.localDescription))
  return pc.localDescription
}

createOffer().then(offer => {
  ipcRenderer.send('forward', 'offer', { type: offer.type, sdp: offer.sdp })
})

async function setRemote(answer) {
  await pc.setRemoteDescription(answer)
}

ipcRenderer.on('answer', (e, answer) => {
  setRemote(answer)
})

ipcRenderer.on('candidate', (e, candidate) => {
  iceCandidateInit.addIceCandidate(candidate)
})

pc.onaddstream = e => {
  peer.emit('add-stream', e.stream)
}

// 处理键鼠操作
const dc = pc.createDataChannel('robotChannel', { reliable: false })
dc.onopen = () => {
  peer.on('robot', (type, data) => {
    console.log('data-send: ', type, data)
    dc.send(JSON.stringify({ type, data }))
  })
}
dc.onmessage = (msg) => {
  console.log('channel-message: ', msg)
}
dc.onerror = (err) => {
  console.log('channel-error: ', err)
}

module.exports = {
  peer
}
