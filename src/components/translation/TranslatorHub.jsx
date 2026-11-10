import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TextToSign } from './TextToSign';
import { SignRecognition } from './SignRecognition';
import { SpeechToSign } from './SpeechToSign';
import { 
  Languages, 
  FileText, 
  Camera, 
  Mic, 
  Volume2, 
  HelpCircle 
} from 'lucide-react';

export const TranslatorHub = () => {
  const { uiLanguage } = useApp();
  const isEn = uiLanguage === 'en';
  const [mode, setMode] = useState('text-to-sign');

  const modes = [
    { id: 'text-to-sign', label: isEn ? 'Text → Sign' : 'ટેક્સ્ટ → સાઇન', sub: 'Text to ISL', icon: FileText },
    { id: 'sign-to-text', label: isEn ? 'Camera Sign → Text' : 'કેમેરા સાઇન → ટેક્સ્ટ', sub: 'Sign to Text', icon: Camera },
    { id: 'speech-to-sign', label: isEn ? 'Speech → Sign' : 'અવાજ → સાઇન', sub: 'Speech to ISL', icon: Mic },
  ];

  return (
    <div className="space-y-4 pb-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 text-white rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
            {isEn ? 'Core Technology Feature' : 'મુખ્ય ટેકનોલોજી સુવિધા'}
          </span>
          <h2 className="text-xl sm:text-2xl font-black mt-1">
            {isEn ? 'Two-Way ISL Translation Hub' : 'દ્વિ-માર્ગીય સંવાદ અને અનુવાદ'}
          </h2>
          <p className="text-xs sm:text-sm text-purple-100 max-w-md mt-1">
            {isEn 
              ? 'Translate between Gujarati text, spoken voice, and Indian Sign Language (ISL).' 
              : 'ગુજરાતી ટેક્સ્ટ, બોલાયેલી વાણી અને સાઇન લેંગ્વેજ વચ્ચે અરસપરસ અનુવાદ.'}
          </p>
        </div>
        <div className="absolute -right-4 -bottom-6 text-7xl opacity-20 select-none">
          🤟
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-3 gap-1.5 bg-slate-200/80 p-1 rounded-xl">
        {modes.map(m => {
          const Icon = m.icon;
          const isActive = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-bold transition text-center ${
                isActive
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Mode Component */}
      {mode === 'text-to-sign' && <TextToSign />}
      {mode === 'sign-to-text' && <SignRecognition />}
      {mode === 'speech-to-sign' && <SpeechToSign />}
    </div>
  );
};
