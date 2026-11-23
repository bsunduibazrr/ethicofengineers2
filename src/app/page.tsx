"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Droplets,
  Eye,
  FileCheck2,
  Handshake,
  Landmark,
  Layers3,
  Leaf,
  MapPinned,
  Network,
  Scale,
  ShieldCheck,
  TrainFront,
  TriangleAlert,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

type Point = { icon: string; text: string };
type Slide = {
  section: string;
  title: string;
  kicker?: string;
  points?: Point[];
  visual?: string;
};

const slides: Slide[] = [
  {
    section: "Кейс шинжилгээ",
    title: "Химийн инженерийн ёс зүй",
    kicker: "БИЕ ДААЛТ 03 · КЕЙС ШИНЖИЛГЭЭ",
    points: [{ icon: "shield", text: "Mount Polley · British Columbia · 2014 [4][5]" }],
    visual: "cover",
  },
  {
    section: "Үндэслэл",
    title: "Шийдвэр бүр үр дагавартай",
    points: [
      { icon: "people", text: "Олон нийтийн аюулгүй байдал нэгдүгээрт [2][3]." },
      { icon: "leaf", text: "Байгаль орчныг хамгаалах нь үүрэг [2][3]." },
      { icon: "warning", text: "Эрсдэлийг нуухгүй мэдээл [3]." },
    ],
  },
  {
    section: "Мэргэжлийн холбоо",
    title: "Үндэсний холбоо. Орон нутгийн лиценз.",
    points: [
      { icon: "network", text: "Мужийн инженерүүд үндэсний холбоог 1936 онд байгуулсан [1]." },
      { icon: "landmark", text: "Engineers Canada холбоо; CNCA-ийн дагуу ашгийн бус [1][11]." },
      { icon: "map", text: "Лиценз, сахилга: мужийн зохицуулагчид [2][3]." },
    ],
  },
  {
    section: "Ёс зүйн дүрэм",
    title: "Дүрэм нь ажиллах стандарт",
    points: [
      { icon: "shield", text: "Нийтийн аюулгүй байдал, байгаль орчин [3]." },
      { icon: "file", text: "Чадамж, үнэнч шударга байдал [3]." },
      { icon: "triangle", text: "Эрсдэл ба зөрчлийг мэдээл [3]." },
      { icon: "scale", text: "Сахилга: торгууль, түдгэлзүүлэлт, лиценз цуцлах [3]." },
    ],
  },
  {
    section: "Хууль ба дүрэм",
    title: "Хууль уу, удирдамж уу?",
    points: [
      { icon: "landmark", text: "Мужийн хууль зохицуулалтыг заавал мөрдүүлнэ [2][3]." },
      { icon: "shield", text: "BC-д EGBC-ийн ёс зүйн дүрэм заавал [3]." },
      { icon: "file", text: "Engineers Canada-ийн удирдамж сайн дурын [2]." },
    ],
  },
  {
    section: "Кейс",
    title: "Яагаад Mount Polley гэж?",
    kicker: "ГУРВАН КЕЙСЭЭС НЭГИЙГ СОНГОВ",
    points: [
      { icon: "train", text: "Lac-Mégantic · галт тэрэгний осол [9]." },
      { icon: "droplets", text: "Walkerton · ундны усны бохирдол [10]." },
      { icon: "layers", text: "Mount Polley · инженерийн хоёр албан ёсны тайлан [4][5]." },
    ],
    visual: "timeline",
  },
  {
    section: "Кейс",
    title: "Далан нурсан шалтгаан",
    points: [
      { icon: "layers", text: "Суурийн сул шаварлаг үе гулссан [4][5]." },
      { icon: "file", text: "Зураг төсөл геологийн төвөгтэй байдлыг дутуу тооцсон [4]." },
      { icon: "droplets", text: "Хаягдал нуур, голд тархсан [5]." },
    ],
    visual: "breach",
  },
  {
    section: "Кейс",
    title: "Хяналт хангалттай байсан уу?",
    points: [
      { icon: "eye", text: "Шүүрэл ба талбайн үзлэг хангалттай хянагдсан уу? [6]" },
      { icon: "file", text: "Сахилгын хороо хяналтын зөрчил тогтоосон [6]." },
      { icon: "triangle", text: "Дисциплинар шийдвэр ослын шалтгааныг тогтоогоогүй [6]." },
    ],
    visual: "decision",
  },
  {
    section: "Дүн шинжилгээ",
    title: "Үр дагаврыг тооц",
    kicker: "UTILITARIANISM · ҮР ДАГАВРЫН ЁС ЗҮЙ",
    points: [
      { icon: "scale", text: "Сайн үйлдэл олонхийн сайн сайхныг нэмнэ [7]." },
      { icon: "people", text: "Илүү хяналт = бага эрсдэл [4][5]." },
      { icon: "shield", text: "Дүгнэлт: аюулгүй байдлыг нэн түрүүнд тавих байв." },
    ],
  },
  {
    section: "Дүн шинжилгээ",
    title: "Үүргээ биелүүл",
    kicker: "DEONTOLOGY · ҮҮРГИЙН ЁС ЗҮЙ",
    points: [
      { icon: "file", text: "Үүрэг, зарчим үйлдлийг зөв буруугаар хэмжинэ [8]." },
      { icon: "shield", text: "Нийтийн аюулгүй байдал бол инженерийн үүрэг [3]." },
      { icon: "scale", text: "Дүгнэлт: хяналтын үүрэг зөрчигдсөн [6]." },
    ],
  },
  {
    section: "Дүн шинжилгээ",
    title: "Хоёр онол. Нэг сургамж.",
    points: [
      { icon: "people", text: "Үр дагавар: хэнд юу тохиолдох вэ? [7]" },
      { icon: "file", text: "Үүрэг: юу хийх ёстой вэ? [8]" },
      { icon: "shield", text: "Хоёулаа эрсдэлийг эрт бууруулахыг зөвлөнө." },
    ],
  },
  {
    section: "Дүн шинжилгээ",
    title: "Ёс зүйн дүрмийн үнэлгээ",
    points: [
      { icon: "shield", text: "Дүрэм: нийтийн аюулгүй байдал, байгаль орчин [3]." },
      { icon: "file", text: "Rice · торгууль ба зардал: $132,500 [6]." },
      { icon: "scale", text: "Fidel · 2 сар түдгэлзүүлж, 3 сургалт даалгасан [6]." },
      { icon: "layers", text: "Martin · торгууль ба зардал: $94,000 [6]." },
    ],
  },
  {
    section: "Зөвлөмж",
    title: "Дараагийн удаа ингэж ажилла",
    points: [
      { icon: "layers", text: "Инженер · суурийн хөрсийг шалгаж, эрсдэлийг мэдээл [4]." },
      { icon: "eye", text: "Компани · үүрэг ба хяналтад эзэн томил [6]." },
      { icon: "network", text: "Зохицуулагч · стандарт, аудит, удирдамжаа шинэчил [6]." },
    ],
    visual: "restoration",
  },
  {
    section: "Дүгнэлт",
    title: "Хариуцлага итгэлээс эхэлнэ",
    points: [
      { icon: "map", text: "Канадад мэргэжлийг муж, нутаг дэвсгэр зохицуулдаг [2]." },
      { icon: "layers", text: "Mount Polley: зураг төсөл + хяналт + хариуцлага [4][6]." },
      { icon: "leaf", text: "Эрсдэлийг эрт хэл. Хүнийг хамгаал." },
    ],
  },
  {
    section: "Эх сурвалж",
    title: "Эх сурвалж ба хязгаарлалт",
    kicker: "Хандсан огноо: 2026.11.23",
    visual: "references",
  },
];

