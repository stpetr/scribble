import { ctx, auxCtx, clearAuxCanvas } from '../canvas.ts'

import { Line, Rect } from '../helpers/shapes'
import { pointRect, polygonPolygon } from '../helpers/intersections'
import { ShapeTool } from './types.ts'
import { ShapeToolBase } from './shape-tool-base.ts'

export class LineTool extends ShapeToolBase implements ShapeTool {
  private readonly _shape: Line
  private readonly _thickness: number

  constructor(x: number, y: number, thickness: number, color: string) {
    super()
    this._shape = new Line({ x, y }, { x, y })
    this._thickness = thickness
    this._color = color
  }

  public onMouseMove(x: number, y: number) {
    this._shape.to = { x, y }
    this.prerender()
  }

  public prerender() {
    clearAuxCanvas()

    auxCtx.lineWidth = this._thickness
    auxCtx.strokeStyle = this._color
    auxCtx.beginPath()
    auxCtx.moveTo(this._shape.from.x, this._shape.from.y)
    auxCtx.lineTo(this._shape.to.x, this._shape.to.y)
    auxCtx.stroke()
  }

  render() {
    ctx.lineWidth = this._thickness
    ctx.strokeStyle = this._color
    ctx.beginPath()
    ctx.moveTo(this._shape.from.x, this._shape.from.y)
    ctx.lineTo(this._shape.to.x, this._shape.to.y)
    ctx.stroke()
  }

  move(diffX: number, diffY: number) {
    this._shape.move(diffX, diffY)
  }

  isWithinRect(rect: Rect) {
    if (pointRect(this._shape.from, rect) || pointRect(this._shape.to, rect)) {
      return true
    }

    return polygonPolygon([this._shape.from, this._shape.to], rect.points)
  }
}
