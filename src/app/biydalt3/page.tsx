"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Ambulance,
  BookOpen,
  Building2,
  Check,
  CircleAlert,
  ClipboardCheck,
  Eye,
  FlaskConical,
  Flame,
  Gauge,
  Gavel,
  GraduationCap,
  HardHat,
  Landmark,
  Layers,
  Lock,
  Map,
  Megaphone,
  Microscope,
  Mountain,
  PiggyBank,
  Scale,
  ShieldCheck,
  Signpost,
  Siren,
  Skull,
  TrendingDown,
  UserCheck,
  Users,
  Warehouse,
  Waves,
  X,
} from "lucide-react";
import { initHourglass, SlideState } from "../hourglass";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type IconItem = { icon: LucideIcon; text: string; sub?: string };
type Stat = { icon: LucideIcon; num: string; label: string };
type Photo = { src: string; alt: string; badge: string; credit: string };

type Base = {
  name: string; // хөшигний нэр
  tag: string;
  title: string; // HTML (mark ашиглана)
  country?: 0 | 1 | 2; // KR, FR, CA
  step?: number; // 0..4
  src?: string; // эх сурвалжийн жижиг мөр
};

type IntroSlide = Base & { kind: "intro"; sub: string };
type CaseSlide = Base & {
  kind: "case";
  sub: string;
  stats: Stat[];
  facts: IconItem[];
  photo: Photo;
};
type TheorySlide = Base & {
  kind: "theory";
  util: string;
  deon: string;
  verdict: string;
};
type AccountSlide = Base & {
  kind: "account";
  systemLabel: string;
  rows: { ok: boolean | null; text: string; note?: string }[];
  gap: string;
  law: { name: string; year: string; yearNote: string; effects: IconItem[] };
};
type DecisionSlide = Base & { kind: "decision"; items: IconItem[] };
type RecsSlide = Base & { kind: "recs"; items: IconItem[]; photo: Photo };

type Slide =
  | IntroSlide
  | CaseSlide
  | TheorySlide
  | AccountSlide
  | DecisionSlide
  | RecsSlide;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const mark = (w: string) =>
  `<em class='mark'>${w}<svg class='scr' viewBox='0 0 200 20' preserveAspectRatio='none' aria-hidden='true'><path d='M3 13 C 40 5, 90 17, 130 10 S 185 6, 197 12'/></svg></em>`;

const STEPS = ["Кейс", "Ёс зүйн онол", "Хариуцлага", "Шийдвэр", "Санал"];

const COUNTRIES = [
  {
    code: "KR",
    name: "Өмнөд Солонгос",
    year: "2012",
    caseName: "Гуми хотын HF хүчлийн алдагдал",
    icon: FlaskConical,
    img: "/images/korea-gumi.jpg",
  },
  {
    code: "FR",
    name: "Франц",
    year: "2001",
    caseName: "Тулуз хотын AZF үйлдвэрийн дэлбэрэлт",
    icon: Flame,
    img: "/images/france-azf.jpg",
  },
  {
    code: "CA",
    name: "Канад",
    year: "2014",
    caseName: "Mount Polley хаягдлын далан сэтэрсэн",
    icon: Waves,
    img: "/images/canada-mount-polley-mine.jpg",
  },
];

/* ------------------------------------------------------------------ */
/* Slides: 1 танилцуулга + 3 улс × 5 слайд                             */
/* ------------------------------------------------------------------ */

