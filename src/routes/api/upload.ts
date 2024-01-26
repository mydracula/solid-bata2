import { APIEvent } from '@solidjs/start/server/types'
import request from '@/request'

const apis = [
  'https://mall.tcl.com/rest/servicecenter/upload',
  'https://f6v54.xs7ja.6176p.bptc.cn/api/h5UploadImage'
]

// formData = FormData.fromMap({
//   file: await MultipartFile.fromFile(file.path),
//   wechatapp_id: '441150'
// })

export async function POST (event: APIEvent) {
  const binary = await event.request.formData()
  const file = binary.get('file')
  const index = binary.get('index')
  const formData = new FormData()
  if (index === '0') {
    formData.append('file', file)
    formData.append('wechatapp_id', '441150')
  }
  const res = await request({
    url: apis[index],
    method: 'POST',
    data: formData
  })

  if (res.status == 200) {
    const url = res.data.data.filePath

    return {
      URL: url,
      BBCode: `<img src="${url}" alt="${file.name}" title="${file.name}" />`,
      HTML: `[img]${url}[/img]`,
      Markdown: `![${file.name}](${url})`,
      'Markdown with link': `[![${file.name}](${url})](${url})`
    }
  }

  return '1'
}
