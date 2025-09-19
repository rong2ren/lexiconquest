import { motion } from 'framer-motion';
import { X, Zap, Shield, Heart } from 'lucide-react';
import { getKowaiDetails } from '../data/kowaiData';

interface KowaiModalProps {
  kowaiName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function KowaiModal({ kowaiName, isOpen, onClose }: KowaiModalProps) {
  if (!isOpen) return null;

  const data = getKowaiDetails(kowaiName);
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
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
              {data.displayName}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                data.type === 'fire' ? 'bg-red-500/20 text-red-300' :
                data.type === 'water' ? 'bg-blue-500/20 text-blue-300' :
                data.type === 'earth' ? 'bg-yellow-500/20 text-yellow-300' :
                data.type === 'air' ? 'bg-cyan-500/20 text-cyan-300' :
                data.type === 'ice' ? 'bg-blue-400/20 text-blue-200' :
                data.type === 'light' ? 'bg-yellow-400/20 text-yellow-200' :
                'bg-purple-500/20 text-purple-300'
              }`}>
                {data.type.toUpperCase()}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                data.rarity === 'basic' ? 'bg-gray-500/20 text-gray-300' :
                data.rarity === 'common' ? 'bg-gray-500/20 text-gray-300' :
                data.rarity === 'uncommon' ? 'bg-green-500/20 text-green-300' :
                data.rarity === 'rare' ? 'bg-blue-500/20 text-blue-300' :
                data.rarity === 'epic' ? 'bg-purple-500/20 text-purple-300' :
                data.rarity === 'evolved' ? 'bg-purple-600/20 text-purple-300' :
                'bg-yellow-500/20 text-yellow-300'
              }`}>
                {data.rarity.toUpperCase()}
              </span>
            </div>
          </div>
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
            alt={data.displayName}
            className="w-full h-auto max-w-96 mx-auto rounded-xl shadow-lg"
          />
        </div>

        {/* Evolution Information */}
        {data.evolvesFrom && (
          <div className="mb-6">
            <div className="flex items-center gap-3 bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden">
                <img 
                  src={`/kowai/${data.evolvesFrom.toLowerCase()}.png`} 
                  alt={data.evolvesFrom}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-purple-300 text-sm font-medium">Evolves from</p>
                <p className="text-white font-bold capitalize">{data.evolvesFrom}</p>
              </div>
            </div>
          </div>
        )}

        {/* HP Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <Heart className="h-5 w-5 text-red-400" />
            <h3 className="text-xl font-bold text-white">HP</h3>
            <div className="flex items-center gap-2">
              {Array.from({ length: data.hp }, (_, i) => (
                <Heart key={i} className="h-6 w-6 text-red-400 fill-current" />
              ))}
            </div>
          </div>
        </div>

        {/* Abilities Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-5 w-5 text-yellow-400" />
            <h3 className="text-xl font-bold text-white">Abilities</h3>
          </div>
          <div className="space-y-4">
            {data.abilities.map((ability, index) => (
              <div key={index} className="bg-slate-700/30 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  {ability.type === 'damage' ? (
                    <Zap className="h-5 w-5 text-red-400" />
                  ) : ability.type === 'defense' ? (
                    <Shield className="h-5 w-5 text-blue-400" />
                  ) : (
                    <Heart className="h-5 w-5 text-green-400" />
                  )}
                  <h4 className="text-lg font-bold text-white">{ability.name}</h4>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-400 capitalize">{ability.type}</span>
                  <div className="ml-auto flex items-center gap-1">
                    {Array.from({ length: ability.power }, (_, i) => (
                      ability.type === 'damage' ? (
                        <Heart key={i} className="h-4 w-4 text-red-400 fill-current" />
                      ) : (
                        <Shield key={i} className="h-4 w-4 text-blue-400 fill-current" />
                      )
                    ))}
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{ability.description}</p>
              </div>
            ))}
          </div>
        </div>


        {/* Resistances and Weaknesses Section */}
        {/* <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-5 w-5 text-purple-400" />
            <h3 className="text-xl font-bold text-white">Resistances & Weaknesses</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <h4 className="text-green-400 font-bold text-sm mb-2">RESISTANCE</h4>
              <div className="flex flex-wrap gap-1">
                {data.resistances.map((resistance, index) => (
                  <span key={index} className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                    {resistance.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <h4 className="text-red-400 font-bold text-sm mb-2">WEAKNESS</h4>
              <div className="flex flex-wrap gap-1">
                {data.weaknesses.map((weakness, index) => (
                  <span key={index} className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-full">
                    {weakness.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div> */}

      </motion.div>
    </motion.div>
  );
}
