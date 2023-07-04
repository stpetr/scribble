import { auxCtx, clearAuxCanvas } from '../canvas.ts'
import { Coords, Rect, Shape } from '../shapes/types.ts'
import { isPointWithinRect } from '../helpers.ts'

type Mode = 'select' | 'selected' | 'move' | null
export class ShapesSelector {
  private _mode: Mode = null
  private _topLeft: Coords = { x: 0, y: 0 }
  private _bottomRight: Coords = { x: 0, y: 0 }
  public prevMovePoint?: Coords
  selectedShapes: Shape[] = []

  get mode() {
    return this._mode
  }

  set mode(mode: Mode) {
    this._mode = mode
  }
  constructor() {}

  startSelecting(x: number, y: number) {
    this._topLeft = { x, y }
    this._bottomRight = { x, y }
    this.mode = 'select'
    clearAuxCanvas()
  }

  stopSelecting() {
    if (this.selectedShapes.length) {
      this.mode = 'selected'
    } else {
      this.mode = null
    }
    this.render()
  }

  startMoving(x: number, y: number) {
    this.prevMovePoint = { x, y }
    this.mode = 'move'
  }

  stopMoving() {
    this.mode = 'selected'
    this.render()
  }

  onMouseMove(x: number, y: number) {
    if (this.mode === 'select') {
      this._bottomRight = { x, y }
    } else if (this.mode === 'move') {
      if (this.prevMovePoint) {
        const diffX = x - this.prevMovePoint.x
        const diffY = y - this.prevMovePoint.y

        this._topLeft = {
          x: this._topLeft.x + diffX,
          y: this._topLeft.y + diffY,
        }
        this._bottomRight = {
          x: this._bottomRight.x + diffX,
          y: this._bottomRight.y + diffY,
        }
      } else {
        console.error('No prevMovePoint')
      }

      this.moveSelectedShapes(x, y)
    }

    this.render()
  }

  moveSelectedShapes(x: number, y: number) {
    if (!this.prevMovePoint) {
      console.error('No starting point for move')
      return
    }

    const diffX = x - this.prevMovePoint.x
    const diffY = y - this.prevMovePoint.y

    this.selectedShapes.forEach((shape) => {
      shape.move(diffX, diffY)
      shape.render()
    })

    this.prevMovePoint.x = x
    this.prevMovePoint.y = y
  }

  reset() {
    this.mode = null
    this.selectedShapes = []
    this._topLeft = { x: 0, y: 0 }
    this._bottomRight = { x: 0, y: 0 }
    this.render()
  }

  render() {
    clearAuxCanvas()
    if (this.mode) {
      auxCtx.lineWidth = 2
      auxCtx.strokeStyle = '#ccc'
      auxCtx.beginPath()
      auxCtx.setLineDash([5])
      auxCtx.strokeRect(this._topLeft.x, this._topLeft.y, this._bottomRight.x - this._topLeft.x, this._bottomRight.y - this._topLeft.y)
      auxCtx.setLineDash([])
    }
  }

  getRect(): Rect {
    return {
      topLeft: {
        x: Math.min(this._topLeft.x, this._bottomRight.x),
        y: Math.min(this._topLeft.y, this._bottomRight.y),
      },
      bottomRight: {
        x: Math.max(this._topLeft.x, this._bottomRight.x),
        y: Math.max(this._topLeft.y, this._bottomRight.y),
      },
    }
  }

  isOverSelectedArea(x: number, y: number) {
    return isPointWithinRect({ x, y }, this.getRect())
  }
}