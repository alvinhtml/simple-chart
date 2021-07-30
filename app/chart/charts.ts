import Stage from "./stage";
// import Scene from "./scene";
import ChartPie from './chartPie';
//
interface Styles {
  colors: Array<string>;
  font: string;
  valueStyle: string;
  legend: string;
}

interface Option {
  type: string;
  style: Styles;
}

interface PieOption extends Option {
    //半径
    radius: string;

    //圆心位置
    center: Array<string|number>;

    //图例
    legend: Array<string>;

    //图例对应的数据集
    data: Array<number>;
}



/*!
 * [constructor 图表类]
 * @param element [HTMLDivElement]
 */
export class Chart {

  stage2d: Stage

  //图例
  legendList = []

  //图形列表
  charts: Array<any> = []

  //事件列表
  eventList = []

  //需要复原的动画
  recoverAnimateList = []

  //默认样式配置信息
  style = {
    colors: ['#f2711c', '#fbbd08', '#b5cc18', '#21ba45', '#00b5ad', '#2185d0', '#6435c9', '#a333c8', '#e03997', '#a5673f'],
    font: '12px sans-serif',
    legend: null,
    nameStyle: null,
    valueStyle: '{c}%'
  }

  //图例Y轴偏移
  legendOffsetTop = 20

  tip = null

  constructor(element: HTMLDivElement | null) {
    if (element) {
      this.stage2d = new Stage(element);
    }
  }

  setOption({type, ...option}: PieOption) {
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
    console.log("option", option);
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
