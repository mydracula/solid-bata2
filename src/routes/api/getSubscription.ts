// @ts-nocheck

import request from '@/request'
import { APIEvent } from '@solidjs/start/server/types'
const fromBase64 = s => Buffer.from(s, 'base64').toString()
const toBase64 = s => Buffer.from(s).toString('base64')

export async function GET (event: APIEvent) {
  try {
    // const regex = /(\w+)=(https?:\/\/[^\s&]+)/g
    const url = decodeURIComponent(event.request.url)
    const regex = /(?:subscribe|config)=.*?(?=(?:&subscribe=|&config=|$))/g
    let matches
    const keyValuePairs = []
    const result = []
    while ((matches = regex.exec(url)) !== null) {
      const index = matches[0].indexOf('=')
      keyValuePairs.push({
        key: matches[0].split('=')[0],
        value: matches[0].substring(index + 1)
      })
    }

    // console.log(keyValuePairs, '😘')
    for (const item of keyValuePairs) {
      if (item.key === 'subscribe') {
        const req = request.get(item.value).catch(error => {
          return new Response('哈哈哈哈')
        })
        result.push(fromBase64(req.data))
      } else {
        const req = await request.get(item.value)
        Array.prototype.push.apply(
          result,
          req.data.map(i => i[item.key])
        )
      }
    }
    return new Response(toBase64(result.join('\n')))
  } catch (error) {
    return new Response('服务端错误')
  }
}

async function handleConfigRequest (url, result, key) {
  try {
    const req = await request.get(url)
    Array.prototype.push.apply(
      result,
      req.data.map(i => i[key])
    )
  } catch (error) {
    // 抛出异常以便在调用方进行处理
    throw new Error(`处理配置请求失败: ${url}`)
  }
}
