/* eslint-disable sort-keys */
/* eslint-disable no-console */

import { VikaBot } from './plugins/vika.js'
import { baseConfig } from './config.js'

const vikaConfig = {
  spaceName:  baseConfig['VIKA_SPACENAME'] || process.env['VIKA_SPACENAME'],
  token: baseConfig['VIKA_TOKEN'] || process.env['VIKA_TOKEN'],
}
const vika = new VikaBot(vikaConfig)

async function init (): Promise<void> {
  await vika.init()
}

// async function getFields (datasheetId: string): Promise<void> {
//   await vika.getSheetFields(datasheetId)
// }

// void getFields('dstKiDu2sEAXJGvsJR')

void init()
