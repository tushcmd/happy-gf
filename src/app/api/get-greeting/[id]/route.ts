import { type NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('Fetching greeting for ID:', id);

    if (!id) {
      console.log('No ID provided');
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    const kvKey = `greeting:${id}`;
    console.log('Looking for KV key:', kvKey);

    const greetingData = await kv.get(kvKey);
    console.log('Raw KV data:', greetingData);
    console.log('Data type:', typeof greetingData);

    if (!greetingData) {
      console.log('No data found for key:', kvKey);

      // Let's also try to list some keys to see what's in KV
      try {
        const keys = await kv.keys('greeting:*');
        console.log('Available greeting keys:', keys);
      } catch (keysError) {
        console.log('Could not list keys:', keysError);
      }

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
      console.log('Parsed data:', parsedData);
    } catch (parseError) {
      console.log('Parse error, using fallback:', parseError);
      // Fallback for old format (just name as string)
      parsedData = { name: greetingData, customMessage: '' };
    }

    const responseData = {
      success: true,
      name: parsedData.name || parsedData,
      customMessage: parsedData.customMessage || '',
    };

    console.log('Returning response:', responseData);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching greeting:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
