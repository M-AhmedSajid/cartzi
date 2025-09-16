import { categoryType } from './categoryType'
import { colorType } from './colorType'
import { discountCodeType } from './discountCodeType'
import { materialType } from './materialType'
import { menuType } from './menuType'
import { productType } from './productType'
import { promoType } from './promoType'
import { shippingRuleType } from './shippingRuleType'
import { socialLinkType } from './socialLinkType'

export const schema = {
  types: [productType, categoryType, colorType, materialType, promoType, discountCodeType, shippingRuleType, menuType, socialLinkType],
}
