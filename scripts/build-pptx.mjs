/**
 * Бие даалт 02, 03-ыг засварлах боломжтой PowerPoint (.pptx) болгон гаргана.
 * Агуулгыг вэбтэй ижил src/decks/*.ts файлуудаас уншина.
 *
 *   node scripts/build-pptx.mjs        →  public/downloads/biydalt2.pptx, biydalt3.pptx
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pptxgen from "pptxgenjs";
import JSZip from "jszip";
import sharp from "sharp";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  ArrowDown,
  BookOpen,
  Check,
  CircleAlert,
  CircleHelp,
  Landmark,
  Scale,
  X,
} from "lucide-react";
import * as D2 from "../src/decks/biydalt2.ts";
import * as D3 from "../src/decks/biydalt3.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public/downloads");
const ASSETS = path.join(ROOT, "scripts/pptx-assets");

/* ------------------------------------------------------------------ */
/* Design tokens (globals.css-тэй ижил)                                */
/* ------------------------------------------------------------------ */

const C = {
  paper: "EDE6DC", // дэвсгэр зургийн бодит өнгө
  ink: "15312A",
  ink2: "3C524A",
  mute: "7F8C83",
  rule: "D6CDBB",
  accent: "B8612F",
  accentSoft: "ECDCCC",
  accentLight: "E7A477",
  card: "F7F3EC",
  white: "FFFFFF",
};
const SERIF = "Georgia";
const SANS = "Arial";

const W = 13.333;
const H = 7.5;
const MX = 0.75;
const TOP = 0.8; // агуулгын дээд хил
const BOTTOM = 6.86; // агуулгын доод хил

/* ------------------------------------------------------------------ */
/* Text helpers                                                        */
/* ------------------------------------------------------------------ */

const clean = (t) =>
  String(t ?? "")
    .replace(/\s+/g, " ")
    .trim();

/** Текстийн мөрийн тоог ойролцоогоор (Кирилл үсгийн дундаж өргөнөөр) */
function lineCount(text, pt, w, k = 0.56) {
  const per = Math.max(1, Math.floor(w / ((pt / 72) * k)));
  return clean(text)
    .split("\n")
    .reduce((n, p) => {
      // үг таслахгүй: үгээр нь багцалж тооцно
      let lines = 1;
      let cur = 0;
      for (const word of p.split(" ")) {
        const len = word.length + (cur ? 1 : 0);
        if (cur + len > per && cur > 0) {
          lines++;
          cur = word.length;
        } else cur += len;
      }
      return n + lines;
    }, 0);
}
const textH = (text, pt, w, ls = 1.25, k) =>
  (lineCount(text, pt, w, k) * pt * ls) / 72;

/** [n] ишлэл ба "мэдээлэл олдсонгүй"-г тусгай хэлбэржүүлнэ */
function runs(text, o = {}) {
  const t = clean(text);
  const parts = t
    .split(/(\s?(?:\[\d+\])+|Баталгаатай мэдээлэл олдсонгүй)/g)
    .filter(Boolean);
  return parts.map((p) => {
    if (/^\s?\[/.test(p))
      return {
        text: " " + p.trim(),
        options: {
          ...o,
          color: o.refColor ?? C.mute,
          fontSize: Math.max(7, (o.fontSize ?? 13) * 0.72),
          bold: false,
          italic: false,
        },
      };
    if (p === D2.NO_INFO)
      return {
        text: p,
        options: { ...o, italic: true, color: o.naColor ?? C.mute },
      };
    return { text: p, options: { ...o } };
  });
}

/** Гарчгийн HTML → runs (mark хийсэн үгийг налуу, accent өнгөөр) */
function titleRuns(html, o = {}) {
  const out = [];
  const re = /<em class='mark'>(.*?)<svg[\s\S]*?<\/svg><\/em>/g;
  let last = 0;
  let m;
  while ((m = re.exec(html))) {
    if (m.index > last)
      out.push({ text: html.slice(last, m.index), options: { ...o } });
    out.push({ text: m[1], options: { ...o, italic: true, color: C.accent } });
    last = re.lastIndex;
  }
  if (last < html.length)
    out.push({ text: html.slice(last), options: { ...o } });
  return out
    .map((r) => ({ ...r, text: r.text.replace(/\s+/g, " ") }))
    .filter((r) => r.text.length);
}
const plainTitle = (html) =>
  clean(html.replace(/<svg[\s\S]*?<\/svg>/g, "").replace(/<[^>]+>/g, ""));

/* ------------------------------------------------------------------ */
/* Image helpers                                                       */
/* ------------------------------------------------------------------ */

const iconCache = new Map();
async function icon(Comp, color, sw = 1.7) {
  const key = `${Comp.displayName}-${color}-${sw}`;
  if (iconCache.has(key)) return iconCache.get(key);
  const svg = renderToStaticMarkup(
    createElement(Comp, { size: 256, color: "#" + color, strokeWidth: sw }),
  );
  const buf = await sharp(Buffer.from(svg), { density: 300 })
    .resize(256, 256)
    .png()
    .toBuffer();
  const data = "image/png;base64," + buf.toString("base64");
  iconCache.set(key, data);
  return data;
}

const DPI = 170;
const CUR = { deck: "", i: 0 };
/** Зургийг хүрээнд таарч тайрч, доод градиент, бөөрөнхий булан (дэвсгэрийн өнгөөр) нэмнэ */
async function photo(src, w, h, { radius = 0.16, grad = "bottom" } = {}) {
  const pw = Math.round(w * DPI);
  const ph = Math.round(h * DPI);
  const r = Math.round(radius * DPI);
  const file = path.join(ROOT, "public", src);
  const gradSvg =
    grad === "left"
      ? `<linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#15312a" stop-opacity=".95"/><stop offset=".55" stop-color="#15312a" stop-opacity=".82"/><stop offset="1" stop-color="#15312a" stop-opacity=".45"/></linearGradient>`
      : `<linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset=".55" stop-color="#15312a" stop-opacity="0"/><stop offset="1" stop-color="#15312a" stop-opacity=".6"/></linearGradient>`;
  const overlay = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${pw}" height="${ph}"><defs>${gradSvg}</defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`,
  );
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${pw}" height="${ph}"><rect width="${pw}" height="${ph}" rx="${r}" ry="${r}" fill="#fff"/></svg>`,
  );
  const img = await sharp(file)
    .resize(pw, ph, { fit: "cover", position: "attention" })
    .modulate({ saturation: 0.92 })
    .composite([{ input: overlay }])
    .png()
    .toBuffer();
  const rounded = await sharp(img)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
  const flat = await sharp({
    create: { width: pw, height: ph, channels: 3, background: "#" + C.paper },
  })
    .composite([{ input: rounded }])
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer();
  return "image/jpeg;base64," + flat.toString("base64");
}

const bgData = (name) =>
  "image/jpeg;base64," +
  fs.readFileSync(path.join(ASSETS, name)).toString("base64");

/* ------------------------------------------------------------------ */
/* Drawing primitives                                                  */
/* ------------------------------------------------------------------ */

function makeKit(pres) {
  const S = pres.shapes;

  const text = (sl, t, o) =>
    sl.addText(t, {
      margin: 0,
      valign: "top",
      fontFace: SANS,
      color: C.ink,
      isTextBox: true,
      ...o,
    });

  const rrect = (
    sl,
    x,
    y,
    w,
    h,
    {
      fill = C.card,
      line,
      lineW = 0.75,
      r = 0.16,
      dash,
      transparency,
      shadow,
    } = {},
  ) =>
    sl.addShape(S.ROUNDED_RECTANGLE, {
      x,
      y,
      w,
      h,
      rectRadius: r,
      fill: fill
        ? { color: fill, transparency: transparency ?? 0 }
        : { type: "none" },
      line: line
        ? { color: line, width: lineW, dashType: dash ?? "solid" }
        : { type: "none" },
      shadow: shadow
        ? {
            type: "outer",
            color: C.ink,
            opacity: 0.28,
            blur: 18,
            offset: 6,
            angle: 90,
          }
        : undefined,
    });

  const circle = (sl, x, y, d, fill, line) =>
    sl.addShape(S.OVAL, {
      x,
      y,
      w: d,
      h: d,
      fill: fill ? { color: fill } : { type: "none" },
      line: line ? { color: line, width: 1.25 } : { type: "none" },
    });

  const hline = (sl, x, y, w, color = C.rule, width = 0.75) =>
    sl.addShape(S.LINE, { x, y, w, h: 0, line: { color, width } });

  const vline = (sl, x, y, h, color = C.rule, width = 1) =>
    sl.addShape(S.LINE, { x, y, w: 0, h, line: { color, width } });

  /** дугуй дотор icon */
  const iconDisc = async (
    sl,
    Comp,
    x,
    y,
    d,
    { bg = C.accentSoft, fg = C.accent, sw = 1.6, ratio = 0.5 } = {},
  ) => {
    circle(sl, x, y, d, bg);
    const s = d * ratio;
    sl.addImage({
      data: await icon(Comp, fg, sw),
      x: x + (d - s) / 2,
      y: y + (d - s) / 2,
      w: s,
      h: s,
    });
  };
  const iconAt = async (sl, Comp, x, y, s, color = C.accent, sw = 1.8) =>
    sl.addImage({ data: await icon(Comp, color, sw), x, y, w: s, h: s });

  /** жижиг mono маягийн шошго */
  const label = (sl, t, x, y, w, color = C.accent, o = {}) =>
    text(sl, clean(t).toUpperCase(), {
      x,
      y,
      w,
      h: 0.22,
      fontSize: 8,
      bold: true,
      color,
      charSpacing: 1.5,
      ...o,
    });

  return { text, rrect, circle, hline, vline, iconDisc, iconAt, label };
}

