"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function Hero() {
  const [today, setToday] = useState("আজকের বাজার");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setToday(new Intl.DateTimeFormat("bn-BD", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Dhaka",
      }).format(new Date()));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="hero shell">
      <div className="hero-copy">
        <p className="eyebrow">{today}</p>
        <h1>আজকের বাজারের দাম এক নজরে</h1>
        <p className="hero-subtitle">চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।</p>
        <a className="button button-accent" href="#সব-পণ্য">সব পণ্য দেখুন <span aria-hidden="true">↓</span></a>
      </div>
      <div className="hero-art">
        <Image src="/bazar-hero.png" alt="বাজারের তাজা পণ্যের ঝুড়ি" width={315} height={263} priority />
      </div>
    </section>
  );
}
