// Tooltip
export default class Tooltip {
  element: HTMLDivElement
  timeout: number

  constructor(element: HTMLDivElement) {
    this.element = element
  }

  move(x: number, y: number, target: any) {
    this.element.style.left = (x + 20) + 'px'
    this.element.style.top = (y + 20) + 'px'
    this.element.innerHTML = `<span><i style="background-color:${target.pattern}"></i>${target.name} ${target.value}</span>`
  }

  hide() {
    if (!this.timeout) {
      this.timeout = window.setTimeout(() => {
        this.element.style.display = 'none'
      }, 400)
    }
  }

  show() {
    if (this.timeout) {
      window.clearTimeout(this.timeout)
      this.timeout = 0
    }
    this.element.style.display = 'block'
  }

  static init(container: HTMLDivElement) {

    //创建 Tip Box，并添加到场景
    const box = document.createElement('div')
    box.style.display = 'none'
    box.classList.add('minichart-tip')
    container.appendChild(box)
    return new Tooltip(box)
  }

  static createStyle() {
    const style = document.createElement('style')
    style.type = 'text/css'
    style.innerHTML = `
      .minichart-tip {
        position: absolute;
        min-width: 60px;
        min-height: 24px;
        padding: 6px 10px;
        border-radius: 4px;
        background-color: rgba(255,255,255,.8);
        box-shadow: 0 0 30px rgba(0,0,0,.5);
        transition: left 0.2s ease, width 0.2s ease, top 0.2s ease, height 0.2s ease;
        z-index: 999;
      }
      .minichart-tip span {
        display: block;
        vertical-align: middle;
        line-height: 24px;
        color: #333;
        font-size: 12px;
      }
      .minichart-tip i {
        display: inline-block;
        vertical-align: middle;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background-color: #ccc;
        margin-right: 6px;
      }
    `

    const head = document.querySelector('head')

    if (head) {
      head.appendChild(style)
    }
  }
}