/* ------------------------------------------------------------------ */
/* Deck-level frame: chrome, head                                      */
/* ------------------------------------------------------------------ */

function chrome(K, sl, { deckNo, sub, i, n, name }) {
  K.text(
    sl,
    [
      { text: `БИЕ ДААЛТ ${deckNo}`, options: { bold: true, color: C.accent } },
      { text: "  ·  ", options: { color: C.mute } },
      { text: sub.toUpperCase(), options: { color: C.ink2 } },
    ],
    { x: MX, y: 0.28, w: 7, h: 0.22, fontSize: 8, charSpacing: 1.5 },
  );
  K.text(
    sl,
    [
      {
        text: String(i + 1).padStart(2, "0"),
        options: { bold: true, color: C.ink },
      },
      { text: ` / ${String(n).padStart(2, "0")}`, options: { color: C.mute } },
      { text: `   ${name.toUpperCase()}`, options: { color: C.ink2 } },
    ],
    { x: MX, y: H - 0.42, w: 7, h: 0.22, fontSize: 8, charSpacing: 1.2 },
  );
}

/** pill-ийн өргөн */
const pillW = (t, pt = 7) => 0.2 + clean(t).length * (pt / 72) * 0.66;

/** Толгой: улсын код + tag, алхмын pill-үүд, гарчиг. Өндрийг буцаана. */
function headBlock(K, { flag, tag, steps, step, title, w, titlePt = 30 }) {
  const titleLines = lineCount(plainTitle(title), titlePt, w, 0.57);
  const titleH = (titleLines * titlePt * 1.12) / 72 + 0.06;
  const stepsH = steps ? 0.4 : 0;
  const h = 0.3 + stepsH + 0.12 + titleH;
  const draw = (sl, x, y) => {
    let tx = x;
    if (flag) {
      K.rrect(sl, x, y + 0.01, 0.36, 0.21, { fill: C.ink, r: 0.04 });
      K.text(sl, flag, {
        x,
        y: y + 0.01,
        w: 0.36,
        h: 0.21,
        fontSize: 7.5,
        bold: true,
        color: C.paper,
        align: "center",
        valign: "middle",
        charSpacing: 1,
      });
      tx += 0.48;
    }
    K.label(sl, tag, tx, y + 0.02, w - (tx - x), C.accent);
    let yy = y + 0.3;
    if (steps) {
      let px = x;
      steps.forEach((st, i) => {
        const pw = pillW(st);
        const on = i === step;
        const done = i < step;
        K.rrect(sl, px, yy + 0.03, pw, 0.24, {
          fill: on ? C.accent : null,
          line: on ? C.accent : done ? C.ink2 : C.rule,
          r: 0.12,
        });
        K.text(sl, st.toUpperCase(), {
          x: px,
          y: yy + 0.03,
          w: pw,
          h: 0.24,
          fontSize: 7,
          align: "center",
          valign: "middle",
          color: on ? C.white : done ? C.ink2 : C.mute,
          bold: on,
          charSpacing: 0.8,
        });
        px += pw + 0.07;
      });
      yy += stepsH;
    }
    K.text(sl, titleRuns(title), {
      x,
      y: yy + 0.1,
      w,
      h: titleH,
      fontFace: SERIF,
      fontSize: titlePt,
      color: C.ink,
      lineSpacingMultiple: 0.98,
    });
  };
  return { h, draw };
}

const subBlock = (K, t, w, pt = 14) => {
  const h = textH(t, pt, w, 1.3, 0.56) + 0.04;
  return {
    h,
    draw: (sl, x, y) =>
      K.text(sl, runs(t, { fontSize: pt }), {
        x,
        y,
        w,
        h,
        fontFace: SERIF,
        italic: true,
        fontSize: pt,
        color: C.ink2,
      }),
  };
};

/** Блокуудыг босоо чиглэлд голлуулж байрлуулна */
async function stack(
  sl,
  blocks,
  x,
  { top = TOP, bottom = BOTTOM, gap = 0.18, align = "center" } = {},
) {
  const total = blocks.reduce((s, b) => s + b.h, 0) + gap * (blocks.length - 1);
  if (total > bottom - top + 0.01)
    console.warn(
      `  ! багтахгүй: ${CUR.deck} слайд ${CUR.i + 1} (${total.toFixed(2)} > ${(bottom - top).toFixed(2)} in)`,
    );
  let y =
    align === "center" ? top + Math.max(0, (bottom - top - total) / 2) : top;
  for (const b of blocks) {
    await b.draw(sl, x, y);
    y += b.h + (b.gapAfter ?? gap);
  }
  return total;
}

/* ------------------------------------------------------------------ */
/* Reusable content blocks                                             */
/* ------------------------------------------------------------------ */

function statsBlock(K, stats, w) {
  const n = stats.length;
  const gap = 0.3;
  const cw = (w - gap * (n - 1)) / n;
  const labH =
    Math.max(...stats.map((s) => textH(s.label, 11, cw, 1.25))) + 0.04;
  const h = 0.1 + 0.28 + 0.58 + 0.04 + labH;
  return {
    h,
    draw: async (sl, x, y) => {
      for (let i = 0; i < n; i++) {
        const s = stats[i];
        const cx = x + i * (cw + gap);
        K.hline(sl, cx, y, cw, C.ink, 1.25);
        await K.iconAt(sl, s.icon, cx, y + 0.12, 0.22, C.accent, 1.7);
        K.text(sl, s.num, {
          x: cx,
          y: y + 0.38,
          w: cw + 0.2,
          h: 0.58,
          fontFace: SERIF,
          fontSize: 31,
          color: C.ink,
          valign: "middle",
        });
        K.text(sl, runs(s.label, { fontSize: 11 }), {
          x: cx,
          y: y + 0.98,
          w: cw,
          h: labH,
          fontSize: 11,
          color: C.ink2,
        });
      }
    },
  };
}

function factsBlock(K, facts, w, pt = 12.5) {
  const rows = facts.map((f) => {
    const t = (f.bold ? f.bold + " " : "") + f.text;
    return { f, h: Math.max(0.3, textH(t, pt, w - 0.42, 1.25)) };
  });
  const gap = 0.1;
  const h = rows.reduce((s, r) => s + r.h, 0) + gap * (rows.length - 1);
  return {
    h,
    draw: async (sl, x, y) => {
      let yy = y;
      for (const { f, h: rh } of rows) {
        await K.iconAt(
          sl,
          f.icon,
          x,
          yy + 0.02,
          0.22,
          f.muted ? C.mute : C.accent,
          1.8,
        );
        const body = [];
        if (f.bold)
          body.push({
            text: f.bold + " ",
            options: { bold: true, fontSize: pt },
          });
        body.push(
          ...runs(f.text, { fontSize: pt, color: f.muted ? C.ink2 : C.ink }),
        );
        K.text(sl, body, {
          x: x + 0.38,
          y: yy,
          w: w - 0.42,
          h: rh,
          fontSize: pt,
          color: C.ink,
          lineSpacingMultiple: 1.05,
        });
        yy += rh + gap;
      }
    },
  };
}

