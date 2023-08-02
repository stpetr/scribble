import { Point } from '../../types.ts'
import { Shape } from './types.ts'

export class Polygon implements Shape {
  private readonly _points: Point[] = []
  constructor(points: Point[]) {
    points.forEach((point) => {
      this.addPoint(point)
    })
  }

  get points() {
    return [...this._points]
  }

  addPoint(point: Point) {
    this._points.push(point)
  }

  move(diffX: number, diffY: number) {
    this._points.forEach((point) => {
      point.x += diffX
      point.y += diffY
    })
  }
}
