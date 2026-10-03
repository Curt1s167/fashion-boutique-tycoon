import type { 
  ProductStyle, 
  Supplier, 
  LookbookOutfit, 
  BranchStore, 
  SocialPost, 
  Employee, 
  CustomerReview, 
  CityMarketProfile,
  BusinessAdvisorInsight
} from '../types/game';

export const INITIAL_SUPPLIERS: Record<string, Supplier> = {
  'sup-korea': {
    id: 'sup-korea',
    name: 'Xưởng Dongdaemun Seoul',
    specialty: 'Thời trang Ulzzang Pastel & Baby Tee Trend',
    avatar: '🇰🇷',
    leadTimeSeconds: 6,
    minOrderQty: 5,
    rating: 4.9
  },
  'sup-vietnam': {
    id: 'sup-vietnam',
    name: 'Dệt May Vintage Sài Gòn',
    specialty: 'Jeans Wash & Đồ Cotton Thoáng Mát',
    avatar: '🇻🇳',
    leadTimeSeconds: 4,
    minOrderQty: 3,
    rating: 4.8
  },
  'sup-japan': {
    id: 'sup-japan',
    name: 'Atelier Harajuku Tokyo',
    specialty: 'Sneakers Chunky & Túi Phụ Kiện Cao Cấp',
    avatar: '🇯🇵',
    leadTimeSeconds: 9,
    minOrderQty: 4,
    rating: 5.0
  }
};

