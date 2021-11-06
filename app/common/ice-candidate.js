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
        // 这里要调 toJSON() 不知道为什么 ipcRenderer.send 不能直接发 candidate 实例，估计 candidate 实例里有函数，electron 克隆算法不支持函数克隆？ <electron@12>
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
