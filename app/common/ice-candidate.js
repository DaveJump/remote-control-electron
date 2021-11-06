// 每次修改完记得 yarn upgrade project-common

const { ipcRenderer } = require('electron')

function initIceCandidate(pc) {
  if (!pc) return
  let candidates = []
  return {
    listen(event) {
      pc.onicecandidate = (e) => {
        if (e.candidate) {
          console.log('ice-candidate', e.candidate)
          ipcRenderer.send('forward', event, e.candidate.toJSON())
        }
      }
    },
    async addIceCandidate(candidate) {
      if (candidate) {
        candidates.push(candidate)
      }
      if (pc.remoteDescription && pc.remoteDescription.type) {
        for (let i = 0; i < candidates.length; i++) {
          await pc.addIceCandidate(new RTCIceCandidate(candidates[i]))
        }
      }
    }
  }
}

module.exports = {
  initIceCandidate
}
