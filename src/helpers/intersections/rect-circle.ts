import { Circle, Rect } from '../shapes'

export const rectCircle = (rect: Rect, circle: Circle) => {
  const circleDistanceX = Math.abs(circle.center.x - (rect.topLeft.x + rect.width / 2))
  const circleDistanceY = Math.abs(circle.center.y - (rect.topLeft.y + rect.height / 2))

  if (circleDistanceX > (rect.width / 2 + circle.radius) || circleDistanceY > (rect.height / 2 + circle.radius)) {
    return false
  }

  if (circleDistanceX <= rect.width / 2 || circleDistanceY <= rect.height / 2) {
    return true
  }

  const cornerDistanceSquared = (circleDistanceX - rect.width / 2) ** 2 + (circleDistanceY - rect.height / 2) ** 2

  return cornerDistanceSquared <= circle.radius ** 2
}
