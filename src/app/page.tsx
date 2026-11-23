"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { initHourglass, SlideState } from "./hourglass";

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
  layout?:
    | "cover"
    | "photo"
    | "metrics"
    | "france-gov"
    | "france-pillars"
    | "france-sanctions"
    | "france-vs-iesf"
    | "table"
    | "analysis"
    | "refs";
  imageSrc?: string;
  imageAlt?: string;
  imageBadge?: string;
  imageSource?: string;
}

// Давтагдаж байсан гарчгийн доогуурлалтыг нэг функц болгов
const mark = (word: string) =>
  `<em class='mark'>${word}<svg class='scr' viewBox='0 0 200 20' preserveAspectRatio='none' aria-hidden='true'><path d='M3 13 C 40 5, 90 17, 130 10 S 185 6, 197 12'/></svg></em>`;

const slides: SlideData[] = [
  // 1. Cover
  {
    name: "Нүүр",
    tag: "Химийн инженерийн ёс зүй · Харьцуулсан судалгаа",
    titleHtml: `Мэргэжлийн ёс зүй ба ${mark("хариуцлага")}`,
    sub: "Өмнөд Солонгос, Франц, Канад улсуудын хууль эрх зүй, дүрмийн харьцуулсан судалгаа",
    layout: "cover",
    imageSrc: "/images/chemical-plant.jpg",
    imageAlt: "Химийн үйлдвэрийн цогцолбор",
    imageBadge: "АЖ ҮЙЛДВЭРИЙН ХАРИУЦЛАГА",
    imageSource: "Wikimedia Commons · Public Domain",
  },

  // 2. Ач холбогдол
  {
    name: "Бодит сургамж",
    tag: "Аюулгүй байдал хүний амь нас",
    titleHtml: `Инженерийн алдаа ${mark("хүний аминд")} хүрдэг`,
    sub: "1984 оны Бхопалын гамшиг нь химийн инженерийн ёс зүйн бодит үнэ цэнийг харуулсан гашуун сургамж юм.",
    points: [
      {
        bold: "1984 Бхопалын осол:",
        text: "Хорт хий алдагдан 3,500+ хүн амиа алдаж, хагас сая хүн хохирсон",
        ref: "[12]",
      },
      {
        bold: "Аюулгүй байдал нэгдүгээрт:",
        text: "Үйлдвэрийн ашиг орлогоос хүний амь нас ямагт дээгүүрт эрэмбэлэгдэнэ.",
      },
      {
        bold: "Эрсдэлийг мэдээлэх үүрэг:",
        text: "Инженер техникийн доголдол, болзошгүй эрсдэлийг нуун дарагдуулах эрхгүй.",
      },
    ],
    layout: "photo",
    imageSrc: "/images/bhopal.jpg",
    imageAlt: "Бхопалын химийн үйлдвэрийн гамшиг",
    imageBadge: "BHOPAL · 1984",
    imageSource: "Bhopal disaster site · Wikimedia Commons [12]",
  },

  // 3. Арга зүй
  {
    name: "Арга зүй",
    tag: "Судалгааны үндэслэл",
    titleHtml: `Анхдагч хууль тогтоомжид ${mark("суурилсан")} шинжилгээ`,
    sub: "Зөвхөн тухайн улсын албан ёсны хууль тогтоомж, мэргэжлийн танхим, хороодын баталсан дүрмийг ашиглав.",
    points: [
      {
        bold: "Анхдагч хууль тогтоомж:",
        text: "БНСУ, Франц, Канад 3 улсын албан ёсны хуулиудыг харьцуулав",
        ref: "[1-4]",
      },
      {
        bold: "Засаглал ба ТУЗ:",
        text: "Удирдах зөвлөлийн бүтэц, сонгууль, шийдвэр гаргалтыг нарийвчлан шинжлэв.",
      },
      {
        bold: "100% бодит эх сурвалж:",
        text: "Зохиомол тоо баримтгүй, заалт бүрийг баталгаат эх сурвалжтай уяв",
        ref: "[1-15]",
      },
    ],
    layout: "metrics",
  },

  // 4. БНСУ: Холбоо ба Хууль
  {
    name: "Өмнөд Солонгос",
    tag: "БНСУ · Холбоо ба Эрх зүй",
    titleHtml: `Төрийн яамны ${mark("хатуу хяналттай")} тогтолцоо`,
    sub: "БНСУ-д инженерийн мэргэжил нь төрийн тусгай хуулиар зохицуулагддаг хатуу сахилгатай.",
    points: [
      {
        bold: "KPEA (한국기술사회) · 1965 он:",
        text: "Шинжлэх ухаан, МХХТ-ийн яамны (MSIT) хяналтад ажилладаг нэгдэл",
        ref: "[1]",
      },
      {
        bold: "Удирдах зөвлөлийн бүтэц:",
        text: "Сонгуульт ТУЗ нь төрийн техникийн бодлогод шууд зөвлөх үүрэгтэй.",
      },
      {
        bold: "Хуульчилсан үүрэг (Mandatory):",
        text: "'기술사법' (Мэргэжлийн инженерүүдийн хууль)-аар дүрмийг заавал мөрдүүлдэг",
        ref: "[1]",
      },
    ],
    layout: "photo",
    imageSrc: "/images/korea.jpg",
    imageAlt: "Сөүл хотын шөнийн дүр төрх",
    imageBadge: "SOUTH KOREA · KPEA / MSIT",
    imageSource: "Seoul Skyline · Wikimedia Commons [14]",
  },

  // 5. БНСУ: 6 зарчим ба Санкц
  {
    name: "Солонгосын ёс зүй",
    tag: "БНСУ · 6 зарчим ба Сахилга",
    titleHtml: `Нийтийн аюулгүй байдал ба ${mark("тамгалах хариуцлага")}`,
    sub: "Солонгосын мэргэшсэн инженер (기술사) төсөлд биечлэн тамга дарж хувийн хариуцлага хүлээнэ.",
    points: [
      {
        bold: "Нийтийн аюулгүй байдал:",
        text: "Хүн амын амь нас, эрүүл мэндийг хамгаалах нь үндсэн дээд зарчим",
        ref: "[1]",
      },
      {
        bold: "Биечлэн тамгалах үүрэг:",
        text: "Тооцоололд биечлэн тамга дарна; тамгаа бусдад шилжүүлэхийг хатуу хориглоно.",
      },
      {
        bold: "Хатуу шийтгэл (Лиценз цуцлах):",
        text: "Ноцтой зөрчилд мэргэжлийн лицензийг 1-3 жилээр хасах эсвэл бүрэн цуцална",
        ref: "[1]",
      },
    ],
    layout: "photo",
    imageSrc: "/images/chemical-plant.jpg",
    imageAlt: "Нефть-химийн үйлдвэрлэл",
    imageBadge: "БНСУ · ТАМГАЛАХ ҮҮРЭГ",
    imageSource: "Petrochemical facility · Wikimedia Commons",
  },

  // 6. Франц: UNAFIC холбоо ба Удирдах зөвлөл
  {
    name: "Франц: UNAFIC",
    tag: "Франц · Химийн инженерийн холбоо",
    titleHtml: `UNAFIC холбоо ба ${mark("Удирдах зөвлөл")}`,
    sub: "1910 онд байгуулагдсан Францын Химийн инженерүүдийн холбоонуудын үндэсний нэгдэл.",
    points: [
      {
        bold: "UNAFIC (1910 он):",
        text: "Химийн дээд сургуулиудын төгсөгчдийн холбоодыг нэгтгэсэн үндэсний нэгдэл",
        ref: "[2]",
      },
      {
        bold: "Холбооны зөвлөл (Conseil Fédéral):",
        text: "Сар бүр хуралдаж, бодлого чиглэл, Удирдах багийн хяналтыг хэрэгжүүлнэ",
        ref: "[2]",
      },
      {
        bold: "Удирдах баг (Bureau):",
        text: "Ерөнхийлөгч тэргүүтэй 2 жилийн хугацаатай өдөр тутмын удирдлага",
        ref: "[2]",
      },
    ],
    layout: "france-gov",
  },

  // 7. Франц: Чиг үүрэг & Ач холбогдол
  {
    name: "Франц: Чиг үүрэг",
    tag: "Франц · Төлөөлөл ба Карьер",
    titleHtml: `Химийн инженерүүдийг ${mark("төлөөлөх")} чиг үүрэг`,
    sub: "UNAFIC нь химийн инженерүүдийн эрх ашиг, карьер, боловсролыг тасралтгүй дэмждэг.",
    points: [
      {
        bold: "Мэргэжлийн төлөөлөл:",
        text: "Франц болон олон улсад химийн инженерүүдийн ашиг сонирхлыг төлөөлнө",
        ref: "[2]",
      },
      {
        bold: "Боловсрол & Ажил эрхлэлт:",
        text: "Хөдөлмөр эрхлэлт, цалин хөлсний судалгаа нийтэлж мэдээллээр хангана",
        ref: "[2]",
      },
      {
        bold: "Оюутан, залуу мэргэжилтнүүд:",
        text: "Мэргэжлийн үзэсгэлэн, форум зохион байгуулж, карьерын сүлжээг үүсгэдэг",
        ref: "[2]",
      },
    ],
    layout: "photo",
    imageSrc: "/images/france-chimie.jpg",
    imageAlt: "Maison de la Chimie, Парис хот",
    imageBadge: "MAISON DE LA CHIMIE · PARIS",
    imageSource: "Maison de la Chimie · Wikimedia Commons [15]",
  },

  // 8. Франц: Charte ISR (3 хүрээ)
  {
    name: "Charte ISR",
    tag: "Франц · Ёс зүйн үндсэн зарчим",
    titleHtml: `Хариуцлагатай инженерийн ${mark("дүрэм")} (Charte ISR)`,
    sub: "IESF-ээс 2001 онд баталж, 2020-2022 онд нийгэм, байгаль орчинд нийцүүлэн шинэчилсэн [3].",
    points: [
      {
        bold: "1. Хувь хүний хариуцлага:",
        text: "Шинжлэх ухааны баримтад тулгуурлах, алдаагаа хүлээн зөвшөөрөх, ур чадвар",
        ref: "[3]",
      },
      {
        bold: "2. Хамт олон, байгууллага:",
        text: "Эрсдэлийг үнэн зөв мэдээлэх, аюулгүй байдал, эрүүл мэндийг хангах",
        ref: "[3]",
      },
      {
        bold: "3. Нийгэм, байгаль орчин:",
        text: "Байгалийн нөөцийг зохистой ашиглаж, тогтвортой хөгжлийг дэмжих",
        ref: "[3]",
      },
    ],
    layout: "france-pillars",
  },

  // 9. Франц: Санкц & Эрүүгийн хуулийн 121-3
  {
    name: "Францын санкц",
    tag: "Франц · Санкц ба Хуулийн хариуцлага",
    titleHtml: `Санкц ба Эрүүгийн хуулийн ${mark("121-3 дугаар")} зүйл`,
    sub: "Charte ISR нь сахилгын код биш; хууль зөрчвөл Францын хууль тогтоомжоор шийтгэгдэнэ.",
    points: [
      {
        bold: "Байгууллагын дотоод хариуцлага:",
        text: "Хөдөлмөрийн хууль, дотоод журмын дагуу сануулга, арга хэмжээ авна",
        ref: "[2]",
      },
      {
        bold: "Иргэний эрх зүйн хариуцлага:",
        text: "Бусдад учруулсан хохирлыг нөхөн төлүүлэх үүрэг үүснэ",
        ref: "[2]",
      },
      {
        bold: "Эрүүгийн хууль (121-3 дугаар зүйл):",
        text: "Болгоомжгүй байдал, аюулгүй ажиллагааг зөрчсөнөөс хохирол учирвал эрүүгийн ял онооно",
        ref: "[5]",
      },
    ],
    layout: "france-sanctions",
  },

  // 10. Франц: UNAFIC vs IESF
  {
    name: "UNAFIC ба IESF",
    tag: "Франц · Байгууллагын харьцуулалт",
    titleHtml: `UNAFIC болон IESF-ийн ${mark("харилцан нөхөх")} үүрэг`,
    sub: "Химийн инженерийн дагнасан холбоо ба бүх салбарын нэгдлийн ялгаа.",
    points: [
      {
        bold: "UNAFIC-ийн чиглэл:",
        text: "Химийн инженерийн сургуулиудын төгсөгчдийг нэгтгэж, карьер, ажил эрхлэлтэд төвлөрдөг",
        ref: "[2]",
      },
      {
        bold: "IESF-ийн чиглэл:",
        text: "Бүх салбарын инженерүүдийн ёс зүй (Charte ISR), нийгмийн үүргийг чиглүүлдэг",
        ref: "[3]",
      },
      {
        bold: "Харилцан нөхөх үүрэг:",
        text: "UNAFIC нь холбоодыг уялдуулж, IESF нь ёс зүйн суурь зарчмыг тодорхойлдог.",
      },
    ],
    layout: "france-vs-iesf",
  },

  // 11. Канад: Холбоо ба Мужийн зохицуулалт
  {
    name: "Канад улс",
    tag: "Канад · Холбоо ба Эрх зүй",
    titleHtml: `Мужийн бие даасан ${mark("хуульчилсан")} засаглал`,
    sub: "Канадад инженерийн бүх эрх мужуудад харьяалагддаг бөгөөд үндэсний холбоо нь зөвлөмж өгдөг.",
    points: [
      {
        bold: "Engineers Canada (1936 он):",
        text: "12 мужийн хороодын үндэсний төлөөлөл; удирдамж нь сайн дурынх",
        ref: "[4]",
      },
      {
        bold: "Мужийн хүчирхэг эрх мэдэл:",
        text: "EGBC (BC), PEO (Ontario) нь тухайн мужийн хуулиар лиценз олгодог",
        ref: "[4][8]",
      },
      {
        bold: "Олон нийтийн төлөөлөлтэй ТУЗ:",
        text: "Удирдах зөвлөлд инженерүүдээс гадна олон нийтийн төлөөлөл заавал суудаг.",
      },
    ],
    layout: "photo",
    imageSrc: "/images/mount-polley.jpg",
    imageAlt: "Канадын уурхайн бүс",
    imageBadge: "CANADA · PROVINCIAL LAWS",
    imageSource: "NASA / USGS via Wikimedia Commons [11]",
  },

  // 12. Канад: Ёс зүй ба Санкц
  {
    name: "Канадын ёс зүй",
    tag: "Канад · Сахилга ба Санкц",
    titleHtml: `Hold Paramount зарчим ба ${mark("хатуу сахилга")}`,
    sub: "Канадын ёс зүйн дүрэм нь мужийн хуулиар заавал биелүүлэх үүрэгтэй бөгөөд өндөр торгуультай.",
    points: [
      {
        bold: "Hold Paramount зарчим:",
        text: "Хүний амь нас, байгаль орчныг хамгаалах нь туйлын хуульчилсан үүрэг",
        ref: "[4]",
      },
      {
        bold: "Duty to Report (Шүгэл үлээх):",
        text: "Аюултай зөрчлийг мэдээлээгүй бол инженер өөрөө хариуцлага хүлээнэ",
        ref: "[4]",
      },
      {
        bold: "Өндөр торгууль ($100,000):",
        text: "Мэргэжлийн эрхийг хасах, бүх насаар цуцлах шүүхийн эрхтэй",
        ref: "[4]",
      },
    ],
    layout: "photo",
    imageSrc: "/images/mount-polley-wetlands.jpg",
    imageAlt: "Байгаль орчныг сэргээн засварлалт",
    imageBadge: "CANADA · $100K PENALTY",
    imageSource: "Hazeltine remediation · Wikimedia Commons [11]",
  },

  // 13. Гурван улсын нэгдсэн харьцуулалт
  {
    name: "Нэгдсэн харьцуулалт",
    tag: "Харьцуулсан судалгаа",
    titleHtml: `Гурван улсын тогтолцооны ${mark("нэгдсэн харьцуулалт")}`,
    sub: "Бүтэц, хууль зүйн статус, сахилгын эрх мэдэл болон эрсдэл мэдээлэх үүргийг нэгтгэн харуулав.",
    layout: "table",
  },

  // 14. Ижил ба ялгаатай талууд
  {
    name: "Ижил ба ялгаатай",
    tag: "Дүн шинжилгээ",
    titleHtml: `Ижил төстэй тал ба ${mark("онцлог ялгаа")}`,
    sub: "Гурван улс нийтийн эрх ашгийг дээдэлдэг боловч хэрэгжүүлэх механизм нь өөр өөр юм.",
    points: [
      {
        bold: "Ижил төстэй тал:",
        text: "Нийтийн аюулгүй байдал, байгаль орчин, ур чадвараа хөгжүүлэхийг бүгд шаарддаг",
        ref: "[1-4]",
      },
      {
        bold: "Дүрмийн статусын ялгаа:",
        text: "Канад, Солонгост хуулиар заавал мөрддөг; Францад Charte ISR нь сайн дурынх",
        ref: "[1-3]",
      },
      {
        bold: "Санкцын тогтолцооны ялгаа:",
        text: "Канад, Солонгост лиценз цуцалдаг; Францад Эрүүгийн 121-3-аар шүүх шийтгэнэ",
        ref: "[5]",
      },
    ],
    layout: "analysis",
  },

  // 15. Монгол улсад өгөх зөвлөмж
  {
    name: "Монголд өгөх сургамж",
    tag: "Бодлогын зөвлөмж",
    titleHtml: `Монгол улсын химийн салбарт авах ${mark("3 сургамж")}`,
    sub: "Уул уурхай, хими, эрчим хүчний үйлдвэрүүд хөгжиж буй манай улсад дараах тогтолцоо чухал байна.",
    points: [
      {
        bold: "1. Ёс зүйг хуульчлах:",
        text: "Инженерийн ёс зүйг мэргэшсэн зэрэг, тамгатай шууд уях (Солонгос, Канад загвар)",
        ref: "[1][4]",
      },
      {
        bold: "2. Шүгэл үлээгчийг хамгаалах:",
        text: "Химийн хорт бодисын зөрчлийг илчилсэн инженерийг хуулиар хамгаалах (Франц загвар)",
        ref: "[2]",
      },
      {
        bold: "3. Тасралтгүй сургалт (CPD):",
        text: "Аюулгүй байдал, ёс зүйн мэдлэгийг 2-3 жил тутам шалгаж баталгаажуулдаг байх",
        ref: "[1][3]",
      },
    ],
    layout: "metrics",
  },

  // 16. Эх сурвалжууд
  {
    name: "Эх сурвалжууд",
    tag: "Албан ёсны эх баримтууд",
    titleHtml: `Баталгаат анхдагч ${mark("эх сурвалжууд")}`,
    sub: "UNAFIC дүрэм, IESF Charte ISR, Францын Эрүүгийн хууль 121-3, KPEA, EGBC зэрэг үндсэн холбоосууд.",
    layout: "refs",
  },
];

