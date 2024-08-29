import axios from 'axios'
import type { APIEvent } from "@solidjs/start/server";
export async function POST(event: APIEvent) {
  try {
    const body = await event.request.formData();
    const ck = body.get('ck') as string
    const response = await axios.post('https://f.hatena.ne.jp/upbysmart', body, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Cookie': ck,
      },
    });
    console.log(response, 'response');

    const { data, status } = response;
    if (data?.image_url) {
      return new Response(JSON.stringify(data), {
        status,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      return new Response('Failed to upload image', {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (error) {
    console.log(error, 'response');
    return new Response('Failed to upload image', {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}