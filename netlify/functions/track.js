import { JWT } from 'google-auth-library'
import axios from 'axios'
import { log } from '../../utils/logger.js'

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
const SHEET_ID = process.env.GOOGLE_SHEET_ID

export async function handler(event, context) {
  log('🔄 Trackinator invoked')

  try {
    const jwtClient = new JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: SCOPES,
    })

    const { access_token } = await jwtClient.authorize()
    log('🔐 JWT authorized')

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?fields=sheets.properties`

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${access_token}` },
      timeout: 5000,
    })

    log('✅ Sheet metadata retrieved', { sheetCount: response.data.sheets.length })

    return {
      statusCode: 200,
      body: JSON.stringify({ sheets: response.data.sheets }),
    }
  } catch (error) {
    log('❌ Error fetching sheet metadata', { error: error.message })

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Trackinator failed to fetch sheet metadata' }),
    }
  }
}
