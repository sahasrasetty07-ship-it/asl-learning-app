import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  BookOpen, 
  Calculator, 
  Atom, 
  Languages, 
  BarChart3 
} from 'lucide-react';

export const Navigation = () => {
  const { activeTab, setActiveTab, uiLanguage } = useApp();
  const isEn = uiLanguage === 'en';

  const navItems = [
    { id: 'dashboard', label: isEn ? 'Home' : 'હોમ', subLabel: 'હોમ', icon: Home },
    { id: 'gujarati', label: isEn ? 'Gujarati' : 'ગુજરાતી', subLabel: 'મૂળાક્ષર', icon: BookOpen },
    { id: 'math', label: isEn ? 'Math' : 'ગણિત', subLabel: 'ઘડિયા', icon: Calculator },
    { id: 'science', label: isEn ? 'Science' : 'વિજ્ઞાન', subLabel: 'ખ્યાલો', icon: Atom },
    { id: 'translator', label: isEn ? 'Translate' : 'અનુવાદ', subLabel: 'ISL સાઇન', icon: Languages, highlight: true },
    { id: 'report', label: isEn ? 'Report' : 'પ્રગતિ', subLabel: 'પત્રક', icon: BarChart3 },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur border-t border-slate-200 px-1 py-1.5 shadow-lg flex items-center justify-around z-30 sticky bottom-0 w-full max-w-full overflow-hidden">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-1 sm:px-2 rounded-xl transition-all relative ${
              isActive 
                ? 'text-amber-600 font-bold' 
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            {item.highlight && (
              <span className="absolute -top-1 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            )}
            <div className={`p-1 rounded-lg ${isActive ? 'bg-amber-100 text-amber-700' : ''}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[11px] leading-tight mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
