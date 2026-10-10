import type { Product } from "@/lib/types";
import { ProductGrid } from "@/components/products/ProductGrid";

interface PriceMovementSectionProps {
  title: string;
  products: Product[];
  direction: "up" | "down";
}

export function PriceMovementSection({ title, products, direction }: PriceMovementSectionProps) {
  return (
    <section className="section shell">
      <div className="section-heading">
        <h2 className="movement-title"><span className={`movement-indicator change-${direction}`} aria-hidden="true">{direction === "up" ? "▲" : "▼"}</span>{title}</h2>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
