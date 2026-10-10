import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { requireSession } from "@/lib/auth-config";
import { getProduct } from "@/lib/api";
import { changeLabel, formatPrice, formatUnit, priceDirection, priceSummary } from "@/lib/format";

export const instant = false;

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  // Product details are protected by the user's current session. Wait for the
  // request before rendering so Next.js cannot serve a prerendered shell first.
  await connection();
  const { slug } = await params;
  await requireSession("পণ্যের বিস্তারিত দেখতে আগে সাইন ইন করুন");
  let product;
  try {
    product = await getProduct(slug);
  } catch {
    return <section className="section shell"><div className="api-error"><h2>দামের তথ্য আনা যায়নি</h2><p>এই মুহূর্তে পণ্যের বাজারদর পাওয়া যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।</p></div></section>;
  }
  if (!product) notFound();
  const summary = priceSummary(product.markets);
  const todayDirection = priceDirection(product.today, product.yesterday);
  const difference = product.yesterday == null ? null : Math.abs(product.today - product.yesterday);
  return (
    <section className="section shell detail-page">
      <nav className="detail-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">হোম</Link><span>›</span>
        <Link href={`/category/${product.category}`}>{product.categoryNameBn}</Link><span>›</span>
        <span aria-current="page">{product.nameBn}</span>
      </nav>
      <article className="detail-product-card">
        <span className="detail-icon">{product.image}</span>
        <div className="detail-product-copy">
          <h1>{product.nameBn}</h1>
          <p>{formatUnit(product.unit)} · {product.categoryNameBn}</p>
          <small>{difference == null ? "আজকের দামের আগের রেকর্ড পাওয়া যায়নি" : <>সর্বশেষ তুলনায় আজ দাম {changeLabel(todayDirection)} : {formatPrice(difference)}</>}</small>
        </div>
        <div className={`detail-current-price change-${todayDirection}`}>
          <span>আজকের দাম</span>
          <strong>{formatPrice(product.today).replace(" টাকা", "")}</strong>
          <span>টাকা / {formatUnit(product.unit).replace("প্রতি ", "")}</span>
          <b className={`change-${todayDirection}`}>          {product.yesterday == null ? "—" : `${todayDirection === "up" ? "▲" : todayDirection === "down" ? "▼" : "—"} ${product.change.pct}%`}</b>
        </div>
      </article>
      <article className="detail-data-card">
        <h2>দামের সারসংক্ষেপ</h2>
        <div className="summary-grid">
          <div><span>সর্বনিম্ন দাম</span><strong>{formatPrice(summary.min)}</strong><small>সকল বাজারের মধ্যে সর্বনিম্ন</small></div>
          <div className="summary-max"><span>সর্বাধিক দাম</span><strong>{formatPrice(summary.max)}</strong><small>সকল বাজারের মধ্যে সর্বাধিক</small></div>
          <div><span>গড় দাম</span><strong>{formatPrice(summary.average)}</strong><small>সকল বাজারের গড়</small></div>
        </div>
        <div className="market-section">
          <h2>বাজারভিত্তিক আজকের দাম</h2>
          <div className="market-table-scroll">
            <table className="market-table">
              <thead><tr><th>বাজার</th><th>বিভাগ</th><th>সর্বনিম্ন</th><th>সর্বাধিক</th><th>গড় দাম</th></tr></thead>
              <tbody>{product.markets.map((market) => (
                (() => {
                  const currentPrice = Math.round((market.min + market.max) / 2);
                  return (
                <tr key={`${market.market}-${market.division}`}>
                  <td>{market.market}</td><td>{market.division}</td>
                  <td>{formatPrice(market.min)}</td>
                  <td>{formatPrice(market.max)}</td>
                  <td>{formatPrice(currentPrice)}</td>
                </tr>
                  );
                })()
              ))}</tbody>
            </table>
          </div>
        </div>
      </article>
    </section>
  );
}