/** Зургийн хүрээ: сүүдэр, badge, эх сурвалж */
async function photoFrame(K, sl, p, x, y, w, h) {
  K.rrect(sl, x, y, w, h, { fill: C.ink, r: 0.16, shadow: true });
  sl.addImage({ data: await photo(p.src, w, h), x, y, w, h, altText: p.alt });
  const bw = pillW(p.badge, 7.5) + 0.1;
  K.rrect(sl, x + 0.18, y + 0.18, bw, 0.28, {
    fill: C.ink,
    r: 0.14,
    transparency: 12,
  });
  K.text(sl, p.badge, {
    x: x + 0.18,
    y: y + 0.18,
    w: bw,
    h: 0.28,
    fontSize: 7.5,
    color: C.paper,
    align: "center",
    valign: "middle",
    charSpacing: 1.2,
  });
  K.text(sl, p.credit, {
    x: x + 0.2,
    y: y + h - 0.34,
    w: w - 0.4,
    h: 0.22,
    fontSize: 7.5,
    color: "F2EEE8",
    align: "right",
  });
}

/** Карт: icon дугуй, pill/дугаар, гарчиг, тайлбар, нэмэлт */
async function card(
  K,
  sl,
  c,
  x,
  y,
  w,
  h,
  { titlePt = 19, descPt = 12.5, num } = {},
) {
  const dark = c.tone === "ink";
  const warn = c.tone === "warn";
  const acc = c.tone === "accent";
  K.rrect(sl, x, y, w, h, {
    fill: dark ? C.ink : warn ? null : acc ? C.accentSoft : C.card,
    line: dark ? C.ink : warn ? C.accent : C.rule,
    dash: warn ? "dash" : undefined,
    lineW: warn ? 1.1 : 0.75,
  });
  const p = 0.28;
  await K.iconDisc(sl, c.icon, x + p, y + p, 0.6, {
    bg: dark ? "2C4640" : C.accentSoft,
    fg: dark ? C.accentLight : C.accent,
  });
  const pill = c.pill ?? (num !== undefined ? `0${num}` : null);
  if (pill)
    K.text(sl, pill.toUpperCase(), {
      x: x + w - p - 2.2,
      y: y + p + 0.04,
      w: 2.2,
      h: 0.22,
      fontSize: 7.5,
      bold: true,
      color: dark ? C.accentLight : C.accent,
      align: "right",
      charSpacing: 1.2,
    });

  const iw = w - 2 * p;
  const tH = textH(c.title, titlePt, iw, 1.15, 0.5);
  const dH = textH(c.desc, descPt, iw, 1.3);
  const eH = c.extra ? textH(c.extra, descPt + 0.5, iw, 1.28, 0.5) + 0.2 : 0;
  const blockH = tH + 0.08 + dH + eH;
  let yy = y + h - p - blockH;
  K.text(sl, c.title, {
    x: x + p,
    y: yy,
    w: iw,
    h: tH,
    fontFace: SERIF,
    fontSize: titlePt,
    color: dark ? C.paper : C.ink,
    lineSpacingMultiple: 0.95,
  });
  yy += tH + 0.08;
  K.text(
    sl,
    runs(c.desc, {
      fontSize: descPt,
      refColor: dark ? "9AA8A0" : C.mute,
      naColor: dark ? "C9D1CB" : C.mute,
    }),
    {
      x: x + p,
      y: yy,
      w: iw,
      h: dH,
      fontSize: descPt,
      color: dark ? "E8E2D6" : C.ink,
      lineSpacingMultiple: 1.08,
    },
  );
  yy += dH;
  if (c.extra) {
    K.hline(sl, x + p, yy + 0.09, iw, dark ? "3A524B" : C.rule);
    K.text(
      sl,
      runs(c.extra, {
        fontSize: descPt + 0.5,
        refColor: dark ? "9AA8A0" : C.mute,
      }),
      {
        x: x + p,
        y: yy + 0.17,
        w: iw,
        h: eH - 0.17,
        fontFace: SERIF,
        italic: true,
        fontSize: descPt + 0.5,
        color: dark ? "D8D2C6" : C.ink2,
      },
    );
  }
}

/** Карт ямар өндөр байх ёстойг тооцно */
function cardNeed(c, w, { titlePt = 19, descPt = 12.5 } = {}) {
  const iw = w - 0.56;
  return (
    0.28 +
    0.6 +
    0.3 +
    textH(c.title, titlePt, iw, 1.15, 0.5) +
    0.08 +
    textH(c.desc, descPt, iw, 1.3) +
    (c.extra ? textH(c.extra, descPt + 0.5, iw, 1.28, 0.5) + 0.2 : 0) +
    0.28
  );
}

function verdictBlock(K, t, w, IconC) {
  const h = Math.max(0.5, textH(t, 13, w - 0.9, 1.25) + 0.24);
  return {
    h,
    draw: async (sl, x, y) => {
      K.rrect(sl, x, y, w, h, { fill: C.accentSoft, r: 0.12 });
      if (IconC)
        await K.iconAt(
          sl,
          IconC,
          x + 0.25,
          y + (h - 0.22) / 2,
          0.22,
          C.accent,
          2,
        );
      K.text(sl, runs(t, { fontSize: 13, bold: true }), {
        x: x + (IconC ? 0.6 : 0.28),
        y: y + 0.12,
        w: w - 0.9,
        h: h - 0.24,
        fontSize: 13,
        bold: true,
        color: C.accent,
        valign: "middle",
      });
    },
  };
}

/** Икон + дугаар + текст бүхий жагсаалт (санал, чиг үүрэг) */
function recsBlock(K, items, w, pt = 14) {
  const rows = items.map((it) => {
    const t = (it.bold ? it.bold + ". " : "") + it.text;
    const th = textH(t, pt, w - 0.95, 1.22);
    const sh = it.sub ? textH(it.sub, 11, w - 0.95, 1.2) + 0.04 : 0;
    return { it, th, sh, h: Math.max(0.46, th + sh) + 0.16 };
  });
  const h = rows.reduce((s, r) => s + r.h, 0);
  return {
    h,
    draw: async (sl, x, y) => {
      let yy = y;
      for (let i = 0; i < rows.length; i++) {
        const { it, th, sh, h: rh } = rows[i];
        const hl = Boolean(it.hl);
        const cy = yy + (rh - 0.44) / 2;
        K.rrect(sl, x, cy, 0.44, 0.44, {
          fill: hl ? C.ink : C.accentSoft,
          r: 0.1,
        });
        await K.iconAt(
          sl,
          it.icon,
          x + 0.11,
          cy + 0.11,
          0.22,
          hl ? C.accentLight : C.accent,
          1.8,
        );
        K.text(sl, String(i + 1), {
          x: x + 0.55,
          y: cy,
          w: 0.2,
          h: 0.44,
          fontSize: 8.5,
          bold: true,
          color: C.mute,
          valign: "middle",
        });
        const ty = yy + (rh - th - sh) / 2;
        const body = [];
        if (it.bold)
          body.push({
            text: it.bold + ". ",
            options: { bold: true, fontSize: pt },
          });
        body.push(...runs(it.text, { fontSize: pt }));
        K.text(sl, body, {
          x: x + 0.85,
          y: ty,
          w: w - 0.9,
          h: th,
          fontSize: pt,
          color: C.ink,
          lineSpacingMultiple: 1.05,
        });
        if (it.sub)
          K.text(sl, runs(it.sub, { fontSize: 11 }), {
            x: x + 0.85,
            y: ty + th,
            w: w - 0.9,
            h: sh,
            fontSize: 11,
            color: C.ink2,
          });
        if (i < rows.length - 1) K.hline(sl, x, yy + rh, w);
        yy += rh;
      }
    },
  };
}

/* ------------------------------------------------------------------ */
/* Geometry presets                                                    */
/* ------------------------------------------------------------------ */

const COL = { lx: MX, lw: 6.3, rx: 7.45, rw: W - MX - 7.45 }; // зураг бүхий хоёр багана
const EVEN = { lx: MX, lw: 5.95, rx: 7.15, rw: W - MX - 7.15 }; // хариуцлагын хоёр багана
const FULL = { x: MX, w: W - 2 * MX };

/* ------------------------------------------------------------------ */
/* Deck builder                                                        */
/* ------------------------------------------------------------------ */

