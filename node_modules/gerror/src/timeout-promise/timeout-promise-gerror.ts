import { GError } from '../gerror/gerror.js'
import { Code } from '../gerror/grpc.js'

class TimeoutPromiseGError extends GError {

  override name = 'DEADLINE_EXCEEDED'
  override code = Code.DEADLINE_EXCEEDED

}

export { TimeoutPromiseGError }