const refs = [
  [
    "Engineers Canada — About / History",
    "https://engineerscanada.ca/about/about-engineers-canada",
  ],
  [
    "Engineers Canada — Guideline on the Code of Ethics (2024)",
    "https://engineerscanada.ca/guidelines-and-papers/public-guideline-on-the-code-of-ethics",
  ],
  [
    "Engineers and Geoscientists BC — Code of Ethics",
    "https://www.egbc.ca/Complaints-Discipline/Code-Of-Ethics/Code-Of-Ethics",
  ],
  [
    "Mount Polley Independent Expert Engineering Investigation and Review Panel — Final Report",
    "https://www.mountpolleyreviewpanel.ca/final-report",
  ],
  [
    "BC Chief Inspector of Mines — Mount Polley Investigation Report (2015)",
    "https://www2.gov.bc.ca/assets/gov/farming-natural-resources-and-industry/mineral-exploration-mining/documents/directives-alerts-incidents/chief-inspector-s-report-page/m-200_mount_polley_2015-11-30_ci_investigation_report.pdf",
  ],
  [
    "EGBC — Mount Polley Investigation Concludes; Three Engineers Disciplined (2022)",
    "https://www.egbc.ca/News/News-Releases/Mount-Polley-Investigation-Concludes-Three-Enginee",
  ],
  [
    "Stanford Encyclopedia of Philosophy — The History of Utilitarianism",
    "https://plato.stanford.edu/entries/utilitarianism-history/",
  ],
  [
    "Stanford Encyclopedia of Philosophy — Deontological Ethics",
    "https://plato.stanford.edu/entries/ethics-deontological/",
  ],
  [
    "Transportation Safety Board of Canada — Lac-Mégantic investigation R13D0054",
    "https://www.tsb.gc.ca/eng/rapports-reports/rail/2013/r13d0054/r13d0054.html",
  ],
  [
    "Walkerton Inquiry — Report, Chapter 3: The Events in May 2000",
    "https://www.archives.gov.on.ca/en/e_records/walkerton/report1/pdf/WI_Chapter_03.pdf",
  ],
  [
    "Engineers Canada — Governance Review: Federal incorporation under the Canada Not-for-profit Corporations Act",
    "https://engineerscanada.ca/sites/default/files/2026-05/Engineers%20Canada%20Governance%20Review%20-%20FINAL%20REPORT.pdf",
  ],
  [
    "NASA / USGS via Wikimedia Commons — Mount Polley Mine dam breach 2014 (Public domain)",
    "https://commons.wikimedia.org/wiki/File:Mount_Polley_Mine_dam_breach_2014.jpg",
  ],
  [
    "Mount Polley via Wikimedia Commons — Remediation of Hazeltine Creek (CC0)",
    "https://commons.wikimedia.org/wiki/File:Remediation_of_Hazeltine_Creek_at_Mount_Polley.jpg",
  ],
  [
    "Wikimedia Commons — Remediated wetlands at the Mount Polley mine (CC0)",
    "https://commons.wikimedia.org/wiki/File:Remediated_wetlands_at_the_Mount_Polley_mine.jpg",
  ],
];

