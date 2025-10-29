// Mixpanel configuration and utilities
import mixpanel from 'mixpanel-browser';

// Configuration (exact same as original HTML)
const config = {
  mixpanel: {
    token: "9ebe956e79a1871840a7eba49f9c4106",
    debug: false,
    track_pageview: true,
    persistence: "localStorage"
  }
};

// Initialize Mixpanel
try {
  mixpanel.init(config.mixpanel.token, {
    debug: config.mixpanel.debug,
    track_pageview: config.mixpanel.debug,
    persistence: config.mixpanel.persistence as any,
  });
} catch (error) {
  console.error('Mixpanel initialization error:', error);
}


// Export mixpanel instance
export default mixpanel;

// Utility functions for common tracking
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  try {
    mixpanel.track(eventName, properties);
  } catch (error) {
    console.error('Error tracking event in Mixpanel:', error);
  }
};

export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  try {
    mixpanel.identify(userId);
    if (properties) {
      // Use people.set() to set user profile properties (shows in Users tab)
      mixpanel.people.set(properties);
      // Also register as super properties for events
      mixpanel.register(properties);
    }
  } catch (error) {
    console.error('Error identifying user in Mixpanel:', error);
  }
};

export const resetUser = () => {
  mixpanel.reset();
};

// Helper function to extract issue number from issue ID
export const getIssueNumber = (issueId: string): number => {
  // Extract number from "issue1", "issue2", etc.
  const match = issueId.match(/issue(\d+)/);
  return match ? parseInt(match[1], 10) : 1; // Default to 1 if no match
};
