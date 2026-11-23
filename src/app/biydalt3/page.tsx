"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { initHourglass, SlideState } from "../hourglass";

interface Point {
  bold: string;
  text: string;
  ref?: string;
}

interface SlideData {
  name: string;
  tag: string;
  titleHtml: string;
  sub?: string;
  points?: Point[];
  layout?: "cover" | "photo" | "theory" | "metrics" | "refs";
  imageSrc?: string;
  imageAlt?: string;
  imageBadge?: string;
  imageSource?: string;
}

const slides: SlideData[] = [
  // 1. Cover
  {
    name: "Нүүр",
    tag: "Бие даалт 03 · Кейс шинжилгээ (10 оноо)",
    titleHtml: "Mount Polley далан <em class='mark'>сэтэрсэн осол<svg class='scr' viewBox='0 0 200 20' preserveAspectRatio='none' aria-hidden='true'><path d='M3 13 C 40 5, 90 17, 130 10 S 185 6, 197 12'/></svg></em>",
    sub: "Канад улсын Британийн Колумби мужид 2014 онд гарсан уул уурхайн инженерийн томоохон ослын ёс зүйн шинжилгээ",
    layout: "cover",
    imageSrc: "/images/mount-polley.jpg",
    imageAlt: "Mount Polley уурхайн хиймэл дагуулын зураг",
    imageBadge: "BRITISH COLUMBIA · 2014.08.04",
    imageSource: "NASA / USGS via Wikimedia Commons [11]",
  },

  // 2. 01 Бодит кейс сонгох
  {
    name: "01 Бодит кейс",
    tag: "01 · Бодит кейс сонгох",
    titleHtml: "Канад, Mount Polley уурхайн <em class='mark'>далан нурсан<svg class='scr' viewBox='0 0 200 20' preserveAspectRatio='none' aria-hidden='true'><path d='M3 13 C 40 5, 90 17, 130 10 S 185 6, 197 12'/></svg></em> нь",
    sub: "2014 оны 8-р сарын 4-нд уурхайн хаягдлын далан гэнэт сэтэрч, Канадын түүхэн дэх хамгийн том байгаль орчны гамшгийн нэг болов.",
    points: [
      {
        bold: "24 сая м³ хорт лаг урссан:",
        text: "Хаягдлын лаг нуур, гол руу алдагдаж, экосистемд ноцтой хохирол учруулсан [10].",
        ref: "[10]",
      },
      {
        bold: "Геологийн дутуу үнэлгээ:",
        text: "Зураг төсөлд суурийн сул шаварлаг үе (GLU)-ийг дутуу тооцсон [10].",
        ref: "[10]",
      },
      {
        bold: "Хяналтын хайнга байдал:",
        text: "Далангийн хажуугийн налууг хэт огцом болгож, багажийн заалтыг үл тоосон [11].",
        ref: "[11]",
      },
    ],
    layout: "photo",
    imageSrc: "/images/mount-polley.jpg",
    imageAlt: "Mount Polley далан сэтэрсэн газар",
    imageBadge: "ДАЛАН СЭТЭРСЭН ШАЛТГААН",
    imageSource: "NASA / USGS via Wikimedia Commons [11]",
  },

  // 3. 02 Ёс зүйн 1-р онол: Утилитарианизм
  {
    name: "Утилитарианизм",
    tag: "02 · Ёс зүйн 1-р онол",
    titleHtml: "Утилитарианизм: <em class='mark'>Үр дагаврын<svg class='scr' viewBox='0 0 200 20' preserveAspectRatio='none' aria-hidden='true'><path d='M3 13 C 40 5, 90 17, 130 10 S 185 6, 197 12'/></svg></em> ёс зүй",
    sub: "Ж.Бентам, Ж.С.Милл нарын онол: 'Хамгийн олон хүнд хамгийн их сайн сайхныг бий болгох үйлдэл нь зөв'.",
    points: [
      {
        bold: "Ашиг ба хохирлын харьцаа:",
        text: "Зардал хэмнэж далангийн өндрийг нэмсэн нь байгаль, иргэдэд асар их хохирол авчирсан [10].",
        ref: "[10]",
      },
      {
        bold: "Цөөнхийн ашиг vs Олонхийн эрх ашиг:",
        text: "Компанийн богино хугацааны ашиг нь олон нийтийн ундны ус, байгаль орчны үнэ цэнийг давж чадахгүй.",
      },
      {
        bold: "Онолын дүгнэлт:",
        text: "Утилитари ёс зүйн үүднээс аюулгүй байдлыг золиосолсон нь ёс зүйн ноцтой алдаа болсон.",
      },
    ],
    layout: "theory",
  },

  // 4. 02 Ёс зүйн 2-р онол: Деонтологи
  {
    name: "Деонтологи",
    tag: "02 · Ёс зүйн 2-р онол",
    titleHtml: "Деонтологи: Инженерийн <em class='mark'>туйлын үүрэг<svg class='scr' viewBox='0 0 200 20' preserveAspectRatio='none' aria-hidden='true'><path d='M3 13 C 40 5, 90 17, 130 10 S 185 6, 197 12'/></svg></em>",
    sub: "Иммануэл Кантын онол: 'Үр дагавраас үл хамааран дагаж мөрдөх мэргэжлийн туйлын ёс зүйн үүрэг бий'.",
    points: [
      {
        bold: "Үүргийн давуу эрх:",
        text: "Инженер техникийн тооцоог үнэн зөв хийж, бүрэн бүтэн байдлыг хангах абсолют үүрэгтэй.",
      },
      {
        bold: "Эрсдэлийг мэдээлэх үүрэг:",
        text: "Геотехникийн сул давхаргыг мэдсээр байж эрсдэлийг шаардаж мэдээлээгүй нь үүргээ зөрчсөн үйлдэл [11].",
        ref: "[11]",
      },
      {
        bold: "Онолын дүгнэлт:",
        text: "Деонтологийн үүднээс инженерүүд нийтийн аюулгүй байдлыг хамгаалах үндсэн үүргээсээ шууд няцсан.",
      },
    ],
    layout: "theory",
  },

  // 5. 03 Канадын дүрмээр шийдвэрлэх
  {
    name: "Дүрмийн шийдвэр",
    tag: "03 · Ёс зүйн дүрмээр шийдвэрлэх",
    titleHtml: "Канадын дүрмийн шийдвэр ба <em class='mark'>Сахилгын шийтгэл<svg class='scr' viewBox='0 0 200 20' preserveAspectRatio='none' aria-hidden='true'><path d='M3 13 C 40 5, 90 17, 130 10 S 185 6, 197 12'/></svg></em>",
    sub: "Британийн Колумби мужийн Инженерүүдийн Холбооны (EGBC) Сахилгын хороо 3 инженер дээр албан ёсны шийдвэр гаргасан.",
    points: [
      {
        bold: "Stephen Rice (Төслийн захирал):",
        text: "Мэргэжлийн хайнга байдал гаргасан тул $132,500 торгууль, зардалд унагаж лицензийг цуцалсан [11].",
        ref: "[11]",
      },
      {
        bold: "Todd Martin (Тэргүүлэх инженер):",
        text: "Зураг төслийн налуугийн тооцоог хангалтгүй хийсэн зөрчлөөр $94,000 торгууль ногдуулсан [11].",
        ref: "[11]",
      },
      {
        bold: "Laura Fidel (Хяналтын инженер):",
        text: "Хяналтын ажлыг хангалтгүй гүйцэтгэсэн тул эрхийг нь түдгэлзүүлж, дахин сургалт даалгасан [11].",
        ref: "[11]",
      },
    ],
    layout: "metrics",
  },

  // 6. Цаашид хэрэгжүүлэх санал
  {
    name: "Хэрэгжүүлэх санал",
    tag: "Цаашид хэрэгжүүлэх санал",
    titleHtml: "Ирээдүйд хэрэгжүүлэх <em class='mark'>3 түвшний зөвлөмж<svg class='scr' viewBox='0 0 200 20' preserveAspectRatio='none' aria-hidden='true'><path d='M3 13 C 40 5, 90 17, 130 10 S 185 6, 197 12'/></svg></em>",
    sub: "Mount Polley ослоос суралцаж, ижил төстэй үйлдвэр, уурхайд дараах арга хэмжээг авахыг санал болгож байна.",
    points: [
      {
        bold: "1. Инженерүүдэд:",
        text: "Суурийн геологийн нарийвчилсан судалгааг хөндлөнгийн шинжээчээр заавал давхар хянуулах [10].",
        ref: "[10]",
      },
      {
        bold: "2. Компаниудад:",
        text: "Ашгийн төлөө далангийн хэмжээг дур мэдэн нэмэхгүй байх; далангийн эрсдэлийн бие даасан зөвлөл ажиллуулах [10].",
        ref: "[10]",
      },
      {
        bold: "3. Зохицуулагч хороодод:",
        text: "Хяналтын инженерийн бие даасан байдлыг хамгаалж, хяналт шалгалтыг жилд 2-оос доошгүй удаа хийх [11].",
        ref: "[11]",
      },
    ],
    layout: "photo",
    imageSrc: "/images/mount-polley-wetlands.jpg",
    imageAlt: "Хазелтин голын сэргээн засварлалт",
    imageBadge: "REMEDIATION & RECOVERY",
    imageSource: "Mount Polley Remediation · Wikimedia Commons [11]",
  },

  // 7. Кейсийн сургамж
  {
    name: "Сургамж",
    tag: "Кейсийн сургамж",
    titleHtml: "Хариуцлага бол <em class='mark'>итгэлцлийн үндэс<svg class='scr' viewBox='0 0 200 20' preserveAspectRatio='none' aria-hidden='true'><path d='M3 13 C 40 5, 90 17, 130 10 S 185 6, 197 12'/></svg></em>",
    sub: "Mount Polley-ийн сургамж: Инженерийн ёс зүй бол зүгээр нэг цаасан дүрэм бус, олон нийтийн аюулгүй байдлын баталгаа юм.",
    points: [
      {
        bold: "Олон нийтийн эрх ашиг:",
        text: "Инженер хүн захиалагчийн шахалтад автахгүй, аюулгүй байдлыг ямагт нэгдүгээрт тавих ёстой [4].",
        ref: "[4]",
      },
      {
        bold: "Эрт мэдээлэх соёл:",
        text: "Сэжигтэй дохио, хазайлтыг илрүүлсэн даруйд удирдлага болон хяналтын байгууллагад мэдэгдэх [11].",
        ref: "[11]",
      },
      {
        bold: "Урт хугацааны үр дагавар:",
        text: "Байгаль орчныг сэргээхэд 70+ сая доллар, олон арван жилийн шаргуу хөдөлмөр шаардагддаг [11].",
        ref: "[11]",
      },
    ],
    layout: "photo",
    imageSrc: "/images/mount-polley-wetlands.jpg",
    imageAlt: "Сэргээгдсэн намгархаг газар",
    imageBadge: "ХАРИУЦЛАГАТАЙ ИНЖЕНЕРЧЛЭЛ",
    imageSource: "Remediated Wetlands · Wikimedia Commons [11]",
  },

  // 8. Эх сурвалжууд
  {
    name: "Эх сурвалжууд",
    tag: "Албан ёсны эх баримтууд",
    titleHtml: "Кейсийн албан ёсны <em class='mark'>эх сурвалжууд<svg class='scr' viewBox='0 0 200 20' preserveAspectRatio='none' aria-hidden='true'><path d='M3 13 C 40 5, 90 17, 130 10 S 185 6, 197 12'/></svg></em>",
    sub: "Британийн Колумби мужийн засгийн газар болон EGBC-ийн албан ёсны баримтууд.",
    layout: "refs",
  },
];

