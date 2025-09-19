export interface KowaiAbility {
  name: string;
  type: 'damage' | 'defense' | 'support';
  power: number; // Number of hearts/shields
  description: string;
}

export interface KowaiDetails {
  name: string;
  displayName: string;
  type: 'fire' | 'water' | 'earth' | 'air' | 'ice' | 'dark' | 'light';
  rarity: 'basic' | 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'evolved';
  hp: number; // Health points (hearts)
  abilities: KowaiAbility[];
  resistances: string[]; // Types this Kowai resists
  weaknesses: string[]; // Types this Kowai is weak to
  personality: string;
  habitat: string;
  funFact: string;
  evolvesFrom?: string; // Name of the Kowai this evolves from
}

export const kowaiDatabase: Record<string, KowaiDetails> = {
  lumino: {
    name: 'lumino',
    displayName: 'Lumino',
    type: 'ice',
    rarity: 'basic',
    hp: 3,
    abilities: [
      {
        name: 'Snow Swirl',
        type: 'damage',
        power: 2,
        description: 'Lumino calls up a swirl of snow that lifts the opponent into the air and spins them around, leaving them dizzy and off-balance.'
      },
      {
        name: 'Quick Glide',
        type: 'defense',
        power: 1,
        description: 'Lumino dashes faster than the eye can see, leaving behind a trail of frost as it slips past the attack unharmed.'
      }
    ],
    resistances: ['earth', 'air'],
    weaknesses: ['fire', 'dark'],
    personality: 'Gentle and caring, Lumino loves to help others and spread positivity.',
    habitat: 'Snowy mountains and frozen tundras',
    funFact: 'Lumino\'s glow changes color based on its mood!'
  },
  
  forcino: {
    name: 'forcino',
    displayName: 'Frocino',
    type: 'ice',
    rarity: 'evolved',
    hp: 5,
    abilities: [
      {
        name: 'Frost Lock',
        type: 'damage',
        power: 3,
        description: 'Frocino raises a chilling wind filled with frost crystals that spins around the opponent. The storm freezes the enemy in place, locking them in a pillar of ice.'
      },
      {
        name: 'Aurora Veil',
        type: 'defense',
        power: 2,
        description: 'Frocino summons a flash of dazzling aurora light that bursts outward. The lights momentarily blind the opponent, allowing it to vanish from sight.'
      }
    ],
    resistances: ['earth', 'air'],
    weaknesses: ['fire', 'dark'],
    personality: 'Brave and loyal, Frocino will protect its friends at all costs.',
    habitat: 'Frozen landscapes and aurora-lit skies',
    funFact: 'Frocino\'s tail glows with aurora-like patterns when it uses its powers!',
    evolvesFrom: 'lumino'
  },

  fanelle: {
    name: 'fanelle',
    displayName: 'Fanelle',
    type: 'earth',
    rarity: 'basic',
    hp: 3,
    abilities: [
      {
        name: 'Crystal Bloom',
        type: 'damage',
        power: 1,
        description: 'Fanelle sends a burst of sparkling energy from its antlers, stunning nearby enemies and briefly blinding them with crystalline light.'
      },
      {
        name: 'Stone Veil',
        type: 'defense',
        power: 1,
        description: 'Fanelle forms a protective crystal shield around itself or a friend for a short time. While active, it slowly heals whoever is protected inside.'
      }
    ],
    resistances: ['fire', 'ice'],
    weaknesses: ['electric', 'water'],
    personality: 'Gentle and mystical, Fanelle brings light to dark places.',
    habitat: 'Crystal caves and rocky mountains',
    funFact: 'Fanelle\'s antlers glow brighter when it\'s happy!'
  },

  scorki: {
    name: 'scorki',
    displayName: 'Scorki',
    type: 'earth',
    rarity: 'basic',
    hp: 3,
    abilities: [
      {
        name: 'Stone Pinch',
        type: 'damage',
        power: 1,
        description: 'Scorki uses its strong pincers to pinch enemies sharply, delivering a quick and precise strike that leaves opponents staggered.'
      },
      {
        name: 'Dig Pop',
        type: 'defense',
        power: 1,
        description: 'Scorki quickly digs into the ground and pops up in another spot. It\'s a sneaky and clever way to escape danger.'
      }
    ],
    resistances: ['fire', 'ice'],
    weaknesses: ['electric', 'water'],
    personality: 'Clever and resourceful, Scorki loves to dig and explore underground.',
    habitat: 'Rocky caves and crystal formations',
    funFact: 'Scorki\'s tail lights up like fairy lights when it\'s excited!'
  },

  peblaff: {
    name: 'peblaff',
    displayName: 'Peblaff',
    type: 'earth',
    rarity: 'basic',
    hp: 3,
    abilities: [
      {
        name: 'Gem Slam',
        type: 'damage',
        power: 1,
        description: 'Peblaff stomps forward with its massive paws, each thunderous step shaking the ground beneath and causing its opponent to stumble.'
      },
      {
        name: 'Moss Shield',
        type: 'defense',
        power: 1,
        description: 'Peblaff curls into a tight ball, and the thick moss covering its body puffs out to form a natural shield that blocks incoming enemy attacks.'
      }
    ],
    resistances: ['fire', 'ice'],
    weaknesses: ['electric', 'water'],
    personality: 'Gentle and protective, Peblaff loves to care for others.',
    habitat: 'Crystal caves and mossy groves',
    funFact: 'Peblaff\'s moss grows thicker when it feels safe and happy!'
  }
};

// Helper function to get Kowai details
export function getKowaiDetails(kowaiName: string): KowaiDetails | null {
  return kowaiDatabase[kowaiName.toLowerCase()] || null;
}

// Helper function to get all Kowai names
export function getAllKowaiNames(): string[] {
  return Object.keys(kowaiDatabase);
}