async function newPres(title) {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.title = title;
  pres.author = "Бие даалт";
  pres.theme = { headFontFace: SERIF, bodyFontFace: SANS };
  pres.defineSlideMaster({
    title: "PAPER",
    background: { data: bgData("bg-faint.jpg") },
  });
  pres.defineSlideMaster({
    title: "PAPER_INTRO",
    background: { data: bgData("bg-intro.jpg") },
  });
  return pres;
}

/* ----------------------------- Бие даалт 03 ----------------------------- */

async function buildDeck3() {
  const { slides, STEPS, COUNTRIES } = D3;
  const pres = await newPres("Бие даалт 03 · Химийн инженерийн 3 том алдаа");
  const K = makeKit(pres);
  let section = null;

  for (let i = 0; i < slides.length; i++) {
    const s = slides[i];
    const secName =
      s.country !== undefined ? COUNTRIES[s.country].name : "Танилцуулга";
    if (secName !== section) {
      pres.addSection({ title: secName });
      section = secName;
    }
    const sl = pres.addSlide({
      masterName: s.kind === "intro" ? "PAPER_INTRO" : "PAPER",
      sectionTitle: secName,
    });
    Object.assign(CUR, { deck: "03", i });
    chrome(K, sl, {
      deckNo: "03",
      sub: s.country !== undefined ? secName : "Кейс шинжилгээ",
      i,
      n: slides.length,
      name: s.name,
    });

    const head = (w, o = {}) =>
      headBlock(K, {
        flag: s.country !== undefined ? COUNTRIES[s.country].code : null,
        tag: s.tag,
        steps: s.step !== undefined ? STEPS : null,
        step: s.step,
        title: s.title,
        w,
        ...o,
      });

    switch (s.kind) {
      case "intro":
        await introSlide(K, sl, {
          tag: s.tag,
          title: s.title,
          sub: s.sub,
          flowLabel: "Кейс бүрт 5 слайд",
          flow: STEPS,
          cards: COUNTRIES.map((c) => ({
            country: `${c.name} · ${c.year}`,
            name: c.caseName,
            icon: c.icon,
            img: c.img,
          })),
        });
        break;

      case "case": {
        const blocks = [
          head(COL.lw),
          subBlock(K, s.sub, COL.lw),
          statsBlock(K, s.stats, COL.lw),
          factsBlock(K, s.facts, COL.lw),
        ];
        if (s.src) blocks.push(srcBlock(K, s.src, COL.lw));
        await stack(sl, blocks, COL.lx);
        await photoFrame(K, sl, s.photo, COL.rx, 1.15, COL.rw, 5.4);
        break;
      }

      case "theory": {
        const w = FULL.w;
        const cw = (w - 0.35) / 2;
        const ch = 3.05;
        const theory = {
          h: ch,
          draw: async (sl2, x, y) => {
            const cards = [
              {
                icon: Scale,
                name: "Утилитаризм",
                meta: "Бентам, Милл · Үр дагавраар дүгнэнэ",
                text: s.util,
              },
              {
                icon: BookOpen,
                name: "Деонтологи",
                meta: "Кант · Үүргээр дүгнэнэ",
                text: s.deon,
              },
            ];
            for (let k = 0; k < 2; k++) {
              const cx = x + k * (cw + 0.35);
              const c = cards[k];
              K.rrect(sl2, cx, y, cw, ch, { fill: C.card, line: C.rule });
              await K.iconDisc(sl2, c.icon, cx + 0.4, y + 0.38, 0.74, {
                bg: C.ink,
                fg: C.paper,
                sw: 1.5,
              });
              K.text(sl2, c.name, {
                x: cx + 0.4,
                y: y + 1.25,
                w: cw - 0.8,
                h: 0.5,
                fontFace: SERIF,
                fontSize: 28,
                color: C.ink,
              });
              K.label(sl2, c.meta, cx + 0.4, y + 1.78, cw - 0.8);
              K.text(sl2, clean(c.text), {
                x: cx + 0.4,
                y: y + 2.1,
                w: cw - 0.8,
                h: 0.85,
                fontSize: 14,
                color: C.ink,
                lineSpacingMultiple: 1.1,
              });
            }
          },
        };
        await stack(
          sl,
          [head(w), theory, verdictBlock(K, s.verdict, w, X)],
          FULL.x,
          { gap: 0.28 },
        );
        break;
      }

      case "account": {
        const L = EVEN;
        const rowsBlock = {
          h: 0.32 + s.rows.length * 0.5,
          draw: async (sl2, x, y) => {
            const nw =
              Math.max(...s.rows.map((r) => r.text.length)) * 0.105 + 0.3;
            K.label(sl2, s.systemLabel, x, y, L.lw, C.mute);
            let yy = y + 0.32;
            for (const r of s.rows) {
              if (r.ok) K.circle(sl2, x, yy + 0.12, 0.26, C.ink);
              else K.circle(sl2, x, yy + 0.12, 0.26, null, C.accent);
              await K.iconAt(
                sl2,
                r.ok ? Check : X,
                x + 0.06,
                yy + 0.18,
                0.14,
                r.ok ? C.paper : C.accent,
                3,
              );
              K.text(sl2, r.text, {
                x: x + 0.4,
                y: yy,
                w: nw,
                h: 0.5,
                fontSize: 14,
                bold: true,
                color: r.ok ? C.ink : C.mute,
                valign: "middle",
                strike: r.ok ? undefined : "sngStrike",
              });
              if (r.note)
                K.text(sl2, clean(r.note), {
                  x: x + 0.45 + nw,
                  y: yy,
                  w: L.lw - 0.45 - nw,
                  h: 0.5,
                  fontSize: 12,
                  color: C.ink2,
                  align: "right",
                  valign: "middle",
                });
              yy += 0.5;
              K.hline(sl2, x, yy, L.lw);
            }
          },
        };
        const gap = {
          h: Math.max(0.4, textH(s.gap, 13.5, L.lw - 0.4, 1.25)),
          draw: async (sl2, x, y) => {
            await K.iconAt(sl2, CircleAlert, x, y + 0.03, 0.24, C.accent, 1.9);
            K.text(sl2, clean(s.gap), {
              x: x + 0.38,
              y,
              w: L.lw - 0.4,
              h: 0.45,
              fontSize: 13.5,
              bold: true,
              color: C.accent,
            });
          },
        };
        const blocks = [head(L.lw), rowsBlock, gap];
        if (s.src) blocks.push(srcBlock(K, s.src, L.lw));
        await stack(sl, blocks, L.lx);
        await lawCard(K, sl, s.law, L.rx, L.rw);
        break;
      }

      case "decision": {
        const w = FULL.w;
        const cw = (w - 2 * 0.32) / 3;
        const ch = 3.4;
        const grid = {
          h: ch,
          draw: async (sl2, x, y) => {
            for (let k = 0; k < s.items.length; k++) {
              const it = s.items[k];
              const dark = k === 1;
              const cx = x + k * (cw + 0.32);
              K.rrect(sl2, cx, y, cw, ch, {
                fill: dark ? C.ink : C.card,
                line: dark ? C.ink : C.rule,
              });
              K.text(sl2, `0${k + 1}`, {
                x: cx + cw - 0.75,
                y: y + 0.3,
                w: 0.45,
                h: 0.25,
                fontSize: 9,
                bold: true,
                color: C.accent,
                align: "right",
              });
              await K.iconDisc(sl2, it.icon, cx + 0.38, y + 0.38, 0.9, {
                bg: dark ? "2C4640" : C.accentSoft,
                fg: dark ? C.accentLight : C.accent,
                sw: 1.4,
              });
              K.text(sl2, clean(it.text), {
                x: cx + 0.38,
                y: y + 1.7,
                w: cw - 0.76,
                h: ch - 1.95,
                fontFace: SERIF,
                fontSize: 21,
                color: dark ? C.paper : C.ink,
                valign: "bottom",
                lineSpacingMultiple: 1.02,
              });
            }
          },
        };
        await stack(sl, [head(w), grid], FULL.x, { gap: 0.3 });
        break;
      }

      case "recs": {
        await stack(
          sl,
          [head(COL.lw), recsBlock(K, s.items, COL.lw, 13.5)],
          COL.lx,
        );
        await photoFrame(K, sl, s.photo, COL.rx, 1.15, COL.rw, 5.4);
        break;
      }
    }
  }
  return pres;
}

/** Эх сурвалжийн жижиг мөр */
function srcBlock(K, t, w) {
  const h = textH(t, 8.5, w, 1.25, 0.6);
  return {
    h,
    draw: (sl, x, y) =>
      K.text(sl, clean(t), { x, y, w, h, fontSize: 8.5, color: C.mute }),
  };
}

