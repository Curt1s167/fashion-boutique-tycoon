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
  leadTimeSeconds: number; // Thời gian hàng về
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
  progress: number; // 0 - 100%
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

export interface BranchStore {
  id: string;
  name: string;
  district: string;
  dailyRent: number;
  revenueBonusPercent: number;
  isUnlocked: boolean;
  unlockCost: number;
  icon: string;
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
  patience: number; // 0 - 100
  maxPatience: number;
  state: CustomerState;
  stateProgress: number; // 0 - 100
  cartVariantId?: string;
  billAmount?: number;
}

export interface FloatingNumber {
  id: string;
  text: string;
  type: 'money' | 'rep' | 'heart' | 'sad' | 'order';
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

export interface DayStats {
  revenue: number;
  cost: number;
  profit: number;
  customersServed: number;
  customersLost: number;
  onlineOrdersCompleted: number;
  returnsProcessed: number;
}

export interface GameState {
  cash: number;
  totalEarned: number;
  reputationStars: number;
  reputationExp: number;
  reputationNextExp: number;
  day: number;
  dayTime: number; // 0 to 60s per business day
  isDayRunning: boolean;

  // Catalog & Inventory
  styles: Record<string, ProductStyle>;
  suppliers: Record<string, Supplier>;
  purchaseOrders: PurchaseOrder[];

  // Floor Visitors
  customers: Customer[];

  // Returns Desk
  returnRequests: ReturnExchange[];

  // Omnichannel Online Orders
  onlineOrders: OnlineOrder[];

  // Lookbook & Social Feed
  lookbookOutfits: LookbookOutfit[];
  socialPosts: SocialPost[];

  // Branches
  branches: BranchStore[];

  // Facility Upgrades
  upgrades: {
    fittingRooms: UpgradeItem;
    posCounter: UpgradeItem;
    shopSpace: UpgradeItem;
    marketing: UpgradeItem;
    staffAuto: UpgradeItem;
    backroomStorage: UpgradeItem;
    deliverySpeed: UpgradeItem;
  };

  // Day P&L
  currentDayStats: DayStats;

  // Visual Effects
  floatingNumbers: FloatingNumber[];
}
