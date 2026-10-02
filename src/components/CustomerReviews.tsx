import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  MessageSquare, 
  CheckCircle2, 
  CornerDownRight, 
  Gift
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import type { ReviewCategory } from '../types/game';

export const CustomerReviews: React.FC = () => {
  const { state, replyToReview } = useGame();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [customReplyText, setCustomReplyText] = useState('');

  const avgStars = state.reviews.length > 0
    ? (state.reviews.reduce((sum, r) => sum + r.stars, 0) / state.reviews.length).toFixed(1)
    : '5.0';

  const categoryLabels: Record<ReviewCategory, string> = {
    product: 'Chất lượng đồ',
    service: 'Thái độ phục vụ',
    fitting: 'Phòng thử đồ',
    cleanliness: 'Vệ sinh shop',
    queue: 'Tốc độ thu ngân',
    size: 'Tình trạng size'
  };

  const filteredReviews = state.reviews.filter(r => {
    if (filterCategory === 'all') return true;
    return r.category === filterCategory;
  });

  const handleQuickReply = (reviewId: string, type: 'thank' | 'apologize' | 'voucher', note: string) => {
    replyToReview(reviewId, type, note);
    setSelectedReviewId(null);
    setCustomReplyText('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Summary Card */}
      <div className="bg-gradient-to-r from-amber-100 via-pink-100 to-rose-100 p-5 rounded-3xl border-2 border-amber-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-white flex flex-col items-center justify-center text-amber-500 shadow-game-btn-gold border-2 border-amber-200">
            <span className="text-xl font-heading font-extrabold leading-none">{avgStars}</span>
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-heading font-extrabold text-slate-800 m-0 flex items-center gap-2">
              Đánh Giá & Trải Nghiệm Khách Hàng
            </h2>
            <p className="text-xs md:text-sm text-slate-600 mt-0.5">
              Đánh giá cao giúp tăng trực tiếp lượng khách ghé thăm tiệm mỗi ngày!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/80 px-4 py-2 rounded-2xl border border-amber-300 text-xs font-bold text-slate-700">
            <span className="text-slate-400 block text-[10px]">TỔNG ĐÁNH GIÁ</span>
            <b className="text-amber-600 text-sm">{state.reviews.length} lượt đánh giá</b>
          </div>
          <div className="bg-white/80 px-4 py-2 rounded-2xl border border-amber-300 text-xs font-bold text-slate-700">
            <span className="text-slate-400 block text-[10px]">ĐÃ PHẢN HỒI</span>
            <b className="text-emerald-600 text-sm">
              {state.reviews.filter(r => r.replied).length} / {state.reviews.length}
            </b>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3.5 py-1.5 rounded-2xl text-xs font-heading font-bold transition-all whitespace-nowrap ${
            filterCategory === 'all'
              ? 'bg-pink-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-pink-50 border border-pink-200'
          }`}
        >
          Tất cả ({state.reviews.length})
        </button>
        {(Object.keys(categoryLabels) as ReviewCategory[]).map(catKey => {
          const count = state.reviews.filter(r => r.category === catKey).length;
          return (
            <button
              key={catKey}
              onClick={() => setFilterCategory(catKey)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-heading font-bold transition-all whitespace-nowrap ${
                filterCategory === catKey
                  ? 'bg-pink-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-pink-50 border border-pink-200'
              }`}
            >
              {categoryLabels[catKey]} ({count})
            </button>
          );
        })}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border-2 border-dashed border-slate-200 text-center text-slate-400">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs font-semibold m-0">Chưa có đánh giá nào trong danh mục này.</p>
          </div>
        ) : (
          filteredReviews.map(rev => (
            <motion.div
              key={rev.id}
              whileHover={{ y: -2 }}
              className="bg-white rounded-3xl p-5 border-2 border-pink-100 hover:border-pink-200 shadow-game-card transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{rev.customerAvatar}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs md:text-sm font-heading font-bold text-slate-800 m-0">
                        {rev.customerName}
                      </h4>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                        {categoryLabels[rev.category]}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < rev.stars ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} 
                        />
                      ))}
                      <span className="text-[10px] text-slate-400 ml-1.5">{rev.timestamp}</span>
                    </div>
                  </div>
                </div>

                {rev.replied ? (
                  <span className="text-[11px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Đã phản hồi
                  </span>
                ) : (
                  <span className="text-[11px] bg-amber-50 text-amber-700 font-bold px-2.5 py-1 rounded-full border border-amber-200">
                    Chờ phản hồi
                  </span>
                )}
              </div>

              {/* Review Content */}
              <p className="text-xs md:text-sm text-slate-700 leading-relaxed my-3 bg-pink-50/40 p-3 rounded-2xl border border-pink-100">
                "{rev.comment}"
              </p>

              {/* Merchant Reply if already replied */}
              {rev.replied && rev.replyNote && (
                <div className="mt-3 bg-purple-50 p-3 rounded-2xl border border-purple-100 text-xs flex items-start gap-2">
                  <CornerDownRight className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-heading font-bold text-purple-900 block mb-0.5">
                      Phản hồi từ Cửa Hàng Trưởng:
                    </span>
                    <p className="text-purple-800 m-0">{rev.replyNote}</p>
                  </div>
                </div>
              )}

              {/* Reply Actions if unreplied */}
              {!rev.replied && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  {selectedReviewId === rev.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={customReplyText}
                        onChange={(e) => setCustomReplyText(e.target.value)}
                        placeholder="Nhập nội dung phản hồi chân thành đến khách..."
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-pink-500"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuickReply(rev.id, 'thank', customReplyText || 'Cảm ơn quý khách đã tin tưởng và ghé thăm tiệm ạ!')}
                          className="px-3 py-1.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs font-bold"
                        >
                          Gửi phản hồi
                        </button>
                        <button
                          onClick={() => setSelectedReviewId(null)}
                          className="px-3 py-1.5 bg-slate-100 text-slate-500 rounded-xl text-xs font-bold"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-500">Phản hồi nhanh:</span>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleQuickReply(rev.id, 'thank', 'Dạ tiệm cảm ơn bạn rất nhiều! Chúc bạn luôn tự tin và rạng rỡ ✨')}
                        className="px-2.5 py-1 bg-pink-100 text-pink-700 hover:bg-pink-200 rounded-xl text-xs font-bold"
                      >
                        Cảm ơn khách hàng ❤️
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleQuickReply(rev.id, 'voucher', 'Tiệm chân thành xin lỗi bạn về trải nghiệm chưa trọn vẹn, xin gửi tặng bạn voucher giảm 20% cho lần ghé tiếp theo ạ! 🎁')}
                        className="px-2.5 py-1 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-xl text-xs font-bold flex items-center gap-1"
                      >
                        <Gift className="w-3 h-3" /> Xin lỗi & Tặng voucher -20%
                      </motion.button>
                      <button
                        onClick={() => { setSelectedReviewId(rev.id); setCustomReplyText(''); }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold"
                      >
                        Viết phản hồi khác...
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
