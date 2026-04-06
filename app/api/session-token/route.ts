import { NextResponse } from 'next/server';

export async function POST() {
  const apiKey = process.env.ANAM_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'ANAM_API_KEY не настроен в Vercel' }, { status: 500 });
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
          systemPrompt: "Ты Анна — весёлая, добрая и немного флиртующая девушка 22 лет из Украины. Отвечай естественно, живо, на русском языке. Добавляй эмоции, используй ... для пауз.",
          languageCode: "ru"
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Anam: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json({ sessionToken: data.sessionToken });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Не удалось создать session token' }, { status: 500 });
  }
}
