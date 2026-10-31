import React, { useState } from 'react';
import { X, Globe2, Calendar, School, Check, User } from 'lucide-react';
import { CountryPreset, StudentProfile } from '../types';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onSave: (updated: StudentProfile) => void;
  countryPresets: CountryPreset[];
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
  countryPresets,
}) => {
  const [formData, setFormData] = useState<StudentProfile>(profile);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleCountrySelect = (countryName: string) => {
    setFormData((prev) => ({ ...prev, destinationCountry: countryName }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              ✈️
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">파견 조건 & D-Day 설정</h2>
              <p className="text-xs text-slate-500">나의 파견 계획에 맞춰 타임라인과 체크리스트가 최적화됩니다.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quick Country Preset Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              인기 파견 국가 빠른 선택
            </label>
            <div className="grid grid-cols-3 gap-1.5 mb-2">
              {countryPresets.map((c) => {
                const isSelected = formData.destinationCountry === c.name;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleCountrySelect(c.name)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border text-left transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-base">{c.flag}</span>
                    <span className="truncate">{c.name}</span>
                    {isSelected && <Check className="w-3 h-3 text-blue-600 ml-auto shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Direct Input for Country */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              파견 국가 직접 입력
            </label>
            <div className="relative">
              <Globe2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={formData.destinationCountry}
                onChange={(e) => setFormData({ ...formData, destinationCountry: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="예: 네덜란드, 미국, 독일, 스웨덴 등"
                required
              />
            </div>
          </div>

          {/* Target University */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              파견 대학교 (교환교)
            </label>
            <div className="relative">
              <School className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={formData.targetUniversity}
                onChange={(e) => setFormData({ ...formData, targetUniversity: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="예: 암스테르담 대학교, UCLA, 와세다 대학교 등"
              />
            </div>
          </div>

          {/* Grid: Semester & Departure Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                파견 학기
              </label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="2026 가을학기">2026 가을학기</option>
                <option value="2027 봄학기">2027 봄학기</option>
                <option value="2027 가을학기">2027 가을학기</option>
                <option value="2028 봄학기">2028 봄학기</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                출국 예정일 (D-Day 기준일)
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="date"
                  value={formData.departureDate}
                  onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Student Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              준비생 닉네임 / 이름
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="예: 민지"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/25 transition-colors"
            >
              설정 저장하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
