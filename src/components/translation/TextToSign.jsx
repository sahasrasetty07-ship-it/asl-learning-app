import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { phrasebookData } from '../../data/phrasebookData';
import { 
  ArrowRight, 
  RotateCcw, 
  Volume2, 
  Video, 
  Sparkles, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';

const stripPunct = (s) => s.replace(/[,।.?!]/g, ' ');

// Finds whole phrasebook phrases in the text (longest first), in reading order.
// Everything left over is returned as unrecognized words.
export const matchPhrases = (text) => {
  let rest = ` ${stripPunct(text).replace(/\s+/g, ' ').trim()} `;
  const found = [];
  [...phrasebookData]
    .sort((a, b) => b.gujarati.length - a.gujarati.length)
    .forEach(item => {
      const phrase = stripPunct(item.gujarati).replace(/\s+/g, ' ').trim();
      const i = rest.indexOf(` ${phrase} `);
      if (i === -1) return;
      found.push({ item, i });
      rest = rest.slice(0, i + 1) + ' '.repeat(phrase.length) + rest.slice(i + 1 + phrase.length);
    });
  return {
    matches: found.sort((a, b) => a.i - b.i).map(f => f.item),
    unrecognized: rest.split(' ').filter(Boolean)
  };
};

export const TextToSign = () => {
  const { setActiveVideoModal, speakText, uiLanguage } = useApp();
  const isEn = uiLanguage === 'en';

  const [inputText, setInputText] = useState('નમસ્તે, મારું નામ આરવ છે. હું શાળાએ જાઉં છું.');
  const [matchedPhrases, setMatchedPhrases] = useState([]);
  const [fingerspelledTokens, setFingerspelledTokens] = useState([]);
  const [activeSignIdx, setActiveSignIdx] = useState(0);

  const handleTranslate = (text = inputText) => {
    if (!text.trim()) return;
    const { matches, unrecognized } = matchPhrases(text);
    // No guessing: words without an approved sign are only listed for fingerspelling
    setMatchedPhrases(matches);
    setFingerspelledTokens(unrecognized);
    setActiveSignIdx(0);
  };

  return (
    <div className="space-y-4">
      {/* Gujarati Text Input Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            {isEn ? 'Enter Gujarati Text:' : 'ગુજરાતી લખાણ દાખલ કરો:'}
          </label>
          <button
            onClick={() => speakText(inputText)}
            className="text-xs text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isEn ? 'Listen to Text' : 'ટેક્સ્ટ સાંભળો'}</span>
          </button>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isEn ? "Type Gujarati word or sentence here..." : "અહીં ગુજરાતી શબ્દ અથવા વાક્ય લખો..."}
          rows={3}
          className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium resize-none"
        />

        {/* Quick sample chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-slate-400 font-bold">{isEn ? 'Quick Phrases:' : 'ઝડપી વાક્યો:'}</span>
          {['નમસ્તે', 'મને મદદ જોઈએ છે', 'હું વિદ્યાર્થી છું', 'આભાર'].map(txt => (
            <button
              key={txt}
              onClick={() => {
                setInputText(txt);
              }}
              className="text-[11px] bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 px-2 py-1 rounded-lg transition border border-slate-200"
            >
              {txt}
            </button>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={() => handleTranslate()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-md transition active:scale-95"
          >
            <span>{isEn ? 'Convert to Sign Language' : 'સાઇન લેંગ્વેજમાં રૂપાંતર કરો'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ISL Output Player / Sequence Display */}
      {(matchedPhrases.length > 0 || fingerspelledTokens.length > 0) && (
        <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-4 shadow-lg space-y-4">
          {matchedPhrases.length === 0 && (
            <p className="text-sm font-bold text-amber-300">
              {isEn
                ? 'No approved sign found for this text in the phrasebook.'
                : 'આ લખાણ માટે શબ્દકોષમાં માન્ય સંકેત મળ્યો નથી.'}
            </p>
          )}
          {matchedPhrases.length > 0 && (<>
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                {isEn ? 'ISL Sign Output' : 'ISL સંકેત પરિણામ'}
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                "{matchedPhrases[activeSignIdx]?.gujarati || 'સાઇન'}"
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>{isEn ? 'Sequence:' : 'ક્રમ:'} {activeSignIdx + 1} / {matchedPhrases.length}</span>
            </div>
          </div>

          {/* Virtual Signer Box */}
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 flex flex-col items-center justify-center text-center space-y-3 min-h-[200px]">
            <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-400/50 flex items-center justify-center text-3xl animate-pulse">
              🤟
            </div>
            <div>
              <p className="text-sm font-bold text-amber-300">
                {matchedPhrases[activeSignIdx]?.signDescription}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {matchedPhrases[activeSignIdx]?.verifiedBy
                  ? `${isEn ? 'Reviewed by:' : 'ચકાસણી:'} ${matchedPhrases[activeSignIdx].verifiedBy}`
                  : (isEn ? 'Draft sign description – not yet reviewed by an ISL educator' : 'ડ્રાફ્ટ વર્ણન – ISL શિક્ષક દ્વારા હજુ ચકાસાયેલ નથી')}
              </p>
            </div>

            <button
              onClick={() => {
                const cur = matchedPhrases[activeSignIdx];
                setActiveVideoModal({
                  title: cur.gujarati,
                  gujarati: cur.gujarati,
                  english: cur.english,
                  signDescription: cur.signDescription,
                  category: cur.category,
                  videoUrl: cur.videoUrl,
                  verifiedBy: cur.verifiedBy
                });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
            >
              <Video className="w-3.5 h-3.5" />
              <span>{isEn ? 'Play Sign Video Clip' : 'વિડીયો ક્લિપ પ્લે કરો'}</span>
            </button>
          </div>

          {/* Sign Sequence Stepper */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {matchedPhrases.map((phrase, idx) => {
              const isActive = activeSignIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveSignIdx(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-white/20'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {idx + 1}. {phrase.gujarati}
                </button>
              );
            })}
          </div>

          </>)}

          {/* Fallback Fingerspelling Notice */}
          {fingerspelledTokens.length > 0 && (
            <div className="bg-amber-950/40 border border-amber-700/50 rounded-xl p-3 text-xs text-amber-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>{isEn ? 'Fingerspelling Fallback:' : 'ફિંગર-સ્પેલિંગ:'}</strong>{' '}
                {isEn ? 'Words ' : 'શબ્દો '}
                <span className="font-bold underline">{fingerspelledTokens.join(', ')}</span>{' '}
                {isEn 
                  ? 'are not in the curated dictionary and will be fingerspelled letter-by-letter.' 
                  : 'સીધા શબ્દકોષમાં નથી, તેથી ISL નિયમ મુજબ એક-એક અક્ષરથી હસ્તમુદ્રા દ્વારા રજૂ થશે.'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
