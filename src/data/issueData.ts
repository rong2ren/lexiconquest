export interface Issues {
    id: string;
    title: string;
    purchaseLink: string;
    tallyformLink: string;
    createdAt: string;
    updateAt: string;
  }

  export const issues: Issues[] = [
    {
      id: "1",
      title: "Issue 1",
      purchaseLink: "https://buy.stripe.com/bJedRb2o9g4e93AdyNgMw02",
      tallyformLink: "https://tally.so/r/3lpJWX",
      createdAt: "2025-09-14T12:00:00Z",
      updateAt: "2025-09-14T12:00:00Z",
    },
    {
      id: "2",
      title: "Issue 2",
      purchaseLink: "https://buy.stripe.com/bJe28t8MxdW6bbI3YdgMw01",
      tallyformLink: "https://tally.so/r/3yQ4q4",
      createdAt: "2025-09-14T12:00:00Z",
      updateAt: "2025-09-14T12:00:00Z",
    }
  ];