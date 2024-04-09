// @ts-nocheck

import { APIEvent } from '@solidjs/start/server'
import CryptoJS from 'crypto-js'

export async function POST (event: APIEvent) {
  const body = await event.request.formData()
  const formData = new FormData()
  const timestamp = Date.now().toString()
  formData.append('file', body.get('file'))
  formData.append('timestamp', timestamp)
  formData.append('nonce', 'WCLtScJD')
  const locale = getSignature({
    nonce: 'WCLtScJD',
    timestamp
  })

  console.log('开始请求')

  const response = await (
    await fetch('https://api.weixinyanxuan.com/mall/api/img/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept-Locale': locale,
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        DNT: '1',
        Origin: 'https://b.haiduiyanxuan.cn',
        Pragma: 'no-cache',
        Referer: 'https://b.haiduiyanxuan.cn/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
        'User-Agent':
          'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
      }
    })
  ).json()
  return response
}

function getImageFileFromUrl (
  imageUrl: string | URL | Request,
  callback: { (imgFile: any): Promise<void>; (arg0: Blob): void }
) {
  return fetch(imageUrl)
    .then(res => {
      if (res.status == 200) return res.blob()
      return Promise.reject(false)
    })
    .then(blob => {
      callback(blob)
    })
}

async function sendYunHu (body: string) {
  const response = await (
    await fetch(
      'https://chat-go.jwzhd.com/open-apis/v1/bot/send?token=14168aeeda604a4f9b5424560795089e',
      {
        method: 'POST',
        body
      }
    )
  ).json()
}

function getSignature (e) {
  var t = 'fuck-your-mother-three-thousand-times-apes-not-kill-apes'
  var n = Object.keys(e)
    .sort()
    .map(function (key) {
      if (typeof e[key] !== 'object' && e[key] !== null) {
        return key + '=' + e[key]
      }
    })
    .filter(function (str) {
      return str
    })
  var n = n.join('&')
  var i = CryptoJS.MD5(n + t).toString()
  return i
}
