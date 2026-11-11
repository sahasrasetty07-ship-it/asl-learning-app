import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  RotateCcw,
  Check,
  Sparkles,
  Eye,
  EyeOff,
  Volume2,
  PenTool,
  Eraser,
  Award,
  Video,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Layers,
  BookOpen,
  Pencil
} from 'lucide-react';

const CELL = 8; // grid cell size in CSS px used for scoring

// Marks a grid cell "on" if any pixel inside it is drawn (alpha > 0).
const toGrid = (img, scale, cols, rows) => {
  const grid = new Uint8Array(cols * rows);
  const step = CELL * scale;
  for (let y = 0; y < img.height; y += 2) {
    for (let x = 0; x < img.width; x += 2) {
      if (img.data[(y * img.width + x) * 4 + 3] > 0) {
        grid[Math.floor(y / step) * cols + Math.floor(x / step)] = 1;
      }
    }
  }
  return grid;
};

// Score 0-100: geometric mean of precision (ink that lies on the letter)
// and coverage (letter that got inked), with a 2-cell tolerance for both.
export const scoreGrids = (ink, target, cols, rows, tol = 2) => {
  const near = (grid, i) => {
    const cx = i % cols, cy = Math.floor(i / cols);
    for (let dy = -tol; dy <= tol; dy++) {
      for (let dx = -tol; dx <= tol; dx++) {
        const x = cx + dx, y = cy + dy;
        if (x >= 0 && y >= 0 && x < cols && y < rows && grid[y * cols + x]) return true;
      }
    }
    return false;
  };
  let inkCount = 0, inkOnLetter = 0, targetCount = 0, targetCovered = 0;
  for (let i = 0; i < ink.length; i++) {
    if (ink[i]) { inkCount++; if (near(target, i)) inkOnLetter++; }
    if (target[i]) { targetCount++; if (near(ink, i)) targetCovered++; }
  }
  if (!inkCount || !targetCount) return 0;
  return Math.round(100 * Math.sqrt((inkOnLetter / inkCount) * (targetCovered / targetCount)));
};

// Computes appropriate font size based on text length and canvas dimensions
export const getGuideFontSize = (rectWidth, rectHeight, text) => {
  if (!text) return 120;
  const len = text.length;
  let baseSize;
  if (len <= 1) {
    baseSize = Math.min(rectHeight * 0.68, 175);
  } else if (len === 2) {
    baseSize = Math.min(rectHeight * 0.60, 135);
  } else if (len <= 4) {
    baseSize = Math.min(rectHeight * 0.45, 90);
  } else if (len <= 7) {
    baseSize = Math.min(rectHeight * 0.38, 65);
  } else {
    // Longer words like પ્રકાશસંશ્લેષણ or સૂર્યમંડળ
    baseSize = Math.min(rectHeight * 0.28, 48);
  }
  return Math.max(22, Math.round(baseSize));
};

// Dynamically adjusts font size so text never clips off canvas boundaries
export const computeGuideFont = (ctx, rectWidth, rectHeight, scale, text) => {
  let fontSize = getGuideFontSize(rectWidth, rectHeight, text);
  const maxWidth = (rectWidth - 40) * scale;
  const fontFam = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans Gujarati", "Gujarati Sangam MN", sans-serif';

  ctx.font = `bold ${fontSize * scale}px ${fontFam}`;
  let textWidth = ctx.measureText(text).width;

  if (textWidth > maxWidth && textWidth > 0) {
    fontSize = Math.floor(fontSize * (maxWidth / textWidth));
    fontSize = Math.max(20, fontSize);
    ctx.font = `bold ${fontSize * scale}px ${fontFam}`;
  }

  return { fontSize, font: `bold ${fontSize * scale}px ${fontFam}` };
};