/** Хууль/шийдвэрийн хар карт (b3 account) */
async function lawCard(K, sl, law, x, w) {
  const fxH = law.effects.map((e) =>
    Math.max(0.34, textH(e.text, 13, w - 1.1, 1.22)),
  );
  const nameH = textH(law.name, 21, w - 0.8, 1.12, 0.5);
  const h =
    0.6 +
    1.45 +
    0.35 +
    nameH +
    0.3 +
    fxH.reduce((a, b) => a + b + 0.12, 0) +
    0.3;
  const y = TOP + (BOTTOM - TOP - h) / 2;
  K.rrect(sl, x, y, w, h, { fill: C.ink, r: 0.2, shadow: true });
  const p = 0.42;
  await K.iconAt(sl, Landmark, x + p, y + 0.38, 0.26, C.accentLight, 1.5);
  K.label(
    sl,
    "Бодит хариуцлагыг хууль хүлээлгэсэн",
    x + p + 0.38,
    y + 0.41,
    w - 1.2,
    C.accentLight,
  );
  K.text(sl, law.year, {
    x: x + p,
    y: y + 0.7,
    w: w - 2 * p,
    h: 1.4,
    fontFace: SERIF,
    fontSize: 92,
    color: C.paper,
    valign: "middle",
  });
  K.text(sl, law.yearNote, {
    x: x + p,
    y: y + 2.05,
    w: w - 2 * p,
    h: 0.32,
    fontFace: SERIF,
    italic: true,
    fontSize: 15,
    color: "B9BFB8",
  });
  K.text(sl, law.name, {
    x: x + p,
    y: y + 2.42,
    w: w - 2 * p,
    h: nameH,
    fontFace: SERIF,
    fontSize: 21,
    color: C.paper,
  });
  let yy = y + 2.42 + nameH + 0.2;
  K.hline(sl, x + p, yy, w - 2 * p, "3A524B");
  yy += 0.18;
  for (let k = 0; k < law.effects.length; k++) {
    const e = law.effects[k];
    await K.iconAt(sl, e.icon, x + p, yy + 0.04, 0.24, C.accentLight, 1.7);
    K.text(sl, clean(e.text), {
      x: x + p + 0.4,
      y: yy,
      w: w - 2 * p - 0.4,
      h: fxH[k],
      fontSize: 13,
      color: C.paper,
    });
    yy += fxH[k] + 0.12;
  }
}

/** Нүүр/танилцуулга слайд (хоёр илтгэлд ижил) */
async function introSlide(K, sl, { tag, title, sub, flowLabel, flow, cards }) {
  const lw = 6.2;
  const titleB = headBlock(K, { tag, title, w: lw, titlePt: 42 });
  const subB = subBlock(K, sub, lw - 0.4, 16);
  const flowB = {
    h: 0.3 + Math.ceil(flow.length / 3) * 0.44,
    draw: (s2, x, y) => {
      K.label(s2, flowLabel, x, y, lw, C.mute);
      let px = x;
      let py = y + 0.3;
      flow.forEach((st, k) => {
        const pw = 0.62 + clean(st).length * 0.085;
        if (px + pw > x + lw) {
          px = x;
          py += 0.44;
        }
        K.rrect(s2, px, py, pw, 0.36, {
          fill: "F6F2EB",
          line: C.rule,
          r: 0.18,
        });
        K.text(
          s2,
          [
            {
              text: `0${k + 1}  `,
              options: { color: C.accent, bold: true, fontSize: 8 },
            },
            { text: st, options: { color: C.ink, fontSize: 11 } },
          ],
          { x: px, y: py, w: pw, h: 0.36, align: "center", valign: "middle" },
        );
        px += pw + 0.1;
      });
    },
  };
  await stack(sl, [titleB, subB, flowB], MX, { gap: 0.28 });

  const x = 7.35;
  const w = W - MX - x;
  const gap = 0.16;
  const ch = (5.55 - 2 * gap) / 3;
  let y = TOP + (BOTTOM - TOP - 5.55) / 2;
  for (let k = 0; k < cards.length; k++) {
    const c = cards[k];
    K.rrect(sl, x, y, w, ch, { fill: C.ink, r: 0.16, shadow: true });
    sl.addImage({
      data: await photo(c.img, w, ch, { grad: "left" }),
      x,
      y,
      w,
      h: ch,
    });
    K.text(sl, `0${k + 1}`, {
      x: x + 0.3,
      y,
      w: 0.8,
      h: ch,
      fontFace: SERIF,
      fontSize: 34,
      color: C.accentLight,
      valign: "middle",
    });
    K.label(sl, c.country, x + 1.15, y + ch / 2 - 0.36, w - 2, "D8D2C6");
    K.text(sl, c.name, {
      x: x + 1.15,
      y: y + ch / 2 - 0.12,
      w: w - 2.0,
      h: 0.6,
      fontFace: SERIF,
      fontSize: 18,
      color: C.paper,
      lineSpacingMultiple: 0.95,
    });
    K.circle(sl, x + w - 0.8, y + ch / 2 - 0.25, 0.5, null, "7E8C84");
    await K.iconAt(
      sl,
      c.icon,
      x + w - 0.67,
      y + ch / 2 - 0.12,
      0.24,
      C.paper,
      1.6,
    );
    y += ch + gap;
  }
}

/* ----------------------------- Бие даалт 02 ----------------------------- */

