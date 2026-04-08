type AnalyticsEvent = { name: string; props?: Record<string, string | number | boolean> };
export const track = (event: AnalyticsEvent): void => {
  if (process.env.NODE_ENV !== 'production') { console.log('[analytics]', event); return; }
  // Brancher ici Plausible, PostHog, etc.
};
export const pageView = (url: string) => track({ name: 'pageview', props: { url } });
