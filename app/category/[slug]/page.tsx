import { notFound } from "next/navigation";
import { EmptyState } from "@/components/products/EmptyState";
import { ProductSort } from "@/components/products/ProductSort";
import { getCategories, getCategory, getProducts } from "@/lib/api";

export const instant = false;

export async function generateStaticParams() {
  try { return (await getCategories()).map((category) => ({ slug: category.slug })); } catch { return []; }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let category;
  try {
    category = await getCategory(slug);
  } catch {
    return (
      <section className="section shell">
        <div className="api-error">
          <h2>বিভাগের তথ্য আনা যায়নি</h2>
          <p>এই মুহূর্তে বিভাগের তথ্য পাওয়া যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।</p>
        </div>
      </section>
    );
  }
  if (!category) notFound();
  let products;
  try { products = await getProducts(slug); } catch { return <section className="section shell"><div className="api-error"><h2>দাম আনা যায়নি</h2><p>এই বিভাগের তথ্য এই মুহূর্তে পাওয়া যাচ্ছে না। পরে আবার চেষ্টা করুন।</p></div></section>; }
  return <section className="section shell category-page"><div className="category-hero"><span className="category-large-icon">{category.icon}</span><div><p className="section-kicker">বাজারের বিভাগ</p><h1>{category.nameBn}</h1><p>{products.length ? `${products.length}টি পণ্যের আজকের দাম` : "এই বিভাগে এখন কোনো পণ্য নেই"}</p></div></div>{products.length ? <ProductSort products={products} /> : <EmptyState title="এই বিভাগে কোনো পণ্য নেই" detail="অন্য কোনো বিভাগ দেখে নিত্যপ্রয়োজনীয় পণ্যের দাম খুঁজে নিন।" />}</section>;
}
