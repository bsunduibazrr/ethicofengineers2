"use client";

import { BookOpen, Check, CircleAlert, Landmark, Scale, X } from "lucide-react";
import type { SlideState } from "../hourglass";
import DeckShell from "../DeckShell";
import {
  COUNTRIES,
  STEPS,
  slides,
  type Photo,
  type Slide,
} from "../../decks/biydalt3";

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
                    <Icon
                      className="b3-stat-icon"
                      size={20}
                      strokeWidth={1.6}
                    />
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
              <div className="b3-th-meta">
                Бентам, Милл · Үр дагавраар дүгнэнэ
              </div>
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
/* Page                                                                */
/* ------------------------------------------------------------------ */

const names = slides.map((s) => s.name);
const brandSub = (i: number) => {
  const c = slides[i]?.country;
  return c !== undefined ? COUNTRIES[c].name : "Кейс шинжилгээ";
};
const renderSlide = (i: number) => <SlideBody s={slides[i]} />;

export default function Biydalt3() {
  return (
    <DeckShell
      deck="03"
      names={names}
      brandSub={brandSub}
      poseFor={poseFor}
      renderSlide={renderSlide}
      pptx="/downloads/biydalt3.pptx"
    />
  );
}
