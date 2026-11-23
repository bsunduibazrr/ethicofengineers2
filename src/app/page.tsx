"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { initHourglass, SlideState } from "./hourglass";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface Point {
  bold: string;
  text: string;
  ref?: string;
}

interface Card {
  title: string;
  pill?: string;
  desc?: string;
  tone?: "ink" | "accent" | "warn";
}

interface SlideData {
  name: string;
  tag: string;
  titleHtml: string;
  sub?: string;
  points?: Point[];
  cards?: Card[]; // баруун талын карт жагсаалт
  tiles?: string[]; // баруун талын зарчмын хавтангууд
  layout?: "table" | "refs";
  pose?: "hero" | "faint"; // 3D hourglass-ын байрлал
  imageSrc?: string;
  imageAlt?: string;
  imageBadge?: string;
  imageSource?: string;
}

const NO_INFO = "Баталгаатай мэдээлэл олдсонгүй";

// Гарчгийн доогуурлалт
const mark = (word: string) =>
  `<em class='mark'>${word}<svg class='scr' viewBox='0 0 200 20' preserveAspectRatio='none' aria-hidden='true'><path d='M3 13 C 40 5, 90 17, 130 10 S 185 6, 197 12'/></svg></em>`;

/* ------------------------------------------------------------------ */
/* Slides                                                              */
/* ------------------------------------------------------------------ */