const iconMap: Record<string, LucideIcon> = { shield: ShieldCheck, scale: Scale, leaf: Leaf, people: UsersRound, warning: TriangleAlert, triangle: TriangleAlert, hand: Handshake, network: Network, map: MapPinned, landmark: Landmark, law: Landmark, file: FileCheck2, document: FileCheck2, train: TrainFront, water: Droplets, droplets: Droplets, layers: Layers3, dam: Layers3, eye: Eye };

function Icon({ name }: { name: string }) {
  const Glyph = iconMap[name] ?? FileCheck2;
  return <Glyph className="icon" aria-hidden="true" strokeWidth={1.7} />;
}

function Art({ kind }: { kind: string }) {
  if (kind === "timeline")
    return (
      <div className="photo-art timeline-photo">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/a3/Mount_Polley_Mine_dam_breach_2014.jpg"
          alt="Mount Polley уурхайн хиймэл дагуулын зураг"
        />
        <div className="photo-shade" />
        <div className="art-label">MOUNT POLLEY · BRITISH COLUMBIA</div>
        <div className="timeline">
          <div><b>2000</b><span>Walkerton</span></div><i />
          <div><b>2013</b><span>Lac-Mégantic</span></div><i />
          <div className="selected"><b>2014</b><span>Mount Polley</span></div>
        </div>
        <a className="photo-credit" href={refs[11][1]} target="_blank" rel="noreferrer">NASA / USGS · Wikimedia Commons · public domain [12]</a>
      </div>
    );
  if (kind === "decision")
    return (
      <div className="decision-art">
        <div className="node">
          Суурийн
          <br />
          тодорхойгүй байдал
        </div>
        <div className="arrow-down">↓</div>
        <div className="split">
          <div>
            <b>Хяналтыг нэмэх</b>
            <span>Эрсдэлийг мэдээлэх</span>
          </div>
          <div>
            <b>Ажлыг үргэлжлүүлэх</b>
            <span>Илүү том эрсдэл</span>
          </div>
        </div>
        <div className="art-foot">Дүн шинжилгээ · сонголтын үр дагавар</div>
      </div>
    );
  if (kind === "cover" || kind === "breach")
    return (
      <div className={`photo-art ${kind === "cover" ? "cover-photo" : "breach-photo"}`}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/a3/Mount_Polley_Mine_dam_breach_2014.jpg"
          alt="Mount Polley уурхайн далангийн хиймэл дагуулын зураг"
        />
        <div className="photo-shade" />
        <div className="cover-stamp">04<br/>AUG<br/>2014</div>
        <a className="photo-credit" href={refs[11][1]} target="_blank" rel="noreferrer">NASA / USGS · Wikimedia Commons · public domain [12]</a>
      </div>
    );
  if (kind === "restoration")
    return (
      <div className="photo-art restoration-photo">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/8/83/Remediated_wetlands_at_the_Mount_Polley_mine.jpg"
          alt="Mount Polley уурхайн сэргээн засварласан намгархаг газар"
        />
        <div className="photo-shade" />
        <div className="photo-title">СЭРГЭЭН ЗАСВАРЛАЛТ</div>
        <a className="photo-credit" href={refs[13][1]} target="_blank" rel="noreferrer">Wikimedia Commons · CC0 [14]</a>
      </div>
    );
  if (kind === "references")
    return (
      <div className="refs">
        <div className="refs-list">
          {refs.map(([title, url], i) => (
            <div className="ref" key={title}>
              <b>[{i + 1}]</b>
              <a href={url} target="_blank" rel="noreferrer">
                {title}
              </a>
            </div>
          ))}
        </div>
        <div className="limit">
          <b>Хязгаарлалт</b>
          <span>
            EGBC-ийн дүрмийн анх баталсан огноо: Баталгаатай мэдээлэл олдсонгүй.
            Одоогийн Code of Ethics нь PGA-д заавал мөрдөгдөнө [3].
          </span>
        </div>
      </div>
    );
  return null;
}

