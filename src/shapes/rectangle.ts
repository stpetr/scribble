import { ctx, auxCtx, clearAuxCanvas } from '../canvas.ts'

import { Coords, Rect, Shape } from './types.ts'

export class Rectangle implements Shape {
  private _topLeftPoint: Coords
  private _width: number
  private _height: number
  private readonly _thickness: number
  private readonly _color: string

  constructor(x: number, y: number, thickness: number, color: string) {
    this._topLeftPoint = { x, y }
    this._width = 0
    this._height = 0
    this._thickness = thickness
    this._color = color
  }

  public onMouseMove(x: number, y: number) {
    this._width = x - this._topLeftPoint.x
    this._height = y - this._topLeftPoint.y
    this.prerender()
  }

  public prerender() {
    clearAuxCanvas()
    auxCtx.lineWidth = this._thickness
    auxCtx.strokeStyle = this._color
    auxCtx.beginPath()
    auxCtx.rect(this._topLeftPoint.x, this._topLeftPoint.y, this._width, this._height)
    auxCtx.stroke()
  }

  render() {
    ctx.lineWidth = this._thickness
    ctx.strokeStyle = this._color
    ctx.beginPath()
    ctx.rect(this._topLeftPoint.x, this._topLeftPoint.y, this._width, this._height)
    ctx.stroke()
  }

  move(diffX: number, diffY: number) {
    this._topLeftPoint = {
      x: this._topLeftPoint.x + diffX,
      y: this._topLeftPoint.y + diffY,
    }
  }

  isWithinRect(rect: Rect) {
    const topLeft = this._topLeftPoint
    const bottomRight = {
      x: topLeft.x + this._width,
      y: topLeft.y + this._height,
    }

    return rect.topLeft.x < bottomRight.x &&
      rect.bottomRight.x > topLeft.x &&
      rect.topLeft.y < bottomRight.y &&
      rect.bottomRight.y > topLeft.y
  }
}