const slides: SlideData[] = [
  // 1. Нүүр
  {
    name: "Нүүр",
    tag: "Химийн инженерийн ёс зүй · Харьцуулсан судалгаа",
    titleHtml: `Мэргэжлийн ёс зүй ба ${mark("хариуцлага")}`,
    sub: "Өмнөд Солонгос, Франц, Канад улсын мэргэжлийн холбоо, ёс зүйн дүрмийн харьцуулсан судалгаа",
    pose: "hero",
    imageSrc: "/images/chemical-plant.jpg",
    imageAlt: "Химийн үйлдвэрийн цогцолбор",
    imageBadge: "АЖ ҮЙЛДВЭРИЙН ХАРИУЦЛАГА",
    imageSource: "Wikimedia Commons",
  },

  // 2. Бодит сургамж: Бхопал
  {
    name: "Бодит сургамж",
    tag: "Аюулгүй байдал ба хүний амь нас",
    titleHtml: `Инженерийн алдаа ${mark("хүний аминд")} хүрдэг`,
    sub: "Бхопалын осол химийн инженерчлэлд ёс зүй яагаад чухал болохыг харуулсан бодит жишээ.",
    points: [
      {
        bold: "1984 оны 12-р сарын 3:",
        text: "Union Carbide-ийн Энэтхэгийн охин компанийн үйлдвэрээс ойролцоогоор 45 тонн метилизоцианатын хий алдагдсан",
        ref: "[13]",
      },
      {
        bold: "Хохирол:",
        text: "Засгийн газар 3,787 нас баралтыг баталсан; бусад тооцоо хавьгүй өндөр",
        ref: "[14]",
      },
      {
        bold: "Хариуцлага:",
        text: "2010 онд охин компанийн хэдэн удирдлагыг болгоомжгүй байдлаар буруутган шийтгэсэн",
        ref: "[13]",
      },
      {
        bold: "Дүн шинжилгээ:",
        text: "Аюулгүй байдлыг ашгаас дээгүүр тавих нь инженерийн үүрэг.",
      },
    ],
    imageSrc: "/images/bhopal.jpg",
    imageAlt: "Бхопалын химийн үйлдвэрийн гамшиг",
    imageBadge: "BHOPAL · 1984",
    imageSource: "Bhopal · Wikimedia Commons",
  },

  // 3. Арга зүй
  {
    name: "Арга зүй",
    tag: "Судалгааны үндэслэл",
    titleHtml: `Албан ёсны эх сурвалжид ${mark("суурилсан")} шинжилгээ`,
    sub: "Гурван улсын мэргэжлийн холбоо, ёс зүйн дүрмийг харьцуулав.",
    cards: [
      {
        title: "1. Албан ёсны эх сурвалж",
        pill: "ЭХ СУРВАЛЖ",
        desc: "Холбоодын сайт, ёс зүйн дүрэм, зохицуулагчийн мэдээг ашиглав.",
      },
      {
        title: "2. Баримт бүрт ишлэл",
        pill: "ИШЛЭЛ",
        desc: "Он, тоо, заалт бүрийг [ ] дугаараар эх сурвалжтай нь холбов.",
      },
      {
        title: "3. Баталгаагүй мэдээлэл",
        pill: "ХЯЗГААР",
        desc: `Олдоогүй мэдээллийг "${NO_INFO}" гэж тэмдэглэв.`,
        tone: "warn",
      },
      {
        title: "4. Дүн шинжилгээг ялгав",
        pill: "ДҮН ШИНЖИЛГЭЭ",
        desc: "Миний дүгнэлтийг баримтаас тусад нь тэмдэглэв.",
        tone: "accent",
      },
    ],
  },

  // 4. БНСУ: KIChE
  {
    name: "Өмнөд Солонгос",
    tag: "БНСУ · KIChE · Химийн инженерчлэлийн холбоо",
    titleHtml: `Солонгосын ${mark("KIChE")} нийгэмлэг`,
    sub: "The Korean Institute of Chemical Engineers — БНСУ-ын химийн инженерчлэлийн мэргэжлийн нийгэмлэг.",
    points: [
      {
        bold: "Байгуулагдсан:",
        text: "1962 оны 10 дугаар сарын 8",
        ref: "[1]",
      },
      {
        bold: "Гишүүд:",
        text: "6000 гаруй гишүүнтэй",
        ref: "[1]",
      },
      {
        bold: "ТУЗ-ийн бүтэц, лиценз олгох эрх:",
        text: NO_INFO,
      },
    ],
    imageSrc: "/images/korea.jpg",
    imageAlt: "Сөүл хотын шөнийн дүр төрх",
    imageBadge: "SOUTH KOREA · KIChE · 1962",
    imageSource: "Seoul · Wikimedia Commons",
  },

  // 5. БНСУ: чиг үүрэг
  {
    name: "KIChE чиг үүрэг",
    tag: "БНСУ · KIChE · Чиг үүрэг",
    titleHtml: `Тус нийгэмлэг ${mark("юу хийдэг")} вэ?`,
    sub: "Судалгаа, мэргэшүүлэлт, олон улсын хамтын ажиллагаагаар салбарыг дэмждэг.",
    cards: [
      {
        title: "1. Судалгаа, инновац",
        pill: "СУДАЛГАА",
        desc: "Судалгааны шинэ үр дүнг үйлдвэрлэлд нэвтрүүлж, инновацыг дэмждэг [1].",
      },
      {
        title: "2. Инженерүүдийг мэргэшүүлэх",
        pill: "МЭРГЭШИЛ",
        desc: "Инженерүүдийн мэдлэг, чадварыг дээшлүүлнэ [1].",
      },
      {
        title: "3. Олон улсын хамтын ажиллагаа",
        pill: "ОЛОН УЛС",
        desc: "БНСУ-ын химийн инженерчлэлийн салбарын хөгжилд хувь нэмэр оруулдаг [1].",
      },
    ],
  },

  // 6. БНСУ: ёс зүйн баримтууд
  {
    name: "Ёс зүйн баримтууд",
    tag: "БНСУ · Ёс зүйн дүрэм",
    titleHtml: `Ёс зүйн ${mark("хоёр баримт")} бичиг`,
    sub: "Хоёулаа судалгаа, хэвлэлийн ёс зүйтэй холбоотой баримт; инженерийн лицензийн ёс зүй биш [1][12].",
    cards: [
      {
        title: "KIChE (한국화학공학회)",
        pill: "2008.09.11",
        desc: "Эрдэм шинжилгээний сэтгүүл хэвлэлийн ёс зүйн удирдамж; 2009, 2010, 2016, 2017, 2020 онд шинэчилсэн [1].",
      },
      {
        title: "KSIEC (한국공업화학회)",
        pill: "2007.10.08",
        desc: "Судалгааны ёс зүйн тунхаг [12].",
      },
    ],
  },

  // 7. БНСУ: зарчим
  {
    name: "Ёс зүйн зарчим",
    tag: "БНСУ · Үндсэн зарчим",
    titleHtml: `Ёс зүйн дүрмийн ${mark("6 зарчим")}`,
    sub: "Хоёр нийгэмлэгийн ёс зүйн баримтад тусгагдсан зарчмууд [1][12].",
    tiles: [
      "Мэргэжлийн хариуцлага",
      "Нууц хадгалах",
      "Шударга байдал",
      "Оюуны өмчийг хүндэтгэх",
      "Шударга үнэлгээ",
      "Байгаль орчны хамгаалал",
    ],
  },

  // 8. БНСУ: хариуцлага
  {
    name: "Хариуцлагын төрөл",
    tag: "БНСУ · Хариуцлага ба сахилга",
    titleHtml: `Хүлээлгэх ${mark("хариуцлагын төрлүүд")}`,
    sub: `Эдгээр нь нийгэмлэгийн гишүүн, зохиогчид хамаарах арга хэмжээ [1][12]. Мэргэжлийн инженерийн ёс зүйн хариуцлага: ${NO_INFO}.`,
    cards: [
      { title: "1. Анхааруулга", pill: "ХАРИУЦЛАГА" },
      { title: "2. Өгүүлэл нийтлэхийг хориглох", pill: "ХАРИУЦЛАГА" },
      { title: "3. Өгүүлэл буцаан татах", pill: "ХАРИУЦЛАГА" },
      { title: "4. Гишүүнчлэл түдгэлзүүлэх", pill: "ХАРИУЦЛАГА" },
    ],
  },

  // 9. Франц: UNAFIC
  {
    name: "Франц: UNAFIC",
    tag: "Франц · Химийн инженерийн холбоо",
    titleHtml: `UNAFIC холбоо ба ${mark("Удирдах зөвлөл")}`,
    sub: "Францын химийн инженерүүдийн холбоодын үндэсний нэгдэл.",
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
        text: "Ерөнхийлөгч тэргүүтэй, 2 жилийн хугацаатай өдөр тутмын удирдлага",
        ref: "[2]",
      },
    ],
    cards: [
      {
        title: "Холбооны зөвлөл (Conseil Fédéral)",
        pill: "САР БҮР",
        desc: "Бодлого чиглэлийг тодорхойлж, Удирдах багийн үйл ажиллагаанд хяналт тавина [2].",
      },
      {
        title: "Удирдах баг (Bureau)",
        pill: "2 ЖИЛ",
        desc: "Ерөнхийлөгч тэргүүтэй, өдөр тутмын удирдлагыг хэрэгжүүлнэ [2].",
      },
    ],
  },

  // 10. Франц: чиг үүрэг
  {
    name: "Франц: Чиг үүрэг",
    tag: "Франц · Төлөөлөл ба карьер",
    titleHtml: `Химийн инженерүүдийг ${mark("төлөөлөх")} чиг үүрэг`,
    sub: "UNAFIC нь инженерүүдийн эрх ашиг, карьер, боловсролыг дэмждэг.",
    points: [
      {
        bold: "Мэргэжлийн төлөөлөл:",
        text: "Франц болон олон улсад химийн инженерүүдийн ашиг сонирхлыг төлөөлнө",
        ref: "[2]",
      },
      {
        bold: "Ажил эрхлэлт:",
        text: "Хөдөлмөр эрхлэлт, цалин хөлсний судалгаа нийтэлж мэдээллээр хангана",
        ref: "[2]",
      },
      {
        bold: "Оюутан, залуу мэргэжилтэн:",
        text: "Үзэсгэлэн, форум зохион байгуулж, карьерын сүлжээ үүсгэнэ",
        ref: "[2]",
      },
    ],
    imageSrc: "/images/france-chimie.jpg",
    imageAlt: "Maison de la Chimie, Парис хот",
    imageBadge: "MAISON DE LA CHIMIE · PARIS",
    imageSource: "Maison de la Chimie · Wikimedia Commons",
  },

  // 11. Франц: Charte ISR
  {
    name: "Charte ISR",
    tag: "Франц · Ёс зүйн үндсэн зарчим",
    titleHtml: `Хариуцлагатай инженерийн ${mark("дүрэм")} (Charte ISR)`,
    sub: "IESF 2001 онд Ёс зүйн дүрмээ баталсан; 2020 оны сүүлээс шинэчилж Charte ISR болгосон [6][3]. ISR = Ingénieur et Scientifique Responsables.",
    points: [
      {
        bold: "1. Хувь хүн:",
        text: "Оюун ухаан, ухамсартай мэргэжилтэн; мэргэжлээ сурталчилна",
        ref: "[3]",
      },
      {
        bold: "2. Хамт олон:",
        text: "Захиалагчид эрсдэл, хязгаарлалтыг мэдээлж, хамт олныхоо ур чадварыг дэмжинэ",
        ref: "[3]",
      },
      {
        bold: "3. Нийгэм:",
        text: "Шинжлэх ухаан, технологи, нийгмийн холбоог хариуцлагатай хангана",
        ref: "[3]",
      },
    ],
    cards: [
      {
        title: "1. Хувь хүнийн хүрээ",
        pill: "ХУВЬ ХҮН",
        desc: "Инженер, эрдэмтэн хувь хүнийхээ хувиар хүлээх үүрэг [3].",
      },
      {
        title: "2. Хамт олны хүрээ",
        pill: "ХАМТ ОЛОН",
        desc: "Ажлын хамт олны гишүүний хувиар хүлээх үүрэг [3].",
      },
      {
        title: "3. Нийгмийн хүрээ",
        pill: "НИЙГЭМ",
        desc: "Нийгмийн гишүүн, иргэний хувиар хүлээх үүрэг [3].",
      },
    ],
  },

  // 12. Франц: хариуцлага
  {
    name: "Францын хариуцлага",
    tag: "Франц · Дүрмийн статус ба хууль",
    titleHtml: `Charte ISR ба ${mark("хуулийн")} хариуцлага`,
    sub: "Charte нь сахилгын код биш; хуулийн хариуцлага Эрүүгийн хуулиар тодорхойлогдоно.",
    points: [
      {
        bold: "Дүрмийн статус:",
        text: "Мэргэжлийн итгэл үнэмшлийн баримт; өмнөх «code de déontologie»-г солисон",
        ref: "[6]",
      },
      {
        bold: "Эрүүгийн хууль, 121-3 зүйл:",
        text: "Болгоомжгүй байдал ямар нөхцөлд гэмт хэрэг болохыг тодорхойлдог",
        ref: "[5]",
      },
      {
        bold: "Сахилгын систем:",
        text: NO_INFO,
      },
    ],
    cards: [
      {
        title: "1. Ёс зүйн дүрэм",
        pill: "СААЙН ДУРЫН",
        desc: "Charte нь сахилга шийтгэлийн код биш, мэргэжлийн итгэл үнэмшлийг илэрхийлдэг [6].",
        tone: "ink",
      },
      {
        title: "2. Эрүүгийн хууль 121-3",
        pill: "ХУУЛЬ",
        desc: "Болгоомжгүй байдлын гэм бурууг тодорхойлдог зүйл; тодорхой ялыг бусад зүйл тогтооно [5].",
        tone: "warn",
      },
      {
        title: "3. Сахилгын тогтолцоо",
        pill: "ТОДОРХОЙГҮЙ",
        desc: `${NO_INFO}.`,
        tone: "accent",
      },
    ],
  },

  // 13. Франц: UNAFIC vs IESF
  {
    name: "UNAFIC ба IESF",
    tag: "Франц · Байгууллагын харьцуулалт",
    titleHtml: `UNAFIC болон IESF-ийн ${mark("харилцан нөхөх")} үүрэг`,
    sub: "Химийн инженерийн дагнасан холбоо ба бүх салбарын нэгдлийн ялгаа.",
    points: [
      {
        bold: "UNAFIC:",
        text: "Химийн инженерийн сургуулиудын төгсөгчдийг нэгтгэж, карьер, ажил эрхлэлтэд төвлөрнө",
        ref: "[2]",
      },
      {
        bold: "IESF:",
        text: "Бүх салбарын инженерүүдийн ёс зүйн дүрэм (Charte ISR)-ийг гаргадаг",
        ref: "[3]",
      },
      {
        bold: "Дүн шинжилгээ:",
        text: "UNAFIC холбоодыг уялдуулж, IESF ёс зүйн суурь зарчмыг тодорхойлно.",
      },
    ],
    cards: [
      {
        title: "UNAFIC (Химийн холбоо)",
        pill: "ХИМИЙН ИНЖЕНЕР",
        desc: "Химийн инженерийн сургуулиудын төгсөгчдийг нэгтгэдэг; мэргэжлийн төлөөлөл, ажил эрхлэлтэд төвлөрнө [2].",
      },
      {
        title: "IESF (Үндэсний нэгдэл)",
        pill: "БҮХ ИНЖЕНЕР",
        desc: "Бүх салбарын инженерийг хамарсан; ёс зүйн дүрэм Charte ISR-ийг боловсруулдаг [3].",
      },
    ],
  },

  // 14. Канад: холбоо, түүх
  {
    name: "Канад: Холбоо",
    tag: "Канад · Мэргэжлийн холбоо",
    titleHtml: `Engineers Canada ба ${mark("мужийн")} зохицуулагчид`,
    sub: "Үндэсний холбоо нь мужуудын зохицуулагчдын нэгдэл; лиценз олгох ажлыг мужууд хийдэг.",
    points: [
      {
        bold: "1936 он:",
        text: "Dominion Council of Professional Engineers нэрээр байгуулагдсан",
        ref: "[7]",
      },
      {
        bold: "Гишүүд:",
        text: "12 муж, нутгийн инженерийн зохицуулагч",
        ref: "[7]",
      },
      {
        bold: "Лиценз:",
        text: "Мужийн зохицуулагч (жишээ нь PEO) инженерийг лицензжүүлдэг",
        ref: "[8]",
      },
    ],
    cards: [
      {
        title: "1920 · Эхний 6 зохицуулагч",
        pill: "МУЖ",
        desc: "BC, Alberta, Manitoba, New Brunswick, Nova Scotia, Quebec [15].",
      },
      {
        title: "1936 · Үндэсний зөвлөл",
        pill: "ҮНДЭСНИЙ",
        desc: "Хууль тогтоомжийг уялдуулах зорилгоор байгуулагдсан [15][7].",
      },
      {
        title: "1959 · 2007 · Нэр солилт",
        pill: "ТҮҮХ",
        desc: "1959 онд CCPE, 2007 онд Engineers Canada болсон [7].",
      },
    ],
  },

  // 15. Канад: засаглал
  {
    name: "Канад: Засаглал",
    tag: "Канад · Үндэсний ба мужийн түвшин",
    titleHtml: `Хоёр түвшний ${mark("засаглал")}`,
    sub: "Үндэсний холбоо удирдамж гаргана; мужийн зохицуулагч хууль, лиценз, сахилгыг хэрэгжүүлнэ.",
    points: [
      {
        bold: "Удирдамж:",
        text: "Canadian Engineering Qualifications Board боловсруулж, Engineers Canada-гийн ТУЗ батална",
        ref: "[16]",
      },
      {
        bold: "Магадлан итгэмжлэл:",
        text: "Хөтөлбөрийг CEAB мужуудын нэрийн өмнөөс магадлана",
        ref: "[7]",
      },
      {
        bold: "ТУЗ-д олон нийтийн төлөөлөл:",
        text: NO_INFO,
      },
    ],
    cards: [
      {
        title: "Үндэсний · Engineers Canada",
        pill: "ЗОХИЦУУЛАЛТ",
        desc: "Удирдамж, магадлан итгэмжлэл, олон улсын хөдөлгөөн, мужуудын хамтын ажиллагаа [7].",
        tone: "ink",
      },
      {
        title: "Мужийн · PEO, EGBC гэх мэт",
        pill: "ХУУЛЬ",
        desc: "Лиценз олгох, ёс зүйн дүрэм мөрдүүлэх, сахилгын хэрэг хянах [8][9].",
        tone: "accent",
      },
    ],
  },

  // 16. Канад: ёс зүйн дүрэм
  {
    name: "Канадын ёс зүй",
    tag: "Канад · Ёс зүйн дүрэм",
    titleHtml: `«Hold paramount» ${mark("зарчим")}`,
    sub: "Нийтийн аюулгүй байдал, эрүүл мэнд, байгаль орчныг хамгаалах нь бусад бүх үүргээс дээгүүр [4][17].",
    points: [
      {
        bold: "Хувилбар:",
        text: "2016 оны 3-р сарын Public Guideline; 2024 оны 7-р сард шинэчилсэн",
        ref: "[17][4]",
      },
      {
        bold: "«Paramount» гэдэг нь:",
        text: "Аюулгүй байдал эрсдэлд орвол бусад заалт доогуур орно",
        ref: "[17]",
      },
    ],
    tiles: [
      "Нийтийн аюулгүй байдал, байгаль орчин",
      "Ур чадварын хүрээнд ажиллах",
      "Ажил олгогчийн итгэмжит төлөөлөгч, нууц хадгалах",
      "Ашиг сонирхлын зөрчлийг мэдэгдэх",
      "Инженерийн нэр хүндийг дээшлүүлэх",
    ],
  },

  // 17. Канад: хууль ба санкц
  {
    name: "Канад: Хариуцлага",
    tag: "Канад · Заавал ба сайн дурын, санкц",
    titleHtml: `Хуулийн ${mark("хүч")} ба санкц`,
    sub: "Үндэсний удирдамж зөвлөмж шинжтэй; заавал дагах дүрэм мужийн хуульд байдаг.",
    points: [
      {
        bold: "Үндэсний удирдамж:",
        text: "Сайн дурын; инженер түүнд шууд хариуцлага хүлээдэггүй",
        ref: "[16]",
      },
      {
        bold: "Мужийн код:",
        text: "Ontario-д Professional Engineers Act-д тусгагдсан; BC-д EGBC Bylaws-ийн Schedule A",
        ref: "[8][9]",
      },
      {
        bold: "Мэдээлэх үүрэг:",
        text: "Заавал ба сайн дурын мэдээлэл гэж ялгадаг; муж бүрийн хуулиас хамаарна",
        ref: "[11]",
      },
    ],
    cards: [
      {
        title: "BC: торгууль",
        pill: "EGBC",
        desc: "Лиценз түдгэлзүүлэх, цуцлах; хувь хүнд $100,000 хүртэл, фирмд $250,000 хүртэл торгууль [9][10].",
        tone: "warn",
      },
      {
        title: "Муж бүр өөр",
        pill: "ХАРЬЦУУЛАЛТ",
        desc: "Саскачеванд одоогийн дээд торгууль $15,000 (APEGS-ийн баримтаар) [18].",
        tone: "ink",
      },
      {
        title: "Mount Polley (BC)",
        pill: "ЖИШЭЭ",
        desc: "Хуучин хуулиар дээд хэмжээ $25,000 байсан; инженерүүдэд торгууль ногдуулсан [10].",
        tone: "accent",
      },
    ],
  },

  // 18. Нэгдсэн харьцуулалт
  {
    name: "Нэгдсэн харьцуулалт",
    tag: "Харьцуулсан судалгаа",
    titleHtml: `Гурван улсын тогтолцооны ${mark("харьцуулалт")}`,
    sub: "Бүтэц, дүрмийн статус, санкц, эрсдэл мэдээлэх үүргийг нэгтгэв.",
    layout: "table",
    pose: "faint",
  },

  // 19. Ижил ба ялгаатай
  {
    name: "Ижил ба ялгаатай",
    tag: "Дүн шинжилгээ",
    titleHtml: `Ижил төстэй тал ба ${mark("онцлог ялгаа")}`,
    sub: "Дүн шинжилгээ: гурван улс нийтийн ашиг сонирхлыг дээдэлдэг ч хэрэгжүүлэх механизм нь өөр.",
    points: [
      {
        bold: "Ижил тал:",
        text: "Мэргэжлийн хариуцлага, байгаль орчны хамгаалал, ур чадварыг бүгд тусгасан",
        ref: "[1][3][4]",
      },
      {
        bold: "Статусын ялгаа:",
        text: "Канадад мужийн код заавал; Францад Charte сайн дурын",
        ref: "[8][6]",
      },
      {
        bold: "Тогтолцооны ялгаа:",
        text: `Канадад зохицуулагч лиценз олгоно; Солонгос, Францын лицензийн мэдээлэл: ${NO_INFO}`,
        ref: "[8]",
      },
    ],
    cards: [
      {
        title: "БНСУ",
        pill: "НИЙГЭМЛЭГ",
        desc: "Судалгаа, хэвлэлийн ёс зүйн баримт; арга хэмжээ гишүүн, зохиогчид хамаарна [1][12].",
      },
      {
        title: "Франц",
        pill: "ХОЛБОО + ХУУЛЬ",
        desc: "Сайн дурын Charte ISR; хуулийн хариуцлага Эрүүгийн хуулиар [6][5].",
      },
      {
        title: "Канад",
        pill: "МУЖИЙН ХУУЛЬ",
        desc: "Мужийн хуулиар заавал дүрэм, лицензийн сахилга [8][9].",
      },
    ],
  },

  // 20. Монголд өгөх сургамж
  {
    name: "Монголд өгөх сургамж",
    tag: "Дүн шинжилгээ · Бодлогын санал",
    titleHtml: `Монголд авах ${mark("3 сургамж")}`,
    sub: "Дүн шинжилгээ: энэ нь миний санал, баримт биш.",
    points: [
      {
        bold: "1. Дүрмийн статусыг хуульчлах:",
        text: "Ёс зүйн дүрмийг хуулийн хүрээнд тусгах (Канадын мужийн загвар)",
        ref: "[8]",
      },
      {
        bold: "2. Эрсдэл мэдээлэх удирдамж:",
        text: "Заавал ба сайн дурын мэдээллийн нөхцөлийг тодорхойлох (Канадын Duty to report)",
        ref: "[11]",
      },
      {
        bold: "3. Нийгмийн хариуцлага:",
        text: "Нийгэм, байгаль орчны хариуцлагыг дүрэмд тусгах (Франц Charte ISR)",
        ref: "[3]",
      },
    ],
    cards: [
      {
        title: "Мэргэжлийн холбоо",
        pill: "САНАЛ",
        desc: "Ёс зүйн дүрэм батлах, сахилгын журам боловсруулах.",
      },
      {
        title: "Төр, хууль тогтоогч",
        pill: "САНАЛ",
        desc: "Дүрмийн заавал биелэх статусыг хуульд тусгах.",
      },
      {
        title: "Их сургууль, ажил олгогч",
        pill: "САНАЛ",
        desc: "Ёс зүйн сургалт, эрсдэл мэдээлэх соёлыг төлөвшүүлэх.",
      },
    ],
  },

  // 21. Эх сурвалжууд
  {
    name: "Эх сурвалжууд",
    tag: "Албан ёсны эх баримтууд",
    titleHtml: `Ашигласан ${mark("эх сурвалжууд")}`,
    sub: "Слайд дээр ишлэгдсэн бүх эх сурвалж.",
    layout: "refs",
    pose: "faint",
  },
];

