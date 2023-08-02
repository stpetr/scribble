import { Point } from '../../types.ts'
import { Shape } from './types.ts'

export class Circle implements Shape {
  constructor(private _center: Point, private _radius: number) {}

  get center() {
    return { ...this._center }
  }

  set center(value: Point) {
    this._center = value
  }

  get radius() {
    return this._radius
  }

  set radius(value: number) {
    this._radius = value
  }

  move(diffX: number, diffY: number) {
    this._center.x += diffX
    this._center.y += diffY
  }
}
