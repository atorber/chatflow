import {
  PassThrough,
  Readable,
}               from 'stream'

// The npm package of my best choice for QR code decoding on Angular SPA
// https://dev.to/j_sakamoto/the-npm-package-of-my-best-choice-for-qr-code-decoding-on-angular-spa-4747?returning-user=true
import Jimp             from 'jimp'
import jsQR             from 'jsqr'

/**
 * https://www.npmjs.com/package/qrcode
 *  Huan(202002): This module is encode only.
 */
import { toFileStream } from 'qrcode'

export async function bufferToQrValue (buf: Buffer): Promise<string> {
  const image = await Jimp.read(buf)
  const qrCodeImageArray = new Uint8ClampedArray(image.bitmap.data.buffer)

  const qrCodeResult = jsQR(
    qrCodeImageArray,
    image.bitmap.width,
    image.bitmap.height,
  )

  if (qrCodeResult) {
    return qrCodeResult.data
  } else {
    throw new Error('bufferToQrcode(buf) fail!')
  }
}

export async function qrValueToStream (value: string): Promise<Readable> {
  const stream = new PassThrough()
  await toFileStream(stream, value) // only support .png for now
  return stream
}
