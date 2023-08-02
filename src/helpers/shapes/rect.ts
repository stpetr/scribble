import { Point } from '../../types.ts'
import { Shape } from './types.ts'

export class Rect implements Shape {
  constructor(private _startPoint: Point, private _width: number, private _height: number) {}

  set startPoint(value: Point) {
    this._startPoint = value
  }

  set endPoint(value: Point) {
    this._width = value.x - this._startPoint.x
    this._height = value.y - this._startPoint.y
  }

  get topLeft() {
    return {
      x: this._startPoint.x <= this._endPoint.x ? this._startPoint.x : this._endPoint.x,
      y: this._startPoint.y <= this._endPoint.y ? this._startPoint.y : this._endPoint.y,
    }
  }

  get bottomRight(): Point {
    return {
      x: this._startPoint.x >= this._endPoint.x ? this._startPoint.x : this._endPoint.x,
      y: this._startPoint.y >= this._endPoint.y ? this._startPoint.y : this._endPoint.y,
    }
  }

  get width() {
    return Math.abs(this._width)
  }

  set width(value: number) {
    this._width = value
  }

  get height() {
    return Math.abs(this._height)
  }

  set height(value: number) {
    this._height = value
  }

  get points(): Point[] {
    const topLeft = this.topLeft
    const bottomRight = this.bottomRight
    return [
      { x: topLeft.x, y: topLeft.y },
      { x: bottomRight.x, y: topLeft.y },
      { x: bottomRight.x, y: bottomRight.y },
      { x: topLeft.x, y: bottomRight.y },
    ]
  }

  move(diffX: number, diffY: number) {
    this._startPoint.x += diffX
    this._startPoint.y += diffY
  }

  private get _endPoint(): Point {
    return {
      x: this._startPoint.x + this._width,
      y: this._startPoint.y + this._height,
    }
  }
}