const referencesList = [
  { id: "[1]", title: "Engineers Canada — Guideline on the Code of Ethics (2024)", url: "https://engineerscanada.ca" },
  { id: "[2]", title: "Stanford Encyclopedia of Philosophy — Utilitarianism", url: "https://plato.stanford.edu/entries/utilitarianism-history/" },
  { id: "[3]", title: "Stanford Encyclopedia of Philosophy — Deontological Ethics", url: "https://plato.stanford.edu/entries/ethics-deontological/" },
  { id: "[4]", title: "Engineers and Geoscientists BC (EGBC) — Code of Ethics", url: "https://www.egbc.ca" },
  { id: "[10]", title: "Independent Expert Engineering Investigation Panel — Mount Polley Report", url: "https://www.mountpolleyreviewpanel.ca" },
  { id: "[11]", title: "EGBC — Three Engineers Disciplined in Mount Polley Dam Breach Investigation", url: "https://www.egbc.ca" },
  { id: "[12]", title: "NASA / USGS Satellite Imagery of Mount Polley Dam Breach (2014)", url: "https://commons.wikimedia.org" },
  { id: "[13]", title: "Hazeltine Creek Remediation Records — Mount Polley Mining Corporation", url: "https://commons.wikimedia.org" },
];

const slideStates: SlideState[] = [
  // 0. Нүүр (Cover): Hero right space
  { x: 0.68, y: 0.02, s: 1.05, rx: 0.16, rz: -0.15, o: 0.88 },
  // 1. Маунт Полли сүйрэл 2014 (Photo layout): Photo right, hourglass upper right
  { x: 0.84, y: 0.58, s: 0.32, rx: -0.32, rz: 0.28, o: 0.65 },
  // 2. EGBC Сахилгын шийтгэл (Metrics layout): Left cards, right open
  { x: 0.72, y: -0.04, s: 0.98, rx: 0.22, rz: -0.18, o: 0.85 },
  // 3. Утилитаризм (Photo layout): Photo right, hourglass top right
  { x: 0.84, y: 0.56, s: 0.34, rx: 0.35, rz: -0.22, o: 0.65 },
  // 4. Деонтологи (Photo layout): Photo right, hourglass top right
  { x: 0.86, y: 0.58, s: 0.32, rx: -0.28, rz: 0.32, o: 0.65 },
  // 5. EGBC Дүрмээр шийдвэрлэх (Metrics layout): Left cards, right open
  { x: 0.7, y: -0.02, s: 1.0, rx: 0.18, rz: -0.16, o: 0.85 },
  // 6. Хэрэгжүүлэх 4 санал (Photo layout): Photo right, hourglass top right
  { x: 0.84, y: 0.56, s: 0.32, rx: 0.3, rz: 0.18, o: 0.65 },
  // 7. Эх сурвалжууд (Refs layout): Top right
  { x: 0.85, y: 0.6, s: 0.3, rx: 0.18, rz: -0.2, o: 0.6 },
];

