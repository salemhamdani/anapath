import { useState, useRef, useCallback } from "react";

// ─── SVG SCENES (Macroscopie + Histologie) ────────────────────────────────

const MACRO_SCENES = {
  breast: {
    bg: ["#f5deb3", "#e8c49a"],
    title: "Pièce de mastectomie — Coupe sagittale",
    elements: [
      // Tissu adipeux global
      { type: "ellipse", cx: 200, cy: 160, rx: 185, ry: 140, fill: "#f0d090", stroke: "#c8a060", sw: 2 },
      // Nodule tumoral principal
      { type: "ellipse", cx: 190, cy: 140, rx: 52, ry: 44, fill: "#c8a0a0", stroke: "#8b4040", sw: 2.5 },
      // Spicules
      { type: "line", x1: 145, y1: 115, x2: 110, y2: 88, stroke: "#8b4040", sw: 1.5 },
      { type: "line", x1: 152, y1: 108, x2: 128, y2: 78, stroke: "#8b4040", sw: 1.5 },
      { type: "line", x1: 238, y1: 112, x2: 268, y2: 82, stroke: "#8b4040", sw: 1.5 },
      { type: "line", x1: 232, y1: 120, x2: 265, y2: 96, stroke: "#8b4040", sw: 1.5 },
      { type: "line", x1: 190, y1: 96, x2: 190, y2: 62, stroke: "#8b4040", sw: 1.5 },
      { type: "line", x1: 175, y1: 182, x2: 160, y2: 208, stroke: "#8b4040", sw: 1.5 },
      // Centre blanchâtre (fibrose)
      { type: "ellipse", cx: 190, cy: 140, rx: 28, ry: 22, fill: "#e8d0d0", stroke: "#b08080", sw: 1 },
      // Calcifications
      { type: "circle", cx: 185, cy: 132, r: 3, fill: "#fff" },
      { type: "circle", cx: 196, cy: 145, r: 2.5, fill: "#fff" },
      { type: "circle", cx: 178, cy: 148, r: 2, fill: "#fff" },
      // Ganglion sentinelle
      { type: "ellipse", cx: 330, cy: 80, rx: 22, ry: 16, fill: "#d4b8c8", stroke: "#8a6080", sw: 1.5 },
      // Peau
      { type: "path", d: "M 20 30 Q 200 15 380 28", stroke: "#c8a060", sw: 3, fill: "none" },
      // Mamelon
      { type: "circle", cx: 200, cy: 22, r: 8, fill: "#c09070", stroke: "#906050", sw: 1 },
      // Tissu graisseux lobulé
      { type: "circle", cx: 80, cy: 200, r: 18, fill: "#f0d888", stroke: "#c8b060", sw: 1 },
      { type: "circle", cx: 115, cy: 220, r: 14, fill: "#f0d888", stroke: "#c8b060", sw: 1 },
      { type: "circle", cx: 300, cy: 220, r: 16, fill: "#f0d888", stroke: "#c8b060", sw: 1 },
      { type: "circle", cx: 340, cy: 195, r: 12, fill: "#f0d888", stroke: "#c8b060", sw: 1 },
    ],
    expertAnnotations: [
      { x: 190, y: 140, label: "Nodule spiculé — limite irrégulière ⚠ malignité", color: "#ef4444", category: "malignite" },
      { x: 190, y: 140, label: "Consistance ferme / pierreuse", color: "#f97316", category: "malignite" },
      { x: 185, y: 132, label: "Microcalcifications (foyer de nécrose)", color: "#f59e0b", category: "malignite" },
      { x: 190, y: 62, label: "Spicules = réaction desmoplasique", color: "#ef4444", category: "malignite" },
      { x: 330, y: 80, label: "Ganglion sentinelle à analyser", color: "#3b82f6", category: "staging" },
      { x: 200, y: 22, label: "Rétraction cutanée possible", color: "#a855f7", category: "extension" },
    ]
  },
  hodgkin: {
    bg: ["#e8eef5", "#d0dce8"],
    title: "Ganglion cervical — Coupe transversale",
    elements: [
      // Capsule ganglionnaire
      { type: "ellipse", cx: 200, cy: 160, rx: 155, ry: 130, fill: "#c8d8e8", stroke: "#6888a8", sw: 3 },
      // Tissu ganglionnaire
      { type: "ellipse", cx: 200, cy: 160, rx: 140, ry: 116, fill: "#d8e8f0", stroke: "#8898b0", sw: 1 },
      // Nodules (pattern nodulaire)
      { type: "ellipse", cx: 145, cy: 120, rx: 42, ry: 38, fill: "#b8c8d8", stroke: "#7898b8", sw: 1.5 },
      { type: "ellipse", cx: 250, cy: 120, rx: 38, ry: 34, fill: "#b8c8d8", stroke: "#7898b8", sw: 1.5 },
      { type: "ellipse", cx: 195, cy: 195, rx: 44, ry: 36, fill: "#b8c8d8", stroke: "#7898b8", sw: 1.5 },
      { type: "ellipse", cx: 130, cy: 190, rx: 30, ry: 26, fill: "#b8c8d8", stroke: "#7898b8", sw: 1.5 },
      { type: "ellipse", cx: 272, cy: 195, rx: 28, ry: 24, fill: "#b8c8d8", stroke: "#7898b8", sw: 1.5 },
      // Bandes fibreuses
      { type: "path", d: "M 65 135 Q 200 125 335 138", stroke: "#8888a8", sw: 4, fill: "none" },
      { type: "path", d: "M 75 168 Q 200 158 325 170", stroke: "#8888a8", sw: 3, fill: "none" },
      // Aspect homogène blanchâtre
      { type: "ellipse", cx: 145, cy: 120, rx: 28, ry: 24, fill: "#e8f0f8" },
      { type: "ellipse", cx: 250, cy: 120, rx: 24, ry: 20, fill: "#e8f0f8" },
      // Péri-capsulaire
      { type: "ellipse", cx: 200, cy: 160, rx: 163, ry: 137, fill: "none", stroke: "#c8d8e8", sw: 6 },
    ],
    expertAnnotations: [
      { x: 200, y: 160, label: "Architecture ganglionnaire effacée ⚠", color: "#ef4444", category: "malignite" },
      { x: 200, y: 125, label: "Pattern nodulaire (sclérose nodulaire)", color: "#f97316", category: "malignite" },
      { x: 200, y: 158, label: "Bandes fibreuses épaisses", color: "#f59e0b", category: "malignite" },
      { x: 200, y: 160, label: "Consistance ferme, blanchâtre", color: "#f97316", category: "macro" },
      { x: 355, y: 160, label: "Capsule intacte (stade limité ?)", color: "#22c55e", category: "staging" },
    ]
  },
  thyroid: {
    bg: ["#e8f0e0", "#d8e8d0"],
    title: "Lobe thyroïdien — Coupe frontale",
    elements: [
      // Lobe thyroïdien
      { type: "ellipse", cx: 200, cy: 160, rx: 165, ry: 130, fill: "#c8dcc0", stroke: "#6a9060", sw: 2.5 },
      // Parenchyme normal
      { type: "ellipse", cx: 200, cy: 160, rx: 148, ry: 114, fill: "#d8ecca", stroke: "#8aaa70", sw: 1 },
      // Nodule tumoral
      { type: "ellipse", cx: 175, cy: 145, rx: 58, ry: 50, fill: "#b8c8a8", stroke: "#4a7040", sw: 2.5 },
      // Capsule épaisse du nodule
      { type: "ellipse", cx: 175, cy: 145, rx: 62, ry: 54, fill: "none", stroke: "#4a6838", sw: 4 },
      // Invasion capsulaire
      { type: "path", d: "M 230 120 Q 240 108 252 112", stroke: "#cc3030", sw: 3, fill: "none" },
      { type: "circle", cx: 240, cy: 110, r: 6, fill: "#cc3030" },
      // Colloïde (zones brunes)
      { type: "ellipse", cx: 165, cy: 140, rx: 18, ry: 14, fill: "#a09858", opacity: 0.6 },
      { type: "ellipse", cx: 188, cy: 158, rx: 14, ry: 10, fill: "#a09858", opacity: 0.5 },
      // Corps psammomateux (calcifications fines)
      { type: "circle", cx: 155, cy: 128, r: 2.5, fill: "#e8e0c8" },
      { type: "circle", cx: 178, cy: 125, r: 2, fill: "#e8e0c8" },
      { type: "circle", cx: 162, cy: 162, r: 2, fill: "#e8e0c8" },
      // Parenchyme normal folliculaire
      { type: "circle", cx: 310, cy: 120, r: 12, fill: "#c8e0b8", stroke: "#8aaa70", sw: 1 },
      { type: "circle", cx: 330, cy: 150, r: 14, fill: "#c8e0b8", stroke: "#8aaa70", sw: 1 },
      { type: "circle", cx: 305, cy: 185, r: 10, fill: "#c8e0b8", stroke: "#8aaa70", sw: 1 },
      { type: "circle", cx: 80, cy: 160, r: 13, fill: "#c8e0b8", stroke: "#8aaa70", sw: 1 },
      { type: "circle", cx: 68, cy: 190, r: 10, fill: "#c8e0b8", stroke: "#8aaa70", sw: 1 },
      // Isthme
      { type: "rect", x: 360, y: 130, w: 25, h: 55, fill: "#c0d8b8", stroke: "#6a9060", sw: 2, rx: 8 },
    ],
    expertAnnotations: [
      { x: 175, y: 145, label: "Nodule hypoéchogène — capsule épaisse irrégulière ⚠", color: "#ef4444", category: "malignite" },
      { x: 240, y: 110, label: "Invasion capsulaire = critère de malignité formel ⚠", color: "#ef4444", category: "malignite" },
      { x: 158, y: 128, label: "Microcalcifications / corps psammomateux", color: "#f59e0b", category: "malignite" },
      { x: 320, y: 150, label: "Parenchyme sain — follicules normaux", color: "#22c55e", category: "normal" },
      { x: 175, y: 140, label: "Aspect blanchâtre (vs brun = bénin)", color: "#f97316", category: "malignite" },
    ]
  }
};

