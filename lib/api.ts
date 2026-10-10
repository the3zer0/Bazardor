import type { Category, Product } from "@/lib/types";

export const API_BASE_URL =
  process.env.BAZARDOR_API_URL ??
  "https://api.api-store.workers.dev/api/bazardor";
const FALLBACK_API_BASE_URL = "https://api.abcz.workers.dev/api/bazardor";

async function request<T>(path: string): Promise<T> {
  const baseUrls =
    API_BASE_URL === FALLBACK_API_BASE_URL
      ? [API_BASE_URL]
      : [API_BASE_URL, FALLBACK_API_BASE_URL];
  let lastError: unknown;

  for (const baseUrl of baseUrls) {
    try {
      const response = await fetch(`${baseUrl}/${path}`, {
        next: { revalidate: 300 },
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Market data is unavailable from all configured API sources.");
}

export async function getProducts(category?: string): Promise<Product[]> {
  const path = category ? `products?category=${encodeURIComponent(category)}` : "products";
  return request<Product[]>(path);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((product) => product.slug === slug);
}

export async function getCategories(): Promise<Category[]> {
  return request<Category[]>("categories");
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  const categories = await getCategories();
  return categories.find((category) => category.slug === slug);
}
