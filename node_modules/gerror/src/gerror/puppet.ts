/**
 * Huan(202110): This is for compatible with Wechaty Puppet Error Payload
 *  @see https://github.com/wechaty/puppet/blob/5dc7914739b4b76e2d9242fe2a3859bec8346fee/src/schemas/event.ts#L69-L71
 */
interface PuppetEventErrorPayload {
  data: string
}

const isPuppetEventErrorPayload = (target: any): target is PuppetEventErrorPayload =>
  target instanceof Object
    && 'data' in target
    && typeof target['data'] === 'string'

export {
  isPuppetEventErrorPayload,
}
