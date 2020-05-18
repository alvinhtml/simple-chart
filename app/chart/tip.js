//场景
export default class Tip {

    constructor (element) {

        this.element = element

    }

    move (x, y , html) {
        this.element.style.left = (x + 20) + 'px'
        this.element.style.top = (y + 20) + 'px'
        this.element.innerHTML = html
    }

    hide (x, y , html) {
        this.element.style.display = 'none'
    }

    show (x, y , html) {
        this.element.style.display = 'block'
    }

    static init (container) {

        //创建 Canvas，并添加到场景
        const box = document.createElement('div')
        box.style.display = 'none'
        box.classList.add('minichart-tip')
        container.appendChild(box)

        return new Tip(box)
    }

    static createStyle () {
        console.log('style')
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
        document.getElementsByTagName('head').item(0).appendChild(style)
    }
}
