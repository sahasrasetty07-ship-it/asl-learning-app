import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Volume2, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

export const SignVideoModal = () => {
  const { activeVideoModal, setActiveVideoModal, speakText, uiLanguage } = useApp();
  const isEn = uiLanguage === 'en';

  const [playbackRate, setPlaybackRate] = useState(1);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = playbackRate;
  }, [playbackRate, activeVideoModal]);

  if (!activeVideoModal) return null;

  const { 
    title, 
    gujarati, 
    english, 
    signDescription, 
    handShape, 
    meaning, 
    verifiedBy,
    videoUrl,
    category 
  } = activeVideoModal;

  const handleSpeech = () => {
    if (gujarati) speakText(gujarati);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white font-bold text-lg">
              {gujarati || 'સ'}
            </span>
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-tight">
                {title || (isEn ? 'ISL Sign Demonstration' : 'ISL સંકેત વિડીયો')}
              </h3>
              <p className="text-xs text-amber-300 font-medium">{english || category || 'Indian Sign Language'}</p>
            </div>
          </div>
          <button
            onClick={() => setActiveVideoModal(null)}
            className="p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Simulation / Signer Display */}
        <div className="relative bg-slate-950 flex flex-col items-center justify-center min-h-[220px] sm:min-h-[260px] p-4 text-center overflow-hidden">
          {videoUrl ? (
            <video
              ref={videoRef}
              key={videoUrl}
              src={videoUrl}
              autoPlay
              loop
              muted
              playsInline
              controls
              className="w-full max-w-[360px] max-h-[240px] rounded-xl bg-black"
            />
          ) : (
          <div className="relative w-full max-w-[280px] h-[200px] bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700 flex flex-col items-center justify-center p-4 shadow-inner">
            <div className="relative flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-amber-500/20 border-2 border-dashed border-amber-400 flex items-center justify-center text-4xl animate-pulse">
                🤟
              </div>
              <div className="absolute -bottom-2 bg-slate-950/90 text-amber-300 text-[10px] px-2 py-0.5 rounded-full border border-amber-400/40 font-mono">
                {playbackRate}x {isEn ? 'Speed' : 'સ્પીડ'}
              </div>
            </div>

            <p className="text-white font-bold text-lg mt-3">
              {isEn ? `Sign for "${gujarati}"` : `"${gujarati}" નો સાઇન સંકેત`}
            </p>
            <p className="text-xs text-slate-300 mt-0.5">
              {isEn ? 'Video not recorded yet – follow the steps below' : 'વિડીયો હજુ ઉપલબ્ધ નથી – નીચેની વિગત અનુસરો'}
            </p>
          </div>
          )}

          {/* Subtitles in Gujarati */}
          <div className="mt-3 bg-black/70 px-3 py-1.5 rounded-lg border border-white/10 max-w-sm">
            <p className="text-xs text-amber-200 font-medium">
              "{signDescription}"
            </p>
          </div>

          {/* Controls Bar */}
          <div className="w-full max-w-[360px] mt-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-md">
              <span className="text-[10px] text-slate-400 pl-1">{isEn ? 'Speed:' : 'સ્પીડ:'}</span>
              {[0.5, 0.75, 1].map(rate => (
                <button
                  key={rate}
                  onClick={() => setPlaybackRate(rate)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition ${
                    playbackRate === rate 
                      ? 'bg-amber-500 text-white' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            <button
              onClick={handleSpeech}
              className="flex items-center gap-1 bg-amber-600 hover:bg-amber-500 text-white px-2.5 py-1 rounded-md text-[11px] font-medium transition"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isEn ? 'Audio' : 'ઉચ્ચારણ'}</span>
            </button>
          </div>
        </div>

        {/* Sign Instructions & Details */}
        <div className="p-4 overflow-y-auto space-y-3 text-slate-800">
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isEn ? 'Sign Instructions & Gestures' : 'સંકેત વિગત'}
            </h4>
            <p className="text-sm font-medium text-slate-800 mt-1 bg-amber-50/70 p-3 rounded-xl border border-amber-200">
              {signDescription}
            </p>
            {handShape && <p className="text-xs text-slate-600 mt-1.5">✋ {handShape}</p>}
          </div>

          {meaning && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {isEn ? 'Context & Meaning' : 'અર્થ અને સંદર્ભ'}
              </h4>
              <p className="text-xs text-slate-700 mt-1">{meaning}</p>
            </div>
          )}

          {/* Review status: only claim review when a reviewer is recorded */}
          {verifiedBy ? (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-xl text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{isEn ? `Reviewed by ${verifiedBy}` : `${verifiedBy} દ્વારા ચકાસાયેલ સંકેત.`}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 p-2.5 rounded-xl text-xs">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                {isEn
                  ? 'Draft sign description – not yet reviewed by an ISL educator.'
                  : 'ડ્રાફ્ટ વર્ણન – ISL શિક્ષક દ્વારા હજુ ચકાસાયેલ નથી.'}
              </span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={() => setActiveVideoModal(null)}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isEn ? 'Got it (Close)' : 'સમજાયું'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
