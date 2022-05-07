export function good () {
  // should not flating promise at here
  test().catch(console.error)
}

async function test (): Promise<void> {
  await console.info('ok')
}
