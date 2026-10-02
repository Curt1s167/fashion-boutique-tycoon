export type JourneyDayNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | number;

export interface JourneyGoal {
  id: string;
  title: string;
  hint: string;
  icon: string;
  targetCount: number;
  currentCount: number;
  isCompleted: boolean;
}

export interface JourneyDayMeta {
  dayNumber: number;
  theme: string;
  subtitle: string;
  mascotMood: 'excited' | 'proud' | 'thinking' | 'busy' | 'celebrating';
  storyOpening: string;
  learningInsight: string;
  whyExplanation: {
    question: string;
    answers: string[];
    proTip: string;
  };
  goals: JourneyGoal[];
  unlockedFeatureLabel?: string;
  coachingTips: string[];
}

export type Week2FocusChoice = 
  | 'INVENTORY'         // Tồn kho đa dạng & đủ size
  | 'SERVICE'           // Dịch vụ chu đáo & phòng thử VIP
  | 'COST_EFFICIENCY'   // Tối ưu chi phí & dòng tiền
  | 'BRAND_REPUTATION'; // Phát triển thương hiệu & chuỗi shop

export interface Week2FocusMeta {
  id: Week2FocusChoice;
  title: string;
  subtitle: string;
  emoji: string;
  colorClass: string;
  badge: string;
  benefit: string;
  description: string;
}
