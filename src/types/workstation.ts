import type { FashionCategory, ProductStyle, ProductVariant } from './game';

export type WorkstationContextType = 
  | 'CUSTOMER_ITEM_FULFILLMENT'
  | 'FITTING_ROOM_REQUEST'
  | 'CHECKOUT_POS'
  | 'RESTOCK_FLOOR'
  | 'GOODS_RECEIVING'
  | 'RETURN_EXCHANGE'
  | 'CLEANING_INCIDENT'
  | 'STAFF_SHIFT_COVERAGE'
  | 'REVIEW_RESPONSE'
  | 'ONLINE_ORDER_PICKING';

export type PrepTableItemState = 
  | 'EMPTY' 
  | 'PREPARED' 
  | 'CUSTOMER_HOLD' 
  | 'FITTING' 
  | 'CART_RESERVED' 
  | 'RETURN_REQUIRED';

export interface PreparationTableItem {
  id: string;
  styleId: string;
  styleName: string;
  variantId: string;
  size: string;
  colorName: string;
  colorHex: string;
  emoji: string;
  sellPrice: number;
  costPrice: number;
  source: 'rack' | 'backroom' | 'fitting_return';
  state: PrepTableItemState;
  targetCustomerId?: string;
  placedAt: number;
}

export type InteractiveHotspotKind = 
  | 'rack'
  | 'product'
  | 'backroom'
  | 'prep-table'
  | 'fitting-room'
  | 'pos'
  | 'customer'
  | 'returns-bin'
  | 'cleaning-area'
  | 'receiving-dock';

export interface InteractiveHotspot {
  id: string;
  kind: InteractiveHotspotKind;
  x: number;      // Logical coordinate (0 - 1080)
  y: number;      // Logical coordinate (0 - 1920)
  width: number;
  height: number;
  enabled: boolean;
  label: string;
  targetId?: string;
}

export interface ContextStep {
  index: number;
  title: string;
  instruction: string;
  targetHotspotKind?: InteractiveHotspotKind;
  isCompleted: boolean;
}

export interface POSPaymentReceipt {
  receiptId: string;
  customerId: string;
  customerName: string;
  items: Array<{
    styleName: string;
    size: string;
    colorName: string;
    sellPrice: number;
  }>;
  subtotal: number;
  discount: number;
  tip: number;
  finalTotal: number;
  paymentMethod: 'cash' | 'card' | 'qr';
  timestamp: string;
}

export interface GoodsReceivingPackage {
  poId: string;
  supplierName: string;
  styleId: string;
  styleName: string;
  variantId: string;
  variantDesc: string;
  quantity: number;
  verifiedCount: number;
  damagedCount: number;
  status: 'arrived' | 'inspecting' | 'completed';
}

export interface WorkstationViewModel {
  activeContextType: WorkstationContextType;
  currentStepIndex: number;
  steps: ContextStep[];
  actorName: string;
  actorAvatar: string;
  actorDialogue: string;
  urgency: number; // 0 - 100% patience or urgency
  requestedStyle?: ProductStyle;
  requestedVariant?: ProductVariant;
  requestedCategory?: FashionCategory;
}
