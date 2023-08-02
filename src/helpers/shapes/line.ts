import { getHypotenuse } from '../math.ts'
import { Point } from '../../types.ts'
import { Shape } from './types.ts'

export class Line implements Shape {
  constructor(private _from: Point, private _to: Point) {}

  get from() {
    return { ...this._from }
  }

  set from(value: Point) {
    this._from = value
  }

  get to() {
    return { ...this._to }
  }

  set to(value: Point) {
    this._to = value
  }

  public get width() {
    return Math.abs(this._from.x - this._to.x)
  }

  public get height() {
    return Math.abs(this._from.y - this._to.y)
  }

  public get length() {
    return getHypotenuse(this.width, this.height)
  }

  move(diffX: number, diffY: number) {
    this._from.x += diffX
    this._from.y += diffY
    this._to.x += diffX
    this._to.y += diffY
  }
}
