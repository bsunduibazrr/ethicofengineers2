"use client";

import { Fragment } from "react";
import { ArrowDown, CircleHelp, Landmark } from "lucide-react";
import type { SlideState } from "./hourglass";
import DeckShell from "./DeckShell";
import {
  COUNTRIES,
  GROUPS,
  NO_INFO,
  referencesList,
  slides,
  tableHead,
  tableRows,
  type CardItem,
  type IconItem,
  type Photo,
  type Slide,
} from "../decks/biydalt2";

/* ------------------------------------------------------------------ */
/* Hourglass poses                                                     */
/* ------------------------------------------------------------------ */

const POSE_INTRO: SlideState = {
  x: -0.55,
  y: 0.1,
  s: 1.1,
  rx: 0.16,
  rz: -0.15,
  o: 0.22,
};
const POSE_FAINT: SlideState = {
  x: 0.05,
  y: 0,
  s: 1.4,
  rx: 0.06,
  rz: 0.04,
  o: 0.1,
};
const POSE_CORNER: SlideState[] = [
  { x: 0.86, y: 0.6, s: 0.3, rx: 0.3, rz: -0.2, o: 0.55 },
  { x: 0.88, y: 0.58, s: 0.3, rx: -0.28, rz: 0.3, o: 0.55 },
];

const poseFor = (i: number): SlideState => {
  const s = slides[i];
  if (!s) return POSE_FAINT;
  if (s.kind === "cover") return POSE_INTRO;
  if (s.kind === "case" || s.kind === "list") return POSE_CORNER[i % 2];
  return POSE_FAINT;
};

/* ------------------------------------------------------------------ */
/* Text: [n] ишлэл, "мэдээлэл олдсонгүй" тэмдэглэгээ                   */
/* ------------------------------------------------------------------ */

