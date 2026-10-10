"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { ProductGrid } from "@/components/products/ProductGrid";

export function ProductSort({ products }: { products: Product[] }) {
  const [sort, setSort] = useState("default");
  const sorted = useMemo(() => {
    if (sort === "asc") return [...products].sort((a, b) => a.today - b.today);
    if (sort === "desc") return [...products].sort((a, b) => b.today - a.today);
    return products;
  }, [products, sort]);
  return <><div className="sort-row"><label htmlFor="sort">সাজান</label><select id="sort" value={sort} onChange={(event) => setSort(event.target.value)}><option value="default">ডিফল্ট</option><option value="asc">দাম: কম থেকে বেশি</option><option value="desc">দাম: বেশি থেকে কম</option></select></div><ProductGrid products={sorted} /></>;
}