/* ------------------------------------------------------------------ */
/* Эх сурвалж ба хүснэгт                                               */
/* ------------------------------------------------------------------ */

const referencesList = [
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

const tableHead = [
  "Үзүүлэлт",
  "БНСУ",
  "Франц (UNAFIC / IESF)",
  "Канад (Engineers Canada / муж)",
];

const tableRows: string[][] = [
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
    "Эрүүгийн хууль 121-3 [5]; сахилгын систем: " + NO_INFO,
    "Лиценз түдгэлзүүлэх, цуцлах, торгууль (BC: $100,000 хүртэл) [9]",
  ],
  [
    "Эрсдэл мэдээлэх",
    NO_INFO,
    "Захиалагчид эрсдэл мэдээлэх зарчим [3]",
    "Duty to report: заавал ба сайн дурын [11]",
  ],
];

/* ------------------------------------------------------------------ */
/* 3D hourglass-ын байрлалууд                                          */
/* ------------------------------------------------------------------ */

const POSES: SlideState[] = [
  { x: 0.84, y: 0.56, s: 0.33, rx: 0.3, rz: -0.2, o: 0.65 },
  { x: 0.86, y: 0.58, s: 0.32, rx: -0.28, rz: 0.3, o: 0.65 },
  { x: 0.85, y: 0.55, s: 0.34, rx: 0.2, rz: 0.25, o: 0.65 },
];
const POSE_HERO: SlideState = {
  x: 0.7,
  y: 0.02,
  s: 1.0,
  rx: 0.16,
  rz: -0.15,
  o: 0.85,
};
const POSE_FAINT: SlideState = {
  x: 0,
  y: 0,
  s: 1.45,
  rx: 0.04,
  rz: 0,
  o: 0.12,
};

