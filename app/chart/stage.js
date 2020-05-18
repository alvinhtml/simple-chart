//引入渲染优化方法
import Render from './render'

//引入场景对象
import Scene from './scene'

//引入图表对象
import Chart from './chart'

//队列
import Queue from './queue'

//引入常量名
import {
	EVENT_MOUSE_DOWN
} from '../constants'

//引入工具函数
import {offsetTop, offsetLeft} from '../tools/tool.js'

//iDOMHighResTimeStamp
let lastIDOMHighResTimeStamp = 0;

//创建坐标点，用于记录一次鼠标指向
function point (x, y) {
    return {x, y}
}


//舞台
export default class Stage {

    constructor (container) {

        //容器, canvas 元素的 parent
        this.container = container

        this.container.style.position = 'relative'

        //图表容器
        this.chartList = []

        //舞台的宽和高，既是容器的宽和高，实际也是canvas的宽和高
		this.width = container.clientWidth
		this.height = container.clientHeight


		//获取舞台相对于当前视窗的偏移，实际上也是canvas相对于当前视窗的偏移
        this.offset = {
			top: offsetTop(container),
			left: offsetLeft(container)
		}

        //侦听器容器
		this.eventlist = []

		//当前舞台的缩放
		this.scale = 1

        //当前舞台的偏移
		this.translateX = 0
		this.translateY = 0

        //设备像素比
        this.pixelRatio = pixelRatio

        //鼠标X
    	this.mouseX = 0

    	//鼠标Y
    	this.mouseY = 0

    	//鼠标相对于页面X
    	this.pageX = 0

    	//鼠标相对于页面Y
    	this.pageY = 0

        //当前帧距离上一帧的时间间隔
        this.interval = 0


        this.clickEventQueue = new Queue()
        this.mouseupEventQueue = new Queue()
        this.mousedownEventQueue = new Queue()
        this.mousemoveEventQueue = new Queue()

        this.initEventListener()

    }

    //初始化事件监听
    initEventListener () {
        //添加事件监听
		document.addEventListener("mouseup", (e) => {

		}, false)

		this.container.addEventListener("mousedown", (e) => {
			//coreStage2d.stageMouseDown(e)
		}, false)

        this.container.addEventListener("click", (e) => {
            this.clickEventQueue.enqueue(point(this.mouseX, this.mouseY))
		}, false)

		this.container.addEventListener("mousemove", (e) => {
        	this.pageX = e.pageX
        	this.pageY = e.pageY
            this.mouseX = (e.pageX - this.offset.left) * this.pixelRatio
            this.mouseY = (e.pageY - this.offset.top) * this.pixelRatio

            this.mousemoveEventQueue.enqueue(point(this.mouseX, this.mouseY))
		}, false)

        //缩放事件
        this.container.addEventListener("DOMMouseScroll", (e) => {
            //缩放，暂时禁用
            //this.stageScroll(e)
		}, false)
        //兼容FF
		this.container.onmousewheel = (e) => {
            //缩放，暂时禁用
            //this.stageScroll(e)
		}
    }

    //创建一个场景
    createScene (type) {
        //初始化一个场景，并绑定当前舞台
        let scener = Scene.init(this)
        return scener
    }

    //添加一个图表
    addChart (chart) {
        chart.init(this)
        this.chartList.push(chart)
    }

    stageScroll (e) {

        //判定鼠标指针在画布内
		if (
            Math.abs(e.pageX) > this.offset.left
            && Math.abs(e.pageX) < this.offset.left + this.width
            && Math.abs(e.pageY) > this.offset.top
            && Math.abs(e.pageY) < this.offset.top + this.height

        ) {
            //阻止冒泡
            e.stopPropagation()

			//计算出缩放前的鼠标在场景中的 X、Y
			var beforeX = ((e.pageX - this.offset.left) - this.translateX) / this.scale,
				beforeY = ((e.pageY - this.offset.top) - this.translateY) / this.scale


			if (e.detail > 0 || e.wheelDelta < 0) {
				if (this.scale > 0.2) this.scale -= .1
			} else {
				if (this.scale < 4) this.scale += .1
			}

            this.translateX = -beforeX * this.scale + (e.pageX - this.offset.left)
			this.translateY = -beforeY * this.scale + (e.pageY - this.offset.top)
		}

        console.log(this.scale);

	}


    //背景绘制
    backdropPaint () {
        this.chartList.forEach((chart) => {
            chart.backdropPaint()
        })
    }


    //前景绘制
    foregroundPaint () {


        this.chartList.forEach((chart) => {
            chart.foregroundPaint()
        })


        //此处计算 this.interval


        //释放鼠标点击坐标点
        if (!this.clickEventQueue.isEmpty()) this.clickEventQueue.dequeue()

        //释放鼠标移动坐标点
        if (!this.mousemoveEventQueue.isEmpty()) {
			this.mousemoveEventQueue.dequeue()
			this.chartList.forEach((chart) => {
				//鼠标移到 chart 图外，清除 tip
				chart.clearTip()
	        })
		}


        //DOMHighResTimeStamp 是一个double类型，用于存储时间值。该值可以是离散的时间点或两个离散时间点之间的时间差，单位为毫秒
        Render((iDOMHighResTimeStamp) => {
            //计算每次绘制的时间间隔
            this.interval = iDOMHighResTimeStamp - lastIDOMHighResTimeStamp
            lastIDOMHighResTimeStamp = iDOMHighResTimeStamp
            this.foregroundPaint()
        })
    }

    //开始绘制
    startPaint () {

        Render((iDOMHighResTimeStamp) => {

            //计算每次绘制的时间间隔
            this.interval = iDOMHighResTimeStamp - lastIDOMHighResTimeStamp
            lastIDOMHighResTimeStamp = iDOMHighResTimeStamp

            //背景只绘制一次
            this.backdropPaint()

            //前景一般需要重复绘制
            this.foregroundPaint()
        })
    }
}