export const INITIAL_STYLES: Record<string, ProductStyle> = {
  'style-baby-tee': {
    id: 'style-baby-tee',
    name: 'Áo Thun Pastel Baby Tee',
    category: 'tops',
    categoryLabel: 'Áo Nữ',
    emoji: '👕',
    styleTags: ['y2k', 'pastel', 'genz'],
    description: 'Cotton 100% mềm mịn, ôm dáng nhẹ chuẩn style K-pop.',
    supplierId: 'sup-korea',
    baseCost: 55000,
    basePrice: 165000,
    shelfCapacity: 30,
    unlocked: true,
    variants: [
      { id: 'TEE-PINK-S', styleId: 'style-baby-tee', colorName: 'Hồng Phấn', colorHex: '#FBCFE8', size: 'S', costPrice: 55000, sellPrice: 165000, floorStock: 2, backroomStock: 0, reserved: 0, salesCount: 0 },
      { id: 'TEE-PINK-M', styleId: 'style-baby-tee', colorName: 'Hồng Phấn', colorHex: '#FBCFE8', size: 'M', costPrice: 55000, sellPrice: 165000, floorStock: 2, backroomStock: 0, reserved: 0, salesCount: 0 },
      { id: 'TEE-WHITE-S', styleId: 'style-baby-tee', colorName: 'Trắng Kem', colorHex: '#F8FAFC', size: 'S', costPrice: 55000, sellPrice: 165000, floorStock: 1, backroomStock: 0, reserved: 0, salesCount: 0 },
      { id: 'TEE-WHITE-M', styleId: 'style-baby-tee', colorName: 'Trắng Kem', colorHex: '#F8FAFC', size: 'M', costPrice: 55000, sellPrice: 165000, floorStock: 0, backroomStock: 0, reserved: 0, salesCount: 0 },
      { id: 'TEE-MINT-L', styleId: 'style-baby-tee', colorName: 'Xanh Mint', colorHex: '#A7F3D0', size: 'L', costPrice: 55000, sellPrice: 165000, floorStock: 0, backroomStock: 0, reserved: 0, salesCount: 0 },
    ]
  },
  'style-baggy-jeans': {
    id: 'style-baggy-jeans',
    name: 'Quần Baggy Jeans Vintage',
    category: 'bottoms',
    categoryLabel: 'Quần Jeans',
    emoji: '👖',
    styleTags: ['vintage', 'streetwear', 'baggy'],
    description: 'Denim dày dặn wash bạc màu thời thượng, hack chiều cao cực đỉnh.',
    supplierId: 'sup-vietnam',
    baseCost: 130000,
    basePrice: 340000,
    shelfCapacity: 25,
    unlocked: true,
    variants: [
      { id: 'JNS-BLUE-S', styleId: 'style-baggy-jeans', colorName: 'Xanh Nhạt', colorHex: '#BAE6FD', size: 'S', costPrice: 130000, sellPrice: 340000, floorStock: 2, backroomStock: 0, reserved: 0, salesCount: 0 },
      { id: 'JNS-BLUE-M', styleId: 'style-baggy-jeans', colorName: 'Xanh Nhạt', colorHex: '#BAE6FD', size: 'M', costPrice: 130000, sellPrice: 340000, floorStock: 2, backroomStock: 0, reserved: 0, salesCount: 0 },
      { id: 'JNS-BLUE-L', styleId: 'style-baggy-jeans', colorName: 'Xanh Nhạt', colorHex: '#BAE6FD', size: 'L', costPrice: 130000, sellPrice: 340000, floorStock: 0, backroomStock: 0, reserved: 0, salesCount: 0 },
      { id: 'JNS-BLACK-M', styleId: 'style-baggy-jeans', colorName: 'Đen Khói', colorHex: '#334155', size: 'M', costPrice: 130000, sellPrice: 340000, floorStock: 0, backroomStock: 0, reserved: 0, salesCount: 0 },
    ]
  },
  'style-chunky-sneaker': {
    id: 'style-chunky-sneaker',
    name: 'Sneaker Chunky Hack Dáng',
    category: 'footwear',
    categoryLabel: 'Giày Thể Thao',
    emoji: '👟',
    styleTags: ['sneakers', 'korean', 'sporty'],
    description: 'Đế đệm khí êm ái tăng chiều cao 5cm, form ôm chân năng động.',
    supplierId: 'sup-japan',
    baseCost: 240000,
    basePrice: 580000,
    shelfCapacity: 20,
    unlocked: true,
    variants: [
      { id: 'SNK-WHT-36', styleId: 'style-chunky-sneaker', colorName: 'Trắng Sữa', colorHex: '#F1F5F9', size: 'EU 36', costPrice: 240000, sellPrice: 580000, floorStock: 0, backroomStock: 0, reserved: 0, salesCount: 0 },
      { id: 'SNK-WHT-37', styleId: 'style-chunky-sneaker', colorName: 'Trắng Sữa', colorHex: '#F1F5F9', size: 'EU 37', costPrice: 240000, sellPrice: 580000, floorStock: 0, backroomStock: 0, reserved: 0, salesCount: 0 },
      { id: 'SNK-WHT-38', styleId: 'style-chunky-sneaker', colorName: 'Trắng Sữa', colorHex: '#F1F5F9', size: 'EU 38', costPrice: 240000, sellPrice: 580000, floorStock: 0, backroomStock: 0, reserved: 0, salesCount: 0 },
      { id: 'SNK-BEIGE-38', styleId: 'style-chunky-sneaker', colorName: 'Kem Be', colorHex: '#FED7AA', size: 'EU 38', costPrice: 240000, sellPrice: 580000, floorStock: 0, backroomStock: 0, reserved: 0, salesCount: 0 },
      { id: 'SNK-BEIGE-39', styleId: 'style-chunky-sneaker', colorName: 'Kem Be', colorHex: '#FED7AA', size: 'EU 39', costPrice: 240000, sellPrice: 580000, floorStock: 0, backroomStock: 0, reserved: 0, salesCount: 0 },
    ]
  },
  'style-underarm-bag': {
    id: 'style-underarm-bag',
    name: 'Túi Kẹp Nách Da Mềm Kim Loại',
    category: 'bags',
    categoryLabel: 'Túi Xách',
    emoji: '👜',
    styleTags: ['luxury', 'trendy', 'chic'],
    description: 'Chất da PU hạt cao cấp, khóa kim loại mạ vàng sang chảnh.',
    supplierId: 'sup-japan',
    baseCost: 170000,
    basePrice: 450000,
    shelfCapacity: 20,
    unlocked: true,
    variants: [
      { id: 'BAG-CREAM-FS', styleId: 'style-underarm-bag', colorName: 'Kem Bơ', colorHex: '#FEF08A', size: 'Free Size', costPrice: 170000, sellPrice: 450000, floorStock: 0, backroomStock: 0, reserved: 0, salesCount: 0 },
      { id: 'BAG-BLACK-FS', styleId: 'style-underarm-bag', colorName: 'Đen Bóng', colorHex: '#1E293B', size: 'Free Size', costPrice: 170000, sellPrice: 450000, floorStock: 0, backroomStock: 0, reserved: 0, salesCount: 0 },
      { id: 'BAG-ROSE-FS', styleId: 'style-underarm-bag', colorName: 'Hồng Đào', colorHex: '#FDA4AF', size: 'Free Size', costPrice: 170000, sellPrice: 450000, floorStock: 0, backroomStock: 0, reserved: 0, salesCount: 0 },
    ]
  },
  'style-tweed-blazer': {
    id: 'style-tweed-blazer',
    name: 'Áo Khoác Blazer Dạ Tweed Tiểu Thư',
    category: 'outerwear',
    categoryLabel: 'Áo Khoác',
    emoji: '🧥',
    styleTags: ['office', 'luxury', 'chic'],
    description: 'Dạ tweed viền ngọc trai tinh tế, phối chân váy hay jeans đều xinh.',
    supplierId: 'sup-korea',
    baseCost: 280000,
    basePrice: 690000,
    shelfCapacity: 15,
    unlocked: true,
    variants: [
      { id: 'BLZ-PINK-S', styleId: 'style-tweed-blazer', colorName: 'Hồng Pastel', colorHex: '#FBCFE8', size: 'S', costPrice: 280000, sellPrice: 690000, floorStock: 0, backroomStock: 0, reserved: 0, salesCount: 0 },
      { id: 'BLZ-PINK-M', styleId: 'style-tweed-blazer', colorName: 'Hồng Pastel', colorHex: '#FBCFE8', size: 'M', costPrice: 280000, sellPrice: 690000, floorStock: 0, backroomStock: 0, reserved: 0, salesCount: 0 },
      { id: 'BLZ-BLK-M', styleId: 'style-tweed-blazer', colorName: 'Đen Kim Tuyến', colorHex: '#0F172A', size: 'M', costPrice: 280000, sellPrice: 690000, floorStock: 0, backroomStock: 0, reserved: 0, salesCount: 0 },
    ]
  },
  'style-beret-hat': {
    id: 'style-beret-hat',
    name: 'Mũ Nồi Beret Len Cổ Điển',
    category: 'accessories',
    categoryLabel: 'Phụ Kiện',
    emoji: '👒',
    styleTags: ['vintage', 'french', 'cute'],
    description: 'Len dệt mịn phong cách tiểu thư nước Pháp, điểm nhấn cho set đồ.',
    supplierId: 'sup-vietnam',
    baseCost: 45000,
    basePrice: 125000,
    shelfCapacity: 25,
    unlocked: true,
    variants: [
      { id: 'HAT-CARAMEL-FS', styleId: 'style-beret-hat', colorName: 'Nâu Caramel', colorHex: '#D97706', size: 'Free Size', costPrice: 45000, sellPrice: 125000, floorStock: 0, backroomStock: 0, reserved: 0, salesCount: 0 },
      { id: 'HAT-BLACK-FS', styleId: 'style-beret-hat', colorName: 'Đen Tuyền', colorHex: '#18181B', size: 'Free Size', costPrice: 45000, sellPrice: 125000, floorStock: 0, backroomStock: 0, reserved: 0, salesCount: 0 },
    ]
  }
};

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    name: 'Ngọc Lan',
    avatar: '👩‍💼',
    role: 'manager',
    roleLabel: 'Cửa Hàng Trưởng (Store Manager)',
    wagePerDay: 45000,
    skillLevel: 4,
    morale: 95,
    energy: 90,
    stress: 20,
    shift: 'morning',
    branchId: 'branch-main'
  },
  {
    id: 'emp-2',
    name: 'Thanh Hằng',
    avatar: '💁‍♀️',
    role: 'sales',
    roleLabel: 'Stylist Tư Vấn Bán Lẻ',
    wagePerDay: 28000,
    skillLevel: 3,
    morale: 88,
    energy: 85,
    stress: 25,
    shift: 'morning',
    branchId: 'branch-main'
  },
  {
    id: 'emp-3',
    name: 'Minh Tuấn',
    avatar: '🧑‍💻',
    role: 'cashier',
    roleLabel: 'Thu Ngân Quầy POS',
    wagePerDay: 25000,
    skillLevel: 3,
    morale: 90,
    energy: 88,
    stress: 15,
    shift: 'afternoon',
    branchId: 'branch-main'
  },
  {
    id: 'emp-4',
    name: 'Cô Ba',
    avatar: '🧹',
    role: 'cleaning',
    roleLabel: 'Nhân Viên Vệ Sinh & Sắp Xếp',
    wagePerDay: 20000,
    skillLevel: 4,
    morale: 92,
    energy: 82,
    stress: 10,
    shift: 'morning',
    branchId: 'branch-main'
  }
];

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    customerName: 'Khánh Vy',
    customerAvatar: '👱‍♀️',
    stars: 5,
    category: 'service',
    comment: 'Cửa hàng trưởng tư vấn phối đồ có gu dã man! Không gian thơm tho, sạch sẽ nữa. Sẽ ủng hộ dài dài!',
    timestamp: 'Hôm qua',
    replied: true,
    replyType: 'thank',
    replyNote: 'Dạ tiệm cảm ơn Khánh Vy nhiều lắm ạ! Chúc nàng luôn xinh đẹp ✨'
  },
  {
    id: 'rev-2',
    customerName: 'Hoàng Nam',
    customerAvatar: '🧑',
    stars: 3,
    category: 'size',
    comment: 'Quần jeans form đẹp nhưng lúc mình ghé thì kệ hết size L, phải đợi nhân viên vào kho lấy hơi lâu.',
    timestamp: '2 ngày trước',
    replied: false
  },
  {
    id: 'rev-3',
    customerName: 'Bảo Ngọc',
    customerAvatar: '👧',
    stars: 5,
    category: 'fitting',
    comment: 'Phòng thử đồ gương LED selfie ảo tung chảo! Thử 3 bộ quất luôn cả 3!',
    timestamp: '3 ngày trước',
    replied: true,
    replyType: 'thank',
    replyNote: 'Hihi cảm ơn nàng đã dành lời khen cho góc sống ảo của tiệm nha!'
  }
];