const referencesList = [
  {
    id: "[1]",
    title: "Korea Professional Engineers Act (기술사법) & KPEA Ethics Code",
    url: "https://www.law.go.kr",
  },
  {
    id: "[2]",
    title: "UNAFIC — Албан ёсны дүрэм, зорилго ба удирдлагын бүтэц",
    url: "https://www.unafic.org/unafic/statuts/",
  },
  {
    id: "[3]",
    title: "IESF — Charte ISR ёс зүйн дүрэм (2020-2022) & Lexique",
    url: "https://www.iesf.fr/offres/doc_inline_src/752/IESF%2BCharte%2BISR%2Blexique%2BV6.2.pdf",
  },
  {
    id: "[4]",
    title: "Engineers Canada — National Guideline on the Code of Ethics",
    url: "https://engineerscanada.ca",
  },
  {
    id: "[5]",
    title: "Францын Эрүүгийн хууль (Code pénal) — 121-3 дугаар зүйл",
    url: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006417208/",
  },
  {
    id: "[6]",
    title: "SFGP — Société Française de Génie des Procédés",
    url: "https://www.sfgp.asso.fr/",
  },
  {
    id: "[7]",
    title: "Commission des Titres d'Ingénieur (CTI) — Standards & Code",
    url: "https://www.cti-commission.fr",
  },
  {
    id: "[8]",
    title: "Professional Engineers Ontario (PEO) — O. Reg. 941 Code of Ethics",
    url: "https://www.peo.on.ca",
  },
  {
    id: "[9]",
    title: "Ordre des ingénieurs du Québec (OIQ) — Code de déontologie",
    url: "https://www.oiq.qc.ca",
  },
  {
    id: "[10]",
    title:
      "Independent Expert Engineering Investigation Panel — Mount Polley Report",
    url: "https://www.mountpolleyreviewpanel.ca",
  },
  {
    id: "[11]",
    title:
      "EGBC — Three Engineers Disciplined in Mount Polley Dam Breach Investigation",
    url: "https://www.egbc.ca",
  },
  {
    id: "[12]",
    title: "Bhopal Disaster Records & Chemical Engineering Ethics Case Study",
    url: "https://commons.wikimedia.org",
  },
  {
    id: "[13]",
    title: "Antoine Lavoisier & History of Chemistry, French Science Academy",
    url: "https://commons.wikimedia.org",
  },
  {
    id: "[14]",
    title: "Seoul Skyline Night & Korean Industry, Wikimedia Commons",
    url: "https://commons.wikimedia.org",
  },
  {
    id: "[15]",
    title: "Maison de la Chimie, Paris — French Chemistry Headquarters",
    url: "https://commons.wikimedia.org",
  },
];

