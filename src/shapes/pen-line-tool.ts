import { ctx, auxCtx, clearAuxCanvas } from '../canvas.ts'

import { ShapeTool } from './types.ts'
import { Polygon } from '../helpers/shapes/polygon.ts'
import { Rect } from '../helpers/shapes'
import { pointRect, polygonPolygon } from '../helpers/intersections'
import { ShapeToolBase } from './shape-tool-base.ts'

export class PenLineTool extends ShapeToolBase implements ShapeTool {
  private readonly _shape: Polygon
  private readonly _thickness: number

  constructor(x: number, y: number, thickness: number, color: string) {
    super()
    this._shape = new Polygon([{ x, y }])
    this._thickness = thickness
    this._color = color
  }

  public onMouseMove(x: number, y: number) {
    this._shape.addPoint({ x, y })
    this.prerender()
  }

  public prerender() {
    clearAuxCanvas()

    let prevPoint = this._shape.points[0]
    this._shape.points.forEach((to) => {
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
    let prevCoords = this._shape.points[0]

    this._shape.points.forEach((to) => {
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
    this._shape.move(diffX, diffY)
  }

  isWithinRect(rect: Rect) {
    const pointWithingRect = this._shape.points.find((point) => pointRect(point, rect))
    if (pointWithingRect) {
      return true
    }

    return polygonPolygon(this._shape.points, rect.points)
  }
}
