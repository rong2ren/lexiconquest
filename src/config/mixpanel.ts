import mixpanel from 'mixpanel-browser';

// Mixpanel configuration
export const mixpanelConfig = {
  token: "9ebe956e79a1871840a7eba49f9c4106",
  debug: true,
  track_pageview: true,
  persistence: "localStorage"
};

// Initialize Mixpanel
mixpanel.init(mixpanelConfig.token, {
  debug: mixpanelConfig.debug,
  track_pageview: mixpanelConfig.track_pageview,
  persistence: mixpanelConfig.persistence as any,
});

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
