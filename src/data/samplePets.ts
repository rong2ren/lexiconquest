export interface Pet {
  id: string;
  name: string;
  specialLook: string;
  personality: string;
  attack: number;
  color: string;
  stats: {
    health: number;
    attack: number;
    defense: number;
    speed: number;
  };
}

export const samplePets: Pet[] = [
  {
    id: "1",
    name: "Flame Dragon",
    specialLook: "A majestic dragon with shimmering red scales",
    personality: "Brave and protective",
    attack: 95,
    color: "red",
    stats: {
      health: 100,
      attack: 95,
      defense: 85,
      speed: 70
    }
  },
  {
    id: "2",
    name: "Ice Phoenix",
    specialLook: "A beautiful phoenix with crystal blue feathers",
    personality: "Wise and mysterious",
    attack: 90,
    color: "blue",
    stats: {
      health: 90,
      attack: 90,
      defense: 80,
      speed: 85
    }
  },
  {
    id: "3",
    name: "Forest Sprite",
    specialLook: "A tiny magical creature with glowing green wings",
    personality: "Playful and curious",
    attack: 75,
    color: "green",
    stats: {
      health: 80,
      attack: 75,
      defense: 70,
      speed: 95
    }
  },
  {
    id: "4",
    name: "Thunder Wolf",
    specialLook: "A powerful wolf with electric blue fur",
    personality: "Loyal and fierce",
    attack: 85,
    color: "purple",
    stats: {
      health: 95,
      attack: 85,
      defense: 90,
      speed: 80
    }
  }
];
