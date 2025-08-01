import { type NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(request: NextRequest) {
  try {
    const { name, customMessage } = await request.json();

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    // Generate a unique ID
    const id =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // Store both name and custom message in KV with expiration (30 days)
    const greetingData = {
      name: name.trim(),
      customMessage: customMessage?.trim() || '',
    };

    await kv.set(`greeting:${id}`, JSON.stringify(greetingData), {
      ex: 30 * 24 * 60 * 60,
    });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error generating link:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