export default function Home() {
  const [index, setIndex] = useState(0);
  const [full, setFull] = useState(false);
  const slide = slides[index];
  const go = useCallback(
    (delta: number) =>
      setIndex((n) => Math.max(0, Math.min(slides.length - 1, n + delta))),
    [],
  );
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (["ArrowRight", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        go(1);
      }
      if (["ArrowLeft", "PageUp"].includes(event.key)) {
        event.preventDefault();
        go(-1);
      }
      if (event.key.toLowerCase() === "f")
        document.fullscreenElement
          ? document.exitFullscreen()
          : document.documentElement.requestFullscreen?.();
      if (event.key === "Home") setIndex(0);
      if (event.key === "End") setIndex(slides.length - 1);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [go]);
  useEffect(() => {
    const update = () => setFull(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);
  let startX = 0;
  return (
    <main
      className="deck"
      onTouchStart={(e) => {
        startX = e.changedTouches[0].clientX;
      }}
      onTouchEnd={(e) => {
        const diff = e.changedTouches[0].clientX - startX;
        if (Math.abs(diff) > 55) go(diff < 0 ? 1 : -1);
      }}
    >
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">03</span>
          <span>
            CANADIAN CASE STUDY
            <br />
            <b>ENGINEERING ETHICS</b>
          </span>
        </div>
        <div className="top-index">
          {String(index + 1).padStart(2, "0")} / {slides.length}
          <br />
          <b>{slide.section.toUpperCase()}</b>
        </div>
      </header>
      <section
        className={`slide ${slide.visual === "cover" ? "is-cover" : ""} ${["cover", "timeline", "breach", "restoration"].includes(slide.visual ?? "") ? "has-photo" : ""} ${index % 2 ? "from-left" : "from-right"}`}
        key={index}
      >
        <div className="content">
          <div className="slide-meta">
            <span>
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(slides.length).padStart(2, "0")}
            </span>
            <span>{slide.section}</span>
          </div>
          <div className="heading">
            <div className="eyebrow">
              {slide.kicker ?? "КЕЙС ШИНЖИЛГЭЭ · МЭРГЭЖЛИЙН ЁС ЗҮЙ"}
            </div>
            <h1>{slide.title}</h1>
          </div>
          {slide.points && (
            <div className="points">
              {slide.points.map((point, i) => (
                <div className="point" key={`${index}-${i}`}>
                  <span className="point-icon">
                    <Icon name={point.icon} />
                  </span>
                  <p>{point.text}</p>
                </div>
              ))}
            </div>
          )}
          {slide.visual === "references" && <Art kind="references" />}
          <div className="content-footer">
            <span>
              FACTS <i /> ANALYSIS
            </span>
            <span>CANADIAN ENGINEERING · 2026</span>
          </div>
        </div>
        {slide.visual && slide.visual !== "references" && (
          <aside className={`visual visual-${slide.visual}`}>
            <Art kind={slide.visual} />
          </aside>
        )}
        {slide.visual === "references" && (
          <aside className="visual visual-ref">
            <span className="ref-number">14</span>
            <span className="ref-word">
              SOURCES
              <br />& LIMITS
            </span>
            <div className="ref-orbit" />
          </aside>
        )}
      </section>
      <footer className="controls">
        <div className="progress">
          <span style={{ width: `${((index + 1) / slides.length) * 100}%` }} />
        </div>
        <div className="control-row">
          <span className="hint">
            ← → <em>Слайд солих</em>
          </span>
          <div className="buttons">
            <button
              onClick={() => go(-1)}
              disabled={index === 0}
              aria-label="Өмнөх слайд"
            >
              ←
            </button>
            <span className="counter">
              {String(index + 1).padStart(2, "0")} <i>/</i>{" "}
              {String(slides.length).padStart(2, "0")}
            </span>
            <button
              onClick={() => go(1)}
              disabled={index === slides.length - 1}
              aria-label="Дараагийн слайд"
            >
              →
            </button>
            <button
              onClick={() =>
                document.fullscreenElement
                  ? document.exitFullscreen()
                  : document.documentElement.requestFullscreen?.()
              }
              aria-label="Дэлгэц дүүргэх"
            >
              {full ? "×" : "⛶"}
            </button>
          </div>
          <span className="hint right-hint">
            MOUNT POLLEY <em>BRITISH COLUMBIA</em>
          </span>
        </div>
      </footer>
      <div className="print-deck">
        {slides.map((item, i) => (
          <section className="print-sheet" key={`print-${i}`}>
            <div className="print-head">
              <span>ENGINEERING ETHICS / CANADA</span>
              <b>{String(i + 1).padStart(2, "0")} / {slides.length} · {item.section}</b>
            </div>
            <div className="print-title">
              <small>{item.kicker ?? "КЕЙС ШИНЖИЛГЭЭ · МЭРГЭЖЛИЙН ЁС ЗҮЙ"}</small>
              <h2>{item.title}</h2>
            </div>
            <div className="print-body">
              {item.points && <div className="print-points">{item.points.map((point, pointIndex) => <div className="print-point" key={`${i}-${pointIndex}`}><span><Icon name={point.icon}/></span><p>{point.text}</p></div>)}</div>}
              {item.visual && <div className="print-art"><Art kind={item.visual}/></div>}
            </div>
            <div className="print-foot"><span>FACTS <i/> ANALYSIS</span><span>Хандсан огноо: 2026.11.23</span></div>
          </section>
        ))}
      </div>
    </main>
  );
}