// ─────────────────────────────────────────────────────────────────────────────
// WritingPad Component
// ─────────────────────────────────────────────────────────────────────────────
export const WritingPad = ({
  targetLetter = 'ક',
  targetWord = 'કમળ',
  letterMeaning = '',
  onSignClick = null,
  subject = 'gujarati',
  // Phase 2 navigation props (optional — omit in ScienceModule to disable nav UI)
  currentIndex = null,
  totalItems = null,
  onPrevious = null,
  onNext = null,
  hasPrevious = false,
  hasNext = false,
  traceGuide = ''
}) => {
  const { speakText, recordExerciseAttempt, showToast, uiLanguage } = useApp();
  const isEn = uiLanguage === 'en';

  const canvasRef = useRef(null);
  const guideCanvasRef = useRef(null);

  // ── Drawing state ──────────────────────────────────────────────────────────
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const [penColor, setPenColor] = useState('#1e293b');
  const [penWidth, setPenWidth] = useState(6);
  const [isEraser, setIsEraser] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);
  const [history, setHistory] = useState([]);

  // ── Phase 2 state ──────────────────────────────────────────────────────────
  // 'guided'   → shows the watermark tracing reference
  // 'freehand' → hides the reference (memory / independent writing practice)
  const [practiceMode, setPracticeMode] = useState('guided');
  const [showRuling, setShowRuling] = useState(true);
  const [showStrokePanel, setShowStrokePanel] = useState(false);
  // Placeholder demo state — no real stroke paths yet, so buttons are disabled
  const [demoPlaying, setDemoPlaying] = useState(false);

  const showGuide = practiceMode === 'guided';

  // ── Guide watermark rendering ──────────────────────────────────────────────
  const drawGuide = (targetCanvas, letter, isEvaluation = false) => {
    if (!targetCanvas) return;
    const ctx = targetCanvas.getContext('2d');
    const rect = targetCanvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const scale = 2; // Retina scale
    targetCanvas.width = rect.width * scale;
    targetCanvas.height = rect.height * scale;

    ctx.save();
    ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);

    const { font } = computeGuideFont(ctx, rect.width, rect.height, scale, letter);
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isEvaluation ? '#000000' : 'rgba(71, 85, 105, 0.22)';
    ctx.fillText(letter, targetCanvas.width / 2, targetCanvas.height / 2);
    ctx.restore();
  };

  // ── Initialise / reset canvas when targetLetter changes ───────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0) return;

    const scale = 2;
    canvas.width = rect.width * scale;
    canvas.height = rect.height * scale;

    const ctx = canvas.getContext('2d');
    ctx.setTransform(scale, 0, 0, scale, 0, 0);

    if (guideCanvasRef.current) {
      drawGuide(guideCanvasRef.current, targetLetter, false);
    }

    clearCanvas(false);
    setScoreResult(null);
    setShowStrokePanel(false);
    setDemoPlaying(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetLetter]);

  useEffect(() => {
    const handleResize = () => {
      if (guideCanvasRef.current) {
        drawGuide(guideCanvasRef.current, targetLetter, false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetLetter]);

  // ── Canvas helpers ─────────────────────────────────────────────────────────
  const clearCanvas = (resetScore = true) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    setStrokeCount(0);
    setHistory([]);
    if (resetScore) setScoreResult(null);
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    setHistory(prev => [...prev, ctx.getImageData(0, 0, canvas.width, canvas.height)]);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = penWidth;
    ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
    ctx.strokeStyle = penColor;

    setIsDrawing(true);
    setStrokeCount(prev => prev + 1);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.closePath();
    setIsDrawing(false);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const lastState = history[history.length - 1];
    ctx.putImageData(lastState, 0, 0);
    setHistory(prev => prev.slice(0, -1));
  };

  // ── Evaluation ─────────────────────────────────────────────────────────────
  const evaluateWriting = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (strokeCount === 0) {
      showToast(isEn ? 'Please try drawing the character on the canvas first!' : 'કૃપા કરીને પેડ પર અક્ષર લખવાનો પ્રયત્ન કરો!', 'info');
      return;
    }

    const scale = canvas.width / canvas.getBoundingClientRect().width;
    const cols = Math.ceil(canvas.width / (CELL * scale));
    const rows = Math.ceil(canvas.height / (CELL * scale));

    const inkImageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    const ink = toGrid(inkImageData, scale, cols, rows);

    // Ink detection: count number of drawn ink grid cells
    let inkCellCount = 0;
    for (let i = 0; i < ink.length; i++) {
      if (ink[i]) inkCellCount++;
    }

    // Require actual ink drawn (at least 6 cells of coverage)
    if (inkCellCount < 6) {
      showToast(isEn ? 'Please write or trace the character on the canvas first!' : 'કૃપા કરીને પેડ પર અક્ષર લખવાનો પ્રયત્ન કરો!', 'info');
      return;
    }

    // Draw the reference letter off-screen, pixel-identical to the on-screen guide
    const ref = document.createElement('canvas');
    ref.width = canvas.width;
    ref.height = canvas.height;
    const rctx = ref.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    const { font } = computeGuideFont(rctx, rect.width, rect.height, scale, targetLetter);
    rctx.font = font;
    rctx.textAlign = 'center';
    rctx.textBaseline = 'middle';
    rctx.fillStyle = '#000000';
    rctx.fillText(targetLetter, ref.width / 2, ref.height / 2);

    const target = toGrid(rctx.getImageData(0, 0, ref.width, ref.height), scale, cols, rows);
    const score = scoreGrids(ink, target, cols, rows);
    const stars = score >= 85 ? 3 : score >= 70 ? 2 : score >= 60 ? 1 : 0;

    const message = stars === 3
      ? (isEn ? 'Excellent! Clear and accurate letter.' : 'અદ્ભુત! સુંદર અને સ્પષ્ટ અક્ષર લેખન!')
      : stars > 0
        ? (isEn ? 'Good try! Follow the guide shape more closely.' : 'સરસ પ્રયાસ! માર્ગદર્શક આકારને વધુ નજીકથી અનુસરો.')
        : (isEn ? 'Not quite. Trace over the grey letter and try again.' : 'હજુ નહીં. ઝાંખા અક્ષર પર ઘૂંટીને ફરી પ્રયત્ન કરો.');

    setScoreResult({ score, message, stars });

    recordExerciseAttempt(subject, stars > 0, `Letter '${targetLetter}' Practice`, stars * 5);
    if (stars > 0) speakText(targetLetter);
  };

  // ── Navigation handlers ────────────────────────────────────────────────────
  const handlePrevious = () => {
    if (hasPrevious && onPrevious) {
      clearCanvas(true);
      onPrevious();
    }
  };

  const handleNext = () => {
    if (hasNext && onNext) {
      clearCanvas(true);
      onNext();
    }
  };

  // ── Stroke-order demo (placeholder) ───────────────────────────────────────
  // No vector stroke-path data exists in the project data files.
  // Set hasStrokeData = true and populate strokePaths[] when coordinate data
  // is curated so the Play/Pause/Replay controls become functional.
  const hasStrokeData = false;

  const handleDemoToggle = () => {
    if (!hasStrokeData) return;
    setDemoPlaying(prev => !prev);
  };

  const handleDemoReplay = () => {
    if (!hasStrokeData) return;
    setDemoPlaying(false);
    setTimeout(() => setDemoPlaying(true), 100);
  };

  // ── Notebook ruling ────────────────────────────────────────────────────────
  // Pure CSS gradient on a div beneath the canvases — never sampled by
  // canvas.getImageData() so it cannot affect drawing or scoring.
  const rulingStyle = showRuling ? {
    backgroundImage: [
      'linear-gradient(90deg, transparent calc(15% - 1px), rgba(239,68,68,0.20) calc(15% - 1px), rgba(239,68,68,0.20) 15%, transparent 15%)',
      'repeating-linear-gradient(180deg, transparent, transparent 31px, rgba(99,179,237,0.30) 31px, rgba(99,179,237,0.30) 32px)'
    ].join(', ')
  } : {};

  // ── Derived flags ──────────────────────────────────────────────────────────
  const hasNavigation = currentIndex !== null && totalItems !== null;
  const displayIndex = currentIndex !== null ? currentIndex + 1 : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-4 flex flex-col gap-3">

      {/* ── Prev / Next Navigation Bar ───────────────────────────────────── */}
      {hasNavigation && (
        <div className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2 border border-slate-200">
          <button
            onClick={handlePrevious}
            disabled={!hasPrevious}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition disabled:opacity-30 disabled:cursor-not-allowed bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 active:scale-95 shadow-sm"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>{isEn ? 'Prev' : 'પહેલા'}</span>
          </button>

          <span className="text-xs font-bold text-slate-600 tabular-nums select-none">
            {displayIndex} / {totalItems}
          </span>

          <button
            onClick={handleNext}
            disabled={!hasNext}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition disabled:opacity-30 disabled:cursor-not-allowed bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 active:scale-95 shadow-sm"
          >
            <span>{isEn ? 'Next' : 'આગળ'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── Target Letter Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-3xl font-extrabold shadow-md">
            {targetLetter}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-800">{targetWord}</h3>
              <button
                onClick={() => speakText(`${targetLetter} એટલે ${targetWord}`)}
                className="p-1 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 transition"
                title={isEn ? 'Listen to Pronunciation' : 'અવાજ સાંભળો'}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              {letterMeaning || (isEn ? 'Tracing & handwriting practice' : 'અક્ષર મહાવરો અને લેખન')}
            </p>
          </div>
        </div>

        {/* ISL Sign Button */}
        {onSignClick && (
          <button
            onClick={onSignClick}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition"
          >
            <Video className="w-4 h-4 text-indigo-600" />
            <span>{isEn ? 'Watch Sign' : 'સાઇન જુઓ'}</span>
          </button>
        )}
      </div>

      {/* ── Practice Mode Switcher ───────────────────────────────────────── */}
      <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1">
        <button
          onClick={() => setPracticeMode('guided')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition ${
            practiceMode === 'guided'
              ? 'bg-white text-amber-700 shadow-sm border border-amber-200'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{isEn ? 'Guided Practice' : 'માર્ગદર્શિત'}</span>
        </button>
        <button
          onClick={() => setPracticeMode('freehand')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition ${
            practiceMode === 'freehand'
              ? 'bg-white text-purple-700 shadow-sm border border-purple-200'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Pencil className="w-3.5 h-3.5" />
          <span>{isEn ? 'Freehand Practice' : 'સ્વતંત્ર'}</span>
        </button>
      </div>

      {/* Freehand mode hint banner */}
      {practiceMode === 'freehand' && (
        <p className="text-[11px] text-purple-700 bg-purple-50 border border-purple-200 rounded-lg px-3 py-1.5 font-medium">
          {isEn
            ? '✏️ Freehand mode: the tracing guide is hidden. Write the character from memory!'
            : '✏️ સ્વતંત્ર મહાવરો: ઝાંખો અક્ષર છુપાવ્યો છે. યાદ રાખીને લખો!'}
        </p>
      )}

      {/* ── Stroke-Order Panel (collapsible) ────────────────────────────── */}
      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <button
          onClick={() => setShowStrokePanel(prev => !prev)}
          className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-50 hover:bg-slate-100 transition text-xs font-bold text-slate-700"
        >
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            {isEn ? 'Stroke Order Guide' : 'સ્ટ્રોક ક્રમ માર્ગદર્શક'}
          </span>
          <span className="text-slate-400 text-[10px] select-none">{showStrokePanel ? '▲' : '▼'}</span>
        </button>

        {showStrokePanel && (
          <div className="bg-white p-3 space-y-3 border-t border-slate-100">
            {/* Verbal tracing tip from data (always available) */}
            {traceGuide ? (
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                <p className="text-[11px] font-bold text-amber-900 mb-0.5">
                  {isEn ? 'Writing Tip:' : 'લેખન સૂચના:'}
                </p>
                <p className="text-xs text-slate-800 leading-relaxed">{traceGuide}</p>
              </div>
            ) : null}

            {/* Animated stroke-order placeholder */}
            <div className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-center space-y-3">
              {/* Play / Pause / Replay controls — present for future extensibility */}
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={handleDemoReplay}
                  disabled={!hasStrokeData}
                  className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 transition"
                  title={isEn ? 'Replay' : 'ફરીથી'}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleDemoToggle}
                  disabled={!hasStrokeData}
                  className="p-2 rounded-lg bg-amber-500 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-amber-400 transition"
                  title={demoPlaying ? (isEn ? 'Pause' : 'રોકો') : (isEn ? 'Play' : 'ચલાવો')}
                >
                  {demoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-snug max-w-xs mx-auto">
                {isEn
                  ? 'Animated stroke-order demonstration is coming soon. Stroke-path coordinates for Gujarati characters are currently being curated.'
                  : 'ગુજરાતી અક્ષરો માટે સ્ટ્રોક-ઓર્ડર એનિમેશન ટૂંક સમયમાં ઉમેરાશે. હાલ ડેટા તૈયાર કરવામાં આવી રહ્યો છે.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Canvas Drawing Area ──────────────────────────────────────────── */}
      <div className="relative w-full h-[240px] sm:h-[280px] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 overflow-hidden">
        {/* Notebook ruling — purely decorative CSS gradient, never sampled by canvas */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none z-0 transition-opacity duration-300"
          style={{ opacity: showRuling ? 1 : 0, ...rulingStyle }}
        />

        {/* Visual Guide Canvas — pixel-aligned with evaluation reference */}
        <canvas
          ref={guideCanvasRef}
          className={`absolute inset-0 w-full h-full pointer-events-none select-none transition-opacity duration-200 z-10 ${
            showGuide ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Interactive User Drawing Canvas */}
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 w-full h-full cursor-crosshair z-20"
        />

        {/* Empty-canvas hint */}
        {strokeCount === 0 && (
          <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none z-30">
            <p className="inline-block text-xs font-medium text-slate-500 bg-white/90 px-3 py-1 rounded-full border border-slate-200 shadow-xs">
              {targetLetter.length > 2
                ? (isEn ? `Practice writing '${targetLetter}' with touch or mouse` : `આંગળી અથવા માઉસ વડે '${targetLetter}' લખો`)
                : (isEn ? `Trace character '${targetLetter}' with touch or mouse` : `આંગળી અથવા માઉસ વડે અક્ષર '${targetLetter}' ઘૂંટો`)}
            </p>
          </div>
        )}
      </div>

      {/* ── Toolbar Controls ──────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setIsEraser(false)}
            className={`p-2 rounded-lg text-xs font-medium transition ${
              !isEraser ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title={isEn ? 'Pen (Write)' : 'પેન'}
          >
            <PenTool className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsEraser(true)}
            className={`p-2 rounded-lg text-xs font-medium transition ${
              isEraser ? 'bg-rose-500 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title={isEn ? 'Eraser' : 'રબર'}
          >
            <Eraser className="w-4 h-4" />
          </button>

          {!isEraser && (
            <div className="flex items-center gap-1 ml-1">
              {['#1e293b', '#2563eb', '#ea580c', '#16a34a'].map(color => (
                <button
                  key={color}
                  onClick={() => setPenColor(color)}
                  className={`w-5 h-5 rounded-full border-2 transition ${
                    penColor === color ? 'border-slate-900 scale-110' : 'border-white'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}

          {/* Notebook Ruling Toggle */}
          <button
            onClick={() => setShowRuling(prev => !prev)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
              showRuling
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-slate-100 border-slate-200 text-slate-500'
            }`}
            title={isEn ? 'Toggle notebook ruling' : 'નોટ-બુક લાઇન'}
          >
            <span className="text-[11px]">{isEn ? (showRuling ? 'Lines On' : 'Lines Off') : (showRuling ? 'રેખા ✓' : 'રેખા')}</span>
          </button>
        </div>

        {/* Clear, Undo, Check Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleUndo}
            disabled={history.length === 0}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-medium transition"
            title={isEn ? 'Undo' : 'પાછળ જાઓ'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => clearCanvas(true)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition"
          >
            {isEn ? 'Clear' : 'સાફ કરો'}
          </button>

          <button
            onClick={evaluateWriting}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>{isEn ? 'Check Writing' : 'તપાસો'}</span>
          </button>
        </div>
      </div>

      {/* ── Score and Feedback Banner ─────────────────────────────────────── */}
      {scoreResult && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow">
              {scoreResult.score}%
            </div>
            <div>
              <div className="flex items-center gap-1">
                {[...Array(scoreResult.stars)].map((_, i) => (
                  <Sparkles key={i} className="w-4 h-4 text-amber-500 fill-amber-400" />
                ))}
                {scoreResult.stars > 0 && (
                  <span className="text-xs font-bold text-emerald-800 ml-1">
                    +{scoreResult.stars * 5} {isEn ? 'Stars!' : 'પોઇન્ટ્સ!'}
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-emerald-900 mt-0.5">{scoreResult.message}</p>
            </div>
          </div>
          <button
            onClick={() => clearCanvas(true)}
            className="text-xs text-emerald-700 font-bold hover:underline"
          >
            {isEn ? 'Try Again' : 'ફરી લખો'}
          </button>
        </div>
      )}
    </div>
  );
};
