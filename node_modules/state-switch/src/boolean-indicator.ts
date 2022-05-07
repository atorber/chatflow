import { StateSwitch }        from './state-switch.js'

class BooleanIndicator {

  private state: StateSwitch

  constructor (...args: ConstructorParameters<typeof StateSwitch>) {
    this.state = new StateSwitch(...args)
  }

  /**
   * Set boolean state
   * @param b true or false
   */
  value (b: boolean): void
  /**
   * Get busy state
   */
  value (): boolean

  value (b?: boolean): void | boolean {
    if (typeof b === 'undefined') {
      return !!(this.state.active())
    }

    if (b) {
      this.state.active(true)
    } else {
      this.state.inactive(true)
    }
  }

  /**
   * Return a Promise that resolves when the state is the provided `value`
   */
  async ready (
    value: boolean,
    noCross = false,
  ): Promise<void> {
    await this.state.stable(
      value ? 'active' : 'inactive',
      noCross,
    )
  }

}

export { BooleanIndicator }
