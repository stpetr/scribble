import { Point } from '../../types.ts'
import { Line } from '../shapes'
import { lerp } from '../math.ts'

export const lineLine = (lineA: Line, lineB: Line): Point | null => {
  const tTop = (lineB.to.x - lineB.from.x) * (lineA.from.y - lineB.from.y) -
    (lineB.to.y - lineB.from.y) * (lineA.from.x - lineB.from.x)
  const uTop = (lineB.from.y - lineA.from.y) * (lineA.from.x - lineA.to.x) -
    (lineB.from.x - lineA.from.x) * (lineA.from.y - lineA.to.y)
  const bottom = (lineB.to.y - lineB.from.y) * (lineA.to.x - lineA.from.x) -
    (lineB.to.x - lineB.from.x) * (lineA.to.y - lineA.from.y)

  if (bottom !== 0) {
    const t = tTop / bottom
    const u = uTop / bottom
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(lineA.from.x, lineA.to.x, t),
        y: lerp(lineA.from.y, lineA.from.y, t),
      }
    }
  }

  return null
}
