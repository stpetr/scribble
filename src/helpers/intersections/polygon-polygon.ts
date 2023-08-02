import { Point } from '../../types.ts'
import { Line } from '../shapes'
import { lineLine } from './line-line.ts'

export const polygonPolygon = (polygonA: Point[], polygonB: Point[]) => {
  const polygonALength = polygonA.length
  const polygonBLength = polygonA.length
  for (let i = 0; i < polygonALength; i++) {
    for (let j = 0; j < polygonBLength; j++) {
      const lineA = new Line(polygonA[i], polygonA[(i + 1) % polygonALength])
      const lineB = new Line(polygonB[j], polygonB[(j + 1) % polygonBLength])
      const touch = lineLine(lineA, lineB)

      if (touch) {
        return true
      }
    }
  }

  return false
}
