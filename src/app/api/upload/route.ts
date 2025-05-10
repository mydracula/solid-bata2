import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    const rkm = process.env.RKM || 'ugpMnZPLjfBB78ecxtINsw';
    const ck = process.env.CK || 'rk=2254808a05e53aa1303768cb275c8d61a7c1b7f8;';

    if (!rkm || !ck) {
      console.error('RKM or CK environment variables are not set. These must be provided via server-side environment variables.');
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    const externalApiFormData = new FormData();
    externalApiFormData.append('image', file);
    externalApiFormData.append('rkm', rkm);
    externalApiFormData.append('ck', ck);
    externalApiFormData.append('with_image_url', 'yes');

    const response = await fetch('https://f.hatena.ne.jp/upbysmart', {
      method: 'POST',
      body: externalApiFormData,
      headers: {
        'Cookie': ck,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Failed to upload image: ${response.statusText} - ${errorText}` }, { status: response.status });
    }
    interface HatenaResponse {
      height: number;
      hatena_syntax: string;
      width: number;
      image_url: string;
    }

    const hatenaApiResponse = await response.json() as HatenaResponse;
    console.log("Hatena API JSON response:", hatenaApiResponse);

    if (!hatenaApiResponse || typeof hatenaApiResponse.image_url !== 'string' || !hatenaApiResponse.image_url.startsWith('http')) {
      return NextResponse.json({ error: 'Failed to extract a valid image URL from Hatena API response.' }, { status: 500 });
    }

    const imageUrl = hatenaApiResponse.image_url;
    return NextResponse.json({ imageUrl: imageUrl });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: `Internal server error: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}