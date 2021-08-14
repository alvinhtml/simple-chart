import Stage from "./stage";
import Chart from "./chart";
import { Bar } from './shape/index'
import { lighten, darken } from '../utils/tool'

export default class ChartBar extends Chart {
  shapes: Bar[][]

  constructor(option: any, stage2d: Stage) {
    super()
    this.option = option
    this.stage2d = stage2d
    this.type = option.type

    this.initOptions()
    this.setBar()
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

    const createBar = (value: number, index: number) => {
      //创建一个饼形图
      const shape = new Bar()

      //设置饼形图属性
      shape.stage2d = this.stage2d
      shape.chart2d = this
      shape.pattern = style.colors[index]
      shape.mouseOverPattern = lighten(style.colors[index])
      shape.name = option.legend[index]
      shape.value = value

      return shape
    }

    if (option.data && option.data.length) {
      option.data.forEach((item: number | number[], index: number) => {
        const group = Array.isArray(item) ? item : [item]
        this.shapes.push(group.map((v, i) => {
          return createBar(v, i)
        }))
      })
    }

    // 图例绘制所需数据
    this.initLegend()

    // 开启信息提示框
    this.initTip()
  }

  //计算饼形状绘制信息
  setBar() {
    const { option, stage2d } = this

    const width = stage2d.width - this.padding[1] - this.padding[3];
    const height = stage2d.height - this.padding[0] - this.padding[2];

    // 筛选可见图形 data
    const data = this.shapes.map((shapes: Bar[]) => {
      return shapes.filter(shape => !shape.disabled).map(shape => shape.value)
    })

    // 根据筛选出的 data 重新绘制坐标轴
    const [floor, ceil] = this.paintAxis(data)

    // 计算一组柱形空间宽度
    const groupWidth = width / option.data.length

    this.shapes.forEach((shapes: Bar[], index: number) => {
      // 计算当前分组可见图形的个数
      const groupLength = shapes.reduce((t, v) => {
        t += v.disabled ? 0 : 1
        return t
      }, 0)

      shapes
        .filter(shape => {
          if (shape.disabled) {
            shape.animate({
              width: 0
            })
          }
          return !shape.disabled
        })
        .forEach((shape, groupIndex) => {
          const partWidth = groupWidth * 0.8 / groupLength

          const h = (shape.value - floor) / (ceil - floor) * height
          const w = partWidth * 0.8
          const x = (partWidth * groupIndex) + (partWidth * 0.1) + (groupWidth * index) + this.padding[3] + groupWidth * 0.1
          const y = height + this.padding[0] - 1

          // shape.height = (shape.value - floor) / (ceil - floor) * height
          // shape.width = partWidth * 0.8
          // shape.x = (partWidth * groupIndex) + (partWidth * 0.1) + (groupWidth * index) + this.padding[3] + groupWidth * 0.1
          shape.y = height + this.padding[0] - 1

          shape.animate({
            width: w,
            height: h,
            x,
            y
          })
        })
    })
  }
}
