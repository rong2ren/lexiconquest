import { motion } from 'framer-motion';
import { X, Sparkles, Cloud, Zap } from 'lucide-react';

interface KowaiData {
  name: string;
  specialLook: string[];
  personality: string[];
  attacks: string[];
}

const kowaiData: Record<string, KowaiData> = {
  fanelle: {
    name: 'FANELLE',
    specialLook: [
      "Fanelle's antlers grow clusters of glowing crystals that change color depending on its emotions.",
      "Sensitive ears help Fanelle hear sounds from great distances — even snowflakes falling."
    ],
    personality: [
      "Loves rainy and snowy nights and places where the winds are gentle.",
      "Natural peacemaker — it dislikes conflict and tries to bring harmony to any group.",
      "Shy at first, but once Fanelle bonds with a Trainer, it gives them its full trust and stays deeply loyal."
    ],
    attacks: [
      "Crystal Bloom: Fanelle sends a burst of sparkling energy from its antlers, stunning nearby enemies.",
      "Stone Veil: Can form a protective crystal shield around itself or a friend for a short time."
    ]
  },
  scorki: {
    name: 'SCORKI',
    specialLook: [
      "Scorki is flexible; it is an excellent climber across rocky cliffs and cavern walls.",
      "It prefers to stay in dry, stony habitats and can go days without food."
    ],
    personality: [
      "Scorki is smart and calm. It prefers doing things on its own and rarely makes a sound.",
      "Scorki may not always stay by your side, but if the Trainer is in trouble, it appears immediately.",
      "Calm and cool-headed even in dangerous moments, it carefully watches and waits before acting."
    ],
    attacks: [
      "Stone Pinch: Uses its strong pincers to pinch enemies sharply. This move is quick and precise.",
      "Dig Pop: Scorki quickly digs into the ground in another spot. It's a sneaky way to escape."
    ]
  },
  peblaff: {
    name: 'PEBLAFF',
    specialLook: [
      "Peblaff's soft fur hides a strong, rocky body underneath, making it much tougher than it looks.",
      "Its sturdy body helps it stay balanced and steady, even in bumpy or shaky places."
    ],
    personality: [
      "Peblaff is playful and goofy — it loves to roll around, chase fireflies, and turn anything into a game.",
      "It's friendly and loves cheering others up, especially when things feel sad or a little scary.",
      "Peblaff treats its Trainer like a family and loves cuddling up beside them."
    ],
    attacks: [
      "Gem Slam: It stomps with its crystal-covered paws, shaking the ground beneath its feet.",
      "Moss Shield: Peblaff curls into a ball, and the moss on its body puffs out to block enemy attacks."
    ]
  }
};

interface KowaiModalProps {
  kowaiName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function KowaiModal({ kowaiName, isOpen, onClose }: KowaiModalProps) {
  if (!isOpen) return null;

  const data = kowaiData[kowaiName.toLowerCase()];
  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-600 shadow-2xl custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
            {data.name}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Kowai Image */}
        <div className="text-center mb-8">
          <img 
            src={`/kowai/${kowaiName.toLowerCase()}.png`} 
            alt={data.name}
            className="w-full h-auto max-w-96 mx-auto rounded-xl shadow-lg"
          />
        </div>

        {/* Special Look Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <h3 className="text-xl font-bold text-white">Special Look</h3>
          </div>
          <div className="space-y-2">
            {data.specialLook.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-slate-300 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Personality Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Cloud className="h-5 w-5 text-blue-400" />
            <h3 className="text-xl font-bold text-white">Personality</h3>
          </div>
          <div className="space-y-2">
            {data.personality.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-slate-300 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Attack Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-5 w-5 text-yellow-400" />
            <h3 className="text-xl font-bold text-white">Attack</h3>
          </div>
          <div className="space-y-2">
            {data.attacks.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-slate-300 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
