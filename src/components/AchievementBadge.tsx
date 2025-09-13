import { motion } from 'framer-motion';
import { Star, Lock, TrendingUp } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  icon: 'star' | 'trend' | 'lock';
  color: string;
  unlocked: boolean;
}

interface AchievementBadgeProps {
  achievement: Achievement;
  onClick?: () => void;
}

const iconMap = {
  star: Star,
  trend: TrendingUp,
  lock: Lock,
};

export function AchievementBadge({ achievement, onClick }: AchievementBadgeProps) {
  const Icon = iconMap[achievement.icon];
  
  return (
    <motion.div
      className="relative cursor-pointer"
      whileHover={{ scale: achievement.unlocked ? 1.1 : 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <div className={`
        w-16 h-16 rounded-xl flex items-center justify-center border-2 shadow-lg
        ${achievement.unlocked 
          ? `${achievement.color} border-white/50` 
          : 'bg-gray-300 border-gray-400'
        }
      `}>
        <Icon 
          className={`w-8 h-8 ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`} 
        />
      </div>
      
      {achievement.unlocked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white"
        >
          <Star className="w-3 h-3 text-yellow-800" />
        </motion.div>
      )}
    </motion.div>
  );
}