const HISTO_SCENES = {
  breast: {
    bg: ["#f8ece8", "#f0ddd8"],
    title: "Carcinome canalaire infiltrant — HES × 200",
    elements: [
      { type: "ellipse", cx: 110, cy: 95, rx: 52, ry: 42, fill: "#e8b8c8", stroke: "#c880a0", sw: 1.5 },
      { type: "ellipse", cx: 110, cy: 95, rx: 36, ry: 28, fill: "#f0c8d8" },
      { type: "ellipse", cx: 240, cy: 75, rx: 44, ry: 36, fill: "#e8b8c8", stroke: "#c880a0", sw: 1.5 },
      { type: "ellipse", cx: 240, cy: 75, rx: 28, ry: 20, fill: "#f0c8d8" },
      { type: "ellipse", cx: 320, cy: 130, rx: 48, ry: 40, fill: "#e8b8c8", stroke: "#c880a0", sw: 1.5 },
      { type: "ellipse", cx: 320, cy: 130, rx: 32, ry: 24, fill: "#f0c8d8" },
      { type: "ellipse", cx: 170, cy: 195, rx: 55, ry: 44, fill: "#e8b8c8", stroke: "#c880a0", sw: 1.5 },
      { type: "ellipse", cx: 170, cy: 195, rx: 38, ry: 28, fill: "#f0c8d8" },
      // Noyaux atypiques
      { type: "circle", cx: 85, cy: 88, r: 7, fill: "#703060" },
      { type: "circle", cx: 102, cy: 80, r: 6, fill: "#703060" },
      { type: "circle", cx: 118, cy: 90, r: 7.5, fill: "#703060" },
      { type: "circle", cx: 130, cy: 100, r: 5, fill: "#703060" },
      { type: "circle", cx: 220, cy: 70, r: 6.5, fill: "#703060" },
      { type: "circle", cx: 240, cy: 62, r: 7, fill: "#703060" },
      { type: "circle", cx: 256, cy: 75, r: 6, fill: "#703060" },
      { type: "circle", cx: 298, cy: 125, r: 7, fill: "#703060" },
      { type: "circle", cx: 315, cy: 118, r: 6.5, fill: "#703060" },
      { type: "circle", cx: 334, cy: 128, r: 7, fill: "#703060" },
      { type: "circle", cx: 145, cy: 188, r: 7, fill: "#703060" },
      { type: "circle", cx: 162, cy: 178, r: 6, fill: "#703060" },
      { type: "circle", cx: 180, cy: 190, r: 7.5, fill: "#703060" },
      // Mitose
      { type: "circle", cx: 108, cy: 100, r: 5, fill: "#ff4040", stroke: "#cc0000", sw: 1 },
      // Stroma fibreux
      { type: "path", d: "M 0 145 Q 200 138 400 148", stroke: "#d0a8b8", sw: 4, fill: "none", opacity: 0.5 },
      { type: "path", d: "M 180 0 Q 172 150 175 300", stroke: "#d0a8b8", sw: 3, fill: "none", opacity: 0.4 },
    ],
    expertAnnotations: [
      { x: 110, y: 95, label: "Structure tubulaire bien formée (score 1)", color: "#22c55e", category: "grade" },
      { x: 108, y: 100, label: "Figure de mitose (score selon /10 CGA)", color: "#ef4444", category: "grade" },
      { x: 118, y: 90, label: "Atypies nucléaires modérées (score 2)", color: "#f59e0b", category: "grade" },
      { x: 200, y: 145, label: "Stroma desmoplasique réactionnel", color: "#a855f7", category: "stroma" },
      { x: 240, y: 75, label: "Lumière glandulaire ouverte", color: "#3b82f6", category: "architecture" },
    ]
  },
  hodgkin: {
    bg: ["#eef2f8", "#e0e8f4"],
    title: "Lymphome de Hodgkin — HES × 400",
    elements: [
      // Fond polymorphe
      { type: "circle", cx: 60, cy: 60, r: 6, fill: "#8090c0" },
      { type: "circle", cx: 80, cy: 48, r: 5, fill: "#8090c0" },
      { type: "circle", cx: 95, cy: 68, r: 6, fill: "#8090c0" },
      { type: "circle", cx: 40, cy: 80, r: 5, fill: "#8090c0" },
      { type: "circle", cx: 340, cy: 55, r: 6, fill: "#8090c0" },
      { type: "circle", cx: 360, cy: 70, r: 5, fill: "#8090c0" },
      { type: "circle", cx: 320, cy: 75, r: 6, fill: "#8090c0" },
      { type: "circle", cx: 50, cy: 210, r: 5, fill: "#8090c0" },
      { type: "circle", cx: 70, cy: 225, r: 6, fill: "#8090c0" },
      { type: "circle", cx: 340, cy: 220, r: 5, fill: "#8090c0" },
      { type: "circle", cx: 355, cy: 205, r: 6, fill: "#8090c0" },
      // Éosinophiles
      { type: "circle", cx: 130, cy: 240, r: 7, fill: "#e8a040", stroke: "#c07020", sw: 1 },
      { type: "circle", cx: 280, cy: 250, r: 7, fill: "#e8a040", stroke: "#c07020", sw: 1 },
      { type: "circle", cx: 380, cy: 175, r: 6, fill: "#e8a040", stroke: "#c07020", sw: 1 },
      { type: "circle", cx: 30, cy: 160, r: 7, fill: "#e8a040", stroke: "#c07020", sw: 1 },
      // Cellule de RS - grande binucléée
      { type: "ellipse", cx: 200, cy: 148, rx: 28, ry: 22, fill: "#e04040", stroke: "#a01010", sw: 2 },
      { type: "circle", cx: 190, cy: 145, r: 11, fill: "#c02020" },
      { type: "circle", cx: 212, cy: 150, r: 11, fill: "#c02020" },
      { type: "circle", cx: 190, cy: 144, r: 5, fill: "#fff8f0", opacity: 0.9 },
      { type: "circle", cx: 212, cy: 149, r: 5, fill: "#fff8f0", opacity: 0.9 },
      // Cellule lacunaire
      { type: "ellipse", cx: 310, cy: 155, rx: 20, ry: 16, fill: "#e06060", stroke: "#b02020", sw: 1.5 },
      { type: "circle", cx: 310, cy: 155, r: 9, fill: "#c02020" },
      { type: "circle", cx: 310, cy: 154, r: 4, fill: "#fff8f0", opacity: 0.85 },
      // Fibrose
      { type: "path", d: "M 0 110 Q 200 100 400 112", stroke: "#a0a8c0", sw: 5, fill: "none", opacity: 0.5 },
      { type: "path", d: "M 0 195 Q 200 188 400 198", stroke: "#a0a8c0", sw: 4, fill: "none", opacity: 0.4 },
      { type: "path", d: "M 100 0 Q 95 150 98 300", stroke: "#a0a8c0", sw: 4, fill: "none", opacity: 0.4 },
    ],
    expertAnnotations: [
      { x: 200, y: 148, label: "Cellule de Reed-Sternberg binucléée — pathognomonique ⚠", color: "#ef4444", category: "malignite" },
      { x: 190, y: 144, label: "Inclusions éosinophiles (œil de hibou)", color: "#f97316", category: "malignite" },
      { x: 310, y: 155, label: "Cellule lacunaire (variante RS)", color: "#f59e0b", category: "malignite" },
      { x: 130, y: 240, label: "Éosinophile — fond polymorphe", color: "#eab308", category: "contexte" },
      { x: 80, y: 60, label: "Lymphocytes réactionnels", color: "#3b82f6", category: "contexte" },
      { x: 200, y: 108, label: "Bande fibreuse (sclérose nodulaire)", color: "#a855f7", category: "soustype" },
    ]
  },
  thyroid: {
    bg: ["#f0f5e8", "#e4eedd"],
    title: "Carcinome papillaire thyroïdien — HES × 400",
    elements: [
      // Follicules
      { type: "ellipse", cx: 95, cy: 90, rx: 48, ry: 42, fill: "#c8dca8", stroke: "#789858", sw: 1.5 },
      { type: "ellipse", cx: 95, cy: 90, rx: 34, ry: 28, fill: "#d8ecb8" },
      { type: "ellipse", cx: 240, cy: 70, rx: 44, ry: 36, fill: "#c8dca8", stroke: "#789858", sw: 1.5 },
      { type: "ellipse", cx: 240, cy: 70, rx: 30, ry: 22, fill: "#d8ecb8" },
      { type: "ellipse", cx: 320, cy: 170, rx: 52, ry: 44, fill: "#c8dca8", stroke: "#789858", sw: 1.5 },
      { type: "ellipse", cx: 320, cy: 170, rx: 36, ry: 30, fill: "#d8ecb8" },
      { type: "ellipse", cx: 145, cy: 210, rx: 40, ry: 34, fill: "#c8dca8", stroke: "#789858", sw: 1.5 },
      { type: "ellipse", cx: 145, cy: 210, rx: 26, ry: 20, fill: "#d8ecb8" },
      // Noyaux papillaires - clairs
      { type: "ellipse", cx: 68, cy: 82, rx: 8, ry: 6, fill: "#f0f8e0", stroke: "#6a8848", sw: 1 },
      { type: "ellipse", cx: 84, cy: 72, rx: 8, ry: 5, fill: "#f0f8e0", stroke: "#6a8848", sw: 1 },
      { type: "ellipse", cx: 100, cy: 78, rx: 7, ry: 5, fill: "#f0f8e0", stroke: "#6a8848", sw: 1 },
      { type: "ellipse", cx: 114, cy: 86, rx: 8, ry: 6, fill: "#f0f8e0", stroke: "#6a8848", sw: 1 },
      { type: "ellipse", cx: 218, cy: 64, rx: 7, ry: 5, fill: "#f0f8e0", stroke: "#6a8848", sw: 1 },
      { type: "ellipse", cx: 238, cy: 58, rx: 8, ry: 5, fill: "#f0f8e0", stroke: "#6a8848", sw: 1 },
      { type: "ellipse", cx: 254, cy: 66, rx: 7, ry: 5, fill: "#f0f8e0", stroke: "#6a8848", sw: 1 },
      // Incisures nucléaires
      { type: "path", d: "M 64 80 Q 68 76 72 80", stroke: "#4a6828", sw: 1.2, fill: "none" },
      { type: "path", d: "M 214 62 Q 218 58 222 62", stroke: "#4a6828", sw: 1.2, fill: "none" },
      // Inclusion intranucléaire
      { type: "circle", cx: 100, cy: 78, r: 3, fill: "#d0e8a0" },
      // Corps psammomateux
      { type: "circle", cx: 200, cy: 155, r: 8, fill: "#e8e0c0", stroke: "#b0a880", sw: 1 },
      { type: "circle", cx: 200, cy: 155, r: 5, fill: "#d8d0a8" },
      { type: "circle", cx: 200, cy: 155, r: 3, fill: "#c8c090" },
    ],
    expertAnnotations: [
      { x: 84, y: 72, label: "Noyaux clairs — 'aspect en verre dépoli' ⚠", color: "#ef4444", category: "malignite" },
      { x: 64, y: 80, label: "Incisures nucléaires (pseudo-inclusions) ⚠", color: "#ef4444", category: "malignite" },
      { x: 100, y: 78, label: "Inclusion intranucléaire éosinophile", color: "#f97316", category: "malignite" },
      { x: 200, y: 155, label: "Corps psammomateux (calcification concentrique)", color: "#f59e0b", category: "malignite" },
      { x: 95, y: 90, label: "Architecture folliculaire (variante folliculaire)", color: "#3b82f6", category: "architecture" },
      { x: 240, y: 70, label: "Colloïde intrafolliculaire", color: "#22c55e", category: "architecture" },
    ]
  }
};

