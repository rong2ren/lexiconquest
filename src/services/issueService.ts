import { issues, type Issues, type Quest } from '../data/issueData';

/**
 * Get the current issue by ID, defaults to Issue 1
 */
export const getCurrentIssue = (issueId: number = 1): Issues => {
  const issue = issues.find(issue => issue.id === issueId);
  if (!issue) {
    console.warn(`Issue ${issueId} not found, defaulting to Issue 1`);
    return issues[0]; // Default to Issue 1
  }
  return issue;
};

/**
 * Get quest stats modifiers for a specific quest in an issue
 */
export const getQuestStats = (issueId: number, questNumber: number): { bravery: number; wisdom: number; curiosity: number; empathy: number } | null => {
  const issue = getCurrentIssue(issueId);
  const quest = issue.quests.find(quest => quest.id === questNumber);
  
  if (!quest) {
    console.warn(`Quest ${questNumber} not found in Issue ${issueId}`);
    return null;
  }
  
  return quest.statsModifiers;
};

/**
 * Get the purchase link for an issue
 */
export const getIssuePurchaseLink = (issueId: number): string => {
  const issue = getCurrentIssue(issueId);
  return issue.purchaseLink;
};

/**
 * Get the tally form link for an issue
 */
export const getIssueTallyformLink = (issueId: number): string => {
  const issue = getCurrentIssue(issueId);
  return issue.tallyformLink;
};

/**
 * Get the number of quests in an issue
 */
export const getIssueQuestsCount = (issueId: number): number => {
  const issue = getCurrentIssue(issueId);
  return issue.questsCount;
};

/**
 * Get the title of an issue
 */
export const getIssueTitle = (issueId: number): string => {
  const issue = getCurrentIssue(issueId);
  return issue.title;
};

/**
 * Get the next issue ID
 */
export const getNextIssueId = (currentIssueId: number): number | null => {
  const nextIssue = issues.find(issue => issue.id === currentIssueId + 1);
  return nextIssue ? nextIssue.id : null;
};

/**
 * Get the next issue
 */
export const getNextIssue = (currentIssueId: number): Issues | null => {
  const nextIssueId = getNextIssueId(currentIssueId);
  return nextIssueId ? getCurrentIssue(nextIssueId) : null;
};

/**
 * Check if an issue exists
 */
export const issueExists = (issueId: number): boolean => {
  return issues.some(issue => issue.id === issueId);
};

/**
 * Get all available issues
 */
export const getAllIssues = (): Issues[] => {
  return issues;
};

