import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Volume2, 
  VolumeX, 
  Smartphone, 
  Monitor, 
  Sparkles, 
  Flame, 
  User, 
  GraduationCap, 
  Users, 
  Briefcase,
  Globe
} from 'lucide-react';

export const Header = () => {
  const { 
    currentRole, 
    setCurrentRole, 
    uiLanguage,
    setUiLanguage,
    audioEnabled, 
    setAudioEnabled, 
    isMobileFrame, 
    setIsMobileFrame, 
    student 
  } = useApp();

  const isEn = uiLanguage === 'en';

  const roleConfigs = [
    { 
      id: 'student', 
      label: isEn ? 'Student' : 'વિદ્યાર્થી', 
      icon: GraduationCap, 
      activeGradient: 'from-amber-500 to-orange-500',
      activeGlow: 'shadow-amber-500/20'
    },
    { 
      id: 'teacher', 
      label: isEn ? 'Teacher' : 'શિક્ષક', 
      icon: User, 
      activeGradient: 'from-blue-600 to-indigo-600',
      activeGlow: 'shadow-blue-500/20'
    },
    { 
      id: 'parent', 
      label: isEn ? 'Parent' : 'વાલી', 
      icon: Users, 
      activeGradient: 'from-emerald-600 to-teal-600',
      activeGlow: 'shadow-emerald-500/20'
    },
    { 
      id: 'hr', 
      label: isEn ? 'HR Interview' : 'ઇન્ટરવ્યુ', 
      icon: Briefcase, 
      activeGradient: 'from-purple-600 to-pink-600',
      activeGlow: 'shadow-purple-500/20'
    },
  ];

  return (
    <header className="bg-slate-950/80 backdrop-blur-2xl text-white px-3 sm:px-6 py-2.5 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25 border border-amber-300/30 font-black text-xl text-white">
              સ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black tracking-tight text-white text-base sm:text-lg">
                  Saket <span className="text-amber-400 font-medium text-sm sm:text-base">(સાકેત)</span>
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 backdrop-blur-md">
                  ISL • GUJARATI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block tracking-wide">
                {isEn 
                  ? 'Gujarati Sign Language Learning & Inclusive Communication' 
                  : 'ગુજરાતી સંકેત ભાષા શિક્ષણ અને સમાવેશી સંવાદ'}
              </p>
            </div>
          </div>

          {/* Quick stats & language on mobile */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={() => setUiLanguage(isEn ? 'gu' : 'en')}
              className="px-2 py-1 rounded-xl text-[11px] font-bold border border-white/10 bg-white/5 backdrop-blur-md text-slate-200 flex items-center gap-1 active:scale-95 transition"
              title="Switch Language"
            >
              <Globe className="w-3 h-3 text-sky-400" />
              <span>{isEn ? 'EN' : 'ગુ'}</span>
            </button>
            {currentRole === 'student' && (
              <>
                <div className="flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 text-amber-300 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{student.totalStars}</span>
                </div>
                <div className="flex items-center gap-1 bg-orange-500/15 border border-orange-500/30 text-orange-400 px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-md">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{student.currentStreak}d</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Center / Role Selector Switcher */}
        <div className="p-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center flex-wrap sm:flex-nowrap gap-1">
          {roleConfigs.map(role => {
            const Icon = role.icon;
            const isActive = currentRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setCurrentRole(role.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap ${
                  isActive 
                    ? `bg-gradient-to-r ${role.activeGradient} text-white shadow-lg ${role.activeGlow} border border-white/25 scale-[1.02]` 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{role.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right utility buttons: Language toggle, Sound toggle, View toggle */}
        <div className="hidden md:flex items-center gap-2">
          {currentRole === 'student' && (
            <div className="flex items-center gap-2 mr-1">
              <div className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-400/25 text-amber-300 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{student.totalStars} {isEn ? 'Stars' : 'તારા'}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-orange-500/15 border border-orange-400/25 text-orange-400 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-sm">
                <Flame className="w-3.5 h-3.5" />
                <span>{student.currentStreak} {isEn ? 'Day Streak' : 'દિન'}</span>
              </div>
            </div>
          )}

          {/* Language Switcher Button (EN / GU) */}
          <button
            onClick={() => setUiLanguage(isEn ? 'gu' : 'en')}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 backdrop-blur-md transition-all flex items-center gap-1.5 shadow-sm"
            title="Switch UI Language / ભાષા બદલો"
          >
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            <span>{isEn ? 'EN' : 'ગુજરાતી'}</span>
            <span className="text-[10px] text-slate-400">({isEn ? 'English' : 'GU'})</span>
          </button>

          {/* Audio speech toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 backdrop-blur-md ${
              audioEnabled 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30 hover:bg-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]' 
                : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
            title={audioEnabled ? "Speech audio is ON (click to mute)" : "Speech audio is MUTED (click to enable)"}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            <span className="text-[11px]">{audioEnabled ? (isEn ? 'Audio On' : 'અવાજ ચાલુ') : (isEn ? 'Muted' : 'અવાજ બંધ')}</span>
          </button>

          {/* Mobile frame vs Full responsive toggle */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all backdrop-blur-md flex items-center gap-1.5 shadow-sm"
            title="Switch between Mobile Phone Frame and Full Screen"
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-4 h-4 text-sky-400" />
                <span className="text-[11px]">{isEn ? 'Full Screen' : 'ફુલ સ્ક્રીન'}</span>
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span className="text-[11px]">{isEn ? 'Phone Frame' : 'મોબાઇલ ફ્રેમ'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
