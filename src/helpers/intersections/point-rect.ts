import { Point } from '../../types.ts'
import { Rect } from '../shapes'

export const pointRect = (point: Point, rect: Rect) => (
  point.x > rect.topLeft.x &&
  point.y > rect.topLeft.y &&
  point.x < rect.bottomRight.x &&
  point.y < rect.bottomRight.y
)
