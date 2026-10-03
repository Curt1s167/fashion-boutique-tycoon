import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, X, HelpCircle } from 'lucide-react';
import { useGame } from '../../context/GameContext';

interface FashionQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Question {
  question: string;
  options: { text: string; isCorrect: boolean; feedback: string }[];
}

export const FashionQuizModal: React.FC<FashionQuizModalProps> = ({ isOpen, onClose }) => {
  const { addCash, addReputationExp } = useGame();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [qIndex, setQIndex] = useState(0);

  const questions: Question[] = [
    {
      question: 'Khách hàng chuẩn bị đi hẹn hò lãng mạn tại quán cà phê vintage, nên tư vấn set đồ nào?',
      options: [
        { text: 'Đầm hoa nhí Vintage + Giày Búp Bê + Túi Canvas', isCorrect: true, feedback: 'Chuẩn gu lãng mạn nhẹ nhàng, khách chấm 10 điểm!' },
        { text: 'Đồ bơi Neon + Kính Lặn Biển', isCorrect: false, feedback: 'Hơi nhầm bối cảnh cà phê vintage rồi nè!' },
        { text: 'Set đồ nỉ mùa đông cực dày', isCorrect: false, feedback: 'Mặc vào sẽ hơi nóng bức và thiếu nét thơ mộng.' },
      ]
    },
    {
      question: 'Xu hướng thời trang "Streetwear Gen Z" đang chuộng cách phối đồ nào nhất?',
      options: [
        { text: 'Quần Baggy Jeans ống rộng + Áo Baby Tee + Sneaker Chunky', isCorrect: true, feedback: 'Chính xác! Set đồ hack dáng cực kỳ hot trend hiện nay!' },
        { text: 'Áo sơ mi cài kín cổ + Quần âu dài nghiêm túc', isCorrect: false, feedback: 'Đây là phong cách công sở cổ điển hơn.' },
        { text: 'Áo ba lỗ đi kèm dép xỏ ngón chợ', isCorrect: false, feedback: 'Thiếu điểm nhấn phong cách streetwear rồi!' },
      ]
    },
    {
      question: 'Khi khách hàng lúng túng trong phòng thử đồ vì phân vân giữa 2 size, chủ shop nên làm gì?',
      options: [
        { text: 'Tận tình hỗ trợ đổi size vừa vặn & tư vấn cách phối phụ kiện', isCorrect: true, feedback: 'Dịch vụ 5 sao! Khách hài lòng sẽ trở thành khách ruột!' },
        { text: 'Hối thúc khách mua nhanh để trả phòng thử đồ', isCorrect: false, feedback: 'Khách sẽ tụt kiên nhẫn và bỏ về mất đó!' },
        { text: 'Mặc kệ khách tự lo', isCorrect: false, feedback: 'Khách sẽ cảm thấy bị bỏ rơi và đánh giá 1 sao.' },
      ]
    }
  ];

  const currentQ = questions[qIndex % questions.length];

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelectedIdx(idx);
    setAnswered(true);

    if (currentQ.options[idx].isCorrect) {
      addCash(120000);
      addReputationExp(25);
    }
  };

  const handleNext = () => {
    setSelectedIdx(null);
    setAnswered(false);
    setQIndex(prev => prev + 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-[#FFFDF9] border-4 border-[#EAD7BD] rounded-3xl p-5 md:p-6 max-w-md w-full shadow-2xl relative text-[#3A2317]"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FAF2E6] border border-[#EAD7BD] flex items-center justify-center text-[#7A5A48] hover:bg-rose-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-pink-400 to-purple-400 flex items-center justify-center text-3xl shadow-md mb-2">
            👗
          </div>
          <h2 className="text-xl font-extrabold text-[#3A2317] tracking-tight flex items-center justify-center gap-1.5">
            <span>Thử Thách Stylist</span>
            <Sparkles className="w-4 h-4 text-pink-500 fill-pink-500" />
          </h2>
          <p className="text-xs text-[#7A5A48] mt-0.5">
            Tư vấn chuẩn gu để nhận thưởng nóng +120.000đ & +25 điểm Uy tín!
          </p>
        </div>

        {/* Question Box */}
        <div className="bg-[#FAF2E6] border-2 border-[#EAD7BD] rounded-2xl p-4 my-3">
          <div className="text-[11px] font-bold text-pink-700 uppercase tracking-wider mb-1 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> Câu hỏi tình huống { (qIndex % questions.length) + 1 }/3
          </div>
          <div className="font-extrabold text-sm text-[#3A2317] leading-relaxed">
            {currentQ.question}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-2 my-3">
          {currentQ.options.map((opt, i) => {
            const isChosen = selectedIdx === i;
            let btnClass = 'bg-white border-[#EAD7BD] text-[#3A2317] hover:border-pink-300';
            if (answered) {
              if (opt.isCorrect) btnClass = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
              else if (isChosen) btnClass = 'bg-rose-50 border-rose-400 text-rose-900';
              else btnClass = 'opacity-60 bg-white border-[#EAD7BD] text-slate-500';
            }

            return (
              <button
                key={i}
                disabled={answered}
                onClick={() => handleSelect(i)}
                className={`w-full text-left p-3 rounded-2xl border-2 text-xs transition-all flex items-start gap-2 ${btnClass}`}
              >
                <span className="w-5 h-5 rounded-full bg-[#FAF2E6] border border-[#EAD7BD] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback message */}
        {answered && selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-xl border text-xs mb-3 ${
              currentQ.options[selectedIdx].isCorrect
                ? 'bg-emerald-100/70 border-emerald-300 text-emerald-900'
                : 'bg-rose-100/70 border-rose-300 text-rose-900'
            }`}
          >
            <b>{currentQ.options[selectedIdx].isCorrect ? '🎉 Tuyệt vời! ' : '😅 Tiếc quá! '}</b>
            {currentQ.options[selectedIdx].feedback}
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {answered ? (
            <button
              onClick={handleNext}
              className="flex-1 py-2.5 px-4 rounded-2xl font-extrabold text-xs text-white bg-pink-600 border-2 border-pink-800 shadow-[0_3px_0_#9d174d] active:translate-y-1 transition-all"
            >
              Câu Tiếp Theo ➜
            </button>
          ) : null}
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-2xl font-bold text-xs text-[#7A5A48] bg-[#FAF2E6] border-2 border-[#EAD7BD] hover:bg-slate-100 transition-all text-center"
          >
            Đóng
          </button>
        </div>
      </motion.div>
    </div>
  );
};
