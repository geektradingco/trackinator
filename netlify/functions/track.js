import { logToSheet } from '../../lib/sheets.js'

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    const data = await req.json()

    const row = {
      Timestamp: new Date().toISOString(),
      URL: data.url || '',
      Referrer: data.referrer || '',
      UTM_Source: data.utm?.source || '',
      UTM_Medium: data.utm?.medium || '',
      UTM_Campaign: data.utm?.campaign || '',
      Screen: `${data.screen?.width}x${data.screen?.height}` || '',
      UserAgent: req.headers.get('user-agent') || ''
    }

    await logToSheet(row)

    return new Response('Logged to Google Sheets', { status: 200 })
  } catch (err) {
    console.error('Trackinator error:', err)
    return new Response('Internal Server Error', { status: 500 })
  }
}
