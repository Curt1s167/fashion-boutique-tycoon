import type { JourneyDayMeta, Week2FocusMeta } from '../types/journey';

export const FIRST_7_DAYS_JOURNEY_DATA: Record<number, JourneyDayMeta> = {
  1: {
    dayNumber: 1,
    theme: 'Khởi Sự Tiệm Mơ Ước — Đơn Hàng Đầu Tiên',
    subtitle: '“Mình làm được!” ✨',
    mascotMood: 'excited',
    storyOpening: 'Chào mừng bạn đến với ngày đầu tiên mở cửa tiệm! Hãy đón vị khách đầu tiên, lấy đúng món đồ họ thích và hoàn thành đơn thanh toán tại quầy POS nhé.',
    learningInsight: 'Tiền chỉ được ghi nhận khi khách quẹt thẻ hoặc trả tiền mặt tại quầy POS. Khách cầm đồ chưa phải là doanh thu!',
    whyExplanation: {
      question: 'Tại sao tiền chưa cộng vào tài khoản khi khách đã nhận đồ?',
      answers: [
        'Khách lấy đồ từ kệ chỉ mới là giai đoạn "Xem & Cân nhắc".',
        'Khách có thể đổi ý, trả lại kệ hoặc vào phòng thử đồ mà không mua.',
        'Chỉ khi khách đến quầy POS, quẹt thẻ/quét QR thành công thì giao dịch bán lẻ mới chính thức hoàn tất.'
      ],
      proTip: 'Đừng vội mua hàng quá tay khi thấy giỏ hàng khách đầy; hãy đợi tiền thật vào két!'
    },
    goals: [
      {
        id: 'day1_pick_shirt',
        title: 'Chạm kệ & Lấy áo thun theo yêu cầu',
        hint: 'Chạm vào Kệ Áo Nữ 👕, chọn đúng kiểu dáng & size khách cần.',
        icon: '👕',
        targetCount: 1,
        currentCount: 0,
        isCompleted: false,
      },
      {
        id: 'day1_prep_table',
        title: 'Đặt lên Bàn Chuẩn Bị 🪡',
        hint: 'Kiểm tra kỹ mẫu mã và size trước khi giao tận tay khách.',
        icon: '🪡',
        targetCount: 1,
        currentCount: 0,
        isCompleted: false,
      },
      {
        id: 'day1_pos_checkout',
        title: 'Thanh toán quầy POS & Thu tiền thật',
        hint: 'Chạm vào Quầy POS, quét mã vạch và nhận thanh toán đầu tiên.',
        icon: '💳',
        targetCount: 1,
        currentCount: 0,
        isCompleted: false,
      }
    ],
    unlockedFeatureLabel: 'Bàn Chuẩn Bị & Quầy Thu Ngân POS',
    coachingTips: [
      'Chạm vào kệ đồ để mở nhanh bảng chọn kích cỡ & màu sắc.',
      'Đặt đồ lên bàn chuẩn bị giúp thao tác giao khách chuẩn xác 100%.'
    ]
  },

  2: {
    dayNumber: 2,
    theme: 'Kích Cỡ & Tồn Kho — Bí Quyết Giữ Chân Khách',
    subtitle: '“À, size quan trọng!” 📏',
    mascotMood: 'thinking',
    storyOpening: 'Hôm nay khách bắt đầu hỏi size cụ thể hơn. Khi kệ đồ trên sàn hết size, hãy nhớ kho sau vẫn còn hàng dự trữ nhé!',
    learningInsight: 'Có hàng trong kho sau chưa chắc khách mua được nếu kệ trưng bày bị trống. Hãy luôn bổ sung kệ kịp thời!',
    whyExplanation: {
      question: 'Vì sao trong kho vẫn còn hàng mà khách lại rời đi vì hết hàng?',
      answers: [
        'Khách bước vào cửa hàng chỉ nhìn thấy những gì được treo trên sào kệ trưng bày.',
        'Nếu kệ trống size M, khách sẽ nghĩ cửa hàng đã cháy hàng và bỏ đi (Lost Sale).',
        'Chuyển hàng từ kho sau ra kệ trưng bày là nhiệm vụ sống còn của mọi cửa hàng thời trang.'
      ],
      proTip: 'Thường xuyên chạm vào Kệ đồ hoặc Kho để bổ sung (Restock) các size bán chạy.'
    },
    goals: [
      {
        id: 'day2_match_size',
        title: 'Phục vụ đúng màu & size khách yêu cầu',
        hint: 'Đáp ứng chính xác màu sắc và kích cỡ (S/M/L) cho khách.',
        icon: '🎯',
        targetCount: 2,
        currentCount: 0,
        isCompleted: false,
      },
      {
        id: 'day2_backroom_retrieve',
        title: 'Lấy hàng từ Kho Lưu Trữ',
        hint: 'Khi kệ hết, lấy hàng trực tiếp từ Kho Sau để phục vụ khách.',
        icon: '📦',
        targetCount: 1,
        currentCount: 0,
        isCompleted: false,
      },
      {
        id: 'day2_restock_rack',
        title: 'Bổ sung hàng ra sào kệ trưng bày',
        hint: 'Làm đầy sào đồ để khách vào sau không bị hụt hẫng.',
        icon: '✨',
        targetCount: 1,
        currentCount: 0,
        isCompleted: false,
      }
    ],
    unlockedFeatureLabel: 'Kho Lưu Trữ Sau & Bổ Sung Sào Kệ',
    coachingTips: [
      'Size M và S thường hết trước; hãy ưu tiên nhập thêm các size này.',
      'Nếu đưa nhầm size, khách sẽ lịch sự nhắc bạn đổi lại mà không phạt nặng.'
    ]
  },

  3: {
    dayNumber: 3,
    theme: 'Phòng Thử Đồ & Trải Nghiệm Khách Hàng',
    subtitle: '“Khách có cảm xúc thật!” 🪞',
    mascotMood: 'excited',
    storyOpening: 'Phòng thử đồ VIP đã sẵn sàng! Khi mặc thử vừa vặn, khách sẽ cực kỳ hài lòng và để lại những đánh giá 5 sao rực rỡ.',
    learningInsight: 'Trải nghiệm thử đồ thoải mái là yếu tố số 1 giúp biến khách xem thành khách mua và nhận review 5 sao.',
    whyExplanation: {
      question: 'Vì sao khách thử đồ xong lại yêu cầu đổi size khác?',
      answers: [
        'Mỗi form dáng quần áo (Oversize, Baby Tee, Baggy) lên người có độ ôm khác nhau.',
        'Hỗ trợ đổi size ngay tại cửa phòng thử giúp cứu vãn 90% khả năng chốt đơn.',
        'Sự tận tâm này chính là lý do khách hào phóng chấm điểm 5 sao trên trang đánh giá.'
      ],
      proTip: 'Phục vụ đổi size phòng thử nhanh giúp điểm kiên nhẫn của khách hồi phục lập tức!'
    },
    goals: [
      {
        id: 'day3_fitting_assist',
        title: 'Hỗ trợ khách thử đồ tại Phòng Thử VIP',
        hint: 'Đưa trang phục cho khách vào phòng thử đồ trải nghiệm form dáng.',
        icon: '🪞',
        targetCount: 2,
        currentCount: 0,
        isCompleted: false,
      },
      {
        id: 'day3_fitting_exchange',
        title: 'Đổi size thay thế tại phòng thử',
        hint: 'Lấy size thay thế khi khách thử đồ cảm thấy chật hoặc rộng.',
        icon: '🔄',
        targetCount: 1,
        currentCount: 0,
        isCompleted: false,
      },
      {
        id: 'day3_get_review',
        title: 'Nhận đánh giá 5 sao từ khách hài lòng',
        hint: 'Phục vụ chu đáo để nhận review khen ngợi và tăng sao uy tín.',
        icon: '⭐',
        targetCount: 1,
        currentCount: 0,
        isCompleted: false,
      }
    ],
    unlockedFeatureLabel: 'Phòng Thử Đồ VIP & Hệ Thống Đánh Giá Shop',
    coachingTips: [
      'Khách thử đồ ưng ý thường có hóa đơn cao hơn khách chỉ xem lướt.',
      'Đánh giá sao càng cao thì lượng khách tự nhiên ghé shop ngày hôm sau càng đông.'
    ]
  },

  4: {
    dayNumber: 4,
    theme: 'Vệ Sinh Không Gian & Đa Nhiệm Bán Lẻ',
    subtitle: '“Một mình bắt đầu bận rồi!” 🧹',
    mascotMood: 'busy',
    storyOpening: 'Lượng khách ghé thăm ngày càng đông đúc! Hãy chú ý dọn dẹp sàn nhà và phòng thử đồ để tiệm luôn thơm tho, sáng bóng nhé.',
    learningInsight: 'Cửa hàng bừa bộn và phòng thử đồ bẩn sẽ khiến khách khó tính bỏ về và tụt sao đánh giá.',
    whyExplanation: {
      question: 'Độ sạch sẽ của cửa hàng ảnh hưởng như thế nào đến kinh doanh?',
      answers: [
        'Phòng thử đồ bụi bặm làm trang phục dễ lấm lem, khách ngần ngại cởi thử.',
        'Độ sạch dưới 50% sẽ làm tốc độ tụt kiên nhẫn của toàn bộ khách trong tiệm tăng gấp đôi!',
        'Chỉ một thao tác quét dọn nhanh sẽ khôi phục ngay cảm giác sang trọng, cao cấp cho tiệm.'
      ],
      proTip: 'Dùng chổi quét dọn mỗi khi vắng khách giữa các ca sáng và trưa.'
    },
    goals: [
      {
        id: 'day4_sweep_floor',
        title: 'Quét dọn sàn nhà & phòng thử đồ',
        hint: 'Chạm biểu tượng Chổi quét dọn để phục hồi 100% độ sạch bóng.',
        icon: '🧹',
        targetCount: 1,
        currentCount: 0,
        isCompleted: false,
      },
      {
        id: 'day4_keep_cleanliness',
        title: 'Duy trì độ sạch sẽ trên 80%',
        hint: 'Giữ không gian luôn tinh tươm suốt thời gian mở cửa.',
        icon: '✨',
        targetCount: 1,
        currentCount: 0,
        isCompleted: false,
      },
      {
        id: 'day4_serve_customers',
        title: 'Phục vụ thành công 3 lượt khách',
        hint: 'Vừa giữ vệ sinh vừa hoàn tất đơn hàng nhanh chóng.',
        icon: '🛍️',
        targetCount: 3,
        currentCount: 0,
        isCompleted: false,
      }
    ],
    unlockedFeatureLabel: 'Bộ Dụng Cụ Vệ Sinh & Chỉ Số Thẩm Mỹ Tiệm',
    coachingTips: [
      'Khi nhiều khách tới cùng lúc: ưu tiên thanh toán POS trước để giải phóng hàng đợi!',
      'Quét dọn ngay sau khi khách thử đồ rời cabin.'
    ]
  },

  5: {
    dayNumber: 5,
    theme: 'Đội Ngũ Nhân Sự — Tuyển Dụng & San Sẻ',
    subtitle: '“Nhân viên thật sự giúp mình!” 🤝',
    mascotMood: 'proud',
    storyOpening: 'Một mình không thể quán xuyến hết tất cả! Đã đến lúc đăng tin tuyển dụng bạn nhân viên đầu tiên để cùng chia sẻ công việc.',
    learningInsight: 'Chi trả tiền lương tuy làm tăng chi phí, nhưng năng lực phục vụ tăng gấp đôi giúp doanh thu tăng vượt bậc.',
    whyExplanation: {
      question: 'Tại sao nên tuyển nhân viên dù mỗi ngày phải trả thêm tiền lương?',
      answers: [
        'Một nhân viên tư vấn giúp khách hồi phục kiên nhẫn và không bao giờ bỏ về giữa chừng.',
        'Thu ngân tự động giúp giảm triệt để tình trạng nghẽn quầy lúc cao điểm.',
        'Doanh thu từ những khách hàng được giữ chân thừa sức bù đắp chi phí tiền lương.'
      ],
      proTip: 'Chọn nhân viên có kỹ năng phù hợp với điểm yếu hiện tại của bạn (tư vấn hay tính tiền).'
    },
    goals: [
      {
        id: 'day5_hire_staff',
        title: 'Mở tab Nhân Sự & Xem hồ sơ ứng viên',
        hint: 'Khám phá danh sách ứng viên (Lan - Stylist, Minh - Thu ngân).',
        icon: '👥',
        targetCount: 1,
        currentCount: 0,
        isCompleted: false,
      },
      {
        id: 'day5_assign_role',
        title: 'Phân công nhân sự vào vị trí chủ chốt',
        hint: 'Bố trí nhân viên vào bàn tư vấn bán hàng hoặc quầy thu ngân.',
        icon: '📋',
        targetCount: 1,
        currentCount: 0,
        isCompleted: false,
      },
      {
        id: 'day5_high_volume',
        title: 'Đạt mốc phục vụ 4 khách trong ngày',
        hint: 'Tận dụng sức mạnh đội ngũ để bứt phá số lượng khách phục vụ.',
        icon: '🚀',
        targetCount: 4,
        currentCount: 0,
        isCompleted: false,
      }
    ],
    unlockedFeatureLabel: 'Trung Tâm Tuyển Dụng & Quản Trị Nhân Sự',
    coachingTips: [
      'Nhân viên có tinh thần (Morale) cao sẽ thao tác nhanh hơn và ít mắc lỗi hơn.',
      'Cuối ngày, chi phí tiền lương sẽ được trừ minh bạch trong bảng tổng kết tài chính.'
    ]
  },

  6: {
    dayNumber: 6,
    theme: 'Điều Phối Ca Làm & Giờ Cao Điểm',
    subtitle: '“Mình phải quản lý chứ không chỉ bán!” ⏱️',
    mascotMood: 'thinking',
    storyOpening: 'Khách hàng ghé tiệm không đều trong ngày: ca sáng êm ả, ca tối lại bùng nổ! Hãy bố trí ca làm thông minh để không bỏ lỡ doanh thu.',
    learningInsight: 'Bố trí đúng người vào đúng khung giờ cao điểm là chìa khóa tối ưu hóa chi phí nhân sự và tránh tắc nghẽn quầy.',
    whyExplanation: {
      question: 'Tại sao không nên phân bổ số lượng nhân viên đều đặn cả ngày?',
      answers: [
        'Khách đi mua sắm nhiều nhất vào ca tối sau giờ tan làm (18:00 - 21:00).',
        'Nếu xếp quá nhiều người vào ca sáng vắng khách, bạn sẽ lãng phí ngân sách trả lương.',
        'Tập trung nhân lực vào ca tối giúp giải quyết hàng dài chờ đợi và tối đa hóa lợi nhuận.'
      ],
      proTip: 'Theo dõi biểu đồ nhịp ca trên thanh HUD để chủ động tăng tốc độ phục vụ.'
    },
    goals: [
      {
        id: 'day6_check_traffic',
        title: 'Quan sát nhịp chuyển đổi các ca bán lẻ',
        hint: 'Theo dõi sự thay đổi nhịp độ từ Ca Sáng -> Trưa -> Cao Điểm Tối.',
        icon: '⏱️',
        targetCount: 1,
        currentCount: 0,
        isCompleted: false,
      },
      {
        id: 'day6_evening_peak',
        title: 'Phục vụ xuất sắc trong Giờ Cao Điểm Tối',
        hint: 'Vượt qua làn sóng khách hàng đông đúc lúc 18:00 - 21:00.',
        icon: '🌙',
        targetCount: 2,
        currentCount: 0,
        isCompleted: false,
      },
      {
        id: 'day6_low_loss',
        title: 'Giữ tỷ lệ khách hài lòng trên 85%',
        hint: 'Hạn chế tối đa khách bỏ về vì đợi lâu hay hết size.',
        icon: '💖',
        targetCount: 1,
        currentCount: 0,
        isCompleted: false,
      }
    ],
    unlockedFeatureLabel: 'Biểu Đồ Lưu Lượng & Kế Hoạch Ca Làm Việc',
    coachingTips: [
      'Nâng cấp Quầy Thu Ngân POS sẽ tăng thêm tiền tip trong các khung giờ cao điểm.',
      'Luôn chuẩn bị đầy đủ hàng trên kệ trước khi bước vào ca tối.'
    ]
  },

  7: {
    dayNumber: 7,
    theme: 'Đại Kết Hoàn 7 Ngày — Chủ Shop Tập Sự',
    subtitle: '“Mình hiểu shop của mình hơn rồi!” 🏆',
    mascotMood: 'celebrating',
    storyOpening: 'Tròn một tuần đồng hành cùng Tiệm Thời Trang Mơ Ước! Bạn đã làm chủ từ việc nhặt đồ, quản lý kho, phòng thử đồ cho tới điều phối nhân sự.',
    learningInsight: 'Hiểu rõ dòng tiền, tỷ lệ giữ chân khách và mặt hàng bán chạy là hành trang vững chắc để bạn nhân rộng chuỗi cửa hàng!',
    whyExplanation: {
      question: 'Báo cáo tổng kết 7 ngày đầu tiên cho ta thấy điều gì?',
      answers: [
        'Giúp nhận diện chính xác dòng sản phẩm nào mang lại biên lợi nhuận cao nhất.',
        'Cho thấy mối tương quan rõ rệt: Điểm đánh giá tăng -> Lượng khách ghé thăm tăng.',
        'Tạo tiền đề vững chắc để lựa chọn chiến lược phát triển dài hạn cho tuần tiếp theo.'
      ],
      proTip: 'Chọn 1 trong 4 định hướng chiến lược Tuần 2 để nhận đặc quyền tăng trưởng tương ứng!'
    },
    goals: [
      {
        id: 'day7_serve_master',
        title: 'Hoàn thành ngày bán hàng thứ 7',
        hint: 'Phục vụ nhiệt tình các lượt khách cuối cùng của tuần đầu tiên.',
        icon: '🌟',
        targetCount: 3,
        currentCount: 0,
        isCompleted: false,
      },
      {
        id: 'day7_review_report',
        title: 'Mở Báo Cáo Tổng Kết Tuần 1',
        hint: 'Xem lại các chỉ số tài chính, số khách và mặt hàng bán chạy.',
        icon: '📊',
        targetCount: 1,
        currentCount: 0,
        isCompleted: false,
      },
      {
        id: 'day7_choose_focus',
        title: 'Nhận huy hiệu & Chọn định hướng Tuần 2',
        hint: 'Vinh danh Chủ Shop Tập Sự và chọn chiến lược bứt phá tiếp theo.',
        icon: '🏆',
        targetCount: 1,
        currentCount: 0,
        isCompleted: false,
      }
    ],
    unlockedFeatureLabel: 'Báo Cáo Toàn Diện Tuần 1 & Định Hướng Chiến Lược',
    coachingTips: [
      'Chúc mừng bạn đã tốt nghiệp xuất sắc khóa huấn luyện Chủ Shop Tập Sự!',
      'Hành trình mở rộng chi nhánh tại Hà Nội, Đà Nẵng, Cần Thơ đang chờ đón bạn.'
    ]
  }
};

