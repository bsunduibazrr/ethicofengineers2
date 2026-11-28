/* Бие даалт 02: слайдын агуулга. Вэб (app/page.tsx) болон PowerPoint (scripts/build-pptx.mjs) хоёулаа эндээс уншина. */

import type { LucideIcon } from "lucide-react";
import {
  Award,
  Ban,
  BookOpen,
  Briefcase,
  Building2,
  CalendarDays,
  CircleHelp,
  ClipboardCheck,
  FileText,
  FlaskConical,
  Gavel,
  Globe,
  GraduationCap,
  Landmark,
  Leaf,
  Lightbulb,
  Link2,
  Lock,
  Megaphone,
  Network,
  Scale,
  School,
  ShieldAlert,
  ShieldCheck,
  Skull,
  TrendingUp,
  TriangleAlert,
  Undo2,
  User,
  UserCheck,
  UserX,
  Users,
  Wind,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type Tone = "ink" | "accent" | "warn";
export type IconItem = {
  icon: LucideIcon;
  bold?: string;
  text: string;
  sub?: string;
  muted?: boolean;
};
export type Stat = { icon: LucideIcon; num: string; label: string };
export type Photo = { src: string; alt: string; badge: string; credit: string };
export type CardItem = {
  icon: LucideIcon;
  title: string;
  pill?: string;
  desc: string;
  extra?: string;
  tone?: Tone;
};

export type Base = {
  name: string; // хөшигний нэр
  tag: string;
  title: string; // HTML (mark ашиглана)
  group: number; // GROUPS-ийн индекс
  step?: number;
  sub?: string;
};

export type CoverSlide = Base & { kind: "cover"; sub: string };
export type CaseSlide = Base & {
  kind: "case";
  stats: Stat[];
  facts: IconItem[];
  photo: Photo;
};
export type CardsSlide = Base & {
  kind: "cards";
  cards: CardItem[];
  note?: { icon: LucideIcon; text: string };
};
export type TilesSlide = Base & {
  kind: "tiles";
  tiles: { icon: LucideIcon; text: string }[];
};
export type LadderSlide = Base & {
  kind: "ladder";
  rows: { icon: LucideIcon; text: string }[];
  side: { label: string; text: string };
};
export type OrgSlide = Base & {
  kind: "org";
  year: string;
  yearText: string;
  root: string;
  nodes: CardItem[];
};
export type ListSlide = Base & {
  kind: "list";
  items: IconItem[];
  photo: Photo;
  foot?: string;
};
export type VersusSlide = Base & {
  kind: "versus";
  a: CardItem;
  b: CardItem;
  note: string;
};
export type TimelineSlide = Base & {
  kind: "timeline";
  events: { year: string; title: string; desc: string }[];
  facts: IconItem[];
};
export type TiersSlide = Base & {
  kind: "tiers";
  facts: IconItem[];
  tiers: CardItem[];
};
export type MoneySlide = Base & {
  kind: "money";
  facts: IconItem[];
  panelLabel: string;
  figures: { num: string; label: string }[];
};
export type TableSlide = Base & { kind: "table" };
export type CompareSlide = Base & {
  kind: "compare";
  countries: { code: string; name: string; pill: string; desc: string }[];
  points: IconItem[];
};
export type LessonsSlide = Base & {
  kind: "lessons";
  items: { bold: string; text: string }[];
  actors: CardItem[];
};
export type RefsSlide = Base & { kind: "refs" };

export type Slide =
  | CoverSlide
  | CaseSlide
  | CardsSlide
  | TilesSlide
  | LadderSlide
  | OrgSlide
  | ListSlide
  | VersusSlide
  | TimelineSlide
  | TiersSlide
  | MoneySlide
  | TableSlide
  | CompareSlide
  | LessonsSlide
  | RefsSlide;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export const mark = (w: string) =>
  `<em class='mark'>${w}<svg class='scr' viewBox='0 0 200 20' preserveAspectRatio='none' aria-hidden='true'><path d='M3 13 C 40 5, 90 17, 130 10 S 185 6, 197 12'/></svg></em>`;

export const NO_INFO = "Баталгаатай мэдээлэл олдоогүй";

export const GROUPS = [
  {
    code: "",
    name: "Танилцуулга",
    steps: ["Нүүр", "Бодит сургамж"],
  },
  {
    code: "KR",
    name: "Өмнөд Солонгос",
    steps: ["Холбоо", "Чиг үүрэг", "Баримт бичиг", "Зарчим", "Хариуцлага"],
  },
  {
    code: "FR",
    name: "Франц",
    steps: [
      "Холбоо",
      "Чиг үүрэг",
      "Charte ISR",
      "Хариуцлага",
      "UNAFIC ба IESF",
    ],
  },
  {
    code: "CA",
    name: "Канад",
    steps: ["Холбоо", "Засаглал", "Ёс зүйн дүрэм", "Хариуцлага"],
  },
  {
    code: "",
    name: "Дүгнэлт",
    steps: ["Харьцуулалт", "Ижил ба ялгаа", "Сургамж", "Эх сурвалж"],
  },
];

export const COUNTRIES = [
  {
    code: "KR",
    name: "Өмнөд Солонгос",
    org: "KIChE · KSIEC",
    year: "1962",
    icon: FlaskConical,
    img: "/images/korea.jpg",
  },
  {
    code: "FR",
    name: "Франц",
    org: "UNAFIC · IESF",
    year: "1910",
    icon: BookOpen,
    img: "/images/france-chimie.jpg",
  },
  {
    code: "CA",
    name: "Канад",
    org: "Engineers Canada · муж",
    year: "1936",
    icon: Landmark,
    img: "/images/canada-parliament.jpg",
  },
];

/* ------------------------------------------------------------------ */
/* Slides                                                              */
/* ------------------------------------------------------------------ */

export const slides: Slide[] = [
  /* ============ ТАНИЛЦУУЛГА ============ */
  {
    kind: "cover",
    group: 0,
    name: "Нүүр",
    tag: "Химийн инженерийн ёс зүй · Харьцуулсан судалгаа",
    title: `Мэргэжлийн ёс зүй ба ${mark("хариуцлага")}`,
    sub: "Өмнөд Солонгос, Франц, Канад улсын мэргэжлийн холбоо, ёс зүйн дүрмийн харьцуулсан судалгаа",
  },
  {
    kind: "case",
    group: 0,
    step: 1,
    name: "Бодит сургамж",
    tag: "Аюулгүй байдал ба хүний амь нас",
    title: `Инженерийн алдаа ${mark("хүний аминд")} хүрдэг`,
    sub: "Бхопалын осол химийн инженерчлэлд ёс зүй яагаад чухал болохыг харуулсан бодит жишээ.",
    stats: [
      {
        icon: Wind,
        num: "~45 тн",
        label: "метилизоцианатын хий алдагдсан [13]",
      },
      {
        icon: Skull,
        num: "3,787",
        label: "нас баралтыг Засгийн газар баталсан [14]",
      },
      {
        icon: Gavel,
        num: "2010",
        label: "удирдлагыг болгоомжгүй байдлаар шийтгэсэн [13]",
      },
    ],
    facts: [
      {
        icon: CalendarDays,
        bold: "1984.12.03:",
        text: "Union Carbide-ийн Энэтхэгийн охин компанийн үйлдвэр [13]",
      },
      {
        icon: TrendingUp,
        text: "Бусад тооцоогоор нас баралт хавьгүй өндөр [14]",
      },
      {
        icon: ShieldAlert,
        bold: "Дүн шинжилгээ:",
        text: "Аюулгүй байдлыг ашгаас дээгүүр тавих нь инженерийн үүрэг.",
      },
    ],
    photo: {
      src: "/images/bhopal.jpg",
      alt: "Бхопалын химийн үйлдвэрийн гамшиг",
      badge: "BHOPAL · 1984",
      credit: " ",
    },
  },

  /* ============ ӨМНӨД СОЛОНГОС ============ */
  {
    kind: "case",
    group: 1,
    step: 0,
    name: "Өмнөд Солонгос",
    tag: "KIChE · Химийн инженерчлэлийн холбоо",
    title: `Солонгосын ${mark("KIChE")} нийгэмлэг`,
    sub: "The Korean Institute of Chemical Engineers — БНСУ-ын химийн инженерчлэлийн мэргэжлийн нийгэмлэг.",
    stats: [
      {
        icon: Landmark,
        num: "1962",
        label: "12 дугаар сарын 8-нд байгуулагдсан [1]",
      },
      { icon: Users, num: "6000+", label: "гишүүнтэй [1]" },
    ],
    facts: [],
    photo: {
      src: "/images/korea.jpg",
      alt: "Сөүл хотын шөнийн дүр төрх",
      badge: "SOUTH KOREA · KIChE · 1962",
      credit: " ",
    },
  },
  {
    kind: "cards",
    group: 1,
    step: 1,
    name: "KIChE чиг үүрэг",
    tag: "KIChE · Чиг үүрэг",
    title: `Тус нийгэмлэг ${mark("юу хийдэг")} вэ?`,
    sub: "Судалгаа, мэргэшүүлэлт, олон улсын хамтын ажиллагаагаар салбарыг дэмждэг.",
    cards: [
      {
        icon: FlaskConical,
        title: "Судалгаа, инновац",
        pill: "СУДАЛГАА",
        desc: "Судалгааны шинэ үр дүнг үйлдвэрлэлд нэвтрүүлж, инновацыг дэмждэг [1].",
      },
      {
        icon: GraduationCap,
        title: "Инженерүүдийг мэргэшүүлэх",
        pill: "МЭРГЭШИЛ",
        desc: "Инженерүүдийн мэдлэг, чадварыг дээшлүүлнэ [1].",
        tone: "ink",
      },
      {
        icon: Globe,
        title: "Олон улсын хамтын ажиллагаа",
        pill: "ОЛОН УЛС",
        desc: "БНСУ-ын химийн инженерчлэлийн салбарын хөгжилд хувь нэмэр оруулдаг [1].",
      },
    ],
  },
  {
    kind: "cards",
    group: 1,
    step: 2,
    name: "Ёс зүйн баримтууд",
    tag: "Ёс зүйн дүрэм",
    title: `Ёс зүйн ${mark("хоёр баримт")} бичиг`,
    cards: [
      {
        icon: BookOpen,
        title: "KIChE (한국화학공학회)",
        pill: "2008.09.11",
        desc: "Эрдэм шинжилгээний сэтгүүл хэвлэлийн ёс зүйн удирдамж [1].",
        extra: "2009, 2010, 2016, 2017, 2020 онд шинэчилсэн",
      },
      {
        icon: FileText,
        title: "KSIEC (한국공업화학회)",
        pill: "2007.10.08",
        desc: "Судалгааны ёс зүйн тунхаг [12].",
        tone: "ink",
      },
    ],
    note: {
      icon: TriangleAlert,
      text: "Хоёулаа судалгаа, хэвлэлийн ёс зүйтэй холбоотой баримт; инженерийн лицензийн ёс зүй биш [1][12]",
    },
  },
  {
    kind: "tiles",
    group: 1,
    step: 3,
    name: "Ёс зүйн зарчим",
    tag: "Үндсэн зарчим",
    title: `Ёс зүйн дүрмийн ${mark("6 зарчим")}`,
    sub: "Хоёр нийгэмлэгийн ёс зүйн баримтад тусгагдсан зарчмууд [1][12].",
    tiles: [
      { icon: UserCheck, text: "Мэргэжлийн хариуцлага" },
      { icon: Lock, text: "Нууц хадгалах" },
      { icon: Scale, text: "Шударга байдал" },
      { icon: Lightbulb, text: "Оюуны өмчийг хүндэтгэх" },
      { icon: ClipboardCheck, text: "Шударга үнэлгээ" },
      { icon: Leaf, text: "Байгаль орчны хамгаалал" },
    ],
  },
  {
    kind: "ladder",
    group: 1,
    step: 4,
    name: "Хариуцлагын төрөл",
    tag: "Хариуцлага ба сахилга",
    title: `Хүлээлгэх ${mark("хариуцлагын төрлүүд")}`,
    sub: "Эдгээр нь нийгэмлэгийн гишүүн, зохиогчид хамаарах арга хэмжээ [1][12].",
    rows: [
      { icon: TriangleAlert, text: "Анхааруулга" },
      { icon: Ban, text: "Өгүүлэл нийтлэхийг хориглох" },
      { icon: Undo2, text: "Өгүүлэл буцаан татах" },
      { icon: UserX, text: "Гишүүнчлэл түдгэлзүүлэх" },
    ],
    side: {
      label: "Мэргэжлийн инженерийн ёс зүйн хариуцлага",
      text: NO_INFO,
    },
  },

  /* ============ ФРАНЦ ============ */
  {
    kind: "org",
    group: 2,
    step: 0,
    name: "Франц: UNAFIC",
    tag: "Химийн инженерийн холбоо",
    title: `UNAFIC холбоо ба ${mark("Удирдах зөвлөл")}`,
    sub: "Францын химийн инженерүүдийн холбоодын үндэсний нэгдэл.",
    year: "1910",
    yearText:
      "Химийн дээд сургуулиудын төгсөгчдийн холбоодыг нэгтгэсэн үндэсний нэгдэл [2]",
    root: "UNAFIC",
    nodes: [
      {
        icon: Users,
        title: "Холбооны зөвлөл (Conseil Fédéral)",
        pill: "САР БҮР",
        desc: "Бодлого чиглэлийг тодорхойлж, Удирдах багийн үйл ажиллагаанд хяналт тавина [2].",
      },
      {
        icon: User,
        title: "Удирдах баг (Bureau)",
        pill: "2 ЖИЛ",
        desc: "Ерөнхийлөгч тэргүүтэй, өдөр тутмын удирдлагыг хэрэгжүүлнэ [2].",
        tone: "ink",
      },
    ],
  },
  {
    kind: "list",
    group: 2,
    step: 1,
    name: "Франц: Чиг үүрэг",
    tag: "Төлөөлөл ба карьер",
    title: `Химийн инженерүүдийг ${mark("төлөөлөх")} чиг үүрэг`,
    sub: "UNAFIC нь инженерүүдийн эрх ашиг, карьер, боловсролыг дэмждэг.",
    items: [
      {
        icon: Megaphone,
        bold: "Мэргэжлийн төлөөлөл",
        text: "Франц болон олон улсад химийн инженерүүдийн ашиг сонирхлыг төлөөлнө [2]",
      },
      {
        icon: Briefcase,
        bold: "Ажил эрхлэлт",
        text: "Хөдөлмөр эрхлэлт, цалин хөлсний судалгаа нийтэлж мэдээллээр хангана [2]",
      },
      {
        icon: GraduationCap,
        bold: "Оюутан, залуу мэргэжилтэн",
        text: "Үзэсгэлэн, форум зохион байгуулж, карьерын сүлжээ үүсгэнэ [2]",
      },
    ],
    photo: {
      src: "/images/france-chimie.jpg",
      alt: "Maison de la Chimie, Парис хот",
      badge: "MAISON DE LA CHIMIE · PARIS",
      credit: " ",
    },
  },
  {
    kind: "cards",
    group: 2,
    step: 2,
    name: "Charte ISR",
    tag: "Ёс зүйн үндсэн зарчим",
    title: `Хариуцлагатай инженерийн ${mark("дүрэм")} (Charte ISR)`,
    sub: "IESF 2001 онд Ёс зүйн дүрмээ баталсан; 2020 оны сүүлээс шинэчилж Charte ISR болгосон [6][3]. ISR = Ingénieur et Scientifique Responsables.",
    cards: [
      {
        icon: User,
        title: "Хувь хүн",
        pill: "01",
        desc: "Инженер, эрдэмтэн хувь хүнийхээ хувиар хүлээх үүрэг [3].",
        extra: "Оюун ухаан, ухамсартай мэргэжилтэн; мэргэжлээ сурталчилна",
      },
      {
        icon: Users,
        title: "Хамт олон",
        pill: "02",
        desc: "Ажлын хамт олны гишүүний хувиар хүлээх үүрэг [3].",
        extra:
          "Захиалагчид эрсдэл, хязгаарлалтыг мэдээлж, хамт олныхоо ур чадварыг дэмжинэ",
        tone: "ink",
      },
      {
        icon: Globe,
        title: "Нийгэм",
        pill: "03",
        desc: "Нийгмийн гишүүн, иргэний хувиар хүлээх үүрэг [3].",
        extra:
          "Шинжлэх ухаан, технологи, нийгмийн холбоог хариуцлагатай хангана",
      },
    ],
  },
  {
    kind: "cards",
    group: 2,
    step: 3,
    name: "Францын хариуцлага",
    tag: "Дүрмийн статус ба хууль",
    title: `Charte ISR ба ${mark("хуулийн")} хариуцлага`,
    sub: "Charte нь сахилгын код биш, хуулийн хариуцлага Эрүүгийн хуулиар тодорхойлогдоно.",
    cards: [
      {
        icon: BookOpen,
        title: "Ёс зүйн дүрэм",
        pill: "САЙН ДУРЫН",
        desc: "Charte нь сахилга шийтгэлийн код биш, мэргэжлийн итгэл үнэмшлийг илэрхийлдэг [6].",
        extra: "Өмнөх code de déontologie-г солисон",
      },
      {
        icon: Gavel,
        title: "Эрүүгийн хууль 121-3",
        pill: "ХУУЛЬ",
        desc: "Болгоомжгүй байдал ямар нөхцөлд гэмт хэрэг болохыг тодорхойлдог [5].",
        extra: "Тодорхой ялыг бусад зүйл тогтооно",
        tone: "ink",
      },
      {
        icon: CircleHelp,
        title: "Сахилгын тогтолцоо",
        pill: "ТОДОРХОЙГҮЙ, НУУЦЛАЛТАЙ БАЙЖ МАГАДГҮЙ",
        desc: `${NO_INFO}.`,
        tone: "warn",
      },
    ],
  },
  {
    kind: "versus",
    group: 2,
    step: 4,
    name: "UNAFIC ба IESF",
    tag: "Байгууллагын харьцуулалт",
    title: `UNAFIC болон IESF-ийн ${mark("харилцан нөхөх")} үүрэг`,
    sub: "Химийн инженерийн дагнасан холбоо ба бүх салбарын нэгдлийн ялгаа.",
    a: {
      icon: FlaskConical,
      title: "UNAFIC",
      pill: "ХИМИЙН ИНЖЕНЕР",
      desc: "Химийн холбоо",
      extra:
        "Химийн инженерийн сургуулиудын төгсөгчдийг нэгтгэж, мэргэжлийн төлөөлөл, карьер, ажил эрхлэлтэд төвлөрнө [2]",
    },
    b: {
      icon: Network,
      title: "IESF",
      pill: "БҮХ ИНЖЕНЕР",
      desc: "Үндэсний нэгдэл",
      extra:
        "Бүх салбарын инженерийг хамарсан; ёс зүйн дүрэм Charte ISR-ийг боловсруулдаг [3]",
      tone: "ink",
    },
    note: "Дүн шинжилгээ: UNAFIC холбоодыг уялдуулж, IESF ёс зүйн суурь зарчмыг тодорхойлно.",
  },

  /* ============ КАНАД ============ */
  {
    kind: "timeline",
    group: 3,
    step: 0,
    name: "Канад: Холбоо",
    tag: "Мэргэжлийн холбоо",
    title: `Engineers Canada ба ${mark("мужийн")} зохицуулагчид`,
    sub: "Үндэсний холбоо нь мужуудын зохицуулагчдын нэгдэл; лиценз олгох ажлыг мужууд хийдэг.",
    events: [
      {
        year: "1920",
        title: "Эхний 6 зохицуулагч",
        desc: "BC, Alberta, Manitoba, New Brunswick, Nova Scotia, Quebec [15]",
      },
      {
        year: "1936",
        title: "Үндэсний зөвлөл",
        desc: "Dominion Council of Professional Engineers; хууль тогтоомжийг уялдуулах зорилготой [15][7]",
      },
      { year: "1959", title: "CCPE", desc: "Нэрээ CCPE болгосон [7]" },
      {
        year: "2007",
        title: "Engineers Canada",
        desc: "Одоогийн нэрээ авсан [7]",
      },
    ],
    facts: [
      {
        icon: Users,
        bold: "Гишүүд:",
        text: "12 муж, нутгийн инженерийн зохицуулагч [7]",
      },
      {
        icon: Award,
        bold: "Лиценз:",
        text: "Мужийн зохицуулагч (жишээ нь PEO) инженерийг лицензжүүлдэг [8]",
      },
    ],
  },
  {
    kind: "tiers",
    group: 3,
    step: 1,
    name: "Канад: Засаглал",
    tag: "Үндэсний ба мужийн түвшин",
    title: `Хоёр түвшний ${mark("засаглал")}`,
    sub: "Үндэсний холбоо удирдамж гаргана; мужийн зохицуулагч хууль, лиценз, сахилгыг хэрэгжүүлнэ.",
    facts: [
      {
        icon: FileText,
        bold: "Удирдамж:",
        text: "Canadian Engineering Qualifications Board боловсруулж, Engineers Canada-гийн ТУЗ батална [16]",
      },
      {
        icon: School,
        bold: "Магадлан итгэмжлэл:",
        text: "Хөтөлбөрийг CEAB мужуудын нэрийн өмнөөс магадлана [7]",
      },
      {
        icon: CircleHelp,
        bold: "ТУЗ-д олон нийтийн төлөөлөл:",
        text: NO_INFO,
        muted: true,
      },
    ],
    tiers: [
      {
        icon: Landmark,
        title: "Engineers Canada",
        pill: "ҮНДЭСНИЙ · ЗОХИЦУУЛАЛТ",
        desc: "Удирдамж, магадлан итгэмжлэл, олон улсын хөдөлгөөн, мужуудын хамтын ажиллагаа [7]",
        tone: "ink",
      },
      {
        icon: Building2,
        title: "PEO, EGBC гэх мэт",
        pill: "МУЖИЙН · ХУУЛЬ",
        desc: "Лиценз олгох, ёс зүйн дүрэм мөрдүүлэх, сахилгын хэрэг хянах [8][9]",
        tone: "accent",
      },
    ],
  },
  {
    kind: "list",
    group: 3,
    step: 2,
    name: "Канадын ёс зүй",
    tag: "Ёс зүйн дүрэм",
    title: `Hold paramount ${mark("зарчим")}`,
    sub: "Нийтийн аюулгүй байдал, эрүүл мэнд, байгаль орчныг хамгаалах нь бусад бүх үүргээс дээгүүр [4][17].",
    items: [
      {
        icon: ShieldCheck,
        text: "Нийтийн аюулгүй байдал, байгаль орчин",
        sub: "Paramount: аюулгүй байдал эрсдэлд орвол бусад заалт доогуур орно [17]",
      },
      { icon: Award, text: "Ур чадварын хүрээнд ажиллах" },
      { icon: Lock, text: "Ажил олгогчийн итгэмжит төлөөлөгч, нууц хадгалах" },
      { icon: Scale, text: "Ашиг сонирхлын зөрчлийг мэдэгдэх" },
      { icon: TrendingUp, text: "Инженерийн нэр хүндийг дээшлүүлэх" },
    ],
    foot: "Хувилбар: 2016 оны 3-р сарын Public Guideline; 2024 оны 7-р сард шинэчилсэн [17][4]",
    photo: {
      src: "/images/canada-iron-ring.jpg",
      alt: "Канадын инженерийн Iron Ring бөгж",
      badge: "IRON RING · ИНЖЕНЕРИЙН ҮҮРЭГ",
      credit: " ",
    },
  },
  {
    kind: "money",
    group: 3,
    step: 3,
    name: "Канад: Хариуцлага",
    tag: "Заавал ба сайн дурын, санкц",
    title: `Хуулийн ${mark("хүч")} ба санкц`,
    sub: "Үндэсний удирдамж зөвлөмж шинжтэй; заавал дагах дүрэм мужийн хуульд байдаг.",
    facts: [
      {
        icon: FileText,
        bold: "Үндэсний удирдамж:",
        text: "Сайн дурын; инженер түүнд шууд хариуцлага хүлээдэггүй [16]",
      },
      {
        icon: Gavel,
        bold: "Мужийн код:",
        text: "Ontario-д Professional Engineers Act-д; BC-д EGBC Bylaws-ийн Schedule A [8][9]",
      },
      {
        icon: Megaphone,
        bold: "Мэдээлэх үүрэг:",
        text: "Заавал ба сайн дурын мэдээлэл гэж ялгадаг; муж бүрийн хуулиас хамаарна [11]",
      },
    ],
    panelLabel: "Лиценз түдгэлзүүлэх, цуцлах · дээд торгууль",
    figures: [
      { num: "$100,000", label: "BC · хувь хүнд [9][10]" },
      { num: "$250,000", label: "BC · фирмд [9][10]" },
      { num: "$15,000", label: "Саскачеван · одоогийн, APEGS [18]" },
      { num: "$25,000", label: "Mount Polley · хуучин хуулиар [10]" },
    ],
  },

  /* ============ ДҮГНЭЛТ ============ */
  {
    kind: "table",
    group: 4,
    step: 0,
    name: "Нэгдсэн харьцуулалт",
    tag: "Харьцуулсан судалгаа",
    title: `Гурван улсын тогтолцооны ${mark("харьцуулалт")}`,
    sub: "Бүтэц, дүрмийн статус, санкц, эрсдэл мэдээлэх үүргийг нэгтгэв.",
  },
  {
    kind: "compare",
    group: 4,
    step: 1,
    name: "Ижил ба ялгаатай",
    tag: "Дүн шинжилгээ",
    title: `Ижил төстэй тал ба ${mark("онцлог ялгаа")}`,
    sub: "Дүн шинжилгээ: гурван улс нийтийн ашиг сонирхлыг дээдэлдэг ч хэрэгжүүлэх механизм нь өөр.",
    countries: [
      {
        code: "KR",
        name: "БНСУ",
        pill: "НИЙГЭМЛЭГ",
        desc: "Судалгаа, хэвлэлийн ёс зүйн баримт; арга хэмжээ гишүүн, зохиогчид хамаарна [1][12]",
      },
      {
        code: "FR",
        name: "Франц",
        pill: "ХОЛБОО + ХУУЛЬ",
        desc: "Сайн дурын Charte ISR; хуулийн хариуцлага Эрүүгийн хуулиар [6][5]",
      },
      {
        code: "CA",
        name: "Канад",
        pill: "МУЖИЙН ХУУЛЬ",
        desc: "Мужийн хуулиар заавал дүрэм, лицензийн сахилга [8][9]",
      },
    ],
    points: [
      {
        icon: Link2,
        bold: "Ижил тал",
        text: "Мэргэжлийн хариуцлага, байгаль орчны хамгаалал, ур чадварыг бүгд тусгасан [1][3][4]",
      },
      {
        icon: Scale,
        bold: "Статусын ялгаа",
        text: "Канадад мужийн код заавал; Францад Charte сайн дурын [8][6]",
      },
      {
        icon: Award,
        bold: "Тогтолцооны ялгаа",
        text: `Канадад зохицуулагч лиценз олгоно; Солонгос, Францын лицензийн мэдээлэл: ${NO_INFO} [8]`,
      },
    ],
  },
  {
    kind: "lessons",
    group: 4,
    step: 2,
    name: "Монголд өгөх сургамж",
    tag: "Дүн шинжилгээ · Бодлогын санал",
    title: `Монголд авах ${mark("3 сургамж")}`,
    sub: "Дүн шинжилгээ: энэ нь мaнaй багийн зүгээс гаргасан санал, баримт биш.",
    items: [
      {
        bold: "Дүрмийн статусыг хуульчлах",
        text: "Ёс зүйн дүрмийг хуулийн хүрээнд тусгах (Канадын мужийн загвар) [8]",
      },
      {
        bold: "Эрсдэл мэдээлэх удирдамж",
        text: "Заавал ба сайн дурын мэдээллийн нөхцөлийг тодорхойлох (Канадын Duty to report) [11]",
      },
      {
        bold: "Нийгмийн хариуцлага",
        text: "Нийгэм, байгаль орчны хариуцлагыг дүрэмд тусгах (Франц Charte ISR) [3]",
      },
    ],
    actors: [
      {
        icon: Users,
        title: "Мэргэжлийн холбоо",
        desc: "Ёс зүйн дүрэм батлах, сахилгын журам боловсруулах.",
      },
      {
        icon: Landmark,
        title: "Төр, хууль тогтоогч",
        desc: "Дүрмийн заавал биелэх статусыг хуульд тусгах.",
      },
      {
        icon: GraduationCap,
        title: "Их сургууль, ажил олгогч",
        desc: "Ёс зүйн сургалт, эрсдэл мэдээлэх соёлыг төлөвшүүлэх.",
      },
    ],
  },
  {
    kind: "refs",
    group: 4,
    step: 3,
    name: "Эх сурвалжууд",
    tag: "Албан ёсны эх баримтууд",
    title: `Ашигласан ${mark("эх сурвалжууд")}`,
    sub: "Слайд дээр ишлэгдсэн бүх эх сурвалж.",
  },
];

/* ------------------------------------------------------------------ */
/* Хүснэгт ба эх сурвалж                                               */
/* ------------------------------------------------------------------ */

export const tableHead = [
  "Үзүүлэлт",
  "БНСУ",
  "Франц (UNAFIC / IESF)",
  "Канад (Engineers Canada / муж)",
];

export const tableRows: string[][] = [
  [
    "Үндэсний байгууллага",
    "KIChE (1962) [1]",
    "UNAFIC (1910) / IESF [2][3]",
    "Engineers Canada (1936) [7]",
  ],
  [
    "Статус",
    "Мэргэжлийн нийгэмлэг [1]",
    "Төгсөгчдийн холбоодын нэгдэл [2]",
    "Мужийн зохицуулагчдын нэгдэл [7]",
  ],
  [
    "Лиценз олгох эрх",
    NO_INFO,
    NO_INFO,
    "Мужийн зохицуулагч (жишээ нь PEO) [8]",
  ],
  [
    "Ёс зүйн дүрэм",
    "Судалгаа, хэвлэлийн ёс зүй [1][12]",
    "Charte (2001), Charte ISR (2020-оос) [6][3]",
    "Үндэсний удирдамж (2016, 2024) ба мужийн код [4][17]",
  ],
  [
    "Заавал эсэх",
    "Нийгэмлэгийн дотоод баримт [1][12]",
    "Сайн дурын [6]",
    "Мужийн код заавал; үндэсний удирдамж сайн дурын [8][16]",
  ],
  [
    "Санкц",
    "Анхааруулга ... гишүүнчлэл түдгэлзүүлэх [1][12]",
    `Эрүүгийн хууль 121-3 [5]; сахилгын систем: ${NO_INFO}`,
    "Лиценз түдгэлзүүлэх, цуцлах, торгууль (BC: $100,000 хүртэл) [9]",
  ],
  [
    "Эрсдэл мэдээлэх",
    NO_INFO,
    "Захиалагчид эрсдэл мэдээлэх зарчим [3]",
    "Duty to report: заавал ба сайн дурын [11]",
  ],
];

export const referencesList = [
  {
    id: "[1]",
    title:
      "KIChE — Korean Institute of Chemical Engineers (албан ёсны сайт, нүүр хуудас)",
    url: "https://www.kiche.or.kr",
  },
  {
    id: "[2]",
    title: "UNAFIC — Дүрэм (statuts), зорилго, удирдлагын бүтэц",
    url: "https://www.unafic.org/unafic/statuts/",
  },
  {
    id: "[3]",
    title: "IESF — Charte ISR ба Lexique",
    url: "https://www.iesf.fr/offres/doc_inline_src/752/IESF%2BCharte%2BISR%2Blexique%2BV6.2.pdf",
  },
  {
    id: "[4]",
    title: "Engineers Canada — Guideline on the code of ethics (2024)",
    url: "https://engineerscanada.ca/sites/default/files/2024-07/Guideline_on_the_code_of_ethics-2024.pdf",
  },
  {
    id: "[5]",
    title: "Францын Эрүүгийн хууль (Code pénal) — 121-3 дугаар зүйл",
    url: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006417208/",
  },
  {
    id: "[6]",
    title: "IESF/CNISF — Charte d'Éthique de l'Ingénieur (2001)",
    url: "https://wwwine.polytech.umontpellier.fr/images/ecole/ddrs/Charte-ethique-ing%C3%A9nieur.pdf",
  },
  {
    id: "[7]",
    title: "Engineers Canada — Realizing tomorrow's (түүх, гишүүд, чиг үүрэг)",
    url: "https://engineerscanada.ca/about/governance/realizing-tomorrows",
  },
  {
    id: "[8]",
    title: "Professional Engineers Ontario (PEO) — Code of Ethics",
    url: "https://peo.on.ca/licence-holders/code-ethics",
  },
  {
    id: "[9]",
    title: "Engineers and Geoscientists BC — Complaints and discipline",
    url: "https://www.egbc.ca/For-Members/Complaints",
  },
  {
    id: "[10]",
    title: "EGBC — Mount Polley: Three Engineers Disciplined",
    url: "https://egbc.ca/News/News-Releases/Mount-Polley-Investigation-Concludes-Three-Enginee",
  },
  {
    id: "[11]",
    title: "Engineers Canada — Guideline on the duty to report (2024)",
    url: "https://engineerscanada.ca/sites/default/files/2024-07/Guideline_on_duty_to_report-2024.pdf",
  },
  {
    id: "[12]",
    title: "KSIEC — Korean Society of Industrial and Engineering Chemistry",
    url: "https://www.ksiec.or.kr",
  },
  {
    id: "[13]",
    title: "Encyclopaedia Britannica — Bhopal disaster",
    url: "https://www.britannica.com/EBchecked/topic/1257131/Bhopal-disaster",
  },
  {
    id: "[14]",
    title: "Wikipedia — Bhopal disaster (хоёрдогч эх сурвалж)",
    url: "https://wikipedia.com/wiki/Bhopal_tragedy",
  },
  {
    id: "[15]",
    title: "Engineers Canada — Six regulators celebrate centennials in 2020",
    url: "https://engineerscanada.ca/news-and-events/news/six-regulators-celebrate-centennials-in-2020",
  },
  {
    id: "[16]",
    title: "Engineers Canada — Ethics and engineering",
    url: "https://engineerscanada.ca/news-and-events/news/ethics-and-engineering",
  },
  {
    id: "[17]",
    title: "Engineers Canada — Public guideline on the code of ethics (2016)",
    url: "https://engineerscanada.ca/publications/public-guideline-on-the-code-of-ethics",
  },
  {
    id: "[18]",
    title: "APEGS (Saskatchewan) — Act review: overview and proposed changes",
    url: "https://www.apegs.ca/assets/the-engineering-and-geoscience-professions-act-review-overview-and-proposed-changes.pdf",
  },
];
