export interface Point {
  x: number
  y: number
}

export interface Corner {
  perimeter: Point
  corner: Point
}

export function calculateCoordinates(
  diameter: number,
  machineMax: number,
  width: number,
  height: number
) {
  const scale = diameter / machineMax
  const offset = 0.146 * diameter

  return {
    circleCentre: {
      x: scale * (width - (machineMax / 2)),
      y: height - (diameter / 2)
    },
    bottomLeft: {
      perimeter: {
        x: scale * (width - machineMax) + offset,
        y: height - offset
      },
      corner: {
        x: scale * (width - machineMax),
        y: height
      }
    },
    topRight: {
      perimeter: {
        x: scale * width - offset,
        y: (height - diameter) + offset
      },
      corner: {
        x: scale * width,
        y: height - diameter
      }
    }
  }
}
