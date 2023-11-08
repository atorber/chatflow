/* eslint-disable no-console */
import AppBase from '../types/app-base.js'

class EventRegistrationApp extends AppBase {

  private registrations: string[] = []

  public registerUser (name: string): void {
    if (!AppBase.serviceEnabled) {
      console.log('Event registration is currently disabled.')
      return
    }

    if (AppBase.whitelist.includes(name)) {
      this.registrations.push(name)
      console.log(`User ${name} successfully registered.`)
    } else {
      console.log(`User ${name} is not allowed to register.`)
    }
  }

  public showRegistrations (): void {
    console.log('Current registrations:')
    this.registrations.forEach((name, index) => {
      console.log(`${index + 1}. ${name}`)
    })
  }

}

export default EventRegistrationApp
