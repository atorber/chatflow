import path       from 'path'

export interface GoodOptions {
  foo?    : string
  barrrr? : number
}

export class Good {

  public static resolve (
    options: GoodOptions,
  ): any {
    console.info([
      1,
      2,
    ], options)
    const test = path.join('xixi', 'haha')
    console.info(test)
  }

}
