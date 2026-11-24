/* Хоёр илтгэлийн (02, 03) нийтлэг загвар. DeckShell-д ".b3" класс дээр хэрэглэгдэнэ. */

export const deckCss = `
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
  .b3-grid,.b3-grid.b3-even,.b3-intro{display:flex;flex-direction:column;align-items:stretch;height:auto;gap:20px;margin-block:auto}
  .b3-grid > *{flex-shrink:0}
  .b3-law{align-self:stretch}
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

/* download */
.deck-right{display:flex;align-items:center;gap:10px;pointer-events:auto}
.deck-dl{display:inline-flex;align-items:center;gap:7px;font-family:var(--mono);font-size:11px;font-weight:600;letter-spacing:.06em;
  padding:7px 13px;border-radius:20px;background:var(--ink);color:var(--paper);text-decoration:none;transition:background .2s}
.deck-dl:hover{background:var(--accent)}
@media (max-width:900px){.deck-dl span{display:none}.deck-dl{padding:7px 9px}}
@media print{.deck-dl{display:none}}
`;
