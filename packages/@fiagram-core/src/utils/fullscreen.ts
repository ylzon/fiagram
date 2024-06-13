export const requestFullScreen = function (element: any) {
  const requestMethod
    = element.requestFullScreen
    || element.webkitRequestFullScreen
    || element.mozRequestFullScreen
    || element.msRequestFullScreen

  if (requestMethod) {
    // Native full screen.
    requestMethod.call(element)
  }

  // 增加一个esc退出监听事件
  const listen: any = {}
  listen.on = (event: any, callback: any) => {
    event === 'esc' && listenEscExitFullScreen(callback)
  }

  return listen
}

function listenEscExitFullScreen(callback: any) {
  const exitHandler = () => {
    if (
      !document.fullscreenElement
      && !(document as any).webkitIsFullScreen
      && !(document as any).mozFullScreen
      && !(document as any).msFullscreenElement
    ) {
      document.removeEventListener('fullscreenchange', exitHandler)
      document.removeEventListener('webkitfullscreenchange', exitHandler)
      document.removeEventListener('mozfullscreenchange', exitHandler)
      document.removeEventListener('MSFullscreenChange', exitHandler)
      callback()
    }
  }
  document.addEventListener('fullscreenchange', exitHandler)
  document.addEventListener('webkitfullscreenchange', exitHandler)
  document.addEventListener('mozfullscreenchange', exitHandler)
  document.addEventListener('MSFullscreenChange', exitHandler)
}

export function exitFullScreen() {
  const exitMethod
    = document.exitFullscreen
    || (document as any).webkitExitFullscreen
    || (document as any).mozExitFullscreen
    || (document as any).msExitFullscreen

  if (exitMethod) {
    exitMethod.call(document)
  }
}
