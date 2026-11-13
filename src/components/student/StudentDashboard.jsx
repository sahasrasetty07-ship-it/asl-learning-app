import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Flame, 
  BookOpen, 
  Calculator, 
  Atom, 
  Languages, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Award 
} from 'lucide-react';

export const StudentDashboard = () => {
  const { student, setActiveTab, speakText, uiLanguage } = useApp();
  const isEn = uiLanguage === 'en';

  const learningCards = [
    {
      id: 'gujarati',
      title: isEn ? 'Gujarati Alphabets' : 'ગુજરાતી મૂળાક્ષરો',
      subtitle: isEn ? 'Letters, Numbers & Writing Pad' : 'અક્ષરો, અંકો અને લેખન પેડ',
      stats: isEn ? `${student.subjects.gujarati.progress}% completed` : `${student.subjects.gujarati.progress}% પૂર્ણ`,
      progress: student.subjects.gujarati.progress,
      color: 'from-amber-500 to-orange-500',
      icon: BookOpen,
      badge: isEn ? 'Alphabet Master' : 'મૂળાક્ષર માસ્ટર'
    },
    {
      id: 'math',
      title: isEn ? 'Math & Tables' : 'ગણિત અને ઘડિયા',
      subtitle: isEn ? 'Tables (ઘડિયા) & Practice Problems' : 'ઘડિયા અને દાખલા મહાવરો',
      stats: isEn ? `${student.subjects.math.progress}% completed` : `${student.subjects.math.progress}% પૂર્ણ`,
      progress: student.subjects.math.progress,
      color: 'from-blue-600 to-indigo-600',
      icon: Calculator,
      badge: isEn ? 'Tables Champ' : 'ઘડિયા ચેમ્પિયન'
    },
    {
      id: 'science',
      title: isEn ? 'General Science' : 'સામાન્ય વિજ્ઞાન',
      subtitle: isEn ? 'Solar System, Plants & Experiments' : 'સૂર્યમંડળ અને પ્રયોગો',
      stats: isEn ? `${student.subjects.science.progress}% completed` : `${student.subjects.science.progress}% પૂર્ણ`,
      progress: student.subjects.science.progress,
      color: 'from-emerald-600 to-teal-600',
      icon: Atom,
      badge: isEn ? 'Junior Scientist' : 'નાનો વિજ્ઞાની'
    },
    {
      id: 'translator',
      title: isEn ? 'ISL Translator Hub' : 'અનુવાદક ટૂલ',
      subtitle: isEn ? 'Text, Camera Sign & Speech to ISL' : 'ટેક્સ્ટ, કેમેરા સાઇન અને સ્પીચ',
      stats: isEn ? 'Two-way Communication' : 'દ્વિ-માર્ગીય સંવાદ',
      progress: 95,
      color: 'from-purple-600 to-pink-600',
      icon: Languages,
      badge: isEn ? 'Inclusive' : 'સમાવેશી સંવાદ'
    }
  ];

  return (
    <div className="space-y-4 pb-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
              {isEn ? 'Welcome Back • Grade 4' : 'શુભ સવાર! • ધોરણ ૪'}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{isEn ? 'Weekly Study:' : 'અઠવાડિક અભ્યાસ:'} {student.weeklyHours} hrs</span>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            {isEn ? `Hello, ${student.name.split(' ')[0]}!` : `નમસ્તે, ${student.name.split(' ')[0]}!`} 👋
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md">
            {isEn 
              ? `You are on a ${student.currentStreak}-day learning streak! Ready to learn today?` 
              : `આજે તમે ${student.currentStreak} દિવસની સ્ટ્રીક પર છો! આજે કયો વિષય શીખવા માંગો છો?`}
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl text-xs font-bold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{student.totalStars} {isEn ? 'Stars' : 'તારા'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl text-xs font-bold">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>{student.currentStreak} {isEn ? 'Day Streak' : 'દિન સ્ટ્રીક'}</span>
            </div>
          </div>
        </div>

        {/* Ambient background decorative shape */}
        <div className="absolute -right-6 -bottom-8 w-36 h-36 rounded-full bg-amber-500/10 blur-2xl pointer-events-none"></div>
      </div>

      {/* Learning Modules Grid */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            {isEn ? 'Learning Modules' : 'અભ્યાસ મોડ્યુલ્સ'}
          </h3>
          <span className="text-xs text-slate-400">{isEn ? 'Overall Progress:' : 'કુલ પ્રગતિ:'} {student.overallProgress}%</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {learningCards.map(card => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => setActiveTab(card.id)}
                className="bg-white hover:bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${card.color} text-white flex items-center justify-center shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base group-hover:text-amber-600 transition">
                        {card.title}
                      </h4>
                      <p className="text-xs text-slate-500">{card.subtitle}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {card.badge}
                  </span>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 mb-1">
                    <span>{isEn ? 'Progress' : 'પ્રગતિ'}</span>
                    <span className="font-bold">{card.stats}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${card.color} transition-all duration-500`}
                      style={{ width: `${card.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end text-xs font-bold text-amber-600 pt-1 group-hover:translate-x-1 transition-transform">
                  <span>{isEn ? 'Start Practice' : 'અભ્યાસ શરૂ કરો'}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pending Teacher Assignments */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {isEn ? 'Teacher Assignments' : 'શિક્ષકે આપેલ સ્વાધ્યાય'}
            </h3>
          </div>
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            {student.pendingAssignments.length} {isEn ? 'Pending' : 'બાકી'}
          </span>
        </div>

        <div className="space-y-2">
          {student.pendingAssignments.map(asg => (
            <div
              key={asg.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-amber-50/50 border border-slate-200 transition"
            >
              <div>
                <h5 className="text-xs sm:text-sm font-bold text-slate-900">{asg.title}</h5>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                  <span className="font-semibold text-slate-700">{asg.subject}</span>
                  <span>•</span>
                  <span>{isEn ? 'Due:' : 'મુદત:'} {asg.dueDate}</span>
                  <span>•</span>
                  <span>{isEn ? 'Teacher:' : 'શિક્ષક:'} {asg.teacher}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (asg.subject.includes('ગુજરાતી')) setActiveTab('gujarati');
                  else if (asg.subject.includes('ગણિત')) setActiveTab('math');
                  else if (asg.subject.includes('વિજ્ઞાન')) setActiveTab('science');
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition active:scale-95 shrink-0"
              >
                {isEn ? 'Open' : 'લખો'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Attempts Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
          {isEn ? 'Recent Activity Log' : 'તાજેતરના પ્રયત્નો'}
        </h3>

        <div className="divide-y divide-slate-100">
          {student.recentAttempts.map(att => (
            <div key={att.id} className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-800">{att.topic}</span>
                <p className="text-[11px] text-slate-400 mt-0.5">{att.date} • {att.time}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {att.score}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
