import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Heart, 
  TrendingUp, 
  Check, 
  Award,
  Layers
} from 'lucide-react';
import { useGame } from '../context/GameContext';

export const FashionFeedLookbook: React.FC = () => {
  const { state, claimLookbookOutfit } = useGame();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-pink-100 via-rose-100 to-amber-100 p-5 rounded-3xl border-2 border-pink-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-pink-500 shadow-sm font-bold text-2xl">
            ✨
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-heading font-extrabold text-slate-800 m-0 flex items-center gap-2">
              Lookbook Phối Đồ & Fashion Feed
            </h2>
            <p className="text-xs md:text-sm text-slate-600">
              Khám phá công thức outfit triệu view và theo dõi phản hồi từ cộng đồng mạng!
            </p>
          </div>
        </div>
      </div>

      {/* 1. Lookbook Outfit Recipes Section */}
      <div>
        <h3 className="text-base font-heading font-bold text-slate-800 flex items-center gap-2 mb-3 m-0">
          <Layers className="w-4 h-4 text-pink-500" />
          Công Thức Phối Đồ Triệu View (Lookbook)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.lookbookOutfits.map(outfit => {
            const outfitStyles = outfit.styleIds.map(id => state.styles[id]).filter(Boolean);

            return (
              <motion.div
                key={outfit.id}
                whileHover={{ y: -3 }}
                className={`p-5 rounded-3xl border-2 transition-all bg-white shadow-game-card flex flex-col justify-between ${
                  outfit.isCompleted ? 'border-emerald-300 bg-emerald-50/20' : 'border-pink-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-base font-heading font-bold text-slate-800 m-0">
                        {outfit.title}
                      </h4>
                      <p className="text-xs text-pink-600 font-semibold mt-0.5">
                        {outfit.concept}
                      </p>
                    </div>
                    {outfit.isCompleted ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> ĐÃ MỞ KHÓA
                      </span>
                    ) : (
                      <span className="text-[10px] bg-pink-100 text-pink-700 font-bold px-2 py-0.5 rounded-full">
                        +{outfit.expReward} EXP
                      </span>
                    )}
                  </div>

                  {/* Included Items Preview */}
                  <div className="flex items-center gap-2 my-3 bg-pink-50/60 p-2.5 rounded-2xl border border-pink-100">
                    {outfitStyles.map(st => (
                      <div key={st.id} className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-pink-200 text-xs font-bold text-slate-700 shadow-xs">
                        <span className="text-xl">{st.emoji}</span>
                        <span className="truncate max-w-[90px]">{st.name.split(' ')[0]}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-xs text-slate-600 mb-4 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    ⚡ <b>Hiệu ứng buff:</b> {outfit.bonusText}
                  </div>
                </div>

                <div>
                  {outfit.isCompleted ? (
                    <div className="w-full py-2.5 bg-emerald-100 text-emerald-800 rounded-2xl text-xs font-heading font-bold flex items-center justify-center gap-1">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>Đang kích hoạt hiệu ứng</span>
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => claimLookbookOutfit(outfit.id)}
                      className="btn-3d w-full py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-heading font-bold shadow-game-btn-pink flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Kích hoạt công thức (+{outfit.expReward} EXP)</span>
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 2. Social Fashion Feed */}
      <div>
        <h3 className="text-base font-heading font-bold text-slate-800 flex items-center gap-2 mb-3 m-0">
          <TrendingUp className="w-4 h-4 text-rose-500" />
          Bản Tin Xu Hướng Mạng Xã Hội (Fashion Feed)
        </h3>

        <div className="space-y-3">
          {state.socialPosts.map(post => (
            <div key={post.id} className="bg-white p-4 rounded-3xl border-2 border-pink-100 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">{post.avatar}</span>
                  <div>
                    <h5 className="text-xs font-heading font-bold text-slate-800 m-0">
                      {post.author}
                    </h5>
                    <span className="text-[10px] text-pink-600 font-bold">
                      {post.tag}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400">{post.timestamp}</span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed mb-3">
                {post.content}
              </p>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1 text-rose-500 font-bold">
                  <Heart className="w-3.5 h-3.5 fill-rose-500" />
                  <span>{post.likes} lượt thích</span>
                </div>
                {post.trendBonus && (
                  <span className="text-[10px] bg-rose-50 text-rose-600 font-bold px-2 py-0.5 rounded-full border border-rose-200">
                    ⚡ {post.trendBonus}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
