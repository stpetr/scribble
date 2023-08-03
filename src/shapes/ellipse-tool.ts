import { ctx, auxCtx, clearAuxCanvas } from '../canvas.ts'

import { Point } from '../types.ts'
import { Ellipse } from '../helpers/shapes'
import { ShapeTool } from './types.ts'
import { ShapeToolBase } from './shape-tool-base.ts'

export class EllipseTool extends ShapeToolBase implements ShapeTool {
  private readonly _shape: Ellipse
  private readonly _startingPoint: Point
  private readonly _thickness: number

  constructor(x: number, y: number, thickness: number, color: string) {
    super()
    this._shape = new Ellipse({ x, y }, 0, 0)
    this._startingPoint = { x, y }
    this._thickness = thickness
    this._color = color
  }

  public onMouseMove(x: number, y: number) {
    const xDiff = x - this._startingPoint.x
    const yDiff = y - this._startingPoint.y

    this._shape.radiusX = xDiff
    this._shape.radiusY = yDiff
    this._shape.center = { x, y }
    this.prerender()
  }

  public prerender() {
    clearAuxCanvas()
    auxCtx.lineWidth = this._thickness
    auxCtx.strokeStyle = this._color
    auxCtx.fillStyle = this._color

    auxCtx.beginPath()
    auxCtx.arc(this._shape.center.x, this._shape.center.y, 2, 0, Math.PI * 2)
    auxCtx.fill()

    auxCtx.beginPath()
    auxCtx.ellipse(this._shape.center.x, this._shape.center.y, Math.abs(this._shape.radiusX), Math.abs(this._shape.radiusY), 0, 0, Math.PI * 2)
    auxCtx.stroke()
  }

  render() {
    ctx.lineWidth = this._thickness
    ctx.strokeStyle = this._color
    ctx.fillStyle = this._color
    ctx.beginPath()
    ctx.ellipse(this._shape.center.x, this._shape.center.y, Math.abs(this._shape.radiusX), Math.abs(this._shape.radiusY), 0, 0, Math.PI * 2)
    ctx.stroke()
  }

  move(diffX: number, diffY: number) {
    this._shape.move(diffX, diffY)
  }

  isWithinRect() {
    return false
  }
}
