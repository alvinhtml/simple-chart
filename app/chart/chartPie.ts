import Stage from "./stage";
import Chart from "./chart";
import { Pie } from './shape/index'
import { lighten, darken } from '../utils/tool'

export default class ChartPie extends Chart {
  shapes: Array<Pie>

  constructor(option: any, stage2d: Stage) {
    super()
    this.option = option
    this.stage2d = stage2d

    this.initOptions()
    this.setPie()
  }

  initOptions () {
    // 初始化样式
    this.initStyle()

		const {option, stage2d, style} = this

		//计算半径
		if (typeof option.radius === 'undefined') {
			option.radius = Math.round(Math.min(stage2d.width, stage2d.height) / 2 * 0.8)
		} else {
			option.radius = Math.round(Math.min(stage2d.width, stage2d.height) / 2 * this.precentToFloat(option.radius))
		}


		//计算饼的圆心坐标
		if (typeof option.center === 'undefined') {
			option.center = [Math.round(stage2d.width / 2), Math.round(stage2d.height / 2)]
		} else {
      option.center[0] = Math.round(stage2d.width * this.precentToFloat(option.center[0]))
      option.center[1] = Math.round(stage2d.height * this.precentToFloat(option.center[1]))
		}

		//如果没有图例，将值做为图例
		if (typeof option.legend === 'undefined') {
			option.legend = option.data
		}

		//创建饼图
		this.shapes = []

    if (option.data && option.data.length) {
      option.data.forEach((item: number, index: number) => {
        //创建一个饼形图
  			const shape = new Pie()

  			//设置饼形图属性
  			shape.stage2d = this.stage2d
        shape.chart2d = this
  			shape.x = option.center[0]
  			shape.y = option.center[1]
  			shape.originalX = option.center[0]
  			shape.originalY = option.center[1]
  			shape.pattern = style.colors[index]
  			shape.mouseOverPattern = lighten(style.colors[index])
  			shape.name = option.legend[index]
  			shape.value = item
  			shape.radius = option.radius
  			shape.sAngle = -Math.PI / 2
  			shape.eAngle = -Math.PI / 2

  			this.shapes.push(shape)
      })
    }

		//图例绘制所需数据
		this.initLegend()
	}

  //计算饼形状绘制信息
	setPie () {

		//总计
		const total = this.shapes.reduce((num, shape) => {
      if (!shape.disable) {
				num += shape.value
			}
      return num
    }, 0)

    // 开始角度
    let sAngle = -Math.PI / 2

    // 结束角度
    let eAngle = -Math.PI / 2

		//计算起始和结束弧度
		this.shapes.forEach((shape) => {

      //算出百分比
			if (shape.disable) {
				shape.precent = 0
			} else {
				shape.precent = shape.value / total * 100
			}

			eAngle += shape.precent / 50 * Math.PI

      shape.animate({
        eAngle,
				sAngle
      })

			sAngle = eAngle

      const style = this.style

			//饼上的名称和值显示格式
			if (typeof style.nameStyle === 'function') {
				shape.nameText = style.nameStyle(shape.name, shape.value, shape.precent)
			}
			if (typeof style.nameStyle === 'string') {
				shape.nameText = style.nameStyle.replace('{a}', shape.name).replace('{b}', shape.value.toString()).replace('{c}', Math.round(shape.precent).toString())
			}
			if (typeof style.valueStyle === 'function') {
				shape.valueText = style.valueStyle(shape.name, shape.value, shape.precent)
			}
			if (typeof style.valueStyle === 'string') {
				shape.valueText = style.valueStyle.replace('{a}', shape.name).replace('{b}', shape.value.toString()).replace('{c}', Math.round(shape.precent).toString())
			}

		})
	}
}
