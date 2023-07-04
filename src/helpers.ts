import { fromEvent, map, startWith } from 'rxjs'

import { Coords, Rect, Circle } from './shapes/types.ts'

export const createInputStream = (node: HTMLInputElement) => {
  return fromEvent(node, 'input')
    .pipe(
      map((e) => {
        const target = e.target as HTMLInputElement
        return target.value
      }),
      startWith(node.value)
    )
}

export const lerp = (a: number, b: number, t: number) => {
  return a + (b - a) * t
}

export const getIntersection = (a: Coords, b: Coords, c: Coords, d: Coords): Coords | null => {
  const tTop = (d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x)
  const uTop = (c.y - a.y) * (a.x - b.x) - (c.x - a.x) * (a.y - b.y)
  const bottom = (d.y - c.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y)

  if (bottom !== 0) {
    const t = tTop / bottom
    const u = uTop / bottom
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(a.x, b.x, t),
        y: lerp(a.y, b.y, t),
      }
    }
  }

  return null
}

export const isPolygonsIntersect = (a: Coords[], b: Coords[]) => {
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      const touch = getIntersection(
        a[i],
        a[(i + 1) % a.length],
        b[j],
        b[(j + 1) % b.length],
      )
      if (touch) {
        return true
      }
    }
  }

  return false
}

export const isPointWithinRect = (point: Coords, rect: Rect) => (
  point.x > rect.topLeft.x &&
  point.y > rect.topLeft.y &&
  point.x < rect.bottomRight.x &&
  point.y < rect.bottomRight.y
)

export const getRectPoints = (rect: Rect): Coords[] => (
  [
    { x: rect.topLeft.x, y: rect.topLeft.y },
    { x: rect.bottomRight.x, y: rect.topLeft.y },
    { x: rect.bottomRight.x, y: rect.bottomRight.y },
    { x: rect.topLeft.x, y: rect.bottomRight.y },
  ]
)

export const isRectIntersectsCircle = (rect: Rect, circle: Circle) => {
  const rectWidth = rect.bottomRight.x - rect.topLeft.x
  const rectHeight = rect.bottomRight.y - rect.topLeft.y

  const circleDistanceX = Math.abs(circle.center.x - (rect.topLeft.x + rectWidth / 2))
  const circleDistanceY = Math.abs(circle.center.y - (rect.topLeft.y + rectHeight / 2))

  if (circleDistanceX > (rectWidth / 2 + circle.radius) || circleDistanceY > (rectHeight / 2 + circle.radius)) {
    return false
  }

  if (circleDistanceX <= rectWidth / 2 || circleDistanceY <= rectHeight / 2) {
    return true
  }

  const cornerDistanceSquared = (circleDistanceX - rectWidth / 2) ** 2 + (circleDistanceY - rectHeight / 2) ** 2

  return cornerDistanceSquared <= circle.radius ** 2
}