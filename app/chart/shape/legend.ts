import Shape from './shape'

//饼状图
export default class Legend extends Shape {
  //类型
  type = 'legend'

  //形状的X坐标
  x = 0

  //形状的Y坐标
  y = 0

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

  //临时禁用
  disable = 0

  constructor() {
    super()
  }

  //点击动画
  clickAnimate() {

    // //计算饼形中线弧度
    // let radian = (this.eAngle - this.sAngle) / 2 + this.sAngle  + (0.5 * Math.PI)
    //
    // //计算移动后的圆心坐标
    // let x = this.x + Math.sin(radian) * 10
    // let y = this.y - Math.cos(radian) * 10
    //
    // //先记录当前 shape 和圆心坐标，复原时用
    // this.chart2d.addRecoverAnimate(this, {
    //     x: this.x,
    //     y: this.y
    // })
    //
    // //开始播放移动动画
    // this.animate({
    //     x,
    //     y
    // })
    //
    // this.recoverAnimateIng = true

  }

  paint(context: CanvasRenderingContext2D) {

    //保存画布句柄，开始绘制饼形
    context.save()

    context.strokeStyle = this.pattern

    context.beginPath()
    context.arc(this.x + 5, this.y, 5, 0, Math.PI * 2)

    if (context.isPointInPath(this.stage2d.mouseX, this.stage2d.mouseY)) {
      // console.log("context.isPointInPath", 1);
      context.arc(this.x + 5, this.y, 6, 0, Math.PI * 2)
      // this.legendClick(legend)
    }
    context.closePath()

    if (this.disable) {
      context.fillStyle = '#c9c9c9'
      context.strokeStyle = '#c9c9c9'
    } else {
      context.fillStyle = '#000'
    }

    context.fillText(this.name, this.x + 14, this.y)

    context.stroke()

    context.restore()
  }
}
