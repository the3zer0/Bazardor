import Link from "next/link";

export function EmptyState({ title = "কোনো পণ্য পাওয়া যায়নি", detail = "এই তালিকাটি এখন খালি।" }: { title?: string; detail?: string }) {
  return <div className="empty-state"><span aria-hidden="true">◌</span><h2>{title}</h2><p>{detail}</p><Link className="button button-dark" href="/">হোম পেজে ফিরে যান</Link></div>;
}