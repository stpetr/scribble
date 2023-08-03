import { ctx, auxCtx, clearAuxCanvas } from '../canvas.ts'

import { ShapeTool } from './types.ts'
import { Rect } from '../helpers/shapes'
import { rectRect } from '../helpers/intersections'
import { ShapeToolBase } from './shape-tool-base.ts'

export class RectangleTool extends ShapeToolBase implements ShapeTool {
  private readonly _shape: Rect
  private readonly _thickness: number

  constructor(x: number, y: number, thickness: number, color: string) {
    super()
    this._shape = new Rect({ x, y }, 0, 0)
    this._thickness = thickness
    this._color = color
  }

  public onMouseMove(x: number, y: number) {
    this._shape.endPoint = { x, y }

    this.prerender()
  }

  public prerender() {
    clearAuxCanvas()
    auxCtx.lineWidth = this._thickness
    auxCtx.strokeStyle = this._color
    auxCtx.beginPath()
    auxCtx.rect(this._shape.topLeft.x, this._shape.topLeft.y, this._shape.width, this._shape.height)
    auxCtx.stroke()
  }

  render() {
    ctx.lineWidth = this._thickness
    ctx.strokeStyle = this._color
    ctx.beginPath()
    ctx.rect(this._shape.topLeft.x, this._shape.topLeft.y, this._shape.width, this._shape.height)
    ctx.stroke()
  }

  move(diffX: number, diffY: number) {
    // this._shape.topLeft = {
    //   x: this._shape.topLeft.x + diffX,
    //   y: this._shape.topLeft.y + diffY,
    // }

    this._shape.move(diffX, diffY)
  }

  isWithinRect(rect: Rect) {
    return rectRect(rect, this._shape)
  }
}
