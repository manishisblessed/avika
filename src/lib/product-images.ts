export const PRODUCT_PLACEHOLDER = "/products/placeholder.jpg";

export function productThumbnail(url: string): string {
  return url;
}

export function productImageSrc(
  images: string[],
  index = 0,
): string {
  return images[index] ?? images[0] ?? PRODUCT_PLACEHOLDER;
}
