export type StageId = 'D-180' | 'D-90' | 'D-30' | 'D-7';

export type Category = '서류' | '비자' | '학사' | '숙소/항공' | '금융' | '짐싸기' | '생활/통신';

export interface GuideDetail {
  id: string;
  title: string;
  subtitle: string;
  issuingAuthority: string;
  estimatedDays: string;
  requiredDocs: string[];
  importantTips: string[];
  commonMistakes: string[];
  countryNotes?: Record<string, string>;
}

export interface ChecklistItem {
  id: string;
  stageId: StageId;
  title: string;
  description: string;
  category: Category;
  isCompleted: boolean;
  isEssential: boolean;
  dueDateNote?: string;
  guideId?: string;
  isCustom?: boolean;
  memo?: string;
}

export interface StageMeta {
  id: StageId;
  title: string;
  subtitle: string;
  badge: string;
  timeframe: string;
  iconName: string;
  accentColor: string;
}

export interface StudentProfile {
  studentName: string;
  destinationCountry: string;
  semester: string;
  departureDate: string; // YYYY-MM-DD
  targetUniversity: string;
}

export interface CountryPreset {
  id: string;
  name: string;
  flag: string;
  visaType: string;
  currency: string;
  voltage: string;
  weatherTip: string;
  housingTip: string;
  mustPrep: string;
}
