import Shape from './shape'

//饼状图
export default class Point extends Shape {
  //类型
  type = 'point'

  x: number = 0

  y: number = 0

  //名称
  name = ''

  //值
  value: number = 0

  constructor() {
    super()
  }

  //点击动画
  clickAnimate() {

  }

  paint(context: CanvasRenderingContext2D) {
    context.save()
    context.beginPath()
    context.arc(this.x, this.y, 2, 0, Math.PI * 2)

    if (context.isPointInPath(this.stage2d.mouseX, this.stage2d.mouseY)) {
      context.arc(this.x, this.y, 3, 0, Math.PI * 2)
      this.triggerEvent()
    }

    context.closePath()
    context.fillStyle = '#fff'
    context.stroke()
    context.fill()
    context.restore()
  }
}
