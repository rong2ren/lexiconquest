# Quest Event Tracking Design

## Overview

This document outlines the redesigned quest event tracking system for Lexicon Quest for Kids. The new system uses generic event names with structured properties to enable better analytics and data grouping in Mixpanel.

## Quest Events

| Event Name | Description | When Triggered |
|------------|-------------|----------------|
| `Quest Started` | User begins a quest | When quest component mounts |
| `Quest Option Selected` | User makes a choice/selection | When user selects an answer, choice, or option |
| `Quest Completed` | User successfully completes a quest | When quest is finished with correct answer |
| `Quest Failed` | User submits wrong answer | When user submits incorrect answer |
| `Quest Retry` | User retries after wrong answer | When user tries again after failure |
| `Quest Start Failed` | Error when starting a quest | When quest start encounters an error |
| `Quest Back Clicked` | User clicks back button in quest | When user navigates back from quest |

## Kowai Interaction Events

| Event Name | Description | When Triggered |
|------------|-------------|----------------|
| `Kowai Picture Clicked` | User clicks on a Kowai picture | When user clicks on owned/encountered Kowai |
| `Kowai Modal Closed` | User closes Kowai modal | When user closes the Kowai details modal |
| `Kowai Owned` | User gains ownership of a Kowai | When Kowai is added to ownedKowai array |
| `Kowai Encountered` | User encounters a new Kowai | When Kowai is added to encounteredKowai array |

## Profile & Navigation Events

| Event Name | Description | When Triggered |
|------------|-------------|----------------|
| `Purchase Link Clicked` | User clicks purchase/buy link | When user clicks to buy next issue |
| `About Button Clicked` | User clicks about/info button | When user clicks to view about information |
| `Switch Profile Clicked` | User clicks switch trainer button | When user clicks to switch between trainers |
| `Add Profile Clicked` | User clicks add new trainer button | When user clicks to create new trainer |
| `Tally Form Link Clicked` | User clicks survey/feedback form link | When user clicks survey link in ProfilePage |

## Authentication Events

| Event Name | Description | When Triggered |
|------------|-------------|----------------|
| `Login Attempted` | User attempts to log in | When user submits login form |
| `Login Success` | User successfully logs in | When login is successful |
| `Login Failed` | User login fails | When login encounters an error |
| `Signup Attempted` | User attempts to sign up | When user submits signup form |
| `Signup Success` | User successfully signs up | When signup is successful |
| `Signup Failed` | User signup fails | When signup encounters an error |
| `Logout Attempted` | User attempts to log out | When user clicks logout |
| `Logout Success` | User successfully logs out | When logout is successful |
| `Logout Failed` | User logout fails | When logout encounters an error |
| `Password Reset Attempted` | User attempts password reset | When user requests password reset |
| `Password Reset Email Sent` | Password reset email sent | When reset email is successfully sent |
| `Password Reset Failed` | Password reset fails | When password reset encounters an error |

## Standard Properties

All quest events include these standard properties:

```typescript
interface StandardQuestProperties {
  // Quest Identification
  issueNumber: number;        // 1, 2, 3, etc.
  questNumber: number;        // 1, 2, 3, 4, 5, 6
  
  // User Context
  trainerId: string;
  trainerName: string;
  trainerAge: number;
  trainerStats: {
    bravery: number;
    wisdom: number;
    curiosity: number;
    empathy: number;
  };
  
  // Timing
  questStartTime: number;     // Timestamp when quest started
  eventTime: number;          // Timestamp when this event occurred
}
```

## Event-Specific Properties

### Quest Started

```typescript
interface QuestStartedProperties extends StandardQuestProperties {
  // No additional properties needed
}
```

**Example:**
```typescript
trackEvent('Quest Started', {
  issueNumber: 1,
  questNumber: 1,
  trainerId: 'john_doe_8',
  trainerName: 'John Doe',
  trainerAge: 8,
  trainerStats: { bravery: 5, wisdom: 3, curiosity: 7, empathy: 4 },
  questStartTime: 1703123456789,
  eventTime: 1703123456789
});
```

