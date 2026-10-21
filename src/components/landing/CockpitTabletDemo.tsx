"use client";

import React, { useEffect, useRef, useState } from "react";

// Pré-calcul vectoriel déterministe du QR code fiscal DGI (grille 21x21)
function generateFiscalQrPath(): string {
  let s = 90;
  const r = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  let p = "";
  const N = 21;
  const fd = (x: number, y: number) => {
    for (const [a, b] of [
      [0, 0],
      [N - 7, 0],
      [0, N - 7],
    ]) {
      if (x >= a && x < a + 7 && y >= b && y < b + 7) {
        const u = x - a;
        const v = y - b;
        return u === 0 || u === 6 || v === 0 || v === 6 || (u > 1 && u < 5 && v > 1 && v < 5)
          ? 1
          : 0;
      }
    }
    return null;
  };

  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      let q = fd(x, y);
      if (q === null) {
        q =
          (x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9)
            ? 0
            : r() > 0.5
            ? 1
            : 0;
      }
      if (q) {
        p += `M${x} ${y}h1v1h-1z`;
      }
    }
  }
  return p;
}

export function CockpitTabletDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const camRef = useRef<HTMLDivElement>(null);
  const curRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);


  // Éléments du cockpit
  const v1Ref = useRef<HTMLElement>(null);
  const v2Ref = useRef<HTMLElement>(null);
  const invRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<HTMLDivElement>(null);
  const tvRef = useRef<HTMLDivElement>(null);
  const b1Ref = useRef<HTMLButtonElement>(null);
  const bRRef = useRef<HTMLButtonElement>(null);
  const bTRef = useRef<HTMLButtonElement>(null);
  const ttcRef = useRef<HTMLDivElement>(null);

  const [qrPath, setQrPath] = useState("");
  const [scale, setScale] = useState(1);

  useEffect(() => {
    setQrPath(generateFiscalQrPath());
  }, []);

  // Gestion du redimensionnement fluide de la tablette (Scale sur 1280x720 natif)
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const newScale = width / 1280;
      setScale(newScale);
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (containerRef.current) {
      ro.observe(containerRef.current);
    }
    window.addEventListener("resize", updateScale);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  // Moteur de rendu cinématique 20s (Camera Pan/Zoom + Curseur Bézier + Animations Réactives)
  useEffect(() => {
    const D = 20; // 20 secondes par cycle
    let animId: number;

    const fmt = (n: number) =>
      String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");

    interface TweenItem {
      el: HTMLElement;
      a: number;
      b: number;
      s: number;
    }
    const tw: TweenItem[] = [];
    const roll = (el: HTMLElement | null, a: number, b: number) => {
      if (el) tw.push({ el, a, b, s: performance.now() });
    };

    // Coordonnées cibles par défaut dans l'espace 1280x720
    const P = {
      ca: [175, 148],
      ttc: [209, 552],
      b1: [159, 640],
      bR: [948, 492],
      bT: [989, 209],
    };

    // Recalcul précis via le DOM si les éléments sont montés
    if (stageRef.current) {
      const sRect = stageRef.current.getBoundingClientRect();
      const currentF = sRect.width / 1280 || 1;
      const getCtr = (el: HTMLElement | null, fallback: number[]) => {
        if (!el || !stageRef.current) return fallback;
        const r = el.getBoundingClientRect();
        return [
          (r.left + r.width / 2 - sRect.left) / currentF,
          (r.top + r.height / 2 - sRect.top) / currentF,
        ];
      };

      P.ca = getCtr(v1Ref.current, P.ca);
      P.ttc = getCtr(ttcRef.current, P.ttc);
      P.b1 = getCtr(b1Ref.current, P.b1);
      P.bR = getCtr(bRRef.current, P.bR);
      P.bT = getCtr(bTRef.current, P.bT);
    }

    if (tipRef.current) {
      tipRef.current.style.left = `${P.ca[0] + 8}px`;
      tipRef.current.style.top = `${P.ca[1] + 26}px`;
    }

    const S = [1150, 600];
    const M: Array<[number, number, number[]]> = [
      [0, 1.9, P.ca],
      [3.2, 5.6, P.ttc],
      [5.6, 6.9, P.b1],
      [9, 10.9, P.bR],
      [14, 15.5, P.bT],
    ];

    const eo = (u: number) => 1 - Math.pow(1 - u, 4);
    const io = (u: number) =>
      u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;

    function pos(t: number): [number, number] {
      let from = S;
      let x = S[0];
      let y = S[1];
      for (const [a, b, to] of M) {
        if (t < a) break;
        if (t >= b) {
          from = to;
          x = to[0];
          y = to[1];
          continue;
        }
        const u = eo((t - a) / (b - a));
        const dx = to[0] - from[0];
        const dy = to[1] - from[1];
        const cx = (from[0] + to[0]) / 2 - dy * 0.18;
        const cy = (from[1] + to[1]) / 2 + dx * 0.18;
        const w = 1 - u;
        x = w * w * from[0] + 2 * w * u * cx + u * u * to[0];
        y = w * w * from[1] + 2 * w * u * cy + u * u * to[1];
        break;
      }
      return [x, y];
    }

    const K: Array<[number, number, number, number]> = [
      [0, 1, 640, 360],
      [3.8, 1, 640, 360],
      [4.9, 1.25, 512, 432],
      [9, 1.25, 512, 432],
      [10.1, 1.25, 768, 432],
      [14, 1.25, 768, 432],
      [14.9, 1.25, 768, 288],
      [18, 1.25, 768, 288],
      [19.6, 1, 640, 360],
      [20, 1, 640, 360],
    ];

    function camAt(t: number) {
      if (!camRef.current) return;
      let i = 0;
      while (i < K.length - 2 && t >= K[i + 1][0]) i++;
      const a = K[i];
      const b = K[i + 1];
      const u = io(Math.min(1, Math.max(0, (t - a[0]) / (b[0] - a[0]))));
      const s = a[1] + (b[1] - a[1]) * u;
      const cx = a[2] + (b[2] - a[2]) * u;
      const cy = a[3] + (b[3] - a[3]) * u;
      camRef.current.style.transform = `translate(${640 - cx * s}px, ${
        360 - cy * s
      }px) scale(${s})`;
    }

    let curX = 0;
    let curY = 0;

    function clk(el: HTMLElement | null) {
      if (!el || !curRef.current || !camRef.current) return;
      el.classList.add("press");
      setTimeout(() => el.classList.remove("press"), 80);

      const svgEl = curRef.current.querySelector("svg");
      if (svgEl && svgEl.animate) {
        svgEl.animate(
          [
            { transform: "scale(1)" },
            { transform: "scale(.88)", offset: 0.4 },
            { transform: "scale(1)" },
          ],
          { duration: 115, easing: "ease-out" }
        );
      }

      const r = document.createElement("div");
      r.className = "rp";
      r.style.left = `${curX}px`;
      r.style.top = `${curY}px`;
      camRef.current.appendChild(r);

      if (r.animate) {
        r.animate(
          [
            { opacity: 1, transform: "scale(1)" },
            { opacity: 0, transform: "scale(3)" },
          ],
          { duration: 180, easing: "ease-out" }
        ).onfinish = () => r.remove();
      } else {
        setTimeout(() => r.remove(), 200);
      }
    }

    const reset = () => {
      if (invRef.current) invRef.current.className = "pn";
      if (recRef.current) recRef.current.className = "pn";
      if (tvRef.current) tvRef.current.className = "k tv";
      roll(v1Ref.current, 29630000, 28450000);
      roll(v2Ref.current, 10980000, 9800000);
    };

    const E: Array<[number, () => void]> = [
      [2, () => tipRef.current?.classList.add("on")],
      [2.9, () => tipRef.current?.classList.remove("on")],
      [7.2, () => clk(b1Ref.current)],
      [
        7.5,
        () => {
          invRef.current?.classList.add("ok");
          roll(v1Ref.current, 28450000, 29630000);
        },
      ],
      [11.4, () => clk(bRRef.current)],
      [11.5, () => recRef.current?.classList.add("m")],
      [
        12.4,
        () => {
          recRef.current?.classList.add("l");
          roll(v2Ref.current, 9800000, 10980000);
        },
      ],
      [
        15.6,
        () => {
          clk(bTRef.current);
          tvRef.current?.classList.add("s1");
        },
      ],
      [
        16.1,
        () => {
          tvRef.current?.classList.remove("s1");
          tvRef.current?.classList.add("s2");
        },
      ],
      [19.4, reset],
    ];

    const fire = (a: number, b: number) => {
      E.forEach(([e, fn]) => {
        if (e >= a && e < b) fn();
      });
    };

    let t0 = performance.now();
    let prev = 0;

    function frame(now: number) {
      const t = ((now - t0) / 1000) % D;
      if (t < prev) {
        fire(prev, D + 1);
        prev = 0;
      }
      fire(prev, t);
      prev = t;

      camAt(t);
      [curX, curY] = pos(t);

      if (curRef.current) {
        curRef.current.style.transform = `translate(${curX}px, ${curY}px)`;
        curRef.current.style.opacity = String(
          t < 0.5 ? t / 0.5 : t > 18.2 ? Math.max(0, 1 - (t - 18.2) / 0.6) : 1
        );
      }

      for (let i = tw.length - 1; i >= 0; i--) {
        const w = tw[i];
        const u = Math.min(1, (now - w.s) / 300);
        w.el.textContent = fmt(
          u < 1 ? Math.round((w.a + (w.b - w.a) * u) / 1000) * 1000 : w.b
        );
        if (u >= 1) tw.splice(i, 1);
      }



      animId = requestAnimationFrame(frame);
    }

    camAt(0);
    animId = requestAnimationFrame((n) => {
      t0 = n;
      frame(n);
    });

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto mt-6 sm:mt-10 select-none">
      {/* ── SYMBOLES VECTORIELS DU COCKPIT ── */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <symbol id="icon-trend" viewBox="0 0 24 24">
            <path
              d="M22 7 13.5 15.5l-5-5L2 17M16 7h6v6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </symbol>
          <symbol id="icon-wallet" viewBox="0 0 24 24">
            <path
              d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </symbol>
          <symbol id="icon-landmark" viewBox="0 0 24 24">
            <path
              d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2l8 5H4z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </symbol>
          <symbol id="icon-check" viewBox="0 0 24 24">
            <path
              d="M20 6 9 17l-5-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </symbol>
          <symbol id="icon-loader" viewBox="0 0 24 24">
            <path
              d="M21 12a9 9 0 1 1-6.219-8.56"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </symbol>
          <symbol id="icon-link" viewBox="0 0 24 24">
            <path
              d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </symbol>
        </defs>
      </svg>

      {/* ── CHÂSSIS DE TABLETTE RÉALISTE EN ALUMINIUM ANODISÉ SOMBRE ── */}
      <div className="relative rounded-[28px] sm:rounded-[38px] md:rounded-[46px] p-2.5 sm:p-3.5 md:p-4 bg-[#23201C] border-4 sm:border-[7px] md:border-[9px] border-[#2E2A25] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.08)]">
        {/* Encoche bouton d'alimentation (haut droit) */}
        <div className="absolute -top-[3px] right-14 sm:right-20 w-8 sm:w-12 h-[3px] bg-[#2E2A25] rounded-t-sm" />
        {/* Encoche bouton de volume (côté droit) */}
        <div className="absolute -right-[3px] top-14 sm:top-20 w-[3px] h-10 sm:h-14 bg-[#2E2A25] rounded-r-sm" />

        {/* Capteur optique caméra frontale centré sur la bordure supérieure */}
        <div className="absolute top-2 sm:top-2.5 left-1/2 -translate-x-1/2 flex items-center justify-center z-30 pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-[#141210] ring-1 ring-white/10 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-[#3B82F6]/30" />
          </div>
        </div>

        {/* Écran intérieur de la tablette (Format 16/9 fluide) */}
        <div
          ref={containerRef}
          className="relative w-full aspect-[16/9] rounded-[18px] sm:rounded-[24px] md:rounded-[32px] overflow-hidden bg-background border border-border shadow-inner"
        >
          {/* Canvas virtuel natif 1280x720 mis à l'échelle dynamiquement */}
          <div
            ref={stageRef}
            className="cockpit-stage absolute left-0 top-0 w-[1280px] h-[720px] origin-top-left overflow-hidden bg-background text-ink font-sans select-none"
            style={{
              transform: `scale(${scale})`,
              fontFeatureSettings: '"tnum"',
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {/* Caméra cinématique dynamique (pan & zoom) */}
            <div
              ref={camRef}
              className="absolute left-0 top-0 w-[1280px] h-[720px] origin-top-left will-change-transform"
            >
              {/* ── BARRE SUPÉRIEURE DU DASHBOARD ── */}
              <div className="absolute left-0 top-0 w-[1280px] h-14 border-b border-border bg-background flex items-center justify-between px-6 box-border">
                <div className="flex items-center gap-2.5 font-bold text-lg text-ink">
                  <span className="w-7 h-7 rounded-lg bg-primary text-ink flex items-center justify-center text-sm font-black">
                    C
                  </span>
                  <span>Ceilow</span>
                  <span className="font-normal text-sm text-text-muted pl-3 border-l border-border">
                    Bénin Entreprise SARL
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-success/25 text-[#0D6E4B] border border-[#0D6E4B]/40 rounded-full px-3 py-1 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#0D6E4B]" />
                  <span>e-MECeF Certifié DGI</span>
                </div>
              </div>

              {/* ── RANGÉE 1 : 3 CARTES KPI FINANCIÈRES ── */}
              <div className="absolute left-6 top-[76px] w-[1232px] h-[180px] grid grid-cols-3 gap-4">
                {/* KPI 1 : Chiffre d'Affaires */}
                <div className="k bg-background-secondary border border-border rounded-xl p-4 relative">
                  <div className="flex items-center gap-2 text-xs font-semibold text-text-muted">
                    <svg className="w-4 h-4 text-text-muted">
                      <use href="#icon-trend" />
                    </svg>
                    <span>Chiffre d’Affaires</span>
                  </div>
                  <div className="mt-3.5 text-3xl font-bold tracking-tight text-ink">
                    <b ref={v1Ref}>28 450 000</b>
                    <i className="not-italic text-sm font-semibold text-text-muted ml-1.5">
                      FCFA
                    </i>
                  </div>
                  <div className="mt-2 text-xs text-text-muted flex items-center gap-1.5">
                    <span className="text-[#0D6E4B] font-bold">+18,4 %</span>
                    <span>ce mois</span>
                  </div>
                </div>

                {/* KPI 2 : Trésorerie Actuelle */}
                <div className="k bg-background-secondary border border-border rounded-xl p-4 relative">
                  <div className="flex items-center gap-2 text-xs font-semibold text-text-muted">
                    <svg className="w-4 h-4 text-text-muted">
                      <use href="#icon-wallet" />
                    </svg>
                    <span>Trésorerie Actuelle</span>
                  </div>
                  <div className="mt-3.5 text-3xl font-bold tracking-tight text-ink">
                    <b ref={v2Ref}>9 800 000</b>
                    <i className="not-italic text-sm font-semibold text-text-muted ml-1.5">
                      FCFA
                    </i>
                  </div>
                  <div className="mt-2 text-xs text-text-muted">
                    Banques BOA, Ecobank &amp; MTN MoMo
                  </div>
                </div>

                {/* KPI 3 : Déclarations DGI Bénin */}
                <div
                  ref={tvRef}
                  className="k tv bg-background-secondary border border-border rounded-xl p-4 relative"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-text-muted">
                    <svg className="w-4 h-4 text-text-muted">
                      <use href="#icon-landmark" />
                    </svg>
                    <span>Déclarations DGI Bénin</span>
                    <span className="stt s0t inline-flex items-center gap-1 text-[11px] font-bold rounded-full px-2.5 py-0.5 bg-background border border-warning text-warning-deep ml-2">
                      En attente
                    </span>
                    <span className="stt s2t hidden items-center gap-1 text-[11px] font-bold rounded-full px-2.5 py-0.5 bg-success text-[#0D6E4B] border border-[#0D6E4B] ml-2">
                      Transmis
                    </span>
                  </div>
                  <div className="mt-2.5 text-xs text-text-muted">
                    Net à reverser · TVA du mois
                  </div>
                  <div className="mt-0.5 text-2xl font-bold tracking-tight text-ink">
                    <b>1 530 000</b>
                    <i className="not-italic text-sm font-semibold text-text-muted ml-1.5">
                      FCFA
                    </i>
                  </div>
                  <button
                    ref={bTRef}
                    type="button"
                    className="btn bt absolute left-4 top-[114px] w-[230px] h-[38px] rounded-lg bg-primary text-ink font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
                  >
                    <span className="t0">Télétransmettre DGI</span>
                    <span className="t1 hidden items-center gap-2">
                      <svg className="w-4 h-4 animate-spin">
                        <use href="#icon-loader" />
                      </svg>
                      <span>Chiffrement DGI...</span>
                    </span>
                    <span className="t2 hidden items-center gap-2">
                      <svg className="w-4 h-4">
                        <use href="#icon-check" />
                      </svg>
                      <span>Transmis DGI</span>
                    </span>
                  </button>
                  <div className="qt absolute left-4 top-[156px] text-[11px] font-bold text-[#0D6E4B] opacity-0 transition-opacity">
                    Quittance n° DGI-2026-8941 générée • Conforme loi des finances
                  </div>
                </div>
              </div>

              {/* ── RANGÉE 2 : MODULE FACTURATION & RAPPROCHEMENT SYSCOHADA ── */}
              <div className="absolute left-6 top-[272px] w-[1232px] h-[424px] grid grid-cols-[600px_1fr] gap-4">
                {/* Panneau 1 : Facturation Rapide e-MECeF */}
                <div
                  ref={invRef}
                  className="pn bg-background border border-border rounded-xl relative p-5"
                >
                  <h3 className="text-base font-bold text-ink">
                    Facturation rapide
                    <span className="block text-xs font-normal text-text-muted mt-0.5">
                      Émission et certification en 1 clic
                    </span>
                  </h3>

                  {/* Fausse facture papier */}
                  <div className="paper absolute left-5 top-16 w-[330px] h-[262px] bg-background-secondary border border-border rounded-lg p-4 box-border">
                    <div className="flex justify-between items-center font-bold text-sm text-ink">
                      <span>FAC-2026-090</span>
                      <span className="chip text-[11px] font-bold rounded-full px-2 py-0.5 bg-background border border-border">
                        <span className="c0 text-ink">Brouillon</span>
                        <span className="c1 hidden text-[#0D6E4B]">Certifiée</span>
                      </span>
                    </div>
                    <div className="text-xs text-text-muted mt-1.5 mb-3.5">
                      Cabinet Juridique du Port
                    </div>
                    <div className="row flex justify-between text-xs py-2 border-t border-border">
                      <span>Montant HT</span>
                      <span className="font-semibold">1 000 000 FCFA</span>
                    </div>
                    <div className="row flex justify-between text-xs py-2 border-t border-border">
                      <span>TVA 18 %</span>
                      <span className="font-semibold">180 000 FCFA</span>
                    </div>
                    <div
                      ref={ttcRef}
                      className="row t flex justify-between text-sm py-2 border-t border-border font-bold text-ink"
                    >
                      <span>Total TTC</span>
                      <span>1 180 000 FCFA</span>
                    </div>
                  </div>

                  {/* Zone Quittance & QR Code */}
                  <div className="qz absolute left-[370px] top-16 w-[210px] h-[262px] border border-dashed border-border rounded-lg box-border text-center relative overflow-hidden">
                    <div className="ph absolute inset-0 flex items-center justify-center text-xs text-text-muted">
                      QR fiscal DGI
                    </div>
                    <div className="stamp absolute left-4 top-4 right-4 bg-success text-[#0D6E4B] border-2 border-[#0D6E4B] rounded-md py-1.5 font-black text-sm tracking-wider opacity-0 transform scale-150 -rotate-6 transition-all duration-300">
                      CERTIFIÉ e-MECeF
                    </div>
                    <div className="qr absolute left-11 top-14 w-[120px] h-[120px] bg-background border border-border p-1.5 box-border opacity-0 transition-opacity">
                      {qrPath ? (
                        <svg
                          viewBox="0 0 21 21"
                          width="106"
                          height="106"
                          className="w-full h-full"
                        >
                          <path d={qrPath} fill="#332E29" />
                        </svg>
                      ) : null}
                    </div>
                    <div className="nim absolute left-0 right-0 top-48 text-[11px] font-semibold text-ink leading-tight opacity-0 transition-opacity">
                      NIM : BJ-0420-7781-90
                      <br />
                      QR Code fiscal DGI
                    </div>
                  </div>

                  {/* Bouton émission */}
                  <button
                    ref={b1Ref}
                    type="button"
                    className="btn b1 absolute left-5 top-[346px] w-[230px] h-11 rounded-lg bg-primary text-ink font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
                  >
                    <span className="x0">Émettre et certifier</span>
                    <span className="x1 hidden items-center gap-1.5 text-ink">
                      <svg className="w-4 h-4 text-[#0D6E4B]">
                        <use href="#icon-check" />
                      </svg>
                      <span>Facture certifiée</span>
                    </span>
                  </button>
                </div>

                {/* Panneau 2 : Rapprochement Bancaire & Lettrage */}
                <div
                  ref={recRef}
                  className="pn bg-background border border-border rounded-xl relative p-5"
                >
                  <h3 className="text-base font-bold text-ink">
                    Rapprochement bancaire &amp; Mobile Money
                    <span className="block text-xs font-normal text-text-muted mt-0.5">
                      Lettrage automatique
                    </span>
                  </h3>

                  {/* Carte A : Relevé bancaire */}
                  <div
                    id="cA"
                    className="cd absolute top-16 left-5 w-[255px] h-[110px] bg-background-secondary border border-border rounded-lg p-3.5 box-border text-xs transition-all duration-700"
                  >
                    <small className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1.5">
                      Relevé bancaire
                    </small>
                    <div className="font-semibold text-ink leading-snug">
                      Virement BOA Bénin — SOCOB S.A.
                    </div>
                    <b className="block text-lg font-bold text-[#0D6E4B] mt-2">
                      +1 180 000 FCFA
                    </b>
                  </div>

                  {/* Carte B : Facture en attente */}
                  <div
                    id="cB"
                    className="cd absolute top-16 left-[341px] w-[255px] h-[110px] bg-background-secondary border border-border rounded-lg p-3.5 box-border text-xs transition-all duration-700"
                  >
                    <small className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1.5">
                      Facture en attente
                    </small>
                    <div className="font-semibold text-ink leading-snug">
                      Facture N° 088 — SOCOB S.A.
                    </div>
                    <b className="block text-lg font-bold text-ink mt-2">
                      1 180 000 FCFA
                    </b>
                  </div>

                  {/* Ligne d'aimantation centrale */}
                  <div className="gl absolute left-[307px] top-14 w-[3px] h-[126px] bg-primary opacity-0 scale-y-0 transition-all duration-300" />

                  {/* Bouton Rapprocher */}
                  <button
                    ref={bRRef}
                    type="button"
                    className="btn b2 absolute left-[218px] top-[200px] w-[180px] h-10 rounded-lg bg-primary text-ink font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
                  >
                    <svg className="w-4 h-4">
                      <use href="#icon-link" />
                    </svg>
                    <span>Rapprocher</span>
                  </button>

                  {/* Badge Lettré automatique */}
                  <div className="bd absolute left-[158px] top-[200px] w-[300px] h-10 rounded-lg bg-[#0D6E4B] text-white flex items-center justify-center gap-2 font-bold text-xs opacity-0 scale-90 transition-all duration-300">
                    <svg className="w-4 h-4 text-white">
                      <use href="#icon-check" />
                    </svg>
                    <span>Lettré 100% Automatique</span>
                  </div>

                  {/* Écritures SYSCOHADA générées */}
                  <div className="jn absolute left-5 right-5 top-[266px] text-xs">
                    <h4 className="m-0 mb-1.5 text-[11px] font-bold uppercase tracking-wider text-text-muted">
                      Écritures SYSCOHADA
                    </h4>
                    <div className="jr flex justify-between py-1.5 px-2.5 mb-1 bg-background-secondary border border-border rounded-md font-semibold text-ink opacity-0 translate-y-1.5 transition-all">
                      <span className="text-text-muted font-medium">
                        Débit 521000 Banque BOA
                      </span>
                      <span>1 180 000</span>
                    </div>
                    <div className="jr flex justify-between py-1.5 px-2.5 mb-1 bg-background-secondary border border-border rounded-md font-semibold text-ink opacity-0 translate-y-1.5 transition-all delay-75">
                      <span className="text-text-muted font-medium">
                        Crédit 411000 Client
                      </span>
                      <span>1 000 000</span>
                    </div>
                    <div className="jr flex justify-between py-1.5 px-2.5 mb-1 bg-background-secondary border border-border rounded-md font-semibold text-ink opacity-0 translate-y-1.5 transition-all delay-150">
                      <span className="text-text-muted font-medium">
                        Crédit 443100 TVA
                      </span>
                      <span>180 000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── TOOLTIP INFORMATIF SURVOL KPI ── */}
              <div
                ref={tipRef}
                className="tip absolute bg-background border border-ink text-ink rounded-md py-1.5 px-3 text-xs font-bold whitespace-nowrap opacity-0 transition-opacity z-20 pointer-events-none shadow-md"
              >
                142 factures certifiées ce mois
              </div>

              {/* ── CURSEUR VIRTUEL ANIMÉ ── */}
              <div
                ref={curRef}
                className="absolute left-0 top-0 z-50 pointer-events-none opacity-0 will-change-transform"
              >
                <svg
                  className="w-6 h-[26px] drop-shadow-[0_2px_4px_rgba(51,46,41,0.35)]"
                  viewBox="0 0 24 26"
                >
                  <path
                    d="M2 2v18l5-4.5 3.5 7.5 3.5-1.5-3.5-7.5H17z"
                    fill="#332E29"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* ── RÈGLES DE STYLE CSS DU COCKPIT (ANIMATIONS RÉACTIVES PURES) ── */}
      <style jsx global>{`
        /* Facturation rapide active */
        .pn.ok .stamp {
          opacity: 1 !important;
          transform: scale(1) rotate(-3deg) !important;
        }
        .pn.ok .qr,
        .pn.ok .nim {
          opacity: 1 !important;
        }
        .pn.ok .ph {
          opacity: 0 !important;
        }
        .pn.ok .b1 {
          background: #f5f4f2 !important;
          border: 1px solid #d8d5d0 !important;
        }
        .pn.ok .b1 .x0 {
          display: none !important;
        }
        .pn.ok .b1 .x1 {
          display: inline-flex !important;
        }
        .pn.ok .c0 {
          display: none !important;
        }
        .pn.ok .c1 {
          display: inline !important;
        }

        /* Rapprochement magnétique */
        .pn.m #cA {
          transform: translateX(33px) !important;
        }
        .pn.m #cB {
          transform: translateX(-33px) !important;
        }
        .pn.m .gl {
          opacity: 1 !important;
          transform: scaleY(1) !important;
        }
        .pn.m .b2 {
          opacity: 0 !important;
          pointer-events: none !important;
        }

        .pn.l .cd {
          border-color: #0d6e4b !important;
          background: #e8fff6 !important;
        }
        .pn.l .bd {
          opacity: 1 !important;
          transform: scale(1) !important;
        }
        .pn.l .jr {
          opacity: 1 !important;
          transform: none !important;
        }

        /* Déclarations DGI télétransmission */
        .k.tv.s1 .t0,
        .k.tv.s2 .t0,
        .k.tv.s1 .s0t,
        .k.tv.s2 .s0t {
          display: none !important;
        }
        .k.tv.s1 .t1 {
          display: inline-flex !important;
        }
        .k.tv.s2 .t2 {
          display: inline-flex !important;
        }
        .k.tv.s2 .s2t {
          display: inline-flex !important;
        }
        .k.tv.s2 .bt {
          background: #0d6e4b !important;
          color: #ffffff !important;
        }
        .k.tv.s2 .qt {
          opacity: 1 !important;
        }

        /* Tooltip actif */
        .tip.on {
          opacity: 1 !important;
        }

        /* Clic effet onde ripple */
        .rp {
          position: absolute;
          width: 16px;
          height: 16px;
          margin: -8px 0 0 -8px;
          border: 2px solid #ffd946;
          box-shadow: 0 0 0 1px #332e29;
          border-radius: 50%;
          z-index: 40;
          pointer-events: none;
        }
        .btn.press {
          transform: scale(0.97) !important;
        }
      `}</style>
    </div>
  );
}
