"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

type NewsTickerProps = {
  items: string[];
};

export default function NewsTicker({ items }: NewsTickerProps) {
  const news = items;
  const newsText = useRef<HTMLDivElement | null>(null);
  let xPercent = 0;
  const animationDuration = 20;

  useEffect(() => {
    const ticker = newsText.current;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (ticker && !still) {
      const tickerWidth = ticker.offsetWidth;

      gsap.set(ticker, { x: xPercent });

      const animation = gsap.to(ticker, {
        x: -tickerWidth,
        duration: animationDuration,
        ease: "linear",
        repeat: -1,
        onRepeat: () => {
          gsap.set(ticker, { x: 0 });
        },
      });

      return () => {
        animation.kill();
      };
    }
  }, [xPercent]);

  return (
    <div className="kicker flex bg-primary text-primary-foreground py-3 mt-4 md:mt-6 w-full relative overflow-hidden">
      <div className="bg-primary z-10 px-4 md:px-6">
        <span className="flex gap-2 bg-primary font-semibold whitespace-nowrap">
          <p>News</p>
          <p className="block sm:hidden">+++</p>
          <p className="hidden sm:block">Ticker +++</p>
        </span>
      </div>
      <div ref={newsText} className="flex gap-4 sliding-ticker relative">
        {news.map((newsItem, index) => (
          <div
            key={index}
            className={`whitespace-nowrap ${
              index === news.length - 1 ? "overflow-visible" : "overflow-hidden"
            }`}
            style={{ right: index === news.length - 1 ? "0" : "" }}
          >
            <p>{newsItem}+++</p>
          </div>
        ))}
      </div>
    </div>
  );
}