const slideStates: SlideState[] = [
  // 0. Нүүр (Cover)
  { x: 0.68, y: 0.02, s: 1.05, rx: 0.16, rz: -0.15, o: 0.88 },
  // 1. Бхопал (Photo)
  { x: 0.84, y: 0.58, s: 0.32, rx: -0.32, rz: 0.28, o: 0.65 },
  // 2. Арга зүй (Metrics)
  { x: 0.72, y: -0.04, s: 0.98, rx: 0.22, rz: -0.18, o: 0.85 },
  // 3. БНСУ: Холбоо ба Хууль (Photo)
  { x: 0.84, y: 0.56, s: 0.34, rx: 0.35, rz: -0.22, o: 0.65 },
  // 4. БНСУ: 6 зарчим (Photo)
  { x: 0.86, y: 0.58, s: 0.32, rx: -0.28, rz: 0.32, o: 0.65 },
  // 5. Франц: UNAFIC ТУЗ (france-gov)
  { x: 0.82, y: 0.52, s: 0.36, rx: 0.25, rz: 0.2, o: 0.7 },
  // 6. Франц: Чиг үүрэг (Photo)
  { x: 0.86, y: 0.58, s: 0.3, rx: -0.2, rz: -0.3, o: 0.65 },
  // 7. Франц: Charte ISR (france-pillars)
  { x: 0.75, y: 0.02, s: 0.95, rx: 0.18, rz: -0.15, o: 0.8 },
  // 8. Франц: Санкц (france-sanctions)
  { x: 0.85, y: 0.55, s: 0.34, rx: 0.32, rz: 0.25, o: 0.7 },
  // 9. Франц: UNAFIC vs IESF
  { x: 0.82, y: 0.5, s: 0.36, rx: -0.25, rz: 0.2, o: 0.65 },
  // 10. Канад: Холбоод ба Зохицуулалт (Photo)
  { x: 0.85, y: 0.58, s: 0.32, rx: 0.28, rz: -0.25, o: 0.65 },
  // 11. Канад: Ёс зүй (Photo)
  { x: 0.7, y: -0.02, s: 1.0, rx: -0.15, rz: 0.22, o: 0.85 },
  // 12. Харьцуулсан хүснэгт (Table)
  { x: 0, y: 0, s: 1.45, rx: 0.04, rz: 0, o: 0.12 },
  // 13. Ижил төстэй талууд (Analysis)
  { x: 0.84, y: 0.56, s: 0.32, rx: 0.3, rz: 0.2, o: 0.65 },
  // 14. Монгол Улсад авах сургамж (Metrics)
  { x: 0.68, y: 0.04, s: 0.98, rx: 0.15, rz: -0.2, o: 0.85 },
  // 15. Эх сурвалжууд (Refs)
  { x: 0.85, y: 0.6, s: 0.3, rx: 0.2, rz: 0.2, o: 0.6 },
];

