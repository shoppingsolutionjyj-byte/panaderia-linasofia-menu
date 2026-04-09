import { useRef, useState, useEffect } from "react";
import { Download, RefreshCw, ChefHat, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface MenuData {
  fecha: string;
  sopa: string;
  // Weekday fields
  principio1: string; principio2: string;
  proteina1: string;  proteina2: string; proteina3: string;
  descripcionEspecial: string; precioEspecial: string;
  descripcionEspecial2: string; precioEspecial2: string;
  descripcionEspecial3: string; precioEspecial3: string;
  descripcionEspecial4: string; precioEspecial4: string;
  // Weekend fixed specials (7 dishes, always shown)
  wf1Desc: string; wf1Precio: string;
  wf2Desc: string; wf2Precio: string;
  wf3Desc: string; wf3Precio: string;
  wf4Desc: string; wf4Precio: string;
  wf5Desc: string; wf5Precio: string;
  wf6Desc: string; wf6Precio: string;
  wf7Desc: string; wf7Precio: string;
  // Weekend optional specials (4, only shown if filled)
  wo1Desc: string; wo1Precio: string;
  wo2Desc: string; wo2Precio: string;
  wo3Desc: string; wo3Precio: string;
  wo4Desc: string; wo4Precio: string;
  esFinDeSemana: boolean;
}

const defaultMenu: MenuData = {
  fecha: new Date().toLocaleDateString("es-CO", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  }),
  sopa: "",
  principio1: "", principio2: "",
  proteina1: "", proteina2: "", proteina3: "",
  descripcionEspecial: "", precioEspecial: "",
  descripcionEspecial2: "", precioEspecial2: "",
  descripcionEspecial3: "", precioEspecial3: "",
  descripcionEspecial4: "", precioEspecial4: "",
  wf1Desc: "", wf1Precio: "",
  wf2Desc: "", wf2Precio: "",
  wf3Desc: "", wf3Precio: "",
  wf4Desc: "", wf4Precio: "",
  wf5Desc: "", wf5Precio: "",
  wf6Desc: "", wf6Precio: "",
  wf7Desc: "", wf7Precio: "",
  wo1Desc: "", wo1Precio: "",
  wo2Desc: "", wo2Precio: "",
  wo3Desc: "", wo3Precio: "",
  wo4Desc: "", wo4Precio: "",
  esFinDeSemana: false,
};

