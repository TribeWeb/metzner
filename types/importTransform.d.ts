declare type Product = z.infer<typeof productSchema>
// declare type Machine = z.infer<typeof machineSchema>

declare interface MetaContent {
  name?: 'keywords' | 'robots' | 'author' | 'copyright'
  content?: string
}

// declare interface Frontmatter {
//   title: string
//   description: string
//   draft: boolean
//   navigation: boolean
//   head: {
//     meta: MetaContent[]
//   }
//   robots: boolean
//   layout?: string
//   slug: string
//   folder: string
//   manufacturerSlug: string
//   manufacturerName: string
//   productCode: string
//   productSlug: string
//   // universal product values
//   modelRange: string
//   modelSeries: string
//   modelCode: string
//   caseWidth: string
//   caseHeight: string
//   vOutMin: number
//   vOutMax: number
//   iOutMin: number
//   iOutMax: number
//   pOutMax: number
//   vSupplyMin: number
//   vSupplyMax: number
//   supplyPhase: number
//   // buying specific values
//   priceType: string
//   priceNett: number
//   priceVAT: number
//   weight: number
//   // range specific product values
//   acOptions: string
//   interfaceOptions: string
//   panelOptions: string
//   accessoriesOptions: string
//   handlingId: string
//   // brand: string
//   // model: string
//   // price: number
//   // weight: number
//   // voltageDcOutput?: string
//   // wattage?: number
//   // rackmountSize?: string
//   // inputDescription?: string
//   // outputDescription?: string
// }
