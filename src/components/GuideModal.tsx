import React from 'react';
import {
  X,
  BookOpen,
  Clock,
  Building2,
  FileCheck2,
  AlertTriangle,
  Lightbulb,
  Check,
  Globe2,
} from 'lucide-react';
import { GuideDetail } from '../types';

interface GuideModalProps {
  guide: GuideDetail | null;
  isOpen: boolean;
  onClose: () => void;
  destinationCountry: string;
  onMarkComplete?: () => void;
  isItemCompleted?: boolean;
}

export const GuideModal: React.FC<GuideModalProps> = ({
  guide,
  isOpen,
  onClose,
  destinationCountry,
  onMarkComplete,
  isItemCompleted,
}) => {
  if (!isOpen || !guide) return null;

  // Check if there is a country-specific tip for the student's selected country
  const countrySpecificTip = guide.countryNotes?.[destinationCountry];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200 shrink-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-blue-600 font-mono">DOCUMENT GUIDE</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 leading-snug">{guide.title}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{guide.subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto py-5 space-y-6 text-sm text-slate-700 pr-1">
          {/* Key Quick Facts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>발급처 / 접수처</span>
              </div>
              <p className="text-xs font-bold text-slate-900">{guide.issuingAuthority}</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>예상 소요 기간</span>
              </div>
              <p className="text-xs font-bold text-slate-900 font-mono">{guide.estimatedDays}</p>
            </div>
          </div>

          {/* Country-Specific Alert if available */}
          {countrySpecificTip && (
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900 mb-1">
                <Globe2 className="w-4 h-4 text-blue-600" />
                <span>{destinationCountry} 파견 맞춤 특이사항</span>
              </div>
              <p className="text-xs text-blue-800 leading-relaxed">{countrySpecificTip}</p>
            </div>
          )}

          {/* Required Docs / Checklist */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-slate-500" />
              <span>필수 지참 및 사전 확인 사항</span>
            </h3>
            <ul className="space-y-2">
              {guide.requiredDocs.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50/50 p-2 rounded-lg border border-slate-200/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Important Tips & Precautions */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>선배 교환학생들의 핵심 꿀팁</span>
            </h3>
            <div className="space-y-2.5">
              {guide.importantTips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-800 bg-amber-50/40 p-3 rounded-xl border border-amber-200/50">
                  <span className="font-mono text-amber-700 font-bold shrink-0">0{idx + 1}.</span>
                  <p className="leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Common Mistakes */}
          {guide.commonMistakes && guide.commonMistakes.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-red-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span>자주 발생하는 실수 (반려 주의)</span>
              </h3>
              <ul className="space-y-2">
                {guide.commonMistakes.map((mistake, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-red-800 bg-red-50/40 p-2.5 rounded-lg border border-red-200/50">
                    <span className="text-red-500 font-bold shrink-0">✕</span>
                    <span className="leading-relaxed">{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400">
            {isItemCompleted ? '✓ 체크리스트에서 완료됨' : '아직 미완료된 항목입니다'}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              닫기
            </button>
            {onMarkComplete && !isItemCompleted && (
              <button
                onClick={() => {
                  onMarkComplete();
                  onClose();
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/25 transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>체크 완료하기</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
