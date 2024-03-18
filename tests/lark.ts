/* eslint-disable camelcase */
/* eslint-disable no-console */
import 'dotenv/config.js'
import * as lark from '@larksuiteoapi/node-sdk'

const main = async () => {
  const appId = process.env.LARK_APP_ID || ''
  const appSecret = process.env.LARK_APP_SECRET || ''
  const app_token = process.env.LARK_BITABLE_APP_TOKEN || ''
  const user_mobile = process.env.LARK_APP_USER_MOBILE || '13800000000'

  const client = new lark.Client({
    appId,
    appSecret,
  })

  const user = await client.contact.user.batchGetId({
    data:{ mobiles:[ user_mobile ] },
    params:{ user_id_type:'user_id' },
  })
  console.log('\nuser:', JSON.stringify(user))

  if (user.data && user.data.user_list && user.data.user_list.length) {
    const user_id = user.data.user_list[0]?.user_id
    console.log('\nuser_id:', user_id)

    const tables = await client.bitable.appTable.list({ path:{ app_token } })
    console.log('\ntables:', JSON.stringify(tables))

    if (tables.data && tables.data.items && tables.data.items.length) {
      const table_id = tables.data.items[0]?.table_id
      if (table_id) {
        const fields = await client.bitable.appTableField.list({ path:{ app_token, table_id } })
        console.log('\nfields:', JSON.stringify(fields))
      }
    }
  }
}

void main()
