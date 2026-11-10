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
  Video
} from 'lucide-react';

export const WritingPad = ({ targetLetter = 'ક', targetWord = 'કમળ', letterMeaning = '', onSignClick = null }) => {
  const { speakText, recordExerciseSuccess, showToast, uiLanguage } = useApp();
  const isEn = uiLanguage === 'en';

  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const [showGuide, setShowGuide] = useState(true);
  const [penColor, setPenColor] = useState('#1e293b');
  const [penWidth, setPenWidth] = useState(6);
  const [isEraser, setIsEraser] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    clearCanvas(false);
  }, [targetLetter]);

  const clearCanvas = (resetScore = true) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    ctx.strokeStyle = isEraser ? '#ffffff' : penColor;

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

  const evaluateWriting = () => {
    if (strokeCount < 3) {
      showToast(isEn ? 'Please try drawing the character on the canvas first!' : 'કૃપા કરીને પેડ પર અક્ષર લખવાનો પ્રયત્ન કરો!', 'info');
      return;
    }

    const simulatedAccuracy = Math.floor(Math.random() * 15) + 85;
    const stars = simulatedAccuracy >= 95 ? 3 : simulatedAccuracy >= 88 ? 2 : 1;
    const messagesEn = [
      'Excellent! Beautiful and clear character writing!',
      'Great job! The character stroke curve is accurate.',
      'Well done! You have mastered this character!'
    ];
    const messagesGu = [
      'અદ્ભુત! સુંદર અને સ્પષ્ટ અક્ષર લેખન!',
      'ખૂબ સરસ પ્રયાસ! અક્ષરનો વળાંક ઉત્તમ છે.',
      'શાબાશ! તમે આ અક્ષર સરસ રીતે શીખી ગયા!'
    ];
    const msg = isEn 
      ? messagesEn[Math.floor(Math.random() * messagesEn.length)]
      : messagesGu[Math.floor(Math.random() * messagesGu.length)];

    setScoreResult({
      score: simulatedAccuracy,
      message: msg,
      stars: stars
    });

    recordExerciseSuccess('gujarati', 10, `Letter '${targetLetter}' Practice`);
    speakText(targetLetter);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-4 flex flex-col gap-3">
      {/* Target Letter Header */}
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
                title={isEn ? "Listen to Pronunciation" : "અવાજ સાંભળો"}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500">{letterMeaning || (isEn ? 'Tracing & handwriting practice' : 'અક્ષર મહાવરો અને લેખન')}</p>
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

      {/* Canvas Drawing Area with watermark guide */}
      <div className="relative w-full h-[240px] sm:h-[280px] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 overflow-hidden flex items-center justify-center">
        {showGuide && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-20">
            <span className="text-[160px] sm:text-[190px] font-black text-slate-900 leading-none">
              {targetLetter}
            </span>
          </div>
        )}

        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full cursor-crosshair relative z-10"
        />

        {strokeCount === 0 && (
          <div className="absolute bottom-3 text-center pointer-events-none z-0">
            <p className="text-xs font-medium text-slate-500 bg-white/90 px-3 py-1 rounded-full border border-slate-200 shadow-xs">
              {isEn ? `Trace character '${targetLetter}' with touch or mouse` : `આંગળી અથવા માઉસ વડે અક્ષર ‘${targetLetter}’ ઘૂંટો`}
            </p>
          </div>
        )}
      </div>

      {/* Toolbar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsEraser(false)}
            className={`p-2 rounded-lg text-xs font-medium transition ${
              !isEraser ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title={isEn ? "Pen (Write)" : "પેન"}
          >
            <PenTool className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsEraser(true)}
            className={`p-2 rounded-lg text-xs font-medium transition ${
              isEraser ? 'bg-rose-500 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title={isEn ? "Eraser" : "રબર"}
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

          {/* Guide Watermark Toggle */}
          <button
            onClick={() => setShowGuide(!showGuide)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
              showGuide ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}
          >
            {showGuide ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="text-[11px]">{showGuide ? (isEn ? 'Guide On' : 'માર્ગદર્શક ચાલુ') : (isEn ? 'Guide Off' : 'માર્ગદર્શક બંધ')}</span>
          </button>
        </div>

        {/* Clear, Undo, Check Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleUndo}
            disabled={history.length === 0}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-medium transition"
            title={isEn ? "Undo" : "પાછળ જાઓ"}
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

      {/* Score and Feedback Banner */}
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
                <span className="text-xs font-bold text-emerald-800 ml-1">
                  +{scoreResult.stars * 5} {isEn ? 'Stars!' : 'પોઇન્ટ્સ!'}
                </span>
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
