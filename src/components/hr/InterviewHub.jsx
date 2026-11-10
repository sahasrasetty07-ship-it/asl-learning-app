import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { phrasebookData } from '../../data/phrasebookData';
import { 
  Briefcase, 
  Mic, 
  MicOff, 
  Volume2, 
  Send, 
  Sparkles, 
  Video, 
  CheckCircle, 
  Clock, 
  UserCheck,
  Download
} from 'lucide-react';

export const InterviewHub = () => {
  const { speakText, setActiveVideoModal, showToast, uiLanguage } = useApp();
  const isEn = uiLanguage === 'en';
  
  const [isHrSpeaking, setIsHrSpeaking] = useState(false);
  const [hrSpokenText, setHrSpokenText] = useState('');
  const [candidateResponse, setCandidateResponse] = useState('');
  
  const [transcript, setTranscript] = useState([
    {
      id: 'm1',
      sender: 'hr',
      name: isEn ? 'Interviewer (HR)' : 'ઇન્ટરવ્યુઅર (HR)',
      text: 'નમસ્તે! અમારી કંપનીના સમાવેશી ભરતી રાઉન્ડમાં તમારું સ્વાગત છે. તમારો પરિચય આપો.',
      textEn: 'Hello! Welcome to our inclusive hiring round. Please introduce yourself.',
      time: '11:00 AM',
      hasSign: true
    },
    {
      id: 'm2',
      sender: 'candidate',
      name: isEn ? 'Candidate (Deaf)' : 'ઉમેદવાર (Candidate)',
      text: 'નમસ્તે સર, મારું નામ આરવ છે. મેં વિશેષ શિક્ષણ સાથે કમ્પ્યુટર એપ્લિકેશનનો અભ્યાસ કર્યો છે.',
      textEn: 'Hello Sir, my name is Aarav. I completed my education with computer applications.',
      time: '11:02 AM',
      isTtsAvailable: true
    }
  ]);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.lang = 'gu-IN';

      rec.onstart = () => setIsHrSpeaking(true);
      rec.onresult = (e) => {
        const text = e.results[0][0].transcript;
        setHrSpokenText(text);
        setIsHrSpeaking(false);
      };
      rec.onerror = () => setIsHrSpeaking(false);
      rec.onend = () => setIsHrSpeaking(false);
      recognitionRef.current = rec;
    }
  }, []);

  const toggleHrMic = () => {
    if (isHrSpeaking) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsHrSpeaking(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          setIsHrSpeaking(false);
        }
      } else {
        const sampleQuestions = [
          'તમારો અભ્યાસ શું છે?',
          'તમને કમ્પ્યુટર ચલાવતા આવડે છે?',
          'તમે ક્યારે જોડાઈ શકશો?'
        ];
        const picked = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];
        setHrSpokenText(picked);
        showToast(isEn ? `HR Voice input captured: "${picked}"` : `HR વાણી ગ્રહણ: "${picked}"`);
      }
    }
  };

  const handleSendHrQuestion = (questionText = null) => {
    const textToSend = questionText || hrSpokenText;
    if (!textToSend.trim()) return;

    const newMessage = {
      id: `m-${Date.now()}`,
      sender: 'hr',
      name: isEn ? 'Interviewer (HR)' : 'ઇન્ટરવ્યુઅર (HR)',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      hasSign: true
    };

    setTranscript(prev => [...prev, newMessage]);
    setHrSpokenText('');
  };

  const handleSendCandidateResponse = () => {
    if (!candidateResponse.trim()) return;

    const newMessage = {
      id: `m-${Date.now()}`,
      sender: 'candidate',
      name: isEn ? 'Candidate (Deaf)' : 'ઉમેદવાર (Candidate)',
      text: candidateResponse,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isTtsAvailable: true
    };

    setTranscript(prev => [...prev, newMessage]);
    speakText(candidateResponse);
    setCandidateResponse('');
  };

  const handleDownloadTranscript = () => {
    const textData = transcript
      .map(m => `[${m.time}] ${m.name}: ${m.text}${m.textEn ? ` (${m.textEn})` : ''}`)
      .join('\n\n');
    const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `interview-transcript-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(isEn ? 'Interview transcript exported!' : 'ઇન્ટરવ્યુ સંવાદ ફાઇલ ડાઉનલોડ થઈ!');
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
              {isEn ? 'Inclusive Workplace & Interview Mode' : 'સમાવેશી રોજગાર અને ઇન્ટરવ્યુ મોડ'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black mt-1">
              {isEn ? 'HR & Deaf Candidate Communication Hub' : 'HR & દિવ્યાંગ ઉમેદવાર સંવાદ'}
            </h2>
            <p className="text-xs text-purple-200 mt-0.5">
              {isEn 
                ? 'Real-time speech-to-text captions for interviewers and candidate text-to-speech audio.' 
                : 'રીઅલ-ટાઇમ સ્પીચ-ટુ-ટેક્સ્ટ લાઇવ કેપ્શન્સ અને ઉમેદવાર માટે ટેક્સ્ટ-ટુ-સ્પીચ અવાજ.'}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1.5 rounded-xl text-emerald-300 text-xs font-bold self-start sm:self-auto">
            <UserCheck className="w-4 h-4" />
            <span>{isEn ? 'Live Session Active' : 'લાઇવ સેશન સક્રિય'}</span>
          </div>
        </div>
      </div>

      {/* Two-Column Split Screen: HR Controls & Candidate Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: HR Interviewer Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-purple-600" />
              {isEn ? 'Interviewer (HR) Panel' : 'ઇન્ટરવ્યુઅર (HR) પેનલ'}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {isEn ? 'Speak Voice → Captions & Sign' : 'વાણી બોલો → ટેક્સ્ટ & સાઇન'}
            </span>
          </div>

          {/* HR Mic Input */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleHrMic}
              className={`p-3 rounded-xl transition ${
                isHrSpeaking
                  ? 'bg-rose-500 text-white animate-record-pulse'
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow'
              }`}
              title={isEn ? "HR Mic" : "HR માઇક"}
            >
              {isHrSpeaking ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={hrSpokenText}
              onChange={(e) => setHrSpokenText(e.target.value)}
              placeholder={isEn ? "Speak question or type in Gujarati..." : "અહીં પ્રશ્ન બોલો અથવા લખો..."}
              className="flex-1 p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
            />

            <button
              onClick={() => handleSendHrQuestion()}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1 shadow"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick HR Interview Questions */}
          <div>
            <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
              {isEn ? 'Common Interview Questions:' : 'સામાન્ય પ્રશ્નો:'}
            </span>
            <div className="space-y-1.5">
              {[
                { gu: 'તમારો પરિચય આપો', en: 'Introduce yourself' },
                { gu: 'તમારો અભ્યાસ શું છે?', en: 'What is your qualification?' },
                { gu: 'તમને કમ્પ્યુટર ચલાવતા આવડે છે?', en: 'Do you know how to operate computer?' },
                { gu: 'તમે ક્યારે જોડાઈ શકશો?', en: 'When can you join?' }
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendHrQuestion(q.gu)}
                  className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-800 hover:text-purple-900 text-xs font-medium border border-slate-200 transition flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold">{q.gu}</span>
                    <span className="text-[11px] text-slate-400 block">{q.en}</span>
                  </div>
                  <span className="text-[10px] font-bold text-purple-600 shrink-0">{isEn ? '+ Ask' : '+ પૂછો'}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Deaf Candidate Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              {isEn ? 'Deaf Candidate Panel' : 'દિવ્યાંગ ઉમેદવાર પેનલ'}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {isEn ? 'Type → Spoken Voice (TTS)' : 'લખો → બોલાયેલો અવાજ'}
            </span>
          </div>

          {/* Candidate Response Input with Text-to-Speech */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={candidateResponse}
              onChange={(e) => setCandidateResponse(e.target.value)}
              placeholder={isEn ? "Type your response in Gujarati..." : "તમારો જવાબ લખો (ગુજરાતીમાં)..."}
              className="flex-1 p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />

            <button
              onClick={handleSendCandidateResponse}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isEn ? 'Speak & Send' : 'બોલો & મોકલો'}</span>
            </button>
          </div>

          {/* Quick Candidate Preset Responses */}
          <div>
            <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
              {isEn ? 'Quick Preset Responses:' : 'ઝડપી જવાબો:'}
            </span>
            <div className="space-y-1.5">
              {[
                { gu: 'હા, મને કમ્પ્યુટર અને એમએસ ઓફિસ સારી રીતે આવડે છે.', en: 'Yes, I know computers and MS Office well.' },
                { gu: 'હું આગામી સોમવારથી પૂર્ણ સમય જોડાઈ શકું છું.', en: 'I can join full-time starting next Monday.' },
                { gu: 'હું નવી બાબતો ઝડપથી શીખી શકું છું.', en: 'I am a fast learner.' },
                { gu: 'તમારો ખૂબ ખૂબ આભાર!', en: 'Thank you very much!' }
              ].map((ans, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCandidateResponse(ans.gu);
                  }}
                  className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 text-xs font-medium border border-slate-200 transition"
                >
                  <span className="font-bold block">"{ans.gu}"</span>
                  <span className="text-[10px] text-slate-400">{ans.en}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live Interview Transcript Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-500" />
            {isEn ? 'Live Interview Transcript & Captions' : 'ઇન્ટરવ્યુ રીઅલ-ટાઇમ સંવાદ'}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-medium">
              {transcript.length} {isEn ? 'messages' : 'સંદેશા'}
            </span>
            <button
              onClick={handleDownloadTranscript}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1"
              title={isEn ? "Export Transcript as Text" : "સંવાદ ડાઉનલોડ કરો"}
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isEn ? 'Export' : 'ડાઉનલોડ'}</span>
            </button>
          </div>
        </div>

        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
          {transcript.map((msg) => {
            const isHr = msg.sender === 'hr';
            const handleDownloadTranscript = () => {
    const textData = transcript
      .map(m => `[${m.time}] ${m.name}: ${m.text}${m.textEn ? ` (${m.textEn})` : ''}`)
      .join('\n\n');
    const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `interview-transcript-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(isEn ? 'Interview transcript exported!' : 'ઇન્ટરવ્યુ સંવાદ ફાઇલ ડાઉનલોડ થઈ!');
  };

  return (
              <div
                key={msg.id}
                className={`p-3.5 rounded-2xl border flex flex-col space-y-1.5 ${
                  isHr 
                    ? 'bg-purple-50/70 border-purple-200 ml-0 mr-8' 
                    : 'bg-emerald-50/70 border-emerald-200 ml-8 mr-0'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold ${isHr ? 'text-purple-900' : 'text-emerald-900'}`}>
                    {msg.name}
                  </span>
                  <span className="text-[10px] text-slate-400">{msg.time}</span>
                </div>

                <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
                  {msg.text}
                </p>
                {msg.textEn && (
                  <p className="text-[11px] text-slate-500 italic">
                    "{msg.textEn}"
                  </p>
                )}

                {/* Action buttons on message */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => speakText(msg.text)}
                    className="p-1 rounded-md bg-white text-slate-700 hover:text-indigo-600 border border-slate-200 text-[10px] font-semibold flex items-center gap-1"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>{isEn ? 'Speak' : 'સાંભળો'}</span>
                  </button>

                  {msg.hasSign && (
                    <button
                      onClick={() => {
                        setActiveVideoModal({
                          title: msg.text,
                          gujarati: msg.text,
                          english: 'Interview Question ISL Sign',
                          signDescription: 'Approved ISL gesture for interview communication',
                          category: 'Interview'
                        });
                      }}
                      className="p-1 rounded-md bg-white text-purple-700 hover:bg-purple-50 border border-purple-200 text-[10px] font-bold flex items-center gap-1"
                    >
                      <Video className="w-3 h-3" />
                      <span>{isEn ? 'Watch Sign' : 'સાઇન જુઓ'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
