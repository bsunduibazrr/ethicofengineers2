/* Бие даалт 03: слайдын агуулга. Вэб (biydalt3/page.tsx) болон PowerPoint (scripts/build-pptx.mjs) хоёулаа эндээс уншина. */

import type { LucideIcon } from "lucide-react";
import {
  Ambulance,
  Building2,
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
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type IconItem = { icon: LucideIcon; text: string; sub?: string };
export type Stat = { icon: LucideIcon; num: string; label: string };
export type Photo = { src: string; alt: string; badge: string; credit: string };

export type Base = {
  name: string; // хөшигний нэр
  tag: string;
  title: string; // HTML (mark ашиглана)
  country?: 0 | 1 | 2; // KR, FR, CA
  step?: number; // 0..4
  src?: string; // эх сурвалжийн жижиг мөр
};

export type IntroSlide = Base & { kind: "intro"; sub: string };
export type CaseSlide = Base & {
  kind: "case";
  sub: string;
  stats: Stat[];
  facts: IconItem[];
  photo: Photo;
};
export type TheorySlide = Base & {
  kind: "theory";
  util: string;
  deon: string;
  verdict: string;
};
export type AccountSlide = Base & {
  kind: "account";
  systemLabel: string;
  rows: { ok: boolean | null; text: string; note?: string }[];
  gap: string;
  law: { name: string; year: string; yearNote: string; effects: IconItem[] };
};
export type DecisionSlide = Base & { kind: "decision"; items: IconItem[] };
export type RecsSlide = Base & { kind: "recs"; items: IconItem[]; photo: Photo };

export type Slide =
  | IntroSlide
  | CaseSlide
  | TheorySlide
  | AccountSlide
  | DecisionSlide
  | RecsSlide;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export const mark = (w: string) =>
  `<em class='mark'>${w}<svg class='scr' viewBox='0 0 200 20' preserveAspectRatio='none' aria-hidden='true'><path d='M3 13 C 40 5, 90 17, 130 10 S 185 6, 197 12'/></svg></em>`;

export const STEPS = ["Кейс", "Ёс зүйн онол", "Хариуцлага", "Шийдвэр", "Санал"];

export const COUNTRIES = [
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

export const slides: Slide[] = [
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
      { icon: Map, text: "Бүс нутгийг  тусгай гамшгийн бүс  зарласан" },
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
      {
        ok: false,
        text: "Нийтлэл хориглох",
        note: "Эрдэм шинжилгээний зөрчилд",
      },
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
      {
        icon: Megaphone,
        text: "Аюулын мэдээллийг үнэн зөв, цаг тухайд нь өгөх",
      },
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
      {
        icon: ShieldCheck,
        text: "Дүрэмд нийтийн аюулгүй байдал хамгийн тэргүүнд гэсэн зарчим нэмэх",
      },
      {
        icon: Lock,
        text: "Нууцлалын зарчимд нийтийн аюулгүй байдлын хязгаар тогтоох",
      },
      {
        icon: Gavel,
        text: "Санкцийн системд аюулгүй байдлын зөрчлийн төрөл нэмэх",
        sub: "Заавал дахин сургалт, мэргэжлийн үйл ажиллагаанаас түр хасах",
      },
      {
        icon: Siren,
        text: "Автомат буулгалт, оршин суугчидтай жил бүр сургуулилт, хугацаатай мэдээллийн систем",
      },
      {
        icon: Ambulance,
        text: "Аврах албанд саармагжуулагч бодис, сургалт бэлэн байлгах",
      },
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
      {
        icon: FlaskConical,
        text: "Шүүх: хлорт бодис (DCCNa) нитраттай андуурч холилдсон",
      },
      {
        icon: Building2,
        text: "Үйлдвэр хотын төвөөс ердөө ~5 км зайтай байсан",
      },
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
      {
        ok: true,
        text: "Grande Paroisse",
        note: "€225,000 торгууль (дээд хэмжээ)",
      },
      { ok: true, text: "Үйлдвэрийн захирал", note: "15 сар тэнсэн хорих ял" },
    ],
    gap: "Эрүүгийн хууль 121-3: болгоомжгүйгээр хүний амь хохироосон",
    law: {
      name: "Loi Bachelot — технологийн эрсдэлийн хууль",
      year: "2003",
      yearNote: "онд баталсан",
      effects: [
        {
          icon: Map,
          text: "Аюултай үйлдвэр бүрт эрсдэлийн бүсийн төлөвлөгөө (PPRT)",
        },
        { icon: Users, text: "Оршин суугчдын мэдээллийн хороо (CLIC)" },
        {
          icon: HardHat,
          text: "Ажилчид, гүйцэтгэгчдийн аюулгүй байдлын оролцоо",
        },
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
      {
        icon: Warehouse,
        text: "Нийцгүй бодисыг тусад нь хадгалж, хаягдлыг ангилах",
      },
      {
        icon: GraduationCap,
        text: "Туслан гүйцэтгэгч ажилчдыг сургаж, эрсдэлийг мэдээлэх",
      },
      {
        icon: Map,
        text: "Аюултай үйлдвэр, суурьшлын бүсийн хооронд хамгаалалтын зай тогтоох",
      },
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
      {
        icon: ShieldCheck,
        text: " Нийтийн аюулгүй байдал хамгийн тэргүүнд  зарчмыг заавал болгох",
      },
      {
        icon: FlaskConical,
        text: "Нийцгүй бодисын хадгалалтын заавал журам, тогтмол аудит",
      },
      {
        icon: HardHat,
        text: "Туслан гүйцэтгэгчдэд аюулгүй байдлын ижил стандарт мөрдүүлэх",
      },
      {
        icon: Siren,
        text: "Оршин суугчдад сэрэмжлүүлэх систем, жил бүр сургуулилт",
      },
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
      {
        icon: Mountain,
        text: "Суурийн сул шаварлаг давхарга (GLU)-ыг дутуу тооцсон",
      },
      {
        icon: CircleAlert,
        text: "Далангийн налууг хэт огцом барьж, багажийн заалтыг үл тоосон",
      },
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
      {
        ok: true,
        text: "Todd Martin",
        note: "$25,000 торгууль + $69,000 зардал; лицензээ өгсөн",
      },
      {
        ok: true,
        text: "Stephen Rice",
        note: "$25,000 торгууль; дахин бүртгүүлбэл 2 жил түдгэлзэнэ",
      },
      {
        ok: true,
        text: "Laura Fidel",
        note: "2 сар түдгэлзүүлж, 3 сургалтад хамруулсан",
      },
    ],
    gap: "Хуучин хуулиар торгууль $25,000-аас хэтрэхгүй — хангалтгүй",
    law: {
      name: "Professional Governance Act (BC)",
      year: "2021",
      yearNote: "онд хүчин төгөлдөр болсон",
      effects: [
        {
          icon: Scale,
          text: "Хувь хүнд $100,000, фирмд $250,000 хүртэл торгууль",
        },
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
      {
        icon: Microscope,
        text: "Суурийн геологийн судалгааг хөндлөнгийн шинжээчээр давхар хянуулах",
      },
      {
        icon: UserCheck,
        text: "Хяналтын инженерийн бие даасан байдлыг хамгаалах",
      },
      {
        icon: Layers,
        text: "Хаягдлын хамгийн аюулгүй технологийг (BAT) сонгох",
      },
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
      {
        icon: ClipboardCheck,
        text: "Инженерүүд: геологийн тооцоог хөндлөнгийн шинжээчээр заавал хянуулах",
      },
      {
        icon: Building2,
        text: "Компаниуд: далангийн хэмжээг дур мэдэн нэмэхгүй, бие даасан эрсдэлийн зөвлөлтэй байх",
      },
      {
        icon: Eye,
        text: "Зохицуулагчид: хяналт шалгалтыг жилд 2-оос доошгүй удаа хийх",
      },
      {
        icon: Megaphone,
        text: "Багажийн хэвийн бус заалтыг даруй мэдээлэх (duty to report)",
      },
    ],
    photo: {
      src: "/images/canada-hazeltine.jpg",
      alt: "Сэргээгдэж буй Hazeltine гол",
      badge: "HAZELTINE CREEK · СЭРГЭЭЛТ",
      credit: "Wikimedia Commons · CC0",
    },
  },
];
