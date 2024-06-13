import _ from 'lodash'

interface RegisterKeyEventProps {
  keyCode: number | number[]
  keydown?: (e: KeyboardEvent) => void
  keyup?: (e: KeyboardEvent) => void
  dom?: HTMLElement | ParentNode | null | undefined
  canRepeat?: boolean
}

export class KeyBindEvent {
  private readonly element: HTMLElement | Document | ParentNode
  private readonly keys: number[]
  private readonly keydown?: (e: KeyboardEvent) => void
  private readonly keyup?: (e: KeyboardEvent) => void
  private readonly canRepeat: boolean

  constructor({ keyCode, keydown, keyup, dom, canRepeat = false }: RegisterKeyEventProps) {
    this.element = dom || document
    this.keys = Array.isArray(keyCode) ? keyCode : [keyCode]
    this.keydown = keydown
    this.keyup = keyup
    this.canRepeat = canRepeat

    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)

    this.addEvent()
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (!this.canRepeat && e.repeat) {
      return
    }
    if (e.target instanceof HTMLElement && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'INPUT') {
      if (_.includes(this.keys, e.keyCode) && this.keydown) {
        this.keydown(e)
      }
    }
  }

  private handleKeyUp(e: KeyboardEvent): void {
    if (_.includes(this.keys, e.keyCode) && this.keyup) {
      this.keyup(e)
    }
  }

  public addEvent(): void {
    if (this.element) {
      this.element.addEventListener('keydown', this.handleKeyDown as EventListener)
      this.element.addEventListener('keyup', this.handleKeyUp as EventListener)
    }
  }

  public removeEvent(): void {
    if (this.element) {
      this.element.removeEventListener('keydown', this.handleKeyDown as EventListener)
      this.element.removeEventListener('keyup', this.handleKeyUp as EventListener)
    }
  }
}
