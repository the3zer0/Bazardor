import Link from "next/link";
import { formatPercent, formatPrice, formatUnit, priceDirection } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const direction = priceDirection(product.today, product.yesterday);
  return (
    <Link className="product-card" href={`/product/${product.slug}`}>
      <div className="product-card-top">
        <span className="product-icon" aria-hidden="true">{product.image}</span>
        <span className="product-card-info">
          <h3>{product.nameBn}</h3>
          <span className="product-unit">{formatUnit(product.unit)}</span>
        </span>
      </div>
      <div className="product-price">
        <span className="product-price-copy">
          <span>আজকের দাম</span>
          <strong className={`change-${direction}`}>{formatPrice(product.today)}</strong>
        </span>
        <span className={`change-badge change-${direction}`}>
          {product.yesterday == null ? "—" : `${direction === "up" ? "▲" : direction === "down" ? "▼" : "—"} ${formatPercent(product.change.pct)}`}
        </span>
      </div>
    </Link>
  );
}
