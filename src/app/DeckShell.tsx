"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { Download } from "lucide-react";
import { initHourglass, SlideState } from "./hourglass";
import { deckCss } from "./deckCss";

type Props = {
  deck: "02" | "03";
  names: string[]; // слайд бүрийн богино нэр (хөшиг, тоолуур)
  brandSub: (i: number) => string; // дээд мөрийн дэд нэр
  poseFor: (i: number) => SlideState;
  renderSlide: (i: number) => ReactNode;
  pptx: string; // татах файлын зам
  extraCss?: string;
  className?: string;
};

/** Хоёр илтгэлийн нийтлэг хүрээ: 3D цаг, хөшигтэй шилжилт, удирдлага, PPTX татах товч. */
export default function DeckShell({
  deck,
  names,
  brandSub,
  poseFor,
  renderSlide,
  pptx,
  extraCss,
  className,
}: Props) {
  const count = names.length;
  const [index, setIndex] = useState(0);
  const [isBusy, setIsBusy] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const curtainRef = useRef<HTMLDivElement>(null);
  const curtainCountRef = useRef<HTMLDivElement>(null);
  const curtainNameRef = useRef<HTMLDivElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const slideContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

  const hourglassRef = useRef<{
    onChange: (d: number) => void;
    destroy: () => void;
  } | null>(null);
  const indexRef = useRef(index);
  indexRef.current = index;
  const poseRef = useRef(poseFor);
  poseRef.current = poseFor;

  // 3D HOURGLASS
  useEffect(() => {
    const canvas = document.getElementById("gl") as HTMLCanvasElement | null;
    if (!canvas) return;
    const instance = initHourglass(canvas, () => {
      const s = poseRef.current(indexRef.current);
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        return { x: 0, y: 0.65, s: 0.32, rx: s.rx, rz: s.rz, o: 0.12 };
      }
      return s;
    });
    hourglassRef.current = instance;
    return () => instance.destroy();
  }, []);

  // CURTAIN TRANSITION
  const goToSlide = useCallback(
    (targetIndex: number) => {
      if (
        targetIndex === index ||
        isBusy ||
        targetIndex < 0 ||
        targetIndex >= count
      )
        return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const gsap = (window as any).gsap;
      const dir = targetIndex > index ? 1 : -1;

      hourglassRef.current?.onChange(dir);

      const curtain = curtainRef.current;
      const cc = curtainCountRef.current;
      const cn = curtainNameRef.current;
      const wipe = wipeRef.current;
      const currentEl = slideContainerRef.current?.children[index] as
        | HTMLElement
        | undefined;

      const reduceMotion = window.matchMedia?.(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (!gsap || !curtain || !cc || !cn || reduceMotion) {
        setIndex(targetIndex);
        return;
      }

      setIsBusy(true);
      cc.textContent = `${String(targetIndex + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}`;
      cn.innerHTML = "<span></span>";
      cn.querySelector("span")!.textContent = names[targetIndex];

      const from = dir > 0 ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)";
      const to = dir > 0 ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)";

      const tl = gsap.timeline({ onComplete: () => setIsBusy(false) });

      if (currentEl) {
        tl.to(
          currentEl,
          { y: -50 * dir, opacity: 0.15, duration: 0.42, ease: "power3.in" },
          0,
        );
      }

      tl.fromTo(
        curtain,
        { clipPath: from },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.48,
          ease: "power3.inOut",
        },
        0,
      )
        .fromTo(
          cn.querySelector("span"),
          { yPercent: 110 * dir, rotate: 3 * dir },
          { yPercent: 0, rotate: 0, duration: 0.6, ease: "expo.out" },
          0.18,
        )
        .fromTo(
          cc,
          { opacity: 0, x: -16 },
          { opacity: 0.65, x: 0, duration: 0.4, ease: "expo.out" },
          0.22,
        )
        .add(() => {
          if (currentEl)
            gsap.set(currentEl, { clearProps: "transform,opacity" });
          setIndex(targetIndex);
        }, 0.6)
        .to(
          cn.querySelector("span"),
          { yPercent: -110 * dir, duration: 0.38, ease: "power3.in" },
          0.66,
        )
        .to(
          curtain,
          { clipPath: to, duration: 0.55, ease: "power3.inOut" },
          0.78,
        );

      if (wipe) {
        gsap.fromTo(
          wipe,
          {
            top: "50%",
            opacity: 1,
            scaleX: 0,
            transformOrigin: dir > 0 ? "100% 50%" : "0% 50%",
          },
          { scaleX: 1, duration: 0.45, ease: "expo.inOut" },
        );
        gsap.to(wipe, { opacity: 0, duration: 0.3, delay: 0.45 });
      }
    },
    [index, isBusy, count, names],
  );

  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.transform = `scaleX(${index / (count - 1)})`;
    }
  }, [index, count]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowRight", "Space", "PageDown"].includes(e.code)) {
        e.preventDefault();
        goToSlide(index + 1);
      } else if (["ArrowLeft", "PageUp"].includes(e.code)) {
        e.preventDefault();
        goToSlide(index - 1);
      } else if (e.key.toLowerCase() === "f") {
        if (!document.fullscreenElement)
          document.documentElement.requestFullscreen?.();
        else document.exitFullscreen?.();
      } else if (e.key === "Home") {
        goToSlide(0);
      } else if (e.key === "End") {
        goToSlide(count - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goToSlide, index, count]);

  useEffect(() => {
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  return (
    <div
      className={`slides-wrapper b3 ${className ?? ""}`}
      onTouchStart={(e) => {
        touchStartX.current = e.changedTouches[0].clientX;
      }}
      onTouchEnd={(e) => {
        const diff = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(diff) > 50) goToSlide(index + (diff < 0 ? 1 : -1));
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: deckCss + (extraCss ?? "") }} />
      <canvas id="gl" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <div className="curtain" ref={curtainRef} aria-hidden="true">
        <div className="cc" ref={curtainCountRef}>
          01 / {String(count).padStart(2, "0")}
        </div>
        <div className="cn" ref={curtainNameRef}>
          <span>{names[0]}</span>
        </div>
      </div>

      <div className="wipe" ref={wipeRef} aria-hidden="true" />
      <div
        className="progress"
        ref={progressRef}
        style={{ background: "var(--accent)" }}
      />

      <header className="chrome top">
        <div className="chrome-brand">
          <b style={{ color: "var(--accent)" }}>БИЕ ДААЛТ {deck}</b>
          <span>·</span>
          <span>{brandSub(index)}</span>
        </div>
        <div className="deck-right">
          <div className="deck-nav-pills">
            <Link
              href="/"
              className={`deck-pill ${deck === "02" ? "active" : ""}`}
            >
              БИЕ ДААЛТ 2
            </Link>
            <Link
              href="/biydalt3"
              className={`deck-pill ${deck === "03" ? "active" : ""}`}
            >
              БИЕ ДААЛТ 3
            </Link>
          </div>
          <a
            className="deck-dl"
            href={pptx}
            download
            title="PowerPoint файлаар татах"
          >
            <Download size={14} strokeWidth={2} />
            <span>PPT TATAX</span>
          </a>
        </div>
      </header>

      <main ref={slideContainerRef}>
        {names.map((n, idx) => (
          <section
            key={idx}
            className={`slide ${idx === index ? "on" : ""}`}
            data-name={n}
            aria-hidden={idx !== index}
          >
            {renderSlide(idx)}
          </section>
        ))}
      </main>

      <footer className="chrome bottom">
        <div className="counter">
          <b>{String(index + 1).padStart(2, "0")}</b>
          <span>/</span>
          <span>{String(count).padStart(2, "0")}</span>
          <span style={{ marginLeft: "14px", color: "var(--ink-2)" }}>
            {names[index]}
          </span>
        </div>
      </footer>
    </div>
  );
}
