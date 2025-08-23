// tracker.mjs
const sendTrackingEvent = async () => {
  const params = new URLSearchParams(window.location.search);

  const payload = {
    event: 'page_view',
    timestamp: Date.now(),
    url: window.location.href,
    referrer: document.referrer,
    userAgent: navigator.userAgent,
    screen: {
      width: screen.width,
      height: screen.height
    },
    utm: {
      source: params.get('utm_source'),
      medium: params.get('utm_medium'),
      campaign: params.get('utm_campaign')
    }
  };

  try {
    await fetch('https://trackinator.netlify.app/.netlify/functions/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.warn('Trackinator tracking failed:', err);
  }
};

sendTrackingEvent();
