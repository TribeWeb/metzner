export interface Point {
  x: number
  y: number
}

export interface Corner {
  perimeter: Point
  corner: Point
}

export function calculateCircleCoordinates(
  diameter: number,
  height: number
) {
  const offset = 0.146 * diameter

  return {
    circleCentre: {
      x: diameter / 2,
      y: height - (diameter / 2)
    },
    bottomLeft: {
      perimeter: {
        x: offset,
        y: height - offset
      },
      corner: {
        x: 0,
        y: height
      }
    },
    topRight: {
      perimeter: {
        x: diameter - offset,
        y: (height - diameter) + offset
      },
      corner: {
        x: diameter,
        y: height - diameter
      }
    }
  }
}