async function buildDeck2() {
  const { slides, GROUPS, COUNTRIES, tableHead, tableRows, referencesList } =
    D2;
  const pres = await newPres("Бие даалт 02 · Мэргэжлийн ёс зүй ба хариуцлага");
  const K = makeKit(pres);
  let section = -1;

  for (let i = 0; i < slides.length; i++) {
    const s = slides[i];
    const g = GROUPS[s.group];
    if (s.group !== section) {
      pres.addSection({ title: g.name });
      section = s.group;
    }
    const sl = pres.addSlide({
      masterName: s.kind === "cover" ? "PAPER_INTRO" : "PAPER",
      sectionTitle: g.name,
    });
    Object.assign(CUR, { deck: "02", i });
    chrome(K, sl, {
      deckNo: "02",
      sub: g.name,
      i,
      n: slides.length,
      name: s.name,
    });

    const head = (w, o = {}) =>
      headBlock(K, {
        flag: g.code || null,
        tag: s.tag,
        steps: s.step !== undefined ? g.steps : null,
        step: s.step,
        title: s.title,
        w,
        ...o,
      });
    const sub = (w, pt) => (s.sub ? [subBlock(K, s.sub, w, pt)] : []);

    switch (s.kind) {
      case "cover":
        await introSlide(K, sl, {
          tag: s.tag,
          title: s.title,
          sub: s.sub,
          flowLabel: "Илтгэлийн бүтэц",
          flow: ["Бодит сургамж", ...GROUPS.slice(1).map((x) => x.name)],
          cards: COUNTRIES.map((c) => ({
            country: `${c.name} · ${c.year}`,
            name: c.org,
            icon: c.icon,
            img: c.img,
          })),
        });
        break;

      case "case":
        await stack(
          sl,
          [
            head(COL.lw),
            ...sub(COL.lw),
            statsBlock(K, s.stats, COL.lw),
            factsBlock(K, s.facts, COL.lw),
          ],
          COL.lx,
        );
        await photoFrame(K, sl, s.photo, COL.rx, 1.15, COL.rw, 5.4);
        break;

      case "list": {
        const blocks = [
          head(COL.lw),
          ...sub(COL.lw),
          recsBlock(
            K,
            s.items.map((it) => ({ ...it, hl: Boolean(it.sub) })),
            COL.lw,
            13.5,
          ),
        ];
        if (s.foot) blocks.push(srcBlock(K, s.foot, COL.lw));
        await stack(sl, blocks, COL.lx);
        await photoFrame(K, sl, s.photo, COL.rx, 1.15, COL.rw, 5.4);
        break;
      }

      case "cards": {
        const n = s.cards.length;
        const gap = n === 4 ? 0.24 : 0.3;
        const cw = (FULL.w - gap * (n - 1)) / n;
        const opts =
          n === 4
            ? { titlePt: 17, descPt: 12 }
            : n === 2
              ? { titlePt: 24, descPt: 13.5 }
              : { titlePt: 19, descPt: 12.5 };
        const ch = Math.max(
          n === 2 ? 2.3 : 2.75,
          ...s.cards.map((c) => cardNeed(c, cw, opts)),
        );
        const grid = {
          h: ch,
          draw: async (sl2, x, y) => {
            for (let k = 0; k < n; k++)
              await card(
                K,
                sl2,
                s.cards[k],
                x + k * (cw + gap),
                y,
                cw,
                ch,
                opts,
              );
          },
        };
        const blocks = [head(FULL.w), ...sub(FULL.w * 0.7), grid];
        if (s.note)
          blocks.push(verdictBlock(K, s.note.text, FULL.w, s.note.icon));
        await stack(sl, blocks, FULL.x);
        break;
      }

      case "tiles": {
        const cw = (FULL.w - 2 * 0.26) / 3;
        const th = 1.5;
        const grid = {
          h: th * 2 + 0.26,
          draw: async (sl2, x, y) => {
            for (let k = 0; k < s.tiles.length; k++) {
              const t = s.tiles[k];
              const dark = k === 0 || k === 5;
              const cx = x + (k % 3) * (cw + 0.26);
              const cy = y + Math.floor(k / 3) * (th + 0.26);
              K.rrect(sl2, cx, cy, cw, th, {
                fill: dark ? C.ink : C.card,
                line: dark ? C.ink : C.rule,
              });
              await K.iconDisc(sl2, t.icon, cx + 0.3, cy + 0.28, 0.56, {
                bg: dark ? "2C4640" : C.accentSoft,
                fg: dark ? C.accentLight : C.accent,
              });
              K.text(sl2, `0${k + 1}`, {
                x: cx + cw - 0.75,
                y: cy + 0.28,
                w: 0.45,
                h: 0.22,
                fontSize: 8.5,
                bold: true,
                color: dark ? C.accentLight : C.accent,
                align: "right",
              });
              K.text(sl2, t.text, {
                x: cx + 0.3,
                y: cy + 0.92,
                w: cw - 0.6,
                h: 0.45,
                fontFace: SERIF,
                fontSize: 19,
                color: dark ? C.paper : C.ink,
                valign: "middle",
              });
            }
          },
        };
        await stack(sl, [head(FULL.w), ...sub(FULL.w), grid], FULL.x);
        break;
      }

      case "ladder": {
        const L = EVEN;
        const ladder = {
          h: s.rows.length * 0.58 + 0.3,
          draw: async (sl2, x, y) => {
            let yy = y;
            const barX = x + L.lw - 1.7;
            for (let k = 0; k < s.rows.length; k++) {
              const r = s.rows[k];
              K.text(sl2, `0${k + 1}`, {
                x,
                y: yy,
                w: 0.3,
                h: 0.58,
                fontSize: 8.5,
                bold: true,
                color: C.mute,
                valign: "middle",
              });
              K.rrect(sl2, x + 0.38, yy + 0.1, 0.38, 0.38, {
                fill: C.accentSoft,
                r: 0.09,
              });
              await K.iconAt(
                sl2,
                r.icon,
                x + 0.47,
                yy + 0.19,
                0.2,
                C.accent,
                1.8,
              );
              K.text(sl2, r.text, {
                x: x + 0.92,
                y: yy,
                w: L.lw - 2.8,
                h: 0.58,
                fontSize: 14,
                color: C.ink,
                valign: "middle",
              });
              K.rrect(sl2, barX, yy + 0.26, 1.7, 0.07, {
                fill: "E3DCD0",
                r: 0.035,
              });
              K.rrect(
                sl2,
                barX,
                yy + 0.26,
                (1.7 * (k + 1)) / s.rows.length,
                0.07,
                { fill: k < 2 ? C.accentLight : C.accent, r: 0.035 },
              );
              yy += 0.58;
              K.hline(sl2, x, yy, L.lw);
            }
            K.text(sl2, "ХӨНГӨН", {
              x: barX,
              y: yy + 0.06,
              w: 0.8,
              h: 0.2,
              fontSize: 7,
              color: C.mute,
              charSpacing: 1,
            });
            K.text(sl2, "ХҮНД", {
              x: barX + 0.9,
              y: yy + 0.06,
              w: 0.8,
              h: 0.2,
              fontSize: 7,
              color: C.mute,
              align: "right",
              charSpacing: 1,
            });
          },
        };
        await stack(sl, [head(L.lw), ...sub(L.lw), ladder], L.lx);
        // хар карт
        const h = 3.6;
        const y = TOP + (BOTTOM - TOP - h) / 2;
        const x = L.rx;
        const w = L.rw;
        K.rrect(sl, x, y, w, h, { fill: C.ink, r: 0.2, shadow: true });
        await K.iconAt(
          sl,
          CircleHelp,
          x + 0.42,
          y + 0.38,
          0.26,
          C.accentLight,
          1.5,
        );
        K.label(
          sl,
          "Хамрах хүрээнээс гадуур",
          x + 0.8,
          y + 0.41,
          w - 1.2,
          C.accentLight,
        );
        K.text(sl, "?", {
          x: x + 0.42,
          y: y + 0.75,
          w: 1.2,
          h: 1.2,
          fontFace: SERIF,
          fontSize: 96,
          color: C.accentLight,
          valign: "middle",
        });
        K.text(sl, s.side.label, {
          x: x + 0.42,
          y: y + 2.0,
          w: w - 0.84,
          h: 0.75,
          fontFace: SERIF,
          fontSize: 21,
          color: C.paper,
        });
        K.hline(sl, x + 0.42, y + 2.85, w - 0.84, "3A524B");
        K.text(sl, s.side.text, {
          x: x + 0.42,
          y: y + 2.98,
          w: w - 0.84,
          h: 0.35,
          fontFace: SERIF,
          italic: true,
          fontSize: 15,
          color: "B9BFB8",
        });
        break;
      }

      case "org": {
        const L = EVEN;
        const year = {
          h: 2.35,
          draw: (sl2, x, y) => {
            K.hline(sl2, x, y, 5.2, C.ink, 1.25);
            K.text(sl2, s.year, {
              x,
              y: y + 0.15,
              w: 5,
              h: 1.4,
              fontFace: SERIF,
              fontSize: 100,
              color: C.ink,
              valign: "middle",
            });
            K.text(sl2, runs(s.yearText, { fontSize: 14 }), {
              x,
              y: y + 1.65,
              w: 5.2,
              h: 0.65,
              fontSize: 14,
              color: C.ink2,
            });
          },
        };
        await stack(sl, [head(L.lw), ...sub(L.lw), year], L.lx);
        // бүтэц
        const x = L.rx;
        const w = L.rw;
        const nh = s.nodes.map((n) =>
          Math.max(1.75, cardNeed(n, w, { titlePt: 18, descPt: 12.5 })),
        );
        const total = 0.5 + nh.reduce((a, b) => a + b + 0.36, 0);
        let y = TOP + (BOTTOM - TOP - total) / 2;
        const rw = 1.9;
        K.rrect(sl, x + (w - rw) / 2, y, rw, 0.5, { fill: C.accent, r: 0.25 });
        await K.iconAt(
          sl,
          Landmark,
          x + (w - rw) / 2 + 0.3,
          y + 0.15,
          0.2,
          C.white,
          1.8,
        );
        K.text(sl, s.root, {
          x: x + (w - rw) / 2 + 0.45,
          y,
          w: rw - 0.6,
          h: 0.5,
          fontSize: 12,
          bold: true,
          color: C.white,
          align: "center",
          valign: "middle",
          charSpacing: 2,
        });
        y += 0.5;
        for (let k = 0; k < s.nodes.length; k++) {
          K.vline(sl, x + w / 2, y, 0.36, C.ink2);
          y += 0.36;
          await card(K, sl, s.nodes[k], x, y, w, nh[k], {
            titlePt: 18,
            descPt: 12.5,
          });
          y += nh[k];
        }
        break;
      }

      case "versus": {
        const disc = 0.7;
        const cw = (FULL.w - disc - 0.5) / 2;
        const extraH = Math.max(
          ...[s.a, s.b].map((c) => textH(c.extra, 14, cw - 0.8, 1.3)),
        );
        const ch = 0.36 + 0.66 + 0.9 + 0.3 + extraH + 0.28;
        const grid = {
          h: ch,
          draw: async (sl2, x, y) => {
            const cs = [s.a, s.b];
            for (let k = 0; k < 2; k++) {
              const c = cs[k];
              const dark = c.tone === "ink";
              const cx = x + k * (cw + disc + 0.5);
              K.rrect(sl2, cx, y, cw, ch, {
                fill: dark ? C.ink : C.card,
                line: dark ? C.ink : C.rule,
              });
              await K.iconDisc(sl2, c.icon, cx + 0.4, y + 0.4, 0.66, {
                bg: dark ? "2C4640" : C.accentSoft,
                fg: dark ? C.accentLight : C.accent,
              });
              K.text(sl2, c.pill, {
                x: cx + cw - 2.6,
                y: y + 0.45,
                w: 2.2,
                h: 0.22,
                fontSize: 8,
                bold: true,
                color: dark ? C.accentLight : C.accent,
                align: "right",
                charSpacing: 1.2,
              });
              K.text(sl2, c.title, {
                x: cx + 0.4,
                y: y + 1.1,
                w: cw - 0.8,
                h: 0.8,
                fontFace: SERIF,
                fontSize: 48,
                color: dark ? C.paper : C.ink,
                valign: "middle",
              });
              K.label(
                sl2,
                c.desc,
                cx + 0.4,
                y + 1.95,
                cw - 0.8,
                dark ? C.accentLight : C.accent,
              );
              K.text(
                sl2,
                runs(c.extra, {
                  fontSize: 14,
                  refColor: dark ? "9AA8A0" : C.mute,
                }),
                {
                  x: cx + 0.4,
                  y: y + 2.3,
                  w: cw - 0.8,
                  h: extraH,
                  fontSize: 14,
                  color: dark ? "E8E2D6" : C.ink,
                  lineSpacingMultiple: 1.08,
                },
              );
            }
            const dx = x + cw + 0.25;
            K.circle(sl2, dx, y + ch / 2 - disc / 2, disc, C.paper, C.accent);
            K.text(sl2, "vs", {
              x: dx,
              y: y + ch / 2 - disc / 2,
              w: disc,
              h: disc,
              fontFace: SERIF,
              italic: true,
              fontSize: 20,
              color: C.accent,
              align: "center",
              valign: "middle",
            });
          },
        };
        await stack(
          sl,
          [head(FULL.w), ...sub(FULL.w), grid, verdictBlock(K, s.note, FULL.w)],
          FULL.x,
        );
        break;
      }

      case "timeline": {
        const n = s.events.length;
        const gap = 0.35;
        const cw = (FULL.w - gap * (n - 1)) / n;
        const dH = Math.max(
          ...s.events.map((e) => textH(e.desc, 11.5, cw - 0.1, 1.25)),
        );
        const tl = {
          h: 0.38 + 0.95 + 0.38 + dH,
          draw: (sl2, x, y) => {
            K.hline(sl2, x, y + 0.09, FULL.w, "A6B0A9", 1.25);
            for (let k = 0; k < n; k++) {
              const e = s.events[k];
              const cx = x + k * (cw + gap);
              K.circle(
                sl2,
                cx,
                y,
                0.18,
                k === 1 ? C.accent : C.paper,
                C.accent,
              );
              K.text(sl2, e.year, {
                x: cx,
                y: y + 0.32,
                w: cw,
                h: 0.95,
                fontFace: SERIF,
                fontSize: 54,
                color: C.ink,
                valign: "middle",
              });
              K.text(sl2, e.title, {
                x: cx,
                y: y + 1.3,
                w: cw,
                h: 0.32,
                fontSize: 14,
                bold: true,
                color: C.ink,
              });
              K.text(sl2, runs(e.desc, { fontSize: 11.5 }), {
                x: cx,
                y: y + 1.66,
                w: cw - 0.1,
                h: dH,
                fontSize: 11.5,
                color: C.ink2,
              });
            }
          },
        };
        const fw = (FULL.w - 0.6) / 2;
        const fH = Math.max(...s.facts.map((f) => factsBlock(K, [f], fw).h));
        const facts = {
          h: 0.3 + fH,
          draw: async (sl2, x, y) => {
            K.hline(sl2, x, y, FULL.w);
            for (let k = 0; k < s.facts.length; k++)
              await factsBlock(K, [s.facts[k]], fw).draw(
                sl2,
                x + k * (fw + 0.6),
                y + 0.3,
              );
          },
        };
        await stack(
          sl,
          [head(FULL.w), ...sub(FULL.w * 0.75), tl, facts],
          FULL.x,
          { gap: 0.24 },
        );
        break;
      }

      case "tiers": {
        const L = EVEN;
        await stack(
          sl,
          [head(L.lw), ...sub(L.lw), factsBlock(K, s.facts, L.lw)],
          L.lx,
        );
        const x = L.rx;
        const w = L.rw;
        const opts = { titlePt: 20, descPt: 12.5 };
        const hs = s.tiers.map((t) => Math.max(1.95, cardNeed(t, w, opts)));
        const total = hs.reduce((a, b) => a + b, 0) + 0.3;
        let y = TOP + (BOTTOM - TOP - total) / 2;
        for (let k = 0; k < s.tiers.length; k++) {
          await card(K, sl, s.tiers[k], x, y, w, hs[k], opts);
          y += hs[k];
          if (k < s.tiers.length - 1) {
            K.circle(sl, x + w / 2 - 0.2, y - 0.05, 0.4, C.paper, C.rule);
            await K.iconAt(
              sl,
              ArrowDown,
              x + w / 2 - 0.1,
              y + 0.05,
              0.2,
              C.accent,
              2,
            );
            y += 0.3;
          }
        }
        break;
      }

      case "money": {
        const L = EVEN;
        await stack(
          sl,
          [head(L.lw), ...sub(L.lw), factsBlock(K, s.facts, L.lw)],
          L.lx,
        );
        const x = L.rx;
        const w = L.rw;
        const h = 4.1;
        const y = TOP + (BOTTOM - TOP - h) / 2;
        K.rrect(sl, x, y, w, h, { fill: C.ink, r: 0.2, shadow: true });
        await K.iconAt(
          sl,
          Landmark,
          x + 0.42,
          y + 0.38,
          0.26,
          C.accentLight,
          1.5,
        );
        K.label(sl, s.panelLabel, x + 0.8, y + 0.41, w - 1.2, C.accentLight);
        K.hline(sl, x + 0.42, y + 0.95, w - 0.84, "3A524B");
        const fw = (w - 0.84 - 0.3) / 2;
        s.figures.forEach((f, k) => {
          const fx = x + 0.42 + (k % 2) * (fw + 0.3);
          const fy = y + 1.2 + Math.floor(k / 2) * 1.45;
          K.text(sl, f.num, {
            x: fx,
            y: fy,
            w: fw + 0.2,
            h: 0.75,
            fontFace: SERIF,
            fontSize: 28,
            color: k < 2 ? C.accentLight : C.paper,
            valign: "middle",
          });
          K.text(sl, runs(f.label, { fontSize: 11, refColor: "9AA8A0" }), {
            x: fx,
            y: fy + 0.78,
            w: fw,
            h: 0.5,
            fontSize: 11,
            color: "B9BFB8",
          });
        });
        break;
      }

      case "table": {
        const colW = [2.25, 2.95, 3.25, FULL.w - 2.25 - 2.95 - 3.25];
        const rows = [
          tableHead.map((h, k) => ({
            text:
              k === 0
                ? h
                : [
                    {
                      text: ` ${COUNTRIES[k - 1].code} `,
                      options: {
                        color: C.white,
                        bold: true,
                        fontSize: 8,
                        highlight: C.accent,
                      },
                    },
                    { text: "  " + h, options: { bold: true, color: C.paper } },
                  ],
            options: {
              fill: { color: C.ink },
              color: C.paper,
              bold: true,
              fontSize: 11,
            },
          })),
          ...tableRows.map((r, ri) =>
            r.map((cell, k) => ({
              text: k === 0 ? cell : runs(cell, { fontSize: 11 }),
              options: {
                bold: k === 0,
                fontSize: 11,
                color: C.ink,
                fill: { color: ri % 2 ? "F1EBE1" : "F7F3EC" },
              },
            })),
          ),
        ];
        const tbl = {
          h: 3.7,
          draw: (sl2, x, y) =>
            sl2.addTable(rows, {
              x,
              y,
              w: FULL.w,
              colW,
              fontFace: SANS,
              fontSize: 11,
              color: C.ink,
              valign: "top",
              border: { type: "solid", pt: 0.75, color: C.rule },
              margin: [0.06, 0.1, 0.06, 0.1],
              rowH: 0.36,
            }),
        };
        await stack(sl, [head(FULL.w), ...sub(FULL.w), tbl], FULL.x);
        break;
      }

      case "compare": {
        const gap = 0.3;
        const cw = (FULL.w - 2 * gap) / 3;
        const dH = Math.max(
          ...s.countries.map((c) => textH(c.desc, 13, cw - 0.6, 1.3)),
        );
        const ch = 0.3 + 0.45 + 0.2 + dH + 0.3;
        const cards = {
          h: ch,
          draw: (sl2, x, y) => {
            s.countries.forEach((c, k) => {
              const dark = k === 2;
              const cx = x + k * (cw + gap);
              K.rrect(sl2, cx, y, cw, ch, {
                fill: dark ? C.ink : C.card,
                line: dark ? C.ink : C.rule,
              });
              K.rrect(sl2, cx + 0.3, y + 0.38, 0.38, 0.22, {
                fill: dark ? C.accent : C.ink,
                r: 0.04,
              });
              K.text(sl2, c.code, {
                x: cx + 0.3,
                y: y + 0.38,
                w: 0.38,
                h: 0.22,
                fontSize: 7.5,
                bold: true,
                color: C.paper,
                align: "center",
                valign: "middle",
              });
              K.text(sl2, c.name, {
                x: cx + 0.8,
                y: y + 0.27,
                w: cw - 2.6,
                h: 0.45,
                fontFace: SERIF,
                fontSize: 22,
                color: dark ? C.paper : C.ink,
                valign: "middle",
              });
              K.text(sl2, c.pill, {
                x: cx + cw - 2.0,
                y: y + 0.38,
                w: 1.7,
                h: 0.22,
                fontSize: 7.5,
                bold: true,
                color: dark ? C.accentLight : C.accent,
                align: "right",
                charSpacing: 1,
                valign: "middle",
              });
              K.text(
                sl2,
                runs(c.desc, {
                  fontSize: 13,
                  refColor: dark ? "9AA8A0" : C.mute,
                }),
                {
                  x: cx + 0.3,
                  y: y + 0.95,
                  w: cw - 0.6,
                  h: dH,
                  fontSize: 13,
                  color: dark ? "E8E2D6" : C.ink,
                },
              );
            });
          },
        };
        const pH = Math.max(...s.points.map((p) => textH(p.text, 13, cw, 1.3)));
        const points = {
          h: 0.3 + 0.3 + pH,
          draw: async (sl2, x, y) => {
            K.hline(sl2, x, y, FULL.w, C.ink, 1.25);
            for (let k = 0; k < s.points.length; k++) {
              const p = s.points[k];
              const cx = x + k * (cw + gap);
              await K.iconAt(sl2, p.icon, cx, y + 0.3, 0.22, C.accent, 1.8);
              K.label(sl2, p.bold, cx + 0.32, y + 0.32, cw - 0.4);
              K.text(sl2, runs(p.text, { fontSize: 13 }), {
                x: cx,
                y: y + 0.62,
                w: cw,
                h: pH,
                fontSize: 13,
                color: C.ink,
              });
            }
          },
        };
        await stack(
          sl,
          [head(FULL.w), ...sub(FULL.w * 0.75), cards, points],
          FULL.x,
          { gap: 0.3 },
        );
        break;
      }

      case "lessons": {
        const L = EVEN;
        const rows = s.items.map((it) => ({
          it,
          h: 0.45 + textH(it.text, 13, L.lw - 0.95, 1.3) + 0.3,
        }));
        const list = {
          h: rows.reduce((a, r) => a + r.h, 0),
          draw: (sl2, x, y) => {
            let yy = y;
            rows.forEach(({ it, h }, k) => {
              K.text(sl2, String(k + 1), {
                x,
                y: yy + 0.1,
                w: 0.7,
                h: 0.85,
                fontFace: SERIF,
                fontSize: 52,
                color: C.accent,
              });
              K.text(sl2, it.bold, {
                x: x + 0.85,
                y: yy + 0.12,
                w: L.lw - 0.9,
                h: 0.4,
                fontFace: SERIF,
                fontSize: 21,
                color: C.ink,
              });
              K.text(sl2, runs(it.text, { fontSize: 13 }), {
                x: x + 0.85,
                y: yy + 0.55,
                w: L.lw - 0.9,
                h: h - 0.6,
                fontSize: 13,
                color: C.ink2,
              });
              yy += h;
              if (k < rows.length - 1) K.hline(sl2, x, yy, L.lw);
            });
          },
        };
        await stack(sl, [head(L.lw), ...sub(L.lw), list], L.lx);
        const x = L.rx;
        const w = L.rw;
        const ah = 1.08;
        const h = 0.85 + s.actors.length * ah + 0.15;
        let y = TOP + (BOTTOM - TOP - h) / 2;
        K.rrect(sl, x, y, w, h, { fill: C.ink, r: 0.2, shadow: true });
        K.label(
          sl,
          "Хэн юу хийх вэ · санал",
          x + 0.42,
          y + 0.4,
          w - 0.84,
          C.accentLight,
        );
        y += 0.85;
        for (const a of s.actors) {
          K.hline(sl, x + 0.42, y, w - 0.84, "3A524B");
          await K.iconDisc(sl, a.icon, x + 0.42, y + 0.22, 0.62, {
            bg: "2C4640",
            fg: C.accentLight,
          });
          K.text(sl, a.title, {
            x: x + 1.25,
            y: y + 0.16,
            w: w - 1.65,
            h: 0.38,
            fontFace: SERIF,
            fontSize: 19,
            color: C.paper,
          });
          K.text(sl, a.desc, {
            x: x + 1.25,
            y: y + 0.54,
            w: w - 1.65,
            h: 0.45,
            fontSize: 11.5,
            color: "C9D1CB",
          });
          y += ah;
        }
        break;
      }

      case "refs": {
        const cw = (FULL.w - 0.5) / 2;
        const half = Math.ceil(referencesList.length / 2);
        const list = {
          h: half * 0.4,
          draw: (sl2, x, y) => {
            referencesList.forEach((r, k) => {
              const cx = x + (k < half ? 0 : cw + 0.5);
              const cy = y + (k % half) * 0.4;
              K.text(sl2, r.id, {
                x: cx,
                y: cy,
                w: 0.45,
                h: 0.4,
                fontSize: 9.5,
                bold: true,
                color: C.accent,
                valign: "middle",
              });
              K.text(
                sl2,
                [
                  {
                    text: r.title,
                    options: {
                      hyperlink: { url: r.url, tooltip: r.url },
                      color: C.ink,
                    },
                  },
                ],
                {
                  x: cx + 0.5,
                  y: cy,
                  w: cw - 0.5,
                  h: 0.4,
                  fontSize: 10.5,
                  color: C.ink,
                  valign: "middle",
                },
              );
              K.hline(sl2, cx, cy + 0.4, cw);
            });
          },
        };
        await stack(sl, [head(FULL.w), ...sub(FULL.w), list], FULL.x);
        break;
      }
    }
  }
  return pres;
}

