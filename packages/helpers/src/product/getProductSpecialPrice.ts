import { Product } from "@shopware-pwa/shopware-6-client/src/interfaces/models/content/product/Product";

/**
 * @alpha
 */
export function getProductSpecialPrice(product: Product): number {
  const price = product?.calculatedPrices?.[0]?.unitPrice;
  return price || 0;
}
