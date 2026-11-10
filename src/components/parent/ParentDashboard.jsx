import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Sparkles, 
  Heart, 
  Video, 
  Volume2, 
  CheckCircle2, 
  MessageSquare, 
  Calendar 
} from 'lucide-react';

export const ParentDashboard = () => {
  const { student, setActiveVideoModal, speakText, uiLanguage } = useApp();
  const isEn = uiLanguage === 'en';

  const homePhrases = [
    {
      gujarati: 'જમવા માટે આવો',
      english: 'Come to eat food',
      signDescription: isEn 
        ? 'Bring hand to mouth to sign eating, then wave with the other hand to call.' 
        : 'મોં પાસે હાથ લઈ જઈ જમવાનો સંકેત કરો અને બીજા હાથે બોલાવવાનો સંકેત કરો.',
      category: isEn ? 'Daily Routine' : 'ઘર વપરાશ'
    },
    {
      gujarati: 'હોમવર્ક પૂર્ણ કરો',
      english: 'Complete your homework',
      signDescription: isEn 
        ? 'Sign opening a book and writing with a pencil.' 
        : 'પુસ્તક વાંચવાનો અભિનય કરી પેન્સિલથી લખવાનો સંકેત કરો.',
      category: isEn ? 'Study' : 'અભ્યાસ'
    },
    {
      gujarati: 'શું તરસ લાગી છે?',
      english: 'Are you thirsty? Want water?',
      signDescription: isEn 
        ? 'Touch throat, then form W-shape near lips to ask for water.' 
        : 'ગળા પર હાથ ફેરવો અને હોઠ પાસે W આકારથી પાણી પીવાનો પ્રશ્નાર્થ સંકેત કરો.',
      category: isEn ? 'Needs' : 'જરૂરિયાત'
    },
    {
      gujarati: 'સુઈ જવાનો સમય થયો',
      english: 'Time to sleep',
      signDescription: isEn 
        ? 'Place palms together beside cheek and tilt head with eyes closed.' 
        : 'બંને હથેળીઓ જોડી ગાલની બાજુમાં માથું ઢાળી આંખો બંધ કરો.',
      category: isEn ? 'Bedtime' : 'દિનચર્યા'
    },
    {
      gujarati: 'ખૂબ સરસ! શાબાશ!',
      english: 'Well done! Proud of you!',
      signDescription: isEn 
        ? 'Show thumbs up with both hands and clap with a smiling expression.' 
        : 'બંને હાથના થમ્બ્સ અપ કરી ચહેરા પર સ્મિત સાથે તાળી પાડો.',
      category: isEn ? 'Encouragement' : 'પ્રોત્સાહન'
    }
  ];

  return (
    <div className="space-y-4 pb-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
            {isEn ? 'Parent Portal' : 'વાલી પોર્ટલ'}
          </span>
          <h2 className="text-xl sm:text-2xl font-black mt-1">
            {isEn ? 'Welcome, Parent! 👋' : 'નમસ્તે, વાલીશ્રી! 👋'}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-md mt-1">
            {isEn 
              ? "Track your child's daily school progress and communicate easily at home without needing to know sign language." 
              : 'તમારા બાળકની દૈનિક શાળા પ્રગતિ જુઓ અને સાઇન લેંગ્વેજ જાણ્યા વિના ઘેર સરળતાથી સંવાદ સાધો.'}
          </p>
        </div>
        <div className="absolute -right-4 -bottom-6 text-7xl opacity-20 select-none">
          🏡
        </div>
      </div>

      {/* Child Status Snapshot */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl">👦</span>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">{student.name}</h3>
              <p className="text-xs text-slate-500">{student.grade} • {student.school}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {student.currentStreak} {isEn ? 'Day Active Streak' : 'દિવસથી નિયમિત'}
            </span>
          </div>
        </div>

        {/* 3 Subject Progress Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200">
            <span className="text-xs font-bold text-amber-900">
              {isEn ? 'Gujarati Language' : 'ગુજરાતી ભાષા'}
            </span>
            <div className="text-xl font-black text-amber-800 mt-0.5">{student.subjects.gujarati.progress}%</div>
            <p className="text-[10px] text-amber-700 mt-0.5">
              {isEn ? 'Handwriting is excellent' : 'અક્ષરલેખન ઉત્તમ છે'}
            </p>
          </div>

          <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200">
            <span className="text-xs font-bold text-blue-900">
              {isEn ? 'Mathematics' : 'ગણિત શિક્ષણ'}
            </span>
            <div className="text-xl font-black text-blue-800 mt-0.5">{student.subjects.math.progress}%</div>
            <p className="text-[10px] text-blue-700 mt-0.5">
              {isEn ? 'Practice subtraction at home' : 'બાદબાકીમાં મદદ કરો'}
            </p>
          </div>

          <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
            <span className="text-xs font-bold text-emerald-900">
              {isEn ? 'Science Concepts' : 'વિજ્ઞાન ખ્યાલો'}
            </span>
            <div className="text-xl font-black text-emerald-800 mt-0.5">{student.subjects.science.progress}%</div>
            <p className="text-[10px] text-emerald-700 mt-0.5">
              {isEn ? 'Solar system signs mastered' : 'સૂર્યમંડળ સાઇન પૂર્ણ'}
            </p>
          </div>
        </div>
      </div>

      {/* Parent-Child Communication Helper (Cheat Sheet) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>{isEn ? 'Household Sign Cheat-Sheet for Parents' : 'ઘર વપરાશની સરળ સાઇન શબ્દાવલિ'}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {isEn 
                ? 'High-frequency signs to communicate with your deaf child without taking formal sign language courses.' 
                : 'સાઇન ભાષા શીખ્યા વગર બાળક સાથે વાતચીત કરવાના સૌથી ઉપયોગી સંકેતો.'}
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {homePhrases.map((phrase, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50/40 border border-slate-200 transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">{phrase.gujarati}</h4>
                  <span className="text-xs text-slate-500 font-medium">({phrase.english})</span>
                  <span className="text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {phrase.category}
                  </span>
                </div>
                <p className="text-xs text-emerald-800 font-medium mt-1">
                  👉 <strong>{isEn ? 'How to sign:' : 'કેવી રીતે સંકેત કરવો:'}</strong> {phrase.signDescription}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => speakText(phrase.gujarati)}
                  className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition"
                  title={isEn ? "Pronounce" : "બોલો"}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setActiveVideoModal({
                      title: phrase.gujarati,
                      gujarati: phrase.gujarati,
                      english: phrase.english,
                      signDescription: phrase.signDescription,
                      category: phrase.category
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Watch Sign' : 'વિડીયો જુઓ'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
