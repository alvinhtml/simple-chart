import Queue from './queue';
import Scene from './scene';
import Point from './point';

//iDOMHighResTimeStamp
let lastIDOMHighResTimeStamp = 0;

// 舞台<Stage>：大小位置事件
export default class Stage {

  // 容器, canvas 元素的 parent
  public container: HTMLDivElement;

  // 舞台的宽和高，既是容器的宽和高，实际也是 canvas 的宽和高
  public width: number;
  public height: number;

  // 场景
  public scenes: Array<Scene> = [];


  // 获取舞台相对于当前视窗的偏移
  public offsetX: number;
  public offsetY: number;

  // 侦听器容器
  private events = [];

  // 当前舞台的缩放
  public scale = 1

  //当前舞台的偏移
  public translateX: number = 0;
  public translateY: number = 0;

  // 设备像素比
  private pixelRatio = 1; //pixelRatio;

  // 鼠标 X
  public mouseX: number = 0;

  // 鼠标 Y
  public mouseY: number = 0;

  // 鼠标相对于页面 X
  public pageX: number = 0;

  // 鼠标相对于页面 Y
  public pageY: number = 0;

  // 当前帧距离上一帧的时间间隔
  public lastIDOMHighResTimeStamp: number = 0


  private clickEventQueue = new Queue<Point>();
  private mouseupEventQueue = new Queue<Point>();
  private mousedownEventQueue = new Queue<Point>();
  private mousemoveEventQueue = new Queue<Point>();

  constructor(container: HTMLDivElement) {
    this.container = container;
    this.width = container.clientWidth;
    this.height = container.clientHeight;
    this.container.style.position = 'relative';
    this.initEventListener();
  }

  //初始化事件监听
  initEventListener() {
    //添加事件监听
    document.addEventListener("mouseup", (e: MouseEvent) => {

    }, false);

    this.container.addEventListener("mousedown", (e: MouseEvent) => {
      //coreStage2d.stageMouseDown(e)
    }, false)

    this.container.addEventListener("click", (e: MouseEvent) => {
      this.clickEventQueue.enqueue(new Point(this.mouseX, this.mouseY));
    }, false);

    this.container.addEventListener("mousemove", (e: MouseEvent) => {
      this.pageX = e.pageX;
      this.pageY = e.pageY;
      this.mouseX = (e.pageX - this.offsetX) * this.pixelRatio;
      this.mouseY = (e.pageY - this.offsetY) * this.pixelRatio;

      this.mousemoveEventQueue.enqueue(new Point(this.mouseX, this.mouseY));
    }, false);

    //缩放事件
    this.container.addEventListener("DOMMouseScroll", (e: MouseEvent) => {
      //缩放，暂时禁用
      //this.stageScroll(e)
    }, false);

    //兼容FF
    // this.container.onmousewheel = (e: MouseEvent) => {
    //   //缩放，暂时禁用
    //   //this.stageScroll(e)
    // }
  }


  //创建一个场景, 并返回 CanvasRenderingContext2D 句柄
  getScene(): Scene {
    const scene = new Scene(this)
    this.scenes.push(scene)

    console.log("scene", scene);

    return scene
  }

  //添加一个图表
  // addChart (chart) {
  //   chart.init(this);
  //   this.chartList.push(chart);
  // }

  // stageScroll (e) {
  //
  //   //判定鼠标指针在画布内
  //   if (
  //     Math.abs(e.pageX) > this.offsetX
  //     && Math.abs(e.pageX) < this.offsetX + this.width
  //     && Math.abs(e.pageY) > this.offsetY
  //     && Math.abs(e.pageY) < this.offsetY + this.height
  //   ) {
  //     //阻止冒泡
  //     e.stopPropagation()
  //
  //     //计算出缩放前的鼠标在场景中的 X、Y
  //     var beforeX = ((e.pageX - this.offsetX) - this.translateX) / this.scale,
  //     beforeY = ((e.pageY - this.offsetY) - this.translateY) / this.scale
  //
  //
  //     if (e.detail > 0 || e.wheelDelta < 0) {
  //     if (this.scale > 0.2) this.scale -= .1
  //     } else {
  //     if (this.scale < 4) this.scale += .1
  //     }
  //
  //     this.translateX = -beforeX * this.scale + (e.pageX - this.offsetX)
  //     this.translateY = -beforeY * this.scale + (e.pageY - this.offsetY)
  //     }
  //
  //     console.log(this.scale);
  // }


  //背景绘制
  // backdropPaint () {
  //   this.chartList.forEach((chart) => {
  //     chart.backdropPaint();
  //   })
  // }


  //前景绘制
  // foregroundPaint () {
  //
  //   this.chartList.forEach((chart) => {
  //     chart.foregroundPaint()
  //   });
  //
  //   //释放鼠标点击坐标点
  //   if (!this.clickEventQueue.isEmpty()) this.clickEventQueue.dequeue()
  //
  //   //释放鼠标移动坐标点
  //   if (!this.mousemoveEventQueue.isEmpty()) {
  //     this.mousemoveEventQueue.dequeue()
  //     this.chartList.forEach((chart) => {
  //       //鼠标移到 chart 图外，清除 tip
  //       chart.clearTip()
  //     })
  //   }
  //
  //
  //   //DOMHighResTimeStamp 是一个double类型，用于存储时间值。该值可以是离散的时间点或两个离散时间点之间的时间差，单位为毫秒
  //   Render((iDOMHighResTimeStamp) => {
  //     //计算每次绘制的时间间隔
  //     this.interval = iDOMHighResTimeStamp - lastIDOMHighResTimeStamp;
  //     lastIDOMHighResTimeStamp = iDOMHighResTimeStamp
  //     this.foregroundPaint();
  //   });
  // }

  //开始绘制
  // startPaint () {
  //   Render((iDOMHighResTimeStamp) => {
  //     //计算每次绘制的时间间隔
  //     this.interval = iDOMHighResTimeStamp - lastIDOMHighResTimeStamp
  //     lastIDOMHighResTimeStamp = iDOMHighResTimeStamp
  //
  //     //背景只绘制一次
  //     this.backdropPaint();
  //
  //     //前景一般需要重复绘制
  //     this.foregroundPaint();
  //   })
  // }
}
