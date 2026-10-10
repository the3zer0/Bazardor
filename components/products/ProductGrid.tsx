import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/products/ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="product-grid">
      {products.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  );
}

export function ProductSkeletons({ count = 6 }: { count?: number }) {
  return (
    <div className="product-grid" aria-label="পণ্য লোড হচ্ছে" aria-busy="true">
      {Array.from({ length: count }, (_, index) => <div className="product-skeleton" key={index} />)}
    </div>
  );
}