import process from 'node:process'
import crypto from 'node:crypto'

process.on('message', (message) => {
  const { publicKey, fileName, content } = message

  const encryptedContentBuffer = crypto.publicEncrypt(publicKey, Buffer.from(content))

  const encryptedContent = encryptedContentBuffer.toString('base64')

  process.send({ fileNameChild: fileName, encryptedContent })
  process.disconnect()
})
