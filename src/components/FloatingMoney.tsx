import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';

export const FloatingMoney: React.FC = () => {
  const { state } = useGame();

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {state.floatingNumbers.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 1, y: 0, scale: 0.8 }}
            animate={{ 
              opacity: [1, 1, 0], 
              y: -80, 
              scale: [0.8, 1.25, 1],
              transition: { duration: 1.3, ease: "easeOut" } 
            }}
            exit={{ opacity: 0 }}
            className={`absolute font-heading font-bold text-lg md:text-xl drop-shadow-md px-3 py-1 rounded-full ${
              item.type === 'money'
                ? 'bg-emerald-500 text-white border-2 border-emerald-300'
                : item.type === 'rep'
                ? 'bg-amber-400 text-amber-950 border-2 border-amber-200'
                : item.type === 'sad'
                ? 'bg-rose-500 text-white border-2 border-rose-300'
                : 'bg-pink-500 text-white border-2 border-pink-300'
            }`}
            style={{
              left: `${Math.random() * 40 + 30}%`,
              top: `${Math.random() * 30 + 35}%`,
            }}
          >
            {item.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
