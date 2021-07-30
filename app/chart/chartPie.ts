import Stage from "./stage";
import { Pie } from './shape/index'
import { animater } from './animater'
import { lighten, darken } from '../utils/tool'

export default class ChartPie {
  shapes: Array<Pie>
  stage2d: Stage
  option: any

  constructor(option: any, stage2d: Stage) {
    this.option = option
    this.stage2d = stage2d

    this.initOptions()
    this.setPie()
  }

  precentToFloat (value: string) {
		return parseInt(value.slice(0, -1)) / 100
	}

  initOptions () {

		const option = this.option

		const stage2d = this.stage2d

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

		// //初始化前景画布配置
		// let context = this.foregroundScene.context
    //
		// context.strokeStyle = "#ffffff"
		// context.lineJoin = "bevel"
		// context.miterLimit = 1
		// context.textAlign = "center"
		// context.textBaseline = "middle"
		// context.font = this.style.font
		// context.fillStyle = "#ffffff"


		//如果没有图例，将值做为图例
		if (typeof option.legend === 'undefined') {
			option.legend = option.data
		}


		//创建饼图
		this.shapes = []

    if (option.data && option.data.length) {
      option.data.forEach((item: number, index: number) => {
        console.log("item, index", item, index);
        //创建一个饼形图
  			const shape = new Pie()

  			//设置饼形图属性
  			shape.stage2d = this.stage2d
  			// shape.chart2d = this
  			shape.x = option.center[0]
  			shape.y = option.center[1]
  			shape.originalX = option.center[0]
  			shape.originalY = option.center[1]
  			shape.pattern = option.style.colors[index]
  			shape.mouseOverPattern = lighten(option.style.colors[index])
  			shape.name = option.legend[index]
  			shape.value = item
  			shape.radius = option.radius
  			shape.sAngle = -Math.PI / 2
  			shape.eAngle = -Math.PI / 2

  			this.shapes.push(shape)
      })
    }

		//图例绘制所需数据
		// this.initLegend()
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

			// shape.animate({
			// 	eAngle,
			// 	sAngle
			// })

      animater(shape, {
        eAngle,
				sAngle
      })

			sAngle = eAngle

      const style = this.option.style

			//饼上的名称和值显示格式
			if (typeof style.nameStyle === 'function') {
				shape.nameText = style.nameStyle(shape.name, shape.value, shape.precent)
			}
			if (typeof style.nameStyle === 'string') {
				shape.nameText = style.nameStyle.replace('{a}', shape.name).replace('{b}', shape.value).replace('{c}', Math.round(shape.precent))
			}
			if (typeof style.valueStyle === 'function') {
				shape.valueText = style.valueStyle(shape.name, shape.value, shape.precent)
			}
			if (typeof style.valueStyle === 'string') {
				shape.valueText = style.valueStyle.replace('{a}', shape.name).replace('{b}', shape.value).replace('{c}', Math.round(shape.precent))
			}

		})

		console.log(this.shapes);
	}

  paint() {
    const scene = this.stage2d.getScene()

    console.log("context", scene.context);

    scene.paint(() => {
      this.shapes.forEach(shape => {
        shape.paint(scene.context)
      });
    })
  }
}
