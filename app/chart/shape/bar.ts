import Shape from './shape'

//饼状图
export default class Bar extends Shape {
  //类型
  type = 'axis'

  width: number = 0

  height: number = 0

  x: number = 0

  y: number = 0

  //填充颜色或图案
  pattern = '#ffffff'

  //填充颜色或图案 mouseover
  mouseOverPattern = '#ffffff'

  //名称
  name = ''

  //值
  value: number = 0

  index: number = 0
  groupIndex: number = 0
  groupLength: number = 0





  shape: any

  constructor() {
    super()
    this.type = 'bar'
  }

  //点击动画
  clickAnimate() {
    // this.disabled = !this.disabled
    //
    // const shape = this.shape
    //
    // if (this.disabled) {
    //   this.shape.disabled = true
    // } else {
    //   this.shape.disabled = false
    // }
    //
    // switch (this.shape.type) {
    //   case 'pie':
    //     this.chart2d.setPie()
    //     break;
    //
    //   default:
    //     break;
    // }
  }

  paint(context: CanvasRenderingContext2D) {

    //保存画布句柄，开始绘制饼形
    context.save()

    context.beginPath()

    //对于饼状图，xy是圆的中心
    context.moveTo(this.x, this.y)

    context.rect(this.x, this.y, this.width, this.height)

    context.closePath()

    if (context.isPointInPath(this.stage2d.mouseX, this.stage2d.mouseY)) {
      context.fillStyle = this.mouseOverPattern
      this.triggerEvent()
    } else {
      context.fillStyle = this.pattern
    }

    context.strokeStyle = this.pattern

    context.stroke()
    context.fill()




    // context.strokeStyle = this.pattern
    //
    // context.beginPath()
    // context.arc(this.x + 5, this.y, 5, 0, Math.PI * 2)
    //
    // if (context.isPointInPath(this.stage2d.mouseX, this.stage2d.mouseY)) {
    //   context.arc(this.x + 5, this.y, 6, 0, Math.PI * 2)
    //   this.triggerEvent()
    // }
    // context.closePath()
    //
    // if (this.disabled) {
    //   context.fillStyle = '#c9c9c9'
    //   context.strokeStyle = '#c9c9c9'
    // } else {
    //   context.fillStyle = '#000'
    // }
    //
    // context.fillText(this.name, this.x + 4 + this.width / 2, this.y)

    context.restore()
  }
}