function T({ text }: { text: string }) {
  const parts = text.split(/(\s?(?:\[\d+\])+|Баталгаатай мэдээлэл олдсонгүй)/g);
  return (
    <>
      {parts.map((p, i) =>
        !p ? null : /^\s?\[/.test(p) ? (
          <span className="b2-ref" key={i}>
            {p.trim()}
          </span>
        ) : p === NO_INFO ? (
          <span className="b2-na" key={i}>
            {p}
          </span>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

function Title({ html }: { html: string }) {
  return <h1 className="b3-title" dangerouslySetInnerHTML={{ __html: html }} />;
}

function Head({ s }: { s: Slide }) {
  const g = GROUPS[s.group];
  return (
    <>
      <div className="b3-head">
        {g.code && <span className="b3-flag">{g.code}</span>}
        <div className="tag" style={{ marginBottom: 0 }}>
          {s.tag}
        </div>
      </div>
      {s.step !== undefined && (
        <ol className="b3-steps" aria-label={g.name}>
          {g.steps.map((st, i) => (
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

function Sub({ s }: { s: Slide }) {
  return s.sub ? (
    <p className="b3-sub">
      <T text={s.sub} />
    </p>
  ) : null;
}

function PhotoFrame({ p }: { p: Photo }) {
  return (
    <figure className="b3-photo">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.src} alt={p.alt} />
      <span className="b3-photo-badge">{p.badge}</span>
      <figcaption>{p.credit}</figcaption>
    </figure>
  );
}

function Facts({ items }: { items: IconItem[] }) {
  return (
    <ul className="b3-facts">
      {items.map((f) => {
        const Icon = f.icon;
        return (
          <li
            key={f.text + (f.bold ?? "")}
            className={f.muted ? "b2-muted" : ""}
          >
            <Icon size={18} strokeWidth={1.8} />
            <span>
              {f.bold && <b>{f.bold} </b>}
              <T text={f.text} />
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function Card({ c, n }: { c: CardItem; n?: number }) {
  const Icon = c.icon;
  return (
    <div className={`b2-card ${c.tone ?? ""}`}>
      <div className="b2-card-top">
        <span className="b2-card-icon">
          <Icon size={26} strokeWidth={1.5} />
        </span>
        {(c.pill || n !== undefined) && (
          <span className="b2-card-pill">{c.pill ?? `0${n}`}</span>
        )}
      </div>
      <div className="b2-card-title">{c.title}</div>
      <p className="b2-card-desc">
        <T text={c.desc} />
      </p>
      {c.extra && (
        <p className="b2-card-extra">
          <T text={c.extra} />
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Slide bodies                                                        */
/* ------------------------------------------------------------------ */

function SlideBody({ s }: { s: Slide }) {
  switch (s.kind) {
    case "cover":
      return (
        <div className="b3-grid b3-intro">
          <div className="b3-col">
            <div className="tag">{s.tag}</div>
            <Title html={s.title} />
            <p className="b3-sub">{s.sub}</p>=
            <ol className="b3-flow">
              {["Бодит сургамж", ...GROUPS.slice(1).map((g) => g.name)].map(
                (st, i) => (
                  <li key={st}>
                    <b>0{i + 1}</b>
                    {st}
                  </li>
                ),
              )}
            </ol>
          </div>
          <div className="b3-cases">
            {COUNTRIES.map((c, i) => {
              const Icon = c.icon;
              return (
                <div className="b3-case-card" key={c.code}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.img} alt="" />
                  <div className="b3-case-info">
                    <span className="b3-case-num">0{i + 1}</span>
                    <div>
                      <div className="b3-case-country">
                        {c.name} · {c.year}
                      </div>
                      <div className="b3-case-name">{c.org}</div>
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
            <Sub s={s} />
            <div
              className="b3-stats"
              style={{
                gridTemplateColumns: `repeat(${s.stats.length},minmax(0,1fr))`,
              }}
            >
              {s.stats.map((st) => {
                const Icon = st.icon;
                return (
                  <div className="b3-stat" key={st.num}>
                    <Icon
                      className="b3-stat-icon"
                      size={20}
                      strokeWidth={1.6}
                    />
                    <div className="b3-stat-num">{st.num}</div>
                    <div className="b3-stat-label">
                      <T text={st.label} />
                    </div>
                  </div>
                );
              })}
            </div>
            <Facts items={s.facts} />
          </div>
          <PhotoFrame p={s.photo} />
        </div>
      );

    case "cards":
      return (
        <div className="b3-full">
          <Head s={s} />
          <Sub s={s} />
          <div
            className={`b2-cards n${s.cards.length}`}
            style={{
              gridTemplateColumns: `repeat(${s.cards.length},minmax(0,1fr))`,
            }}
          >
            {s.cards.map((c) => (
              <Card c={c} key={c.title} />
            ))}
          </div>
          {s.note && (
            <div className="b3-verdict">
              <s.note.icon size={18} strokeWidth={2} />
              <span>
                <T text={s.note.text} />
              </span>
            </div>
          )}
        </div>
      );

    case "tiles":
      return (
        <div className="b3-full">
          <Head s={s} />
          <Sub s={s} />
          <div className="b2-tiles">
            {s.tiles.map((t, i) => {
              const Icon = t.icon;
              return (
                <div className="b2-tile" key={t.text}>
                  <span className="b2-tile-icon">
                    <Icon size={24} strokeWidth={1.6} />
                  </span>
                  <span className="b2-tile-n">0{i + 1}</span>
                  <span className="b2-tile-t">{t.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      );

    case "ladder":
      return (
        <div className="b3-grid b3-even">
          <div className="b3-col">
            <Head s={s} />
            <Sub s={s} />
            <ol className="b2-ladder">
              {s.rows.map((r, i) => {
                const Icon = r.icon;
                return (
                  <li key={r.text}>
                    <span className="b2-ladder-n">0{i + 1}</span>
                    <span className="b2-ladder-icon">
                      <Icon size={18} strokeWidth={1.8} />
                    </span>
                    <span className="b2-ladder-t">{r.text}</span>
                    <span className="b2-ladder-bar">
                      <i
                        style={{ width: `${((i + 1) / s.rows.length) * 100}%` }}
                      />
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
          <div className="b3-law">
            <div className="b3-law-top">
              <CircleHelp size={22} strokeWidth={1.5} />
              <span>Хамрах хүрээнээс гадуур</span>
            </div>
            <div className="b2-side-q">?</div>
            <div className="b3-law-name">{s.side.label}</div>
            <div className="b2-side-na">{s.side.text}</div>
          </div>
        </div>
      );

    case "org":
      return (
        <div className="b3-grid b3-even">
          <div className="b3-col">
            <Head s={s} />
            <Sub s={s} />
            <div className="b2-year">
              <div className="b2-year-num">{s.year}</div>
              <p>
                <T text={s.yearText} />
              </p>
            </div>
          </div>
          <div className="b2-org">
            <div className="b2-org-root">
              <Landmark size={18} strokeWidth={1.7} />
              {s.root}
            </div>
            {s.nodes.map((n) => (
              <Fragment key={n.title}>
                <span className="b2-org-line" aria-hidden="true" />
                <Card c={n} />
              </Fragment>
            ))}
          </div>
        </div>
      );

    case "list":
      return (
        <div className="b3-grid">
          <div className="b3-col">
            <Head s={s} />
            <Sub s={s} />
            <ol className="b3-recs">
              {s.items.map((it, i) => {
                const Icon = it.icon;
                return (
                  <li key={it.text} className={it.sub ? "b2-hl" : ""}>
                    <span className="b3-rec-icon">
                      <Icon size={18} strokeWidth={1.7} />
                    </span>
                    <span className="b3-rec-n">{i + 1}</span>
                    <div>
                      <div className="b3-rec-t">
                        {it.bold && <b>{it.bold}. </b>}
                        <T text={it.text} />
                      </div>
                      {it.sub && (
                        <div className="b3-rec-s">
                          <T text={it.sub} />
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
            {s.foot && (
              <p className="b3-src">
                <T text={s.foot} />
              </p>
            )}
          </div>
          <PhotoFrame p={s.photo} />
        </div>
      );

    case "versus":
      return (
        <div className="b3-full">
          <Head s={s} />
          <Sub s={s} />
          <div className="b2-vs">
            {[s.a, s.b].map((c, i) => {
              const Icon = c.icon;
              return (
                <Fragment key={c.title}>
                  {i === 1 && <span className="b2-vs-disc">vs</span>}
                  <div className={`b2-vs-card ${c.tone ?? ""}`}>
                    <div className="b2-card-top">
                      <span className="b2-card-icon">
                        <Icon size={26} strokeWidth={1.5} />
                      </span>
                      <span className="b2-card-pill">{c.pill}</span>
                    </div>
                    <div className="b2-vs-name">{c.title}</div>
                    <div className="b2-vs-kind">{c.desc}</div>
                    {c.extra && (
                      <p className="b2-vs-text">
                        <T text={c.extra} />
                      </p>
                    )}
                  </div>
                </Fragment>
              );
            })}
          </div>
          <div className="b3-verdict">
            <span>{s.note}</span>
          </div>
        </div>
      );

    case "timeline":
      return (
        <div className="b3-full">
          <Head s={s} />
          <Sub s={s} />
          <ol className="b2-tl">
            {s.events.map((e) => (
              <li key={e.year}>
                <span className="b2-tl-dot" />
                <div className="b2-tl-year">{e.year}</div>
                <div className="b2-tl-title">{e.title}</div>
                <p className="b2-tl-desc">
                  <T text={e.desc} />
                </p>
              </li>
            ))}
          </ol>
          <div className="b2-tl-facts">
            <Facts items={s.facts} />
          </div>
        </div>
      );

    case "tiers":
      return (
        <div className="b3-grid b3-even">
          <div className="b3-col">
            <Head s={s} />
            <Sub s={s} />
            <Facts items={s.facts} />
          </div>
          <div className="b2-tiers">
            {s.tiers.map((t, i) => (
              <Fragment key={t.title}>
                {i > 0 && (
                  <span className="b2-tier-arrow" aria-hidden="true">
                    <ArrowDown size={18} strokeWidth={1.8} />
                  </span>
                )}
                <Card c={t} />
              </Fragment>
            ))}
          </div>
        </div>
      );

    case "money":
      return (
        <div className="b3-grid b3-even">
          <div className="b3-col">
            <Head s={s} />
            <Sub s={s} />
            <Facts items={s.facts} />
          </div>
          <div className="b3-law">
            <div className="b3-law-top">
              <Landmark size={22} strokeWidth={1.5} />
              <span>{s.panelLabel}</span>
            </div>
            <div className="b2-money">
              {s.figures.map((f) => (
                <div key={f.num}>
                  <div className="b2-money-num">{f.num}</div>
                  <div className="b2-money-label">
                    <T text={f.label} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "table":
      return (
        <div className="b3-full b2-wide">
          <Head s={s} />
          <Sub s={s} />
          <div className="b2-table-wrap">
            <table className="b2-table">
              <thead>
                <tr>
                  {tableHead.map((h, i) => (
                    <th key={h}>
                      {i > 0 && (
                        <span className="b3-flag">{COUNTRIES[i - 1].code}</span>
                      )}
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, ci) =>
                      ci === 0 ? (
                        <th key={ci} scope="row">
                          {cell}
                        </th>
                      ) : (
                        <td key={ci}>
                          <T text={cell} />
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case "compare":
      return (
        <div className="b3-full">
          <Head s={s} />
          <Sub s={s} />
          <div className="b2-cmp">
            {s.countries.map((c) => (
              <div className="b2-cmp-card" key={c.code}>
                <div className="b2-cmp-top">
                  <span className="b3-flag">{c.code}</span>
                  <b>{c.name}</b>
                  <span className="b2-card-pill">{c.pill}</span>
                </div>
                <p>
                  <T text={c.desc} />
                </p>
              </div>
            ))}
          </div>
          <div className="b2-cmp-points">
            {s.points.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.bold}>
                  <div className="b2-cmp-ph">
                    <Icon size={18} strokeWidth={1.8} />
                    {p.bold}
                  </div>
                  <p>
                    <T text={p.text} />
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      );

    case "lessons":
      return (
        <div className="b3-grid b3-even">
          <div className="b3-col">
            <Head s={s} />
            <Sub s={s} />
            <ol className="b2-lessons">
              {s.items.map((it, i) => (
                <li key={it.bold}>
                  <span className="b2-lesson-n">{i + 1}</span>
                  <div>
                    <div className="b2-lesson-t">{it.bold}</div>
                    <p>
                      <T text={it.text} />
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="b2-actors">
            <div className="b3-law-top">Хэн юу хийх вэ · санал</div>
            {s.actors.map((a) => {
              const Icon = a.icon;
              return (
                <div className="b2-actor" key={a.title}>
                  <span className="b2-actor-icon">
                    <Icon size={20} strokeWidth={1.6} />
                  </span>
                  <div>
                    <b>{a.title}</b>
                    <p>{a.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );

    case "refs":
      return (
        <div className="b3-full b2-wide">
          <Head s={s} />
          <Sub s={s} />
          <ol className="b2-refs">
            {referencesList.map((r) => (
              <li key={r.id}>
                <span className="b2-ref-id">{r.id}</span>
                <a href={r.url} target="_blank" rel="noopener noreferrer">
                  {r.title}
                </a>
              </li>
            ))}
          </ol>
        </div>
      );
  }
}

/* ------------------------------------------------------------------ */
/* CSS (b3-ийн нийтлэг загвар дээр нэмэгдэл)                           */
/* ------------------------------------------------------------------ */

const css = `
.b2-ref{font-family:var(--mono);font-size:.68em;color:var(--mute);margin-left:.25em;letter-spacing:0;white-space:nowrap;font-style:normal;font-weight:400}
.b2-na{font-style:italic;color:var(--mute)}
.b3-facts li.b2-muted{color:var(--ink-2)}
.b3-facts li.b2-muted svg{color:var(--mute)}
.b3-facts b,.b3-rec-t b{font-weight:600}
.b2-wide{max-width:1400px}

/* cards */
.b2-cards{display:grid;gap:clamp(12px,1.8vw,26px);margin-top:1vh}
.b2-card{position:relative;display:flex;flex-direction:column;padding:clamp(18px,3.4vh,36px) clamp(16px,1.8vw,28px);border-radius:16px;
  background:rgba(255,255,255,.5);border:1px solid var(--rule);backdrop-filter:blur(4px);min-height:clamp(200px,34vh,340px)}
.b2-card.ink{background:var(--ink);border-color:var(--ink);color:var(--paper)}
.b2-card.accent{background:var(--accent-soft);border-color:rgba(184,97,47,.35)}
.b2-card.warn{background:transparent;border:1.5px dashed rgba(184,97,47,.55)}
.b2-card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:auto}
.b2-card-icon{display:inline-grid;place-items:center;width:clamp(48px,7.4vh,62px);height:clamp(48px,7.4vh,62px);border-radius:50%;
  background:var(--accent-soft);color:var(--accent);flex-shrink:0}
.b2-card.ink .b2-card-icon{background:rgba(243,237,226,.1);color:#e7a477}
.b2-card-pill{font-family:var(--mono);font-size:10.5px;font-weight:600;letter-spacing:.08em;color:var(--accent);padding-top:4px;text-align:right}
.b2-card.ink .b2-card-pill{color:#e7a477}
.b2-card-title{font-family:var(--serif);font-size:clamp(22px,3.5vh,34px);line-height:1.1;margin-top:2.4vh;color:inherit}
.b2-card-desc{font-size:clamp(14px,1.95vh,17.5px);line-height:1.42;margin-top:1.2vh;color:inherit;opacity:.9}
.b2-card-extra{font-family:var(--serif);font-style:italic;font-size:clamp(15px,2.1vh,19px);line-height:1.35;margin-top:1.6vh;padding-top:1.4vh;
  border-top:1px solid var(--rule);color:var(--ink-2)}
.b2-card.ink .b2-card-extra{border-color:rgba(243,237,226,.18);color:rgba(243,237,226,.85)}
.b2-cards.n4 .b2-card-title{font-size:clamp(20px,3vh,28px)}
.b2-cards.n2 .b2-card{min-height:clamp(200px,30vh,300px)}
.b2-cards.n2 .b2-card-title{font-size:clamp(24px,4.2vh,40px)}

/* tiles */
.b2-tiles{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(12px,1.8vw,22px);margin-top:1vh}
.b2-tile{position:relative;display:flex;flex-direction:column;gap:1.6vh;padding:clamp(18px,3.2vh,32px) clamp(16px,1.8vw,26px);border-radius:16px;
  background:rgba(255,255,255,.5);border:1px solid var(--rule);backdrop-filter:blur(4px)}
.b2-tile:nth-child(1),.b2-tile:nth-child(6){background:var(--ink);border-color:var(--ink);color:var(--paper)}
.b2-tile-icon{display:inline-grid;place-items:center;width:clamp(44px,6.6vh,56px);height:clamp(44px,6.6vh,56px);border-radius:50%;background:var(--accent-soft);color:var(--accent)}
.b2-tile:nth-child(1) .b2-tile-icon,.b2-tile:nth-child(6) .b2-tile-icon{background:rgba(243,237,226,.1);color:#e7a477}
.b2-tile-n{position:absolute;top:clamp(16px,2.8vh,28px);right:22px;font-family:var(--mono);font-size:11px;font-weight:600;color:var(--accent)}
.b2-tile:nth-child(1) .b2-tile-n,.b2-tile:nth-child(6) .b2-tile-n{color:#e7a477}
.b2-tile-t{font-family:var(--serif);font-size:clamp(21px,3.4vh,32px);line-height:1.12}

/* ladder */
.b2-ladder{list-style:none;display:flex;flex-direction:column;margin-top:.6vh}
.b2-ladder li{display:grid;grid-template-columns:28px 38px 1fr minmax(80px,28%);gap:12px;align-items:center;padding:1.5vh 0;border-bottom:1px solid var(--rule)}
.b2-ladder-n{font-family:var(--mono);font-size:11px;font-weight:600;color:var(--mute)}
.b2-ladder-icon{display:grid;place-items:center;width:36px;height:36px;border-radius:10px;background:var(--accent-soft);color:var(--accent)}
.b2-ladder-t{font-size:clamp(15px,2.15vh,19px);font-weight:500;color:var(--ink)}
.b2-ladder-bar{height:6px;border-radius:6px;background:rgba(21,49,42,.08);overflow:hidden}
.b2-ladder-bar i{display:block;height:100%;border-radius:6px;background:linear-gradient(90deg,#e7a477,var(--accent))}
.b2-ladder-axis{display:flex;justify-content:flex-end;gap:calc(28% - 60px);font-family:var(--mono);font-size:10px;letter-spacing:.08em;
  text-transform:uppercase;color:var(--mute);margin-top:1vh}
.b2-side-q{font-family:var(--serif);font-size:clamp(80px,16vh,170px);line-height:.85;margin-top:2vh;color:#e7a477}
.b2-side-na{font-family:var(--serif);font-style:italic;font-size:clamp(16px,2.3vh,22px);opacity:.75;border-top:1px solid rgba(243,237,226,.18);padding-top:2vh}

/* org */
.b2-year{margin-top:1vh;border-top:1.5px solid var(--ink);padding-top:2vh;max-width:540px}
.b2-year-num{font-family:var(--serif);font-size:clamp(70px,15vh,160px);line-height:.85;letter-spacing:-.03em;color:var(--ink)}
.b2-year p{font-size:clamp(15px,2.15vh,19px);line-height:1.4;color:var(--ink-2);margin-top:3vh}
.b2-org{display:flex;flex-direction:column;align-items:stretch}
.b2-org-root{align-self:center;display:inline-flex;align-items:center;gap:10px;padding:1.4vh 26px;border-radius:999px;background:var(--accent);color:#fff;
  font-family:var(--mono);font-size:14px;font-weight:600;letter-spacing:.12em}
.b2-org-line{align-self:center;width:1.5px;height:2.6vh;background:var(--ink-2);opacity:.5}
.b2-org .b2-card{min-height:0}
.b2-org .b2-card-top{margin-bottom:0}
.b2-org .b2-card-title{margin-top:1.4vh;font-size:clamp(20px,3vh,28px)}

/* versus */
.b2-vs{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);gap:clamp(12px,1.6vw,22px);align-items:stretch;margin-top:1vh}
.b2-vs-card{display:flex;flex-direction:column;padding:clamp(20px,3.6vh,40px) clamp(18px,2.2vw,34px);border-radius:16px;
  background:rgba(255,255,255,.5);border:1px solid var(--rule);backdrop-filter:blur(4px)}
.b2-vs-card.ink{background:var(--ink);border-color:var(--ink);color:var(--paper)}
.b2-vs-card.ink .b2-card-icon{background:rgba(243,237,226,.1);color:#e7a477}
.b2-vs-card.ink .b2-card-pill{color:#e7a477}
.b2-vs-name{font-family:var(--serif);font-size:clamp(44px,9vh,92px);line-height:.95;letter-spacing:-.02em;margin-top:2.4vh}
.b2-vs-kind{font-family:var(--mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);margin-top:1vh}
.b2-vs-card.ink .b2-vs-kind{color:#e7a477}
.b2-vs-text{font-size:clamp(15px,2.1vh,19px);line-height:1.42;margin-top:2vh;opacity:.92}
.b2-vs-disc{align-self:center;display:grid;place-items:center;width:clamp(46px,7vh,60px);height:clamp(46px,7vh,60px);border-radius:50%;
  border:1.5px solid var(--accent);color:var(--accent);font-family:var(--serif);font-style:italic;font-size:clamp(20px,3vh,26px);background:var(--paper)}

/* timeline */
.b2-tl{list-style:none;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:clamp(14px,2vw,28px);margin-top:2.4vh;position:relative}
.b2-tl::before{content:"";position:absolute;left:0;right:0;top:7px;height:1.5px;background:var(--ink);opacity:.35}
.b2-tl li{position:relative;padding-top:3.4vh}
.b2-tl-dot{position:absolute;top:0;left:0;width:16px;height:16px;border-radius:50%;background:var(--paper);border:2px solid var(--accent)}
.b2-tl li:nth-child(2) .b2-tl-dot{background:var(--accent)}
.b2-tl-year{font-family:var(--serif);font-size:clamp(42px,8.4vh,86px);line-height:.9;letter-spacing:-.02em;color:var(--ink)}
.b2-tl-title{font-weight:600;font-size:clamp(15px,2.2vh,19px);margin-top:1.2vh;color:var(--ink)}
.b2-tl-desc{font-size:clamp(13.5px,1.9vh,16.5px);line-height:1.4;color:var(--ink-2);margin-top:.6vh}
.b2-tl-facts{margin-top:3.6vh;padding-top:2.2vh;border-top:1px solid var(--rule)}
.b2-tl-facts .b3-facts{flex-direction:row;gap:clamp(16px,3vw,48px)}
.b2-tl-facts .b3-facts li{flex:1}

/* tiers */
.b2-tiers{display:flex;flex-direction:column}
.b2-tiers .b2-card{min-height:0}
.b2-tiers .b2-card-title{margin-top:1.6vh}
.b2-tier-arrow{align-self:center;display:grid;place-items:center;width:34px;height:34px;margin:-6px 0;z-index:1;border-radius:50%;
  background:var(--paper);border:1px solid var(--rule);color:var(--accent)}

/* money */
.b2-money{display:grid;grid-template-columns:1fr 1fr;gap:3vh 24px;margin-top:3vh;border-top:1px solid rgba(243,237,226,.18);padding-top:3vh}
.b2-money-num{font-family:var(--serif);font-size:clamp(30px,6vh,62px);line-height:1;letter-spacing:-.02em;white-space:nowrap}
.b2-money > div:nth-child(-n+2) .b2-money-num{color:#e7a477}
.b2-money-label{font-size:clamp(12.5px,1.75vh,15px);opacity:.75;margin-top:.8vh;line-height:1.3}
.b2-money-label .b2-ref{color:rgba(243,237,226,.6)}

/* table */
.b2-table-wrap{margin-top:.6vh;border-radius:14px;overflow:hidden;border:1px solid var(--rule);background:rgba(255,255,255,.5);backdrop-filter:blur(4px)}
.b2-table{width:100%;border-collapse:collapse;font-size:clamp(12.5px,1.8vh,16px);line-height:1.32}
.b2-table thead th{background:var(--ink);color:var(--paper);font-weight:600;text-align:left;padding:1.4vh 14px;font-size:.92em}
.b2-table thead th .b3-flag{background:var(--accent);margin-right:8px}
.b2-table tbody th{font-weight:600;text-align:left;color:var(--ink);width:17%}
.b2-table tbody th,.b2-table td{padding:1.15vh 14px;border-top:1px solid var(--rule);vertical-align:top;color:var(--ink)}
.b2-table tbody tr:nth-child(even){background:rgba(21,49,42,.03)}

/* compare */
.b2-cmp{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(12px,1.8vw,24px);margin-top:1vh}
.b2-cmp-card{padding:clamp(16px,2.8vh,28px) clamp(16px,1.8vw,26px);border-radius:16px;background:rgba(255,255,255,.5);border:1px solid var(--rule);backdrop-filter:blur(4px)}
.b2-cmp-card:nth-child(3){background:var(--ink);border-color:var(--ink);color:var(--paper)}
.b2-cmp-card:nth-child(3) .b3-flag{background:var(--accent)}
.b2-cmp-card:nth-child(3) .b2-card-pill{color:#e7a477}
.b2-cmp-top{display:flex;align-items:center;gap:10px}
.b2-cmp-top b{font-family:var(--serif);font-weight:400;font-size:clamp(22px,3.4vh,32px);flex:1}
.b2-cmp-card p{font-size:clamp(14px,1.95vh,17.5px);line-height:1.42;margin-top:1.6vh}
.b2-cmp-points{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(12px,1.8vw,24px);margin-top:3vh;padding-top:2.4vh;border-top:1.5px solid var(--ink)}
.b2-cmp-ph{display:flex;align-items:center;gap:10px;font-family:var(--mono);font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--accent)}
.b2-cmp-points p{font-size:clamp(14px,1.95vh,17.5px);line-height:1.42;color:var(--ink);margin-top:1vh}

/* lessons */
.b2-lessons{list-style:none;display:flex;flex-direction:column;margin-top:.6vh}
.b2-lessons li{display:grid;grid-template-columns:auto 1fr;gap:clamp(14px,1.6vw,22px);align-items:start;padding:2vh 0;border-bottom:1px solid var(--rule)}
.b2-lessons li:last-child{border-bottom:none}
.b2-lesson-n{font-family:var(--serif);font-size:clamp(44px,8vh,80px);line-height:.8;color:var(--accent);min-width:.7em}
.b2-lesson-t{font-family:var(--serif);font-size:clamp(21px,3.2vh,30px);line-height:1.1;color:var(--ink)}
.b2-lessons p{font-size:clamp(14px,1.95vh,17.5px);line-height:1.42;color:var(--ink-2);margin-top:.8vh}
.b2-actors{display:flex;flex-direction:column;gap:1.6vh;padding:clamp(22px,4vh,40px) clamp(20px,2.4vw,36px);border-radius:18px;
  background:var(--ink);color:var(--paper);box-shadow:0 30px 60px -28px rgba(21,49,42,.6)}
.b2-actor{display:grid;grid-template-columns:auto 1fr;gap:16px;align-items:center;padding-top:1.6vh;border-top:1px solid rgba(243,237,226,.18)}
.b2-actor-icon{display:grid;place-items:center;width:clamp(42px,6.4vh,52px);height:clamp(42px,6.4vh,52px);border-radius:50%;background:rgba(243,237,226,.1);color:#e7a477}
.b2-actor b{font-family:var(--serif);font-weight:400;font-size:clamp(20px,3vh,28px);line-height:1.1}
.b2-actor p{font-size:clamp(13.5px,1.9vh,16.5px);line-height:1.4;opacity:.8;margin-top:.5vh}

/* list highlight */
.b3-recs li.b2-hl .b3-rec-icon{background:var(--ink);color:#e7a477}

/* refs */
.b2-refs{list-style:none;columns:2;column-gap:clamp(20px,3vw,48px);margin-top:.6vh;font-size:clamp(12.5px,1.75vh,15px);line-height:1.32}
.b2-refs li{break-inside:avoid;display:grid;grid-template-columns:38px 1fr;gap:6px;padding:.75vh 0;border-bottom:1px solid var(--rule)}
.b2-ref-id{font-family:var(--mono);font-size:.86em;font-weight:600;color:var(--accent)}
.b2-refs a{color:var(--ink);text-decoration:none}
.b2-refs a:hover{color:var(--accent);text-decoration:underline}

@media (max-width:900px),(max-height:560px){
  .b2-cards,.b2-tiles,.b2-tl,.b2-cmp,.b2-cmp-points{grid-template-columns:minmax(0,1fr)!important}
  .b2-card{min-height:0}
  .b2-vs{grid-template-columns:minmax(0,1fr)}
  .b2-vs-disc{justify-self:center}
  .b2-tl::before{display:none}
  .b2-tl-facts .b3-facts{flex-direction:column}
  .b2-refs{columns:1}
  .b2-table-wrap{overflow-x:auto}
  .b2-table{min-width:680px}
  .b2-ladder li{grid-template-columns:24px 38px 1fr}
  .b2-ladder-bar,.b2-ladder-axis{display:none}
}
`;

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const names = slides.map((s) => s.name);
const brandSub = (i: number) => GROUPS[slides[i]?.group ?? 0].name;
const renderSlide = (i: number) => <SlideBody s={slides[i]} />;

export default function Home() {
  return (
    <DeckShell
      deck="02"
      names={names}
      brandSub={brandSub}
      poseFor={poseFor}
      renderSlide={renderSlide}
      pptx="/downloads/biydalt2.pptx"
      extraCss={css}
    />
  );
}