// ─── ANNOTATION TOOL ──────────────────────────────────────────────────────
const ANNOTATION_CATEGORIES = [
  { id: "malignite", label: "Critère de malignité", color: "#ef4444", icon: "⚠" },
  { id: "benin", label: "Critère bénin", color: "#22c55e", icon: "✓" },
  { id: "architecture", label: "Architecture", color: "#3b82f6", icon: "🏗" },
  { id: "nucleaire", label: "Critère nucléaire", color: "#f97316", icon: "🔵" },
  { id: "stroma", label: "Stroma / contexte", color: "#a855f7", icon: "🔬" },
  { id: "staging", label: "Staging / extension", color: "#f59e0b", icon: "📍" },
];

function AnnotableImage({ scene, userAnnotations, onAddAnnotation, showExpert, mode }) {
  const svgRef = useRef(null);
  const [pendingPos, setPendingPos] = useState(null);
  const [pendingLabel, setPendingLabel] = useState("");
  const [pendingCat, setPendingCat] = useState("malignite");
  const [hoveredAnn, setHoveredAnn] = useState(null);

  const handleSvgClick = useCallback((e) => {
    if (mode !== "annotate") return;
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const scaleX = 400 / rect.width;
    const scaleY = 290 / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    setPendingPos({ x: Math.round(x), y: Math.round(y) });
    setPendingLabel("");
  }, [mode]);

  function confirmAnnotation() {
    if (!pendingLabel.trim()) return;
    onAddAnnotation({ x: pendingPos.x, y: pendingPos.y, label: pendingLabel.trim(), category: pendingCat, color: ANNOTATION_CATEGORIES.find(c => c.id === pendingCat)?.color || "#fff" });
    setPendingPos(null);
    setPendingLabel("");
  }

  const gradId = `grad_${scene.title?.replace(/\s/g, "")}`;

  return (
    <div style={{ position: "relative" }}>
      <svg
        ref={svgRef}
        viewBox="0 0 400 290"
        onClick={handleSvgClick}
        style={{
          width: "100%", borderRadius: 10,
          border: `2px solid ${mode === "annotate" ? "#f59e0b" : "#1e1e30"}`,
          cursor: mode === "annotate" ? "crosshair" : "default",
          transition: "border-color 0.2s"
        }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={scene.bg[0]} />
            <stop offset="100%" stopColor={scene.bg[1]} />
          </linearGradient>
        </defs>
        <rect width="400" height="290" fill={`url(#${gradId})`} />

        {/* Scene elements */}
        {scene.elements.map((el, i) => {
          const common = { key: i, stroke: el.stroke, strokeWidth: el.sw, fill: el.fill, opacity: el.opacity };
          if (el.type === "ellipse") return <ellipse {...common} cx={el.cx} cy={el.cy} rx={el.rx} ry={el.ry} />;
          if (el.type === "circle") return <circle {...common} cx={el.cx} cy={el.cy} r={el.r} />;
          if (el.type === "line") return <line {...common} x1={el.x1} y1={el.y1} x2={el.x2} y2={el.y2} />;
          if (el.type === "path") return <path {...common} d={el.d} />;
          if (el.type === "rect") return <rect {...common} x={el.x} y={el.y} width={el.w} height={el.h} rx={el.rx} />;
          return null;
        })}

        {/* Expert annotations */}
        {showExpert && scene.expertAnnotations.map((ann, i) => {
          const angle = (i * 65) % 360;
          const dist = 70 + (i % 3) * 20;
          const tx = ann.x + Math.cos(angle * Math.PI / 180) * dist;
          const ty = ann.y + Math.sin(angle * Math.PI / 180) * dist;
          const clampX = Math.max(10, Math.min(390, tx));
          const clampY = Math.max(12, Math.min(280, ty));
          return (
            <g key={`exp-${i}`}>
              <line x1={ann.x} y1={ann.y} x2={clampX} y2={clampY} stroke={ann.color} strokeWidth={1.5} strokeDasharray="3,2" />
              <circle cx={ann.x} cy={ann.y} r={6} fill={ann.color} opacity={0.9} />
              <circle cx={ann.x} cy={ann.y} r={3} fill="#fff" opacity={0.8} />
              <rect x={clampX - 2} y={clampY - 12} width={Math.min(ann.label.length * 5.5 + 8, 200)} height={16} fill="#080818" opacity={0.88} rx={3} />
              <text x={clampX + 2} y={clampY} fill={ann.color} fontSize="8.5" fontFamily="monospace" fontWeight="700">{ann.label}</text>
            </g>
          );
        })}

        {/* User annotations */}
        {userAnnotations.map((ann, i) => {
          const angle = 30 + (i * 80) % 300;
          const dist = 60 + (i % 4) * 18;
          const tx = ann.x + Math.cos(angle * Math.PI / 180) * dist;
          const ty = ann.y + Math.sin(angle * Math.PI / 180) * dist;
          const clampX = Math.max(10, Math.min(390, tx));
          const clampY = Math.max(12, Math.min(280, ty));
          return (
            <g key={`usr-${i}`} onMouseEnter={() => setHoveredAnn(i)} onMouseLeave={() => setHoveredAnn(null)}>
              <line x1={ann.x} y1={ann.y} x2={clampX} y2={clampY} stroke={ann.color} strokeWidth={2} />
              <circle cx={ann.x} cy={ann.y} r={7} fill={ann.color} opacity={0.95} />
              <text x={ann.x} y={ann.y + 4} fill="#fff" fontSize="9" textAnchor="middle" fontWeight="800">{i + 1}</text>
              <rect x={clampX - 2} y={clampY - 13} width={Math.min(ann.label.length * 5.5 + 10, 195)} height={17} fill={ann.color} opacity={hoveredAnn === i ? 1 : 0.82} rx={3} />
              <text x={clampX + 3} y={clampY} fill="#fff" fontSize="8.5" fontFamily="monospace" fontWeight="700">{ann.label}</text>
            </g>
          );
        })}

        {/* Pending marker */}
        {pendingPos && (
          <g>
            <circle cx={pendingPos.x} cy={pendingPos.y} r={10} fill="#f59e0b" opacity={0.5} />
            <circle cx={pendingPos.x} cy={pendingPos.y} r={5} fill="#f59e0b" />
            <line x1={pendingPos.x} y1={pendingPos.y - 14} x2={pendingPos.x} y2={pendingPos.y - 2} stroke="#f59e0b" strokeWidth={2} />
            <line x1={pendingPos.x - 14} y1={pendingPos.y} x2={pendingPos.x - 2} y2={pendingPos.y} stroke="#f59e0b" strokeWidth={2} />
          </g>
        )}

        {/* HES badge */}
        <rect x={4} y={274} width={scene.title.length * 5.4 + 8} height={13} fill="#000" opacity={0.7} rx={3} />
        <text x={8} y={284} fill="#999" fontSize="8" fontFamily="monospace">{scene.title}</text>

        {mode === "annotate" && !pendingPos && (
          <>
            <rect x={280} y={4} width={116} height={13} fill="#f59e0b" opacity={0.85} rx={3} />
            <text x={284} y={14} fill="#000" fontSize="8.5" fontFamily="monospace" fontWeight="700">✎ Cliquez pour annoter</text>
          </>
        )}
      </svg>

      {/* Pending annotation popup */}
      {pendingPos && (
        <div style={ps.popup}>
          <div style={ps.popupTitle}>📌 Annoter ce point</div>
          <div style={ps.catGrid}>
            {ANNOTATION_CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setPendingCat(cat.id)}
                style={{ ...ps.catBtn, border: `2px solid ${pendingCat === cat.id ? cat.color : "#2a2a3a"}`, color: pendingCat === cat.id ? cat.color : "#666", background: pendingCat === cat.id ? `${cat.color}18` : "#0f0f1e" }}>
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
          <input
            style={ps.input}
            placeholder="Décrivez ce critère..."
            value={pendingLabel}
            onChange={e => setPendingLabel(e.target.value)}
            onKeyDown={e => e.key === "Enter" && confirmAnnotation()}
            autoFocus
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button style={ps.confirmBtn} onClick={confirmAnnotation}>Confirmer</button>
            <button style={ps.cancelBtn} onClick={() => setPendingPos(null)}>Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
}

const ps = {
  popup: { position: "absolute", top: 8, right: 8, background: "#0f0f1e", border: "1px solid #f59e0b", borderRadius: 10, padding: "14px", width: 240, zIndex: 20, boxShadow: "0 8px 32px #000a" },
  popupTitle: { fontSize: 12, color: "#f59e0b", fontWeight: 700, marginBottom: 10, letterSpacing: 1 },
  catGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, marginBottom: 10 },
  catBtn: { padding: "5px 6px", borderRadius: 6, cursor: "pointer", fontSize: 10, fontWeight: 600, transition: "all 0.15s", fontFamily: "inherit" },
  input: { width: "100%", background: "#1a1a2a", border: "1px solid #3a3a4a", borderRadius: 7, padding: "8px 10px", color: "#fff", fontSize: 13, fontFamily: "inherit", boxSizing: "border-box" },
  confirmBtn: { flex: 1, background: "#f59e0b", color: "#000", border: "none", borderRadius: 7, padding: "8px", fontWeight: 700, cursor: "pointer", fontSize: 13 },
  cancelBtn: { flex: 1, background: "#2a2a3a", color: "#888", border: "none", borderRadius: 7, padding: "8px", fontWeight: 700, cursor: "pointer", fontSize: 13 },
};

// ─── CASE DATA ────────────────────────────────────────────────────────────
const CASES = [
  {
    id: 1, organ: "Sein", icon: "🎀",
    title: "Nodule du sein gauche — Femme 52 ans",
    clinique: "Femme, 52 ans. Nodule de 2,3 cm découvert à la mammographie de dépistage. Asymptomatique. Pas d'ATCD familial.",
    macroType: "breast", histoType: "breast",
    ihc: [
      { m: "RE", r: "+++", pos: true }, { m: "RP", r: "++", pos: true },
      { m: "HER2", r: "−", pos: false }, { m: "Ki67", r: "12%", pos: false },
      { m: "E-Cadh.", r: "+++", pos: true },
    ],
    criteria: [
      { text: "Limite irrégulière / spiculée", correct: true, img: "macro" },
      { text: "Consistance ferme / pierreuse", correct: true, img: "macro" },
      { text: "Microcalcifications à la coupe", correct: true, img: "macro" },
      { text: "Structure tubulaire bien formée > 75%", correct: true, img: "histo" },
      { text: "Atypies nucléaires modérées", correct: true, img: "histo" },
      { text: "Mitoses présentes", correct: true, img: "histo" },
      { text: "Profil luminal A (RE+/RP+/HER2−/Ki67 bas)", correct: true, img: "ihc" },
      { text: "Stroma desmoplasique", correct: true, img: "histo" },
      { text: "Bords nets et réguliers", correct: false, img: "macro" },
      { text: "Colloïde abondant intra-lésionnel", correct: false, img: "histo" },
    ],
    choices: [
      { id: "a", text: "Carcinome canalaire infiltrant, grade SBR I", correct: true },
      { id: "b", text: "Carcinome lobulaire infiltrant", correct: false },
      { id: "c", text: "Adénose sclérosante (lésion bénigne)", correct: false },
      { id: "d", text: "Carcinome de grade SBR III triple négatif", correct: false },
    ],
    diagnosis: "Carcinome canalaire infiltrant — Grade SBR I — Profil luminal A",
    pronostic: "Excellent", pronosticColor: "#22c55e",
    explanation: "Le grade SBR I repose sur la formation tubulaire > 75% (score 1) + atypies modérées (score 2) + mitoses rares (score 1) = 4 pts. Le profil luminal A (RE+, RP+, HER2−, Ki67 < 14%) oriente vers l'hormonothérapie adjuvante. L'E-cadhérine positive exclut le carcinome lobulaire. Les spicules macroscopiques reflètent la réaction desmoplasique."
  },
  {
    id: 2, organ: "Ganglion", icon: "🔵",
    title: "Adénopathies cervicales — Homme 28 ans",
    clinique: "Homme, 28 ans. Adénopathies cervicales bilatérales depuis 3 mois, fièvre vespérale, sueurs nocturnes, prurit.",
    macroType: "hodgkin", histoType: "hodgkin",
    ihc: [
      { m: "CD30", r: "+++", pos: true }, { m: "CD15", r: "++", pos: true },
      { m: "CD45", r: "−", pos: false }, { m: "PAX5", r: "+ (faible)", pos: true },
      { m: "CD20", r: "−", pos: false },
    ],
    criteria: [
      { text: "Architecture ganglionnaire effacée", correct: true, img: "macro" },
      { text: "Pattern nodulaire macroscopique", correct: true, img: "macro" },
      { text: "Bandes fibreuses épaisses", correct: true, img: "macro" },
      { text: "Cellules de Reed-Sternberg binucléées", correct: true, img: "histo" },
      { text: "Inclusions éosinophiles 'œil de hibou'", correct: true, img: "histo" },
      { text: "Fond polymorphe (lymphocytes, éosinophiles)", correct: true, img: "histo" },
      { text: "CD30+ / CD15+ / CD45−", correct: true, img: "ihc" },
      { text: "Architecture ganglionnaire conservée", correct: false, img: "macro" },
      { text: "Prolifération monomorphe de grandes cellules B", correct: false, img: "histo" },
    ],
    choices: [
      { id: "a", text: "Lymphome B diffus à grandes cellules (LBDGC)", correct: false },
      { id: "b", text: "Lymphome de Hodgkin classique, sclérose nodulaire", correct: true },
      { id: "c", text: "Lymphome T anaplasique ALK+", correct: false },
      { id: "d", text: "Hyperplasie réactionnelle bénigne", correct: false },
    ],
    diagnosis: "Lymphome de Hodgkin classique — Sclérose nodulaire",
    pronostic: "Bon (> 85% guérison)", pronosticColor: "#3b82f6",
    explanation: "Les cellules de Reed-Sternberg (CD30+/CD15+/CD45−/PAX5 faible) sont pathognomoniques. La sclérose nodulaire (60-80% des LH) se caractérise par des bandes de fibrose délimitant des nodules et des cellules lacunaires. Le profil clinique (jeune adulte, syndrome B) est typique. Le CD45− élimine un lymphome non-Hodgkinien."
  },
  {
    id: 3, organ: "Thyroïde", icon: "🦋",
    title: "Nodule thyroïdien froid — Femme 41 ans",
    clinique: "Femme, 41 ans. Nodule froid de 1,8 cm, hypoéchogène, microcalcifications à l'écho. Bethesda V à la cytoponction.",
    macroType: "thyroid", histoType: "thyroid",
    ihc: [
      { m: "CK19", r: "+++", pos: true }, { m: "Galect-3", r: "+++", pos: true },
      { m: "HBME-1", r: "++", pos: true }, { m: "TTF-1", r: "+++", pos: true },
      { m: "Calcito.", r: "−", pos: false },
    ],
    criteria: [
      { text: "Nodule encapsulé — capsule épaisse irrégulière", correct: true, img: "macro" },
      { text: "Invasion capsulaire focale", correct: true, img: "macro" },
      { text: "Aspect blanchâtre (vs brun = bénin)", correct: true, img: "macro" },
      { text: "Microcalcifications macroscopiques", correct: true, img: "macro" },
      { text: "Noyaux clairs 'verre dépoli'", correct: true, img: "histo" },
      { text: "Incisures et inclusions nucléaires", correct: true, img: "histo" },
      { text: "Corps psammomateux", correct: true, img: "histo" },
      { text: "CK19+ / Galectine-3+ / HBME-1+", correct: true, img: "ihc" },
      { text: "Colloïde dense abondant", correct: false, img: "histo" },
      { text: "Capsule fine et régulière", correct: false, img: "macro" },
    ],
    choices: [
      { id: "a", text: "Adénome folliculaire bénin", correct: false },
      { id: "b", text: "Carcinome vésiculaire (folliculaire)", correct: false },
      { id: "c", text: "Carcinome papillaire, variante folliculaire", correct: true },
      { id: "d", text: "Carcinome médullaire de la thyroïde", correct: false },
    ],
    diagnosis: "Carcinome papillaire de la thyroïde — Variante folliculaire",
    pronostic: "Excellent (> 95% survie à 10 ans)", pronosticColor: "#22c55e",
    explanation: "Les noyaux papillaires (clairs, incisures, inclusions) sont diagnostiques indépendamment de l'architecture. L'invasion capsulaire exclut l'adénome. Le panel IHC (CK19+++, Galectine-3+++, HBME-1++) confirme. Sans noyaux papillaires, l'invasion capsulaire seule orienterait vers un carcinome vésiculaire. La calcitonine négative écarte le carcinome médullaire."
  }
];

const STAGES = ["clinique", "macro", "histo", "ihc", "criteres", "diagnostic", "correction"];
const STAGE_META = {
  clinique:    { label: "Clinique",     color: "#4f8ef7", icon: "📋" },
  macro:       { label: "Macroscopie", color: "#f59e0b", icon: "🔪" },
  histo:       { label: "Histologie",  color: "#a78bfa", icon: "🔬" },
  ihc:         { label: "IHC",         color: "#3ecf8e", icon: "🧫" },
  criteres:    { label: "Critères",    color: "#f97316", icon: "📋" },
  diagnostic:  { label: "Diagnostic",  color: "#ec4899", icon: "🎯" },
  correction:  { label: "Correction",  color: "#22c55e", icon: "✅" },
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────
export default function AnapathAnnotator() {
  const [caseIdx, setCaseIdx] = useState(0);
  const [stage, setStage] = useState("clinique");
  const [macroMode, setMacroMode] = useState("view");
  const [histoMode, setHistoMode] = useState("view");
  const [showMacroExpert, setShowMacroExpert] = useState(false);
  const [showHistoExpert, setShowHistoExpert] = useState(false);
  const [macroAnnotations, setMacroAnnotations] = useState([]);
  const [histoAnnotations, setHistoAnnotations] = useState([]);
  const [checkedCriteria, setCheckedCriteria] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [totalCriteria, setTotalCriteria] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const cas = CASES[caseIdx];
  const stageIdx = STAGES.indexOf(stage);

  function goNext() {
    const next = STAGES[stageIdx + 1];
    if (next) setStage(next);
  }

  function handleAnswer(ch) {
    if (selectedAnswer) return;
    setSelectedAnswer(ch.id);
    const correct = ch.correct;
    const cs = checkedCriteria.filter(i => cas.criteria[i]?.correct).length
             - checkedCriteria.filter(i => !cas.criteria[i]?.correct).length;
    if (correct) setScore(s => s + 1);
    setTotalCriteria(t => t + Math.max(0, cs));
    setStage("correction");
  }

  function nextCase() {
    setDoneCount(d => d + 1);
    if (caseIdx < CASES.length - 1) {
      setCaseIdx(c => c + 1);
      setStage("clinique");
      setMacroMode("view"); setHistoMode("view");
      setShowMacroExpert(false); setShowHistoExpert(false);
      setMacroAnnotations([]); setHistoAnnotations([]);
      setCheckedCriteria([]); setSelectedAnswer(null);
    } else {
      setGameOver(true);
    }
  }

  // Game Over
  if (gameOver) return (
    <div style={A.root}>
      <div style={A.goWrap}>
        <div style={{ fontSize: 60, marginBottom: 12 }}>🏆</div>
        <h1 style={A.goTitle}>Session terminée</h1>
        <div style={A.goCards}>
          <div style={A.goCard}><div style={{ ...A.goNum, color: "#f7c948" }}>{score}/{CASES.length}</div><div style={A.goCardLabel}>Diagnostics</div></div>
          <div style={A.goCard}><div style={{ ...A.goNum, color: "#3ecf8e" }}>{totalCriteria}</div><div style={A.goCardLabel}>Points critères</div></div>
          <div style={A.goCard}><div style={{ ...A.goNum, color: "#a78bfa" }}>{macroAnnotations.length + histoAnnotations.length}</div><div style={A.goCardLabel}>Annotations</div></div>
        </div>
        <p style={A.goMsg}>{score === CASES.length ? "Excellent ! Maîtrise parfaite." : "Continuez à pratiquer l'analyse morphologique."}</p>
        <button style={A.restartBtn} onClick={() => { setCaseIdx(0); setStage("clinique"); setScore(0); setTotalCriteria(0); setDoneCount(0); setMacroAnnotations([]); setHistoAnnotations([]); setCheckedCriteria([]); setSelectedAnswer(null); setGameOver(false); }}>Recommencer</button>
      </div>
    </div>
  );

  const macroScene = MACRO_SCENES[cas.macroType];
  const histoScene = HISTO_SCENES[cas.histoType];

  return (
    <div style={A.root}>
      {/* TOP BAR */}
      <div style={A.topBar}>
        <div style={A.brand}>
          <span style={A.brandHex}>⬡</span>
          <div>
            <div style={A.brandName}>AnaPath <span style={{ color: "#f59e0b" }}>Annotator</span></div>
            <div style={A.brandSub}>Pathologie tumorale · Annotation interactive</div>
          </div>
        </div>
        <div style={A.pills}>
          <span style={A.pillYellow}>🎯 {score}/{doneCount}</span>
          <span style={A.pillGreen}>⭐ {totalCriteria} pts</span>
          <span style={A.pillPurple}>{cas.icon} Cas {caseIdx + 1}/{CASES.length}</span>
        </div>
      </div>

      {/* PROGRESS */}
      <div style={A.progBar}>
        {STAGES.map((st, i) => {
          const m = STAGE_META[st];
          const done = i < stageIdx, active = i === stageIdx;
          return (
            <div key={st} style={A.progItem}>
              <div style={{ ...A.progDot, background: done ? "#3ecf8e" : active ? m.color : "#1e1e30", boxShadow: active ? `0 0 12px ${m.color}` : "none" }}>
                {done ? "✓" : m.icon}
              </div>
              <span style={{ ...A.progLabel, color: done ? "#3ecf8e" : active ? m.color : "#333" }}>{m.label}</span>
            </div>
          );
        })}
      </div>

      {/* CONTENT */}
      <div style={A.content}>
        <div style={A.cardHeader}>
          <span style={{ ...A.stageBadge, background: STAGE_META[stage].color }}>{STAGE_META[stage].icon} {STAGE_META[stage].label}</span>
          <span style={A.caseTitle}>{cas.title}</span>
        </div>

        {/* ── CLINIQUE ── */}
        {stage === "clinique" && (
          <div style={A.body}>
            <div style={A.cliniqueBlock}>
              <div style={A.cliniqueIcon}>{cas.icon}</div>
              <div>
                <div style={A.sectionTag}>Présentation clinique</div>
                <p style={A.cliniqueText}>{cas.clinique}</p>
              </div>
            </div>
            <button style={{ ...A.nextBtn, background: STAGE_META["macro"].color }} onClick={goNext}>
              🔪 Examiner la macroscopie →
            </button>
          </div>
        )}

        {/* ── MACROSCOPIE ── */}
        {stage === "macro" && (
          <div style={A.body}>
            <div style={A.imageToolbar}>
              <span style={A.imageToolbarTitle}>🔪 Macroscopie</span>
              <div style={A.toolGroup}>
                <button style={{ ...A.toolBtn, border: `1px solid ${macroMode === "view" ? "#4f8ef7" : "#2a2a3a"}`, color: macroMode === "view" ? "#4f8ef7" : "#666" }}
                  onClick={() => setMacroMode("view")}>👁 Observer</button>
                <button style={{ ...A.toolBtn, border: `1px solid ${macroMode === "annotate" ? "#f59e0b" : "#2a2a3a"}`, color: macroMode === "annotate" ? "#f59e0b" : "#666" }}
                  onClick={() => setMacroMode("annotate")}>✎ Annoter</button>
                <button style={{ ...A.toolBtn, border: `1px solid ${showMacroExpert ? "#ef4444" : "#2a2a3a"}`, color: showMacroExpert ? "#ef4444" : "#666" }}
                  onClick={() => setShowMacroExpert(x => !x)}>🧑‍⚕️ Expert</button>
              </div>
            </div>

            {macroMode === "annotate" && (
              <div style={A.annotHint}>
                <span style={{ color: "#f59e0b" }}>✎</span> Cliquez sur l'image pour placer une annotation — Choisissez la catégorie et décrivez le critère observé
              </div>
            )}

            <AnnotableImage
              scene={macroScene}
              userAnnotations={macroAnnotations}
              onAddAnnotation={ann => setMacroAnnotations(a => [...a, ann])}
              showExpert={showMacroExpert}
              mode={macroMode}
            />

            {/* User annotation list */}
            {macroAnnotations.length > 0 && (
              <div style={A.annList}>
                <div style={A.annListTitle}>Vos annotations ({macroAnnotations.length})</div>
                {macroAnnotations.map((ann, i) => {
                  const cat = ANNOTATION_CATEGORIES.find(c => c.id === ann.category);
                  return (
                    <div key={i} style={{ ...A.annItem, borderLeft: `3px solid ${ann.color}` }}>
                      <span style={{ color: ann.color, fontSize: 11, fontWeight: 700 }}>{i + 1}. {cat?.icon} {cat?.label}</span>
                      <span style={A.annLabel}>{ann.label}</span>
                      <button style={A.annDel} onClick={() => setMacroAnnotations(a => a.filter((_, j) => j !== i))}>✕</button>
                    </div>
                  );
                })}
              </div>
            )}

            <button style={{ ...A.nextBtn, background: STAGE_META["histo"].color, marginTop: 16 }} onClick={goNext}>
              🔬 Examiner l'histologie →
            </button>
          </div>
        )}

        {/* ── HISTOLOGIE ── */}
        {stage === "histo" && (
          <div style={A.body}>
            <div style={A.imageToolbar}>
              <span style={A.imageToolbarTitle}>🔬 Histologie (HES)</span>
              <div style={A.toolGroup}>
                <button style={{ ...A.toolBtn, border: `1px solid ${histoMode === "view" ? "#4f8ef7" : "#2a2a3a"}`, color: histoMode === "view" ? "#4f8ef7" : "#666" }}
                  onClick={() => setHistoMode("view")}>👁 Observer</button>
                <button style={{ ...A.toolBtn, border: `1px solid ${histoMode === "annotate" ? "#f59e0b" : "#2a2a3a"}`, color: histoMode === "annotate" ? "#f59e0b" : "#666" }}
                  onClick={() => setHistoMode("annotate")}>✎ Annoter</button>
                <button style={{ ...A.toolBtn, border: `1px solid ${showHistoExpert ? "#ef4444" : "#2a2a3a"}`, color: showHistoExpert ? "#ef4444" : "#666" }}
                  onClick={() => setShowHistoExpert(x => !x)}>🧑‍⚕️ Expert</button>
              </div>
            </div>

            {histoMode === "annotate" && (
              <div style={A.annotHint}>
                <span style={{ color: "#f59e0b" }}>✎</span> Cliquez sur la lame pour identifier les critères diagnostiques
              </div>
            )}

            <AnnotableImage
              scene={histoScene}
              userAnnotations={histoAnnotations}
              onAddAnnotation={ann => setHistoAnnotations(a => [...a, ann])}
              showExpert={showHistoExpert}
              mode={histoMode}
            />

            {histoAnnotations.length > 0 && (
              <div style={A.annList}>
                <div style={A.annListTitle}>Vos annotations ({histoAnnotations.length})</div>
                {histoAnnotations.map((ann, i) => {
                  const cat = ANNOTATION_CATEGORIES.find(c => c.id === ann.category);
                  return (
                    <div key={i} style={{ ...A.annItem, borderLeft: `3px solid ${ann.color}` }}>
                      <span style={{ color: ann.color, fontSize: 11, fontWeight: 700 }}>{i + 1}. {cat?.icon} {cat?.label}</span>
                      <span style={A.annLabel}>{ann.label}</span>
                      <button style={A.annDel} onClick={() => setHistoAnnotations(a => a.filter((_, j) => j !== i))}>✕</button>
                    </div>
                  );
                })}
              </div>
            )}

            <button style={{ ...A.nextBtn, background: STAGE_META["ihc"].color, marginTop: 16 }} onClick={goNext}>
              🧫 Voir l'IHC →
            </button>
          </div>
        )}

        {/* ── IHC ── */}
        {stage === "ihc" && (
          <div style={A.body}>
            <div style={A.ihcGrid}>
              {cas.ihc.map((m, i) => (
                <div key={i} style={{ ...A.ihcCard, borderColor: m.pos ? "#1e3a20" : "#2a1a1a" }}>
                  <div style={A.ihcMarker}>{m.m}</div>
                  <div style={{ ...A.ihcResult, color: m.pos ? "#3ecf8e" : "#ef4444" }}>{m.r}</div>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: m.pos ? "#22c55e" : "#ef4444", margin: "0 auto" }} />
                </div>
              ))}
            </div>
            <button style={{ ...A.nextBtn, background: STAGE_META["criteres"].color }} onClick={goNext}>
              📋 Relever les critères →
            </button>
          </div>
        )}

        {/* ── CRITÈRES ── */}
        {stage === "criteres" && (
          <div style={A.body}>
            <div style={A.criteriaHeader}>
              <div style={A.criteriaTitle}>📋 Cochez les critères en faveur de la malignité</div>
              <div style={A.criteriaSubtitle}>Basez-vous sur vos observations macro, histo et IHC</div>
            </div>
            <div style={A.criteriaList}>
              {cas.criteria.map((c, i) => {
                const checked = checkedCriteria.includes(i);
                const srcColor = c.img === "macro" ? "#f59e0b" : c.img === "histo" ? "#a78bfa" : "#3ecf8e";
                return (
                  <div key={i} onClick={() => setCheckedCriteria(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])}
                    style={{ ...A.criterionRow, background: checked ? "#0f2010" : "#0a0a18", border: `1px solid ${checked ? "#22c55e" : "#1e1e2e"}`, cursor: "pointer" }}>
                    <div style={{ ...A.checkBox, background: checked ? "#22c55e" : "transparent", border: `2px solid ${checked ? "#22c55e" : "#444"}` }}>
                      {checked && "✓"}
                    </div>
                    <span style={{ ...A.criterionText, color: checked ? "#ddd" : "#666" }}>{c.text}</span>
                    <span style={{ ...A.srcTag, color: srcColor, borderColor: srcColor }}>{c.img.toUpperCase()}</span>
                  </div>
                );
              })}
            </div>
            <button style={{ ...A.nextBtn, background: STAGE_META["diagnostic"].color, marginTop: 16 }} onClick={goNext}>
              🎯 Formuler le diagnostic ({checkedCriteria.length} critère{checkedCriteria.length > 1 ? "s" : ""}) →
            </button>
          </div>
        )}

        {/* ── DIAGNOSTIC ── */}
        {stage === "diagnostic" && (
          <div style={A.body}>
            <div style={A.diagPrompt}>Quel est votre diagnostic ?</div>
            <div style={A.choicesGrid}>
              {cas.choices.map(ch => (
                <button key={ch.id} onClick={() => handleAnswer(ch)} style={A.choiceBtn}>
                  <span style={A.choiceLetter}>{ch.id.toUpperCase()}</span>
                  <span style={{ fontSize: 14, color: "#ccc", lineHeight: 1.5 }}>{ch.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── CORRECTION ── */}
        {stage === "correction" && (
          <div style={A.body}>
            {/* Verdict */}
            <div style={{ ...A.verdict, borderColor: cas.choices.find(c => c.id === selectedAnswer)?.correct ? "#22c55e" : "#ef4444", background: cas.choices.find(c => c.id === selectedAnswer)?.correct ? "#061410" : "#140606" }}>
              <div style={{ fontSize: 26, marginBottom: 6 }}>
                {cas.choices.find(c => c.id === selectedAnswer)?.correct ? "✅ Correct !" : "❌ Incorrect"}
              </div>
              <div style={{ fontSize: 15, color: "#ddd", marginBottom: 6 }}>{cas.diagnosis}</div>
              <div style={{ fontSize: 13, color: cas.pronosticColor, fontStyle: "italic" }}>Pronostic : {cas.pronostic}</div>
            </div>

            {/* Critères révélés */}
            <div style={A.criteriaList}>
              <div style={{ ...A.criteriaTitle, marginBottom: 10 }}>📋 Correction des critères</div>
              {cas.criteria.map((c, i) => {
                const checked = checkedCriteria.includes(i);
                const srcColor = c.img === "macro" ? "#f59e0b" : c.img === "histo" ? "#a78bfa" : "#3ecf8e";
                return (
                  <div key={i} style={{
                    ...A.criterionRow,
                    background: c.correct ? "#081808" : "#0a0808",
                    border: `1px solid ${c.correct ? "#22c55e44" : "#ef444422"}`,
                    opacity: !c.correct && !checked ? 0.5 : 1,
                  }}>
                    <div style={{ ...A.checkBox, background: c.correct ? "#22c55e" : "#ef4444", border: "none", color: "#fff", fontSize: 13 }}>
                      {c.correct ? "✓" : "✗"}
                    </div>
                    <span style={{ ...A.criterionText, color: c.correct ? "#ccc" : "#888" }}>{c.text}</span>
                    <div style={{ display: "flex", gap: 6, marginLeft: "auto", alignItems: "center" }}>
                      {checked && c.correct && <span style={{ color: "#22c55e", fontSize: 11, fontWeight: 700 }}>+1</span>}
                      {checked && !c.correct && <span style={{ color: "#ef4444", fontSize: 11 }}>−1</span>}
                      <span style={{ ...A.srcTag, color: srcColor, borderColor: srcColor }}>{c.img.toUpperCase()}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Annotation comparison */}
            <div style={A.annCompare}>
              <div style={A.annCompareTitle}>🏷 Vos annotations vs expert</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <div style={A.annCompareSubtitle}>🔪 Macro — Vos annotations ({macroAnnotations.length})</div>
                  {macroAnnotations.length === 0 ? <div style={A.annNone}>Aucune annotation</div> :
                    macroAnnotations.map((a, i) => <div key={i} style={{ ...A.annChip, borderLeftColor: a.color }}>{a.label}</div>)}
                </div>
                <div>
                  <div style={A.annCompareSubtitle}>🔬 Histo — Vos annotations ({histoAnnotations.length})</div>
                  {histoAnnotations.length === 0 ? <div style={A.annNone}>Aucune annotation</div> :
                    histoAnnotations.map((a, i) => <div key={i} style={{ ...A.annChip, borderLeftColor: a.color }}>{a.label}</div>)}
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div style={A.explainBox}>
              <div style={A.explainTitle}>📖 Commentaire diagnostique</div>
              <p style={A.explainText}>{cas.explanation}</p>
            </div>

            <button style={{ ...A.nextBtn, background: "#4f8ef7", marginTop: 16 }} onClick={nextCase}>
              {caseIdx < CASES.length - 1 ? `Cas suivant : ${CASES[caseIdx + 1].organ} →` : "Voir mes résultats →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────
const A = {
  root: { minHeight: "100vh", background: "#080812", color: "#e0e0ee", fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', serif" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 22px", background: "#0c0c1c", borderBottom: "1px solid #181828" },
  brand: { display: "flex", alignItems: "center", gap: 12 },
  brandHex: { fontSize: 26, color: "#f59e0b" },
  brandName: { fontSize: 17, fontWeight: 700, color: "#fff" },
  brandSub: { fontSize: 10, color: "#555", letterSpacing: 0.8 },
  pills: { display: "flex", gap: 8 },
  pillYellow: { background: "#181408", color: "#f7c948", border: "1px solid #2a2010", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontFamily: "monospace" },
  pillGreen: { background: "#081408", color: "#3ecf8e", border: "1px solid #103020", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontFamily: "monospace" },
  pillPurple: { background: "#100c20", color: "#a78bfa", border: "1px solid #201838", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontFamily: "monospace" },
  progBar: { display: "flex", padding: "12px 22px", background: "#0a0a18", borderBottom: "1px solid #141424", gap: 2 },
  progItem: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 },
  progDot: { width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", transition: "all 0.3s" },
  progLabel: { fontSize: 9, letterSpacing: 0.5, textTransform: "uppercase", transition: "color 0.3s" },
  content: { maxWidth: 720, margin: "0 auto", padding: "20px 18px 40px" },
  cardHeader: { display: "flex", alignItems: "center", gap: 12, marginBottom: 18, flexWrap: "wrap" },
  stageBadge: { padding: "4px 14px", borderRadius: 20, fontSize: 11, fontWeight: 800, color: "#000", letterSpacing: 0.8, textTransform: "uppercase" },
  caseTitle: { fontSize: 15, color: "#aaa", fontStyle: "italic" },
  body: {},
  cliniqueBlock: { display: "flex", gap: 16, background: "#0e0e20", border: "1px solid #1a1a30", borderRadius: 12, padding: "18px", marginBottom: 16 },
  cliniqueIcon: { fontSize: 38, flexShrink: 0 },
  sectionTag: { fontSize: 10, color: "#4f8ef7", letterSpacing: 1, textTransform: "uppercase", marginBottom: 7 },
  cliniqueText: { fontSize: 14, lineHeight: 1.8, color: "#ccc" },
  nextBtn: { width: "100%", padding: "13px", borderRadius: 10, border: "none", color: "#000", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "Palatino, serif", letterSpacing: 0.3 },
  imageToolbar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  imageToolbarTitle: { fontSize: 13, color: "#aaa", fontWeight: 600 },
  toolGroup: { display: "flex", gap: 6 },
  toolBtn: { background: "#0f0f1e", padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 600, color: "#666", transition: "all 0.15s", fontFamily: "inherit" },
  annotHint: { background: "#0f0a00", border: "1px solid #2a1e00", borderRadius: 8, padding: "8px 14px", fontSize: 12, color: "#a07030", marginBottom: 10 },
  annList: { background: "#0a0a18", border: "1px solid #1a1a28", borderRadius: 10, padding: "12px", marginTop: 12 },
  annListTitle: { fontSize: 11, color: "#666", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 },
  annItem: { display: "flex", alignItems: "center", gap: 10, padding: "7px 10px", background: "#0e0e1e", borderRadius: 7, marginBottom: 6 },
  annLabel: { fontSize: 12, color: "#bbb", flex: 1 },
  annDel: { background: "none", border: "none", color: "#444", cursor: "pointer", fontSize: 13, padding: "0 4px" },
  annCompare: { background: "#080818", border: "1px solid #181828", borderRadius: 10, padding: "14px", marginBottom: 16 },
  annCompareTitle: { fontSize: 11, color: "#666", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 },
  annCompareSubtitle: { fontSize: 12, color: "#888", marginBottom: 8 },
  annChip: { borderLeft: "3px solid", padding: "5px 10px", background: "#0e0e1e", borderRadius: "0 6px 6px 0", fontSize: 11, color: "#bbb", marginBottom: 5 },
  annNone: { fontSize: 12, color: "#444", fontStyle: "italic" },
  ihcGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 10, marginBottom: 20 },
  ihcCard: { background: "#0a0a18", border: "1px solid", borderRadius: 10, padding: "14px 10px", textAlign: "center" },
  ihcMarker: { fontSize: 12, fontWeight: 700, color: "#888", fontFamily: "monospace", marginBottom: 6 },
  ihcResult: { fontSize: 20, fontWeight: 800, fontFamily: "monospace", marginBottom: 6 },
  criteriaHeader: { marginBottom: 14 },
  criteriaTitle: { fontSize: 13, fontWeight: 700, color: "#ccc", letterSpacing: 0.5 },
  criteriaSubtitle: { fontSize: 11, color: "#555", marginTop: 4 },
  criteriaList: { display: "grid", gap: 7 },
  criterionRow: { display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 8, transition: "all 0.15s" },
  checkBox: { width: 20, height: 20, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0, transition: "all 0.15s" },
  criterionText: { fontSize: 13, lineHeight: 1.4, flex: 1, transition: "color 0.15s" },
  srcTag: { fontSize: 9, fontWeight: 700, border: "1px solid", padding: "1px 6px", borderRadius: 4, flexShrink: 0 },
  diagPrompt: { fontSize: 16, color: "#ddd", marginBottom: 14, fontStyle: "italic" },
  choicesGrid: { display: "grid", gap: 10 },
  choiceBtn: { display: "flex", alignItems: "center", gap: 14, padding: "13px 18px", background: "#0c0c1e", border: "1px solid #1e1e30", borderRadius: 10, cursor: "pointer", textAlign: "left" },
  choiceLetter: { width: 32, height: 32, borderRadius: "50%", background: "#181830", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#a78bfa", fontSize: 13, flexShrink: 0 },
  verdict: { border: "1px solid", borderRadius: 12, padding: "18px", textAlign: "center", marginBottom: 18 },
  explainBox: { background: "#06060e", border: "1px solid #141428", borderRadius: 10, padding: "16px 18px", marginTop: 16 },
  explainTitle: { fontSize: 11, color: "#a78bfa", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 },
  explainText: { fontSize: 13, lineHeight: 1.9, color: "#aaa" },
  goWrap: { maxWidth: 440, margin: "60px auto", background: "#0e0e1e", border: "1px solid #1e1e2e", borderRadius: 20, padding: "44px 36px", textAlign: "center" },
  goTitle: { fontSize: 22, color: "#fff", marginBottom: 22 },
  goCards: { display: "flex", gap: 14, justifyContent: "center", marginBottom: 22 },
  goCard: { background: "#080818", border: "1px solid #1a1a28", borderRadius: 12, padding: "18px 24px" },
  goNum: { fontSize: 36, fontWeight: 800 },
  goCardLabel: { fontSize: 11, color: "#555", marginTop: 4 },
  goMsg: { color: "#888", fontSize: 14, lineHeight: 1.7, marginBottom: 24 },
  restartBtn: { background: "#4f8ef7", color: "#fff", border: "none", borderRadius: 10, padding: "12px 30px", fontSize: 14, cursor: "pointer", fontWeight: 800 },
};
