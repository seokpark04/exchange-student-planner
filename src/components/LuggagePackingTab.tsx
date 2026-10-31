import React, { useState } from 'react';
import { Luggage, Check, Plus, Trash2, Backpack, Briefcase, FileCheck, Sparkles } from 'lucide-react';

export interface PackingItem {
  id: string;
  bagType: 'carry-on' | 'checked' | 'documents';
  title: string;
  isPacked: boolean;
  notes?: string;
}

const DEFAULT_PACKING_ITEMS: PackingItem[] = [
  // 서류 & 귀중품 파우치
  { id: 'pack-01', bagType: 'documents', title: '여권 원본 및 여권 사본 3장', isPacked: true, notes: '기내 소지' },
  { id: 'pack-02', bagType: 'documents', title: '입학허가서(CoE/I-20) 하드카피 3장', isPacked: true, notes: '입국심사 대비' },
  { id: 'pack-03', bagType: 'documents', title: '비자 승인서/확인증 원본', isPacked: false, notes: '기내 가방' },
  { id: 'pack-04', bagType: 'documents', title: '영문 잔고증명서 & 보험증권 출력본', isPacked: false },
  { id: 'pack-05', bagType: 'documents', title: '국제학생증 (ISIC) 및 국제운전면허증', isPacked: false },
  { id: 'pack-06', bagType: 'documents', title: '트래블카드 2종 및 소액 비상 현금(10~20만원)', isPacked: true },
  { id: 'pack-07', bagType: 'documents', title: '여권용 증명사진 10장 여유분', isPacked: false, notes: '현지 학생증/교통카드 발급용' },

  // 기내용 가방 (Carry-on)
  { id: 'pack-11', bagType: 'carry-on', title: '노트북 및 태블릿 & 충전기', isPacked: true, notes: '위탁 수하물 불가' },
  { id: 'pack-12', bagType: 'carry-on', title: '보조배터리 2개 (10,000~20,000mAh)', isPacked: false, notes: '위탁 절대 금지, 기내만 가능' },
  { id: 'pack-13', bagType: 'carry-on', title: '도착 당일 갈아입을 여벌 옷 1벌', isPacked: false, notes: '수하물 지연/분실 대비' },
  { id: 'pack-14', bagType: 'carry-on', title: '유선 이어폰 및 노이즈캔슬링 헤드폰', isPacked: false },
  { id: 'pack-15', bagType: 'carry-on', title: '기내용 칫솔/치약(100ml 이하) 및 안대/목베개', isPacked: false },
  { id: 'pack-16', bagType: 'carry-on', title: '현지 통신사 eSIM QR코드 출력본', isPacked: false },

  // 위탁 수하물 (Checked)
  { id: 'pack-21', bagType: 'checked', title: '국가별 규격 멀티 플러그 어댑터 2개', isPacked: false, notes: '한국 규격과 비교 필수' },
  { id: 'pack-22', bagType: 'checked', title: '3~4구 멀티탭 (선길이 1.5m~2m)', isPacked: false, notes: '기숙사 콘센트 위치 대비' },
  { id: 'pack-23', bagType: 'checked', title: '한국 종합 상비약 세트', isPacked: false, notes: '감기약, 지사제, 소화제, 진통제, 밴드' },
  { id: 'pack-24', bagType: 'checked', title: '사계절 기본 의류 및 압축팩 패킹', isPacked: false },
  { id: 'pack-25', bagType: 'checked', title: '한식 비상식량 (블럭국, 볶음김치, 튜브고추장)', isPacked: false, notes: '육류 가공품은 세관 규정 체크' },
  { id: 'pack-26', bagType: 'checked', title: '도착 첫날용 여행용 세면도구 세트', isPacked: false },
  { id: 'pack-27', bagType: 'checked', title: '여분 안경 또는 6개월분 콘택트렌즈', isPacked: false, notes: '해외 안과 처방비 매우 비쌈' },
  { id: 'pack-28', bagType: 'checked', title: '손톱깎이 세트 및 실과 바늘', isPacked: false },
];

