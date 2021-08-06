import Stage from "./stage";
import Chart from "./chart";
import { Bar } from './shape/index'
import { lighten, darken } from '../utils/tool'

export default class ChartBar extends Chart {
  shapes: Array<Bar>

  constructor(option: any, stage2d: Stage) {
    super()
    this.option = option
    this.stage2d = stage2d

    this.initOptions()
    // this.setPie()
  }

  initOptions () {
    // 初始化样式
    this.initStyle()

		const {option, stage2d, style} = this

    if (option.padding) {
      this.padding = option.padding
    }

    // 绘制坐标轴
    console.log("111", 111);

    const [floor, ceil] = this.paintAxis()



		// //计算半径
		// if (typeof option.radius === 'undefined') {
		// 	option.radius = Math.round(Math.min(stage2d.width, stage2d.height) / 2 * 0.8)
		// } else {
		// 	option.radius = Math.round(Math.min(stage2d.width, stage2d.height) / 2 * this.precentToFloat(option.radius))
		// }
    //
    //
		// //计算饼的圆心坐标
		// if (typeof option.center === 'undefined') {
		// 	option.center = [Math.round(stage2d.width / 2), Math.round(stage2d.height / 2)]
		// } else {
    //   option.center[0] = Math.round(stage2d.width * this.precentToFloat(option.center[0]))
    //   option.center[1] = Math.round(stage2d.height * this.precentToFloat(option.center[1]))
		// }

		// //如果没有图例，将值做为图例
		// if (typeof option.legend === 'undefined') {
		// 	option.legend = option.data
		// }
    //


		//创建柱状图
		this.shapes = []
    //
    if (option.data && option.data.length) {


      /**
       * 创建一个 Bar 对象
       * @param {number} value
       * @param {number} index
       * @param {number} groupIndex - 在组中的索引
       * @param {number} groupLength - 每组个数
       */

      const width = this.stage2d.width - this.padding[1] - this.padding[3];
      const height = this.stage2d.height - this.padding[0] - this.padding[2];

      // 一组柱形空间宽度
      const groupPartWidth = width / option.data.length

      const createBar = (value: number, index: number, groupIndex: number, groupLength: number) => {
        //创建一个饼形图
  			const shape = new Bar()

  			//设置饼形图属性
  			shape.stage2d = this.stage2d
        shape.chart2d = this

        // 单个柱形空间宽度
        const partWidth = groupPartWidth * 0.8 / groupLength

        // 柱形高度
        shape.height = (value - floor) / (ceil - floor) * height
        shape.width = partWidth * 0.8
  			shape.x = (partWidth * groupIndex) + (partWidth * 0.1) + (groupPartWidth * index) + this.padding[3] + groupPartWidth * 0.1
        shape.y = height - shape.height + this.padding[0] - 1
  			shape.pattern = style.colors[groupIndex]
  			shape.mouseOverPattern = lighten(style.colors[groupIndex])
  			shape.name = option.legend[groupIndex]
  			shape.value = value


  			this.shapes.push(shape)
      }

      option.data.forEach((item: number | number[], index: number) => {
        if (typeof item === 'number') {
          createBar(item, index, index, 1)
        } else {
          item.forEach((v, i) => {
            createBar(v, index, i, item.length)
          });
        }
      })
    }

		//图例绘制所需数据
		this.initLegend()
	}

  //计算饼形状绘制信息
	setPie () {

	}
}
