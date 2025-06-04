interface IframeOptions {
  uid: string
  src: string
  name?: string
  width?: string
  height?: string
  className?: string
  style?: string
  allow?: string
  onLoad?: (e: Event) => void
  onError?: (e: string | Event) => void
}

type IframeRect = Pick<DOMRect, 'left' | 'top' | 'width' | 'height'> & { zIndex?: number | string }

class Iframe {
  instance: HTMLIFrameElement | null = null
  constructor(private ops: IframeOptions) {
    this.init()
  }
  init() {
    const {
      src,
      name = `Iframe-${Date.now()}`,
      className = '',
      style = '',
      allow,
      onLoad = () => {},
      onError = () => {},
    } = this.ops

    this.instance = document.createElement('iframe')
    this.instance.name = name
    this.instance.className = className
    this.instance.style.cssText = style
    this.instance.onload = onLoad
    this.instance.onerror = onError
    if (allow) this.instance.allow = allow
    this.hide()
    this.instance.src = src
    document.body.appendChild(this.instance)
  }
  setElementStyle(style: Record<string, string>) {
    if (this.instance) {
      Object.entries(style).forEach(([key, value]) => {
        this.instance!.style.setProperty(key, value)
      })
    }
  }
  hide() {
    this.setElementStyle({
      display: 'none',
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: '0px',
      height: '0px',
    })
  }
  show(rect: IframeRect) {
    this.setElementStyle({
      display: 'block',
      position: 'absolute',
      left: rect.left + 'px',
      top: rect.top + 'px',
      width: rect.width + 'px',
      height: rect.height + 'px',
      border: '0',
      'z-index': String(rect.zIndex) || 'auto',
    })
  }
  resize(rect: IframeRect) {
    this.show(rect)
  }
  destroy() {
    if (this.instance) {
      this.instance.onload = null
      this.instance.onerror = null
      this.instance.remove()
      this.instance = null
    }
  }
}

export class IFrameManager {
  static frames = new Map()
  static createFame(ops: IframeOptions, rect: IframeRect) {
    const existFrame = this.frames.get(ops.uid)
    if (existFrame) {
      existFrame.destroy()
    }
    const frame = new Iframe(ops)
    this.frames.set(ops.uid, frame)
    frame.show(rect)
    return frame
  }
  static showFrame(uid: string, rect: IframeRect) {
    const frame = this.frames.get(uid)
    frame?.show(rect)
  }
  static hideFrame(uid: string) {
    const frame = this.frames.get(uid)
    frame?.hide()
  }
  static destroyFrame(uid: string) {
    const frame = this.frames.get(uid)
    frame?.destroy()
    this.frames.delete(uid)
  }
  static resizeFrame(uid: string, rect: IframeRect) {
    const frame = this.frames.get(uid)
    frame?.resize(rect)
  }
  static getFrame(uid: string) {
    return this.frames.get(uid)
  }
}

export const getIncreaseId = (() => {
  let id = 0
  return () => {
    id++
    return id
  }
})()
