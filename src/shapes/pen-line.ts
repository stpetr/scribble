import { ctx, auxCtx, clearAuxCanvas } from '../canvas.ts'
import { getRectPoints, isPointWithinRect, isPolygonsIntersect } from '../helpers.ts'

import { Coords, Rect, Shape } from './types.ts'

export class PenLine implements Shape {
  private _startingPoint: Coords
  private readonly _thickness: number
  private readonly _color: string
  private readonly _points: Coords[] = []
  constructor(x: number, y: number, thickness: number, color: string) {
    this._startingPoint = { x, y }
    this._thickness = thickness
    this._color = color
  }

  public onMouseMove(x: number, y: number) {
    this._points.push({ x, y })
    this.prerender()
  }

  public prerender() {
    clearAuxCanvas()

    let prevPoint = this._startingPoint
    this._points.forEach((to) => {
      auxCtx.lineWidth = this._thickness
      auxCtx.strokeStyle = this._color
      auxCtx.beginPath()
      auxCtx.moveTo(prevPoint.x, prevPoint.y)
      auxCtx.lineTo(to.x, to.y)
      auxCtx.stroke()
      prevPoint = to
    })
  }

  render() {
    let prevCoords = this._startingPoint

    this._points.forEach((to) => {
      ctx.lineWidth = this._thickness
      ctx.strokeStyle = this._color
      ctx.beginPath()
      ctx.moveTo(prevCoords.x, prevCoords.y)
      ctx.lineTo(to.x, to.y)
      ctx.stroke()

      prevCoords = to
    })
  }

  move(diffX: number, diffY: number) {
    this._startingPoint = { x: this._startingPoint.x + diffX, y: this._startingPoint.y + diffY }
    this._points.forEach((point) => {
      point.x += diffX
      point.y += diffY
    })
  }

  isWithinRect(rect: Rect) {
    const points = [this._startingPoint, ...this._points]
    const pointWithingRect = points.find((point) => isPointWithinRect(point, rect))
    if (pointWithingRect) {
      return true
    }
    const rectPoints = getRectPoints(rect)
    return isPolygonsIntersect([this._startingPoint, ...this._points], rectPoints)
  }
}