### Quest Option Selected

```typescript
interface QuestOptionSelectedProperties extends StandardQuestProperties {
  optionType: string;         // 'kowai', 'continent', 'choice', 'coordinate', 'route_cell', 'final_choice'
  selectedAnswer: string;     // The actual answer/choice selected by user
}
```

**Example:**
```typescript
trackEvent('Quest Option Selected', {
  issueNumber: 1,
  questNumber: 1,
  trainerId: 'john_doe_8',
  trainerName: 'John Doe',
  trainerAge: 8,
  trainerStats: { bravery: 5, wisdom: 3, curiosity: 7, empathy: 4 },
  questStartTime: 1703123456789,
  eventTime: 1703123460000,
  optionType: 'kowai',
  selectedAnswer: 'lumino'
});
```

### Quest Completed

```typescript
interface QuestCompletedProperties extends StandardQuestProperties {
  selectedAnswer: string;     // Final answer/choice that was correct
  statsGained: {              // Stats earned from this quest
    bravery: number;
    wisdom: number;
    curiosity: number;
    empathy: number;
  };
  totalQuestTime: number;     // Total time spent on quest (ms)
}
```

**Example:**
```typescript
trackEvent('Quest Completed', {
  issueNumber: 1,
  questNumber: 1,
  trainerId: 'john_doe_8',
  trainerName: 'John Doe',
  trainerAge: 8,
  trainerStats: { bravery: 5, wisdom: 3, curiosity: 7, empathy: 4 },
  questStartTime: 1703123456789,
  eventTime: 1703123470000,
  selectedAnswer: 'lumino',
  statsGained: { bravery: 2, wisdom: 0, curiosity: 1, empathy: 0 },
  totalQuestTime: 13211
});
```

### Quest Failed

```typescript
interface QuestFailedProperties extends StandardQuestProperties {
  selectedAnswer: string;     // Wrong answer submitted by user
  totalQuestTime: number;     // Time spent so far (ms)
}
```

**Example:**
```typescript
trackEvent('Quest Failed', {
  issueNumber: 1,
  questNumber: 2,
  trainerId: 'john_doe_8',
  trainerName: 'John Doe',
  trainerAge: 8,
  trainerStats: { bravery: 7, wisdom: 3, curiosity: 8, empathy: 4 },
  questStartTime: 1703123500000,
  eventTime: 1703123520000,
  selectedAnswer: 'Africa',
  totalQuestTime: 20000
});
```

### Quest Retry

```typescript
interface QuestRetryProperties extends StandardQuestProperties {
  // No additional properties needed - retry just resets the quest state
}
```

**Example:**
```typescript
trackEvent('Quest Retry', {
  issueNumber: 1,
  questNumber: 2,
  trainerId: 'john_doe_8',
  trainerName: 'John Doe',
  trainerAge: 8,
  trainerStats: { bravery: 7, wisdom: 3, curiosity: 8, empathy: 4 },
  questStartTime: 1703123500000,
  eventTime: 1703123530000
});
```

### Quest Start Failed

```typescript
interface QuestStartFailedProperties extends StandardQuestProperties {
  error: string;              // Error code or type
  errorMessage: string;       // Human-readable error message
}
```

**Example:**
```typescript
trackEvent('Quest Start Failed', {
  issueNumber: 1,
  questNumber: 1,
  trainerId: 'john_doe_8',
  trainerName: 'John Doe',
  trainerAge: 8,
  trainerStats: { bravery: 5, wisdom: 3, curiosity: 7, empathy: 4 },
  questStartTime: 1703123456789,
  eventTime: 1703123456789,
  error: 'firebase_error',
  errorMessage: 'Failed to update trainer progress'
});
```

### Kowai Picture Clicked

