"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import type { Category, Product } from "@/lib/types";
import { formatPercent, formatPrice, formatUnit, priceDirection } from "@/lib/format";
import { UserAvatar } from "@/components/UserAvatar";

interface SiteHeaderProps {
  categories: Category[];
  products: Product[];
}

export function SiteHeader({ categories, products }: SiteHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [banglaDate, setBanglaDate] = useState("আজকের বাজার");
  const userMenuRef = useRef<HTMLDetailsElement>(null);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    function closeUserMenu(event: PointerEvent) {
      const menu = userMenuRef.current;
      if (menu && !menu.contains(event.target as Node)) menu.open = false;
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && userMenuRef.current) userMenuRef.current.open = false;
    }

    document.addEventListener("pointerdown", closeUserMenu);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", closeUserMenu);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setBanglaDate(new Intl.DateTimeFormat("bn-BD", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date()));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("সফলভাবে সাইন আউট হয়েছে");
          router.push("/");
          router.refresh();
        },
        onError: (context) => { toast.error(context.error.message); },
      },
    });
  }

  const tickerProducts = products.slice(0, 12);
  return (
    <header className="site-header">
      <div className="shell header-top">
        <Link href="/" className="brand" aria-label="বাজার দর হোম পেজ">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 40 40" focusable="false">
              <path d="M9 10h3l2.4 15.2h15.2l3-11.1H14" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
              <path d="M16 19h14M17 22h12" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
              <circle cx="17.5" cy="29.5" r="1.7" fill="currentColor" />
              <circle cx="28" cy="29.5" r="1.7" fill="currentColor" />
            </svg>
          </span>
          <span>
            <strong>বাজার দর</strong>
            <small>{banglaDate}</small>
          </span>
        </Link>
        <div className="header-actions">
          {session?.user ? (
            <details className="user-menu" ref={userMenuRef}>
              <summary className="user-menu-trigger">
                <UserAvatar src={session.user.image} imageClassName="user-avatar" fallbackClassName="user-avatar user-avatar-fallback" size={32} />
                <span className="user-menu-name">{session.user.name}</span>
                <span className="user-menu-chevron" aria-hidden="true">
                  <svg viewBox="0 0 16 16"><path d="m4 6 4 4 4-4" /></svg>
                </span>
              </summary>
              <div className="user-menu-panel">
                <div className="user-menu-heading">
                  <strong>{session.user.name}</strong>
                  <span>{session.user.email}</span>
                </div>
                <Link href="/profile" onClick={() => { userMenuRef.current?.removeAttribute("open"); }}>
                  <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="6" r="3" /><path d="M4.5 17v-1.5a5.5 5.5 0 0 1 11 0V17z" /></svg>
                  <span>আমার প্রোফাইল</span>
                </Link>
                <button type="button" onClick={signOut}>
                  <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M8 3H4.5A1.5 1.5 0 0 0 3 4.5v11A1.5 1.5 0 0 0 4.5 17H8" /><path d="M11 6l4 4-4 4M15 10H7" /></svg>
                  <span>সাইন আউট</span>
                </button>
              </div>
            </details>
          ) : (
            <>
              <Link className="text-link hide-mobile" href="/signin">সাইন ইন</Link>
              <Link className="button button-dark" href="/signup">সাইন আপ</Link>
            </>
          )}
          <button
            className="menu-button"
            type="button"
            aria-label="মেনু খুলুন"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            ☰
          </button>
        </div>
      </div>
      <div className={`shell category-row ${menuOpen ? "is-open" : ""}`}>
        <Link className={pathname === "/" ? "active" : ""} href="/">হোম</Link>
        {categories.map((category) => (
          <Link
            className={pathname === `/category/${category.slug}` ? "active" : ""}
            href={`/category/${category.slug}`}
            key={category.slug}
            onClick={() => setMenuOpen(false)}
          >
            <span>{category.icon}</span> {category.nameBn}
          </Link>
        ))}
      </div>
      <div className="ticker" aria-label="সাম্প্রতিক বাজার দর">
        <div className="ticker-track">
          {[...tickerProducts, ...tickerProducts].map((product, index) => {
            const direction = priceDirection(product.today, product.yesterday);
            return (
              <span className="ticker-item" key={`${product.id}-${index}`}>
              {product.image} {product.nameBn} · <span className={`ticker-price ticker-price-${direction}`}>{formatPrice(product.today)}</span> / {formatUnit(product.unit)} ·
              <b
                className={`ticker-change ticker-change-${direction}`}
              >
                {product.yesterday == null ? "—" : `${direction === "up" ? "▲" : direction === "down" ? "▼" : "—"} ${formatPercent(product.change.pct)}`}
              </b>
              </span>
            );
          })}
        </div>
      </div>
    </header>
  );
}
