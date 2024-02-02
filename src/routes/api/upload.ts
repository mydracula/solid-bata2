// @ts-nocheck

import { APIEvent } from '@solidjs/start/server/types'
import request from '@/request'

const apis = [
  'https://mall.tcl.com/rest/servicecenter/upload',
  'https://f6v54.xs7ja.6176p.bptc.cn/api/h5UploadImage',
  'https://im.gurl.eu.org/upload',
  'https://api.github.com/repos'
]

function uuidv4 () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
    .replace(/[-]/g, '')
}

async function arrayBufferToBase64 (buffer) {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i += 1) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

export async function POST (event: APIEvent) {
  const binary = await event.request.formData()
  const file = binary.get('file')
  const index = binary.get('index')
  const formData = new FormData()
  if (index === '0' || index === '1' || index === '2') {
    formData.append('file', file)
    formData.append('wechatapp_id', '441150')
  } else if (index === '3') {
    var repo = binary.get('repo')
    var fileName = binary.get('fileName')
    var pathname = new Date(Date.now() + 8 * 3600 * 1000)
      .toISOString()
      .replace('Z', '')
      .replace(/[-T.]/g, '')
      .substr(0, 8)
    var ext = '.' + fileName.replace(/\//g, '').split('.').at(-1)
    var uuid = uuidv4()
    apis[
      index
    ] = `https://api.github.com/repos/${repo}/contents/${pathname}/${uuid}${ext}`
  }

  try {
    let res
    if (index === '3') {
      const buffer = await file.arrayBuffer()
      const content = await arrayBufferToBase64(buffer)
      res = await request({
        url: apis[index],
        method: 'PUT',
        data: {
          message: 'init',
          content: content
        },
        headers: {
          Authorization: ``
        }
      })
    } else {
      res = await request({
        url: apis[index],
        method: 'POST',
        data: formData
      })
    }

    const condition = index == 3 ? res.status == 201 : res.status == 200

    if (condition) {
      let url
      if (index == 0) {
        url = res.data.data.filePath
      } else if (index == 1) {
        url = res.data.data[0]['src']
      } else if (index == 2) {
        url = 'https://i0.wp.com/telegraph.cachefly.net/' + res.data[0].src
      } else if (index == 3) {
        url = `https://jsdelivr.b-cdn.net/gh/${repo}@master/${pathname}/${uuid}${ext}`
      }

      return {
        URL: url,
        BBCode: `<img src="${url}" alt="${file.name}" title="${file.name}" />`,
        HTML: `[img]${url}[/img]`,
        Markdown: `![${file.name}](${url})`,
        'Markdown with link': `[![${file.name}](${url})](${url})`
      }
    }
  } catch (error) {
    console.log(error)
    return new Response('服务器错误', {
      status: 500
    })
  }
}
