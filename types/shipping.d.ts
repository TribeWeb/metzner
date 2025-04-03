declare interface ShippingReturn {
  regionList: { value: string, label: string }[]
  regionName: string
  region: string
  price: number
}

declare interface ShippingRegion {
  regionName: string
  region: string
  outcodeLookup: boolean
  outcodes: string[] | string
  priceDefault: number
  pricePoints: { maxWeight: number, price: number }[]
}

declare interface ShippingQuery {
  outcode?: string | null
  region?: string | null
  getRegionList?: boolean
  weight?: number
}
