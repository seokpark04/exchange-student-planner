import React from 'react';
import { Calendar, Globe2, School, Sparkles, CheckCircle2, RotateCcw, Printer, Edit3 } from 'lucide-react';
import { StudentProfile } from '../types';

interface ProfileBannerProps {
  profile: StudentProfile;
  completedCount: number;
  totalCount: number;
  onEditProfile: () => void;
  onResetData: () => void;
  onPrint: () => void;
  countryFlag: string;
}

export const ProfileBanner: React.FC<ProfileBannerProps> = ({
  profile,
  completedCount,
  totalCount,
  onEditProfile,
  onResetData,
  onPrint,
  countryFlag,
}) => {
  // Calculate D-Day from departure date to current date
  const calculateDDay = (targetDateStr: string): { label: string; days: number; isPast: boolean } => {
    try {
      const target = new Date(targetDateStr);
      const today = new Date();
      // Reset hours to midnight for date-only comparison
      target.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      const diffTime = target.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return { label: 'D-Day', days: 0, isPast: false };
      } else if (diffDays > 0) {
        return { label: `D-${diffDays}`, days: diffDays, isPast: false };
      } else {
        return { label: `D+${Math.abs(diffDays)}`, days: Math.abs(diffDays), isPast: true };
      }
    } catch {
      return { label: 'D-30', days: 30, isPast: false };
    }
  };

  const dDayInfo = calculateDDay(profile.departureDate);
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Destination Info & D-Day */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col items-center justify-center shrink-0 text-center px-1">
            <span className="text-2xl leading-none">{countryFlag}</span>
            <span className="text-[11px] font-bold text-blue-700 tracking-tight mt-1 font-mono tabular-nums">
              {dDayInfo.label}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {profile.destinationCountry} 교환학생 준비
              </h1>
              <button
                onClick={onEditProfile}
                className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-slate-100"
                title="출국 정보 수정"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs sm:text-sm text-slate-500">
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <Globe2 className="w-3.5 h-3.5 text-blue-500" />
                {profile.destinationCountry}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <School className="w-3.5 h-3.5 text-slate-400" />
                {profile.targetUniversity || '파견교 미정'}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {profile.semester} (출국: {profile.departureDate})
              </span>
            </div>
          </div>
        </div>

        {/* Right: Real-time Progress Bar & Quick Controls */}
        <div className="flex flex-col sm:min-w-[320px] lg:max-w-md w-full bg-slate-50/70 rounded-xl p-4 border border-slate-200/60">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>전체 준비 완료율</span>
            </div>
            <div className="text-xs font-bold text-slate-900 font-mono tabular-nums">
              {completedCount}/{totalCount} 완료 · {progressPercent}%
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Sub actions */}
          <div className="flex items-center justify-between mt-3 text-xs text-slate-500 pt-2 border-t border-slate-200/60">
            <div className="flex items-center gap-2">
              <button
                onClick={onPrint}
                className="hover:text-slate-800 transition-colors inline-flex items-center gap-1 font-medium"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>체크리스트 인쇄</span>
              </button>
              <span aria-hidden="true">·</span>
              <button
                onClick={onResetData}
                className="hover:text-red-600 transition-colors inline-flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>초기화</span>
              </button>
            </div>

            <button
              onClick={onEditProfile}
              className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>조건 설정</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
