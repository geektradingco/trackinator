import { GoogleSpreadsheet } from 'google-spreadsheet'

export async function logToSheet(rowData) {
  const credsBase64 = process.env.GOOGLE_SERVICE_ACCOUNT
  const sheetId = process.env.GOOGLE_SHEET_ID

  if (!credsBase64 || !sheetId) throw new Error('Missing env vars')

  const creds = JSON.parse(Buffer.from(credsBase64, 'base64').toString('utf8'))

  const doc = new GoogleSpreadsheet(sheetId)
  await doc.useServiceAccountAuth(creds)
  await doc.loadInfo()

  const sheet = doc.sheetsByIndex[0]
  await sheet.addRow(rowData)
}