const slides: Slide[] = [
  /* ============ 0. INTRO ============ */
  {
    kind: "intro",
    name: "Танилцуулга",
    tag: "Бие даалт 03 · Кейс шинжилгээ",
    title: `Химийн инженерийн ${mark("3 том алдаа")}`,
    sub: "Өмнөд Солонгос, Франц, Канад — улс бүрийн хамгийн том осол, түүнээс авах ёс зүйн сургамж.",
  },

  /* ============ KOREA ============ */
  {
    kind: "case",
    country: 0,
    step: 0,
    name: "Солонгос · Кейс",
    tag: "01 · Өмнөд Солонгос",
    title: `Гуми хотын ${mark("HF хүчлийн")} алдагдал`,
    sub: "2012.09.27 · Hube Global үйлдвэрт цистернээс гидрофторын хүчил буулгах үед алдагдал гарав.",
    stats: [
      { icon: Skull, num: "5", label: "ажилчин нас барсан" },
      { icon: FlaskConical, num: "8 тн", label: "HF хүчил алдагдсан" },
      { icon: Users, num: "3,000+", label: "хүн эмнэлэгт хандсан" },
    ],
    facts: [
      { icon: Siren, text: "Оршин суугчдад аюулыг цаг тухайд нь мэдээлээгүй" },
      { icon: Map, text: "Бүс нутгийг «тусгай гамшгийн бүс» зарласан" },
    ],
    photo: {
      src: "/images/korea-gumi.jpg",
      alt: "Гуми хотын панорам",
      badge: "GUMI · GYEONGSANGBUK-DO",
      credit: "Academy of Korean Studies · KOGL",
    },
    src: "Эх сурвалж: Nature News Blog (2012.10); Al Jazeera (2012.10.08)",
  },
  {
    kind: "theory",
    country: 0,
    step: 1,
    name: "Солонгос · Онол",
    tag: "01 · Өмнөд Солонгос",
    title: `Хоёр онолоор ${mark("дүгнэвэл")}`,
    util: "Аюулгүй байдлын зардлыг хэмнэсэн ашиг нь 5 хүний амь, мянга мянган иргэний эрүүл мэндийг зөвтгөхгүй.",
    deon: "Аюулыг иргэдэд шууд мэдээлэх, хамгаалалтын журмыг мөрдөх үүрэг үр дүнгээс үл хамааран заавал.",
    verdict: "Хоёр онолоор хоёулаа — ёс зүйн ноцтой алдаа",
  },
  {
    kind: "account",
    country: 0,
    step: 2,
    name: "Солонгос · Хариуцлага",
    tag: "01 · Өмнөд Солонгос",
    title: `Санкц хангалтгүй — ${mark("хууль")} хариуцлага хүлээлгэв`,
    systemLabel: "KIChE / KSIEC санкц",
    rows: [
      { ok: true, text: "Анхааруулга", note: "Тохирно" },
      { ok: true, text: "Гишүүнчлэл түдгэлзүүлэх", note: "Тохирно" },
      { ok: false, text: "Нийтлэл хориглох", note: "Эрдэм шинжилгээний зөрчилд" },
      { ok: false, text: "Буцаан татах", note: "Эрдэм шинжилгээний зөрчилд" },
    ],
    gap: "Таван хүний нас баралттай осолд санкц хангалтгүй",
    law: {
      name: "Химийн бодисын хяналтын тухай хууль",
      year: "2015",
      yearNote: "онд баталсан",
      effects: [
        { icon: HardHat, text: "Ажлын байранд аюулгүйн тоног төхөөрөмж" },
        { icon: Signpost, text: "Аюулын тэмдэг тэмдэглэгээ" },
        { icon: TrendingDown, text: "Хүний алдаанаас болсон осол буурсан" },
      ],
    },
  },
  {
    kind: "decision",
    country: 0,
    step: 3,
    name: "Солонгос · Шийдвэр",
    tag: "01 · Өмнөд Солонгос",
    title: `Ёс зүйн ${mark("шийдвэр")}`,
    items: [
      { icon: PiggyBank, text: "Урьдчилан сэргийлэх хөрөнгө оруулалт хийх" },
      { icon: Megaphone, text: "Аюулын мэдээллийг үнэн зөв, цаг тухайд нь өгөх" },
      { icon: Gauge, text: "Эрсдэлийг бодитоор үнэлж, алдааг даруй засах" },
    ],
  },
  {
    kind: "recs",
    country: 0,
    step: 4,
    name: "Солонгос · Санал",
    tag: "01 · Өмнөд Солонгос · Манай багийн санал",
    title: `Цаашид хэрэгжүүлэх ${mark("санал")}`,
    items: [
      { icon: ShieldCheck, text: "Дүрэмд «нийтийн аюулгүй байдал хамгийн тэргүүнд» гэсэн зарчим нэмэх" },
      { icon: Lock, text: "Нууцлалын зарчимд нийтийн аюулгүй байдлын хязгаар тогтоох" },
      {
        icon: Gavel,
        text: "Санкцийн системд аюулгүй байдлын зөрчлийн төрөл нэмэх",
        sub: "Заавал дахин сургалт, мэргэжлийн үйл ажиллагаанаас түр хасах",
      },
      { icon: Siren, text: "Автомат буулгалт, оршин суугчидтай жил бүр сургуулилт, хугацаатай мэдээллийн систем" },
      { icon: Ambulance, text: "Аврах албанд саармагжуулагч бодис, сургалт бэлэн байлгах" },
    ],
    photo: {
      src: "/images/korea-hazmat.jpg",
      alt: "Химийн хамгаалалтын хувцастай аврагч",
      badge: "БЭЛЭН БАЙДАЛ",
      credit: "U.S. Army National Guard · Public domain",
    },
  },

  /* ============ FRANCE ============ */
  {
    kind: "case",
    country: 1,
    step: 0,
    name: "Франц · Кейс",
    tag: "02 · Франц",
    title: `Тулуз хотын ${mark("AZF")} дэлбэрэлт`,
    sub: "2001.09.21 · Grande Paroisse (Total) бордооны үйлдвэрийн 221-р агуулахад аммонийн нитрат дэлбэрэв.",
    stats: [
      { icon: Skull, num: "31", label: "хүн нас барсан" },
      { icon: Users, num: "2,500", label: "хүн гэмтсэн" },
      { icon: Flame, num: "300+ тн", label: "аммонийн нитрат" },
    ],
    facts: [
      { icon: FlaskConical, text: "Шүүх: хлорт бодис (DCCNa) нитраттай андуурч холилдсон" },
      { icon: Building2, text: "Үйлдвэр хотын төвөөс ердөө ~5 км зайтай байсан" },
    ],
    photo: {
      src: "/images/france-azf.jpg",
      alt: "Дэлбэрэлтийн дараах AZF үйлдвэр",
      badge: "AZF · TOULOUSE · 21.09.2001",
      credit: "Ville de Toulouse · CC BY-SA 3.0",
    },
    src: "Эх сурвалж: Public Sénat (2021); IChemE Hazards 28; Ville de Toulouse архив",
  },
  {
    kind: "theory",
    country: 1,
    step: 1,
    name: "Франц · Онол",
    tag: "02 · Франц",
    title: `Хоёр онолоор ${mark("дүгнэвэл")}`,
    util: "Хаягдлыг ангилах, тусад нь хадгалах зардал хэмнэсэн нь 31 хүний амь, хотын мянга мянган байшинтай харьцуулшгүй.",
    deon: "Нийцгүй бодисыг ялгаж хадгалах, ажилчдад эрсдэлийг мэдээлэх нь инженерийн туйлын үүрэг.",
    verdict: "Хоёр онолоор хоёулаа — ёс зүйн ноцтой алдаа",
  },
  {
    kind: "account",
    country: 1,
    step: 2,
    name: "Франц · Хариуцлага",
    tag: "02 · Франц",
    title: `Дүрэм биш — ${mark("шүүх")} хариуцлага хүлээлгэв`,
    systemLabel: "Charte ISR ба шүүх",
    rows: [
      { ok: false, text: "Charte ISR", note: "Сайн дурын, сахилгын санкцгүй" },
      { ok: true, text: "Grande Paroisse", note: "€225,000 торгууль (дээд хэмжээ)" },
      { ok: true, text: "Үйлдвэрийн захирал", note: "15 сар тэнсэн хорих ял" },
    ],
    gap: "Эрүүгийн хууль 121-3: болгоомжгүйгээр хүний амь хохироосон",
    law: {
      name: "Loi Bachelot — технологийн эрсдэлийн хууль",
      year: "2003",
      yearNote: "онд баталсан",
      effects: [
        { icon: Map, text: "Аюултай үйлдвэр бүрт эрсдэлийн бүсийн төлөвлөгөө (PPRT)" },
        { icon: Users, text: "Оршин суугчдын мэдээллийн хороо (CLIC)" },
        { icon: HardHat, text: "Ажилчид, гүйцэтгэгчдийн аюулгүй байдлын оролцоо" },
      ],
    },
    src: "Эх сурвалж: Парисын давж заалдах шүүх (2017.10.31); Cour de cassation (2019); Loi n° 2003-699",
  },
  {
    kind: "decision",
    country: 1,
    step: 3,
    name: "Франц · Шийдвэр",
    tag: "02 · Франц",
    title: `Ёс зүйн ${mark("шийдвэр")}`,
    items: [
      { icon: Warehouse, text: "Нийцгүй бодисыг тусад нь хадгалж, хаягдлыг ангилах" },
      { icon: GraduationCap, text: "Туслан гүйцэтгэгч ажилчдыг сургаж, эрсдэлийг мэдээлэх" },
      { icon: Map, text: "Аюултай үйлдвэр, суурьшлын бүсийн хооронд хамгаалалтын зай тогтоох" },
    ],
  },
  {
    kind: "recs",
    country: 1,
    step: 4,
    name: "Франц · Санал",
    tag: "02 · Франц · Манай багийн санал",
    title: `Цаашид хэрэгжүүлэх ${mark("санал")}`,
    items: [
      { icon: Gavel, text: "Charte ISR-д сахилгын механизм нэмэх" },
      { icon: ShieldCheck, text: "«Нийтийн аюулгүй байдал хамгийн тэргүүнд» зарчмыг заавал болгох" },
      { icon: FlaskConical, text: "Нийцгүй бодисын хадгалалтын заавал журам, тогтмол аудит" },
      { icon: HardHat, text: "Туслан гүйцэтгэгчдэд аюулгүй байдлын ижил стандарт мөрдүүлэх" },
      { icon: Siren, text: "Оршин суугчдад сэрэмжлүүлэх систем, жил бүр сургуулилт" },
    ],
    photo: {
      src: "/images/france-azf-memorial.jpg",
      alt: "Тулуз хот дахь AZF дурсгалын газар",
      badge: "MÉMORIAL AZF · TOULOUSE",
      credit: "Olybrius · CC BY-SA 4.0",
    },
  },

  /* ============ CANADA ============ */
  {
    kind: "case",
    country: 2,
    step: 0,
    name: "Канад · Кейс",
    tag: "03 · Канад",
    title: `Mount Polley ${mark("далан сэтэрсэн")}`,
    sub: "2014.08.04 · Британийн Колумби — уурхайн хаягдлын далан нурж, лаг нуур, гол руу урсав.",
    stats: [
      { icon: Waves, num: "24 сая", label: "м³ хаягдал ус, лаг" },
      { icon: HardHat, num: "3", label: "инженер шийтгэгдсэн" },
      { icon: Landmark, num: "8 жил", label: "сахилгын хэрэг үргэлжилсэн" },
    ],
    facts: [
      { icon: Mountain, text: "Суурийн сул шаварлаг давхарга (GLU)-ыг дутуу тооцсон" },
      { icon: CircleAlert, text: "Далангийн налууг хэт огцом барьж, багажийн заалтыг үл тоосон" },
    ],
    photo: {
      src: "/images/canada-mount-polley-mine.jpg",
      alt: "Mount Polley уурхай",
      badge: "MOUNT POLLEY · BRITISH COLUMBIA",
      credit: "Wikimedia Commons · CC0",
    },
    src: "Эх сурвалж: Independent Expert Engineering Investigation Panel (2015); EGBC (2022)",
  },
  {
    kind: "theory",
    country: 2,
    step: 1,
    name: "Канад · Онол",
    tag: "03 · Канад",
    title: `Хоёр онолоор ${mark("дүгнэвэл")}`,
    util: "Далангийн өндрийг хямд аргаар нэмсэн ашиг нь байгаль орчин, иргэдийн ундны усны хохирлыг зөвтгөхгүй.",
    deon: "Геотехникийн эрсдэлийг мэдээлж, налуугийн тооцоог үнэн зөв хийх үүргээ биелүүлээгүй.",
    verdict: "Хоёр онолоор хоёулаа — ёс зүйн ноцтой алдаа",
  },
  {
    kind: "account",
    country: 2,
    step: 2,
    name: "Канад · Хариуцлага",
    tag: "03 · Канад",
    title: `EGBC ${mark("сахилгын")} шийдвэр`,
    systemLabel: "EGBC · лицензийн сахилга",
    rows: [
      { ok: true, text: "Todd Martin", note: "$25,000 торгууль + $69,000 зардал; лицензээ өгсөн" },
      { ok: true, text: "Stephen Rice", note: "$25,000 торгууль; дахин бүртгүүлбэл 2 жил түдгэлзэнэ" },
      { ok: true, text: "Laura Fidel", note: "2 сар түдгэлзүүлж, 3 сургалтад хамруулсан" },
    ],
    gap: "Хуучин хуулиар торгууль $25,000-аас хэтрэхгүй — хангалтгүй",
    law: {
      name: "Professional Governance Act (BC)",
      year: "2021",
      yearNote: "онд хүчин төгөлдөр болсон",
      effects: [
        { icon: Scale, text: "Хувь хүнд $100,000, фирмд $250,000 хүртэл торгууль" },
        { icon: Building2, text: "Инженерийн фирмүүдийг шууд зохицуулах" },
        { icon: UserCheck, text: "Мэргэжлийн хариуцлагыг хуулиар бэхжүүлсэн" },
      ],
    },
    src: "Эх сурвалж: EGBC — Mount Polley Investigation Concludes (2022.03); EGBC Fidel penalty decision (2022.02.09)",
  },
  {
    kind: "decision",
    country: 2,
    step: 3,
    name: "Канад · Шийдвэр",
    tag: "03 · Канад",
    title: `Ёс зүйн ${mark("шийдвэр")}`,
    items: [
      { icon: Microscope, text: "Суурийн геологийн судалгааг хөндлөнгийн шинжээчээр давхар хянуулах" },
      { icon: UserCheck, text: "Хяналтын инженерийн бие даасан байдлыг хамгаалах" },
      { icon: Layers, text: "Хаягдлын хамгийн аюулгүй технологийг (BAT) сонгох" },
    ],
  },
  {
    kind: "recs",
    country: 2,
    step: 4,
    name: "Канад · Санал",
    tag: "03 · Канад · Манай багийн санал",
    title: `Цаашид хэрэгжүүлэх ${mark("санал")}`,
    items: [
      { icon: ClipboardCheck, text: "Инженерүүд: геологийн тооцоог хөндлөнгийн шинжээчээр заавал хянуулах" },
      { icon: Building2, text: "Компаниуд: далангийн хэмжээг дур мэдэн нэмэхгүй, бие даасан эрсдэлийн зөвлөлтэй байх" },
      { icon: Eye, text: "Зохицуулагчид: хяналт шалгалтыг жилд 2-оос доошгүй удаа хийх" },
      { icon: Megaphone, text: "Багажийн хэвийн бус заалтыг даруй мэдээлэх (duty to report)" },
    ],
    photo: {
      src: "/images/canada-hazeltine.jpg",
      alt: "Сэргээгдэж буй Hazeltine гол",
      badge: "HAZELTINE CREEK · СЭРГЭЭЛТ",
      credit: "Wikimedia Commons · CC0",
    },
  },
];

