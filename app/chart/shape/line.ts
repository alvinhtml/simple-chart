import Shape from './shape'
import Point from './point'

//饼状图
export default class Line extends Shape {
  //类型
  type = 'line'

  points: Point[] = []

  //填充颜色或图案
  pattern = '#ffffff'

  //填充颜色或图案 mouseover
  mouseOverPattern = '#ffffff'

  areaPattern = '#ffffff'

  //名称
  name = ''

  width: number = 0

  height: number = 0

  x: number = 0

  y: number = 0

  //值
  values: number[] = []

  smooth: boolean = true


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

  pointLine(context: CanvasRenderingContext2D, prevPoint: Point, point: Point) {
    if (this.smooth) {
      const width = (point.x - prevPoint.x) / 2
      const height = (point.y - prevPoint.y) / 6

      const cp1x = prevPoint.x + width
      const cp1y = prevPoint.y + height
      const cp2x = point.x - width
      const cp2y = point.y - height

      context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, point.x, point.y)
    } else {
      context.lineTo(point.x, point.y)
    }
  }


  paint(context: CanvasRenderingContext2D) {

    if (this.disabled) {
      return false
    }



    //保存画布句柄，开始绘制饼形
    context.save()

    context.beginPath()
    context.moveTo(this.x, this.y + this.height)

    this.points.forEach((point: Point, i: number) => {
      if (i === 0) {
        context.lineTo(point.x, point.y)
      } else {
        this.pointLine(context, this.points[i - 1], point)
      }
    })
    context.lineTo(this.points[this.points.length - 1].x, this.y + this.height)

    context.fillStyle = this.areaPattern
    context.closePath()
    context.fill()


    context.beginPath()
    context.strokeStyle = this.pattern
    context.moveTo(this.points[0].x, this.points[0].y)

    this.points.forEach((point: Point, i: number) => {
      if (i === 0) {
        context.lineTo(point.x, point.y)
      } else {
        this.pointLine(context, this.points[i - 1], point)
      }
    })
    context.moveTo(this.points[this.points.length - 1].x, this.points[this.points.length - 1].y)

    context.lineWidth = 2
    context.closePath()
    context.stroke()

    this.points.forEach((point: Point) => {
      point.paint(context)
    })

    context.restore()






    // //对于饼状图，xy是圆的中心
    //
    // context.rect(this.x, this.y - this.height, this.width, this.height)
    //
    // context.closePath()
    //
    // if (context.isPointInPath(this.stage2d.mouseX, this.stage2d.mouseY)) {
    //   context.fillStyle = this.mouseOverPattern
    //   this.triggerEvent()
    // } else {
    //   context.fillStyle = this.pattern
    // }
    //
    // context.strokeStyle = this.pattern
    //
    // //绘制名称
    // context.fillText(this.value.toString(), this.x + this.width / 2, this.y - this.height - 8)



  }
}
