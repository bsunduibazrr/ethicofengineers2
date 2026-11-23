"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

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

const slides: SlideData[] = [
  // 1. Cover
  {
    name: "Нүүр",
    tag: "Химийн инженерийн ёс зүй · Харьцуулсан судалгаа",
    titleHtml: "Мэргэжлийн ёс зүй ба <em class='mark'>хариуцлага<svg class='scr' viewBox='0 0 200 20' preserveAspectRatio='none' aria-hidden='true'><path d='M3 13 C 40 5, 90 17, 130 10 S 185 6, 197 12'/></svg></em>",
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
    titleHtml: "Инженерийн алдаа <em class='mark'>хүний аминд<svg class='scr' viewBox='0 0 200 20' preserveAspectRatio='none' aria-hidden='true'><path d='M3 13 C 40 5, 90 17, 130 10 S 185 6, 197 12'/></svg></em> хүрдэг",
    sub: "1984 оны Бхопалын гамшиг нь химийн инженерийн ёс зүйн бодит үнэ цэнийг харуулсан гашуун сургамж юм.",
    points: [
      {
        bold: "1984 Бхопалын осол:",
        text: "Хорт хий алдагдан 3,500+ хүн амиа алдаж, хагас сая хүн хохирсон [12].",
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
    titleHtml: "Анхдагч хууль тогтоомжид <em class='mark'>суурилсан<svg class='scr' viewBox='0 0 200 20' preserveAspectRatio='none' aria-hidden='true'><path d='M3 13 C 40 5, 90 17, 130 10 S 185 6, 197 12'/></svg></em> шинжилгээ",
    sub: "Зөвхөн тухайн улсын албан ёсны хууль тогтоомж, мэргэжлийн танхим, хороодын баталсан дүрмийг ашиглав.",
    points: [
      {
        bold: "Анхдагч хууль тогтоомж:",
        text: "БНСУ, Франц, Канад 3 улсын албан ёсны хуулиудыг харьцуулав [1-4].",
        ref: "[1-4]",
      },
      {
        bold: "Засаглал ба ТУЗ:",
        text: "Удирдах зөвлөлийн бүтэц, сонгууль, шийдвэр гаргалтыг нарийвчлан шинжлэв.",
      },
      {
        bold: "100% бодит эх сурвалж:",
        text: "Зохиомол тоо баримтгүй, заалт бүрийг баталгаат эх сурвалжтай уяв [1-15].",
        ref: "[1-15]",
      },
    ],
    layout: "metrics",
  },

  // 4. БНСУ: Холбоо ба Хууль
  {
    name: "Өмнөд Солонгос",
    tag: "БНСУ · Холбоо ба Эрх зүй",
    titleHtml: "Төрийн яамны <em class='mark'>хатуу хяналттай<svg class='scr' viewBox='0 0 200 20' preserveAspectRatio='none' aria-hidden='true'><path d='M3 13 C 40 5, 90 17, 130 10 S 185 6, 197 12'/></svg></em> тогтолцоо",
    sub: "БНСУ-д инженерийн мэргэжил нь төрийн тусгай хуулиар зохицуулагддаг хатуу сахилгатай.",
    points: [
      {
        bold: "KPEA (한국기술사회) · 1965 он:",
        text: "Шинжлэх ухаан, МХХТ-ийн яамны (MSIT) хяналтад ажилладаг нэгдэл [1].",
        ref: "[1]",
      },
      {
        bold: "Удирдах зөвлөлийн бүтэц:",
        text: "Сонгуульт ТУЗ нь төрийн техникийн бодлогод шууд зөвлөх үүрэгтэй.",
      },
      {
        bold: "Хуульчилсан үүрэг (Mandatory):",
        text: "'기술사법' (Мэргэжлийн инженерүүдийн хууль)-аар дүрмийг заавал мөрдүүлдэг [1].",
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
    titleHtml: "Нийтийн аюулгүй байдал ба <em class='mark'>тамгалах хариуцлага<svg class='scr' viewBox='0 0 200 20' preserveAspectRatio='none' aria-hidden='true'><path d='M3 13 C 40 5, 90 17, 130 10 S 185 6, 197 12'/></svg></em>",
    sub: "Солонгосын мэргэшсэн инженер (기술사) төсөлд биечлэн тамга дарж хувийн хариуцлага хүлээнэ.",
    points: [
      {
        bold: "Нийтийн аюулгүй байдал:",
        text: "Хүн амын амь нас, эрүүл мэндийг хамгаалах нь үндсэн дээд зарчим [1].",
        ref: "[1]",
      },
      {
        bold: "Биечлэн тамгалах үүрэг:",
        text: "Тооцоололд биечлэн тамга дарна; тамгаа бусдад шилжүүлэхийг хатуу хориглоно.",
      },
      {
        bold: "Хатуу шийтгэл (Лиценз цуцлах):",
        text: "Ноцтой зөрчилд мэргэжлийн лицензийг 1-3 жилээр хасах эсвэл бүрэн цуцална [1].",
        ref: "[1]",
      },
    ],
    layout: "photo",
    imageSrc: "/images/chemical-plant.jpg",
    imageAlt: "Нефть-химийн үйлдвэрлэл",
    imageBadge: "БНСУ · ТАМГАЛАХ ҮҮРЭГ",
    imageSource: "Petrochemical facility · Wikimedia Commons",
  },

  // 6. Франц: UNAFIC холбоо ба Удирдах зөвлөл (ШИНЭЧИЛСЭН)
  {
    name: "Франц: UNAFIC",
    tag: "Франц · Химийн инженерийн холбоо",
    titleHtml: "UNAFIC холбоо ба <em class='mark'>Удирдах зөвлөл<svg class='scr' viewBox='0 0 200 20' preserveAspectRatio='none' aria-hidden='true'><path d='M3 13 C 40 5, 90 17, 130 10 S 185 6, 197 12'/></svg></em>",
    sub: "1910 онд байгуулагдсан Францын Химийн инженерүүдийн холбоонуудын үндэсний нэгдэл.",
    points: [
      {
        bold: "UNAFIC (1910 он):",
        text: "Химийн дээд сургуулиудын төгсөгчдийн холбоодыг нэгтгэсэн үндэсний нэгдэл [2].",
        ref: "[2]",
      },
      {
        bold: "Холбооны зөвлөл (Conseil Fédéral):",
        text: "Сар бүр хуралдаж, бодлого чиглэл, Удирдах багийн хяналтыг хэрэгжүүлнэ [2].",
        ref: "[2]",
      },
      {
        bold: "Удирдах баг (Bureau):",
        text: "Ерөнхийлөгч тэргүүтэй 2 жилийн хугацаатай өдөр тутмын удирдлага [2].",
        ref: "[2]",
      },
    ],
    layout: "france-gov",
  },

  // 7. Франц: Чиг үүрэг & Ач холбогдол (ШИНЭЧИЛСЭН)
  {
    name: "Франц: Чиг үүрэг",
    tag: "Франц · Төлөөлөл ба Карьер",
    titleHtml: "Химийн инженерүүдийг <em class='mark'>төлөөлөх<svg class='scr' viewBox='0 0 200 20' preserveAspectRatio='none' aria-hidden='true'><path d='M3 13 C 40 5, 90 17, 130 10 S 185 6, 197 12'/></svg></em> чиг үүрэг",
    sub: "UNAFIC нь химийн инженерүүдийн эрх ашиг, карьер, боловсролыг тасралтгүй дэмждэг.",
    points: [
      {
        bold: "Мэргэжлийн төлөөлөл:",
        text: "Франц болон олон улсад химийн инженерүүдийн ашиг сонирхлыг төлөөлнө [2].",
        ref: "[2]",
      },
      {
        bold: "Боловсрол & Ажил эрхлэлт:",
        text: "Хөдөлмөр эрхлэлт, цалин хөлсний судалгаа нийтэлж мэдээллээр хангана [2].",
        ref: "[2]",
      },
      {
        bold: "Оюутан, залуу мэргэжилтнүүд:",
        text: "Мэргэжлийн үзэсгэлэн, форум зохион байгуулж, карьерын сүлжээг үүсгэдэг [2].",
      },
    ],
    layout: "photo",
    imageSrc: "/images/france-chimie.jpg",
    imageAlt: "Maison de la Chimie, Парис хот",
    imageBadge: "MAISON DE LA CHIMIE · PARIS",
    imageSource: "Maison de la Chimie · Wikimedia Commons [15]",
  },

  // 8. Франц: Charte ISR (3 хүрээ) (ШИНЭЧИЛСЭН)
  {
    name: "Charte ISR",
    tag: "Франц · Ёс зүйн үндсэн зарчим",
    titleHtml: "Хариуцлагатай инженерийн <em class='mark'>дүрэм<svg class='scr' viewBox='0 0 200 20' preserveAspectRatio='none' aria-hidden='true'><path d='M3 13 C 40 5, 90 17, 130 10 S 185 6, 197 12'/></svg></em> (Charte ISR)",
    sub: "IESF-ээс 2001 онд баталж, 2020-2022 онд нийгэм, байгаль орчинд нийцүүлэн шинэчилсэн [3].",
    points: [
      {
        bold: "1. Хувь хүний хариуцлага:",
        text: "Шинжлэх ухааны баримтад тулгуурлах, алдаагаа хүлээн зөвшөөрөх, ур чадвар [3].",
        ref: "[3]",
      },
      {
        bold: "2. Хамт олон, байгууллага:",
        text: "Эрсдэлийг үнэн зөв мэдээлэх, аюулгүй байдал, эрүүл мэндийг хангах [3].",
        ref: "[3]",
      },
      {
        bold: "3. Нийгэм, байгаль орчин:",
        text: "Байгалийн нөөцийг зохистой ашиглаж, тогтвортой хөгжлийг дэмжих [3].",
        ref: "[3]",
      },
    ],
    layout: "france-pillars",
  },

  // 9. Франц: Санкц & Эрүүгийн хуулийн 121-3 (ШИНЭЧИЛСЭН)
  {
    name: "Францын санкц",
    tag: "Франц · Санкц ба Хуулийн хариуцлага",
    titleHtml: "Санкц ба Эрүүгийн хуулийн <em class='mark'>121-3 дугаар<svg class='scr' viewBox='0 0 200 20' preserveAspectRatio='none' aria-hidden='true'><path d='M3 13 C 40 5, 90 17, 130 10 S 185 6, 197 12'/></svg></em> зүйл",
    sub: "Charte ISR нь сахилгын код биш; хууль зөрчвөл Францын хууль тогтоомжоор шийтгэгдэнэ.",
    points: [
      {
        bold: "Байгууллагын дотоод хариуцлага:",
        text: "Хөдөлмөрийн хууль, дотоод журмын дагуу сануулга, арга хэмжээ авна [2].",
        ref: "[2]",
      },
      {
        bold: "Иргэний эрх зүйн хариуцлага:",
        text: "Бусдад учруулсан хохирлыг нөхөн төлүүлэх үүрэг үүснэ [2].",
      },
      {
        bold: "Эрүүгийн хууль (121-3 дугаар зүйл):",
        text: "Болгоомжгүй байдал, аюулгүй ажиллагааг зөрчсөнөөс хохирол учирвал эрүүгийн ял онооно [5].",
        ref: "[5]",
      },
    ],
    layout: "france-sanctions",
  },

  // 10. Франц: UNAFIC vs IESF харьцуулалт (ШИНЭЧИЛСЭН)
  {
    name: "UNAFIC ба IESF",
    tag: "Франц · Байгууллагын харьцуулалт",
    titleHtml: "UNAFIC болон IESF-ийн <em class='mark'>харилцан нөхөх<svg class='scr' viewBox='0 0 200 20' preserveAspectRatio='none' aria-hidden='true'><path d='M3 13 C 40 5, 90 17, 130 10 S 185 6, 197 12'/></svg></em> үүрэг",
    sub: "Химийн инженерийн дагнасан холбоо ба бүх салбарын нэгдлийн ялгаа.",
    points: [
      {
        bold: "UNAFIC-ийн чиглэл:",
        text: "Химийн инженерийн сургуулиудын төгсөгчдийг нэгтгэж, карьер, ажил эрхлэлтэд төвлөрдөг [2].",
        ref: "[2]",
      },
      {
        bold: "IESF-ийн чиглэл:",
        text: "Бүх салбарын инженерүүдийн ёс зүй (Charte ISR), нийгмийн үүргийг чиглүүлдэг [3].",
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
    titleHtml: "Мужийн бие даасан <em class='mark'>хуульчилсан<svg class='scr' viewBox='0 0 200 20' preserveAspectRatio='none' aria-hidden='true'><path d='M3 13 C 40 5, 90 17, 130 10 S 185 6, 197 12'/></svg></em> засаглал",
    sub: "Канадад инженерийн бүх эрх мужуудад харьяалагддаг бөгөөд үндэсний холбоо нь зөвлөмж өгдөг.",
    points: [
      {
        bold: "Engineers Canada (1936 он):",
        text: "12 мужийн хороодын үндэсний төлөөлөл; удирдамж нь сайн дурынх [4].",
        ref: "[4]",
      },
      {
        bold: "Мужийн хүчирхэг эрх мэдэл:",
        text: "EGBC (BC), PEO (Ontario) нь тухайн мужийн хуулиар лиценз олгодог [4][8].",
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
    titleHtml: "Hold Paramount зарчим ба <em class='mark'>хатуу сахилга<svg class='scr' viewBox='0 0 200 20' preserveAspectRatio='none' aria-hidden='true'><path d='M3 13 C 40 5, 90 17, 130 10 S 185 6, 197 12'/></svg></em>",
    sub: "Канадын ёс зүйн дүрэм нь мужийн хуулиар заавал биелүүлэх үүрэгтэй бөгөөд өндөр торгуультай.",
    points: [
      {
        bold: "Hold Paramount зарчим:",
        text: "Хүний амь нас, байгаль орчныг хамгаалах нь туйлын хуульчилсан үүрэг [4].",
        ref: "[4]",
      },
      {
        bold: "Duty to Report (Шүгэл үлээх):",
        text: "Аюултай зөрчлийг мэдээлээгүй бол инженер өөрөө хариуцлага хүлээнэ [4].",
        ref: "[4]",
      },
      {
        bold: "Өндөр торгууль ($100,000):",
        text: "Мэргэжлийн эрхийг хасах, бүх насаар цуцлах шүүхийн эрхтэй [4].",
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
    titleHtml: "Гурван улсын тогтолцооны <em class='mark'>нэгдсэн харьцуулалт<svg class='scr' viewBox='0 0 200 20' preserveAspectRatio='none' aria-hidden='true'><path d='M3 13 C 40 5, 90 17, 130 10 S 185 6, 197 12'/></svg></em>",
    sub: "Бүтэц, хууль зүйн статус, сахилгын эрх мэдэл болон шүгэл үлээгчийн хамгаалалтыг нэгтгэн харуулав.",
    layout: "table",
  },

  // 14. Ижил ба ялгаатай талууд
  {
    name: "Ижил ба ялгаатай",
    tag: "Дүн шинжилгээ",
    titleHtml: "Ижил төстэй тал ба <em class='mark'>онцлог ялгаа<svg class='scr' viewBox='0 0 200 20' preserveAspectRatio='none' aria-hidden='true'><path d='M3 13 C 40 5, 90 17, 130 10 S 185 6, 197 12'/></svg></em>",
    sub: "Гурван улс нийтийн эрх ашгийг дээдэлдэг боловч хэрэгжүүлэх механизм нь өөр өөр юм.",
    points: [
      {
        bold: "Ижил төстэй тал:",
        text: "Нийтийн аюулгүй байдал, байгаль орчин, ур чадвараа хөгжүүлэхийг бүгд шаарддаг [1-4].",
        ref: "[1-4]",
      },
      {
        bold: "Дүрмийн статусын ялгаа:",
        text: "Канад, Солонгост хуулиар заавал мөрддөг; Францад Charte ISR нь сайн дурынх [1-3].",
        ref: "[1-3]",
      },
      {
        bold: "Санкцын тогтолцооны ялгаа:",
        text: "Канад, Солонгост лиценз цуцалдаг; Францад Эрүүгийн 121-3-аар шүүх шийтгэнэ [5].",
        ref: "[5]",
      },
    ],
    layout: "analysis",
  },

  // 15. Монгол улсад өгөх зөвлөмж
  {
    name: "Монголд өгөх сургамж",
    tag: "Бодлогын зөвлөмж",
    titleHtml: "Монгол улсын химийн салбарт авах <em class='mark'>3 сургамж<svg class='scr' viewBox='0 0 200 20' preserveAspectRatio='none' aria-hidden='true'><path d='M3 13 C 40 5, 90 17, 130 10 S 185 6, 197 12'/></svg></em>",
    sub: "Уул уурхай, хими, эрчим хүчний үйлдвэрүүд хөгжиж буй манай улсад дараах тогтолцоо чухал байна.",
    points: [
      {
        bold: "1. Ёс зүйг хуульчлах:",
        text: "Инженерийн ёс зүйг мэргэшсэн зэрэг, тамгатай шууд уях (Солонгос, Канад загвар) [1][4].",
        ref: "[1][4]",
      },
      {
        bold: "2. Шүгэл үлээгчийг хамгаалах:",
        text: "Химийн хорт бодисын зөрчлийг илчилсэн инженерийг хуулиар хамгаалах (Франц загвар) [2].",
        ref: "[2]",
      },
      {
        bold: "3. Тасралтгүй сургалт (CPD):",
        text: "Аюулгүй байдал, ёс зүйн мэдлэгийг 2-3 жил тутам шалгаж баталгаажуулдаг байх [1][3].",
        ref: "[1][3]",
      },
    ],
    layout: "metrics",
  },

  // 16. Эх сурвалжууд
  {
    name: "Эх сурвалжууд",
    tag: "Албан ёсны эх баримтууд",
    titleHtml: "Баталгаат анхдагч <em class='mark'>эх сурвалжууд<svg class='scr' viewBox='0 0 200 20' preserveAspectRatio='none' aria-hidden='true'><path d='M3 13 C 40 5, 90 17, 130 10 S 185 6, 197 12'/></svg></em>",
    sub: "UNAFIC дүрэм, IESF Charte ISR, Францын Эрүүгийн хууль 121-3, KPEA, EGBC зэрэг үндсэн холбоосууд.",
    layout: "refs",
  },
];

const referencesList = [
  { id: "[1]", title: "Korea Professional Engineers Act (기술사법) & KPEA Ethics Code", url: "https://www.law.go.kr" },
  { id: "[2]", title: "UNAFIC — Албан ёсны дүрэм, зорилго ба удирдлагын бүтэц", url: "https://www.unafic.org/unafic/statuts/" },
  { id: "[3]", title: "IESF — Charte ISR ёс зүйн дүрэм (2020-2022) & Lexique", url: "https://www.iesf.fr/offres/doc_inline_src/752/IESF%2BCharte%2BISR%2Blexique%2BV6.2.pdf" },
  { id: "[4]", title: "Engineers Canada — National Guideline on the Code of Ethics", url: "https://engineerscanada.ca" },
  { id: "[5]", title: "Францын Эрүүгийн хууль (Code pénal) — 121-3 дугаар зүйл", url: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006417208/" },
  { id: "[6]", title: "SFGP — Société Française de Génie des Procédés", url: "https://www.sfgp.asso.fr/" },
  { id: "[7]", title: "Commission des Titres d'Ingénieur (CTI) — Standards & Code", url: "https://www.cti-commission.fr" },
  { id: "[8]", title: "Professional Engineers Ontario (PEO) — O. Reg. 941 Code of Ethics", url: "https://www.peo.on.ca" },
  { id: "[9]", title: "Ordre des ingénieurs du Québec (OIQ) — Code de déontologie", url: "https://www.oiq.qc.ca" },
  { id: "[10]", title: "Independent Expert Engineering Investigation Panel — Mount Polley Report", url: "https://www.mountpolleyreviewpanel.ca" },
  { id: "[11]", title: "EGBC — Three Engineers Disciplined in Mount Polley Dam Breach Investigation", url: "https://www.egbc.ca" },
  { id: "[12]", title: "Bhopal Disaster Records & Chemical Engineering Ethics Case Study", url: "https://commons.wikimedia.org" },
  { id: "[13]", title: "Antoine Lavoisier & History of Chemistry, French Science Academy", url: "https://commons.wikimedia.org" },
  { id: "[14]", title: "Seoul Skyline Night & Korean Industry, Wikimedia Commons", url: "https://commons.wikimedia.org" },
  { id: "[15]", title: "Maison de la Chimie, Paris — French Chemistry Headquarters", url: "https://commons.wikimedia.org" },
];

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

  // THREE.JS BACKGROUND WIREFRAME
  useEffect(() => {
    if (typeof window === "undefined" || !(window as any).THREE) return;
    const THREE = (window as any).THREE;
    const canvas = document.getElementById("gl") as HTMLCanvasElement;
    if (!canvas) return;

    let renderer: any;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, 11);

    const spin = new THREE.Group();
    scene.add(spin);

    const lineMat = new THREE.LineBasicMaterial({ color: 0x15312a, transparent: true, opacity: 0.18 });
    const faintMat = new THREE.LineBasicMaterial({ color: 0x15312a, transparent: true, opacity: 0.08 });

    const geom = new THREE.IcosahedronGeometry(2.8, 1);
    const wire = new THREE.LineSegments(new THREE.WireframeGeometry(geom), lineMat);
    spin.add(wire);

    const outerGeom = new THREE.IcosahedronGeometry(4.2, 0);
    const outerWire = new THREE.LineSegments(new THREE.WireframeGeometry(outerGeom), faintMat);
    spin.add(outerWire);

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      spin.rotation.y += 0.0015;
      spin.rotation.x += 0.0008;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // INSANE CURTAIN & WIPE TRANSITION FUNCTION
  const goToSlide = useCallback(
    (targetIndex: number) => {
      if (targetIndex === index || isBusy || targetIndex < 0 || targetIndex >= slides.length) return;
      const gsap = (window as any).gsap;

      const dir = targetIndex > index ? 1 : -1;
      const targetSlide = slides[targetIndex];

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

        // 1. Current slide exits upward/downward
        if (currentSlideEl) {
          tl.to(currentSlideEl, { y: -50 * dir, opacity: 0.15, duration: 0.42, ease: "power3.in" }, 0);
        }

        // 2. Ink curtain pulls across screen
        tl.fromTo(curtain, { clipPath: from }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.48, ease: "power3.inOut" }, 0)
          .fromTo(cn.querySelector("span"), { yPercent: 110 * dir, rotate: 3 * dir }, { yPercent: 0, rotate: 0, duration: 0.6, ease: "expo.out" }, 0.18)
          .fromTo(cc, { opacity: 0, x: -16 }, { opacity: 0.65, x: 0, duration: 0.4, ease: "expo.out" }, 0.22)
          .add(() => {
            setIndex(targetIndex);
          }, 0.6)
          .to(cn.querySelector("span"), { yPercent: -110 * dir, duration: 0.38, ease: "power3.in" }, 0.66)
          .to(curtain, { clipPath: to, duration: 0.55, ease: "power3.inOut" }, 0.78);

        // 3. Hairline wipe bar sweeps across
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

  // Update progress bar
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
      {/* Three.js Canvas Background */}
      <canvas id="gl" aria-hidden="true" />

      {/* Animated Paper Grain */}
      <div className="grain" aria-hidden="true" />

      {/* INSANE INK CURTAIN TRANSITION */}
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
        <div className="chrome-brand">
          <b>БИЕ ДААЛТ 02</b>
          <span>·</span>
          <span>Химийн инженерийн ёс зүй</span>
        </div>

        {/* Deck Switcher Tabs */}
        <div className="deck-nav-pills">
          <Link href="/" className="deck-pill active">
            02 · ХАРЬЦУУЛСАН СУДАЛГАА
          </Link>
          <Link href="/biydalt3" className="deck-pill">
            03 · КЕЙС ШИНЖИЛГЭЭ
          </Link>
        </div>

        <div className="chrome-meta">
          <span>СУДАЛГААНЫ АЖИЛ · 2026</span>
        </div>
      </header>

      {/* SLIDES STACK */}
      <main ref={slideContainerRef}>
        {slides.map((s, idx) => (
          <section
            key={idx}
            className={`slide ${idx === index ? "on" : ""}`}
            data-name={s.name}
          >
            <div className={`grid2 ${s.layout === "table" || s.layout === "refs" ? "full" : ""}`}>
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
                          <b>{pt.bold}</b> {pt.text}
                          {pt.ref && <span className="ref-badge">{pt.ref}</span>}
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
                          <td><b>Гол холбоо</b></td>
                          <td>KPEA (1965 он) [1]</td>
                          <td>UNAFIC (1910) / IESF [2][3]</td>
                          <td>Engineers Canada (1936) [4]</td>
                        </tr>
                        <tr>
                          <td><b>ТУЗ-ийн бүтэц</b></td>
                          <td>Яамны хяналттай сонгуульт ТУЗ [1]</td>
                          <td>Холбооны зөвлөл & Удирдах баг [2]</td>
                          <td>Олон нийтийн төлөөлөлтэй ТУЗ [4]</td>
                        </tr>
                        <tr>
                          <td><b>Дүрмийн статус</b></td>
                          <td><span className="tag-mand">Хуулиар заавал</span> (기술사법) [1]</td>
                          <td><span className="tag-vol">Сайн дурын харти</span> (Charte ISR) [3]</td>
                          <td><span className="tag-mand">Хуулиар заавал</span> (Мужийн хууль) [4]</td>
                        </tr>
                        <tr>
                          <td><b>Санкцын систем</b></td>
                          <td>Тамга хасах, лиценз цуцлах [1]</td>
                          <td>Холбоо шийтгэхгүй; Эрүүгийн 121-3 [5]</td>
                          <td>$100,000 хүртэл торгууль, эрх хасах [4]</td>
                        </tr>
                        <tr>
                          <td><b>Шүгэл үлээлт</b></td>
                          <td>Дүрмийн зөвшөөрөлтэй [1]</td>
                          <td>Loi Sapin II хуулиар хамгаална [2]</td>
                          <td>Хуульчилсан үүрэг (Duty to Report) [4]</td>
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

              {/* Right Column: Visual Component / Photo */}
              {s.layout !== "table" && s.layout !== "refs" && (
                <div className="visual-holder">
                  {s.imageSrc ? (
                    <div className="photo-frame">
                      <img src={s.imageSrc} alt={s.imageAlt ?? "Slide illustration"} />
                      <div className="photo-caption">
                        <div>
                          <span className="caption-tag">{s.imageBadge ?? "БАРИМТЖУУЛАЛТ"}</span>
                          <span style={{ fontSize: "11px" }}>{s.imageAlt}</span>
                        </div>
                        {s.imageSource && <span className="caption-src">{s.imageSource}</span>}
                      </div>
                    </div>
                  ) : s.layout === "france-gov" ? (
                    /* French Governance: Conseil Fédéral & Bureau */
                    <div className="paper-card-stack">
                      <div className="paper-card">
                        <div className="card-top">
                          <span className="card-title">Холбооны зөвлөл (Conseil Fédéral)</span>
                          <span className="card-pill">САР БҮР</span>
                        </div>
                        <p className="card-desc">
                          Холбоодын ерөнхийлөгч, томилсон төлөөлөгчдөөс бүрдэнэ. Холбооны бодлого, гишүүнчлэл, Удирдах багийн хяналтыг хэрэгжүүлнэ [2].
                        </p>
                      </div>

                      <div className="paper-card">
                        <div className="card-top">
                          <span className="card-title">Удирдах баг (Bureau)</span>
                          <span className="card-pill">2 ЖИЛ</span>
                        </div>
                        <p className="card-desc">
                          Ерөнхий ассамблейгаас сонгогдоно. Ерөнхийлөгч, нарийн бичгийн дарга, санхүүчээс бүрдэж өдөр тутмын үйл ажиллагааг хариуцна [2].
                        </p>
                      </div>

                      <div className="paper-card">
                        <div className="card-top">
                          <span className="card-title">Ерөнхий ассамблей (Assemblée Générale)</span>
                          <span className="card-pill">ЖИЛД 1 УДАА</span>
                        </div>
                        <p className="card-desc">
                          Жил бүр хуралдаж тайлан сонсох, санхүүгийн төсөв батлах, Удирдах багийг 2 жилийн хугацаатай сонгоно [2].
                        </p>
                      </div>
                    </div>
                  ) : s.layout === "france-pillars" ? (
                    /* French Charte ISR 3 Pillars */
                    <div className="paper-card-stack">
                      <div className="paper-card">
                        <div className="card-top">
                          <span className="card-title">1. Хувь хүний хариуцлага</span>
                          <span className="card-pill">ЗАРЧИМ</span>
                        </div>
                        <p className="card-desc">
                          Шинжлэх ухааны баримтад тулгуурлах, шүүмжлэлтэй сэтгэх, алдаагаа хүлээн зөвшөөрч тасралтгүй суралцах [3].
                        </p>
                      </div>

                      <div className="paper-card">
                        <div className="card-top">
                          <span className="card-title">2. Хамт олон, байгууллагын хариуцлага</span>
                          <span className="card-pill">АЮУЛГҮЙ БАЙДАЛ</span>
                        </div>
                        <p className="card-desc">
                          Эрсдэлийг үнэн зөв мэдээлэх, аюулгүй байдлыг хангах, ажилтан, хэрэглэгчийн эрүүл мэндийг хамгаалах [3].
                        </p>
                      </div>

                      <div className="paper-card">
                        <div className="card-top">
                          <span className="card-title">3. Нийгэм, байгаль орчны хариуцлага</span>
                          <span className="card-pill">ТОГТВОРТОЙ ХӨГЖИЛ</span>
                        </div>
                        <p className="card-desc">
                          Байгалийн нөөцийг зохистой ашиглах, бохирдлыг бууруулах, тогтвортой хөгжлийг дэмжих [3].
                        </p>
                      </div>
                    </div>
                  ) : s.layout === "france-sanctions" ? (
                    /* French Legal Sanctions Stack */
                    <div className="paper-card-stack">
                      <div className="paper-card" style={{ borderLeft: "3px solid var(--ink)" }}>
                        <div className="card-top">
                          <span className="card-title">1. Байгууллагын дотоод хариуцлага</span>
                          <span className="card-pill">САХИЛГА</span>
                        </div>
                        <p className="card-desc">
                          Ажил олгогч нь дотоод журам, хөдөлмөрийн гэрээний дагуу сануулга өгөх болон сахилгын арга хэмжээ авна.
                        </p>
                      </div>

                      <div className="paper-card" style={{ borderLeft: "3px solid var(--accent)" }}>
                        <div className="card-top">
                          <span className="card-title">2. Иргэний эрх зүйн хариуцлага</span>
                          <span className="card-pill">ХОХИРОЛ НӨХӨН ТӨЛБӨР</span>
                        </div>
                        <p className="card-desc">
                          Бусдад болон байгаль орчинд учруулсан хохирлыг нөхөн төлүүлэх хуулийн үүрэг үүснэ.
                        </p>
                      </div>

                      <div className="paper-card" style={{ borderLeft: "3px solid #b8612f" }}>
                        <div className="card-top">
                          <span className="card-title">3. Эрүүгийн хуулийн 121-3 дугаар зүйл</span>
                          <span className="card-pill" style={{ background: "rgba(184, 97, 47, 0.2)", color: "#b8612f" }}>
                            ЭРҮҮГИЙН ЯЛ
                          </span>
                        </div>
                        <p className="card-desc">
                          Хайхрамжгүй байдал, аюулгүй ажиллагааны үүргээ зөрчсөнөөс ноцтой хор уршиг учирвал эрүүгийн ял шийтгэнэ [5].
                        </p>
                      </div>
                    </div>
                  ) : s.layout === "france-vs-iesf" ? (
                    /* UNAFIC vs IESF */
                    <div className="paper-card-stack">
                      <div className="paper-card">
                        <div className="card-top">
                          <span className="card-title">UNAFIC (Химийн холбоо)</span>
                          <span className="card-pill">ХИМИЙН ИНЖЕНЕР</span>
                        </div>
                        <p className="card-desc">
                          Химийн инженерийн сургуулиудын төгсөгчдийг нэгтгэдэг. Мэргэжлийг төлөөлөх, боловсрол, цалин, ажил эрхлэлтэд төвлөрдөг [2].
                        </p>
                      </div>

                      <div className="paper-card">
                        <div className="card-top">
                          <span className="card-title">IESF (Үндэсний нэгдэл)</span>
                          <span className="card-pill">НИЙТ ИНЖЕНЕРҮҮД</span>
                        </div>
                        <p className="card-desc">
                          Бүх салбарын инженерүүдийг хамарсан өргөн хүрээтэй. Ёс зүйн суурь дүрэм болох <b>Charte ISR</b>-ийг боловсруулан гаргадаг [3].
                        </p>
                      </div>
                    </div>
                  ) : s.layout === "metrics" ? (
                    <div className="metrics-row">
                      <div className="metric-card">
                        <div className="metric-num">03</div>
                        <div className="metric-label">Харьцуулсан өндөр хөгжилтэй улс</div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-num">1910</div>
                        <div className="metric-label">UNAFIC-ийн анх үүссэн түүхэн он</div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-num">121-3</div>
                        <div className="metric-label">Францын эрүүгийн хуулийн зүйл анги</div>
                      </div>
                    </div>
                  ) : s.layout === "analysis" ? (
                    <div className="paper-card-stack">
                      <div className="paper-card">
                        <div className="card-top">
                          <span className="card-title">БНСУ (Өмнөд Солонгос)</span>
                          <span className="card-pill">ТӨРИЙН САХИЛГА</span>
                        </div>
                        <p className="card-desc">Шинжлэх ухааны яамны шууд хяналт; биечлэн тамгалах хуулийн хатуу үүрэгтэй [1].</p>
                      </div>
                      <div className="paper-card">
                        <div className="card-top">
                          <span className="card-title">Франц улс</span>
                          <span className="card-pill">МЭРГЭЖЛИЙН ХОЛБОО + ХУУЛЬ</span>
                        </div>
                        <p className="card-desc">UNAFIC холбоо нь ажил эрхлэлтийг дэмжинэ; зөрчлийг Эрүүгийн 121-3 дугаар зүйлээр шийднэ [2][5].</p>
                      </div>
                      <div className="paper-card">
                        <div className="card-top">
                          <span className="card-title">Канад улс</span>
                          <span className="card-pill">МУЖИЙН ХУУЛЬ</span>
                        </div>
                        <p className="card-desc">$100,000 хүртэл торгууль, эрсдэлийг мэдээлэх хуульчилсан хатуу үүрэгтэй [4].</p>
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