```typescript
interface KowaiPictureClickedProperties extends StandardQuestProperties {
  kowaiName: string;          // Name of the Kowai clicked
  kowaiType: 'owned' | 'encountered';  // Whether Kowai is owned or just encountered
}
```

**Example:**
```typescript
trackEvent('Kowai Picture Clicked', {
  issueNumber: 1,
  trainerId: 'john_doe_8',
  trainerName: 'John Doe',
  trainerAge: 8,
  trainerStats: { bravery: 5, wisdom: 3, curiosity: 7, empathy: 4 },
  questStartTime: 1703123456789,
  eventTime: 1703123500000,
  kowaiName: 'lumino',
  kowaiType: 'owned'
});
```

### Kowai Modal Closed

```typescript
interface KowaiModalClosedProperties extends StandardQuestProperties {
  kowaiName: string;          // Name of the Kowai that was being viewed
  kowaiType: 'owned' | 'encountered';  // Whether Kowai is owned or just encountered
}
```

**Example:**
```typescript
trackEvent('Kowai Modal Closed', {
  issueNumber: 1,
  trainerId: 'john_doe_8',
  trainerName: 'John Doe',
  trainerAge: 8,
  trainerStats: { bravery: 5, wisdom: 3, curiosity: 7, empathy: 4 },
  questStartTime: 1703123456789,
  eventTime: 1703123520000,
  kowaiName: 'lumino',
  kowaiType: 'owned'
});
```

### Kowai Owned

```typescript
interface KowaiOwnedProperties extends StandardQuestProperties {
  kowaiName: string;          // Name of the Kowai that was gained
  kowaiType: 'owned';         // Always 'owned' for this event
}
```

**Example:**
```typescript
trackEvent('Kowai Owned', {
  issueNumber: 1,
  trainerId: 'john_doe_8',
  trainerName: 'John Doe',
  trainerAge: 8,
  trainerStats: { bravery: 5, wisdom: 3, curiosity: 7, empathy: 4 },
  questStartTime: 1703123456789,
  eventTime: 1703123550000,
  kowaiName: 'lumino egg',
  kowaiType: 'owned'
});
```

### Kowai Encountered

```typescript
interface KowaiEncounteredProperties extends StandardQuestProperties {
  kowaiName: string;          // Name of the Kowai that was encountered
  kowaiType: 'encountered';   // Always 'encountered' for this event
}
```

**Example:**
```typescript
trackEvent('Kowai Encountered', {
  issueNumber: 1,
  trainerId: 'john_doe_8',
  trainerName: 'John Doe',
  trainerAge: 8,
  trainerStats: { bravery: 5, wisdom: 3, curiosity: 7, empathy: 4 },
  questStartTime: 1703123456789,
  eventTime: 1703123600000,
  kowaiName: 'forcino',
  kowaiType: 'encountered'
});
```

### Purchase Link Clicked

```typescript
interface PurchaseLinkClickedProperties extends StandardQuestProperties {
  purchaseType: 'issue' | 'subscription';  // Type of purchase
  purchaseIssueNumber?: number;             // Issue being purchased (if applicable)
  purchaseUrl: string;                      // URL of purchase page
}
```

**Example:**
```typescript
trackEvent('Purchase Link Clicked', {
  issueNumber: 1,
  trainerId: 'john_doe_8',
  trainerName: 'John Doe',
  trainerAge: 8,
  trainerStats: { bravery: 5, wisdom: 3, curiosity: 7, empathy: 4 },
  questStartTime: 1703123456789,
  eventTime: 1703123600000,
  purchaseType: 'issue',
  purchaseIssueNumber: 2,
  purchaseUrl: 'https://buy.stripe.com/bJe28t8MxdW6bbI3YdgMw01'
});
```

### About Button Clicked

```typescript
interface AboutButtonClickedProperties extends StandardQuestProperties {
  aboutType: 'info' | 'help' | 'instructions';  // Type of about information
  location: string;                              // Where the about button was clicked
}
```

