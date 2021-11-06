const { peer } = require('./peer-control')

peer.on('add-stream', (stream) => {
  play(stream)
})

const video = document.getElementById('control-video')
function play(stream) {
  video.srcObject = stream
  video.onloadedmetadata = () => {
    video.play()
  }
}

window.onkeydown = (e) => {
  const data = {
    keyCode: e.keyCode,
    meta: e.metaKey,
    shift: e.shiftKey,
    ctrl: e.ctrlKey,
    alt: e.altKey
  }
  peer.emit('robot', 'key', data)
}

window.onmouseup = (e) => {
  const data = {
    clientX: e.clientX,
    clientY: e.clientY,
    video: {
      width: video.getBoundingClientRect().width,
      height: video.getBoundingClientRect().height
    }
  }
  peer.emit('robot', 'mouse', data)
}