/* ------------------------------------------------------------------ */
/* Hourglass poses                                                     */
/* ------------------------------------------------------------------ */

const POSE_INTRO: SlideState = { x: -0.55, y: 0.1, s: 1.1, rx: 0.16, rz: -0.15, o: 0.22 };
const POSE_FAINT: SlideState = { x: 0.05, y: 0, s: 1.4, rx: 0.06, rz: 0.04, o: 0.1 };
const POSE_CORNER: SlideState[] = [
  { x: 0.86, y: 0.6, s: 0.3, rx: 0.3, rz: -0.2, o: 0.55 },
  { x: 0.88, y: 0.58, s: 0.3, rx: -0.28, rz: 0.3, o: 0.55 },
];

const poseFor = (i: number): SlideState => {
  const s = slides[i];
  if (!s) return POSE_FAINT;
  if (s.kind === "intro") return POSE_INTRO;
  if (s.kind === "case" || s.kind === "recs") return POSE_CORNER[i % 2];
  return POSE_FAINT;
};

/* ------------------------------------------------------------------ */
/* Small render pieces                                                 */
/* ------------------------------------------------------------------ */

function Title({ html }: { html: string }) {
  return <h1 className="b3-title" dangerouslySetInnerHTML={{ __html: html }} />;
}

function Head({ s }: { s: Slide }) {
  return (
    <>
      <div className="b3-head">
        {s.country !== undefined && (
          <span className="b3-flag">{COUNTRIES[s.country].code}</span>
        )}
        <div className="tag" style={{ marginBottom: 0 }}>
          {s.tag}
        </div>
      </div>
      {s.step !== undefined && (
        <ol className="b3-steps" aria-label="Кейсийн бүтэц">
          {STEPS.map((st, i) => (
            <li
              key={st}
              className={i === s.step ? "on" : i < (s.step ?? 0) ? "done" : ""}
            >
              {st}
            </li>
          ))}
        </ol>
      )}
      <Title html={s.title} />
    </>
  );
}

