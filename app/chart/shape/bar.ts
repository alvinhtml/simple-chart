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

    if (this.width === 0) {
      return false
    }



    //保存画布句柄，开始绘制饼形
    context.save()
    context.beginPath()

    context.moveTo(this.x, this.y)

    context.rect(this.x, this.y - this.height, this.width, this.height)

    context.closePath()

    if (context.isPointInPath(this.stage2d.mouseX, this.stage2d.mouseY)) {
      context.fillStyle = this.mouseOverPattern
      this.triggerEvent()
    } else {
      context.fillStyle = this.pattern
    }

    context.strokeStyle = this.pattern

    //绘制名称
    context.fillText(this.value.toString(), this.x + this.width / 2, this.y - this.height - 8)

    context.stroke()
    context.fill()

    context.restore()
  }
}
