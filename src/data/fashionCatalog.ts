import type { ProductStyle, Supplier, LookbookOutfit, BranchStore, SocialPost } from '../types/game';

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
      { id: 'TEE-PINK-S', styleId: 'style-baby-tee', colorName: 'Hồng Phấn', colorHex: '#FBCFE8', size: 'S', costPrice: 55000, sellPrice: 165000, floorStock: 5, backroomStock: 10, reserved: 0, salesCount: 0 },
      { id: 'TEE-PINK-M', styleId: 'style-baby-tee', colorName: 'Hồng Phấn', colorHex: '#FBCFE8', size: 'M', costPrice: 55000, sellPrice: 165000, floorStock: 6, backroomStock: 12, reserved: 0, salesCount: 0 },
      { id: 'TEE-WHITE-S', styleId: 'style-baby-tee', colorName: 'Trắng Kem', colorHex: '#F8FAFC', size: 'S', costPrice: 55000, sellPrice: 165000, floorStock: 4, backroomStock: 8, reserved: 0, salesCount: 0 },
      { id: 'TEE-WHITE-M', styleId: 'style-baby-tee', colorName: 'Trắng Kem', colorHex: '#F8FAFC', size: 'M', costPrice: 55000, sellPrice: 165000, floorStock: 5, backroomStock: 10, reserved: 0, salesCount: 0 },
      { id: 'TEE-MINT-L', styleId: 'style-baby-tee', colorName: 'Xanh Mint', colorHex: '#A7F3D0', size: 'L', costPrice: 55000, sellPrice: 165000, floorStock: 3, backroomStock: 6, reserved: 0, salesCount: 0 },
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
      { id: 'JNS-BLUE-S', styleId: 'style-baggy-jeans', colorName: 'Xanh Nhạt', colorHex: '#BAE6FD', size: 'S', costPrice: 130000, sellPrice: 340000, floorStock: 4, backroomStock: 8, reserved: 0, salesCount: 0 },
      { id: 'JNS-BLUE-M', styleId: 'style-baggy-jeans', colorName: 'Xanh Nhạt', colorHex: '#BAE6FD', size: 'M', costPrice: 130000, sellPrice: 340000, floorStock: 5, backroomStock: 10, reserved: 0, salesCount: 0 },
      { id: 'JNS-BLUE-L', styleId: 'style-baggy-jeans', colorName: 'Xanh Nhạt', colorHex: '#BAE6FD', size: 'L', costPrice: 130000, sellPrice: 340000, floorStock: 3, backroomStock: 7, reserved: 0, salesCount: 0 },
      { id: 'JNS-BLACK-M', styleId: 'style-baggy-jeans', colorName: 'Đen Khói', colorHex: '#334155', size: 'M', costPrice: 130000, sellPrice: 340000, floorStock: 4, backroomStock: 8, reserved: 0, salesCount: 0 },
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
      { id: 'SNK-WHT-36', styleId: 'style-chunky-sneaker', colorName: 'Trắng Sữa', colorHex: '#F1F5F9', size: 'EU 36', costPrice: 240000, sellPrice: 580000, floorStock: 3, backroomStock: 5, reserved: 0, salesCount: 0 },
      { id: 'SNK-WHT-37', styleId: 'style-chunky-sneaker', colorName: 'Trắng Sữa', colorHex: '#F1F5F9', size: 'EU 37', costPrice: 240000, sellPrice: 580000, floorStock: 4, backroomStock: 6, reserved: 0, salesCount: 0 },
      { id: 'SNK-WHT-38', styleId: 'style-chunky-sneaker', colorName: 'Trắng Sữa', colorHex: '#F1F5F9', size: 'EU 38', costPrice: 240000, sellPrice: 580000, floorStock: 3, backroomStock: 6, reserved: 0, salesCount: 0 },
      { id: 'SNK-BEIGE-38', styleId: 'style-chunky-sneaker', colorName: 'Kem Be', colorHex: '#FED7AA', size: 'EU 38', costPrice: 240000, sellPrice: 580000, floorStock: 2, backroomStock: 5, reserved: 0, salesCount: 0 },
      { id: 'SNK-BEIGE-39', styleId: 'style-chunky-sneaker', colorName: 'Kem Be', colorHex: '#FED7AA', size: 'EU 39', costPrice: 240000, sellPrice: 580000, floorStock: 2, backroomStock: 4, reserved: 0, salesCount: 0 },
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
      { id: 'BAG-CREAM-FS', styleId: 'style-underarm-bag', colorName: 'Kem Bơ', colorHex: '#FEF08A', size: 'Free Size', costPrice: 170000, sellPrice: 450000, floorStock: 4, backroomStock: 8, reserved: 0, salesCount: 0 },
      { id: 'BAG-BLACK-FS', styleId: 'style-underarm-bag', colorName: 'Đen Bóng', colorHex: '#1E293B', size: 'Free Size', costPrice: 170000, sellPrice: 450000, floorStock: 5, backroomStock: 7, reserved: 0, salesCount: 0 },
      { id: 'BAG-ROSE-FS', styleId: 'style-underarm-bag', colorName: 'Hồng Đào', colorHex: '#FDA4AF', size: 'Free Size', costPrice: 170000, sellPrice: 450000, floorStock: 3, backroomStock: 5, reserved: 0, salesCount: 0 },
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
      { id: 'BLZ-PINK-S', styleId: 'style-tweed-blazer', colorName: 'Hồng Pastel', colorHex: '#FBCFE8', size: 'S', costPrice: 280000, sellPrice: 690000, floorStock: 3, backroomStock: 5, reserved: 0, salesCount: 0 },
      { id: 'BLZ-PINK-M', styleId: 'style-tweed-blazer', colorName: 'Hồng Pastel', colorHex: '#FBCFE8', size: 'M', costPrice: 280000, sellPrice: 690000, floorStock: 3, backroomStock: 5, reserved: 0, salesCount: 0 },
      { id: 'BLZ-BLK-M', styleId: 'style-tweed-blazer', colorName: 'Đen Kim Tuyến', colorHex: '#0F172A', size: 'M', costPrice: 280000, sellPrice: 690000, floorStock: 2, backroomStock: 4, reserved: 0, salesCount: 0 },
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
      { id: 'HAT-CARAMEL-FS', styleId: 'style-beret-hat', colorName: 'Nâu Caramel', colorHex: '#D97706', size: 'Free Size', costPrice: 45000, sellPrice: 125000, floorStock: 4, backroomStock: 8, reserved: 0, salesCount: 0 },
      { id: 'HAT-BLACK-FS', styleId: 'style-beret-hat', colorName: 'Đen Tuyền', colorHex: '#18181B', size: 'Free Size', costPrice: 45000, sellPrice: 125000, floorStock: 4, backroomStock: 8, reserved: 0, salesCount: 0 },
    ]
  }
};

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

export const INITIAL_BRANCHES: BranchStore[] = [
  {
    id: 'branch-main',
    name: 'Tiệm Trụ Sở Chính (Quận 1)',
    district: 'Phố Đi Bộ Nguyễn Huệ, TP.HCM',
    dailyRent: 0,
    revenueBonusPercent: 0,
    isUnlocked: true,
    unlockCost: 0,
    icon: '🏬'
  },
  {
    id: 'branch-thaodien',
    name: 'Chi Nhánh Thảo Điền Boutique',
    district: 'Khu Nhà Giàu Thảo Điền, TP. Thủ Đức',
    dailyRent: 150000,
    revenueBonusPercent: 40,
    isUnlocked: false,
    unlockCost: 2500000,
    icon: '✨'
  },
  {
    id: 'branch-hoankiem',
    name: 'Flagship Hoàn Kiếm Hà Nội',
    district: 'Phố Cổ Hoàn Kiếm, Thủ Đô Hà Nội',
    dailyRent: 300000,
    revenueBonusPercent: 90,
    isUnlocked: false,
    unlockCost: 6000000,
    icon: '👑'
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
