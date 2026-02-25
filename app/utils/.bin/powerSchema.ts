// https://github.com/schemaorg/schemaorg/wiki/Using-UN-CEFACT-Codes

const unitSchema: AttributeUnit[] = [
  {
    key: 'vdc',
    label: 'Voltage',
    labelAlt: 'D.C. voltage',
    unitCode: 'VLT',
    type: 'QuantitativeValue',
    unitSI: 'V',
    unitAlt: 'Vdc',
    unitName: 'Volts',
    unitAltName: 'Volts D.C.',
    defaultValue: 0,
    minValue: 0,
    maxValue: 1 / 0
  },
  {
    key: 'vac',
    label: 'Voltage',
    labelAlt: 'A.C. voltage',
    unitCode: 'VLT',
    type: 'QuantitativeValue',
    unitSI: 'V',
    unitAlt: 'Vac',
    unitName: 'Volts',
    unitAltName: 'Volts A.C.',
    defaultValue: 0,
    minValue: 0,
    maxValue: 1 / 0
  },
  {
    key: 'current',
    label: 'Current',
    labelAlt: '',
    unitCode: 'A78',
    type: 'QuantitativeValue',
    unitSI: 'A',
    unitAlt: '',
    unitName: 'Amps',
    unitAltName: '',
    defaultValue: 0,
    minValue: 0,
    maxValue: 1 / 0
  },
  {
    key: 'power',
    label: 'Power',
    labelAlt: '',
    unitCode: 'WTT',
    type: 'QuantitativeValue',
    unitSI: 'W',
    unitAlt: '',
    unitName: 'Watts',
    unitAltName: '',
    defaultValue: 0,
    minValue: 0,
    maxValue: 1 / 0
  },
  {
    key: 'phase',
    label: 'Phase',
    labelAlt: '',
    unitCode: '',
    type: 'additionalProperty',
    unitSI: '',
    unitAlt: '',
    unitName: 'phase',
    unitAltName: '',
    defaultValue: 'Single',
    minValue: 'Single',
    maxValue: 3
  },
  {
    key: 'weight',
    label: 'Weight',
    labelAlt: '',
    unitCode: 'KGM',
    type: 'QuantitativeValue',
    unitSI: 'kg',
    unitAlt: '',
    unitName: 'Kilograms',
    unitAltName: '',
    defaultValue: 0,
    minValue: 0,
    maxValue: 1 / 0
  },
  {
    key: 'rackWidth',
    label: 'Rackmount width',
    labelAlt: 'Rack width',
    unitCode: '',
    type: 'additionalProperty',
    unitSI: '',
    unitAlt: '',
    unitName: '',
    unitAltName: '',
    defaultValue: 'Full rack',
    minValue: 'Half rack',
    maxValue: 'Full rack'
  },
  {
    key: 'rackHeight',
    label: 'Rackmount height',
    labelAlt: 'Rack height',
    unitCode: '',
    type: 'additionalProperty',
    unitSI: '',
    unitAlt: '',
    unitName: '',
    unitAltName: '',
    defaultValue: '1U',
    minValue: '1U',
    maxValue: '6U'
  },
  {
    key: 'length',
    label: 'Length',
    labelAlt: '',
    unitCode: 'MMT',
    type: 'QuantitativeValue',
    unitSI: '',
    unitAlt: 'mm',
    unitName: 'Millimeters',
    unitAltName: '',
    defaultValue: 0,
    minValue: 0,
    maxValue: 1 / 0
  },
  {
    key: 'width',
    label: 'Width',
    labelAlt: '',
    unitCode: 'MMT',
    type: 'QuantitativeValue',
    unitSI: '',
    unitAlt: 'mm',
    unitName: 'Millimeters',
    unitAltName: '',
    defaultValue: 0,
    minValue: 0,
    maxValue: 1 / 0
  },
  {
    key: 'height',
    label: 'Height',
    labelAlt: '',
    unitCode: 'MMT',
    type: 'QuantitativeValue',
    unitSI: '',
    unitAlt: 'mm',
    unitName: 'Millimeters',
    unitAltName: '',
    defaultValue: 0,
    minValue: 0,
    maxValue: 1 / 0
  },
  {
    key: 'depth',
    label: 'Depth',
    labelAlt: '',
    unitCode: 'MMT',
    type: 'QuantitativeValue',
    unitSI: '',
    unitAlt: 'mm',
    unitName: 'Millimeters',
    unitAltName: '',
    defaultValue: 0,
    minValue: 0,
    maxValue: 1 / 0
  }
]

const unitMapping: UnitMap[] = [
  {
    key: 'vOutNom',
    unit: 'vdc'
  },
  {
    key: 'vOutMax',
    unit: 'vdc'
  },
  {
    key: 'vOutMin',
    unit: 'vdc'
  },
  {
    key: 'iOutMax',
    unit: 'current'
  },
  {
    key: 'pOutMax',
    unit: 'power'
  },
  {
    key: 'vInNom',
    unit: 'vdc'
  },
  {
    key: 'vInMin',
    unit: 'vdc'
  },
  {
    key: 'vInMax',
    unit: 'vdc'
  },
  {
    key: 'vSupplyMax',
    unit: 'vac'
  },
  {
    key: 'vSupplyMin',
    unit: 'vac'
  },
  {
    key: 'supplyPhase',
    unit: 'phase'
  },
  {
    key: 'weight',
    unit: 'weight'
  },
  {
    key: 'rackWidth',
    unit: 'rackWidth'
  },
  {
    key: 'rackHeight',
    unit: 'rackHeight'
  },
  {
    key: 'length',
    unit: 'length'
  },
  {
    key: 'width',
    unit: 'width'
  },
  {
    key: 'height',
    unit: 'height'
  },
  {
    key: 'depth',
    unit: 'depth'
  }
]

export default { unitMapping, unitSchema }
