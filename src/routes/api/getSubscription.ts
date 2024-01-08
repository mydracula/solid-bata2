// @ts-nocheck

import { request } from '@/request'
import { APIEvent } from '@solidjs/start/server/types'

const fromBase64 = s => Buffer.from(s, 'base64').toString()
const toBase64 = s => Buffer.from(s).toString('base64')

export async function GET (event: APIEvent) {
  try {
    console.log(event.request, 'event')

    const search = new URL(event.request.url).search
    const regex = /(\w+)=(https?:\/\/[^\s&]+)/g

    // 提取每个键值对的键和值，并存储在数组中
    const keyValuePairs = []
    let match
    while ((match = regex.exec(search)) !== null) {
      let key = match[1]
      let value = match[2]
      keyValuePairs.push({ type: key, value: value })
    }
    const result: string[] = []

    for (const item of keyValuePairs) {
      if (item.type === 'subscribe') {
        const req = await request.get(item.value)

        result.push(req.data)
      } else {
        const req = await request.get(item.value)
        result.push(toBase64(req.data.map(i => i[item.type]).join('\n')))
      }
    }

    return new Response(result.join('\n'))
  } catch (error) {
    return new Response('服务端错误')
  }
}