export const VIETNAM_CITIES: CityMarketProfile[] = [
  {
    id: 'city-hcm',
    cityName: 'TP. Hồ Chí Minh',
    region: 'Nam',
    footTrafficIndex: 1.8,
    rentPerDay: 80000,
    avgSpending: 450000,
    dominantDemand: 'Gen Z, Y2K & Streetwear năng động',
    openCost: 2000000,
    coordinates: { x: 55, y: 82 }
  },
  {
    id: 'city-hanoi',
    cityName: 'Hà Nội',
    region: 'Bắc',
    footTrafficIndex: 1.6,
    rentPerDay: 75000,
    avgSpending: 520000,
    dominantDemand: 'Dạ Tweed, Blazer thanh lịch & Vintage',
    openCost: 3500000,
    coordinates: { x: 42, y: 18 }
  },
  {
    id: 'city-danang',
    cityName: 'Đà Nẵng',
    region: 'Trung',
    footTrafficIndex: 1.3,
    rentPerDay: 50000,
    avgSpending: 380000,
    dominantDemand: 'Thời trang dạo biển, Linen & Pastel',
    openCost: 1800000,
    coordinates: { x: 65, y: 48 }
  },
  {
    id: 'city-cantho',
    cityName: 'Cần Thơ',
    region: 'Nam',
    footTrafficIndex: 1.1,
    rentPerDay: 35000,
    avgSpending: 320000,
    dominantDemand: 'Trang phục thường ngày & Baby Tee',
    openCost: 1500000,
    coordinates: { x: 45, y: 90 }
  },
  {
    id: 'city-haiphong',
    cityName: 'Hải Phòng',
    region: 'Bắc',
    footTrafficIndex: 1.2,
    rentPerDay: 40000,
    avgSpending: 410000,
    dominantDemand: 'Sneaker cá tính & Áo khoác sành điệu',
    openCost: 1600000,
    coordinates: { x: 52, y: 22 }
  }
];

