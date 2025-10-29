// Central index for all story configurations
// This makes it easy to import all story configs from one place

import { simpleStoryIssue1 } from '../components/issue1/simpleStoryConfig';
// import { storyIssue2 } from '../components/issue2/storyConfig';
// import { storyIssue3 } from '../components/issue3/storyConfig';
// import { storyTeam1 } from '../components/team1/storyConfig';
// ... add more issues as they are created

// Export all story issues as an object with string keys
export const storyIssues: { [key: string]: any } = {
  "issue1": simpleStoryIssue1,
  // "issue2": storyIssue2,
  // "issue3": storyIssue3,
  // "team1": storyTeam1,
  // ... add more issues here
};

// Export individual issues for direct access
export { simpleStoryIssue1 };
// export { storyIssue2 };
// export { storyIssue3 };
// export { storyTeam1 };
