import Shape from './shape'

//饼状图
export default class Legend extends Shape {
  //类型
  type = 'legend'

  //形状的宽
  width = 0

  //填充颜色或图案
  pattern = '#ffffff'

  //填充颜色或图案 mouseover
  mouseOverPattern = '#ffffff'

  //名称
  name = ''

  //值
  value = 0

  // 相关联的形状
  binders: any[]

  constructor() {
    super()
    this.type = 'legend'
  }

  //点击动画
  clickAnimate() {
    this.disabled = !this.disabled

    this.binders.forEach(item => {
      item.disabled = this.disabled
    })

    this.chart2d.reset()
  }

  paint(context: CanvasRenderingContext2D) {

    //保存画布句柄，开始绘制饼形
    context.save()

    context.strokeStyle = this.pattern

    context.beginPath()
    context.arc(this.x + 5, this.y, 5, 0, Math.PI * 2)

    if (context.isPointInPath(this.stage2d.mouseX, this.stage2d.mouseY)) {
      context.arc(this.x + 5, this.y, 6, 0, Math.PI * 2)
      this.triggerEvent()
    }
    context.closePath()

    if (this.disabled) {
      context.fillStyle = '#c9c9c9'
      context.strokeStyle = '#c9c9c9'
    } else {
      context.fillStyle = '#000'
    }

    context.fillText(this.name, this.x + 4 + this.width / 2, this.y)

    context.stroke()

    context.restore()
  }
}
