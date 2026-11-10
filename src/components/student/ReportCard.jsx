import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Download, 
  Printer, 
  Calendar 
} from 'lucide-react';

export const ReportCard = () => {
  const { student, showToast, uiLanguage } = useApp();
  const isEn = uiLanguage === 'en';

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    showToast(isEn ? 'Student Report Card PDF downloaded successfully!' : 'પ્રગતિ પત્રક (Report Card) PDF સફળતાપૂર્વક ડાઉનલોડ થયું!');
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-cyan-800 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
              {isEn ? 'Student Academic Report Card' : 'શૈક્ષણિક પ્રગતિ પત્રક'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black mt-1">{student.name}</h2>
            <p className="text-xs text-teal-100 mt-0.5">{student.school} • {student.grade}</p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5"
              title={isEn ? "Print Report" : "પ્રિન્ટ કરો"}
            >
              <Printer className="w-4 h-4" />
              <span>{isEn ? 'Print' : 'પ્રિન્ટ'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <Download className="w-4 h-4" />
              <span>{isEn ? 'Download PDF' : 'PDF ડાઉનલોડ'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Score Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-[11px] font-bold text-slate-500">
            {isEn ? 'Overall Mastery Rate' : 'કુલ સિદ્ધિ દર'}
          </span>
          <div className="text-2xl font-black text-teal-700 mt-1">{student.overallProgress}%</div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {isEn ? 'Syllabus Complete' : 'પાઠ્યક્રમ પૂર્ણ'}
          </p>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-[11px] font-bold text-slate-500">
            {isEn ? 'Total Star Points' : 'કુલ સ્ટાર પોઇન્ટ્સ'}
          </span>
          <div className="text-2xl font-black text-amber-500 mt-1 flex items-center justify-center gap-1">
            <span>{student.totalStars}</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {isEn ? 'Reward Stars' : 'ઈનામી તારા'}
          </p>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-[11px] font-bold text-slate-500">
            {isEn ? 'Active Streak' : 'સતત અભ્યાસ સ્ટ્રીક'}
          </span>
          <div className="text-2xl font-black text-orange-600 mt-1">{student.currentStreak} {isEn ? 'Days' : 'દિવસ'}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {isEn ? 'Consistent Practice' : 'નિયમિત હાજરી'}
          </p>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-[11px] font-bold text-slate-500">
            {isEn ? 'Weekly Study Time' : 'સાપ્તાહિક સમય'}
          </span>
          <div className="text-2xl font-black text-indigo-600 mt-1">{student.weeklyHours} {isEn ? 'Hours' : 'કલાક'}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {isEn ? 'This Week' : 'આ અઠવાડિયે'}
          </p>
        </div>
      </div>

      {/* Subject-Wise Mastery Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          {isEn ? 'Subject Mastery & Accuracy Breakdown' : 'વિષયવાર ગુણવત્તા અને ચોકસાઈ'}
        </h3>

        {/* Gujarati Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h4 className="font-extrabold text-base text-slate-900">
                {isEn ? 'Gujarati Alphabets, Words & Handwriting' : student.subjects.gujarati.name}
              </h4>
              <p className="text-xs text-slate-500">
                {student.subjects.gujarati.completedLessons} / {student.subjects.gujarati.totalLessons} {isEn ? 'lessons completed' : 'પ્રકરણ પૂર્ણ'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-amber-600">{student.subjects.gujarati.accuracy}%</span>
              <p className="text-[10px] text-slate-400 font-bold uppercase">
                {isEn ? 'Accuracy Rate' : 'ચોકસાઈ દર'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {student.subjects.gujarati.topics.map((t, idx) => (
              <div key={idx} className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                <span className="text-xs font-bold text-slate-800 block truncate">{t.name}</span>
                <div className="flex items-center justify-between mt-1 text-[11px]">
                  <span className="text-slate-500">{isEn ? (t.mastery >= 90 ? 'Mastered' : 'In Progress') : t.status}</span>
                  <span className="font-bold text-amber-700">{t.mastery}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Math Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h4 className="font-extrabold text-base text-slate-900">
                {isEn ? 'Mathematics & Gujarati Tables' : student.subjects.math.name}
              </h4>
              <p className="text-xs text-slate-500">
                {student.subjects.math.completedLessons} / {student.subjects.math.totalLessons} {isEn ? 'lessons completed' : 'પ્રકરણ પૂર્ણ'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-blue-600">{student.subjects.math.accuracy}%</span>
              <p className="text-[10px] text-slate-400 font-bold uppercase">
                {isEn ? 'Accuracy Rate' : 'ચોકસાઈ દર'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {student.subjects.math.topics.map((t, idx) => (
              <div key={idx} className="bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
                <span className="text-xs font-bold text-slate-800 block truncate">{t.name}</span>
                <div className="flex items-center justify-between mt-1 text-[11px]">
                  <span className="text-slate-500">{isEn ? (t.mastery >= 85 ? 'Mastered' : 'Needs Practice') : t.status}</span>
                  <span className="font-bold text-blue-700">{t.mastery}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Science Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h4 className="font-extrabold text-base text-slate-900">
                {isEn ? 'General Science with ISL Videos' : student.subjects.science.name}
              </h4>
              <p className="text-xs text-slate-500">
                {student.subjects.science.completedLessons} / {student.subjects.science.totalLessons} {isEn ? 'lessons completed' : 'પ્રકરણ પૂર્ણ'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-emerald-600">{student.subjects.science.accuracy}%</span>
              <p className="text-[10px] text-slate-400 font-bold uppercase">
                {isEn ? 'Accuracy Rate' : 'ચોકસાઈ દર'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {student.subjects.science.topics.map((t, idx) => (
              <div key={idx} className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                <span className="text-xs font-bold text-slate-800 block truncate">{t.name}</span>
                <div className="flex items-center justify-between mt-1 text-[11px]">
                  <span className="text-slate-500">{isEn ? (t.mastery >= 80 ? 'Mastered' : 'New Topic') : t.status}</span>
                  <span className="font-bold text-emerald-700">{t.mastery}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Teacher Recommendations */}
      <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>{isEn ? 'Teacher Guidance & Recommendations' : 'શિક્ષકની ભલામણ અને સુધારણા માર્ગદર્શન'}</span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed font-medium">
          {isEn 
            ? 'Aarav exhibits exceptional handwriting skills in Gujarati alphabets and strong grasp of Solar System signs. In Mathematics, additional practice in Subtraction and Division is recommended. Parents are advised to spend 10 minutes daily on the Subtraction Writing Pad exercises.' 
            : 'આરવ ગુજરાતી મૂળાક્ષરો અને સૂર્યમંડળના સાઇન સંકેતોમાં ખૂબ જ કુશળ છે. ગણિતમાં બાદબાકી અને ભાગાકાર માં થોડા વધુ મહાવરાની જરૂર છે. આગામી અઠવાડિયે દરરોજ ૧૦ મિનિટ બાદબાકી પેડ પ્રેક્ટિસ કરવા ભલામણ છે.'}
        </p>
      </div>
    </div>
  );
};
