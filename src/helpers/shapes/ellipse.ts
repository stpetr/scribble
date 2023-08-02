import { Point } from '../../types.ts'
import { Shape } from './types.ts'

export class Ellipse implements Shape {
  constructor(private _center: Point, private _radiusX: number, private _radiusY: number) {}

  get center() {
    return { ...this._center }
  }

  set center(value: Point) {
    this._center = value
  }

  get radiusX() {
    return this._radiusX
  }

  set radiusX(value: number) {
    this._radiusX = value
  }

  get radiusY() {
    return this._radiusY
  }

  set radiusY(value: number) {
    this._radiusY = value
  }

  move(diffX: number, diffY: number) {
    this._center.x += diffX
    this._center.y += diffY
  }
}