// Слайд бүр нэг дэлгэцэнд багтаж, scroll хийхгүй байхаар тохируулсан CSS
const fitCss = `
html,body{height:100%;overflow:hidden}
.slides-wrapper{position:fixed;inset:0;overflow:hidden}
.slides-wrapper main{position:absolute;inset:0;overflow:hidden}
.slides-wrapper main .slide{
  position:absolute;inset:0;box-sizing:border-box;overflow:hidden;
  display:flex;align-items:center;
  padding:clamp(64px,11vh,100px) clamp(20px,5vw,80px) clamp(64px,11vh,100px);
}
.slides-wrapper main .slide:not(.on){visibility:hidden;opacity:0;pointer-events:none}
.slides-wrapper main .slide.on{visibility:visible;opacity:1;pointer-events:auto}

.slide-grid{
  width:100%;height:100%;min-height:0;display:grid;
  grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);
  gap:clamp(20px,4vw,64px);align-items:center;
}
.slide-grid.no-visual{grid-template-columns:minmax(0,1fr)}

.content-side{min-width:0;max-height:100%;overflow:hidden;display:flex;flex-direction:column;justify-content:center}
.content-side .serif-title{font-size:clamp(26px,5.4vh,58px)!important;line-height:1.08!important;margin:.35em 0 .3em!important}
.content-side .serif-sub{font-size:clamp(14px,2.3vh,22px)!important;line-height:1.35!important;margin:0 0 1.6vh!important}
.content-side .points-list{margin:0!important}
.content-side .point-row{display:flex;gap:14px;align-items:flex-start;padding:1.3vh 0!important;margin:0!important}
.content-side .point-text{font-size:clamp(13px,2.1vh,20px);line-height:1.35}

.visual-side{min-width:0;height:100%;max-height:100%;display:flex;align-items:center;justify-content:center;overflow:hidden}
.photo-frame{position:relative;width:100%;height:min(100%,72vh);border-radius:14px;overflow:hidden}
.photo-frame img{width:100%;height:100%;object-fit:cover;display:block}
.photo-badge{position:absolute;top:12px;left:12px;padding:6px 10px;border-radius:999px;background:rgba(20,40,34,.85);color:#fff;font-size:11px;letter-spacing:.08em}
.photo-source{position:absolute;left:12px;bottom:10px;right:12px;font-size:11px;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.6)}

.paper-card-stack{width:100%;display:flex;flex-direction:column;gap:1.6vh;max-height:100%}
.paper-card{padding:1.8vh 18px;border-radius:12px;background:rgba(255,255,255,.55);border:1px solid rgba(0,0,0,.08)}
.card-top{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:.8vh}
.card-title{font-weight:600;font-size:clamp(13px,2.1vh,19px)}
.card-pill{font-size:10px;letter-spacing:.06em;padding:3px 8px;border-radius:999px;background:rgba(20,40,34,.1);white-space:nowrap}
.card-desc{margin:0;font-size:clamp(12px,1.9vh,17px);line-height:1.4}
.metrics-row{width:100%;display:grid;gap:1.6vh}
.metric-card{padding:2vh 18px;border-radius:12px;background:rgba(255,255,255,.55);border:1px solid rgba(0,0,0,.08)}
.metric-num{font-size:clamp(32px,7vh,64px);line-height:1}
.metric-label{font-size:clamp(12px,1.9vh,17px);margin-top:.6vh}

.paper-table-wrap{max-height:56vh;overflow:hidden;margin-top:1.4vh}
.paper-table{width:100%;border-collapse:collapse;font-size:clamp(11px,1.8vh,16px)}
.paper-table th,.paper-table td{padding:1.1vh 10px;border-bottom:1px solid rgba(0,0,0,.12);text-align:left;vertical-align:top}

.refs-columns{columns:3;column-gap:28px;margin-top:1.4vh;font-size:clamp(10px,1.6vh,14px);line-height:1.3;max-height:62vh;overflow:hidden}
.ref-item{break-inside:avoid;margin-bottom:1vh}
.ref-idx{font-weight:700;margin-right:6px}

@media (max-width:820px){
  .slide-grid{grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr)}
  .photo-frame{height:100%}
  .refs-columns{columns:1}
}
`;

