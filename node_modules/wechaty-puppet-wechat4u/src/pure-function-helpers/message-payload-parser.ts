import type * as PUPPET from 'wechaty-puppet'

import type {
  WebMessageRawPayload,
}                           from '../web-schemas.js'

import {
  isContactId,
  isRoomId,
}                   from './is-type.js'
import {
  messageFileName,
}                   from './message-file-name.js'
import {
  messageType,
}                     from './message-type.js'

export function messageRawPayloadParser (
  rawPayload: WebMessageRawPayload,
): PUPPET.payloads.Message {

  /**
   * 0. Set Message Type
   */
  const payloadBase = {
    filename      : messageFileName(rawPayload) || undefined,
    id            : rawPayload.MsgId,
    mentionIdList : [],
    timestamp     : rawPayload.CreateTime,                      // unix timestamp, in seconds
    type          : messageType(rawPayload),
  }

  let fromId: undefined | string
  let roomId: undefined | string
  let toId:   undefined | string

  let text:   undefined | string

  /**
   * 1. Set Room Id
   */
  if (isRoomId(rawPayload.FromUserName)) {
    roomId = rawPayload.FromUserName
  } else if (isRoomId(rawPayload.ToUserName)) {
    roomId = rawPayload.ToUserName
  } else {
    roomId = undefined
  }

  /**
   * 2. Set To Contact Id
   */
  if (isContactId(rawPayload.ToUserName)) {

    toId = rawPayload.ToUserName

  } else {
    // TODO: if the message @someone, the toId should set to the mentioned contact id(?)

    toId   = undefined

  }

  /**
   * 3. Set From Contact Id
   */
  if (isContactId(rawPayload.FromUserName)) {

    fromId = rawPayload.FromUserName

  } else {
    const parts = rawPayload.Content.split(':\n')
    if (parts.length > 1) {
      if (isContactId(parts[0]!)) {

        fromId = parts[0]

      }
    } else {

      fromId = undefined

    }
  }

  /**
   *
   * 4. Set Text
   */
  if (isRoomId(rawPayload.FromUserName)) {

    const parts = rawPayload.Content.split(':\n')
    if (parts.length > 1) {

      text = parts[1]

    } else {

      text = rawPayload.Content

    }

  } else {

    text = rawPayload.Content

  }

  /**
   * 5.1 Validate Room & From ID
   */
  if (!roomId && !fromId) {
    throw Error('empty roomId and empty fromId!')
  }
  /**
   * 5.1 Validate Room & To ID
   */
  if (!roomId && !toId) {
    throw Error('empty roomId and empty toId!')
  }

  let payload: PUPPET.payloads.Message

  // Two branch is the same code.
  // Only for making TypeScript happy
  if (fromId && toId) {
    payload = {
      ...payloadBase,
      fromId,
      roomId,
      text,
      toId,
    }
  } else if (roomId) {
    payload = {
      ...payloadBase,
      fromId,
      roomId,
      text,
      toId,
    }
  } else {
    throw new Error('neither toId nor roomId')
  }

  return payload
}