**Example:**
```typescript
trackEvent('About Button Clicked', {
  issueNumber: 1,
  trainerId: 'john_doe_8',
  trainerName: 'John Doe',
  trainerAge: 8,
  trainerStats: { bravery: 5, wisdom: 3, curiosity: 7, empathy: 4 },
  questStartTime: 1703123456789,
  eventTime: 1703123600000,
  aboutType: 'info',
  location: 'quest_header'
});
```

### Switch Profile Clicked

```typescript
interface SwitchProfileClickedProperties extends StandardQuestProperties {
  currentTrainerId: string;                 // ID of current trainer
  availableTrainersCount: number;           // Number of available trainers
}
```

**Example:**
```typescript
trackEvent('Switch Profile Clicked', {
  issueNumber: 1,
  trainerId: 'john_doe_8',
  trainerName: 'John Doe',
  trainerAge: 8,
  trainerStats: { bravery: 5, wisdom: 3, curiosity: 7, empathy: 4 },
  questStartTime: 1703123456789,
  eventTime: 1703123650000,
  currentTrainerId: 'john_doe_8',
  availableTrainersCount: 3
});
```

### Add Profile Clicked

```typescript
interface AddProfileClickedProperties extends StandardQuestProperties {
  currentTrainersCount: number;             // Number of existing trainers
}
```

**Example:**
```typescript
trackEvent('Add Profile Clicked', {
  issueNumber: 1,
  trainerId: 'john_doe_8',
  trainerName: 'John Doe',
  trainerAge: 8,
  trainerStats: { bravery: 5, wisdom: 3, curiosity: 7, empathy: 4 },
  questStartTime: 1703123456789,
  eventTime: 1703123700000,
  currentTrainersCount: 2
});
```

### Quest Back Clicked

```typescript
interface QuestBackClickedProperties extends StandardQuestProperties {
  fromQuest: number;                        // Quest number being left
  toLocation: 'profile' | 'quest_selection';  // Where user is going back to
}
```

**Example:**
```typescript
trackEvent('Quest Back Clicked', {
  issueNumber: 1,
  questNumber: 3,
  trainerId: 'john_doe_8',
  trainerName: 'John Doe',
  trainerAge: 8,
  trainerStats: { bravery: 5, wisdom: 3, curiosity: 7, empathy: 4 },
  questStartTime: 1703123456789,
  eventTime: 1703123800000,
  fromQuest: 3,
  toLocation: 'profile'
});
```

## Authentication Event Definitions

### Login Attempted

```typescript
interface LoginAttemptedProperties {
  method: 'email' | 'google';  // Authentication method used
}
```

**Example:**
```typescript
trackEvent('Login Attempted', {
  method: 'email'
});
```

### Login Success

```typescript
interface LoginSuccessProperties {
  method: 'email' | 'google';  // Authentication method used
}
```

**Example:**
```typescript
trackEvent('Login Success', {
  method: 'email'
});
```

### Login Failed

```typescript
interface LoginFailedProperties {
  method: 'email' | 'google';  // Authentication method used
  error: string;                // Error code from authentication service
}
```

**Example:**
```typescript
trackEvent('Login Failed', {
  method: 'email',
  error: 'auth/user-not-found'
});
```

### Signup Attempted

```typescript
interface SignupAttemptedProperties {
  method: 'email';  // Authentication method used
}
```

**Example:**
```typescript
trackEvent('Signup Attempted', {
  method: 'email'
});
```

### Signup Success

```typescript
interface SignupSuccessProperties {
  method: 'email';  // Authentication method used
}
```

**Example:**
```typescript
trackEvent('Signup Success', {
  method: 'email'
});
```

### Signup Failed

```typescript
interface SignupFailedProperties {
  method: 'email';  // Authentication method used
  error: string;     // Error code from authentication service
}
```

