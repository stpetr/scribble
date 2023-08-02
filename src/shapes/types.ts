import { Rect } from '../helpers/shapes'

export interface ShapeTool {
  prerender: () => void
  render: () => void
  move: (x: number, y: number) => void
  onMouseMove: (x: number, y: number) => void
  isWithinRect: (rect: Rect) => boolean
}
