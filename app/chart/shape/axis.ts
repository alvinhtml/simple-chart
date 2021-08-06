import Shape from './shape'

//饼状图
export default class Axis extends Shape {
  //类型
  type = 'axis'

  //填充颜色或图案
  pattern = '#ffffff'

  //填充颜色或图案 mouseover
  mouseOverPattern = '#ffffff'

  //名称
  name = 'axis'

  width: number = 0

  height: number = 0

  x: number = 0

  y: number = 0

  // X 轴刻度值
  xLabel: Array<string> = []

  // Y 轴刻度值
  yLabel: Array<number> = []



  constructor() {
    super()
    this.type = 'legend'
  }

  //点击动画
  clickAnimate() {

  }

  paint(context: CanvasRenderingContext2D) {

    //保存画布句柄，开始绘制饼形
    context.save()

    context.strokeStyle = '#000'
    context.fillStyle = '#000'


    context.beginPath()

    let partWidth = this.width / this.xLabel.length

    context.moveTo(this.x, this.y + this.height)
    context.lineTo(this.x + this.width, this.y + this.height)

    this.xLabel.forEach((item, index) => {
      context.moveTo(this.x + (partWidth * index), this.y + this.height)
      context.lineTo(this.x + (partWidth * index), this.y + this.height + 5)
      context.fillText(item, this.x + (partWidth * index) + (partWidth / 2), this.y + this.height + 10)
    })

    context.moveTo(this.x + (partWidth * this.xLabel.length), this.y + this.height)
    context.lineTo(this.x + (partWidth * this.xLabel.length), this.y + this.height + 5)
    context.closePath()
    context.stroke()

    context.textAlign = 'right'
    context.beginPath()

    let partHeight = this.height / (this.yLabel.length - 1)

    this.yLabel.reverse().forEach((item, index) => {
      if (index < this.yLabel.length - 1) {
        context.moveTo(this.x, this.y + (partHeight * index))
        context.lineTo(this.x + this.width, this.y + (partHeight * index))
      }
      context.fillText(item.toString(), this.x - 5, this.y + (partHeight * index))
    })

    context.closePath()
    context.strokeStyle = '#ddd'
    context.stroke()

    context.restore()
  }
}