export default function Biydalt3() {
  const [index, setIndex] = useState(0);
  const [isBusy, setIsBusy] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const curtainRef = useRef<HTMLDivElement>(null);
  const curtainCountRef = useRef<HTMLDivElement>(null);
  const curtainNameRef = useRef<HTMLDivElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const slideContainerRef = useRef<HTMLDivElement>(null);

  const hourglassRef = useRef<{ onChange: (d: number) => void; destroy: () => void } | null>(null);
  const indexRef = useRef(index);
  indexRef.current = index;

  // 3D HOURGLASS BACKGROUND WIREFRAME
  useEffect(() => {
    const canvas = document.getElementById("gl") as HTMLCanvasElement;
    if (!canvas) return;

    const instance = initHourglass(canvas, () => {
      const cur = indexRef.current;
      const s = slideStates[cur] || slideStates[0];
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        return {
          x: 0,
          y: 0.65,
          s: 0.32,
          rx: s.rx,
          rz: s.rz,
          o: 0.16,
        };
      }
      return s;
    });

    hourglassRef.current = instance;

    return () => {
      instance.destroy();
    };
  }, []);

  // INSANE CURTAIN & WIPE TRANSITION
  const goToSlide = useCallback(
    (targetIndex: number) => {
      if (targetIndex === index || isBusy || targetIndex < 0 || targetIndex >= slides.length) return;
      const gsap = (window as any).gsap;

      const dir = targetIndex > index ? 1 : -1;
      const targetSlide = slides[targetIndex];

      // Flip & spin 3D hourglass dynamically
      hourglassRef.current?.onChange(dir);

      if (!gsap) {
        setIndex(targetIndex);
        return;
      }

      setIsBusy(true);

      const curtain = curtainRef.current;
      const cc = curtainCountRef.current;
      const cn = curtainNameRef.current;
      const wipe = wipeRef.current;
      const container = slideContainerRef.current;

      const currentSlideEl = container?.children[index] as HTMLElement;

      if (curtain && cc && cn) {
        cc.textContent = `${String(targetIndex + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
        cn.innerHTML = `<span>${targetSlide.name}</span>`;

        const from = dir > 0 ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)";
        const to = dir > 0 ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)";

        const tl = gsap.timeline({
          onComplete: () => {
            setIsBusy(false);
          },
        });

        if (currentSlideEl) {
          tl.to(currentSlideEl, { y: -50 * dir, opacity: 0.15, duration: 0.42, ease: "power3.in" }, 0);
        }

        tl.fromTo(curtain, { clipPath: from }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.48, ease: "power3.inOut" }, 0)
          .fromTo(cn.querySelector("span"), { yPercent: 110 * dir, rotate: 3 * dir }, { yPercent: 0, rotate: 0, duration: 0.6, ease: "expo.out" }, 0.18)
          .fromTo(cc, { opacity: 0, x: -16 }, { opacity: 0.65, x: 0, duration: 0.4, ease: "expo.out" }, 0.22)
          .add(() => {
            setIndex(targetIndex);
          }, 0.6)
          .to(cn.querySelector("span"), { yPercent: -110 * dir, duration: 0.38, ease: "power3.in" }, 0.66)
          .to(curtain, { clipPath: to, duration: 0.55, ease: "power3.inOut" }, 0.78);

        if (wipe) {
          gsap.fromTo(
            wipe,
            { top: "50%", opacity: 1, scaleX: 0, transformOrigin: dir > 0 ? "100% 50%" : "0% 50%" },
            { scaleX: 1, duration: 0.45, ease: "expo.inOut" }
          );
          gsap.to(wipe, { opacity: 0, duration: 0.3, delay: 0.45 });
        }
      } else {
        setIndex(targetIndex);
        setIsBusy(false);
      }
    },
    [index, isBusy]
  );

  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.transform = `scaleX(${index / (slides.length - 1)})`;
    }
  }, [index]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowRight", "Space", "PageDown"].includes(e.code)) {
        e.preventDefault();
        goToSlide(index + 1);
      } else if (["ArrowLeft", "PageUp"].includes(e.code)) {
        e.preventDefault();
        goToSlide(index - 1);
      } else if (e.key.toLowerCase() === "f") {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen?.();
        } else {
          document.exitFullscreen?.();
        }
      } else if (e.key === "Home") {
        goToSlide(0);
      } else if (e.key === "End") {
        goToSlide(slides.length - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToSlide, index]);

  useEffect(() => {
    const handleFs = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleFs);
    return () => document.removeEventListener("fullscreenchange", handleFs);
  }, []);

  let touchStartX = 0;

  return (
    <div
      className="slides-wrapper"
      onTouchStart={(e) => {
        touchStartX = e.changedTouches[0].clientX;
      }}
      onTouchEnd={(e) => {
        const diff = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(diff) > 50) goToSlide(index + (diff < 0 ? 1 : -1));
      }}
    >
      <canvas id="gl" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      {/* CURTAIN */}
      <div className="curtain" ref={curtainRef} aria-hidden="true">
        <div className="cc" ref={curtainCountRef}>
          01 / 08
        </div>
        <div className="cn" ref={curtainNameRef}>
          <span>Нүүр</span>
        </div>
      </div>

      <div className="wipe" ref={wipeRef} aria-hidden="true" />
      <div className="progress" ref={progressRef} style={{ background: "var(--accent)" }} />

      {/* TOP CHROME */}
      <header className="chrome top">
        <div className="chrome-brand">
          <b style={{ color: "var(--accent)" }}>БИЕ ДААЛТ 03</b>
          <span>·</span>
          <span>Mount Polley кейс шинжилгээ</span>
        </div>

        <div className="deck-nav-pills">
          <Link href="/" className="deck-pill">
            02 · ХАРЬЦУУЛСАН СУДАЛГАА
          </Link>
          <Link href="/biydalt3" className="deck-pill active">
            03 · КЕЙС ШИНЖИЛГЭЭ
          </Link>
        </div>

        <div className="chrome-meta">
          <span>КЕЙС ШИНЖИЛГЭЭ · 10 ОНОО</span>
        </div>
      </header>

      {/* MAIN SLIDES */}
      <main ref={slideContainerRef}>
        {slides.map((s, idx) => (
          <section
            key={idx}
            className={`slide ${idx === index ? "on" : ""}`}
            data-name={s.name}
          >
            <div className={`grid2 ${s.layout === "refs" ? "full" : ""}`}>
              <div className="content-side">
                <div className="tag">{s.tag}</div>

                <h1
                  className="serif-title"
                  dangerouslySetInnerHTML={{ __html: s.titleHtml }}
                />

                {s.sub && <p className="serif-sub">{s.sub}</p>}

                {s.points && (
                  <div className="points-list">
                    {s.points.map((pt, pIdx) => (
                      <div className="point-row" key={pIdx}>
                        <span className="point-bullet" style={{ color: "var(--accent)" }}>
                          0{pIdx + 1}
                        </span>
                        <div className="point-body">
                          <b>{pt.bold}</b> {pt.text}
                          {pt.ref && <span className="ref-badge">{pt.ref}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {s.layout === "refs" && (
                  <div className="refs-columns">
                    {referencesList.map((r) => (
                      <div className="ref-item" key={r.id}>
                        <span className="ref-idx">{r.id}</span>
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noreferrer"
                          className="ref-link"
                        >
                          {r.title}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {s.layout !== "refs" && (
                <div className="visual-holder">
                  {s.imageSrc ? (
                    <div className="photo-frame">
                      <img src={s.imageSrc} alt={s.imageAlt ?? "Slide illustration"} />
                      <div className="photo-caption">
                        <div>
                          <span className="caption-tag" style={{ color: "#f3ede2" }}>
                            {s.imageBadge ?? "КЕЙСИЙН БАРИМТ"}
                          </span>
                          <span style={{ fontSize: "11px" }}>{s.imageAlt}</span>
                        </div>
                        {s.imageSource && <span className="caption-src">{s.imageSource}</span>}
                      </div>
                    </div>
                  ) : s.layout === "theory" ? (
                    <div className="paper-card-stack">
                      <div className="paper-card">
                        <div className="card-top">
                          <span className="card-title">Онолын зарчим</span>
                          <span className="card-pill">ҮНДЭСЛЭЛ</span>
                        </div>
                        <p className="card-desc">
                          {s.name === "Утилитарианизм"
                            ? "Зардал хэмнэх компанийн ашиг нь олон нийтийн ундны ус, байгаль орчны хохирлыг хэзээ ч зөвтгөж чадахгүй."
                            : "Инженер техникийн үнэн бодит эрсдэлийг мэдээлэх абсолют үүрэгтэй бөгөөд үүнээсээ няцсан нь ёс зүйгүй үйлдэл."}
                        </p>
                      </div>
                    </div>
                  ) : s.layout === "metrics" ? (
                    <div className="metrics-row">
                      <div className="metric-card">
                        <div className="metric-num" style={{ color: "var(--accent)" }}>$226k</div>
                        <div className="metric-label">Нийт торгууль ба зардал</div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-num">03</div>
                        <div className="metric-label">Шийтгэгдсэн инженер</div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-num">24M</div>
                        <div className="metric-label">Алдагдсан хорт лаг (м³)</div>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </section>
        ))}
      </main>

      {/* BOTTOM CHROME */}
      <footer className="chrome bottom">
        <div className="counter">
          <b>{String(index + 1).padStart(2, "0")}</b>
          <span>/</span>
          <span>{String(slides.length).padStart(2, "0")}</span>
          <span style={{ marginLeft: "14px", color: "var(--ink-2)" }}>{slides[index].name}</span>
        </div>

        <div className="nav-buttons">
          <button
            onClick={() => goToSlide(index - 1)}
            disabled={index === 0 || isBusy}
            aria-label="Өмнөх слайд"
          >
            ←
          </button>
          <button
            onClick={() => goToSlide(index + 1)}
            disabled={index === slides.length - 1 || isBusy}
            aria-label="Дараагийн слайд"
          >
            →
          </button>
          <button
            onClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen?.();
              } else {
                document.exitFullscreen?.();
              }
            }}
            aria-label="Бүтэн дэлгэц"
          >
            {isFullscreen ? "×" : "⛶"}
          </button>
        </div>
      </footer>
    </div>
  );
}