export const INITIAL_BRANCHES: BranchStore[] = [
  {
    id: 'branch-main',
    name: 'Boutique Trụ Sở Chính (Quận 1)',
    cityId: 'city-hcm',
    cityName: 'TP. Hồ Chí Minh',
    district: 'Phố Đi Bộ Nguyễn Huệ, Quận 1',
    dailyRent: 0,
    revenueBonusPercent: 0,
    isUnlocked: true,
    unlockCost: 0,
    icon: '🏬',
    managerId: 'emp-1',
    rating: 4.8,
    healthStatus: 'HEALTHY',
    consecutiveLossDays: 0,
    accumulatedProfit: 1500000
  },
  {
    id: 'branch-thaodien',
    name: 'Chi Nhánh Thảo Điền Boutique',
    cityId: 'city-hcm',
    cityName: 'TP. Hồ Chí Minh',
    district: 'Khu Nhà Giàu Thảo Điền, TP. Thủ Đức',
    dailyRent: 120000,
    revenueBonusPercent: 35,
    isUnlocked: false,
    unlockCost: 2000000,
    icon: '✨',
    rating: 4.9,
    healthStatus: 'HEALTHY',
    consecutiveLossDays: 0,
    accumulatedProfit: 0
  },
  {
    id: 'branch-hoankiem',
    name: 'Flagship Hoàn Kiếm Hà Nội',
    cityId: 'city-hanoi',
    cityName: 'Hà Nội',
    district: 'Phố Cổ Hoàn Kiếm, Thủ Đô Hà Nội',
    dailyRent: 220000,
    revenueBonusPercent: 75,
    isUnlocked: false,
    unlockCost: 3500000,
    icon: '👑',
    rating: 5.0,
    healthStatus: 'HEALTHY',
    consecutiveLossDays: 0,
    accumulatedProfit: 0
  },
  {
    id: 'branch-danang',
    name: 'Boutique Biển Đà Nẵng',
    cityId: 'city-danang',
    cityName: 'Đà Nẵng',
    district: 'Bạch Đằng Ven Sông Hàn, Đà Nẵng',
    dailyRent: 80000,
    revenueBonusPercent: 30,
    isUnlocked: false,
    unlockCost: 1800000,
    icon: '🌊',
    rating: 4.7,
    healthStatus: 'HEALTHY',
    consecutiveLossDays: 0,
    accumulatedProfit: 0
  }
];

