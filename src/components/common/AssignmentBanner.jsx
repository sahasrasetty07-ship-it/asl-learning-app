import React from 'react';
import { useApp } from '../../context/AppContext';
import { ClipboardCheck, CheckCircle2 } from 'lucide-react';

// Shows progress of the teacher assignment the student is working on in this subject.
export const AssignmentBanner = ({ subjectKey }) => {
  const { activeAssignment: asg, stopAssignment, setActiveTab, uiLanguage } = useApp();
  const isEn = uiLanguage === 'en';
  if (!asg || asg.subjectKey !== subjectKey) return null;

  const finished = asg.done >= asg.count;
  const finish = () => {
    stopAssignment();
    setActiveTab('dashboard');
  };

  return (
    <div className={`rounded-2xl border p-3 flex items-center gap-3 ${
      finished ? 'bg-emerald-50 border-emerald-300' : 'bg-amber-50 border-amber-300'
    }`}>
      {finished
        ? <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
        : <ClipboardCheck className="w-6 h-6 text-amber-600 shrink-0" />}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-900 truncate">{asg.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-2 bg-white rounded-full overflow-hidden border border-slate-200">
            <div
              className={`h-full ${finished ? 'bg-emerald-500' : 'bg-amber-500'}`}
              style={{ width: `${(100 * asg.done) / asg.count}%` }}
            />
          </div>
          <span className="text-[11px] font-bold text-slate-700 whitespace-nowrap">
            {asg.done}/{asg.count} · {isEn ? `${asg.correct} correct` : `${asg.correct} સાચા`}
          </span>
        </div>
      </div>
      <button
        onClick={finish}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition ${
          finished ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
        }`}
      >
        {finished ? (isEn ? 'Done ✓' : 'પૂર્ણ ✓') : (isEn ? 'Pause' : 'થોભો')}
      </button>
    </div>
  );
};
