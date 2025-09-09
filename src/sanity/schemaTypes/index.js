import { categoryType } from './categoryType'
import { colorType } from './colorType'
import { materialType } from './materialType'
import { productType } from './productType'
import { promoType } from './promoType'

export const schema = {
  types: [productType, categoryType, colorType, materialType, promoType],
}
