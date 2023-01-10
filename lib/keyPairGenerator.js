import * as dotenv from 'dotenv'

dotenv.config({ path: '../.env' })
const secret = process.env.SECRET

const {
  generateKeyPairSync,
} = await import('node:crypto')

const {
  publicKey,
  privateKey,
} = generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: secret,
  },
})

export { publicKey, privateKey }
