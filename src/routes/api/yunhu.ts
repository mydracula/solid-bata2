import { APIEvent, readBody } from '@solidjs/start/server'

export async function POST (event: APIEvent) {
  const body = await readBody(event)
  console.log(body)

  const message = body.event.message
  const { chatId, chatType } = body.event.chat
  const { eventType } = body.header
  const { senderId } = body.event.sender
  const recvId = chatType === 'group' ? chatId : senderId
  const recvType = chatType === 'group' ? chatType : 'user'

  if (eventType === 'message.receive.instruction') {
    const { commandId } = message
    if (commandId == 591) {
      await sendYunHu(
        JSON.stringify({
          recvId,
          recvType,
          contentType: 'markdown',
          content: {
            text: `TCL大厂图床，限制10MB。请勿乱用`
          }
        })
      )
    }
    return
  }
  console.log(message.content)

  if (message.contentType !== 'image') return
  const { imageUrl, imageName } = message.content
  getImageFileFromUrl(imageUrl, async function (imgFile: Blob) {
    const formData = new FormData()
    formData.append(
      'file',
      imgFile,
      /(\.tmp|\.webp)$/.test(imageName)
        ? imageName.replace(/\.(tmp|webp)$/, '.png')
        : imageName
    )
    const response = await (
      await fetch('https://mall.tcl.com/rest/servicecenter/upload', {
        method: 'POST',
        body: formData
      })
    ).json()
    console.log(response)
    if (response.code !== '0') return
    const { fileName, filePath } = response.data
    await sendYunHu(
      JSON.stringify({
        recvId,
        recvType,
        contentType: 'markdown',
        content: {
          text: `![${fileName}](${filePath})`,
          buttons: [
            [
              {
                text: 'URL',
                actionType: 2,
                value: filePath
              },
              {
                text: 'HTML',
                actionType: 2,
                value: `<img src="${filePath}" alt="${fileName}" title="${fileName}" />`
              },
              {
                text: 'BBCode',
                actionType: 2,
                value: `[img]${filePath}[/img]`
              },
              {
                text: 'Markdown',
                actionType: 2,
                value: `![${fileName}](${filePath})`
              },
              {
                text: 'Markdown with link',
                actionType: 2,
                value: `[![${fileName}](${filePath})](${filePath})`
              }
            ]
          ]
        }
      })
    )
  })
}

function getImageFileFromUrl (
  imageUrl: string | URL | Request,
  callback: { (imgFile: any): Promise<void>; (arg0: Blob): void }
) {
  fetch(imageUrl)
    .then(res => {
      return res.blob()
    })
    .then(blob => {
      callback(blob)
    })
}

async function sendYunHu (body: string) {
  console.log(body, '===>>>')
  const response = await (
    await fetch(
      'https://chat-go.jwzhd.com/open-apis/v1/bot/send?token=14168aeeda604a4f9b5424560795089e',
      {
        method: 'POST',
        body
      }
    )
  ).json()
  console.log(response)
}
