import React, { useState } from 'react';
import { Globe2, Zap, Coins, ShieldCheck, Home, CloudSun, Check, ArrowRight } from 'lucide-react';
import { CountryPreset } from '../types';

interface CountryQuickTipsProps {
  countryPresets: CountryPreset[];
  currentCountryName: string;
  onApplyCountry: (countryName: string) => void;
}

export const CountryQuickTips: React.FC<CountryQuickTipsProps> = ({
  countryPresets,
  currentCountryName,
  onApplyCountry,
}) => {
  // Find index of current country or default to first
  const activePresetIndex = countryPresets.findIndex((c) => c.name === currentCountryName);
  const [selectedId, setSelectedId] = useState<string>(
    activePresetIndex !== -1 ? countryPresets[activePresetIndex].id : countryPresets[0].id
  );

  const activeCountry = countryPresets.find((c) => c.id === selectedId) || countryPresets[0];
  const isCurrentCountry = activeCountry.name === currentCountryName;

  return (
    <div className="space-y-6 mb-8">
      {/* Top Selector Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-blue-600" />
            <span>주요 교환학생 파견국 정보 & 비자 가이드</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">원하는 국가를 클릭해 현지 생활 팁을 비교해보세요.</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
          {countryPresets.map((country) => {
            const isSelected = country.id === activeCountry.id;
            const isStudentCountry = country.name === currentCountryName;

            return (
              <button
                key={country.id}
                onClick={() => setSelectedId(country.id)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20 font-bold'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="text-2xl mb-1">{country.flag}</span>
                <span className="text-xs truncate w-full">{country.name}</span>
                {isStudentCountry && (
                  <span className="text-[10px] text-blue-600 font-semibold mt-0.5">내 파견국</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Country Detail Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{activeCountry.flag}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-slate-900">{activeCountry.name} 파견 핵심 요약</h3>
                {isCurrentCountry && (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    현재 설정된 파견국
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                현지 비자 유형 및 출국 전 숙소/전압/화폐 사전 필수 점검 리스트
              </p>
            </div>
          </div>

          {!isCurrentCountry && (
            <button
              onClick={() => onApplyCountry(activeCountry.name)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/25 transition-colors self-start sm:self-auto"
            >
              <span>{activeCountry.name}(으)로 내 파견국 변경</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 6 Key Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Visa */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>비자 및 체류허가</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {activeCountry.visaType}
            </p>
          </div>

          {/* 2. Currency */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1.5">
              <Coins className="w-4 h-4 text-amber-600" />
              <span>통화 및 화폐</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {activeCountry.currency}
            </p>
          </div>

          {/* 3. Voltage */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1.5">
              <Zap className="w-4 h-4 text-purple-600" />
              <span>전압 및 플러그 규격</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {activeCountry.voltage}
            </p>
          </div>

          {/* 4. Housing */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1.5">
              <Home className="w-4 h-4 text-emerald-600" />
              <span>숙소 / 기숙사 팁</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {activeCountry.housingTip}
            </p>
          </div>

          {/* 5. Weather */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1.5">
              <CloudSun className="w-4 h-4 text-cyan-600" />
              <span>기후 및 의류 조언</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {activeCountry.weatherTip}
            </p>
          </div>

          {/* 6. Must Prep */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-950 mb-1.5">
              <Check className="w-4 h-4 text-blue-600" />
              <span>출국 전 필수 서류 & 사전 준비</span>
            </div>
            <p className="text-xs text-blue-900 leading-relaxed font-medium">
              {activeCountry.mustPrep}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
