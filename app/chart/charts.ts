import Stage from "./stage";
// import Scene from "./scene";
import ChartPie from './chartPie';

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

  //事件列表
  eventList = []

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

  setOption({type, ...option}: any) {
    this.charts = []

    switch (type) {
      case 'pie':
        this.setPie(option)
        break;

      default:
        break;
    }




    this.render()
  }

  setPie(option: Object) {
    const pie = new ChartPie(option, this.stage2d)

    this.charts.push(pie)
  }

  render() {
    this.charts.forEach((item) => {
      item.paint()
    })

    // 处理数据
    // 生成精灵 push 到 scene -> push 到 stage2d
    // rander  stage2d.rander

  }

  //绑定事件
  // addEventListener (event: string, callback: Function) {
    // this.chartList.forEach((chart) => {
    //   chart.addEventListener(event, callback)
    // })
  // }

  //开启 tips
  // tip (format) {
    // this.chartList.forEach((chart) => {
    //   chart.addTip(format)
    // })
  // }
}
