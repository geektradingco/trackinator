export function log(message, meta = {}) {
  const timestamp = new Date().toISOString()
  console.log(`[Trackinator] ${timestamp} - ${message}`, meta)
}