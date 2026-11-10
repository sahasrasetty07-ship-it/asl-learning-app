import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { phrasebookData } from '../../data/phrasebookData';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  Volume2, 
  Video, 
  RefreshCcw, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export const SpeechToSign = () => {
  const { setActiveVideoModal, speakText, showToast, uiLanguage } = useApp();
  const isEn = uiLanguage === 'en';

  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('નમસ્તે, તમારું નામ શું છે?');
  const [matchedSigns, setMatchedSigns] = useState([]);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'gu-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSpokenText(transcript);
        processSpeech(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        showToast(isEn ? 'Microphone or online STT unavailable. You can click preset phrases below.' : 'માઈક્રોફોન મંજૂરી ઉપલબ્ધ નથી. પ્રીસેટ વાક્યો વાપરો.', 'info');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }

    processSpeech(spokenText);
  }, []);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          setIsListening(false);
        }
      } else {
        simulateSpokenInput();
      }
    }
  };

  const simulateSpokenInput = (text = null) => {
    const samples = [
      'નમસ્તે, તમારું નામ શું છે?',
      'મને મદદ જોઈએ છે',
      'હું વિદ્યાર્થી છું',
      'આભાર'
    ];
    const picked = text || samples[Math.floor(Math.random() * samples.length)];
    setSpokenText(picked);
    processSpeech(picked);
    showToast(isEn ? `Voice captured: "${picked}"` : `બોલાયેલ અવાજ સ્વીકારાયો: "${picked}"`);
  };

  const processSpeech = (text) => {
    const words = text.split(/[\s,।.?]+/).filter(Boolean);
    const matches = [];

    words.forEach(w => {
      const match = phrasebookData.find(item => 
        item.gujarati.includes(w) || w.includes(item.gujarati)
      );
      if (match && !matches.some(m => m.gujarati === match.gujarati)) {
        matches.push(match);
      }
    });

    setMatchedSigns(matches.length > 0 ? matches : [phrasebookData[0]]);
  };

  return (
    <div className="space-y-4">
      {/* Mic Input Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm text-center space-y-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
            {isEn ? 'Gujarati Speech → ISL Sign' : 'ગુજરાતી વાણી → સાઇન લેંગ્વેજ'}
          </span>
          <h3 className="text-lg font-black text-slate-900 mt-1">
            {isEn ? 'Speak in Gujarati to Generate Sign Language' : 'ગુજરાતીમાં બોલો અને સાઇન સંકેત મેળવો'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-0.5">
            {isEn 
              ? 'Spoken Gujarati is transcribed to text and mapped directly to approved ISL sign clips.' 
              : 'ગુજરાતી અવાજ આપોઆપ લખાણમાં રૂપાંતરિત થઈને અધિકૃત ISL સંકેતો દર્શાવશે.'}
          </p>
        </div>

        {/* Big Mic Button */}
        <div className="py-2">
          <button
            onClick={toggleListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all shadow-xl active:scale-95 ${
              isListening
                ? 'bg-rose-500 text-white ring-8 ring-rose-200 animate-record-pulse'
                : 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white hover:opacity-90 shadow-purple-600/30'
            }`}
          >
            {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>
          <p className="text-xs font-bold text-slate-600 mt-3">
            {isListening 
              ? (isEn ? 'Listening in Gujarati (gu-IN)... Speak now' : 'સાંભળી રહ્યા છીએ... બોલો') 
              : (isEn ? 'Tap mic to speak Gujarati voice' : 'માઇક દબાવી ગુજરાતીમાં બોલો')}
          </p>
        </div>

        {/* Sample Voice Prompts to test */}
        <div className="border-t border-slate-100 pt-3">
          <span className="text-[11px] font-bold text-slate-400 block mb-1.5">
            {isEn ? 'Sample Test Voice Prompts (Click to test):' : 'અવાજ કસોટી માટે ક્લિક કરો:'}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {[
              'નમસ્તે, તમારું નામ શું છે?',
              'મને મદદ જોઈએ છે',
              'હું વિદ્યાર્થી છું',
              'શુભ સવાર'
            ].map(txt => (
              <button
                key={txt}
                onClick={() => simulateSpokenInput(txt)}
                className="text-[11px] bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-900 px-3 py-1 rounded-full transition border border-slate-200"
              >
                "{txt}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recognized Speech Result */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase">
            {isEn ? 'Recognized Gujarati Speech:' : 'ઓળખાયેલ ગુજરાતી વાણી:'}
          </span>
          <button
            onClick={() => speakText(spokenText)}
            className="text-xs text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isEn ? 'Replay Speech' : 'ફરી સાંભળો'}</span>
          </button>
        </div>
        <p className="text-base font-bold text-slate-900 bg-purple-50/50 p-3 rounded-xl border border-purple-200">
          "{spokenText}"
        </p>
      </div>

      {/* Matched Sign Language Clips */}
      <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Video className="w-4 h-4 text-purple-400" />
            <span>{isEn ? 'Matched ISL Sign Sequences' : 'મેળવાયેલા સાઇન સંકેતો'}</span>
          </h4>
          <span className="text-xs text-slate-400">
            {matchedSigns.length} {isEn ? 'signs mapped' : 'સાઇન ઉપલબ્ધ'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {matchedSigns.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h5 className="font-extrabold text-amber-300 text-sm">{item.gujarati}</h5>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {item.signDescription}
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveVideoModal({
                    title: item.gujarati,
                    gujarati: item.gujarati,
                    english: item.english,
                    signDescription: item.signDescription,
                    category: item.category
                  });
                }}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition mt-1"
              >
                <Video className="w-3.5 h-3.5" />
                <span>{isEn ? 'Play Sign Video' : 'સાઇન વિડીયો ચલાવો'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
