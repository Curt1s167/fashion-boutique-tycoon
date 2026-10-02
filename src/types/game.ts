export type FashionCategory = 
  | 'tops' 
  | 'bottoms' 
  | 'footwear' 
  | 'bags' 
  | 'outerwear' 
  | 'accessories';

export interface ProductVariant {
  id: string; // SKU code
  styleId: string;
  colorName: string;
  colorHex: string;
  size: string;
  costPrice: number;
  sellPrice: number;
  floorStock: number;    // Số lượng trên kệ bán lẻ
  backroomStock: number; // Số lượng trong kho phía sau
  reserved: number;
  salesCount: number;
}

export interface ProductStyle {
  id: string;
  name: string;
  category: FashionCategory;
  categoryLabel: string;
  emoji: string;
  styleTags: string[];
  description: string;
  supplierId: string;
  baseCost: number;
  basePrice: number;
  shelfCapacity: number;
  variants: ProductVariant[];
  unlocked: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  leadTimeSeconds: number;
  minOrderQty: number;
  rating: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  styleId: string;
  styleName: string;
  variantId: string;
  variantDesc: string;
  quantity: number;
  totalCost: number;
  secondsRemaining: number;
  status: 'shipping' | 'received';
}

export interface ReturnExchange {
  id: string;
  customerName: string;
  customerAvatar: string;
  styleName: string;
  variantDesc: string;
  reason: 'wrong_size' | 'color_mismatch' | 'style_change';
  reasonText: string;
  refundAmount: number;
  state: 'pending' | 'resolved' | 'rejected';
}

export interface OnlineOrder {
  id: string;
  customerName: string;
  customerAvatar: string;
  styleName: string;
  variantDesc: string;
  totalAmount: number;
  status: 'packing' | 'shipping' | 'delivered';
  progress: number;
}

export interface LookbookOutfit {
  id: string;
  title: string;
  concept: string;
  styleIds: string[];
  bonusText: string;
  isCompleted: boolean;
  expReward: number;
}

export interface SocialPost {
  id: string;
  author: string;
  avatar: string;
  tag: string;
  content: string;
  likes: number;
  timestamp: string;
  trendBonus?: string;
}

export type StaffRole = 
  | 'manager'     // Quản lý cửa hàng (Store Manager)
  | 'sales'       // Stylist tư vấn bán lẻ (Sales Advisor)
  | 'cashier'     // Thu ngân quầy POS (Cashier)
  | 'stock'       // Nhân viên kho vận (Stock Associate)
  | 'fitting'     // Trợ lý phòng thử đồ (Fitting Room Assistant)
  | 'cleaning';   // Nhân viên vệ sinh (Cleaning Staff)

export type WorkShift = 'morning' | 'afternoon' | 'evening';

export interface Employee {
  id: string;
  name: string;
  avatar: string;
  role: StaffRole;
  roleLabel: string;
  wagePerDay: number;
  skillLevel: number; // 1 - 5 sao
  morale: number;     // 0 - 100%
  energy: number;     // 0 - 100%
  stress: number;     // 0 - 100%
  shift: WorkShift;
  branchId: string;
}

export type ReviewCategory = 'product' | 'service' | 'fitting' | 'cleanliness' | 'queue' | 'size';

export interface CustomerReview {
  id: string;
  customerName: string;
  customerAvatar: string;
  stars: number;
  category: ReviewCategory;
  comment: string;
  timestamp: string;
  replied: boolean;
  replyType?: 'thank' | 'apologize' | 'voucher';
  replyNote?: string;
}

export interface CityMarketProfile {
  id: string;
  cityName: string;
  region: 'Bắc' | 'Trung' | 'Nam';
  footTrafficIndex: number; // Chỉ số lưu lượng khách (0.5 - 2.0)
  rentPerDay: number;
  avgSpending: number;
  dominantDemand: string;
  openCost: number;
  coordinates: { x: number; y: number }; // Relative position on map (0-100%)
}

export interface BranchStore {
  id: string;
  name: string;
  cityId: string;
  cityName: string;
  district: string;
  dailyRent: number;
  revenueBonusPercent: number;
  isUnlocked: boolean;
  unlockCost: number;
  icon: string;
  managerId?: string;
  rating: number;
}

export type CustomerState = 
  | 'entering' 
  | 'browsing' 
  | 'fitting' 
  | 'checkout' 
  | 'satisfied' 
  | 'angry';

export interface Customer {
  id: string;
  name: string;
  avatar: string;
  archetype: 'Gen Z Y2K' | 'Dân Công Sở' | 'Tín Đồ Streetwear' | 'Khách VIP Sang Trọng' | 'Học Sinh Sinh Viên';
  targetStyleId: string;
  targetCategory: FashionCategory;
  requestedSize: string;
  preferredColor: string;
  budget: number;
  patience: number;
  maxPatience: number;
  state: CustomerState;
  stateProgress: number;
  cartVariantId?: string;
  billAmount?: number;
}

export interface FloatingNumber {
  id: string;
  text: string;
  type: 'money' | 'rep' | 'heart' | 'sad' | 'order' | 'clean';
  x: number;
  y: number;
}

export interface UpgradeItem {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  baseCost: number;
  costMultiplier: number;
  icon: string;
  effect: string;
}

export interface BusinessAdvisorInsight {
  id: string;
  type: 'warning' | 'opportunity' | 'success';
  title: string;
  description: string;
  rootCause: string;
  recommendation: string;
}

export interface DayStats {
  revenue: number;
  cost: number;
  payroll: number;
  rent: number;
  profit: number;
  customersServed: number;
  customersLost: number;
  onlineOrdersCompleted: number;
  returnsProcessed: number;
  averageSatisfaction: number;
}

export interface SaveSlotMetadata {
  slotId: string;
  slotName: string;
  day: number;
  cash: number;
  reputationStars: number;
  branchCount: number;
  savedAt: number;
}

export interface GameState {
  cash: number;
  totalEarned: number;
  reputationStars: number;
  reputationExp: number;
  reputationNextExp: number;
  day: number;
  dayTime: number; // 0 to 180s (DAY_DURATION)
  isDayRunning: boolean;

  // Cleanliness of Store Floor & Fitting Rooms (0 - 100%)
  cleanliness: number;

  // Traffic multiplier calculated from reviews, cleanliness, staff
  trafficMultiplier: number;

  // Catalog & Inventory
  styles: Record<string, ProductStyle>;
  suppliers: Record<string, Supplier>;
  purchaseOrders: PurchaseOrder[];

  // Floor Visitors
  customers: Customer[];

  // HR & Employees
  employees: Employee[];

  // Customer Reviews & Ratings
  reviews: CustomerReview[];

  // Returns Desk
  returnRequests: ReturnExchange[];

  // Omnichannel Online Orders
  onlineOrders: OnlineOrder[];

  // Lookbook & Social Feed
  lookbookOutfits: LookbookOutfit[];
  socialPosts: SocialPost[];

  // Chain Branches & Vietnam Map
  branches: BranchStore[];
  activeBranchId: string;

  // Upgrades
  upgrades: {
    fittingRooms: UpgradeItem;
    posCounter: UpgradeItem;
    shopSpace: UpgradeItem;
    marketing: UpgradeItem;
    staffAuto: UpgradeItem;
    backroomStorage: UpgradeItem;
    deliverySpeed: UpgradeItem;
  };

  // Financial Daily P&L & History
  currentDayStats: DayStats;
  yesterdayStats?: DayStats;

  // Strategic Advisor Insights
  advisorInsights: BusinessAdvisorInsight[];

  // Visual Effects
  floatingNumbers: FloatingNumber[];
}
