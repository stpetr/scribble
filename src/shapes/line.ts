import { ctx, auxCtx, clearAuxCanvas } from '../canvas.ts'

import { Coords, Shape } from './types.ts'

export class Line implements Shape {
  private readonly _from: Coords
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
}
