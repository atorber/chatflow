import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import getAuthClient from '../src/utils/auth.js'
import { ChatFlowCore } from '../src/api/base-config.js'
import { get, post, upload } from '../src/utils/request.js'

const counts = { login: 0, resource: 0 }
const appLogs: string[] = []
let responseMode: 'http-401' | 'body-401' = 'http-401'

const server = createServer((request, response) => {
  if (request.url === '/api/v1/auth/login') {
    counts.login += 1
    response.writeHead(401, { 'content-type': 'application/json' })
    response.end(JSON.stringify({ message: 'Unauthorized', statusCode: 401 }))
    return
  }

  counts.resource += 1
  if (responseMode === 'http-401') {
    response.writeHead(401, { 'content-type': 'application/json' })
  } else {
    response.writeHead(200, { 'content-type': 'application/json' })
  }
  response.end(JSON.stringify({ message: 'Unauthorized', statusCode: 401 }))
})

const listen = () => new Promise<void>((resolve, reject) => {
  server.once('error', reject)
  server.listen(0, '127.0.0.1', resolve)
})

const close = () => new Promise<void>((resolve, reject) => {
  server.close((error) => error ? reject(error) : resolve())
})

async function assertBoundedUnauthorizedRetry (
  mode: 'http-401' | 'body-401',
  operationName: string,
  operation: () => Promise<unknown>,
) {
  counts.login = 0
  counts.resource = 0
  responseMode = mode

  await assert.rejects(operation())
  assert.equal(counts.login, 2, `${operationName}/${mode}: login attempts should stop after one retry`)
  assert.equal(counts.resource, 2, `${operationName}/${mode}: resource requests should stop after one retry`)
}

async function main () {
  const originalConsoleInfo = console.info
  const originalConsoleError = console.error
  console.info = (...args: unknown[]) => appLogs.push(args.map(String).join(' '))
  console.error = (...args: unknown[]) => appLogs.push(args.map(String).join(' '))
  ChatFlowCore.logger = {
    info: (...args: unknown[]) => appLogs.push(args.map(String).join(' ')),
    error: (...args: unknown[]) => appLogs.push(args.map(String).join(' ')),
  } as any
  await listen()
  const address = server.address()
  assert.ok(address && typeof address !== 'string')
  getAuthClient({ username: 'synthetic-user', password: 'synthetic-password', endpoint: `http://127.0.0.1:${address.port}` })

  try {
    for (const mode of [ 'http-401', 'body-401' ] as const) {
      await assertBoundedUnauthorizedRetry(mode, 'GET', () => get('/resource'))
      await assertBoundedUnauthorizedRetry(mode, 'POST', () => post('/resource', {}))
      await assertBoundedUnauthorizedRetry(mode, 'upload', () => upload('/resource', {}))
    }
    assert.ok(!appLogs.join('\n').includes('synthetic-password'), 'logs must not expose login passwords')
    assert.ok(!appLogs.join('\n').includes('Authorization'), 'logs must not expose authorization headers')
    assert.ok(!appLogs.join('\n').includes('Unauthorized'), 'logs must not serialize response bodies')
    process.stdout.write('Synthetic unauthorized retry and log-redaction tests passed.\n')
  } finally {
    console.info = originalConsoleInfo
    console.error = originalConsoleError
    await close()
  }
}

void main()
