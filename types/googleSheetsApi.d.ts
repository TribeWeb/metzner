// declare type GoogleSheetsApiValues = string[][]

// declare interface GoogleSheetsApiValuesResponse {
//   values: GoogleSheetsApiValues
// }

declare type Import = z.infer<typeof machines> | z.infer<typeof about> | z.infer<typeof machinemap>

type GoogleSheetsApiValues = string[][]

interface GoogleSheetsApiValuesResponse {
  range: string
  majorDimension: string
  values: GoogleSheetsApiValues
}

declare type GoogleSheetsApiSheet = {
  properties: {
    sheetId: string
    title: string
    index: number
    sheetType: string
    gridProperties: {
      rowCount: number
      columnCount: number
    }
  }
}

declare interface GoogleSheetsApiSheetResponse {
  spreadsheetId: string
  properties: {
    title: string
    locale: string
    autoRecalc: string
    timeZone: string
    defaultFormat: {
      backgroundColor: {
        red: number
        green: number
        blue: number
      }
      padding: {
        top: number
        right: number
        bottom: number
        left: number
      }
      verticalAlignment: string
      wrapStrategy: string
      textFormat: {
        foregroundColorStyle: {
          rgbColor: {
            red: number
            green: number
            blue: number
          }
        }
        foregroundColor: {
          red: number
          green: number
          blue: number
        }
        fontSize: number
        bold: boolean
        italic: boolean
        strikethrough: boolean
        underline: boolean
        fontFamily: string
      }
      backgroundColorStyle: {
        rgbColor: {
          red: number
          green: number
          blue: number
        }
      }
    }
  }
  sheets: GoogleSheetsApiSheet[]
  spreadsheetUrl: string
}

declare interface ProductObject {
  [key: string]: string
}

  declare type TransformedGoogleSheetsApiResult = ProductObject[]
