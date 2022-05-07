export function bad () {
  // should not flating promise at here
  test()
}

async function test (): Promise<void> {
  await console.info('ok')
}
