import tap from 'tap'

type TestOptions  = NonNullable<ConstructorParameters<typeof tap.Test>[0]>
type TestClass    = InstanceType<typeof tap.Test>

interface TestFunc {
  (name: string,                     cb: (t: TestClass) => Promise<void> | void): void
  (name: string, extra: TestOptions, cb: (t: TestClass) => Promise<void> | void): void
}

interface Test {
  (...args: Parameters<typeof tap.test>): void
  only: TestFunc
  skip: TestFunc
  todo: TestFunc
}

const test: Test = (...args: Parameters<typeof tap.test>) => {
  void tap.test(...args)
}

test.only = tap.only as any
test.skip = tap.skip as any
test.todo = tap.todo as any

export {
  type TestClass,
  test,
}
