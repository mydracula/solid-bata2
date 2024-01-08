// @ts-nocheck

import { request } from '@/request'
import { APIEvent } from '@solidjs/start/server/types'

const fromBase64 = s => Buffer.from(s, 'base64').toString()
const toBase64 = s => Buffer.from(s).toString('base64')

export async function GET (event: APIEvent) {
  try {
    const search = decodeURIComponent(new URL(event.request.url).search)
    console.log(search,'****');
    const regex = /(\w+)=(https?:\/\/[^\s&]+)/g
    const keyValuePairs = []
    let match
    while ((match = regex.exec(search)) !== null) {
      let key = match[1]
      let value = match[2]
      keyValuePairs.push({ type: key, value: value })
    }
    const result: string[] = []
    console.log(keyValuePairs,'****');
    for (const item of keyValuePairs) {
      if (item.type === 'subscribe') {
        const req = await request.get(item.value)

        result.push(req.data)
      } else {
        const req = await request.get(item.value)
        result.push(toBase64(req.data.map(i => i[item.type]).join('\n')))
      }
    }
    console.log(result,'****');
    return new Response(result.join('\n'))
  } catch (error) {
    return new Response('服务端错误')
  }
}
