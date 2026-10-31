import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { ProfileBanner } from './components/ProfileBanner';
import { TimelineStages } from './components/TimelineStages';
import { ChecklistSection } from './components/ChecklistSection';
import { GuideModal } from './components/GuideModal';
import { ProfileEditModal } from './components/ProfileEditModal';
import { CountryQuickTips } from './components/CountryQuickTips';
import { LuggagePackingTab } from './components/LuggagePackingTab';
import {
  COUNTRY_PRESETS,
  INITIAL_CHECKLIST,
  INITIAL_GUIDES,
  INITIAL_PROFILE,
  STAGES,
} from './data/mockData';
import { ChecklistItem, StageId, StudentProfile } from './types';

export default function App() {
  // 1. Student Profile State
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('global_buddy_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PROFILE;
      }
    }
    return INITIAL_PROFILE;
  });

  // 2. Checklist Items State
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem('global_buddy_checklist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_CHECKLIST;
      }
    }
    return INITIAL_CHECKLIST;
  });

  // 3. UI Navigation State
  const [activeView, setActiveView] = useState<'checklist' | 'country-tips' | 'packing'>('checklist');
  const [selectedStage, setSelectedStage] = useState<StageId | 'ALL'>('ALL');
  const [activeGuideId, setActiveGuideId] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('global_buddy_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('global_buddy_checklist', JSON.stringify(items));
  }, [items]);

  // Current Country Preset for flag & data
  const currentPreset =
    COUNTRY_PRESETS.find((c) => c.name === profile.destinationCountry) || {
      id: 'custom',
      name: profile.destinationCountry,
      flag: '✈️',
      visaType: '학생 비자 및 입학허가서 요건 확인 필요',
      currency: '현지 통화',
      voltage: '220~240V',
      weatherTip: '현지 기후 및 계절성 기온 확인',
      housingTip: '캠퍼스 내 기숙사 우선 신청',
      mustPrep: '공식 입학허가서 및 여권 사본',
    };

  // Toggle item completion
  const handleToggleComplete = (id: string) => {
    setItems((prev) => {
      const next = prev.map((item) => {
        if (item.id === id) {
          const willBeCompleted = !item.isCompleted;
          if (willBeCompleted) {
            // Mini celebration
            try {
              confetti({
                particleCount: 25,
                spread: 45,
                origin: { y: 0.8 },
                colors: ['#2563EB', '#38BDF8', '#10B981'],
              });
            } catch {
              // fallback gracefully
            }
          }
          return { ...item, isCompleted: willBeCompleted };
        }
        return item;
      });

      // Check if all are completed for big celebration
      const total = next.length;
      const completed = next.filter((i) => i.isCompleted).length;
      if (total > 0 && completed === total) {
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}
      }

      return next;
    });
  };

  // Delete item
  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Add custom item
  const handleAddItem = (newItem: Omit<ChecklistItem, 'id' | 'isCompleted'>) => {
    const itemWithId: ChecklistItem = {
      ...newItem,
      id: `custom-item-${Date.now()}`,
      isCompleted: false,
    };
    setItems((prev) => [itemWithId, ...prev]);
  };

  // Reset to default sample
  const handleResetData = () => {
    if (window.confirm('체크리스트를 초기 기본 데이터로 재설정하시겠습니까?')) {
      setItems(INITIAL_CHECKLIST);
      setProfile(INITIAL_PROFILE);
      localStorage.removeItem('global_buddy_checklist');
      localStorage.removeItem('global_buddy_profile');
      localStorage.removeItem('global_buddy_packing');
    }
  };

  // Print checklist
  const handlePrint = () => {
    window.print();
  };

  // Switch country from quick tips
  const handleApplyCountry = (countryName: string) => {
    setProfile((prev) => ({
      ...prev,
      destinationCountry: countryName,
    }));
    setActiveView('checklist');
  };

  const completedCount = items.filter((i) => i.isCompleted).length;
  const totalCount = items.length;

  // Active guide for modal
  const activeGuide = activeGuideId ? INITIAL_GUIDES[activeGuideId] : null;
  const guideLinkedItem = activeGuideId
    ? items.find((i) => i.guideId === activeGuideId)
    : undefined;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* 1. Header (Top Bar Contract) */}
      <Header
        onOpenSettings={() => setIsProfileModalOpen(true)}
        onOpenAddItem={() => {
          setActiveView('checklist');
          // Smooth scroll to checklist
          const el = document.getElementById('checklist-container');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Onboarding & Live D-Day Banner */}
        <ProfileBanner
          profile={profile}
          completedCount={completedCount}
          totalCount={totalCount}
          onEditProfile={() => setIsProfileModalOpen(true)}
          onResetData={handleResetData}
          onPrint={handlePrint}
          countryFlag={currentPreset.flag}
        />

        {/* View Switcher Tabs (For mobile or secondary navigation) */}
        <div className="flex md:hidden items-center justify-center p-1 bg-slate-200/60 rounded-xl mb-6">
          <button
            onClick={() => setActiveView('checklist')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeView === 'checklist' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            타임라인
          </button>
          <button
            onClick={() => setActiveView('country-tips')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeView === 'country-tips' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            국가별 가이드
          </button>
          <button
            onClick={() => setActiveView('packing')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeView === 'packing' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            짐싸기 체크
          </button>
        </div>

        {/* Dynamic View Content */}
        {activeView === 'checklist' && (
          <div id="checklist-container">
            {/* 4-Stage Timeline Cards */}
            <TimelineStages
              stages={STAGES}
              selectedStage={selectedStage}
              onSelectStage={setSelectedStage}
              items={items}
            />

            {/* Checklist Section */}
            <ChecklistSection
              items={items}
              onToggleComplete={handleToggleComplete}
              onOpenGuide={(guideId) => setActiveGuideId(guideId)}
              onDeleteItem={handleDeleteItem}
              onAddItem={handleAddItem}
              selectedStage={selectedStage}
            />
          </div>
        )}

        {activeView === 'country-tips' && (
          <CountryQuickTips
            countryPresets={COUNTRY_PRESETS}
            currentCountryName={profile.destinationCountry}
            onApplyCountry={handleApplyCountry}
          />
        )}

        {activeView === 'packing' && <LuggagePackingTab />}
      </main>

      {/* 3. Guide Modal */}
      <GuideModal
        guide={activeGuide}
        isOpen={!!activeGuideId}
        onClose={() => setActiveGuideId(null)}
        destinationCountry={profile.destinationCountry}
        onMarkComplete={
          guideLinkedItem ? () => handleToggleComplete(guideLinkedItem.id) : undefined
        }
        isItemCompleted={guideLinkedItem?.isCompleted}
      />

      {/* 4. Profile / Onboarding Edit Modal */}
      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSave={(updated) => setProfile(updated)}
        countryPresets={COUNTRY_PRESETS}
      />

      {/* 5. Clean Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">글로벌 버디 패키저</span>
            <span aria-hidden="true">·</span>
            <span>성공적인 해외 교환학생 & 유학 준비 파트너</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <span>D-Day 타임라인</span>
            <span aria-hidden="true">·</span>
            <span>서류 발급 꿀팁</span>
            <span aria-hidden="true">·</span>
            <span>로컬 데이터 자동 저장</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
