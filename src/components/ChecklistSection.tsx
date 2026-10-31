import React, { useState } from 'react';
import {
  Check,
  BookOpen,
  Plus,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  Circle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Category, ChecklistItem, StageId } from '../types';

interface ChecklistSectionProps {
  items: ChecklistItem[];
  onToggleComplete: (id: string) => void;
  onOpenGuide: (guideId: string) => void;
  onDeleteItem: (id: string) => void;
  onAddItem: (newItem: Omit<ChecklistItem, 'id' | 'isCompleted'>) => void;
  selectedStage: StageId | 'ALL';
}

const CATEGORIES: ('전체' | Category)[] = [
  '전체',
  '서류',
  '비자',
  '학사',
  '숙소/항공',
  '금융',
  '짐싸기',
  '생활/통신',
];

export const ChecklistSection: React.FC<ChecklistSectionProps> = ({
  items,
  onToggleComplete,
  onOpenGuide,
  onDeleteItem,
  onAddItem,
  selectedStage,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'전체' | Category>('전체');
  const [hideCompleted, setHideCompleted] = useState(false);
  const [onlyEssential, setOnlyEssential] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  // New item form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newStage, setNewStage] = useState<StageId>('D-30');
  const [newCategory, setNewCategory] = useState<Category>('서류');
  const [newIsEssential, setNewIsEssential] = useState(false);
  const [newDueDate, setNewDueDate] = useState('');

  // Filtering
  const filteredItems = items.filter((item) => {
    // Stage filter
    if (selectedStage !== 'ALL' && item.stageId !== selectedStage) {
      return false;
    }
    // Category filter
    if (selectedCategory !== '전체' && item.category !== selectedCategory) {
      return false;
    }
    // Hide completed
    if (hideCompleted && item.isCompleted) {
      return false;
    }
    // Only essential
    if (onlyEssential && !item.isEssential) {
      return false;
    }
    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCat) return false;
    }
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddItem({
      stageId: newStage,
      title: newTitle.trim(),
      description: newDesc.trim() || '개인 추가 준비 항목',
      category: newCategory,
      isEssential: newIsEssential,
      dueDateNote: newDueDate.trim() || undefined,
      isCustom: true,
    });

    setNewTitle('');
    setNewDesc('');
    setNewDueDate('');
    setIsAddFormOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 mb-8">
      {/* Header Bar: Title, Search, and Quick Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>체크리스트 준비 항목</span>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md font-mono tabular-nums">
              {filteredItems.length}개
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            항목을 클릭하여 완료 처리하고, 파란색 <BookOpen className="w-3.5 h-3.5 inline text-blue-600" /> 가이드 버튼을 눌러 서류 발급 상세 팁을 확인하세요.
          </p>
        </div>

        {/* Controls: Search and Add Button */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="준비물, 서류 검색..."
              className="pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-44 sm:w-56"
            />
          </div>

          <button
            onClick={() => setIsAddFormOpen(!isAddFormOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAddFormOpen ? '닫기' : '항목 추가'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Toggle Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        {/* Category Segmented Filter */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-3 text-xs text-slate-600 shrink-0">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 select-none">
            <input
              type="checkbox"
              checked={hideCompleted}
              onChange={(e) => setHideCompleted(e.target.checked)}
              className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span>미완료만 보기</span>
          </label>
          <span className="text-slate-300" aria-hidden="true">|</span>
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 select-none">
            <input
              type="checkbox"
              checked={onlyEssential}
              onChange={(e) => setOnlyEssential(e.target.checked)}
              className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span className="font-medium text-amber-700">필수 항목만</span>
          </label>
        </div>
      </div>

      {/* Inline Add Item Form */}
      {isAddFormOpen && (
        <form onSubmit={handleAddSubmit} className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>나만의 체크 항목 직접 추가하기</span>
            </span>
            <button
              type="button"
              onClick={() => setIsAddFormOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              취소
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">항목 이름 *</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="예: 기숙사 린넨 세트 주문, 증명사진 10장 인화"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">설명 또는 메모</label>
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="세부 내용이나 주의할 점"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">타임라인 단계</label>
              <select
                value={newStage}
                onChange={(e) => setNewStage(e.target.value as StageId)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="D-180">D-180 (초기 서류)</option>
                <option value="D-90">D-90 (비자/수강신청)</option>
                <option value="D-30">D-30 (숙소/항공권)</option>
                <option value="D-7">D-7 (짐싸기/환전)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">카테고리</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as Category)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="서류">서류</option>
                <option value="비자">비자</option>
                <option value="학사">학사</option>
                <option value="숙소/항공">숙소/항공</option>
                <option value="금융">금융</option>
                <option value="짐싸기">짐싸기</option>
                <option value="생활/통신">생활/통신</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">목표 시점</label>
              <input
                type="text"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                placeholder="예: 출국 2주 전"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div className="flex items-end pb-1">
              <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={newIsEssential}
                  onChange={(e) => setNewIsEssential(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="font-semibold text-amber-700">필수 항목 지정</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
            >
              항목 저장
            </button>
          </div>
        </form>
      )}

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <div className="py-12 text-center text-slate-400">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
          <p className="text-sm font-medium text-slate-600">조건에 맞는 체크리스트 항목이 없습니다.</p>
          <p className="text-xs text-slate-400 mt-1">필터 조건을 재설정하거나 우측 상단에서 새 항목을 추가해보세요.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`group flex items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl border transition-all duration-150 ${
                item.isCompleted
                  ? 'bg-slate-50/80 border-slate-200/60 opacity-80'
                  : 'bg-white border-slate-200/80 hover:border-blue-300 hover:shadow-xs'
              }`}
            >
              {/* Left: Checkbox + Content */}
              <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                {/* Custom Checkbox */}
                <button
                  type="button"
                  onClick={() => onToggleComplete(item.id)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors mt-0.5 sm:mt-0 ${
                    item.isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'border-2 border-slate-300 hover:border-blue-500 bg-white'
                  }`}
                  aria-label={item.isCompleted ? '완료 해제' : '완료 체크'}
                >
                  {item.isCompleted && <Check className="w-4 h-4 stroke-[2.5]" />}
                </button>

                {/* Text Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-2">
                    <span
                      onClick={() => onToggleComplete(item.id)}
                      className={`text-sm font-semibold cursor-pointer transition-colors ${
                        item.isCompleted
                          ? 'line-through text-slate-400'
                          : 'text-slate-900 group-hover:text-blue-600'
                      }`}
                    >
                      {item.title}
                    </span>

                    {/* Unboxed Metadata (Zero-Pill Discipline) */}
                    <span className="text-[11px] text-slate-400 font-mono tracking-tight">
                      {item.stageId}
                    </span>
                    <span className="text-slate-300 text-xs" aria-hidden="true">·</span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {item.category}
                    </span>
                    {item.isEssential && (
                      <>
                        <span className="text-slate-300 text-xs" aria-hidden="true">·</span>
                        <span className="text-[11px] text-amber-600 font-semibold">
                          필수
                        </span>
                      </>
                    )}
                    {item.dueDateNote && (
                      <>
                        <span className="text-slate-300 text-xs" aria-hidden="true">·</span>
                        <span className="text-[11px] text-slate-400">
                          {item.dueDateNote}
                        </span>
                      </>
                    )}
                  </div>

                  <p
                    className={`text-xs mt-0.5 line-clamp-1 sm:line-clamp-none ${
                      item.isCompleted ? 'line-through text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Right: Actions (Guide Modal Trigger & Delete) */}
              <div className="flex items-center gap-2 shrink-0 self-center">
                {item.guideId && (
                  <button
                    type="button"
                    onClick={() => onOpenGuide(item.guideId!)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors whitespace-nowrap"
                    title="상세 발급 가이드 및 꿀팁 보기"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>가이드 팁</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onDeleteItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 p-1.5 rounded-lg hover:bg-slate-100 transition-all"
                  title="항목 삭제"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