**Example:**
```typescript
trackEvent('Signup Failed', {
  method: 'email',
  error: 'auth/email-already-in-use'
});
```

### Logout Attempted

```typescript
interface LogoutAttemptedProperties {
  // No additional properties needed
}
```

**Example:**
```typescript
trackEvent('Logout Attempted', {});
```

### Logout Success

```typescript
interface LogoutSuccessProperties {
  // No additional properties needed
}
```

**Example:**
```typescript
trackEvent('Logout Success', {});
```

### Logout Failed

```typescript
interface LogoutFailedProperties {
  error: string;  // Error code from authentication service
}
```

**Example:**
```typescript
trackEvent('Logout Failed', {
  error: 'auth/network-request-failed'
});
```

### Password Reset Attempted

```typescript
interface PasswordResetAttemptedProperties {
  email: string;  // Email address used for reset
}
```

**Example:**
```typescript
trackEvent('Password Reset Attempted', {
  email: 'user@example.com'
});
```

### Password Reset Email Sent

```typescript
interface PasswordResetEmailSentProperties {
  email: string;  // Email address where reset was sent
}
```

**Example:**
```typescript
trackEvent('Password Reset Email Sent', {
  email: 'user@example.com'
});
```

### Password Reset Failed

```typescript
interface PasswordResetFailedProperties {
  email: string;  // Email address used for reset
  error: string;  // Error code from authentication service
}
```

**Example:**
```typescript
trackEvent('Password Reset Failed', {
  email: 'user@example.com',
  error: 'auth/user-not-found'
});
```

### Tally Form Link Clicked

```typescript
interface TallyFormLinkClickedProperties {
  issueNumber: number;  // Issue number for the survey (e.g., 2)
  surveyUrl: string;    // URL of the Tally form
}
```

**Example:**
```typescript
trackEvent('Tally Form Link Clicked', {
  issueNumber: 2,
  surveyUrl: 'https://tally.so/r/3yQ4q4'
});
```

## Quest-Specific Answer Examples

### Quest 1 (Kowai Selection)
- **Option Type**: `'kowai'`
- **Possible Answers**: `'lumino'`, `'forcino'`, `'scorki'`, `'peblaff'`, `'fanelle'`

### Quest 2 (Continent Selection)
- **Option Type**: `'continent'`
- **Possible Answers**: `'Antarctica'`, `'Africa'`, `'Asia'`, `'Europe'`, `'North America'`, `'South America'`, `'Australia'`

### Quest 3 (Choice Selection)
- **Option Type**: `'choice'`
- **Possible Answers**: `'Help the penguins'`, `'Continue exploring'`, `'Ask for directions'` (varies by quest)

### Quest 4 (Coordinate Selection)
- **Option Type**: `'coordinate'`
- **Possible Answers**: `'A1'`, `'A2'`, `'B1'`, `'B2'`, `'C1'`, `'C2'`, etc.

### Quest 5 (Route Planning)
- **Option Type**: `'route_cell'` (for individual cell additions)
- **Possible Answers**: `'A1'`, `'B2'`, `'C3'`, etc.
- **Special Properties**:
  - `routeLength`: Current length of route
  - `cellPosition`: Position of added cell
  - For completion: `route` as array and `selectedAnswer` as comma-separated string

### Quest 6 (Final Choice)
- **Option Type**: `'final_choice'`
- **Possible Answers**: `'Stay and help'`, `'Return home'`, `'Continue the journey'` (varies by quest)

## Special Cases

### Quest 5 Route Planning - Additional Properties

For Quest Option Selected (route cell added):
```typescript
{
  // Standard + Quest Option Selected properties
  routeLength: number;        // Current length of route
  cellPosition: string;       // Position of added cell (e.g., "A1", "B2")
}
```

For Quest Completed:
```typescript
{
  // Standard + Quest Completed properties
  route: string[];            // Final route as array of positions
  routeLength: number;        // Final route length
  planningTime: number;       // Time spent planning route (ms)
  executionTime: number;      // Time spent executing route (ms)
}
```

