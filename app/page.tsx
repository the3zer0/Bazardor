import { Hero } from "@/components/home/Hero";
import { PriceMovementSection } from "@/components/home/PriceMovementSection";
import { EmptyState } from "@/components/products/EmptyState";
import { ProductGrid } from "@/components/products/ProductGrid";
import { getProducts } from "@/lib/api";
import { priceDirection } from "@/lib/format";

export default async function Home() {
  let products;
  try {
    products = await getProducts();
  } catch {
    return <><Hero /><section className="section shell"><div className="api-error"><h2>দাম আনা যায়নি</h2><p>এই মুহূর্তে বাজারের তথ্য পাওয়া যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।</p></div></section></>;
  }

  const risers = products.filter((product) => priceDirection(product.today, product.yesterday) === "up").sort((a, b) => b.change.pct - a.change.pct).slice(0, 6);
  const fallers = products.filter((product) => priceDirection(product.today, product.yesterday) === "down").sort((a, b) => a.change.pct - b.change.pct).slice(0, 6);

  return (
    <>
      <Hero />
      <PriceMovementSection title="আজ দাম বেড়েছে" products={risers} direction="up" />
      <PriceMovementSection title="আজ দাম কমেছে" products={fallers} direction="down" />
      <section className="section shell" id="সব-পণ্য">
        <div className="section-heading"><div><p className="section-kicker">বাজারের সম্পূর্ণ ছবি</p><h2>সব পণ্য</h2><p className="section-description">আজকের প্রয়োজনীয় সব পণ্যের দাম একসাথে দেখুন।</p></div></div>
        {products.length ? <ProductGrid products={products} /> : <EmptyState title="এখন কোনো পণ্য পাওয়া যায়নি" detail="বাজারের পণ্যের তালিকা পরে আবার দেখুন।" />}
      </section>
    </>
  );
}
