const UK_VAT_RATE_MULTIPLIER = 1.2
export function transformProductObjectToFrontmatter(productObject: ProductObject) {
  const keywords: MetaContent = {
    name: 'keywords',
    content: ''
  }
  const author: MetaContent = {
    name: 'author',
    content: ''
  }
  const copyright: MetaContent = {
    name: 'copyright',
    content: ''
  }
  const productCode = normaliseText(productObject.productCode)
  const manufacturerSlug = normaliseText(productObject.manufacturerSlug)
  const manufacturerName = normaliseText(productObject.manufacturerName)

  const frontmatter: Frontmatter = {
    // page values
    title: createTitleFromManufacturerNameAndProductCode(manufacturerName, productCode),
    description: normaliseText(productObject.description),
    draft: false,
    navigation: true,
    head: {
      meta: [keywords, author, copyright]
    },
    robots: true,
    layout: 'product',
    slug: encodeSlug(normaliseSlug(productCode)),
    folder: normaliseSlug(manufacturerSlug),
    manufacturerSlug: encodeSlug(normaliseSlug(manufacturerSlug)),
    manufacturerName: manufacturerName,
    productCode: productCode,
    // universal product values
    modelRange: normaliseText(productObject.modelRange),
    modelSeries: normaliseText(productObject.modelSeries),
    modelCode: normaliseText(productObject.modelCode),
    caseWidth: normaliseText(productObject.caseWidth),
    caseHeight: normaliseText(productObject.caseHeight),
    vOutMin: normaliseNumber(productObject.vOutMin),
    vOutMax: normaliseNumber(productObject.vOutMax),
    iOutMin: normaliseNumber(productObject.iOutMin),
    iOutMax: normaliseNumber(productObject.iOutMax),
    pOutMax: normaliseNumber(productObject.pOutMax),
    vSupplyMin: normaliseNumber(productObject.vSupplyMin),
    vSupplyMax: normaliseNumber(productObject.vSupplyMax),
    supplyPhase: normaliseNumber(productObject.supplyPhase),
    // buying specific values
    priceType: normaliseText(productObject.priceType),
    priceNett: normaliseNumber(productObject.priceNett),
    priceVAT: normaliseNumber(productObject.priceNett) * UK_VAT_RATE_MULTIPLIER,
    weight: normaliseNumber(productObject.weight),
    // range specific product values
    acOptions: normaliseText(productObject.acOptions),
    interfaceOptions: normaliseText(productObject.interfaceOptions),
    panelOptions: normaliseText(productObject.panelOptions),
    accessoriesOptions: normaliseText(productObject.accessoriesOptions)
  }
  return frontmatter
}

function createTitleFromManufacturerNameAndProductCode(
  manufacturerName: string,
  productCode: string
): string {
  return `${manufacturerName} ${productCode}`
}

function normaliseSlug(raw: string): string {
  return raw
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .trim()
}

function encodeSlug(raw: string): string {
  return encodeURI(raw)
}

function normaliseText(raw: string | boolean | number | undefined): string {
  return (raw?.toString() || '').trim()
}

function normaliseNumber(raw: string | boolean | number | undefined): number {
  return parseFloat(String(raw || 0))
}

// export function transformProductObjectToFrontmatter(productObject: ProductObject) {
//   const keywords: MetaContent = {
//     name: 'keywords',
//     content: ''
//   }
//   const author: MetaContent = {
//     name: 'author',
//     content: ''
//   }
//   const copyright: MetaContent = {
//     name: 'copyright',
//     content: ''
//   }
//   const productCode = productObject.productCode?.toString() || ''
//   const brand = productObject.brand?.toString() || ''

//   const frontmatter: Frontmatter = {
//     title: composeTitle(brand, productCode),
//     description: productObject.description?.toString() || '',
//     draft: false,
//     navigation: true,
//     head: {
//       meta: [keywords, author, copyright]
//     },
//     robots: true,
//     layout: 'product',
//     slug: getSlug(productCode),
//     folder: getSlug(brand),
//     brand: brand,
//     model: productCode,
//     price: parseFloat((productObject.price || 0).toString()),
//     weight: parseFloat((productObject.weight || 0).toString()),
//     voltageDcOutput: productObject.voltage?.toString(),
//     wattage: parseFloat((productObject.wattage || 0).toString()),
//     rackmountSize: productObject.rackmountSize?.toString(),
//     inputDescription: productObject.inputDescription?.toString(),
//     outputDescription: productObject.outputDescription?.toString()
//   }
//   return frontmatter
// }

// ---
// title: 'My Page Title'
// description: 'What a lovely page.'
// image:
//   src: '/assets/image.jpg'
//   alt: 'An image showcasing My Page.'
//   width: 400
//   height: 300
// head:
//   meta:
//     - name: 'keywords'
//       content: 'nuxt, vue, content'
//     - name: 'robots'
//       content: 'index, follow'
//     - name: 'author'
//       content: 'NuxtLabs'
//     - name: 'copyright'
//       content: '© 2022 NuxtLabs'
// ---

// function getBool(val: any) {
//   const num = +val
//   return !isNaN(num) ? !!num : !!String(val).toLowerCase()
// }

// function listToArray(productObject: any, fieldName: string, defaultVal: string = '') {
//   return getLayoutValue(productObject, fieldName, defaultVal)
//     ?.trim()
//     ?.split(/\r?\n/)
//     ?.map((item: string) => item.trim())
// }

// function pickListToArray(productObject: any, fieldName: string, defaultVal: string = '') {
//   return getLayoutValue(productObject, fieldName, defaultVal)
//     ?.split(';')
//     ?.map((item: string) => item.trim())
// }

// function getLayoutValue(articleproductObject: any, fieldName: string, defaultVal: string = ''): string {
//   // console.log(fieldName)
//   return articleproductObject.layoutItems.find((item: { name: string }) => item.name === fieldName)?.value?.trim() ?? defaultVal
// }
