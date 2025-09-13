export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

export const sampleAchievements: Achievement[] = [
  {
    id: "1",
    title: "First Steps",
    description: "Complete your first lesson",
    icon: "🌟",
    unlocked: true,
    progress: 1,
    maxProgress: 1
  },
  {
    id: "2",
    title: "Word Master",
    description: "Learn 50 new words",
    icon: "📚",
    unlocked: true,
    progress: 50,
    maxProgress: 50
  },
  {
    id: "3",
    title: "Streak Keeper",
    description: "Study for 7 days in a row",
    icon: "🔥",
    unlocked: false,
    progress: 3,
    maxProgress: 7
  },
  {
    id: "4",
    title: "Speed Reader",
    description: "Complete 10 lessons in one day",
    icon: "⚡",
    unlocked: false,
    progress: 0,
    maxProgress: 10
  },
  {
    id: "5",
    title: "Pet Collector",
    description: "Collect 5 magical pets",
    icon: "🐉",
    unlocked: true,
    progress: 4,
    maxProgress: 5
  }
];
