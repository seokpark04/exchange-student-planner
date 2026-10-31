import React from 'react';
import { Compass, Settings2, Plus, Luggage } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenAddItem: () => void;
  activeView: 'checklist' | 'country-tips' | 'packing';
  setActiveView: (view: 'checklist' | 'country-tips' | 'packing') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onOpenAddItem,
  activeView,
  setActiveView,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
            <Compass className="w-5 h-5" />
          </div>
          <button
            onClick={() => setActiveView('checklist')}
            className="text-left font-bold text-slate-900 tracking-tight text-lg hover:text-blue-600 transition-colors whitespace-nowrap"
          >
            글로벌 버디 패키저
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveView('checklist')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeView === 'checklist'
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                : 'hover:text-slate-900'
            }`}
          >
            D-Day 타임라인
          </button>
          <button
            onClick={() => setActiveView('country-tips')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeView === 'country-tips'
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                : 'hover:text-slate-900'
            }`}
          >
            국가별 가이드 & 비자
          </button>
          <button
            onClick={() => setActiveView('packing')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeView === 'packing'
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                : 'hover:text-slate-900'
            }`}
          >
            캐리어 짐싸기 체크
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAddItem}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            title="새 체크 항목 추가"
          >
            <Plus className="w-4 h-4 text-blue-600" />
            <span>항목 추가</span>
          </button>
          <button
            onClick={onOpenSettings}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm shadow-blue-500/25 transition-colors whitespace-nowrap"
          >
            <Settings2 className="w-4 h-4" />
            <span>파견 조건 설정</span>
          </button>
        </div>
      </div>
    </header>
  );
};