const poseFor = (i: number): SlideState => {
  const p = slides[i]?.pose;
  if (p === "hero") return POSE_HERO;
  if (p === "faint") return POSE_FAINT;
  return POSES[i % POSES.length];
};

const toneColor = (tone?: Card["tone"]) =>
  tone === "accent"
    ? "var(--accent)"
    : tone === "warn"
      ? "#b8612f"
      : tone === "ink"
        ? "var(--ink)"
        : undefined;

/* ------------------------------------------------------------------ */
/* CSS: слайд бүр нэг дэлгэцэнд багтана                                */
/* ------------------------------------------------------------------ */

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
.content-side .serif-title{font-size:clamp(28px,5.2vh,56px)!important;line-height:1.1!important;margin:.35em 0 .3em!important}
.content-side .serif-sub{font-size:clamp(15px,2.2vh,21px)!important;line-height:1.4!important;margin:0 0 1.4vh!important}
.content-side .points-list{margin:0!important}
.content-side .point-row{display:flex;gap:14px;align-items:flex-start;padding:1.1vh 0!important;margin:0!important}
.content-side .point-text{font-size:clamp(16px,2.2vh,21px);line-height:1.4}

.visual-side{min-width:0;height:100%;max-height:100%;display:flex;align-items:center;justify-content:center;overflow:hidden}
.photo-frame{position:relative;width:100%;height:min(100%,72vh);border-radius:14px;overflow:hidden}
.photo-frame img{width:100%;height:100%;object-fit:cover;display:block}
.photo-badge{position:absolute;top:12px;left:12px;padding:6px 10px;border-radius:999px;background:rgba(20,40,34,.85);color:#fff;font-size:12px;letter-spacing:.06em}
.photo-source{position:absolute;left:12px;bottom:10px;right:12px;font-size:12px;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.6)}