export const INITIAL_LOOKBOOK: LookbookOutfit[] = [
  {
    id: 'lookbook-y2k',
    title: 'Set Y2K Năng Động Dạo Phố',
    concept: 'Baby Tee Hồng + Baggy Jeans Vintage + Sneaker Chunky',
    styleIds: ['style-baby-tee', 'style-baggy-jeans', 'style-chunky-sneaker'],
    bonusText: 'Tăng 30% khách hàng trẻ & tăng 15% tiền tip',
    isCompleted: false,
    expReward: 150
  },
  {
    id: 'lookbook-chic',
    title: 'Outfit Quý Cô Parisien Sang Chảnh',
    concept: 'Blazer Dạ Tweed + Túi Kẹp Nách + Mũ Beret Cổ Điển',
    styleIds: ['style-tweed-blazer', 'style-underarm-bag', 'style-beret-hat'],
    bonusText: 'Thu hút khách hàng VIP & tăng 25% hóa đơn trung bình',
    isCompleted: false,
    expReward: 250
  }
];

export const INITIAL_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'post-1',
    author: 'Châu Bùi (Fashion Influencer)',
    avatar: '👩‍🦰',
    tag: '#OOTD #FashionTycoon',
    content: 'Vừa ghé tiệm sắm nguyên set Baby Tee + Baggy Jeans siêu ưng! Form chuẩn mà vải mát rười rượi, rate 5 sao luôn nè ⭐⭐⭐⭐⭐',
    likes: 1240,
    timestamp: '2 giờ trước',
    trendBonus: '+20% Khách Gen Z'
  },
  {
    id: 'post-2',
    author: 'Khánh Vy Lookbook',
    avatar: '👱‍♀️',
    tag: '#BoutiqueReview',
    content: 'Phòng thử đồ gương LED ở tiệm sống ảo đỉnh chóp! Nhân viên tư vấn phối đồ cực có gu nữa chứ 🥰',
    likes: 856,
    timestamp: '5 giờ trước'
  }
];

export const INITIAL_ADVISOR_INSIGHTS: BusinessAdvisorInsight[] = [
  {
    id: 'insight-1',
    type: 'opportunity',
    title: 'Tối Ưu Phân Bổ Hàng Kho & Kệ Bán',
    description: 'Nhiều khách hàng thích mẫu Baby Tee nhưng thường xuyên hết size M trên kệ bán lẻ.',
    rootCause: 'Hàng vẫn còn trong kho phía sau nhưng chưa được nhân viên kho vận chuyển lên kệ kịp thời.',
    recommendation: 'Chỉ định nhân viên bổ sung kệ hàng thường xuyên hoặc nhấn "Đưa tất cả lên kệ".'
  },
  {
    id: 'insight-2',
    type: 'warning',
    title: 'Giữ Vệ Sinh Phòng Thử Đồ & Sàn Shop',
    description: 'Độ sạch sẽ cửa hàng quyết định trực tiếp tới tỷ lệ khách hàng để lại đánh giá 5 sao.',
    rootCause: 'Lượng khách vào đông làm sàn và phòng thử nhanh bừa bộn.',
    recommendation: 'Duy trì ca trực của Nhân Viên Vệ Sinh hoặc chủ động quét dọn khi độ sạch dưới 60%.'
  }
];
