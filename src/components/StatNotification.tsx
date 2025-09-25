import { motion } from 'framer-motion';

interface StatNotificationProps {
  show: boolean;
  statChanges: {
    bravery: number;
    wisdom: number;
    curiosity: number;
    empathy: number;
  };
}

export function StatNotification({ show, statChanges }: StatNotificationProps) {
  if (!show) return null;

  const getStatIcon = (stat: string) => {
    switch (stat) {
      case 'bravery': return '🛡️';
      case 'wisdom': return '⭐';
      case 'curiosity': return '🔍';
      case 'empathy': return '❤️';
      default: return '';
    }
  };

  const getStatName = (stat: string) => {
    switch (stat) {
      case 'bravery': return 'Bravery';
      case 'wisdom': return 'Wisdom';
      case 'curiosity': return 'Curiosity';
      case 'empathy': return 'Empathy';
      default: return '';
    }
  };

  const stats = [
    { key: 'bravery', value: statChanges.bravery },
    { key: 'wisdom', value: statChanges.wisdom },
    { key: 'curiosity', value: statChanges.curiosity },
    { key: 'empathy', value: statChanges.empathy }
  ].filter(stat => stat.value > 0);

  return (
    <div className="flex items-center gap-2">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.key}
          initial={{ opacity: 0, scale: 0, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0, x: -20 }}
          transition={{ 
            duration: 0.6,
            type: "spring",
            stiffness: 300,
            delay: index * 0.1
          }}
        >
          <motion.span
            className="font-bold text-lg text-slate-700"
            animate={{ 
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 0.8,
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            {getStatIcon(stat.key)} {getStatName(stat.key)} +{stat.value}
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
}
