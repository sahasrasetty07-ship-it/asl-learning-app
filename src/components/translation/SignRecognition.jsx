import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { recognizedGesturesList } from '../../data/phrasebookData';
import { 
  Camera, 
  CameraOff, 
  Sparkles, 
  Volume2, 
  CheckCircle2, 
  RefreshCw, 
  Layers, 
  ShieldCheck, 
  Copy 
} from 'lucide-react';

export const SignRecognition = () => {
  const { speakText, showToast, uiLanguage } = useApp();
  const isEn = uiLanguage === 'en';

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [activeGestureIdx, setActiveGestureIdx] = useState(0);
  const [recognizedSentence, setRecognizedSentence] = useState('નમસ્તે, મને મદદ જોઈએ છે.');
  const [showSkeleton, setShowSkeleton] = useState(true);

  const currentGesture = recognizedGesturesList[activeGestureIdx];

  const toggleCamera = async () => {
    if (isCameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsCameraActive(false);
    } else {
      setCameraError(null);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user', width: 640, height: 480 } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
      } catch (err) {
        console.warn('Camera permission denied or unavailable:', err);
        setCameraError(isEn 
          ? 'Camera not accessible or permission denied.' 
          : 'કેમેરા ઉપલબ્ધ નથી અથવા મંજૂરી નકારાઈ.');
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let angle = 0;

    const renderLandmarks = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (showSkeleton) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2 + Math.sin(angle) * 5;
        angle += 0.05;

        ctx.fillStyle = 'rgba(245, 158, 11, 0.3)';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY + 30, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        const fingers = [-40, -20, 0, 20, 40];
        fingers.forEach((fx, i) => {
          const topY = centerY - 40 - (i === 2 ? 15 : 0);
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY + 20);
          ctx.lineTo(centerX + fx, centerY);
          ctx.lineTo(centerX + fx * 1.2, topY);
          ctx.stroke();

          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(centerX + fx * 1.2, topY, 4, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      animationFrameId = requestAnimationFrame(renderLandmarks);
    };

    renderLandmarks();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [showSkeleton, activeGestureIdx]);

  const addGestureToSentence = () => {
    const cleaned = currentGesture.gesture.split(' ')[0];
    setRecognizedSentence(prev => prev ? `${prev} ${cleaned}` : cleaned);
    showToast(isEn ? `Added "${cleaned}" to transcript!` : `"${cleaned}" વાક્યમાં ઉમેર્યું!`);
  };

  const handleSpeakSentence = () => {
    if (recognizedSentence) {
      speakText(recognizedSentence);
    }
  };

  return (
    <div className="space-y-4">
      {/* Live Camera Feed & Landmark HUD */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-xl text-white space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {isEn ? 'Sign Recognition – Prototype' : 'સાઇન ઓળખ – પ્રોટોટાઇપ'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSkeleton(!showSkeleton)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition flex items-center gap-1 ${
                showSkeleton 
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' 
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{showSkeleton ? (isEn ? 'Skeleton On' : 'સ્કેલેટન ચાલુ') : (isEn ? 'Skeleton Off' : 'સ્કેલેટન બંધ')}</span>
            </button>

            <button
              onClick={toggleCamera}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                isCameraActive 
                  ? 'bg-rose-600 hover:bg-rose-500 text-white' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isCameraActive ? <CameraOff className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
              <span>{isCameraActive ? (isEn ? 'Stop Camera' : 'કેમેરા બંધ') : (isEn ? 'Start Camera' : 'કેમેરા શરૂ')}</span>
            </button>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs">
          {isEn
            ? 'Recognition model not connected yet. The hand overlay is a sample drawing; pick a test sign below to try the sentence builder.'
            : 'ઓળખ મોડેલ હજુ જોડાયેલ નથી. હાથનું ચિત્ર નમૂનો છે; વાક્ય બનાવવા નીચેથી ટેસ્ટ સાઇન પસંદ કરો.'}
        </div>

        {/* Viewport for Video + Canvas Overlay */}
        <div className="relative w-full h-[260px] sm:h-[300px] bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
          {isCameraActive && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
          )}

          {!isCameraActive && (
            <div className="text-center p-4 z-10 space-y-2">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400 text-2xl">
                📷
              </div>
              <p className="text-sm font-bold text-slate-300">{isEn ? 'Camera is currently off' : 'કેમેરા બંધ છે'}</p>
              <p className="text-xs text-slate-500 max-w-xs">
                {isEn 
                  ? 'Click "Start Camera" above or choose a test gesture from the preset row below.' 
                  : 'કેમેરા શરૂ કરો અથવા નીચે આપેલ પ્રીસેટ સાઇન સંકેત પસંદ કરી ટેસ્ટ કરો.'}
              </p>
            </div>
          )}

          {/* Canvas Landmark Overlay */}
          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            className="absolute inset-0 w-full h-full pointer-events-none z-20"
          />

          {/* HUD Bounding Box and Confidence Overlay */}
          <div className="absolute top-3 left-3 bg-black/75 backdrop-blur border border-white/10 rounded-lg p-2 text-xs z-30">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold">{isEn ? 'Test sign:' : 'ટેસ્ટ સાઇન:'}</span>
              <span className="font-extrabold text-white">{currentGesture.gesture}</span>
            </div>
          </div>

          <div className="absolute bottom-3 right-3 bg-black/75 border border-white/10 rounded-lg px-2.5 py-1 text-[10px] text-slate-300 z-30">
            {currentGesture.keypoints}
          </div>
        </div>

        {cameraError && (
          <div className="p-2.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs">
            {cameraError}
          </div>
        )}

        {/* Gesture switcher to test different signs */}
        <div>
          <span className="text-xs font-bold text-slate-400 block mb-1.5">
            {isEn ? 'Test signs (manual input until the model is ready):' : 'ટેસ્ટ સાઇન (મોડેલ તૈયાર થાય ત્યાં સુધી):'}
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {recognizedGesturesList.map((g, idx) => {
              const isSelected = activeGestureIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveGestureIdx(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {g.gesture}
                </button>
              );
            })}
          </div>
        </div>

        {/* Add Recognized Gesture to Current Sentence */}
        <div className="flex justify-end pt-1">
          <button
            onClick={addGestureToSentence}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition active:scale-95 shadow"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isEn ? 'Add Sign to Sentence (+)' : 'આ સાઇન વાક્યમાં ઉમેરો'}</span>
          </button>
        </div>
      </div>

      {/* Recognized Gujarati Output Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            {isEn ? 'Transcribed Gujarati Text:' : 'ઓળખાયેલ ગુજરાતી લખાણ:'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRecognizedSentence('')}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              {isEn ? 'Clear' : 'સાફ કરો'}
            </button>
            <button
              onClick={handleSpeakSentence}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-sm"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isEn ? 'Speak Gujarati Voice (TTS)' : 'ગુજરાતીમાં બોલો'}</span>
            </button>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 min-h-[70px] flex items-center justify-between">
          <p className="text-base font-bold text-slate-900 leading-relaxed">
            {recognizedSentence || (isEn ? 'Perform signs in front of camera or select a test sign above...' : 'કેમેરા સામે સાઇન કરો અથવા ઉપરથી પ્રીસેટ ઉમેરો...')}
          </p>
        </div>
      </div>
    </div>
  );
};
