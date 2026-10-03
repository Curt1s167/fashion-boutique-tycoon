import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, RefreshCw, CheckCircle2, MessageCircle, ArrowRight } from 'lucide-react';
import { useGame } from '../../context/GameContext';

interface DesktopSidebarsProps {
  onOpenMiniWindow?: () => void;
  onOpenGacha?: () => void;
  onOpenQuiz?: () => void;
}

export const DesktopSidebars: React.FC<DesktopSidebarsProps> = ({
  onOpenMiniWindow,
}) => {
  const { state, setActiveTab, replyToReview } = useGame();
  const [revFilter, setRevFilter] = useState<'all' | '5' | '4' | '3' | 'nr'>('all');
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  // Dynamic social posts based on state
  const [feedPosts, setFeedPosts] = useState([
    {
      id: 'p1',
      author: 'Minh Thư (Fashionista)',
      avatar: '✨',
      badge: 'Hot TikToker',
      text: 'Mới ghé Nini sắm được chiếc đầm công chúa xinh xỉu 💖 Chất vải mềm rũ tôn dáng cực kỳ! Recommend cho các nàng nhé!',
      likes: 124,
      time: '15 phút trước',
      item: 'Đầm Xòe Pastel',
      reply: 'Nini: Cảm ơn Thư đã ghé tiệm yêu thương ạ ♡ Chúc nàng luôn rạng rỡ nha!'
    },
    {
      id: 'p2',
      author: 'Lan Anh Nguyễn',
      avatar: '🌸',
      badge: 'Khách Ruột',
      text: 'Đi săn đồ sale ở Nini mà rinh nguyên cả set Baggy Jeans + Áo Baby Tee! Phòng thử đồ rộng rãi mát rượi, nhân viên cưng xỉu.',
      likes: 89,
      time: '1 giờ trước',
      item: 'Baggy Jeans + Baby Tee'
    },
    {
      id: 'p3',
      author: 'Hải Yến Stylist',
      avatar: '🎀',
      badge: 'Stylist VIP',
      text: 'Tone màu hồng ấm của tiệm Nini nhìn từ ngoài vào đã thấy muốn ghé rồi. Bộ sưu tập mùa mới chuẩn gu Gen Z luôn!',
      likes: 215,
      time: '3 giờ trước',
      item: 'Set Blazer Hàn Quốc',
      reply: 'Nini: Tiệm sắp về thêm mẫu thu đông mới, chị Yến nhớ ghé thử đồ sớm nhen!'
    },
    {
      id: 'p4',
      author: 'Khánh Vy',
      avatar: '🧸',
      badge: 'OOTD Creator',
      text: 'Chụp lookbook cho tuần mới bằng đồ mua tại Nini. Lên hình sáng da và che khuyết điểm siêu đỉnh 👍 10/10 điểm!',
      likes: 167,
      time: '5 giờ trước',
      item: 'Áo Thun Phối Sneaker'
    }
  ]);

  const toggleLike = (id: string) => {
    setLikedPosts(prev => {
      const isLiked = !prev[id];
      setFeedPosts(posts => posts.map(p => {
        if (p.id === id) {
          return { ...p, likes: isLiked ? p.likes + 1 : p.likes - 1 };
        }
        return p;
      }));
      return { ...prev, [id]: isLiked };
    });
  };

  const handleRefreshFeed = () => {
    // Add simulated viral post
    const sampleAuthors = ['Bảo Ngọc', 'Phương Uyên', 'Hoàng Yến', 'Thảo My'];
    const sampleAvts = ['🌷', '👒', '🎀', '💎'];
    const randomAuthor = sampleAuthors[Math.floor(Math.random() * sampleAuthors.length)];
    const randomAvt = sampleAvts[Math.floor(Math.random() * sampleAvts.length)];
    const newPost = {
      id: `p_${Date.now()}`,
      author: randomAuthor,
      avatar: randomAvt,
      badge: 'Khách Mới',
      text: `Vừa ghé tiệm Nini săn đồ nè! Phục vụ nhanh mà đồ gói đẹp như quà tặng sinh nhật vậy á 🛍️`,
      likes: Math.floor(Math.random() * 50) + 10,
      time: 'Vừa xong',
      item: 'Phụ Kiện & Túi Xách'
    };
    setFeedPosts(prev => [newPost, ...prev.slice(0, 7)]);
  };

  // Reviews calculation
  const totalReviews = state.reviews.length;
  const avgRating = totalReviews > 0
    ? (state.reviews.reduce((acc, r) => acc + r.stars, 0) / totalReviews).toFixed(1)
    : '5.0';

  const starCounts = [5, 4, 3, 2, 1].map(stars => {
    const cnt = state.reviews.filter(r => r.stars === stars).length;
    const pct = totalReviews > 0 ? Math.round((cnt / totalReviews) * 100) : stars === 5 ? 100 : 0;
    return { stars, cnt, pct };
  });

  const filteredReviews = state.reviews.filter(r => {
    if (revFilter === 'all') return true;
    if (revFilter === 'nr') return !r.replied;
    return r.stars === Number(revFilter);
  });

  const activeBranch = state.branches.find(b => b.isUnlocked) || state.branches[0];

  return (
    <>
      {/* =========================================================================
          LEFT SIDEBAR: Mạng Xã Hội (Nini Social Feed & Shop Profile)
          ========================================================================= */}
      <aside className="desktop-sidebar desktop-sidebar-left" aria-label="Mạng Xã Hội Quán">
        <div className="desktop-sidebar-head">
          <div className="desktop-sidebar-title">
            <span>📱</span> <b>Mạng Xã Hội Nini</b>
          </div>
          <div className="desktop-sidebar-actions">
            <button
              type="button"
              className="pbtn text-xs font-bold"
              title="Mở cửa sổ nhỏ (450x880)"
              onClick={() => {
                if (onOpenMiniWindow) onOpenMiniWindow();
                else window.open(window.location.href, '_blank', 'width=460,height=880,resizable=yes');
              }}
            >
              🪟
            </button>
            <button
              type="button"
              className="pbtn text-xs font-bold"
              title="Làm mới bảng tin"
              onClick={handleRefreshFeed}
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#7a5a48]" />
            </button>
          </div>
        </div>

        <div className="desktop-sidebar-body">
          {/* Shop Profile Card */}
          <div className="desktop-profile-card">
            <div className="desktop-profile-top">
              <div className="desktop-profile-avatar">
                <img src="/brand/nini-avatar.png" alt="Nini" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <div className="desktop-profile-name" title="Tiệm Thời Trang Nini">
                  Tiệm Thời Trang Nini ♡
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="desktop-badge verified">✓ Tích Xanh Official</span>
                  <span className="text-[10px] text-[#8B6A60] truncate">{activeBranch.name}</span>
                </div>
              </div>
            </div>

            <div className="desktop-stats-row">
              <div className="desktop-stat-cell">
                <b className="text-sky-600">{(state.reputationStars * 3200 + 12500).toLocaleString()}</b>
                <small>Followers</small>
              </div>
              <div className="desktop-stat-cell">
                <b className="text-amber-500">{avgRating} ★</b>
                <small>{totalReviews} Đánh giá</small>
              </div>
              <div className="desktop-stat-cell">
                <b className="text-emerald-600">+{state.upgrades.marketing.level * 15}%</b>
                <small>Buff Viral</small>
              </div>
            </div>
          </div>

          {/* Active Ad Campaign */}
          <div className={`desktop-ad-card ${state.upgrades.marketing.level > 0 ? 'active' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="desktop-ad-title flex items-center gap-1">
                <span>📢</span>
                <b>Chiến dịch Ads TikTok & IG:</b>
              </div>
              <button 
                onClick={() => setActiveTab('upgrades')}
                className="text-[11px] text-pink-600 font-bold hover:underline flex items-center gap-0.5"
              >
                Nâng cấp <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="desktop-ad-info mt-1">
              {state.upgrades.marketing.level > 0 ? (
                <span>
                  🔥 <b>Livestream Nini x TikTok Shop:</b> Cấp {state.upgrades.marketing.level} (+{state.upgrades.marketing.level * 20}% lượng khách ghé shop)
                </span>
              ) : (
                <span className="text-[#7a5a48]">
                  Chưa chạy quảng cáo. Nâng cấp Marketing để hút thêm khách VIP!
                </span>
              )}
            </div>
          </div>

          <div className="text-[11px] font-bold text-[#7a5a48] uppercase tracking-wider flex items-center gap-1 mt-1">
            <span>✨</span> <span>Bảng Tin Khách Check-In</span>
          </div>

          {/* Social Feed Posts */}
          {feedPosts.map(post => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="desktop-feed-card"
            >
              <div className="desktop-feed-head">
                <span className="desktop-feed-avt">{post.avatar}</span>
                <div>
                  <div className="desktop-feed-author">{post.author}</div>
                  <div className="text-[10px] text-[#7a5a48]">{post.time}</div>
                </div>
                <span className="desktop-feed-badge">{post.badge}</span>
              </div>

              <div className="desktop-feed-text">
                {post.text}
              </div>

              {post.item && (
                <div className="text-[11px] font-semibold text-pink-700 bg-pink-50/80 px-2 py-1 rounded-md border border-pink-200/60 inline-flex items-center gap-1">
                  <span>🛍️</span> <span>Món đã mua: <b>{post.item}</b></span>
                </div>
              )}

              {post.reply && (
                <div className="desktop-feed-reply-item">
                  💬 {post.reply}
                </div>
              )}

              <div className="desktop-feed-actions">
                <button
                  type="button"
                  onClick={() => toggleLike(post.id)}
                  className={`desktop-feed-like ${likedPosts[post.id] ? 'liked' : ''}`}
                >
                  <Heart className={`w-3 h-3 ${likedPosts[post.id] ? 'fill-red-500 text-red-500' : ''}`} />
                  <span>{post.likes}</span>
                </button>
                <button 
                  onClick={() => setActiveTab('lookbook')}
                  className="text-[11px] text-[#7a5a48] hover:text-pink-600 font-semibold flex items-center gap-1"
                >
                  <MessageCircle className="w-3 h-3" /> Xem Lookbook
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </aside>

      {/* =========================================================================
          RIGHT SIDEBAR: Đánh Giá Của Khách (Customer Reviews & Star Breakdown)
          ========================================================================= */}
      <aside className="desktop-sidebar desktop-sidebar-right" aria-label="Đánh Giá Của Khách">
        <div className="desktop-sidebar-head">
          <div className="desktop-sidebar-title">
            <span>⭐</span> <b>Đánh Giá Của Khách</b>
          </div>
          <div className="desktop-sidebar-actions">
            <button
              type="button"
              className="pbtn text-xs font-bold"
              title="Làm mới đánh giá"
              onClick={() => setActiveTab('reviews')}
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#7a5a48]" />
            </button>
          </div>
        </div>

        <div className="desktop-sidebar-body">
          {/* Rating Summary Card */}
          <div className="desktop-rev-summary">
            <div className="desktop-rev-score">
              <b>{avgRating}</b>
              <div className="desktop-rev-stars">★★★★★</div>
              <small>{totalReviews} nhận xét</small>
            </div>

            <div className="desktop-rev-bars">
              {starCounts.map(({ stars, cnt, pct }) => (
                <div key={stars} className="desktop-rev-bar-row">
                  <span className="w-4">{stars}★</span>
                  <div className="desktop-bar-track">
                    <div className="desktop-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-6 text-right">{cnt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Filter Chips */}
          <div className="desktop-flt-chips">
            <button
              type="button"
              className={`desktop-chip ${revFilter === 'all' ? 'on' : ''}`}
              onClick={() => setRevFilter('all')}
            >
              Tất cả ({totalReviews})
            </button>
            <button
              type="button"
              className={`desktop-chip ${revFilter === '5' ? 'on' : ''}`}
              onClick={() => setRevFilter('5')}
            >
              5★ ({starCounts.find(s => s.stars === 5)?.cnt || 0})
            </button>
            <button
              type="button"
              className={`desktop-chip ${revFilter === '4' ? 'on' : ''}`}
              onClick={() => setRevFilter('4')}
            >
              4★ ({starCounts.find(s => s.stars === 4)?.cnt || 0})
            </button>
            <button
              type="button"
              className={`desktop-chip ${revFilter === '3' ? 'on' : ''}`}
              onClick={() => setRevFilter('3')}
            >
              3★ ({starCounts.find(s => s.stars === 3)?.cnt || 0})
            </button>
            <button
              type="button"
              className={`desktop-chip ${revFilter === 'nr' ? 'on' : ''}`}
              onClick={() => setRevFilter('nr')}
            >
              Cần trả lời ({state.reviews.filter(r => !r.replied).length})
            </button>
          </div>

          {/* Reviews List */}
          {filteredReviews.length === 0 ? (
            <div className="text-center py-8 text-[#7a5a48] text-xs">
              Chưa có đánh giá nào phù hợp bộ lọc.
            </div>
          ) : (
            filteredReviews.slice(0, 10).map(rev => (
              <motion.div
                key={rev.id}
                layout
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`desktop-rev-card ${rev.stars >= 4 ? 'good' : 'bad'}`}
              >
                <div className="desktop-rev-head">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{rev.customerAvatar}</span>
                    <span className="desktop-rev-user">{rev.customerName}</span>
                  </div>
                  <div className="desktop-rev-rating">
                    {'★'.repeat(rev.stars)}{'☆'.repeat(5 - rev.stars)}
                  </div>
                </div>

                <div className="desktop-rev-sub flex items-center justify-between">
                  <span>Dịch vụ: <b className="capitalize">{rev.category}</b></span>
                  <span>{new Date(rev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <div className="desktop-rev-text">
                  "{rev.comment}"
                </div>

                {rev.replied ? (
                  <div className="text-[10px] text-emerald-800 bg-emerald-50 p-1.5 rounded border border-emerald-200 mt-1 flex items-start gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                    <span><b>Shop trả lời:</b> {rev.replyNote || 'Cảm ơn bạn đã ủng hộ tiệm Nini!'}</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => replyToReview(rev.id, 'thank', 'Cảm ơn bạn yêu đã tin chọn tiệm Nini! Chúc bạn diện đồ thật xinh xắn ♡')}
                    className="mt-1 text-[11px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-md py-1 px-2 text-center transition-colors"
                  >
                    💬 Phản hồi cảm ơn (+5 Uy tín)
                  </button>
                )}
              </motion.div>
            ))
          )}
        </div>
      </aside>
    </>
  );
};
