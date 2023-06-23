import './styles/index.scss'

export const canvas = document.getElementById('paint') as HTMLCanvasElement
export const canvasRect = canvas.getBoundingClientRect()
export const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
export const auxCanvas = document.getElementById('paint-aux') as HTMLCanvasElement
export const auxCtx = auxCanvas.getContext('2d') as CanvasRenderingContext2D

export const setupCanvas = () => {
  const pixelRatio = window.devicePixelRatio

  canvas.width = canvasRect.width * pixelRatio
  canvas.height = canvasRect.height * pixelRatio
  auxCanvas.width = canvasRect.width * pixelRatio
  auxCanvas.height = canvasRect.height * pixelRatio

  ctx.scale(pixelRatio, pixelRatio)
  auxCtx.scale(pixelRatio, pixelRatio)
}

export const clearCanvas = () => {
  ctx.clearRect(0, 0, canvasRect.width, canvasRect.height)
}

export const clearAuxCanvas = () => {
  auxCtx.clearRect(0, 0, canvasRect.width, canvasRect.height)
}