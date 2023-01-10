import fs from 'node:fs'
import crypto from 'node:crypto'
import process from 'node:process'
import { spawn } from 'node:child_process'
import { publicKey, privateKey } from '../lib/keyPairGenerator.js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '../.env' })
const secret = process.env.SECRET

let receivedFileName
let decryptedContent
const timeUsage = Math.floor(process.uptime())
const memoryUsage = process.memoryUsage().heapUsed

const child = spawn('node', ['./child.js'], { stdio: ['ipc'] })

const fileName = './test.txt'
const content = fs.readFileSync(fileName)


child.send({ publicKey, fileName, content })

child.on('message', (message) => {
  receivedFileName = message.fileNameChild
  const receivedContent = Buffer.from(message.encryptedContent, 'base64')

  decryptedContent = crypto.privateDecrypt({
    key: privateKey,
    passphrase: secret,
  }, receivedContent)

  if (fileName === receivedFileName) {
    if (content.toString() === decryptedContent.toString()) {
      console.table({ verification: 'verified', timeUsage, memoryUsage })
      process.exit(0)
    } else {
      console.table({ verification: 'File Content is different', timeUsage, memoryUsage })
      process.exit(1)
    }
  } else {
    console.table({ verification: 'File name is different', timeUsage, memoryUsage })
    process.exit(1)
  }
})
