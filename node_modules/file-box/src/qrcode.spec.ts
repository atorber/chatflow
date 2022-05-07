#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { test } from 'tstest'

import {
  bufferToQrValue,
  qrValueToStream,
}                     from './qrcode.js'

test('imageBase64ToQrCode()', async t => {
  const QRCODE_IMAGE_BASE64 = [
    'iVBORw0KGgoAAAANSUhEUgAAAMgAAADIAQMAAACXljzdAAAABlBMVEX///8AAABVwtN+AAAA',
    'CXBIWXMAAA7EAAAOxAGVKw4bAAAA7klEQVRYw+2WsQ3EIAxFjShSMgKjZLRktIzCCJQpIv7Z',
    'hCiXO/qzT/wCWXo0X3wbEw0NWVaEKM187KHW2QLZ+AhpXovfQ+J6skEWHELqBa5NEeCwR7iS',
    'V7BDzuzAiZ9eqn5IWjfWXHf7VCO5tPAM6U9AjSRideyHFn4FiuvDqV5CM9rZXuF2pZmIAjZy',
    'x4S0MDdBxEmu3TrliPf7iglPvuLlRydfU3P70UweCSK+ZYK0mUg1O4AVcv0/8itGkC7SdiTH',
    '0+Mz19oJZ4NkhhSPbIhQkQGI8u1HJzmzs7p7pzNAru2pJb6z8ykkQ0P/pheK6vjurjf7+wAA',
    'AABJRU5ErkJggg==',
  ].join('')
  const EXPECTED_QRCODE_TEXT = 'hello, world!'

  const buf = Buffer.from(QRCODE_IMAGE_BASE64, 'base64')
  const text = await bufferToQrValue(buf)
  t.equal(text, EXPECTED_QRCODE_TEXT, 'should decode qrcode image base64')
})

test('qrValueToStream()', async t => {
  const QRCODE_VALUE = 'hello, world!'
  const EXPECTED_QRCODE_IMAGE_BASE64 = [
    'iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAKcSURBVO3BQY7',
    'cQAwEwSxC//9yeo88NSBIsx7TjIg/WGMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKd',
    'YoxRrl4qEk/CaVkyTcoXKShN+k8kSxRinWKMUa5eJlKm9Kwh0qn6TypiS8qVijFGuUYo1y8WFJuEPlj',
    'iR0Kl0SOpUuCZ3KHUm4Q+WTijVKsUYp1igXw6n8T4o1SrFGKdYoF8MloVOZrFijFGuUYo1y8WEq3yQJ',
    'ncoTKt+kWKMUa5RijXLxsiR8M5UuCZ3KSRK+WbFGKdYoxRrl4iGVf5nKicq/pFijFGuUYo0Sf/BAEjq',
    'VLglvUnkiCZ3KSRLepPJJxRqlWKMUa5SLlyXhROU3JaFT6ZJwonKShCeS0Kk8UaxRijVKsUaJP3hREj',
    'qVO5JwotIloVO5Iwl3qJwk4Q6VNxVrlGKNUqxRLv6yJJyodEl4Igl3qHRJ6FTuUPmkYo1SrFGKNcrFQ',
    '0k4ScITSehUuiScJKFT6ZLQqXRJuEPljiR0Kk8Ua5RijVKsUS4eUvkmSbhDpUvCHUk4UflNxRqlWKMU',
    'a5SLh5Lwm1Q6lS4JdyThCZWTJJyovKlYoxRrlGKNcvEylTcl4SQJnUqXhCdUuiScJOFvKtYoxRqlWKN',
    'cfFgS7lB5k0qXhDuS0Kl0SehUTpLQJaFTeaJYoxRrlGKNcjFcEjqVJ5JwkoROpVP5pGKNUqxRijXKxX',
    '8mCScqXRJOVE6S0Kl8UrFGKdYoxRrl4sNUPknlDpUuCV0SOpWTJHyTYo1SrFGKNcrFy5Lwm5LQqXQqX',
    'RI6lZMkdConKidJ6FTeVKxRijVKsUaJP1hjFGuUYo1SrFGKNUqxRinWKMUapVijFGuUYo1SrFGKNUqx',
    'RinWKMUa5Q8Ztu740xD9iQAAAABJRU5ErkJggg==',
  ].join('')

  const stream = await qrValueToStream(QRCODE_VALUE)

  const chunks = [] as Buffer[]
  for await (const chunk of stream) {
    chunks.push(chunk as Buffer)
  }
  const buf = Buffer.concat(chunks)
  const base64Text = buf.toString('base64')

  t.equal(base64Text, EXPECTED_QRCODE_IMAGE_BASE64, 'should encode QR Code value to expected image')
})
