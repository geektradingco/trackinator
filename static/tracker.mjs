// tracker.mjs

function getUTMParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get('utm_source') || '',
    medium: params.get('utm_medium') || '',
    campaign: params.get('utm_campaign') || ''
  };
}

function buildPayload() {
  return {
    url: window.location.href,
    referrer: document.referrer,
    utm: getUTMParams(),
    screen: {
      width: window.screen.width,
      height: window.screen.height
    },
    userAgent: navigator.userAgent
  };
}

function sendTrackingData() {
  const payload = buildPayload();

  fetch('https://trackinator.netlify.app/.netlify/functions/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => res.text())
    .then(data => console.log('[Trackinator] Success:', data))
    .catch(err => console.error('[Trackinator] Error:', err));
}

// Attach to global scope for manual triggering
window.Trackinator = {
  send: sendTrackingData
};

// Auto-fire on page load
sendTrackingData();
