import { Rect } from '../shapes'

export const rectRect = (rectA: Rect, rectB: Rect) => {
  return rectA.topLeft.x < rectB.bottomRight.x &&
    rectA.bottomRight.x > rectB.topLeft.x &&
    rectA.topLeft.y < rectB.bottomRight.y &&
    rectA.bottomRight.y > rectB.topLeft.y
}
