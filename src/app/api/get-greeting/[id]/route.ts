import { type NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    const greetingData = await kv.get(`greeting:${id}`);

    if (!greetingData) {
      return NextResponse.json(
        { success: false, error: 'Greeting not found' },
        { status: 404 }
      );
    }

    // Parse the stored data (handle both old string format and new JSON format)
    let parsedData;
    try {
      parsedData =
        typeof greetingData === 'string'
          ? JSON.parse(greetingData)
          : greetingData;
    } catch {
      // Fallback for old format (just name as string)
      parsedData = { name: greetingData, customMessage: '' };
    }

    return NextResponse.json({
      success: true,
      name: parsedData.name || parsedData,
      customMessage: parsedData.customMessage || '',
    });
  } catch (error) {
    console.error('Error fetching greeting:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