export const WEEK_2_FOCUS_OPTIONS: Week2FocusMeta[] = [
  {
    id: 'INVENTORY',
    title: 'Tồn Kho Phong Phú',
    subtitle: 'Đủ size, bắt trend, không lo cháy hàng',
    emoji: '📦',
    colorClass: 'from-amber-400 to-orange-500',
    badge: 'Chiến Lược Hàng Hóa',
    benefit: '+20% Sức chứa kho sau & Giảm 10% giá nhập sỉ từ xưởng',
    description: 'Tập trung đa dạng hóa kiểu dáng (Áo Baby Tee, Baggy Jeans, Sneaker) và dự trữ đầy đủ size M, L.'
  },
  {
    id: 'SERVICE',
    title: 'Dịch Vụ Chu Đáo',
    subtitle: 'Khách hài lòng, phòng thử VIP đẳng cấp',
    emoji: '💖',
    colorClass: 'from-pink-400 to-rose-500',
    badge: 'Chiến Lược Khách Hàng',
    benefit: '+15% Điểm kiên nhẫn ban đầu & Khách dễ dàng tip thêm',
    description: 'Nâng cấp trải nghiệm thử đồ, chăm sóc khách tận tình và thu hút cơn mưa đánh giá 5 sao trên trang review.'
  },
  {
    id: 'COST_EFFICIENCY',
    title: 'Tối Ưu Chi Phí',
    subtitle: 'Kiểm soát dòng tiền, tối đa lợi nhuận ròng',
    emoji: '💰',
    colorClass: 'from-emerald-400 to-teal-500',
    badge: 'Chiến Lược Tài Chính',
    benefit: 'Giảm 15% chi phí tiền lương & tiền thuê mặt bằng ngày',
    description: 'Tối ưu hóa giờ công ca làm, giảm hao hụt hàng hóa và tích lũy ngân sách tiền mặt lớn để chuẩn bị mở chuỗi.'
  },
  {
    id: 'BRAND_REPUTATION',
    title: 'Uy Tín Thương Hiệu',
    subtitle: 'Lookbook thời thượng, lan tỏa mạng xã hội',
    emoji: '⭐',
    colorClass: 'from-purple-400 to-indigo-500',
    badge: 'Chiến Lược Mở Rộng',
    benefit: '+25% Lượng khách vãng lai tự nhiên ghé tiệm mỗi ngày',
    description: 'Đầu tư chụp Lookbook outfit, quảng bá hình ảnh boutique và chuẩn bị mở thêm chi nhánh tại các thành phố lớn.'
  }
];
