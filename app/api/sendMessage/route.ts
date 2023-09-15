import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  if (!process.env.PLAYFETCH_API_KEY || !process.env.PLAYFETCH_URL) {
    return new NextResponse('Missing environment variables', { status: 500 })
  }

  const { message, conversationID } = await request.json()

  const response = await fetch(process.env.PLAYFETCH_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.PLAYFETCH_API_KEY,
      'x-continuation-key': conversationID,
    },
    body: JSON.stringify({ message }),
  })

  return new NextResponse(response.body)
}