function PhotoFrame({ p }: { p: Photo }) {
  return (
    <figure className="b3-photo">
      <img src={p.src} alt={p.alt} />
      <span className="b3-photo-badge">{p.badge}</span>
      <figcaption>{p.credit}</figcaption>
    </figure>
  );
}

function Src({ s }: { s: Slide }) {
  return s.src ? <p className="b3-src">{s.src}</p> : null;
}

function SlideBody({ s }: { s: Slide }) {
  switch (s.kind) {
    case "intro":
      return (
        <div className="b3-grid b3-intro">
          <div className="b3-col">
            <div className="tag">{s.tag}</div>
            <Title html={s.title} />
            <p className="b3-sub">{s.sub}</p>
            <div className="b3-flow-label">Кейс бүрт 5 слайд</div>
            <ol className="b3-flow">
              {STEPS.map((st, i) => (
                <li key={st}>
                  <b>0{i + 1}</b>
                  {st}
                </li>
              ))}
            </ol>
          </div>
          <div className="b3-cases">
            {COUNTRIES.map((c, i) => {
              const Icon = c.icon;
              return (
                <div className="b3-case-card" key={c.code}>
                  <img src={c.img} alt="" />
                  <div className="b3-case-info">
                    <span className="b3-case-num">0{i + 1}</span>
                    <div>
                      <div className="b3-case-country">
                        {c.name} · {c.year}
                      </div>
                      <div className="b3-case-name">{c.caseName}</div>
                    </div>
                    <span className="b3-case-icon">
                      <Icon size={20} strokeWidth={1.6} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );

    case "case":
      return (
        <div className="b3-grid">
          <div className="b3-col">
            <Head s={s} />
            <p className="b3-sub">{s.sub}</p>
            <div className="b3-stats">
              {s.stats.map((st) => {
                const Icon = st.icon;
                return (
                  <div className="b3-stat" key={st.label}>
                    <Icon className="b3-stat-icon" size={20} strokeWidth={1.6} />
                    <div className="b3-stat-num">{st.num}</div>
                    <div className="b3-stat-label">{st.label}</div>
                  </div>
                );
              })}
            </div>
            <ul className="b3-facts">
              {s.facts.map((f) => {
                const Icon = f.icon;
                return (
                  <li key={f.text}>
                    <Icon size={18} strokeWidth={1.8} />
                    <span>{f.text}</span>
                  </li>
                );
              })}
            </ul>
            <Src s={s} />
          </div>
          <PhotoFrame p={s.photo} />
        </div>
      );

    case "theory":
      return (
        <div className="b3-full">
          <Head s={s} />
          <div className="b3-theory">
            <div className="b3-th-card">
              <span className="b3-th-icon">
                <Scale size={26} strokeWidth={1.5} />
              </span>
              <div className="b3-th-name">Утилитаризм</div>
              <div className="b3-th-meta">Бентам, Милл · Үр дагавраар дүгнэнэ</div>
              <p className="b3-th-text">{s.util}</p>
            </div>
            <div className="b3-th-card">
              <span className="b3-th-icon">
                <BookOpen size={26} strokeWidth={1.5} />
              </span>
              <div className="b3-th-name">Деонтологи</div>
              <div className="b3-th-meta">Кант · Үүргээр дүгнэнэ</div>
              <p className="b3-th-text">{s.deon}</p>
            </div>
          </div>
          <div className="b3-verdict">
            <X size={18} strokeWidth={2.2} />
            {s.verdict}
          </div>
        </div>
      );

    case "account":
      return (
        <div className="b3-grid b3-even">
          <div className="b3-col">
            <Head s={s} />
            <div className="b3-sys-label">{s.systemLabel}</div>
            <ul className="b3-rows">
              {s.rows.map((r) => (
                <li key={r.text} className={r.ok ? "ok" : "no"}>
                  <span className="b3-row-mark">
                    {r.ok ? (
                      <Check size={15} strokeWidth={2.6} />
                    ) : (
                      <X size={15} strokeWidth={2.6} />
                    )}
                  </span>
                  <b>{r.text}</b>
                  {r.note && <span className="b3-row-note">{r.note}</span>}
                </li>
              ))}
            </ul>
            <div className="b3-gap">
              <CircleAlert size={18} strokeWidth={1.9} />
              {s.gap}
            </div>
            <Src s={s} />
          </div>
          <div className="b3-law">
            <div className="b3-law-top">
              <Landmark size={22} strokeWidth={1.5} />
              <span>Бодит хариуцлагыг хууль хүлээлгэсэн</span>
            </div>
            <div className="b3-law-year">{s.law.year}</div>
            <div className="b3-law-yn">{s.law.yearNote}</div>
            <div className="b3-law-name">{s.law.name}</div>
            <ul className="b3-law-fx">
              {s.law.effects.map((e) => {
                const Icon = e.icon;
                return (
                  <li key={e.text}>
                    <Icon size={18} strokeWidth={1.7} />
                    <span>{e.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      );

    case "decision":
      return (
        <div className="b3-full">
          <Head s={s} />
          <div className="b3-decide">
            {s.items.map((it, i) => {
              const Icon = it.icon;
              return (
                <div className="b3-dc" key={it.text}>
                  <span className="b3-dc-num">0{i + 1}</span>
                  <span className="b3-dc-icon">
                    <Icon size={34} strokeWidth={1.4} />
                  </span>
                  <p>{it.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      );

    case "recs":
      return (
        <div className="b3-grid">
          <div className="b3-col">
            <Head s={s} />
            <ol className="b3-recs">
              {s.items.map((it, i) => {
                const Icon = it.icon;
                return (
                  <li key={it.text}>
                    <span className="b3-rec-icon">
                      <Icon size={18} strokeWidth={1.7} />
                    </span>
                    <span className="b3-rec-n">{i + 1}</span>
                    <div>
                      <div className="b3-rec-t">{it.text}</div>
                      {it.sub && <div className="b3-rec-s">{it.sub}</div>}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
          <PhotoFrame p={s.photo} />
        </div>
      );
  }
}

/* ------------------------------------------------------------------ */
/* CSS                                                                 */
/* ------------------------------------------------------------------ */

const css = `
.b3 main{position:absolute;inset:0;overflow:hidden}
.b3 .slide{
  display:flex;align-items:center;justify-content:center;
  padding:clamp(66px,11vh,104px) clamp(20px,5vw,84px) clamp(66px,11vh,100px);
}
.b3 .slide:not(.on){pointer-events:none}

.b3-grid{width:100%;max-width:1400px;height:100%;min-height:0;display:grid;
  grid-template-columns:minmax(0,1.08fr) minmax(0,.92fr);gap:clamp(24px,4.5vw,72px);align-items:center}
.b3-grid.b3-even{grid-template-columns:minmax(0,1fr) minmax(0,.86fr)}
.b3-col{min-width:0;display:flex;flex-direction:column;justify-content:center}
.b3-full{width:100%;max-width:1240px;display:flex;flex-direction:column;justify-content:center}

/* head */
.b3-head{display:flex;align-items:center;gap:12px}
.b3-flag{font-family:var(--mono);font-size:11px;font-weight:600;letter-spacing:.08em;
  padding:4px 8px;border-radius:4px;background:var(--ink);color:var(--paper)}
.b3-head .tag{flex:1}
.b3-steps{list-style:none;display:flex;flex-wrap:wrap;gap:6px;margin:1.8vh 0 0}
.b3-steps li{font-family:var(--mono);font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;
  padding:4px 10px;border-radius:999px;border:1px solid var(--rule);color:var(--mute)}
.b3-steps li.done{color:var(--ink-2);border-color:var(--ink-2)}
.b3-steps li.on{background:var(--accent);border-color:var(--accent);color:#fff;font-weight:600}

.b3-title{font-family:var(--serif);font-weight:400;color:var(--ink);
  font-size:clamp(30px,5.6vh,62px);line-height:1.06;letter-spacing:-.025em;margin:2vh 0 1.4vh;text-wrap:balance}
.b3-sub{font-family:var(--serif);font-style:italic;color:var(--ink-2);
  font-size:clamp(16px,2.3vh,22px);line-height:1.4;max-width:640px;margin:0 0 2.6vh}
.b3-src{font-family:var(--mono);font-size:10px;letter-spacing:.03em;color:var(--mute);margin-top:2vh}

/* photo */
.b3-photo{position:relative;margin:0;width:100%;height:min(100%,70vh);border-radius:14px;overflow:hidden;
  background:var(--paper-card);box-shadow:0 30px 60px -28px rgba(21,49,42,.45)}
.b3-photo img{width:100%;height:100%;object-fit:cover;display:block;filter:saturate(.92) contrast(1.04)}
.b3-photo::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 60%,rgba(21,49,42,.55))}
.b3-photo-badge{position:absolute;z-index:1;top:14px;left:14px;font-family:var(--mono);font-size:10.5px;
  letter-spacing:.1em;padding:6px 11px;border-radius:999px;background:rgba(21,49,42,.82);color:var(--paper);backdrop-filter:blur(6px)}
.b3-photo figcaption{position:absolute;z-index:1;right:14px;bottom:12px;font-family:var(--mono);font-size:10px;color:rgba(255,255,255,.85)}

/* stats */
.b3-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(12px,2vw,28px);margin-bottom:2.6vh}
.b3-stat{border-top:1.5px solid var(--ink);padding-top:1.4vh}
.b3-stat-icon{color:var(--accent);margin-bottom:.8vh}
.b3-stat-num{font-family:var(--serif);font-weight:400;font-size:clamp(32px,6.4vh,70px);line-height:.95;color:var(--ink);white-space:nowrap}
.b3-stat-label{font-size:clamp(12.5px,1.75vh,15px);color:var(--ink-2);margin-top:.6vh;line-height:1.3}
.b3-facts{list-style:none;display:flex;flex-direction:column;gap:1.1vh}
.b3-facts li{display:flex;gap:12px;align-items:center;font-size:clamp(14.5px,2vh,18px);line-height:1.35;color:var(--ink)}
.b3-facts svg{flex-shrink:0;color:var(--accent)}

/* theory */
.b3-theory{display:grid;grid-template-columns:1fr 1fr;gap:clamp(14px,2.4vw,32px);margin-top:1.6vh}
.b3-th-card{position:relative;padding:clamp(20px,3.6vh,38px) clamp(20px,2.4vw,36px);border-radius:16px;
  background:rgba(255,255,255,.5);border:1px solid var(--rule);backdrop-filter:blur(4px)}
.b3-th-icon{display:inline-grid;place-items:center;width:clamp(48px,7.4vh,62px);height:clamp(48px,7.4vh,62px);
  border-radius:50%;background:var(--ink);color:var(--paper);margin-bottom:2vh}
.b3-th-name{font-family:var(--serif);font-size:clamp(26px,4.4vh,44px);line-height:1;color:var(--ink)}
.b3-th-meta{font-family:var(--mono);font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);margin:1.2vh 0 2vh}
.b3-th-text{font-size:clamp(15px,2.2vh,20px);line-height:1.45;color:var(--ink)}
.b3-verdict{display:flex;align-items:center;gap:12px;margin-top:2.6vh;padding:1.6vh 20px;border-radius:12px;
  background:var(--accent-soft);color:var(--accent);font-weight:600;font-size:clamp(15px,2.1vh,19px)}

/* accountability */
.b3-sys-label{font-family:var(--mono);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--mute);margin:.6vh 0 1vh}
.b3-rows{list-style:none;display:flex;flex-direction:column}
.b3-rows li{display:grid;grid-template-columns:26px auto 1fr;align-items:center;gap:12px;
  padding:1.3vh 0;border-bottom:1px solid var(--rule);font-size:clamp(14.5px,2.05vh,18.5px)}
.b3-rows li b{font-weight:600;color:var(--ink)}
.b3-row-note{color:var(--ink-2);text-align:right;font-size:.88em}
.b3-row-mark{width:24px;height:24px;border-radius:50%;display:grid;place-items:center}
.b3-rows li.ok .b3-row-mark{background:var(--ink);color:var(--paper)}
.b3-rows li.no .b3-row-mark{background:transparent;color:var(--accent);border:1.5px solid var(--accent)}
.b3-rows li.no b{color:var(--mute);text-decoration:line-through;text-decoration-color:rgba(184,97,47,.6)}
.b3-gap{display:flex;gap:10px;align-items:center;margin-top:2vh;color:var(--accent);font-weight:600;
  font-size:clamp(14.5px,2vh,18px);line-height:1.35}
.b3-gap svg{flex-shrink:0}

.b3-law{position:relative;align-self:center;padding:clamp(22px,4vh,44px) clamp(22px,2.6vw,40px);border-radius:18px;
  background:var(--ink);color:var(--paper);box-shadow:0 30px 60px -28px rgba(21,49,42,.6);overflow:hidden}
.b3-law::before{content:"";position:absolute;right:-60px;top:-60px;width:220px;height:220px;border-radius:50%;
  border:1px solid rgba(243,237,226,.14)}
.b3-law-top{display:flex;align-items:center;gap:10px;font-family:var(--mono);font-size:10.5px;letter-spacing:.1em;
  text-transform:uppercase;color:#e7a477}
.b3-law-year{font-family:var(--serif);font-size:clamp(64px,13vh,140px);line-height:.9;margin-top:2vh;letter-spacing:-.03em}
.b3-law-yn{font-family:var(--serif);font-style:italic;font-size:clamp(15px,2.1vh,20px);opacity:.75}
.b3-law-name{font-family:var(--serif);font-size:clamp(20px,3.2vh,30px);line-height:1.15;margin:1.6vh 0 2.4vh}
.b3-law-fx{list-style:none;display:flex;flex-direction:column;gap:1.3vh;border-top:1px solid rgba(243,237,226,.18);padding-top:2vh}
.b3-law-fx li{display:flex;gap:12px;align-items:center;font-size:clamp(14px,1.95vh,17.5px);line-height:1.35}
.b3-law-fx svg{flex-shrink:0;color:#e7a477}

/* decision */
.b3-decide{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(14px,2.2vw,30px);margin-top:2vh}
.b3-dc{position:relative;padding:clamp(22px,4.4vh,48px) clamp(18px,2vw,32px);border-radius:16px;
  background:rgba(255,255,255,.5);border:1px solid var(--rule);min-height:clamp(220px,38vh,380px);
  display:flex;flex-direction:column;backdrop-filter:blur(4px)}
.b3-dc:nth-child(2){background:var(--ink);border-color:var(--ink);color:var(--paper)}
.b3-dc-num{position:absolute;top:clamp(16px,2.6vh,26px);right:22px;font-family:var(--mono);font-size:12px;font-weight:600;color:var(--accent)}
.b3-dc-icon{display:inline-grid;place-items:center;width:clamp(58px,9vh,80px);height:clamp(58px,9vh,80px);
  border-radius:50%;background:var(--accent-soft);color:var(--accent);margin-bottom:auto}
.b3-dc:nth-child(2) .b3-dc-icon{background:rgba(243,237,226,.1);color:#e7a477}
.b3-dc p{font-family:var(--serif);font-size:clamp(21px,3.4vh,32px);line-height:1.18;margin-top:3vh}

/* recs */
.b3-recs{list-style:none;display:flex;flex-direction:column;margin-top:.4vh}
.b3-recs li{display:grid;grid-template-columns:auto auto 1fr;gap:12px;align-items:center;padding:1.25vh 0;border-bottom:1px solid var(--rule)}
.b3-recs li:last-child{border-bottom:none}
.b3-rec-icon{display:grid;place-items:center;width:clamp(34px,5vh,42px);height:clamp(34px,5vh,42px);border-radius:10px;
  background:var(--accent-soft);color:var(--accent)}
.b3-rec-n{font-family:var(--mono);font-size:11px;font-weight:600;color:var(--mute);width:14px}
.b3-rec-t{font-size:clamp(14.5px,2.05vh,18.5px);line-height:1.32;color:var(--ink);font-weight:500}
.b3-rec-s{font-size:clamp(12.5px,1.75vh,15px);color:var(--ink-2);margin-top:.3vh}

/* intro */
.b3-intro{grid-template-columns:minmax(0,1fr) minmax(0,.95fr)}
.b3-intro .b3-title{font-size:clamp(38px,8vh,88px);line-height:1}
.b3-flow-label{font-family:var(--mono);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--mute);margin-bottom:1.2vh}
.b3-flow{list-style:none;display:flex;flex-wrap:wrap;gap:8px}
.b3-flow li{display:flex;gap:8px;align-items:center;padding:8px 14px;border-radius:999px;border:1px solid var(--rule);
  background:rgba(255,255,255,.45);font-size:clamp(13px,1.8vh,15.5px);color:var(--ink)}
.b3-flow b{font-family:var(--mono);font-size:10.5px;color:var(--accent)}
.b3-cases{display:flex;flex-direction:column;gap:1.6vh;height:min(100%,72vh)}
.b3-case-card{position:relative;flex:1;min-height:0;border-radius:14px;overflow:hidden;box-shadow:0 22px 44px -26px rgba(21,49,42,.55)}
.b3-case-card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.b3-case-card::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(21,49,42,.95) 0%,rgba(21,49,42,.8) 55%,rgba(21,49,42,.4) 100%)}
.b3-case-info{text-shadow:0 1px 8px rgba(0,0,0,.35)}
.b3-case-info{position:relative;z-index:1;height:100%;display:grid;grid-template-columns:auto 1fr auto;gap:16px;align-items:center;
  padding:0 clamp(16px,2vw,26px);color:var(--paper)}
.b3-case-num{font-family:var(--serif);font-size:clamp(30px,5.4vh,52px);line-height:1;color:#e7a477}
.b3-case-country{font-family:var(--mono);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;opacity:.8}
.b3-case-name{font-family:var(--serif);font-size:clamp(18px,2.9vh,27px);line-height:1.15;margin-top:.4vh}
.b3-case-icon{display:grid;place-items:center;width:40px;height:40px;border-radius:50%;border:1px solid rgba(243,237,226,.35)}

/* small screens: scroll inside slide */
@media (max-width:900px),(max-height:560px){
  .b3 .slide{overflow-y:auto;align-items:flex-start}
  .b3-grid,.b3-grid.b3-even,.b3-intro{grid-template-columns:minmax(0,1fr);height:auto;gap:20px;margin-block:auto}
  .b3-photo{height:32vh}
  .b3-cases{height:auto}
  .b3-case-card{min-height:96px}
  .b3-theory,.b3-decide{grid-template-columns:minmax(0,1fr)}
  .b3-dc{min-height:0}
  .b3-dc p{margin-top:1.6vh}
  .b3-stats{grid-template-columns:repeat(3,minmax(0,1fr))}
  .b3-rows li{grid-template-columns:26px 1fr}
  .b3-row-note{grid-column:2;text-align:left}
  .deck-nav-pills{display:none}
}

/* PDF хэвлэх */
@media print{
  @page{size:landscape;margin:0}
  html,body{height:auto;overflow:visible}
  .slides-wrapper,.b3 main{position:static;overflow:visible;height:auto}
  .b3 .slide{position:relative!important;visibility:visible!important;opacity:1!important;transform:none!important;
    height:100vh;break-after:page;page-break-after:always}
  canvas,.grain,.curtain,.wipe,.progress,.chrome{display:none!important}
}
`;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

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
  const touchStartX = useRef(0);

  const hourglassRef = useRef<{
    onChange: (d: number) => void;
    destroy: () => void;
  } | null>(null);
  const indexRef = useRef(index);
  indexRef.current = index;

  // 3D HOURGLASS
  useEffect(() => {
    const canvas = document.getElementById("gl") as HTMLCanvasElement | null;
    if (!canvas) return;
    const instance = initHourglass(canvas, () => {
      const s = poseFor(indexRef.current);
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
        targetIndex >= slides.length
      )
        return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const gsap = (window as any).gsap;
      const dir = targetIndex > index ? 1 : -1;
      const target = slides[targetIndex];

      hourglassRef.current?.onChange(dir);

      const curtain = curtainRef.current;
      const cc = curtainCountRef.current;
      const cn = curtainNameRef.current;
      const wipe = wipeRef.current;
      const currentEl = slideContainerRef.current?.children[index] as
        | HTMLElement
        | undefined;

      if (!gsap || !curtain || !cc || !cn) {
        setIndex(targetIndex);
        return;
      }

      setIsBusy(true);
      cc.textContent = `${String(targetIndex + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
      cn.innerHTML = `<span>${target.name}</span>`;

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
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.48, ease: "power3.inOut" },
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
          if (currentEl) gsap.set(currentEl, { clearProps: "transform,opacity" });
          setIndex(targetIndex);
        }, 0.6)
        .to(
          cn.querySelector("span"),
          { yPercent: -110 * dir, duration: 0.38, ease: "power3.in" },
          0.66,
        )
        .to(curtain, { clipPath: to, duration: 0.55, ease: "power3.inOut" }, 0.78);

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
    [index, isBusy],
  );

  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.transform = `scaleX(${index / (slides.length - 1)})`;
    }
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowRight", "Space", "PageDown"].includes(e.code)) {
        e.preventDefault();
        goToSlide(index + 1);
      } else if (["ArrowLeft", "PageUp"].includes(e.code)) {
        e.preventDefault();
        goToSlide(index - 1);
      } else if (e.key.toLowerCase() === "f") {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
        else document.exitFullscreen?.();
      } else if (e.key === "Home") {
        goToSlide(0);
      } else if (e.key === "End") {
        goToSlide(slides.length - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goToSlide, index]);

  useEffect(() => {
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const cur = slides[index];

  return (
    <div
      className="slides-wrapper b3"
      onTouchStart={(e) => {
        touchStartX.current = e.changedTouches[0].clientX;
      }}
      onTouchEnd={(e) => {
        const diff = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(diff) > 50) goToSlide(index + (diff < 0 ? 1 : -1));
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <canvas id="gl" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <div className="curtain" ref={curtainRef} aria-hidden="true">
        <div className="cc" ref={curtainCountRef}>
          01 / {String(slides.length).padStart(2, "0")}
        </div>
        <div className="cn" ref={curtainNameRef}>
          <span>{slides[0].name}</span>
        </div>
      </div>

      <div className="wipe" ref={wipeRef} aria-hidden="true" />
      <div className="progress" ref={progressRef} style={{ background: "var(--accent)" }} />

      <header className="chrome top">
        <div className="chrome-brand">
          <b style={{ color: "var(--accent)" }}>БИЕ ДААЛТ 03</b>
          <span>·</span>
          <span>
            {cur.country !== undefined ? COUNTRIES[cur.country].name : "Кейс шинжилгээ"}
          </span>
        </div>
        <div className="deck-nav-pills">
          <Link href="/" className="deck-pill">
            02 · ХАРЬЦУУЛСАН СУДАЛГАА
          </Link>
          <Link href="/biydalt3" className="deck-pill active">
            03 · КЕЙС ШИНЖИЛГЭЭ
          </Link>
        </div>
      </header>

      <main ref={slideContainerRef}>
        {slides.map((s, idx) => (
          <section
            key={idx}
            className={`slide ${idx === index ? "on" : ""}`}
            data-name={s.name}
            aria-hidden={idx !== index}
          >
            <SlideBody s={s} />
          </section>
        ))}
      </main>

      <footer className="chrome bottom">
        <div className="counter">
          <b>{String(index + 1).padStart(2, "0")}</b>
          <span>/</span>
          <span>{String(slides.length).padStart(2, "0")}</span>
          <span style={{ marginLeft: "14px", color: "var(--ink-2)" }}>{cur.name}</span>
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
              if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
              else document.exitFullscreen?.();
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
