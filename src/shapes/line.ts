import { ctx, auxCtx, clearAuxCanvas } from '../canvas.ts'
import { getRectPoints, isPointWithinRect, isPolygonsIntersect } from '../helpers.ts'

import { Coords, Rect, Shape } from './types.ts'

export class Line implements Shape {
  private _from: Coords
  private _to: Coords
  private readonly _thickness: number
  private readonly _color: string

  constructor(x: number, y: number, thickness: number, color: string) {
    this._from = { x, y }
    this._to = { x, y }
    this._thickness = thickness
    this._color = color
  }

  public onMouseMove(x: number, y: number) {
    this._to = { x, y }
    this.prerender()
  }

  public prerender() {
    clearAuxCanvas()

    auxCtx.lineWidth = this._thickness
    auxCtx.strokeStyle = this._color
    auxCtx.beginPath()
    auxCtx.moveTo(this._from.x, this._from.y)
    auxCtx.lineTo(this._to.x, this._to.y)
    auxCtx.stroke()
  }

  render() {
    ctx.lineWidth = this._thickness
    ctx.strokeStyle = this._color
    ctx.beginPath()
    ctx.moveTo(this._from.x, this._from.y)
    ctx.lineTo(this._to.x, this._to.y)
    ctx.stroke()
  }

  move(diffX: number, diffY: number) {
    this._from = { x: this._from.x + diffX, y: this._from.y + diffY }
    this._to = { x: this._to.x + diffX, y: this._to.y + diffY }
  }

  isWithinRect(rect: Rect) {
    const rectPoints = getRectPoints(rect)
    if (isPointWithinRect(this._from, rect) || isPointWithinRect(this._to, rect)) {
      return true
    }

    return isPolygonsIntersect([this._from, this._to], rectPoints)
  }
}
