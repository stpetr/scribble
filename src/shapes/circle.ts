import { ctx, auxCtx, clearAuxCanvas } from '../canvas.ts'
import { isRectIntersectsCircle } from '../helpers.ts'

import { Coords, Rect, Shape } from './types.ts'

export class Circle implements Shape {
  private readonly _startingPoint: Coords
  private _center: Coords
  private _radius: number
  private readonly _thickness: number
  private readonly _color: string

  constructor(x: number, y: number, thickness: number, color: string) {
    this._startingPoint = { x, y }
    this._center = { x, y }
    this._radius = 0
    this._thickness = thickness
    this._color = color
  }

  private calcRadius(x: number, y: number) {
    const xDiff = x - this._startingPoint.x
    const yDiff = y - this._startingPoint.y
    return Math.sqrt(xDiff ** 2 + yDiff ** 2)
  }

  public onMouseMove(x: number, y: number) {
    this._radius = this.calcRadius(x, y)
    this._center = { x, y }
    this.prerender()
  }

  public prerender() {
    clearAuxCanvas()
    auxCtx.lineWidth = this._thickness
    auxCtx.strokeStyle = this._color
    auxCtx.fillStyle = this._color
    auxCtx.beginPath()
    auxCtx.arc(this._startingPoint.x, this._startingPoint.y, 2, 0, Math.PI * 2)
    auxCtx.fill()

    auxCtx.beginPath()
    auxCtx.arc(this._center.x, this._center.y, 2, 0, Math.PI * 2)
    auxCtx.fill()

    auxCtx.beginPath()
    auxCtx.setLineDash([5, 10])
    auxCtx.moveTo(this._startingPoint.x, this._startingPoint.y)
    auxCtx.lineTo(this._center.x, this._center.y)
    auxCtx.stroke()
    auxCtx.setLineDash([])

    auxCtx.beginPath()
    auxCtx.arc(this._center.x, this._center.y, this._radius, 0, Math.PI * 2)
    auxCtx.stroke()
  }

  render() {
    ctx.lineWidth = this._thickness
    ctx.strokeStyle = this._color
    ctx.fillStyle = this._color
    ctx.beginPath()
    ctx.arc(this._center.x, this._center.y, this._radius, 0, Math.PI * 2)
    ctx.stroke()
  }

  move(diffX: number, diffY: number) {
    this._center.x += diffX
    this._center.y += diffY
  }

  isWithinRect(rect: Rect) {
    return isRectIntersectsCircle(rect, { center: this._center, radius: this._radius })
  }
}
