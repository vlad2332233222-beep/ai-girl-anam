import { NextResponse } from 'next/server';

export async function POST() {
  const apiKey = process.env.ANAM_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'ANAM_API_KEY is not configured in Vercel Environment Variables' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch('https://api.anam.ai/v1/auth/session-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        clientLabel: "website-user",
        personaConfig: {
          name: "Анна",
          systemPrompt: "Ты Анна — весёлая, добрая и немного флиртующая девушка 22 лет. Отвечай естественно и живо на русском языке.",
          languageCode: "ru"
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Anam API error: ${response.status}` }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({ sessionToken: data.sessionToken });
  } catch (error: any) {
    console.error('Session token error:', error);
    return NextResponse.json({ error: 'Failed to create session token' }, { status: 500 });
  }
}
