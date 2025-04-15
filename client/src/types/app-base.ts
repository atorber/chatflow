/* eslint-disable no-console */
class AppBase {

  private static instance: AppBase | null = null
  static whitelist: string[] = []
  static serviceEnabled: boolean = false

  constructor () {
    // 私有构造函数，防止直接实例化
  }

  public static getInstance (): AppBase {
    if (!AppBase.instance) {
      AppBase.instance = new AppBase()
    }
    return AppBase.instance
  }

  public updateWhitelist (newWhitelist: string[]): void {
    AppBase.whitelist = newWhitelist
  }

  public closeWhitelist (): void {
    AppBase.whitelist = []
  }

  public enableService (): void {
    AppBase.serviceEnabled = true
  }

  public disableService (): void {
    AppBase.serviceEnabled = false
  }

  public callService (name: string): void {
    if (!AppBase.serviceEnabled) {
      console.log('Service is currently disabled.')
      return
    }

    if (AppBase.whitelist.includes(name)) {
      console.log(`Service ${name} is allowed.`)
    } else {
      console.log(`Service ${name} is not allowed.`)
    }
  }

}

export default AppBase

// const app = AppBase.getInstance()

// app.enableService()

// app.updateWhitelist([ 'serviceA', 'serviceB' ])

// app.callService('serviceA') // Output: Service serviceA is allowed.
// app.callService('serviceC') // Output: Service serviceC is not allowed.

// app.disableService()

// app.callService('serviceA') // Output: Service is currently disabled.
