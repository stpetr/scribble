import { ctx, auxCtx, clearAuxCanvas } from '../canvas.ts'

import { Point } from '../types.ts'
import { Circle, Rect } from '../helpers/shapes'
import { rectCircle } from '../helpers/intersections'
import { ShapeTool } from './types.ts'
import { ShapeToolBase } from './shape-tool-base.ts'

export class CircleTool extends ShapeToolBase implements ShapeTool {
  private readonly _shape: Circle
  private readonly _startingPoint: Point
  private readonly _thickness: number

  constructor(x: number, y: number, thickness: number, color: string) {
    super()
    this._shape = new Circle({ x, y }, 0)
    this._startingPoint = { x, y }
    this._thickness = thickness
    this._color = color
  }

  private calcRadius(x: number, y: number) {
    const xDiff = x - this._startingPoint.x
    const yDiff = y - this._startingPoint.y
    return Math.sqrt(xDiff ** 2 + yDiff ** 2)
  }

  public onMouseMove(x: number, y: number) {
    this._shape.radius = this.calcRadius(x, y)
    this._shape.center = { x, y }
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
    auxCtx.arc(this._shape.center.x, this._shape.center.y, 2, 0, Math.PI * 2)
    auxCtx.fill()

    auxCtx.beginPath()
    auxCtx.setLineDash([5, 10])
    auxCtx.moveTo(this._startingPoint.x, this._startingPoint.y)
    auxCtx.lineTo(this._shape.center.x, this._shape.center.y)
    auxCtx.stroke()
    auxCtx.setLineDash([])

    auxCtx.beginPath()
    auxCtx.arc(this._shape.center.x, this._shape.center.y, this._shape.radius, 0, Math.PI * 2)
    auxCtx.stroke()
  }

  render() {
    ctx.lineWidth = this._thickness
    ctx.strokeStyle = this._color
    ctx.fillStyle = this._color
    ctx.beginPath()
    ctx.arc(this._shape.center.x, this._shape.center.y, this._shape.radius, 0, Math.PI * 2)
    ctx.stroke()
  }

  move(diffX: number, diffY: number) {
    this._shape.move(diffX, diffY)
  }

  isWithinRect(rect: Rect) {
    return rectCircle(rect, this._shape)
  }
}
