import Stage from "./stage";
import Chart from "./chart";
import { Line, Point } from './shape/index'
import { lighten, darken, alpha } from '../utils/tool'

export default class ChartLine extends Chart {
  shapes: Line[][]

  constructor(option: any, stage2d: Stage) {
    super()
    this.option = option
    this.stage2d = stage2d
    this.type = option.type

    this.initOptions()
    this.setLine()
  }

  initOptions() {
    // 初始化样式
    this.initStyle()

    const { option, stage2d, style } = this

    if (option.padding) {
      this.padding = option.padding
    }

    // 绘制坐标轴
    const [floor, ceil] = this.paintAxis(option.data)

    //创建柱状图
    this.shapes = []

    const createLine = (values: number[], index: number) => {
      //创建一个饼形图
      const shape = new Line()

      //设置饼形图属性
      shape.stage2d = this.stage2d
      shape.chart2d = this
      shape.width = this.stage2d.width - this.padding[1] - this.padding[3]
      shape.height = this.stage2d.height - this.padding[0] - this.padding[2]
      shape.x = this.padding[3]
      shape.y = this.padding[0]
      shape.pattern = style.colors[index]
      shape.mouseOverPattern = lighten(style.colors[index])
      shape.areaPattern = alpha(style.colors[index], 0.1)
      shape.name = option.legend[index]
      shape.values = values

      // 创建 Line 上的点
      shape.points = shape.values.map((value) => {
        const point = new Point()
        point.stage2d = this.stage2d
        point.chart2d = this
        point.x = this.padding[3]
        point.y = this.padding[0] + shape.height
        point.value = value
        point.name = value.toString()

        return point
      })

      return shape
    }

    option.data.forEach((value: number[], i: number) => {
      this.shapes.push([createLine(value, i)])
    })

    //图例绘制所需数据
    this.initLegend()
  }

  //计算饼形状绘制信息
  setLine() {
    const { option, stage2d } = this

    // 筛选可见图形 data
    const data = this.shapes.map((shapes: Line[]) => {
      return shapes.filter(shape => !shape.disabled).map(shape => shape.values)
    })

    // 根据筛选出的 data 重新绘制坐标轴
    const [floor, ceil] = this.paintAxis(data)

    this.shapes.forEach((shapes: Line[], index: number) => {

      shapes.forEach((shape, groupIndex) => {
        const partWidth = shape.width / (shape.points.length - 1)
        shape.points.forEach((point: Point, index: number) => {
          const x = shape.x + (index * partWidth)
          const y = shape.y + shape.height - (point.value - floor) / (ceil - floor) * shape.height
          point.animate({
            x,
            y
          })
        })
      })

    })
  }
}
