import { auxCtx, clearAuxCanvas } from '../canvas.ts'

import { Point } from '../types.ts'
import { ShapeTool } from '../shapes/types.ts'
import { Rect } from '../helpers/shapes'
import { pointRect } from '../helpers/intersections'

type Mode = 'select' | 'selected' | 'move' | null
export class ShapesSelector {
  private _mode: Mode = null
  public readonly area: Rect
  public prevMovePoint?: Point
  selectedShapes: ShapeTool[] = []

  get mode() {
    return this._mode
  }

  set mode(mode: Mode) {
    this._mode = mode
  }
  constructor() {
    this.area = new Rect({ x: 0, y: 0 }, 0, 0)
  }

  startSelecting(x: number, y: number) {
    this.area.startPoint = { x, y }
    this.area.width = 0
    this.area.height = 0
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
      this.area.endPoint = { x, y }
    } else if (this.mode === 'move') {
      if (this.prevMovePoint) {
        const diffX = x - this.prevMovePoint.x
        const diffY = y - this.prevMovePoint.y
        this.area.move(diffX, diffY)
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
    this.area.startPoint = { x: 0, y: 0 }
    this.area.width = 0
    this.area.height = 0
    this.render()
  }

  render() {
    clearAuxCanvas()
    if (this.mode) {
      auxCtx.lineWidth = 2
      auxCtx.strokeStyle = '#ccc'
      auxCtx.beginPath()
      auxCtx.setLineDash([5])
      auxCtx.strokeRect(
        this.area.topLeft.x,
        this.area.topLeft.y,
        this.area.width,
        this.area.height
      )
      auxCtx.setLineDash([])
    }
  }

  isOverSelectedArea(x: number, y: number) {
    return pointRect({ x, y }, this.area)
  }
}