/* ------------------------------------------------------------------ */

fs.mkdirSync(OUT, { recursive: true });
for (const [name, build] of [
  ["biydalt2", buildDeck2],
  ["biydalt3", buildDeck3],
]) {
  const pres = await build();
  const file = path.join(OUT, `${name}.pptx`);
  await pres.writeFile({ fileName: file });
  // Холбоосын өнгийг (theme hlink) цэнхэр биш, илтгэлийн өнгөөр
  const zip = await JSZip.loadAsync(fs.readFileSync(file));
  const tp = "ppt/theme/theme1.xml";
  const theme = (await zip.file(tp).async("string"))
    .replace(
      /<a:hlink>[\s\S]*?<\/a:hlink>/,
      `<a:hlink><a:srgbClr val="${C.ink}"/></a:hlink>`,
    )
    .replace(
      /<a:folHlink>[\s\S]*?<\/a:folHlink>/,
      `<a:folHlink><a:srgbClr val="${C.accent}"/></a:folHlink>`,
    );
  zip.file(tp, theme);
  // ZIP доторх хавтасны бичлэгийг арилгана (OneDrive/Google Drive-д нээгдэхгүй байх асуудлаас сэргийлж)
  for (const name of Object.keys(zip.files))
    if (zip.files[name].dir) delete zip.files[name];
  fs.writeFileSync(
    file,
    await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }),
  );
  console.log(
    "✓",
    path.relative(ROOT, file),
    (fs.statSync(file).size / 1e6).toFixed(1) + " MB",
  );
}
