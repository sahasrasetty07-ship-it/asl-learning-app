import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { phrasebookData } from '../../data/phrasebookData';
import { gujaratiAlphabets } from '../../data/gujaratiAlphabets';
import { gujaratiNumbers } from '../../data/gujaratiNumbers';
import {
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  Video,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// Normalize text for consistent matching: Unicode NFC, strip punctuation, collapse whitespace
const stripPunct = (s) =>
  (s || '')
    .normalize('NFC')
    .replace(/[,।.?!:;"]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// Pre-compiled list of verified dictionary items from project data.
// Note: Individual alphabet letters (ક, ખ, ગ) are intentionally omitted because
// gujaratiAlphabets only contains concept signs for example words (કમળ, ખલ), not ISL letter signs.
const buildApprovedDictionary = () => {
  const dict = [];
  const seen = new Set();

  // 1. Curated Multi-word & Single-word Phrases (highest priority)
  phrasebookData.forEach(p => {
    const key = stripPunct(p.gujarati);
    if (key && !seen.has(key)) {
      seen.add(key);
      dict.push({
        gujarati: p.gujarati,
        english: p.english,
        signDescription: p.signDescription,
        handShape: p.handShape || null,
        meaning: p.meaning || null,
        category: p.category || 'અભિવાદન/વાક્ય',
        matchType: 'phrase'
      });
    }
  });

  // 2. Verified ISL Number Signs (words like એક, બે and numerals ૧, ૨)
  gujaratiNumbers.forEach(n => {
    const keyWord = stripPunct(n.word);
    if (keyWord && !seen.has(keyWord)) {
      seen.add(keyWord);
      dict.push({
        gujarati: n.word,
        english: n.englishWord,
        signDescription: n.signDescription,
        handShape: n.handShape || null,
        meaning: `${n.englishNumber} - ${n.objectName || ''}`,
        category: 'સંખ્યા (Numbers)',
        matchType: 'number'
      });
    }
    const keyNum = stripPunct(n.number);
    if (keyNum && !seen.has(keyNum)) {
      seen.add(keyNum);
      dict.push({
        gujarati: n.number,
        english: `${n.word} (${n.englishNumber})`,
        signDescription: n.signDescription,
        handShape: n.handShape || null,
        meaning: n.objectName || null,
        category: 'સંખ્યા (Numbers)',
        matchType: 'number'
      });
    }
  });

  // 3. Verified Concept Words from Alphabet curriculum (e.g. કમળ, ખલ, ગણપતિ, ઘર)
  // Only the concept word is added since signDescription represents the object, not the letter.
  gujaratiAlphabets.forEach(a => {
    if (a.word) {
      const keyWord = stripPunct(a.word);
      if (keyWord && !seen.has(keyWord)) {
        seen.add(keyWord);
        dict.push({
          gujarati: a.word,
          english: a.wordEnglish || a.word,
          signDescription: a.signDescription,
          handShape: a.handShape || null,
          meaning: a.meaning || null,
          category: a.category || 'શબ્દ (Word)',
          matchType: 'word'
        });
      }
    }
  });

  // Sort longest first so multi-word phrases match before individual words
  return dict.sort((a, b) => stripPunct(b.gujarati).length - stripPunct(a.gujarati).length);
};

const APPROVED_DICTIONARY = buildApprovedDictionary();

// Reliable longest-phrase matcher with exact boundary matching (prevents false matches like "ના" inside "નામ")
export const matchSpeechToSigns = (rawText) => {
  if (!rawText || !rawText.trim()) {
    return { matches: [], unmatchedWords: [] };
  }

  const normalized = stripPunct(rawText);
  let rest = ` ${normalized} `;
  const found = [];

  APPROVED_DICTIONARY.forEach(item => {
    const phrase = stripPunct(item.gujarati);
    if (!phrase) return;
    const target = ` ${phrase} `;
    let pos = rest.indexOf(target);
    while (pos !== -1) {
      found.push({ item, pos });
      // Mask out the matched portion with spaces so it cannot be re-matched
      rest = rest.slice(0, pos + 1) + ' '.repeat(phrase.length) + rest.slice(pos + 1 + phrase.length);
      pos = rest.indexOf(target);
    }
  });

  // Preserve the order of speech in the sentence
  const matches = found.sort((a, b) => a.pos - b.pos).map(f => f.item);
  const unmatchedWords = rest.split(/\s+/).filter(Boolean);

  return { matches, unmatchedWords };
};

export const SpeechToSign = () => {
  const { setActiveVideoModal, speakText, showToast, uiLanguage } = useApp();
  const isEn = uiLanguage === 'en';

  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [matchedSigns, setMatchedSigns] = useState([]);
  const [unmatchedWords, setUnmatchedWords] = useState([]);
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
        showToast(
          isEn
            ? 'Microphone or online STT unavailable in this browser. Try the quick test phrases below.'
            : 'માઈક્રોફોન અથવા વાણી ઓળખ ઉપલબ્ધ નથી. નીચે આપેલા પ્રીસેટ વાક્યો વાપરો.',
          'info'
        );
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }
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
        showToast(
          isEn
            ? 'Browser speech recognition (gu-IN) is not supported in this browser. Please use quick test phrases below or Text to Sign.'
            : 'આ બ્રાઉઝરમાં ગુજરાતી સ્પીચ રેકગ્નિશન સપોર્ટેડ નથી. નીચે આપેલા ટેસ્ટ વાક્યો અથવા ટેક્સ્ટ-ટુ-સાઇન વાપરો.',
          'info'
        );
      }
    }
  };

  const handleSelectTestPhrase = (text) => {
    setSpokenText(text);
    processSpeech(text);
  };

  const processSpeech = (text) => {
    if (!text || !text.trim()) {
      setMatchedSigns([]);
      setUnmatchedWords([]);
      return;
    }
    const { matches, unmatchedWords: unmatched } = matchSpeechToSigns(text);
    setMatchedSigns(matches);
    setUnmatchedWords(unmatched);
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
              ? 'Spoken Gujarati is transcribed to text and mapped directly to approved ISL sign guides.'
              : 'ગુજરાતી અવાજ આપોઆપ લખાણમાં રૂપાંતરિત થઈને અધિકૃત ISL સંકેતો દર્શાવશે.'}
          </p>
        </div>

        {/* Mic Button Subtitle */}
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

        {!speechSupported && (
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 text-xs">
            {isEn
              ? 'Browser speech recognition (gu-IN) is not available in this browser. You can click the test phrases below to test sign matching.'
              : 'તમારા બ્રાઉઝરમાં ગુજરાતી વાણી ઓળખ ઉપલબ્ધ નથી. સાઇન સંકેત જોવા માટે નીચેના ટેસ્ટ વાક્યો વાપરો.'}
          </div>
        )}

        {/* Quick Test Phrases */}
        <div className="border-t border-slate-100 pt-3">
          <span className="text-[11px] font-bold text-slate-400 block mb-1.5">
            {isEn ? 'Quick Test Phrases (click to test sign lookup):' : 'ઝડપી ટેસ્ટ વાક્યો (સાઇન સંકેત જોવા ક્લિક કરો):'}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {[
              'નમસ્તે, તમારું નામ શું છે?',
              'મને મદદ જોઈએ છે',
              'હું વિદ્યાર્થી છું',
              'શુભ સવાર',
              'કમળ અને ઘર',
              'એક બે ત્રણ'
            ].map(txt => (
              <button
                key={txt}
                onClick={() => handleSelectTestPhrase(txt)}
                className="text-[11px] bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-900 px-3 py-1 rounded-full transition border border-slate-200"
              >
                {txt}
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
          {spokenText && (
            <button
              onClick={() => speakText(spokenText)}
              className="text-xs text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isEn ? 'Replay Speech' : 'ફરી સાંભળો'}</span>
            </button>
          )}
        </div>
        {spokenText ? (
          <p className="text-base font-bold text-slate-900 bg-purple-50/50 p-3 rounded-xl border border-purple-200">
            {spokenText}
          </p>
        ) : (
          <p className="text-xs text-slate-400 italic p-3 rounded-xl border border-dashed border-slate-200">
            {isEn
              ? 'No speech captured yet. Tap the mic or choose a test phrase above.'
              : 'હજુ કોઈ વાણી પકડાઈ નથી. માઇક દબાવો અથવા ઉપરથી ટેસ્ટ વાક્ય પસંદ કરો.'}
          </p>
        )}
      </div>

      {/* Matched Sign Language Sequences */}
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

        {/* No Direct Match State */}
        {matchedSigns.length === 0 && spokenText && (
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-center space-y-2.5">
            <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
            <p className="text-sm font-bold text-amber-300">
              {isEn
                ? 'No matching signs found in dictionary.'
                : 'આ વાણી માટે શબ્દકોષમાં કોઈ સંકેત મળ્યો નથી.'}
            </p>
            {unmatchedWords.length > 0 && (
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                {isEn ? 'Unsupported words: ' : 'ઉપલબ્ધ ન હોય તેવા શબ્દો: '}
                <span className="font-semibold text-slate-200">{unmatchedWords.join(', ')}</span>
              </p>
            )}
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed">
              {isEn
                ? 'The current dictionary covers curated greetings, school phrases, numbers (1-10), and select vocabulary words. Additional signs will be added in future updates.'
                : 'હાલનો શબ્દકોષ મુખ્ય અભિવાદન, શાળા વાક્યો, અંકો (૧-૧૦) અને પસંદગીના શબ્દો આવરી લે છે. વધુ સંકેતો ભવિષ્યમાં ઉમેરવામાં આવશે.'}
            </p>
          </div>
        )}

        {/* Idle prompt before speech */}
        {matchedSigns.length === 0 && !spokenText && (
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center text-xs text-slate-400">
            {isEn
              ? 'Speak into the mic or select a test phrase to display matching ISL signs.'
              : 'સાઇન સંકેતો જોવા માટે માઇકમાં બોલો અથવા ટેસ્ટ વાક્ય પસંદ કરો.'}
          </div>
        )}

        {/* Matched Sign Grid */}
        {matchedSigns.length > 0 && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {matchedSigns.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2.5"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <h5 className="font-extrabold text-amber-300 text-sm">{item.gujarati}</h5>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          item.matchType === 'phrase'
                            ? 'bg-purple-900/60 text-purple-200 border border-purple-500/30'
                            : item.matchType === 'number'
                            ? 'bg-blue-900/60 text-blue-200 border border-blue-500/30'
                            : 'bg-emerald-900/60 text-emerald-200 border border-emerald-500/30'
                        }`}
                      >
                        {item.matchType === 'phrase'
                          ? (isEn ? 'Full Phrase' : 'વાક્ય સંકેત')
                          : item.matchType === 'number'
                          ? (isEn ? 'Number' : 'સંખ્યા સંકેત')
                          : (isEn ? 'Word' : 'શબ્દ સંકેત')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <span>{item.english}</span>
                      <span>•</span>
                      <span className="text-slate-500">{item.category}</span>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed font-medium pt-0.5">
                      {item.signDescription}
                    </p>

                    {item.handShape && (
                      <p className="text-[11px] text-amber-300/90 font-medium">
                        ✋ {item.handShape}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setActiveVideoModal({
                        title: item.gujarati,
                        gujarati: item.gujarati,
                        english: item.english,
                        signDescription: item.signDescription,
                        handShape: item.handShape,
                        meaning: item.meaning,
                        category: item.category
                      });
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition mt-1 active:scale-95"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>{isEn ? 'View Sign Guide' : 'સાઇન માર્ગદર્શિકા જુઓ'}</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Notice for unsupported words in an otherwise matched sentence */}
            {unmatchedWords.length > 0 && (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-300">
                    {isEn ? 'Unsupported words:' : 'શબ્દકોષમાં ઉપલબ્ધ ન હોય તેવા શબ્દો:'}
                  </span>{' '}
                  <span className="font-semibold text-slate-200">{unmatchedWords.join(', ')}</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {isEn
                      ? 'These words are currently not in the curated sign dictionary.'
                      : 'આ શબ્દો માટે હાલના શબ્દકોષમાં સંકેત ઉપલબ્ધ નથી.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
