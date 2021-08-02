import Shape from './shape'

/*
    Math.sin(x)    x 的正玄值。返回值在 -1.0 到 1.0 之间；
    Math.cos(x)    x 的余弦值。返回的是 -1.0 到 1.0 之间的数；
    这两个函数中的X 都是指的“弧度”而非“角度” 　　
    弧度的计算公式为： 角度*（PI/180）；　　（角度转弧度可参考：角度与弧度互转）
    30° 角度 的弧度 = 30 * （PI/180）
 */

//饼状图
export default class Pie extends Shape {
  //类型
  type = 'pie'

  //形状的初始X坐标
  originalX = 0

  //形状的初始Y坐标
  originalY = 0

  //形状的X坐标
  x = 0

  //形状的Y坐标
  y = 0

  //填充颜色或图案
  pattern = '#ffffff'

  //填充颜色或图案 mouseover
  mouseOverPattern = '#ffffff'

  //名称
  name = ''

  //值
  value = 0

  //半径
  radius = 0

  //百分比
  precent = 0

  //起始角，以弧度计
  sAngle = 0

  //结束角，以弧度计
  eAngle = 0

  //名称信息, 决定是否在饼外显示名称
  nameText = ''
  nameStyle = ''

  //值信息, 决定是否在饼上显示值或百分比
  valueText = ''
  valueStyle = ''

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

  //绘制饼形
  paintPie(context: CanvasRenderingContext2D) {

    context.beginPath()

    //对于饼状图，xy是圆的中心
    context.moveTo(this.x, this.y)

    context.arc(this.x, this.y, this.radius, this.sAngle,  this.eAngle)

    context.closePath()

    if (context.isPointInPath(this.stage2d.mouseX, this.stage2d.mouseY)) {
      context.fillStyle = this.mouseOverPattern
      // this.eventDetection()
    } else {
      context.fillStyle = this.pattern
    }

    context.stroke()
    context.fill()
  }

  paint(context: CanvasRenderingContext2D) {

    //保存画布句柄，开始绘制饼形
    context.save()
    this.paintPie(context)
    context.restore()

    // 计算饼形中线弧度
    let radian = (this.eAngle - this.sAngle) / 2 + this.sAngle + (0.5 * Math.PI)

    if (!this.disable) {
      //绘制数据值
      let x = this.x + Math.sin(radian) * (this.radius * .7)
      let y = this.y - Math.cos(radian) * (this.radius * .7)
      context.fillText(this.valueText, x, y)
    }

    if (!this.disable) {
      //开始绘制名称，计算名称指引线开始坐标 (sx, xy) 和结束坐标 (ex, ey)
      let sx = this.originalX + Math.sin(radian) * (this.radius + 4)
      let sy = this.originalY - Math.cos(radian) * (this.radius + 4)
      let ex = this.originalX + Math.sin(radian) * (this.radius + 20)
      let ey = this.originalY - Math.cos(radian) * (this.radius + 20)

      //保存画布句柄，开始画线
      context.save()

      context.strokeStyle = this.pattern
      context.beginPath()
      context.moveTo(sx, sy)
      context.lineTo(ex, ey)
      context.stroke()

      //绘制名称
      context.fillStyle = this.pattern
      if (radian < Math.PI) {
        context.textAlign = "left"
        context.fillText(this.nameText, ex + 3, ey)
      } else {
        context.textAlign = "right"
        context.fillText(this.nameText, ex - 3, ey)
      }
      context.restore()
    }
  }
}
