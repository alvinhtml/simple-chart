import Stage from "./stage";
import { Legend } from './shape/index'
import { lighten, darken } from '../utils/tool'

// interface Styles {
//   colors?: Array<string>;
//   font?: any;
//   valueStyle?: string | Function;
//   nameStyle?: string | Function;
//   legend?: {
//     orient: 'horizontal' | 'vertical';
//     position: ['left' | 'center' | 'right', 'top' | 'center' | 'bottom']
//   };
// }
//
//
//
// interface Option {
//   type: string;
//   style: Styles;
//   data: any;
//   radius?: any;
//   center?: any;
//   legend?: Array<string>
// }

interface Recover {
  shape: any,
  props: {
    [k: string]: number
  }
}

export default class Chart {
  // stage
  stage2d: Stage

  // 图形容器
  shapes: Array<any>

  // 记录需要复原的图形信息, 供播放复原动画使用
  recoverShapes: Array<Recover> = []

  // 记录需要复原的图形信息, 供播放复原动画使用
  legends: Array<any> = []

  // 配置信息
  option: any

  //默认样式配置信息
  style:any = {
    colors: ['#f2711c', '#fbbd08', '#b5cc18', '#21ba45', '#00b5ad', '#2185d0', '#6435c9', '#a333c8', '#e03997', '#a5673f'],
    font: '12px sans-serif',
    legend: {
      orient: 'horizontal',
      position: ['left', 'top']
    },
    nameStyle: '{a}%',
    valueStyle: '{c}%'
  }

  initStyle() {
    if (this.option.style) {
      this.style = Object.assign(this.style, this.option.style)

      if (this.option.style.legend) {
        this.style.legend = Object.assign(this.style.legend, this.option.style.legend)
      }
    }
  }

  precentToFloat(value: string) {
    return parseInt(value.slice(0, -1)) / 100
  }

  //初始化图例信息
  initLegend() {
    const option = this.option

    if (!option.style.legend) {
      return false
    }

    this.legends = this.option.legend.map((name: string, index: number) => {
      const legend = new Legend()

      legend.stage2d = this.stage2d
      legend.chart2d = this
      legend.name = name
      legend.pattern = option.style.colors[index]
      legend.mouseOverPattern = lighten(option.style.colors[index])

      return legend
    })
  }

  setLegend(context: CanvasRenderingContext2D) {
    const legend = this.option ?.style ?.legend


    if (!legend) {
      return false
    }

    const { orient, position } = this.option.style.legend

    let xIncrement = 0, yIncrement = 0

    this.legends.forEach(legend => {

      // 获取文本的宽度，并计算 x
      const measure: TextMetrics = context.measureText(legend.name)

      legend.width = measure.width + 24
      legend.x = xIncrement
      legend.y = yIncrement

      if (orient === 'vertical') {
        yIncrement += measure.actualBoundingBoxRight
      } else {
        xIncrement += legend.width
      }
    })

    let [offsetX, offsetY] = position || ['left', 'top']

    switch (offsetX) {
      case 'left':
        offsetX = 0
        break

      case 'center':
        offsetX = (this.stage2d.width / 2) - (xIncrement / 2)
        break

      case 'right':
        offsetX = this.stage2d.width - xIncrement
        break

      default:
        offsetX = 0
        break
    }

    switch (offsetY) {
      case 'top':
        offsetY = 20
        break

      case 'center':
        offsetY = (this.stage2d.height / 2) - (yIncrement / 2)
        break

      case 'bottom':
        offsetY = this.stage2d.height - yIncrement - 10
        break

      default:
        offsetY = 20
        break
    }

    this.legends.forEach(legend => {
      legend.x = legend.x + offsetX
      legend.y = legend.y + offsetY
    });
  }

  paint() {
    const scene = this.stage2d.getScene()
    scene.initContext(this.option.style)

    this.setLegend(scene.context)

    scene.paint(() => {
      this.shapes.forEach(shape => {
        shape.paint(scene.context)
      });

      this.legends.forEach(legend => {
        legend.paint(scene.context)
      });
    })
  }

  // 添加待复原图形
  addRecoverShapes(shape: any, props: {[k: string]: number}) {
    this.recoverShapes.push({
      shape,
      props
    })
  }

  // 复原图形
  recover() {
    this.recoverShapes.forEach((v) => {
      v.shape.animate(v.props)
    })
    this.recoverShapes = []
  }
}
