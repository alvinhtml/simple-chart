import Stage from "./stage";
import Scene from './scene'
import { Legend, Axis } from './shape/index'
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

  type: string

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
    colors: ['#f2711c', '#2185d0', '#21ba45', '#b5cc18', '#00b5ad', '#fbbd08', '#6435c9', '#a333c8', '#e03997', '#a5673f'],
    font: '12px sans-serif',
    legend: {
      orient: 'horizontal',
      position: ['left', 'top']
    },
    nameStyle: '{a}%',
    valueStyle: '{c}%'
  }

  padding: Array<number> = [40, 20 ,40 , 60]

  // 坐标轴画面
  axisScene: Scene

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

    if (!option.legend || !option.style.legend) {
      return false
    }

    this.legends = this.option.legend.map((name: string, index: number) => {
      const legend = new Legend()

      legend.stage2d = this.stage2d
      legend.chart2d = this
      legend.name = name
      legend.pattern = option.style.colors[index]
      legend.mouseOverPattern = lighten(option.style.colors[index])

      switch (this.type) {
        case 'pie':
          legend.binders = [this.shapes[index]]
          break;

        case 'bar':
          legend.binders = this.shapes.map(v => v[index])
          break;

        default:
          break;
      }

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
      this.shapes.flat().forEach(shape => {
        // console.log("shape", shape);
        shape.paint(scene.context)
      });

      this.legends.forEach(legend => {
        legend.paint(scene.context)
      });
    })
  }

  paintAxis(data: any[]): number[] {
    const option = this.option

    const axis = new Axis()

    axis.width = this.stage2d.width - this.padding[1] - this.padding[3];
    axis.height = this.stage2d.height - this.padding[0] - this.padding[2];
    axis.x = this.padding[3]
    axis.y = this.padding[0]
    axis.xLabel = option.xAxis.data

    const flatValues = data.flat()
    const maxValue = Math.max.apply(null, flatValues)
    const minValue = Math.min(...flatValues)

    axis.yLabel = this.getScaleMark(maxValue, minValue)


    if (!this.axisScene) {
      // 创建坐标轴画布
      const scene = this.stage2d.getScene()
      this.axisScene = scene
      scene.initContext(this.option.style)
    }

    this.axisScene.paintOnce(() => {
      axis.paint(this.axisScene.context)
    })

    return [axis.yLabel[0], axis.yLabel[axis.yLabel.length - 1]]
  }

  // 求出坐标轴刻度值
  getScaleMark(max: number, min: number): number[] {
    // 以 10 为底数，求出按最高位数向上取整的幂数，最小支持 6 位小数, 例如：375 按最高位数向上取整是 1000，10 的 3 次幂
    let power = -6

    // 求出最大绝对值，考虑 min 为 负数的情况
    const absMax = Math.max(Math.abs(max - min), max)

    while (absMax > Math.pow(10, power)) {
      power += 1
    }

    // 最高位数向上取整后的值，等分成 10 份，每一份的大小
    let part = Math.pow(10, power - 1)

    // 如果 max 不足 3 份，将每一份的大小调整为原来的一半
    if (max < Math.pow(10, power - 1) * 3) {
      part = part / 2
    }

    // 如果 max 超过 6 份，将每一份的大小调整为原来的 2 倍
    if (max > Math.pow(10, power - 1) * 6) {
      part = part * 2
    }

    let floor = 0

    if (min < 0) {
      while (floor > min) {
        floor -= part
      }
    }

    const scaleMark = [floor]

    while(floor < max) {
      floor += part

      // 解决小数精度问题
      scaleMark.push(Math.round(floor * 100000) / 100000)
    }

    return scaleMark
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

  // 重置
  reset() {
    switch (this.type) {
      case 'pie':
        (this as any).setPie()
        break;

      case 'bar':
        (this as any).setBar()
        break;

      default:
        break;
    }
  }
}