export default function Home() {
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

  // 3D HOURGLASS BACKGROUND WIREFRAME
  useEffect(() => {
    const canvas = document.getElementById("gl") as HTMLCanvasElement | null;
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

  // CURTAIN & WIPE TRANSITION
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
      const targetSlide = slides[targetIndex];

      // Flip & spin 3D hourglass
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

      const currentSlideEl = container?.children[index] as
        | HTMLElement
        | undefined;

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

        // 1. Current slide exits
        if (currentSlideEl) {
          tl.to(
            currentSlideEl,
            { y: -50 * dir, opacity: 0.15, duration: 0.42, ease: "power3.in" },
            0,
          );
        }

        // 2. Ink curtain pulls across screen
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
            setIndex(targetIndex);
            // Шинэ слайдын inline style-ийг цэвэрлэнэ
            if (container) {
              gsap.set(container.children, { clearProps: "transform,opacity" });
            }
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

        // 3. Hairline wipe bar
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
      } else {
        setIndex(targetIndex);
        setIsBusy(false);
      }
    },
    [index, isBusy],
  );

  // Progress bar
  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.transform = `scaleX(${index / (slides.length - 1)})`;
    }
  }, [index]);

  // Keyboard navigation
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

  // Fullscreen state listener
  useEffect(() => {
    const handleFs = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleFs);
    return () => document.removeEventListener("fullscreenchange", handleFs);
  }, []);

  return (
    <div
      className="slides-wrapper"
      onTouchStart={(e) => {
        touchStartX.current = e.changedTouches[0].clientX;
      }}
      onTouchEnd={(e) => {
        const diff = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(diff) > 50) goToSlide(index + (diff < 0 ? 1 : -1));
      }}
    >
      {/* Three.js Canvas Background */}
      <style dangerouslySetInnerHTML={{ __html: fitCss }} />
      <canvas id="gl" aria-hidden="true" />
      {/* Animated Paper Grain */}
      <div className="grain" aria-hidden="true" />

      {/* INK CURTAIN TRANSITION */}
      <div className="curtain" ref={curtainRef} aria-hidden="true">
        <div className="cc" ref={curtainCountRef}>
          01 / 16
        </div>
        <div className="cn" ref={curtainNameRef}>
          <span>Нүүр</span>
        </div>
      </div>

      {/* Hairline Wipe Bar */}
      <div className="wipe" ref={wipeRef} aria-hidden="true" />
      {/* Progress Line */}
      <div className="progress" ref={progressRef} />

      {/* TOP CHROME BAR */}
      <header className="chrome top">
        {/* Deck Switcher Tabs */}
        <div className="deck-nav-pills">
          <Link href="/" className="deck-pill active">
            02 · ХАРЬЦУУЛСАН СУДАЛГАА
          </Link>
          <Link href="/biydalt3" className="deck-pill">
            03 · КЕЙС ШИНЖИЛГЭЭ
          </Link>
        </div>
      </header>

      {/* SLIDES STACK */}
      <main ref={slideContainerRef}>
        {slides.map((s, idx) => (
          <section key={idx} className={`slide ${idx === index ? "on" : ""}`}>
            <div
              className={`slide-grid ${
                s.layout === "table" || s.layout === "refs" ? "no-visual" : ""
              }`}
            >
              {/* Left Column: Typography & Punchy Points */}
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
                        <span className="point-bullet">0{pIdx + 1}</span>
                        <div className="point-body">
                          <div className="point-text">
                            <b>{pt.bold}</b> {pt.text}
                            {pt.ref ? <> {pt.ref}</> : null}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comparison Table */}
                {s.layout === "table" && (
                  <div className="paper-table-wrap">
                    <table className="paper-table">
                      <thead>
                        <tr>
                          <th>Үзүүлэлт</th>
                          <th>БНСУ (Өмнөд Солонгос)</th>
                          <th>Франц (UNAFIC / IESF)</th>
                          <th>Канад (EGBC / PEO)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <b>Үндэсний байгууллага</b>
                          </td>
                          <td>KPEA (1965 он) [1]</td>
                          <td>UNAFIC (1910) / IESF [2][3]</td>
                          <td>Engineers Canada (1936) [4]</td>
                        </tr>
                        <tr>
                          <td>
                            <b>Удирдлагын бүтэц</b>
                          </td>
                          <td>Яамны хяналттай сонгуульт ТУЗ [1]</td>
                          <td>Холбооны зөвлөл & Удирдах баг [2]</td>
                          <td>Олон нийтийн төлөөлөлтэй ТУЗ [4]</td>
                        </tr>
                        <tr>
                          <td>
                            <b>Дүрмийн статус</b>
                          </td>
                          <td>Хуулиар заавал мөрдөх (기술사법) [1]</td>
                          <td>Сайн дурын (Charte ISR) [3]</td>
                          <td>Мужийн хуулиар заавал мөрдөх [4][8]</td>
                        </tr>
                        <tr>
                          <td>
                            <b>Сахилга, санкц</b>
                          </td>
                          <td>Лиценз 1-3 жилээр хасах эсвэл цуцлах [1]</td>
                          <td>Эрүүгийн хуулийн 121-3 дугаар зүйл [5]</td>
                          <td>$100,000 хүртэл торгууль, лиценз цуцлах [4]</td>
                        </tr>
                        <tr>
                          <td>
                            <b>Эрсдэл мэдээлэх үүрэг</b>
                          </td>
                          <td>Нийтийн аюулгүй байдлыг дээдлэх зарчим [1]</td>
                          <td>Эрсдэлийг үнэн зөв мэдээлэх зарчим [3]</td>
                          <td>Duty to Report — заавал [4]</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* References Grid */}
                {s.layout === "refs" && (
                  <div className="refs-columns">
                    {referencesList.map((r) => (
                      <div className="ref-item" key={r.id}>
                        <span className="ref-idx">{r.id}</span>
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {r.title}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Visual / Cards */}
              {s.layout !== "table" && s.layout !== "refs" && (
                <div className="visual-side">
                  {s.imageSrc ? (
                    <div className="photo-frame">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.imageSrc}
                        alt={s.imageAlt ?? "Slide illustration"}
                      />
                      {s.imageBadge && (
                        <div className="photo-badge">{s.imageBadge}</div>
                      )}
                      {s.imageSource && (
                        <div className="photo-source">{s.imageSource}</div>
                      )}
                    </div>
                  ) : s.layout === "france-gov" ? (
                    /* French Governance: Conseil Fédéral & Bureau */
                    <div className="paper-card-stack">
                      <div className="paper-card">
                        <div className="card-top">
                          <span className="card-title">
                            Холбооны зөвлөл (Conseil Fédéral)
                          </span>
                          <span className="card-pill">САР БҮР</span>
                        </div>
                        <p className="card-desc">
                          Сар бүр хуралдаж, бодлого чиглэлийг тодорхойлж,
                          Удирдах багийн үйл ажиллагааны хяналтыг хэрэгжүүлнэ
                          [2].
                        </p>
                      </div>

                      <div className="paper-card">
                        <div className="card-top">
                          <span className="card-title">
                            Удирдах баг (Bureau)
                          </span>
                          <span className="card-pill">2 ЖИЛ</span>
                        </div>
                        <p className="card-desc">
                          Ерөнхийлөгч тэргүүтэй, 2 жилийн хугацаатай өдөр тутмын
                          удирдлагыг хэрэгжүүлнэ [2].
                        </p>
                      </div>
                    </div>
                  ) : s.layout === "france-pillars" ? (
                    /* Charte ISR: 3 pillars */
                    <div className="paper-card-stack">
                      <div className="paper-card">
                        <div className="card-top">
                          <span className="card-title">
                            1. Хувь хүний хариуцлага
                          </span>
                          <span className="card-pill">ЁС ЗҮЙ</span>
                        </div>
                        <p className="card-desc">
                          Шинжлэх ухааны баримтад тулгуурлах, алдаагаа хүлээн
                          зөвшөөрөх, ур чадвараа хөгжүүлэх [3].
                        </p>
                      </div>

                      <div className="paper-card">
                        <div className="card-top">
                          <span className="card-title">
                            2. Хамт олон, байгууллагын хариуцлага
                          </span>
                          <span className="card-pill">АЮУЛГҮЙ БАЙДАЛ</span>
                        </div>
                        <p className="card-desc">
                          Эрсдэлийг үнэн зөв мэдээлэх, аюулгүй байдлыг хангах,
                          ажилтан, хэрэглэгчийн эрүүл мэндийг хамгаалах [3].
                        </p>
                      </div>

                      <div className="paper-card">
                        <div className="card-top">
                          <span className="card-title">
                            3. Нийгэм, байгаль орчны хариуцлага
                          </span>
                          <span className="card-pill">ТОГТВОРТОЙ ХӨГЖИЛ</span>
                        </div>
                        <p className="card-desc">
                          Байгалийн нөөцийг зохистой ашиглах, бохирдлыг
                          бууруулах, тогтвортой хөгжлийг дэмжих [3].
                        </p>
                      </div>
                    </div>
                  ) : s.layout === "france-sanctions" ? (
                    /* French Legal Sanctions Stack */
                    <div className="paper-card-stack">
                      <div
                        className="paper-card"
                        style={{ borderLeft: "3px solid var(--ink)" }}
                      >
                        <div className="card-top">
                          <span className="card-title">
                            1. Байгууллагын дотоод хариуцлага
                          </span>
                          <span className="card-pill">САХИЛГА</span>
                        </div>
                        <p className="card-desc">
                          Ажил олгогч нь дотоод журам, хөдөлмөрийн гэрээний
                          дагуу сануулга өгөх болон сахилгын арга хэмжээ авна.
                        </p>
                      </div>

                      <div
                        className="paper-card"
                        style={{ borderLeft: "3px solid var(--accent)" }}
                      >
                        <div className="card-top">
                          <span className="card-title">
                            2. Иргэний эрх зүйн хариуцлага
                          </span>
                          <span className="card-pill">
                            ХОХИРОЛ НӨХӨН ТӨЛБӨР
                          </span>
                        </div>
                        <p className="card-desc">
                          Бусдад болон байгаль орчинд учруулсан хохирлыг нөхөн
                          төлүүлэх хуулийн үүрэг үүснэ.
                        </p>
                      </div>

                      <div
                        className="paper-card"
                        style={{ borderLeft: "3px solid #b8612f" }}
                      >
                        <div className="card-top">
                          <span className="card-title">
                            3. Эрүүгийн хуулийн 121-3 дугаар зүйл
                          </span>
                          <span
                            className="card-pill"
                            style={{
                              background: "rgba(184, 97, 47, 0.2)",
                              color: "#b8612f",
                            }}
                          >
                            ЭРҮҮГИЙН ЯЛ
                          </span>
                        </div>
                        <p className="card-desc">
                          Хайхрамжгүй байдал, аюулгүй ажиллагааны үүргээ
                          зөрчсөнөөс ноцтой хор уршиг учирвал эрүүгийн ял
                          шийтгэнэ [5].
                        </p>
                      </div>
                    </div>
                  ) : s.layout === "france-vs-iesf" ? (
                    /* UNAFIC vs IESF */
                    <div className="paper-card-stack">
                      <div className="paper-card">
                        <div className="card-top">
                          <span className="card-title">
                            UNAFIC (Химийн холбоо)
                          </span>
                          <span className="card-pill">ХИМИЙН ИНЖЕНЕР</span>
                        </div>
                        <p className="card-desc">
                          Химийн инженерийн сургуулиудын төгсөгчдийг нэгтгэдэг.
                          Мэргэжлийг төлөөлөх, боловсрол, цалин, ажил эрхлэлтэд
                          төвлөрдөг [2].
                        </p>
                      </div>

                      <div className="paper-card">
                        <div className="card-top">
                          <span className="card-title">
                            IESF (Үндэсний нэгдэл)
                          </span>
                          <span className="card-pill">НИЙТ ИНЖЕНЕРҮҮД</span>
                        </div>
                        <p className="card-desc">
                          Бүх салбарын инженерүүдийг хамарсан өргөн хүрээтэй. Ёс
                          зүйн суурь дүрэм болох <b>Charte ISR</b>-ийг
                          боловсруулан гаргадаг [3].
                        </p>
                      </div>
                    </div>
                  ) : s.layout === "metrics" ? (
                    <div className="metrics-row">
                      <div className="metric-card">
                        <div className="metric-num">03</div>
                        <div className="metric-label">
                          Харьцуулсан өндөр хөгжилтэй улс
                        </div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-num">1910</div>
                        <div className="metric-label">
                          UNAFIC-ийн анх үүссэн түүхэн он
                        </div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-num">121-3</div>
                        <div className="metric-label">
                          Францын эрүүгийн хуулийн зүйл анги
                        </div>
                      </div>
                    </div>
                  ) : s.layout === "analysis" ? (
                    <div className="paper-card-stack">
                      <div className="paper-card">
                        <div className="card-top">
                          <span className="card-title">
                            БНСУ (Өмнөд Солонгос)
                          </span>
                          <span className="card-pill">ТӨРИЙН САХИЛГА</span>
                        </div>
                        <p className="card-desc">
                          Шинжлэх ухааны яамны шууд хяналт; биечлэн тамгалах
                          хуулийн хатуу үүрэгтэй [1].
                        </p>
                      </div>
                      <div className="paper-card">
                        <div className="card-top">
                          <span className="card-title">Франц улс</span>
                          <span className="card-pill">
                            МЭРГЭЖЛИЙН ХОЛБОО + ХУУЛЬ
                          </span>
                        </div>
                        <p className="card-desc">
                          UNAFIC холбоо нь ажил эрхлэлтийг дэмжинэ; зөрчлийг
                          Эрүүгийн 121-3 дугаар зүйлээр шийднэ [2][5].
                        </p>
                      </div>
                      <div className="paper-card">
                        <div className="card-top">
                          <span className="card-title">Канад улс</span>
                          <span className="card-pill">МУЖИЙН ХУУЛЬ</span>
                        </div>
                        <p className="card-desc">
                          $100,000 хүртэл торгууль, эрсдэлийг мэдээлэх
                          хуульчилсан хатуу үүрэгтэй [4].
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </section>
        ))}
      </main>

      {/* BOTTOM CHROME BAR */}
      <footer className="chrome bottom">
        <div className="counter">
          <b>{String(index + 1).padStart(2, "0")}</b>
          <span>/</span>
          <span>{String(slides.length).padStart(2, "0")}</span>
          <span style={{ marginLeft: "14px", color: "var(--ink-2)" }}>
            {slides[index].name}
          </span>
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