export default function MenuGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [menu, setMenu] = useState<MenuData>(defaultMenu);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const logoRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      logoRef.current = img;
      setLogoLoaded(true);
    };
    img.onerror = () => setLogoLoaded(true);
    img.src = `${import.meta.env.BASE_URL}logo-linasofia.png`;
  }, []);

  useEffect(() => {
    if (logoLoaded) drawCanvas();
  }, [menu, logoLoaded]);

  function drawCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

    const W = 1080;
    const H = 1920;
    canvas.width = W;
    canvas.height = H;

    // ─── Modern Artisan Dark Palette ─────────────────────────────────────────
    const ESPRESSO  = "#0A0603";
    const ROAST     = "#160C06";
    const CARD_BG   = "#1C1007";
    const CARD_HDR  = "#2A1610";
    const CREAM     = "#FFF5E1";
    const CREAM_DIM = "#C8A870";
    const GOLD      = "#D4A017";
    const GOLD_BR   = "#F2C84B";
    const RED       = "#C8251D";
    const RED_DARK  = "#8B1A14";
    const RED_DEEP  = "#3D0E0A";

    // ── Helpers ───────────────────────────────────────────────────────────────
    function roundRect(x: number, y: number, w: number, h: number, r: number) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }
    function roundRectTop(x: number, y: number, w: number, h: number, r: number) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h);
      ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }
    function sh(blur: number, color = "rgba(0,0,0,0.7)") {
      ctx.shadowBlur = blur; ctx.shadowColor = color;
    }
    function ns() { ctx.shadowBlur = 0; ctx.shadowColor = "transparent"; }
    function cText(text: string, y: number, font: string, color: string) {
      ctx.font = font; ctx.fillStyle = color; ctx.textAlign = "center";
      ctx.fillText(text, W / 2, y);
    }

    // ─── Layout constants ─────────────────────────────────────────────────────
    const TOP_H   = 275;
    const BOT_H   = 200;
    const SX      = 56;
    const SW      = W - 112;
    const HDR_H   = 76;
    const PAD_BOT = 20;
    const BANNER_H_C = 100; const PRICEBOX_H_C = 165; const ROW_GAP_C = 14; const INNER_GAP_C = 16;
    const TITLE_BLOCK = 120;
    const MIN_GAP = 28; // minimum gap between sections

    const prots = [
      menu.proteina1 || "Por definir",
      menu.proteina2 || "Por definir",
      ...(menu.proteina3.trim() ? [menu.proteina3] : []),
    ];
    const sopaItems  = [menu.sopa || "Por definir"];
    const princItems = [menu.principio1 || "Por definir", menu.principio2 || "Por definir"];

    // ── Weekend: 7 fixed + up to 4 optional ──────────────────────────────────
    type PricedItem = { desc: string; precio: string };
    const wkFixed: PricedItem[] = [
      { desc: menu.wf1Desc, precio: menu.wf1Precio },
      { desc: menu.wf2Desc, precio: menu.wf2Precio },
      { desc: menu.wf3Desc, precio: menu.wf3Precio },
      { desc: menu.wf4Desc, precio: menu.wf4Precio },
      { desc: menu.wf5Desc, precio: menu.wf5Precio },
      { desc: menu.wf6Desc, precio: menu.wf6Precio },
      { desc: menu.wf7Desc, precio: menu.wf7Precio },
    ].filter(i => i.desc.trim() || i.precio.trim());
    if (wkFixed.length === 0) wkFixed.push({ desc: "Por definir", precio: "" });
    const wkOpt: PricedItem[] = [
      { desc: menu.wo1Desc, precio: menu.wo1Precio },
      { desc: menu.wo2Desc, precio: menu.wo2Precio },
      { desc: menu.wo3Desc, precio: menu.wo3Precio },
      { desc: menu.wo4Desc, precio: menu.wo4Precio },
    ].filter(i => i.desc.trim() || i.precio.trim());
    const hasWkOpt = wkOpt.length > 0;

    // Weekday opcionales
    const opcionales = [
      { desc: menu.descripcionEspecial2, precio: menu.precioEspecial2 },
      { desc: menu.descripcionEspecial3, precio: menu.precioEspecial3 },
      { desc: menu.descripcionEspecial4, precio: menu.precioEspecial4 },
    ].filter(o => o.desc.trim() || o.precio.trim());
    const hasOpcionales = opcionales.length > 0;
    const weekdayPriceH = BANNER_H_C + INNER_GAP_C + PRICEBOX_H_C + (hasOpcionales ? ROW_GAP_C + PRICEBOX_H_C : 0) + 10;

    const avail = H - TOP_H - BOT_H;

    // ── Dynamic line heights: distribute ALL available space into item rows ──
    let dynLine: number;     // used by weekday drawSection
    let dynWkLine: number;   // used by weekend drawPricedSection
    const SEC_BASE = HDR_H + PAD_BOT; // per-section fixed overhead (excl. item rows)

    if (!menu.esFinDeSemana) {
      // Weekday: 3 text sections + price block + 5 gaps
      const wdFixed = TITLE_BLOCK + 3 * SEC_BASE + weekdayPriceH + 5 * MIN_GAP;
      const wdItems = sopaItems.length + princItems.length + prots.length;
      dynLine = Math.max(84, Math.floor((avail - wdFixed) / wdItems));
      dynWkLine = 84; // unused in weekday
    } else {
      // Weekend: sopa (1 item at fixed 90px) + 1 or 2 priced sections
      const sopaLineH = 90;
      const sopaFixed = SEC_BASE + sopaLineH; // sopa section total height
      const wkNSecs  = hasWkOpt ? 2 : 1;     // priced sections (excl. sopa)
      const wkNGaps  = hasWkOpt ? 4 : 3;
      const wkFixed2 = TITLE_BLOCK + sopaFixed + wkNSecs * SEC_BASE + wkNGaps * MIN_GAP;
      const wkItems  = wkFixed.length + (hasWkOpt ? wkOpt.length : 0);
      dynLine   = sopaLineH; // sopa line height in weekend
      dynWkLine = Math.max(78, Math.floor((avail - wkFixed2) / wkItems));
    }

    function sectionH(items: string[], lh: number) { return HDR_H + items.length * lh + PAD_BOT; }
    function pricedSecH(n: number) { return HDR_H + n * dynWkLine + PAD_BOT; }

    const sopaH  = sectionH(sopaItems,  dynLine);
    const princH = sectionH(princItems, dynLine);
    const protsH = sectionH(prots,      dynLine);
    const wkFixedH = pricedSecH(wkFixed.length);
    const wkOptH   = hasWkOpt ? pricedSecH(wkOpt.length) : 0;

    // Recompute actual gap with dynamic section heights
    const totalContent = menu.esFinDeSemana
      ? TITLE_BLOCK + sopaH + wkFixedH + wkOptH
      : TITLE_BLOCK + sopaH + princH + protsH + weekdayPriceH;
    const numGaps = menu.esFinDeSemana ? (hasWkOpt ? 4 : 3) : 5;
    const gap = Math.max(MIN_GAP, Math.floor((avail - totalContent) / numGaps));

    // ─── Background: dark espresso ────────────────────────────────────────────
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0,    ESPRESSO);
    bgGrad.addColorStop(0.35, ROAST);
    bgGrad.addColorStop(0.65, "#120A05");
    bgGrad.addColorStop(1,    ESPRESSO);
    ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, W, H);

    // grain texture
    for (let i = 0; i < 5000; i++) {
      const gx = Math.random() * W, gy = Math.random() * H;
      ctx.fillStyle = `rgba(255,180,80,${Math.random() * 0.018})`;
      ctx.fillRect(gx, gy, 1, 1);
    }
    // subtle vertical scan lines
    ctx.save(); ctx.globalAlpha = 0.025;
    ctx.strokeStyle = "#8B4500"; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 8) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    ctx.restore();

    // ── Warm bakery glow — center radial overlay ───────────────────────────────
    const warmGlow = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.72);
    warmGlow.addColorStop(0,   "rgba(180,80,10,0.13)");
    warmGlow.addColorStop(0.4, "rgba(120,45,5,0.07)");
    warmGlow.addColorStop(1,   "rgba(0,0,0,0)");
    ctx.fillStyle = warmGlow; ctx.fillRect(0, 0, W, H);

    // ── Subtle linen crosshatch ────────────────────────────────────────────────
    ctx.save(); ctx.globalAlpha = 0.022; ctx.strokeStyle = "#C87820"; ctx.lineWidth = 1;
    for (let d = -H; d < W + H; d += 52) {
      ctx.beginPath(); ctx.moveTo(d, 0); ctx.lineTo(d + H, H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(d + H, 0); ctx.lineTo(d, H); ctx.stroke();
    }
    ctx.restore();

    // ─── Top banner ───────────────────────────────────────────────────────────
    const topG = ctx.createLinearGradient(0, 0, 0, TOP_H);
    topG.addColorStop(0, RED_DEEP); topG.addColorStop(1, RED_DARK);
    ctx.fillStyle = topG; ctx.fillRect(0, 0, W, TOP_H);
    // gold bottom edge
    ctx.fillStyle = GOLD; ctx.fillRect(0, TOP_H - 5, W, 5);
    ctx.fillStyle = GOLD_BR; ctx.fillRect(0, TOP_H - 2, W, 2);

    // ─── Bottom banner ────────────────────────────────────────────────────────
    const BOT_Y = H - BOT_H;
    const botG = ctx.createLinearGradient(0, BOT_Y, 0, H);
    botG.addColorStop(0, RED_DARK); botG.addColorStop(1, RED_DEEP);
    ctx.fillStyle = botG; ctx.fillRect(0, BOT_Y, W, BOT_H);
    ctx.fillStyle = GOLD_BR; ctx.fillRect(0, BOT_Y, W, 2);
    ctx.fillStyle = GOLD; ctx.fillRect(0, BOT_Y + 2, W, 4);

    // ─── Thin double border ───────────────────────────────────────────────────
    const M = 18;
    ctx.strokeStyle = GOLD_BR; ctx.lineWidth = 2;
    sh(12, "rgba(212,160,23,0.3)");
    ctx.strokeRect(M, M, W - M * 2, H - M * 2);
    ns();
    ctx.strokeStyle = GOLD; ctx.lineWidth = 1;
    ctx.strokeRect(M + 9, M + 9, W - (M + 9) * 2, H - (M + 9) * 2);

    // corner L-shapes (modern geometric) + ornamental cross
    const CL = 55;
    const corners: [number, number, number, number][] = [
      [M, M, 1, 1], [W - M, M, -1, 1], [M, H - M, 1, -1], [W - M, H - M, -1, -1]
    ];
    ctx.strokeStyle = GOLD_BR; ctx.lineWidth = 3;
    corners.forEach(([cx, cy, dx, dy]) => {
      ctx.beginPath(); ctx.moveTo(cx, cy + dy * CL); ctx.lineTo(cx, cy); ctx.lineTo(cx + dx * CL, cy); ctx.stroke();
      // ornamental dot
      ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fillStyle = GOLD_BR; ctx.fill();
      // small cross at corner
      ctx.strokeStyle = GOLD; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx - dx * 8, cy); ctx.lineTo(cx + dx * 18, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy - dy * 8); ctx.lineTo(cx, cy + dy * 18); ctx.stroke();
      ctx.strokeStyle = GOLD_BR; ctx.lineWidth = 3;
    });

    // ── Wheat sprigs along side margins ───────────────────────────────────────
    function sideWheat(wx: number, wy: number, flip: boolean, sc: number) {
      const d = flip ? -1 : 1;
      ctx.save(); ctx.globalAlpha = 0.38;
      ctx.strokeStyle = "#A87010"; ctx.lineWidth = 2 * sc;
      ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx + d * 40 * sc, wy - 65 * sc); ctx.stroke();
      for (let i = 0; i < 4; i++) {
        const ex = wx + d * (5 + i * 9) * sc;
        const ey = wy - (7 + i * 14) * sc;
        ctx.beginPath();
        ctx.ellipse(ex + d * 8 * sc, ey - 7 * sc, 13 * sc, 5.5 * sc, flip ? -0.48 : 0.48, 0, Math.PI * 2);
        ctx.fillStyle = "#B8880A"; ctx.fill();
      }
      ctx.restore();
    }

    // left side — 4 positions across content area
    sideWheat(M + 4, TOP_H + 340, false, 1);
    sideWheat(M + 4, TOP_H + 680, false, 0.88);
    sideWheat(M + 4, TOP_H + 1000, false, 0.88);
    sideWheat(M + 4, TOP_H + 1300, false, 0.8);
    // right side (mirrored)
    sideWheat(W - M - 4, TOP_H + 340, true, 1);
    sideWheat(W - M - 4, TOP_H + 680, true, 0.88);
    sideWheat(W - M - 4, TOP_H + 1000, true, 0.88);
    sideWheat(W - M - 4, TOP_H + 1300, true, 0.8);

    // ─── Wheat sprigs in top banner ───────────────────────────────────────────
    function wheatSprig(sx: number, sy: number, flip: boolean, scale = 1) {
      const d = flip ? -1 : 1;
      ctx.globalAlpha = 0.55;
      ctx.strokeStyle = "#C49820"; ctx.lineWidth = 2.5 * scale;
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + d * 55 * scale, sy - 80 * scale); ctx.stroke();
      for (let i = 0; i < 5; i++) {
        const ox = sx + d * (6 + i * 10) * scale;
        const oy = sy - (8 + i * 14) * scale;
        ctx.beginPath();
        ctx.ellipse(ox + d * 9 * scale, oy - 8 * scale, 16 * scale, 7 * scale, flip ? -0.5 : 0.5, 0, Math.PI * 2);
        ctx.fillStyle = "#D4A017"; ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    wheatSprig(90, TOP_H - 22, false);
    wheatSprig(W - 90, TOP_H - 22, true);

    // ─── Logo ─────────────────────────────────────────────────────────────────
    const LOGO_H = 210;
    const LOGO_Y = 30;
    if (logoRef.current && logoRef.current.complete && logoRef.current.naturalWidth > 0) {
      const aspect = logoRef.current.width / logoRef.current.height;
      const logoW = LOGO_H * aspect;
      sh(20, "rgba(0,0,0,0.6)");
      ctx.drawImage(logoRef.current, (W - logoW) / 2, LOGO_Y, logoW, LOGO_H);
      ns();
    } else {
      sh(8, "rgba(0,0,0,0.8)");
      cText("Panadería Linasofia", LOGO_Y + LOGO_H / 2, `bold 64px Georgia,serif`, GOLD_BR);
      ns();
    }

    // ─── Content ──────────────────────────────────────────────────────────────
    let curY = TOP_H + gap;

    // ── Title block ───────────────────────────────────────────────────────────
    // Decorative side lines flanking title
    const titleY = curY + 88;
    const lineW  = 160;
    ctx.strokeStyle = GOLD; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(SX, titleY - 10); ctx.lineTo(SX + lineW, titleY - 10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W - SX, titleY - 10); ctx.lineTo(W - SX - lineW, titleY - 10); ctx.stroke();
    // Small diamonds at line ends
    [[SX + lineW, titleY - 10], [W - SX - lineW, titleY - 10]].forEach(([dx, dy]) => {
      ctx.save(); ctx.translate(dx as number, dy as number); ctx.rotate(Math.PI / 4);
      ctx.fillStyle = GOLD_BR;
      ctx.fillRect(-6, -6, 12, 12);
      ctx.restore();
    });

    // Title text
    sh(16, "rgba(0,0,0,0.9)");
    const titleText = menu.esFinDeSemana ? "FIN DE SEMANA" : "MENÚ DEL DÍA";
    const titleFont = menu.esFinDeSemana ? `bold 82px Georgia,serif` : `bold 98px Georgia,serif`;
    cText(titleText, titleY, titleFont, CREAM);
    ns();
    // Thin gold underline
    ctx.strokeStyle = GOLD_BR; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(SX + 60, titleY + 14); ctx.lineTo(W - SX - 60, titleY + 14); ctx.stroke();
    curY += TITLE_BLOCK + gap;

    // ─── Section draw (modern dark style) ─────────────────────────────────────
    function drawSection(title: string, items: string[], emoji: string, lineH: number) {
      const totalH = sectionH(items, lineH);
      const R = 22;

      ctx.fillStyle = "rgba(0,0,0,0.45)";
      roundRect(SX + 6, curY + 6, SW, totalH, R); ctx.fill();

      const cg = ctx.createLinearGradient(SX, curY, SX, curY + totalH);
      cg.addColorStop(0, "#221308"); cg.addColorStop(1, CARD_BG);
      roundRect(SX, curY, SW, totalH, R);
      ctx.fillStyle = cg; ctx.fill();
      ctx.strokeStyle = GOLD; ctx.lineWidth = 1.5; ctx.stroke();

      roundRectTop(SX, curY, SW, HDR_H, R);
      ctx.fillStyle = CARD_HDR; ctx.fill();

      ctx.fillStyle = RED;
      roundRectTop(SX, curY, SW, 6, R); ctx.fill();

      ctx.fillStyle = GOLD; ctx.fillRect(SX, curY + HDR_H - 3, SW, 3);

      ctx.font = `bold 42px Georgia,serif`;
      ctx.textAlign = "center";
      sh(8, "rgba(0,0,0,0.8)");
      ctx.fillStyle = CREAM;
      ctx.fillText(`${emoji}  ${title}`, W / 2, curY + 50);
      ns();

      // Items — vertically centered in their row
      const itemStartY = curY + HDR_H;
      items.forEach((item, idx) => {
        const iy = itemStartY + idx * lineH;
        const rowMid = iy + lineH / 2;
        if (idx > 0) {
          ctx.strokeStyle = "rgba(212,160,23,0.2)"; ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(SX + 28, iy); ctx.lineTo(SX + SW - 28, iy); ctx.stroke();
        }
        // Diamond bullet
        ctx.save();
        ctx.font = `bold 44px Georgia,serif`;
        ctx.textAlign = "center";
        ctx.translate(W / 2, rowMid + 4);
        const halfW = ctx.measureText(item).width / 2 + 18;
        ctx.translate(-halfW, 0);
        ctx.rotate(Math.PI / 4);
        ctx.fillStyle = GOLD_BR;
        ctx.fillRect(-6, -6, 12, 12);
        ctx.restore();

        ctx.font = `bold 44px Georgia,serif`;
        ctx.textAlign = "center";
        sh(6, "rgba(0,0,0,0.7)");
        ctx.fillStyle = CREAM;
        ctx.fillText(item, W / 2, rowMid + 16);
        ns();
      });

      curY += totalH + gap;
    }

    drawSection("SOPA DEL DÍA", sopaItems, "🍲", dynLine);

    // ── Price box helper (shared by both modes) ───────────────────────────────
    const PHX = SX; const PHW = SW;
    const BOX_GAP = 16; const BOX_R = 20;
    const boxW = (PHW - BOX_GAP) / 2;
    const PRICEBOX_H = PRICEBOX_H_C;

    function priceBox(
      bx: number, by: number, bw: number,
      label: string, price: string,
      accentClr: string, priceClr: string
    ) {
      const bh = PRICEBOX_H;
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      roundRect(bx + 4, by + 4, bw, bh, BOX_R); ctx.fill();
      const pbg = ctx.createLinearGradient(bx, by, bx, by + bh);
      pbg.addColorStop(0, "#221308"); pbg.addColorStop(1, "#160C06");
      roundRect(bx, by, bw, bh, BOX_R);
      ctx.fillStyle = pbg; ctx.fill();
      ctx.strokeStyle = accentClr; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.fillStyle = accentClr;
      roundRectTop(bx, by, bw, 6, BOX_R); ctx.fill();
      const cx = bx + bw / 2;
      ctx.font = `bold 26px Georgia,serif`; ctx.textAlign = "center";
      sh(3, "rgba(0,0,0,0.7)"); ctx.fillStyle = CREAM_DIM;
      ctx.fillText(label, cx, by + 44); ns();
      ctx.strokeStyle = accentClr; ctx.lineWidth = 1; ctx.globalAlpha = 0.4;
      ctx.beginPath(); ctx.moveTo(bx + 22, by + 60); ctx.lineTo(bx + bw - 22, by + 60); ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.font = `bold 66px Georgia,serif`; ctx.textAlign = "center";
      ctx.lineWidth = 9; ctx.strokeStyle = "rgba(0,0,0,0.65)"; ctx.lineJoin = "round";
      sh(12, "rgba(0,0,0,0.6)"); ctx.strokeText(price, cx, by + bh - 18); ns();
      ctx.fillStyle = priceClr; ctx.fillText(price, cx, by + bh - 18);
    }

    if (menu.esFinDeSemana) {
      // ── WEEKEND MODE: section cards with price inline ─────────────────────────
      function drawPricedSection(title: string, items: PricedItem[], emoji: string) {
        const n = items.length;
        const LH = dynWkLine;
        const totalH = HDR_H + n * LH + PAD_BOT;
        const secY = curY;
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        roundRect(SX + 5, secY + 5, SW, totalH, 22); ctx.fill();
        const bg = ctx.createLinearGradient(SX, secY, SX, secY + totalH);
        bg.addColorStop(0, "#1A0B04"); bg.addColorStop(1, "#0D0502");
        roundRect(SX, secY, SW, totalH, 22);
        ctx.fillStyle = bg; ctx.fill();
        ctx.strokeStyle = "#3A1A08"; ctx.lineWidth = 2; ctx.stroke();
        const hdrG = ctx.createLinearGradient(SX, secY, SX, secY + HDR_H);
        hdrG.addColorStop(0, RED); hdrG.addColorStop(1, "#6A0F0A");
        roundRectTop(SX, secY, SW, HDR_H, 22);
        ctx.fillStyle = hdrG; ctx.fill();
        ctx.fillStyle = GOLD; ctx.fillRect(SX + 22, secY + HDR_H - 3, SW - 44, 2);
        sh(3, "rgba(0,0,0,0.6)");
        cText(`${emoji}  ${title}`, secY + 48, "bold 38px Georgia,serif", CREAM);
        ns();
        // Items: desc + price, vertically centered within each LH row
        items.forEach((item, i) => {
          const rowTop = secY + HDR_H + i * LH;
          const rowMid = rowTop + LH / 2;
          const desc = item.desc.trim() || "Por definir";
          const prc  = item.precio.trim() ? `$${item.precio}` : "";
          // Separator between items
          if (i > 0) {
            ctx.strokeStyle = GOLD; ctx.lineWidth = 1; ctx.globalAlpha = 0.18;
            ctx.beginPath();
            ctx.moveTo(SX + 60, rowTop + 2); ctx.lineTo(SX + SW - 60, rowTop + 2);
            ctx.stroke(); ctx.globalAlpha = 1;
          }
          if (prc) {
            // Two-line: desc above mid, price below mid
            sh(3, "rgba(0,0,0,0.7)");
            cText(`◆  ${desc}`, rowMid - 8, "30px Georgia,serif", CREAM); ns();
            sh(4, "rgba(0,0,0,0.6)");
            cText(prc, rowMid + 26, "bold 32px Georgia,serif", GOLD_BR); ns();
          } else {
            // Single line: desc centered in row
            sh(3, "rgba(0,0,0,0.7)");
            cText(`◆  ${desc}`, rowMid + 12, "30px Georgia,serif", CREAM); ns();
          }
        });
        curY += totalH + gap;
      }

      drawPricedSection("ALMUERZO ESPECIAL", wkFixed, "⭐");
      if (hasWkOpt) drawPricedSection("OPCIONALES", wkOpt, "✦");

    } else {
      // ── WEEKDAY MODE ──────────────────────────────────────────────────────────
      drawSection("PRINCIPIOS", princItems, "🥗", dynLine);
      drawSection("PROTEÍNAS",  prots,      "🥩", dynLine);

      // Banner header (Almuerzo Especial fijo)
      const BANNER_H = BANNER_H_C; const INNER_GAP = INNER_GAP_C;
      const bannerY = curY;
      ctx.shadowColor = "rgba(212,160,23,0.5)"; ctx.shadowBlur = 28;
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      roundRect(PHX + 5, bannerY + 5, PHW, BANNER_H, 26); ctx.fill();
      ctx.shadowBlur = 0; ctx.shadowColor = "transparent";
      const bannerG = ctx.createLinearGradient(PHX, bannerY, PHX + PHW, bannerY + BANNER_H);
      bannerG.addColorStop(0, "#3D0E0A"); bannerG.addColorStop(0.5, "#7A1A10"); bannerG.addColorStop(1, "#3D0E0A");
      roundRect(PHX, bannerY, PHW, BANNER_H, 26);
      ctx.fillStyle = bannerG; ctx.fill();
      ctx.strokeStyle = GOLD_BR; ctx.lineWidth = 3; ctx.stroke();
      ctx.fillStyle = GOLD_BR; ctx.fillRect(PHX + 28, bannerY, PHW - 56, 3);
      ctx.fillStyle = GOLD; ctx.fillRect(PHX + 28, bannerY + BANNER_H - 3, PHW - 56, 3);
      sh(4, "rgba(0,0,0,0.7)");
      cText("✦  ALMUERZO ESPECIAL  ✦", bannerY + 34, `28px Georgia,serif`, CREAM_DIM); ns();
      ctx.strokeStyle = GOLD; ctx.lineWidth = 1; ctx.globalAlpha = 0.4;
      ctx.beginPath(); ctx.moveTo(PHX + 52, bannerY + 46); ctx.lineTo(PHX + PHW - 52, bannerY + 46); ctx.stroke();
      ctx.globalAlpha = 1;
      const descEsp1 = menu.descripcionEspecial.trim() || "Consultar disponibilidad";
      sh(10, "rgba(0,0,0,0.9)");
      cText(descEsp1, bannerY + 84, `bold 50px Georgia,serif`, CREAM); ns();

      // Row 1: Corriente | Especial
      const row1Y = bannerY + BANNER_H + INNER_GAP;
      const esp1Price = menu.precioEspecial.trim() ? `$${menu.precioEspecial}` : "$ Varía";
      priceBox(PHX,                   row1Y, boxW, "ALMUERZO CORRIENTE", "$14.000", RED, "#FF7060");
      priceBox(PHX + boxW + BOX_GAP, row1Y, boxW, "ALMUERZO ESPECIAL",  esp1Price, GOLD_BR, GOLD_BR);

      // Row 2: opcionales (if any)
      if (hasOpcionales) {
        const row2Y = row1Y + PRICEBOX_H + ROW_GAP_C;
        const n = opcionales.length;
        const opBoxW = (PHW - BOX_GAP * (n - 1)) / n;
        const OPT_COLORS = [
          { accent: "#7AB8D4", price: "#A0D8F0" },
          { accent: "#8BC48A", price: "#A8E6A8" },
          { accent: "#C49A8B", price: "#EABBA8" },
        ];
        opcionales.forEach((op, i) => {
          const clr = OPT_COLORS[i];
          const opX = PHX + i * (opBoxW + BOX_GAP);
          const lbl = op.desc.trim().toUpperCase() || `ESPECIAL OPCIONAL ${i + 1}`;
          const prc = op.precio.trim() ? `$${op.precio}` : "$ Varía";
          priceBox(opX, row2Y, opBoxW, lbl, prc, clr.accent, clr.price);
        });
      }
    }

    // ─── Bottom banner ────────────────────────────────────────────────────────
    const midBot = BOT_Y + BOT_H / 2;
    // thin gold lines
    ctx.strokeStyle = GOLD; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(SX + 30, BOT_Y + 28); ctx.lineTo(W - SX - 30, BOT_Y + 28); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(SX + 30, BOT_Y + BOT_H - 28); ctx.lineTo(W - SX - 30, BOT_Y + BOT_H - 28); ctx.stroke();
    // center diamond
    ctx.save(); ctx.translate(W / 2, BOT_Y + 28); ctx.rotate(Math.PI / 4);
    ctx.fillStyle = GOLD_BR; ctx.fillRect(-6, -6, 12, 12); ctx.restore();
    ctx.save(); ctx.translate(W / 2, BOT_Y + BOT_H - 28); ctx.rotate(Math.PI / 4);
    ctx.fillStyle = GOLD_BR; ctx.fillRect(-6, -6, 12, 12); ctx.restore();

    sh(10, "rgba(0,0,0,0.7)");
    cText("¡Con mucho amor y sabor!", midBot - 10, `italic bold 40px Georgia,serif`, CREAM);
    cText("Panadería & Pastelería Linasofia", midBot + 46, `30px Georgia,serif`, GOLD_BR);
    ns();
  }

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `menu-linasofia-${new Date().toLocaleDateString("es-CO").replace(/\//g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function handleReset() {
    setMenu({
      ...defaultMenu,
      fecha: new Date().toLocaleDateString("es-CO", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    });
  }

  return (
    <div className="min-h-screen bg-[#1a0800]">
      {/* Header */}
      <div
        className="w-full py-5 px-6 text-center shadow-lg"
        style={{
          background: "linear-gradient(135deg, #C8251D 0%, #8B1A14 50%, #5C2D0A 100%)",
          borderBottom: "4px solid #C9920A",
        }}
      >
        <div className="flex items-center justify-center gap-3 mb-1">
          <ChefHat className="text-yellow-300 w-8 h-8" />
          <h1
            className="text-3xl font-bold text-white"
            style={{ fontFamily: "Georgia, serif", textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}
          >
            Generador de Menú
          </h1>
          <UtensilsCrossed className="text-yellow-300 w-8 h-8" />
        </div>
        <p className="text-yellow-200 text-sm" style={{ fontFamily: "Georgia, serif" }}>
          Panadería &amp; Pastelería Linasofia
        </p>
      </div>

      <div className="max-w-7xl mx-auto p-4 lg:p-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Form */}
        <div
          className="rounded-2xl p-6 shadow-2xl"
          style={{
            background: "linear-gradient(160deg, #3B1005 0%, #2A0B02 100%)",
            border: "2px solid #C9920A",
          }}
        >
          <h2
            className="text-2xl font-bold text-center mb-6"
            style={{ color: "#E8B528", fontFamily: "Georgia, serif" }}
          >
            ✦ Configurar Menú del Día ✦
          </h2>

          <div className="space-y-5">
            <div>
              <Label className="text-yellow-200 text-sm font-semibold" style={{ fontFamily: "Georgia, serif" }}>
                📅 Fecha
              </Label>
              <Input
                className="mt-1 bg-[#1a0800] border-[#C9920A] text-yellow-100 placeholder:text-yellow-900 focus:border-yellow-400"
                value={menu.fecha}
                onChange={(e) => setMenu({ ...menu, fecha: e.target.value })}
                placeholder="Ej: martes, 25 de marzo de 2026"
              />
            </div>

            <Separator className="bg-yellow-900/40" />

            {/* ── Modo fin de semana ── */}
            <div
              className="rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer select-none"
              style={{
                background: menu.esFinDeSemana
                  ? "linear-gradient(135deg,#5A1A10,#3D0E0A)"
                  : "rgba(255,255,255,0.03)",
                border: `2px solid ${menu.esFinDeSemana ? "#C9920A" : "#3a1a00"}`,
                transition: "all 0.2s",
              }}
              onClick={() => setMenu({ ...menu, esFinDeSemana: !menu.esFinDeSemana })}
            >
              <div>
                <p className="text-yellow-200 text-sm font-bold" style={{ fontFamily: "Georgia, serif" }}>
                  🗓️ Menú Fin de Semana
                </p>
                <p className="text-yellow-700 text-xs mt-0.5">
                  {menu.esFinDeSemana
                    ? "Solo especiales · sin principios ni proteínas"
                    : "Activa para menú de sábado y domingo"}
                </p>
              </div>
              <div
                className="w-12 h-6 rounded-full relative transition-all"
                style={{ background: menu.esFinDeSemana ? "#C9920A" : "#3a1a00" }}
              >
                <div
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all"
                  style={{ left: menu.esFinDeSemana ? "28px" : "4px" }}
                />
              </div>
            </div>

            <Separator className="bg-yellow-900/40" />

            <div>
              <Label className="text-yellow-200 text-sm font-semibold" style={{ fontFamily: "Georgia, serif" }}>
                🍲 Sopa del Día
              </Label>
              <Input
                className="mt-1 bg-[#1a0800] border-[#C8251D] text-yellow-100 placeholder:text-yellow-900 focus:border-red-400"
                value={menu.sopa}
                onChange={(e) => setMenu({ ...menu, sopa: e.target.value })}
                placeholder="Ej: Sopa de fideos con pollo"
              />
            </div>

            <Separator className="bg-yellow-900/40" />

            {!menu.esFinDeSemana && (<>
            <div>
              <Label className="text-yellow-200 text-sm font-semibold mb-2 block" style={{ fontFamily: "Georgia, serif" }}>
                🥗 Principios (2 opciones)
              </Label>
              <div className="space-y-2">
                <Input
                  className="bg-[#1a0800] border-[#C8251D] text-yellow-100 placeholder:text-yellow-900 focus:border-red-400"
                  value={menu.principio1}
                  onChange={(e) => setMenu({ ...menu, principio1: e.target.value })}
                  placeholder="Principio 1 – Ej: Arroz blanco"
                />
                <Input
                  className="bg-[#1a0800] border-[#C8251D] text-yellow-100 placeholder:text-yellow-900 focus:border-red-400"
                  value={menu.principio2}
                  onChange={(e) => setMenu({ ...menu, principio2: e.target.value })}
                  placeholder="Principio 2 – Ej: Frijoles"
                />
              </div>
            </div>

            <Separator className="bg-yellow-900/40" />

            <div>
              <Label className="text-yellow-200 text-sm font-semibold mb-2 block" style={{ fontFamily: "Georgia, serif" }}>
                🥩 Proteínas (2 obligatorias + 1 opcional)
              </Label>
              <div className="space-y-2">
                <Input
                  className="bg-[#1a0800] border-[#C8251D] text-yellow-100 placeholder:text-yellow-900 focus:border-red-400"
                  value={menu.proteina1}
                  onChange={(e) => setMenu({ ...menu, proteina1: e.target.value })}
                  placeholder="Proteína 1 – Ej: Pechuga a la plancha"
                />
                <Input
                  className="bg-[#1a0800] border-[#C8251D] text-yellow-100 placeholder:text-yellow-900 focus:border-red-400"
                  value={menu.proteina2}
                  onChange={(e) => setMenu({ ...menu, proteina2: e.target.value })}
                  placeholder="Proteína 2 – Ej: Carne molida"
                />
                <div className="relative">
                  <Input
                    className="bg-[#1a0800] border-[#C9920A]/50 text-yellow-100 placeholder:text-yellow-900 focus:border-yellow-500"
                    value={menu.proteina3}
                    onChange={(e) => setMenu({ ...menu, proteina3: e.target.value })}
                    placeholder="Proteína 3 (opcional) – Ej: Pescado frito"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-yellow-700">
                    opcional
                  </span>
                </div>
              </div>
            </div>

            <Separator className="bg-yellow-900/40" />
            </>)}

            {/* ── WEEKDAY: Almuerzo Especial + Opcionales ── */}
            {!menu.esFinDeSemana && (<>
            <div>
              <Label className="text-yellow-300 text-sm font-bold mb-2 block" style={{ fontFamily: "Georgia, serif" }}>
                ✦ Almuerzo Especial <span className="text-yellow-500 font-normal text-xs">(siempre en el menú)</span>
              </Label>
              <Input
                className="mb-2 bg-[#1a0800] border-[#C9920A] text-yellow-100 placeholder:text-yellow-900 focus:border-yellow-400"
                value={menu.descripcionEspecial}
                onChange={(e) => setMenu({ ...menu, descripcionEspecial: e.target.value })}
                placeholder="Ej: Bandeja paisa, Pollo al horno..."
              />
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500 font-bold">$</span>
                <Input
                  className="pl-8 bg-[#1a0800] border-[#C9920A] text-yellow-100 placeholder:text-yellow-900 focus:border-yellow-400"
                  value={menu.precioEspecial}
                  onChange={(e) => setMenu({ ...menu, precioEspecial: e.target.value })}
                  placeholder="Ej: 16.000"
                />
              </div>
              <p className="text-yellow-800 text-xs mt-1">Aparece en el banner dorado. Si lo dejas vacío dirá "Consultar disponibilidad"</p>
            </div>
            <Separator className="bg-yellow-900/40" />
            <div>
              <Label className="text-yellow-200 text-sm font-semibold mb-3 block" style={{ fontFamily: "Georgia, serif" }}>
                ✦ Especiales Opcionales <span className="text-yellow-700 font-normal text-xs">(solo aparecen si los llenas)</span>
              </Label>
              <div className="space-y-4">
                {([
                  { label: "Opcional 1", descKey: "descripcionEspecial2", precioKey: "precioEspecial2" },
                  { label: "Opcional 2", descKey: "descripcionEspecial3", precioKey: "precioEspecial3" },
                  { label: "Opcional 3", descKey: "descripcionEspecial4", precioKey: "precioEspecial4" },
                ] as const).map(({ label, descKey, precioKey }) => (
                  <div key={label} className="border border-yellow-900/30 rounded-lg p-3 bg-[#120500]/50">
                    <p className="text-yellow-600 text-xs font-semibold mb-2">{label}</p>
                    <Input
                      className="mb-2 bg-[#1a0800] border-[#C9920A]/60 text-yellow-100 placeholder:text-yellow-900 focus:border-yellow-400"
                      value={menu[descKey]}
                      onChange={(e) => setMenu({ ...menu, [descKey]: e.target.value })}
                      placeholder="Nombre del especial..."
                    />
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500 font-bold">$</span>
                      <Input
                        className="pl-8 bg-[#1a0800] border-[#C9920A]/60 text-yellow-100 placeholder:text-yellow-900 focus:border-yellow-400"
                        value={menu[precioKey]}
                        onChange={(e) => setMenu({ ...menu, [precioKey]: e.target.value })}
                        placeholder="Precio"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </>)}

            {/* ── WEEKEND: 7 platos fijos + 4 opcionales ── */}
            {menu.esFinDeSemana && (<>
            <div>
              <Label className="text-yellow-300 text-sm font-bold mb-3 block" style={{ fontFamily: "Georgia, serif" }}>
                ⭐ Platos Especiales Fijos <span className="text-yellow-500 font-normal text-xs">(siempre en la imagen)</span>
              </Label>
              <div className="space-y-3">
                {([
                  { n: 1, dK: "wf1Desc", pK: "wf1Precio" },
                  { n: 2, dK: "wf2Desc", pK: "wf2Precio" },
                  { n: 3, dK: "wf3Desc", pK: "wf3Precio" },
                  { n: 4, dK: "wf4Desc", pK: "wf4Precio" },
                  { n: 5, dK: "wf5Desc", pK: "wf5Precio" },
                  { n: 6, dK: "wf6Desc", pK: "wf6Precio" },
                  { n: 7, dK: "wf7Desc", pK: "wf7Precio" },
                ] as const).map(({ n, dK, pK }) => (
                  <div key={n} className="border border-yellow-800/40 rounded-lg p-3 bg-[#120500]/50">
                    <p className="text-yellow-500 text-xs font-bold mb-2">Plato {n}</p>
                    <Input
                      className="mb-2 bg-[#1a0800] border-[#C9920A] text-yellow-100 placeholder:text-yellow-900 focus:border-yellow-400"
                      value={menu[dK]}
                      onChange={(e) => setMenu({ ...menu, [dK]: e.target.value })}
                      placeholder="Ej: Bandeja paisa, Pollo asado..."
                    />
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500 font-bold">$</span>
                      <Input
                        className="pl-8 bg-[#1a0800] border-[#C9920A] text-yellow-100 placeholder:text-yellow-900 focus:border-yellow-400"
                        value={menu[pK]}
                        onChange={(e) => setMenu({ ...menu, [pK]: e.target.value })}
                        placeholder="Precio"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Separator className="bg-yellow-900/40" />
            <div>
              <Label className="text-yellow-200 text-sm font-semibold mb-3 block" style={{ fontFamily: "Georgia, serif" }}>
                ✦ Platos Opcionales <span className="text-yellow-700 font-normal text-xs">(solo aparecen si los llenas)</span>
              </Label>
              <div className="space-y-3">
                {([
                  { n: 1, dK: "wo1Desc", pK: "wo1Precio" },
                  { n: 2, dK: "wo2Desc", pK: "wo2Precio" },
                  { n: 3, dK: "wo3Desc", pK: "wo3Precio" },
                  { n: 4, dK: "wo4Desc", pK: "wo4Precio" },
                ] as const).map(({ n, dK, pK }) => (
                  <div key={n} className="border border-yellow-900/30 rounded-lg p-3 bg-[#0f0300]/60">
                    <p className="text-yellow-700 text-xs font-semibold mb-2">Opcional {n}</p>
                    <Input
                      className="mb-2 bg-[#1a0800] border-[#C9920A]/60 text-yellow-100 placeholder:text-yellow-900 focus:border-yellow-400"
                      value={menu[dK]}
                      onChange={(e) => setMenu({ ...menu, [dK]: e.target.value })}
                      placeholder="Nombre del plato..."
                    />
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500 font-bold">$</span>
                      <Input
                        className="pl-8 bg-[#1a0800] border-[#C9920A]/60 text-yellow-100 placeholder:text-yellow-900 focus:border-yellow-400"
                        value={menu[pK]}
                        onChange={(e) => setMenu({ ...menu, [pK]: e.target.value })}
                        placeholder="Precio"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </>)}

            <Separator className="bg-yellow-900/40" />

            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleDownload}
                className="flex-1 font-bold text-base py-6 shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #C8251D, #8B1A14)",
                  border: "2px solid #C9920A",
                  color: "white",
                  fontFamily: "Georgia, serif",
                }}
              >
                <Download className="mr-2 h-5 w-5" />
                Descargar Imagen
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="border-yellow-700 text-yellow-400 hover:bg-yellow-950 hover:text-yellow-200"
                title="Limpiar formulario"
              >
                <RefreshCw className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="flex flex-col items-center gap-4">
          <h2
            className="text-xl font-bold text-center"
            style={{ color: "#E8B528", fontFamily: "Georgia, serif" }}
          >
            Vista Previa
          </h2>
          <div
            className="rounded-2xl overflow-hidden shadow-2xl w-full"
            style={{ border: "2px solid #C9920A" }}
          >
            <canvas
              ref={canvasRef}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
          <p className="text-yellow-800 text-xs text-center">
            Tamaño optimizado para estado de WhatsApp (1080 × 1920 px)
          </p>
          <Button
            onClick={handleDownload}
            className="w-full font-bold text-base py-5 shadow-lg xl:hidden"
            style={{
              background: "linear-gradient(135deg, #C8251D, #8B1A14)",
              border: "2px solid #C9920A",
              color: "white",
              fontFamily: "Georgia, serif",
            }}
          >
            <Download className="mr-2 h-5 w-5" />
            Descargar Imagen PNG
          </Button>
        </div>
      </div>
    </div>
  );
}
