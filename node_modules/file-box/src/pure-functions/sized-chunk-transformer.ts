/**
 * ChunkerTransformStream, a transform stream to take arbitrary chunk sizes and make them consistent
 * https://codereview.stackexchange.com/q/57492/185709
 */
import stream from 'stream'

/**
 * TCP streaming workload tuning
 *  https://www.ibm.com/docs/en/aix/7.2?topic=tuning-tcp-streaming-workload
 */
const DEFAULT_CHUNK_BYTE = 256 * 1024 // 256 KB

/**
 * @param chunkByte The size of the chunks to be created
 * @returns
 */
function sizedChunkTransformer (chunkByte = DEFAULT_CHUNK_BYTE) {
  let buffer = Buffer.from([])

  const transform: stream.TransformOptions['transform'] = function (chunk, _, done) {
    buffer = Buffer.concat([buffer, chunk])

    while (buffer.length >= chunkByte) {
      this.push(buffer.slice(0, chunkByte))
      buffer = buffer.slice(chunkByte)
    }

    done()
  }

  const flush: stream.TransformOptions['flush'] = function (done) {
    if (buffer.length) {
      this.push(buffer)
    }
    done()
  }

  const chunker = new stream.Transform({
    flush,
    objectMode: true,
    transform,
  })

  return chunker
}

export {
  sizedChunkTransformer,
}