.paper-card-stack{width:100%;display:flex;flex-direction:column;gap:1.4vh;max-height:100%}
.paper-card{padding:1.6vh 18px;border-radius:12px;background:rgba(255,255,255,.55);border:1px solid rgba(0,0,0,.08);border-left-width:3px}
.card-top{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:.6vh}
.card-title{font-weight:600;font-size:clamp(15px,2.2vh,20px);line-height:1.25}
.card-pill{font-size:11px;letter-spacing:.05em;padding:3px 8px;border-radius:999px;background:rgba(20,40,34,.1);white-space:nowrap}
.card-desc{margin:0;font-size:clamp(14px,2vh,18px);line-height:1.4}
.principle-grid{width:100%;display:grid;grid-template-columns:1fr 1fr;gap:1.4vh 14px}
.principle-tile{padding:1.8vh 16px;border-radius:12px;background:rgba(255,255,255,.55);border:1px solid rgba(0,0,0,.08);display:flex;flex-direction:column;gap:.6vh}
.principle-num{font-size:clamp(12px,1.8vh,15px);opacity:.6;letter-spacing:.08em}
.principle-name{font-weight:600;font-size:clamp(16px,2.4vh,22px);line-height:1.2}

.paper-table-wrap{max-height:60vh;overflow:auto;margin-top:1.2vh}
.paper-table{width:100%;min-width:680px;border-collapse:collapse;font-size:clamp(13px,1.9vh,17px)}
.paper-table th,.paper-table td{padding:1vh 10px;border-bottom:1px solid rgba(0,0,0,.12);text-align:left;vertical-align:top;line-height:1.3}

