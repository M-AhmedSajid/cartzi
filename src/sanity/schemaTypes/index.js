import { categoryType } from './categoryType'
import { colorType } from './colorType'
import { materialType } from './materialType'
import { menuType } from './menuType'
import { productType } from './productType'
import { promoType } from './promoType'
import { socialLinkType } from './socialLinkType'

export const schema = {
  types: [productType, categoryType, colorType, materialType, promoType, menuType, socialLinkType],
}
