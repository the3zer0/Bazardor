import { ProductSkeletons } from "@/components/products/ProductGrid";

export default function Loading() {
  return <section className="section shell"><ProductSkeletons count={8} /></section>;
}