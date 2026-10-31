import React from 'react';
import { FileCheck, Stamp, PlaneTakeoff, Luggage, Check, ChevronRight } from 'lucide-react';
import { ChecklistItem, StageId, StageMeta } from '../types';

interface TimelineStagesProps {
  stages: StageMeta[];
  selectedStage: StageId | 'ALL';
  onSelectStage: (stageId: StageId | 'ALL') => void;
  items: ChecklistItem[];
}

export const TimelineStages: React.FC<TimelineStagesProps> = ({
  stages,
  selectedStage,
  onSelectStage,
  items,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileCheck':
        return <FileCheck className="w-5 h-5" />;
      case 'Stamp':
        return <Stamp className="w-5 h-5" />;
      case 'PlaneTakeoff':
        return <PlaneTakeoff className="w-5 h-5" />;
      case 'Luggage':
        return <Luggage className="w-5 h-5" />;
      default:
        return <FileCheck className="w-5 h-5" />;
    }
  };

  const getStageStats = (stageId: StageId) => {
    const stageItems = items.filter((item) => item.stageId === stageId);
    const total = stageItems.length;
    const completed = stageItems.filter((item) => item.isCompleted).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const isAllDone = total > 0 && completed === total;
    return { total, completed, percent, isAllDone };
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">D-Day 단계별 타임라인</h2>
          <p className="text-xs text-slate-500">단계 카드를 클릭하여 해당 시점의 집중 준비 항목을 필터링하세요.</p>
        </div>
        <button
          onClick={() => onSelectStage('ALL')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            selectedStage === 'ALL'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          전체 보기
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {stages.map((stage) => {
          const stats = getStageStats(stage.id);
          const isSelected = selectedStage === stage.id;

          return (
            <div
              key={stage.id}
              onClick={() => onSelectStage(stage.id)}
              className={`relative cursor-pointer rounded-xl p-4 transition-all duration-200 border text-left flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div>
                {/* Header row: ID + Badge + Done icon */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-slate-900 tracking-tight">
                      {stage.id}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      {stage.timeframe}
                    </span>
                  </div>

                  {stats.isAllDone ? (
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                      {getIcon(stage.iconName)}
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-slate-900 mb-1 leading-snug">
                  {stage.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                  {stage.subtitle}
                </p>
              </div>

              {/* Progress Bar & Stats */}
              <div className="pt-2 border-t border-slate-200/60 mt-auto">
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 mb-1.5 font-mono tabular-nums">
                  <span>{stats.completed}/{stats.total} 완료</span>
                  <span className="font-bold text-slate-900">{stats.percent}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      stats.isAllDone ? 'bg-emerald-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${stats.percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
