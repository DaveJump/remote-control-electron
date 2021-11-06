import { desktopCapturer, ipcRenderer } from 'electron'
import { initIceCandidate } from 'project-common/ice-candidate'

async function getScreenStream() {
  return new Promise(async (resolve, reject) => {
    const sources = await desktopCapturer.getSources({ types: ['screen'] })
    navigator.webkitGetUserMedia(
      {
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: sources[0].id,
            // maxWidth: window.screen.width,
            // maxHeight: window.screen.height
            maxWidth: 1280,
            maxHeight: 720
          }
        }
      },
      stream => {
        resolve(stream)
      },
      err => {
        reject(err)
      }
    )
  })
}

const pc = new window.RTCPeerConnection({})

const iceCandidateInit = initIceCandidate(pc)

iceCandidateInit.listen('puppet-candidate')

ipcRenderer.on('offer', async (e, offer) => {
  const answer = await createAnswer(offer)
  ipcRenderer.send('forward', 'answer', { type: answer.type, sdp: answer.sdp })
})

ipcRenderer.on('candidate', (e, candidate) => {
  iceCandidateInit.addIceCandidate(candidate)
})

async function createAnswer(offer) {
  let screenStream = await getScreenStream()
  pc.addStream(screenStream)
  await pc.setRemoteDescription(offer)
  await pc.setLocalDescription(await pc.createAnswer())
  console.log(JSON.stringify(pc.localDescription))
  return pc.localDescription
}

// 处理键鼠响应
pc.addEventListener('datachannel', ev => {
  if (ev.channel.label === 'robotChannel') {
    ev.channel.onmessage = e => {
      let { type, data } = JSON.parse(e.data)
      if (type === 'mouse') {
        // 傀儡端需加上 screenWidth 和 screenHeight
        data.screen = {
          width: window.screen.width,
          height: window.screen.height
        }
      }
      console.log('channel-message-puppet: ', type, data)
      setTimeout(() => {
        ipcRenderer.send('robot', type, data)
      }, 2000)
    }
  }
})
