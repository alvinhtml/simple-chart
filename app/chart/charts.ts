import Stage from "./stage"
import ChartPie from './chartPie'
import ChartBar from './chartBar'
import ChartLine from './chartLine'

/*!
 * [constructor 图表类]
 * @param element [HTMLDivElement]
 */
export class Charts {

  stage2d: Stage

  //图例
  legendList = []

  //图形列表
  charts: Array<any> = []

  //需要复原的动画
  recoverAnimateList = []

  //图例Y轴偏移
  legendOffsetTop = 20

  tip = null

  constructor(element: HTMLDivElement | null) {
    if (element) {
      this.stage2d = new Stage(element);
    }
  }

  setOption(option: any) {
    this.charts = []

    const type = option.type

    let chart

    switch (type) {
      case 'pie':
        chart = new ChartPie(option, this.stage2d)
        break;

      case 'bar':
        chart = new ChartBar(option, this.stage2d)
        break;

      case 'line':
        chart = new ChartLine(option, this.stage2d)
        break;

      default:
        break;
    }

    this.charts.push(chart)
    this.render()
  }

  // setPie(option: any) {
  //
  // }

  render() {
    this.charts.forEach((chart) => {
      chart.paint()
    })
  }

  // 绑定事件
  addEventListener(event: string, callback: Function) {
    this.stage2d.addEventListener(event, callback)
  }
}