.refs-columns{columns:2;column-gap:32px;margin-top:1.2vh;font-size:clamp(12px,1.9vh,15px);line-height:1.3;max-height:64vh;overflow:auto}
.ref-item{break-inside:avoid;margin-bottom:1vh}
.ref-idx{font-weight:700;margin-right:6px}

/* Жижиг дэлгэц (утас, намхан цонх): агуулга таслагдахын оронд дотроо гүйлгэнэ */
@media (max-width:820px), (max-height:560px){
  .slides-wrapper main .slide{overflow-y:auto;align-items:flex-start}
  .slide-grid{height:auto;margin-block:auto;grid-template-columns:minmax(0,1fr);gap:16px}
  .content-side{max-height:none;overflow:visible}
  .visual-side{height:auto;max-height:none;overflow:visible}
  .photo-frame{height:30vh}
  .principle-grid{grid-template-columns:1fr}
  .refs-columns{columns:1;max-height:none}
}

/* PDF хэвлэх: слайд бүр нэг хуудас */
@media print{
  @page{size:landscape;margin:0}
  html,body{height:auto;overflow:visible}
  .slides-wrapper,.slides-wrapper main{position:static;overflow:visible}
  .slides-wrapper main .slide{
    position:relative!important;visibility:visible!important;opacity:1!important;
    transform:none!important;pointer-events:auto;overflow:hidden;
    height:100vh;break-after:page;page-break-after:always;
  }
  canvas,.grain,.curtain,.wipe,.progress,.chrome{display:none!important}
}
`;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

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

  // 3D HOURGLASS BACKGROUND
  useEffect(() => {
    const canvas = document.getElementById("gl") as HTMLCanvasElement | null;
    if (!canvas) return;

    const instance = initHourglass(canvas, () => {
      const s = poseFor(indexRef.current);
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        return { x: 0, y: 0.65, s: 0.32, rx: s.rx, rz: s.rz, o: 0.16 };
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

      hourglassRef.current?.onChange(dir);

      const reduceMotion =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

      if (!gsap || reduceMotion) {
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

        if (currentSlideEl) {
          tl.to(
            currentSlideEl,
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
            setIndex(targetIndex);
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
      <style dangerouslySetInnerHTML={{ __html: fitCss }} />
      <canvas id="gl" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      {/* INK CURTAIN TRANSITION */}
      <div className="curtain" ref={curtainRef} aria-hidden="true">
        <div className="cc" ref={curtainCountRef}>
          {`01 / ${String(slides.length).padStart(2, "0")}`}
        </div>
        <div className="cn" ref={curtainNameRef}>
          <span>Нүүр</span>
        </div>
      </div>

      <div className="wipe" ref={wipeRef} aria-hidden="true" />
      <div className="progress" ref={progressRef} />

      {/* TOP CHROME BAR */}
      <header className="chrome top">
        <div className="deck-nav-pills">
          <Link href="/" className="deck-pill active">
            02 · ХАРЬЦУУЛСАН СУДАЛГАА
          </Link>
          <Link href="/biydalt3" className="deck-pill">
            03 · КЕЙС ШИНЖИЛГЭЭ
          </Link>
        </div>
      </header>

      {/* SLIDES */}
      <main ref={slideContainerRef}>
        {slides.map((s, idx) => {
          const isTable = s.layout === "table";
          const isRefs = s.layout === "refs";
          const hasVisual =
            !isTable && !isRefs && Boolean(s.imageSrc || s.cards || s.tiles);

          return (
            <section
              key={idx}
              className={`slide ${idx === index ? "on" : ""}`}
              aria-hidden={idx !== index}
            >
              <div className={`slide-grid ${hasVisual ? "" : "no-visual"}`}>
                {/* Зүүн тал: гарчиг, цэгүүд */}
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

                  {isTable && (
                    <div className="paper-table-wrap">
                      <table className="paper-table">
                        <thead>
                          <tr>
                            {tableHead.map((h) => (
                              <th key={h}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {tableRows.map((row) => (
                            <tr key={row[0]}>
                              {row.map((cell, ci) => (
                                <td key={ci}>
                                  {ci === 0 ? <b>{cell}</b> : cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {isRefs && (
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

                {/* Баруун тал: зураг, карт эсвэл зарчмын хавтан */}
                {hasVisual && (
                  <div className="visual-side">
                    {s.imageSrc ? (
                      <div className="photo-frame">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={s.imageSrc}
                          alt={s.imageAlt ?? "Слайдын зураг"}
                          loading="lazy"
                        />
                        {s.imageBadge && (
                          <div className="photo-badge">{s.imageBadge}</div>
                        )}
                        {s.imageSource && (
                          <div className="photo-source">{s.imageSource}</div>
                        )}
                      </div>
                    ) : s.cards ? (
                      <div className="paper-card-stack">
                        {s.cards.map((c) => (
                          <div
                            className="paper-card"
                            key={c.title}
                            style={
                              toneColor(c.tone)
                                ? { borderLeftColor: toneColor(c.tone) }
                                : undefined
                            }
                          >
                            <div className="card-top">
                              <span className="card-title">{c.title}</span>
                              {c.pill && (
                                <span className="card-pill">{c.pill}</span>
                              )}
                            </div>
                            {c.desc && <p className="card-desc">{c.desc}</p>}
                          </div>
                        ))}
                      </div>
                    ) : s.tiles ? (
                      <div className="principle-grid">
                        {s.tiles.map((name, i) => (
                          <div className="principle-tile" key={name}>
                            <span className="principle-num">0{i + 1}</span>
                            <span className="principle-name">{name}</span>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </section>
          );
        })}
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
