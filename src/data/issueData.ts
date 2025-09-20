export interface Quest {
    id: number;
    statsModifiers: {
        bravery: number;
        wisdom: number;
        curiosity: number;
        empathy: number;
    };
  }
  
export interface Issues {
    id: number;
    title: string;
    purchaseLink: string;
    tallyformLink: string;
    questsCount: number;
    quests: Quest[];
  }

  export const issues: Issues[] = [
    {
      id: 1,
      title: "Issue 1",
      purchaseLink: "https://buy.stripe.com/bJedRb2o9g4e93AdyNgMw02",
      tallyformLink: "https://tally.so/r/3lpJWX",
      questsCount: 6,
      quests: [
        {
          id: 1,
          statsModifiers: {
            bravery: 1,
            wisdom: 1,
            curiosity: 1,
            empathy: 1,
          },
        },
        {
          id: 2,
          statsModifiers: {
            bravery: 1,
            wisdom: 1,
            curiosity: 1,
            empathy: 1,
          },
        },
        {
          id: 3,
          statsModifiers: {
            bravery: 1,
            wisdom: 1,
            curiosity: 1,
            empathy: 1,
          },
        },
        {
          id: 4,
          statsModifiers: {
            bravery: 1,
            wisdom: 1,
            curiosity: 1,
            empathy: 1,
          },
        },
        {
          id: 5,
          statsModifiers: {
            bravery: 1,
            wisdom: 1,
            curiosity: 1,
            empathy: 1,
          },
        },
        {
          id: 6,
          statsModifiers: {
            bravery: 1,
            wisdom: 1,
            curiosity: 1,
            empathy: 1,
          },
        }
      ],
    },
    {
      id: 2,
      title: "Issue 2",
      purchaseLink: "https://buy.stripe.com/bJe28t8MxdW6bbI3YdgMw01",
      tallyformLink: "https://tally.so/r/3yQ4q4",
      questsCount: 6,
      quests: [
        {
          id: 1,
          statsModifiers: {
            bravery: 1,
            wisdom: 1,
            curiosity: 1,
            empathy: 1,
          },
        },
      ],
    }
  ];