import { type NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(request: NextRequest) {
  try {
    const { name, customMessage } = await request.json();
    console.log('Received data:', { name, customMessage });

    if (!name || typeof name !== 'string' || !name.trim()) {
      console.log('Invalid name provided');
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    // Generate a unique ID
    const id =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    console.log('Generated ID:', id);

    // Store both name and custom message in KV with expiration (30 days)
    const greetingData = {
      name: name.trim(),
      customMessage: customMessage?.trim() || '',
    };

    console.log('Storing data:', greetingData);
    console.log('KV key:', `greeting:${id}`);

    try {
      await kv.set(`greeting:${id}`, JSON.stringify(greetingData), {
        ex: 30 * 24 * 60 * 60,
      });
      console.log('Data stored successfully in KV');

      // Verify the data was stored by immediately reading it back
      const verification = await kv.get(`greeting:${id}`);
      console.log('Verification read:', verification);
    } catch (kvError) {
      console.error('KV storage error:', kvError);
      return NextResponse.json(
        { success: false, error: 'Failed to store data' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error generating link:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
