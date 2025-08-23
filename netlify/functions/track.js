// netlify/functions/track.js

import { blobStore } from '@netlify/blobs'
import { db } from '@netlify/db'

export default async (req, context) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    const data = await req.json()

    // Guard clause: ensure required fields exist
    if (!data.url || !data.referrer || !data.timestamp) {
      return new Response('Missing required fields', { status: 400 })
    }

    const blobKey = `track-${Date.now()}-${Math.random().toString(36).slice(2)}`
    const blob = blobStore(context)
    await blob.set(blobKey, JSON.stringify(data))

    // Optional: log to Netlify DB for querying
    const table = db(context).table('track_events')
    await table.insert({
      url: data.url,
      referrer: data.referrer,
      timestamp: data.timestamp,
      userAgent: req.headers.get('user-agent') || 'unknown',
      ip: context.ip || 'unknown'
    })

    return new Response('Tracked successfully', { status: 200 })
  } catch (err) {
    console.error('Tracking error:', err)
    return new Response('Internal Server Error', { status: 500 })
  }
}
