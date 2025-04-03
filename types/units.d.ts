declare interface AttributeUnit {
  key: AttributeUnits
  label: string
  labelAlt: string | ''
  unitCode: string | ''
  type: 'QuantitativeValue' | 'additionalProperty'
  unitSI: string | ''
  unitAlt: string | ''
  unitName: string | ''
  unitAltName: string | ''
  defaultValue: number | string | ''
  minValue: number | string | ''
  maxValue: number | string | ''
}

declare type ProductAttributes = 'vInNom' | 'vInMin' | 'vInMax' | 'vOutNom' | 'vOutMax' | 'vOutMin' | 'iOutMax' | 'pOutMax' | 'vSupplyMin' | 'vSupplyMax' | 'supplyPhase' | 'priceNett' | 'priceVAT' | 'weight' | 'rackWidth' | 'rackHeight' | 'height' | 'depth' | 'width' | 'length'

declare type AttributeUnits = 'vdc' | 'vac' | 'current' | 'power' | 'phase' | 'weight' | 'rackWidth' | 'rackHeight' | 'height' | 'depth' | 'width' | 'length'

declare interface UnitMap {
  key: ProductAttributes
  unit: AttributeUnits
}