For Quest Failed:
```typescript
{
  // Standard + Quest Failed properties
  route: string[];            // Invalid route attempted
  routeLength: number;        // Length of invalid route
  validationErrors: string[]; // What was wrong with the route
}
```

## Benefits of This Design

1. **Easy Grouping**: All quest starts can be grouped together in Mixpanel
2. **Consistent Analysis**: Same event names across all quests
3. **Flexible Filtering**: Filter by `issueNumber`, `questNumber`, `optionType`, etc.
4. **Scalable**: Easy to add new issues/quests without changing event names
5. **Rich Analytics**: Can analyze patterns across all quests or drill down to specific ones
6. **Answer Analysis**: Track which answers are most popular and which are commonly wrong
7. **User Behavior**: Understand user preferences and decision patterns

## Mixpanel Dashboard Queries

With this design, you can easily create queries like:

**Quest Analytics:**
- "Show me all Quest Started events for Issue 1"
- "Compare completion rates across all quests"
- "Analyze average decision time by quest number"
- "Track which options are most popular in Quest Option Selected events"
- "Find the most common wrong answers for each quest"
- "Analyze user behavior patterns by age group"
- "Track quest difficulty based on retry patterns"
- "Monitor quest abandonment rates (back button usage)"

**Kowai Interaction Analytics:**
- "Which Kowai are clicked most frequently?"
- "Compare engagement between owned vs encountered Kowai"
- "Track Kowai collection patterns by user age"
- "Analyze time spent viewing Kowai details"
- "Monitor Kowai ownership progression"
- "Identify most popular Kowai for each quest"

**Profile & Navigation Analytics:**
- "Track purchase conversion rates and timing"
- "Analyze profile switching patterns and frequency"
- "Track user engagement with help/info content"
- "Monitor Tally form engagement and completion rates by issue"
- "Analyze user navigation patterns and preferences"

**Authentication & User Management Analytics:**
- "Track login success rates by method (email vs Google)"
- "Monitor signup conversion and failure patterns"
- "Analyze password reset usage and success rates"
- "Track user session patterns and logout behavior"
- "Monitor authentication error patterns and common issues"

## Migration from Old System

### Before (Old System)
```typescript
trackEvent(`${currentTrainer?.firstName} ${currentTrainer?.lastName} Issue 1 Quest 1 Started`, {
  trainerId: currentTrainer?.uid,
  trainerName: currentTrainer ? `${currentTrainer.firstName} ${currentTrainer.lastName}` : null,
  trainerAge: currentTrainer?.age,
  trainerStats: currentTrainer?.stats,
  questStartTime: questStartTime
});
```

### After (New System)
```typescript
trackEvent('Quest Started', {
  issueNumber: 1,
  questNumber: 1,
  trainerId: currentTrainer?.uid,
  trainerName: currentTrainer ? `${currentTrainer.firstName} ${currentTrainer.lastName}` : null,
  trainerAge: currentTrainer?.age,
  trainerStats: currentTrainer?.stats,
  questStartTime: questStartTime,
  eventTime: Date.now()
});
```

## Implementation Notes

1. **Consistent Timing**: Always use `Date.now()` for `eventTime` and store `questStartTime` when quest begins
2. **Answer Formatting**: Keep answers consistent (e.g., always use title case for continents)
3. **Error Handling**: Ensure all required properties are included before tracking
4. **Performance**: Consider batching events if needed for high-frequency interactions
5. **Testing**: Verify all events are being tracked correctly in Mixpanel debug mode

## Future Enhancements

1. **Quest Difficulty Metrics**: Add difficulty scores based on completion rates
2. **Learning Analytics**: Track improvement over multiple attempts
3. **A/B Testing**: Support for testing different quest variations
4. **Real-time Dashboards**: Create live monitoring of quest performance
5. **Predictive Analytics**: Use data to predict quest success rates
