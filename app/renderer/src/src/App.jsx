import { ipcRenderer } from 'electron'
import { Menu, MenuItem } from '@electron/remote'
import { useState, useEffect, useCallback } from 'react'
import './App.css'
import './peer-puppet'

function App() {
  const [localCode, setLocalCode] = useState('')
  const [controlText, setControlText] = useState('')
  const [controlCode, setControlCode] = useState('')

  useEffect(() => {
    login()
    ipcRenderer.on('control-state-change', handleControlStateChange)

    return () => {
      ipcRenderer.removeListener(
        'control-state-change',
        handleControlStateChange
      )
    }
    // eslint-disable-next-line
  }, [])

  const startControl = () => {
    ipcRenderer.send('control', controlCode)
  }

  const handleControlStateChange = useCallback((e, name, type) => {
    let text = ''
    if (type === 1) {
      text = `正在远程控制${name}`
    } else if (type === 2) {
      text = `正在被${name}远程控制`
    }
    setControlText(text)
  }, [])

  const login = async () => {
    const code = await ipcRenderer.invoke('login')
    setLocalCode(code)
  }

  const handleContextMenu = e => {
    // e.preventDefault()
    const contextMenu = new Menu()
    contextMenu.append(
      new MenuItem({
        label: 'Copy',
        role: 'copy'
      })
    )
    contextMenu.popup()
  }

  return (
    <div className="control-main">
      {!controlText.length ? (
        <>
          <div className="local-code">
            Local control code:{' '}
            <span id="local-ctrl-code" onContextMenu={handleContextMenu}>{localCode}</span>
          </div>
          <div className="operator">
            <input
              placeholder="Enter remote control code"
              type="text"
              id="ctrl-code-input"
              value={controlCode}
              onInput={e => setControlCode(e.target.value)}
            />
            <button id="confirm-btn" onClick={startControl}>Confirm</button>
          </div>
        </>
      ) : (
        <div className="control-text">{controlText}</div>
      )}
    </div>
  )
}

export default App
