const robot = require('robotjs')
const { ipcMain } = require('electron')
const vkey = require('vkey')

function handleMouse(data) {
  const { clientX, clientY, screen, video } = data
  const { width: videoWidth, height: videoHeight } = video
  const { width: screenWidth, height: screenHeight } = screen
  const x = clientX * (screenWidth / videoWidth)
  const y = clientY * (screenHeight / videoHeight)

  try {
    robot.moveMouse(x, y)
    robot.mouseClick()
  } catch (e) {
    console.log(e)
  }
}

function handleKey(data) {
  const { keyCode, meta, alt, ctrl, shift } = data
  const modifiers = []
  meta && modifiers.push('command')
  alt && modifiers.push('alt')
  ctrl && modifiers.push('control')
  shift && modifiers.push('shift')
  const key = vkey[keyCode].toLowerCase()
  try {
    // 需要处理的其他键位还有很多，vkey 和 robotjs 支持的键名差异非常大
    robot.keyTap(
      key.replace(/\<|\>/g, '').replace(/^([\d\w]+)\-([\d\w]+)$/, '$1_$2'),
      modifiers
    )
  } catch (e) {
    console.log(e)
  }
}

module.exports = () => {
  ipcMain.on('robot', (e, type, data) => {
    if (type === 'mouse') {
      handleMouse(data)
    } else if (type === 'key') {
      handleKey(data)
    }
  })
}
