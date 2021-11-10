const Application = require('spectron').Application
const electronPath = require('electron')
const path = require('path')

function sleep(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout)
  })
}

let app = null

describe('App launch', () => {
  jest.setTimeout(10000)

  beforeAll(() => {
    app = new Application({
      path: electronPath,
      args: [path.resolve(__dirname, '../app/main')]
    })
    return app.start()
  })

  afterAll(() => {
    if (app && app.isRunning()) {
      return app.stop()
    }
  })

  it('Test window count', async () => {
    const count = await app.client.getWindowCount()
    expect(count).toEqual(1)
  })

  let ctrlCode = null

  it('Test control code length', async () => {
    const el = await app.client.$('#local-ctrl-code')
    const code = await el.getText()
    ctrlCode = code
    expect(ctrlCode).toHaveLength(6)
  })

  it('Test control window open', async () => {
    const input = await app.client.$('#ctrl-code-input')
    const button = await app.client.$('#confirm-btn')
    await input.setValue(ctrlCode + '')
    await button.click()
    await sleep(300)
    const count = await app.client.getWindowCount()
    expect(count).toEqual(2)
  })
})
