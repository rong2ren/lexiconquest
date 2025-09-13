// Mixpanel configuration and utilities
import mixpanel from 'mixpanel-browser';

// Configuration (exact same as original HTML)
const config = {
  mixpanel: {
    token: "9ebe956e79a1871840a7eba49f9c4106",
    debug: true,
    track_pageview: true,
    persistence: "localStorage"
  }
};

// Initialize Mixpanel
try {
  console.log('Initializing Mixpanel...');
  mixpanel.init(config.mixpanel.token, {
    debug: config.mixpanel.debug,
    track_pageview: config.mixpanel.debug,
    persistence: config.mixpanel.persistence as any,
  });
  console.log('Mixpanel initialized successfully');
} catch (error) {
  console.error('Mixpanel initialization error:', error);
}

// Get the referring domain
const referringDomain = document.referrer;

// Check if the referring domain matches the one you want to ignore
if (referringDomain.includes('http://127.0.0.1:5500/')) {
  mixpanel.register({ '$ignore': true });
}

// Export mixpanel instance
export default mixpanel;

// Utility functions for common tracking
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  mixpanel.track(eventName, properties);
};

export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  mixpanel.identify(userId);
  if (properties) {
    mixpanel.register(properties);
  }
};

export const resetUser = () => {
  mixpanel.reset();
};
