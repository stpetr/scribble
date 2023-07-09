import { ctx, auxCtx, clearAuxCanvas } from '../canvas.ts'

import { Coords, Shape } from './types.ts'

export class Ellipse implements Shape {
  private readonly _startingPoint: Coords
  private _center: Coords
  private _radiusX: number
  private _radiusY: number
  private readonly _thickness: number
  private readonly _color: string

  constructor(x: number, y: number, thickness: number, color: string) {
    this._startingPoint = { x, y }
    this._center = { x, y }
    this._radiusX = 0
    this._radiusY = 0
    this._thickness = thickness
    this._color = color
  }

  public onMouseMove(x: number, y: number) {
    const xDiff = x - this._startingPoint.x
    const yDiff = y - this._startingPoint.y

    this._radiusX = xDiff
    this._radiusY = yDiff
    this._center = { x, y }
    this.prerender()
  }

  public prerender() {
    clearAuxCanvas()
    auxCtx.lineWidth = this._thickness
    auxCtx.strokeStyle = this._color
    auxCtx.fillStyle = this._color

    auxCtx.beginPath()
    auxCtx.arc(this._center.x, this._center.y, 2, 0, Math.PI * 2)
    auxCtx.fill()

    auxCtx.beginPath()
    auxCtx.ellipse(this._center.x, this._center.y, Math.abs(this._radiusX), Math.abs(this._radiusY), 0, 0, Math.PI * 2)
    auxCtx.stroke()
  }

  render() {
    ctx.lineWidth = this._thickness
    ctx.strokeStyle = this._color
    ctx.fillStyle = this._color
    ctx.beginPath()
    ctx.ellipse(this._center.x, this._center.y, Math.abs(this._radiusX), Math.abs(this._radiusY), 0, 0, Math.PI * 2)
    ctx.stroke()
  }

  move(diffX: number, diffY: number) {
    this._center.x += diffX
    this._center.y += diffY
  }

  isWithinRect() {
    return false
  }
}