export const LuggagePackingTab: React.FC = () => {
  const [items, setItems] = useState<PackingItem[]>(() => {
    const saved = localStorage.getItem('global_buddy_packing');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_PACKING_ITEMS;
      }
    }
    return DEFAULT_PACKING_ITEMS;
  });

  const [activeBag, setActiveBag] = useState<'all' | 'documents' | 'carry-on' | 'checked'>('all');
  const [newTitle, setNewTitle] = useState('');
  const [newBagType, setNewBagType] = useState<'documents' | 'carry-on' | 'checked'>('checked');

  const saveItems = (updated: PackingItem[]) => {
    setItems(updated);
    localStorage.setItem('global_buddy_packing', JSON.stringify(updated));
  };

  const togglePacked = (id: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, isPacked: !item.isPacked } : item
    );
    saveItems(updated);
  };

  const deleteItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    saveItems(updated);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: PackingItem = {
      id: `pack-custom-${Date.now()}`,
      bagType: newBagType,
      title: newTitle.trim(),
      isPacked: false,
    };

    saveItems([newItem, ...items]);
    setNewTitle('');
  };

  const total = items.length;
  const packedCount = items.filter((i) => i.isPacked).length;
  const percent = total > 0 ? Math.round((packedCount / total) * 100) : 0;

  const filteredItems = items.filter((item) => {
    if (activeBag === 'all') return true;
    return item.bagType === activeBag;
  });

  const getBagName = (bag: 'documents' | 'carry-on' | 'checked') => {
    switch (bag) {
      case 'documents':
        return '서류/귀중품';
      case 'carry-on':
        return '기내 수하물';
      case 'checked':
        return '위탁 수하물';
    }
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Top Banner with Packing Progress */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Luggage className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                캐리어 짐싸기 올인원 체크리스트
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                기내 반입 불가/위탁 금지 품목을 철저히 분리하여 공항에서 당황하지 마세요.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-bold text-slate-900 font-mono tabular-nums">
              {packedCount}/{total} 짐싸기 완료 ({percent}%)
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Bag Type Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <button
            onClick={() => setActiveBag('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeBag === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            전체 짐 ({total})
          </button>
          <button
            onClick={() => setActiveBag('documents')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors inline-flex items-center gap-1.5 ${
              activeBag === 'documents'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>서류 및 귀중품</span>
          </button>
          <button
            onClick={() => setActiveBag('carry-on')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors inline-flex items-center gap-1.5 ${
              activeBag === 'carry-on'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Backpack className="w-3.5 h-3.5" />
            <span>기내용 가방 (위탁 금지)</span>
          </button>
          <button
            onClick={() => setActiveBag('checked')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors inline-flex items-center gap-1.5 ${
              activeBag === 'checked'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>위탁 수하물 캐리어</span>
          </button>
        </div>
      </div>

      {/* Add New Packing Item Input */}
      <form onSubmit={handleAddItem} className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 shrink-0">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>준비물 추가:</span>
        </div>
        <select
          value={newBagType}
          onChange={(e) => setNewBagType(e.target.value as any)}
          className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 shrink-0"
        >
          <option value="checked">위탁 수하물</option>
          <option value="carry-on">기내용 가방</option>
          <option value="documents">서류/귀중품</option>
        </select>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="예: 전기장판(미니), 헤어드라이어, 여분 안경..."
          className="flex-1 w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors shrink-0 self-end sm:self-auto"
        >
          패킹 리스트에 추가
        </button>
      </form>

      {/* Packing Items Grid / List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="space-y-2.5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`group flex items-center justify-between gap-3 p-3 rounded-xl border transition-all ${
                item.isPacked
                  ? 'bg-slate-50/70 border-slate-200/50 opacity-75'
                  : 'bg-white border-slate-200/90 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => togglePacked(item.id)}
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                    item.isPacked
                      ? 'bg-indigo-600 text-white'
                      : 'border-2 border-slate-300 hover:border-indigo-500 bg-white'
                  }`}
                >
                  {item.isPacked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      onClick={() => togglePacked(item.id)}
                      className={`text-xs sm:text-sm font-semibold cursor-pointer ${
                        item.isPacked ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {item.title}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {getBagName(item.bagType)}
                    </span>
                    {item.notes && (
                      <>
                        <span className="text-slate-300 text-xs" aria-hidden="true">·</span>
                        <span className="text-[11px] text-indigo-600 font-medium">
                          {item.notes}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => deleteItem(item.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 p-1 rounded-md transition-all shrink-0"
                title="삭제"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
