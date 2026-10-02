export type ItemCategory = 'tshirt' | 'jeans' | 'sneaker' | 'handbag';

export interface FashionItem {
  id: string;
  name: string;
  category: ItemCategory;
  emoji: string;
  costPrice: number;    // Giá nhập sỉ
  sellPrice: number;    // Giá bán lẻ
  stock: number;        // Tồn kho hiện tại
  shelfCapacity: number;// Sức chứa tối đa của kệ
  level: number;        // Cấp bậc sản phẩm
  color: string;
  description: string;
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
  targetCategory: ItemCategory;
  budget: number;
  patience: number;       // 0 - 100
  maxPatience: number;
  state: CustomerState;
  stateProgress: number;  // 0 - 100% trong phòng thử đồ hoặc thanh toán
  cartItemId?: string;
  billAmount?: number;
}

export interface FloatingNumber {
  id: string;
  text: string;
  type: 'money' | 'rep' | 'heart' | 'sad';
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
}

export interface GameState {
  cash: number;
  totalEarned: number;
  reputationStars: number; // 1 to 5 sao
  reputationExp: number;
  reputationNextExp: number;
  day: number;
  dayTime: number; // 0 to 60 giây mỗi ngày bán hàng
  isDayRunning: boolean;
  
  // Danh mục hàng hóa
  inventory: Record<ItemCategory, FashionItem>;
  
  // Khách đang ở trong tiệm
  customers: Customer[];
  
  // Nâng cấp cửa hàng
  upgrades: {
    fittingRooms: UpgradeItem;  // Phòng thử đồ
    posCounter: UpgradeItem;    // Quầy thanh toán POS
    shopSpace: UpgradeItem;     // Mặt bằng mở rộng
    marketing: UpgradeItem;     // Quảng cáo & Kéo khách
    staffAuto: UpgradeItem;     // Thuê nhân viên tự động phục vụ
  };

  // Thống kê ngày hôm nay
  currentDayStats: DayStats;
  
  // Floating numbers for juicy feedback
  floatingNumbers: FloatingNumber[];
}
