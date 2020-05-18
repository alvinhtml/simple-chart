import Render from './render'

//图形基类
class Shape {

    constructor () {
        this.recoverAnimateIng = false
    }

    //过渡动画
    animate (option, speed = 400) {

        //属性原始值
        let originalValues = {}

        //属性变化量
        let changeValues = {}

        for (let key in option) {
            if (key === 'eAngle') {
                originalValues[key] = this[key] * 100
                changeValues[key] = option[key] * 100 - originalValues[key]
            } else {
                originalValues[key] = this[key]
                changeValues[key] = option[key] - this[key]
            }
        }

        let time = 0

        let durationTime = speed / 1000


        const step = () => {

            time = time + this.stage2d.interval

            if (time > speed) {
                time = speed
            }

            for (let key in changeValues) {

                if (key === 'eAngle') {
                    //通过缓动函数求出某一属性在时间轴上对应的过度值
                    this[key] = this.easeOut(time / 1000, originalValues[key], changeValues[key], durationTime) / 100
                } else {
                    //通过缓动函数求出某一属性在时间轴上对应的过度值
                    this[key] = this.easeOut(time / 1000, originalValues[key], changeValues[key], durationTime)
                }

                // console.table([
                //     {
                //         time,
                //         originalValue: originalValues[key],
                //         changeValue: changeValues[key],
                //         speed,
                //         value: this[key],
                //         eAngel: option[key] * 100
                //     }
                // ])

            }

            if (time < speed) {
                Render(step)
            }
        }

        Render(step)
    }

    /*!
     * [easeOut 缓动函数]
     * @param  {[float]} t:timestamp [动画执行到当前帧所经过的时间] 如：0.3s
     * @param  {[float]} b:begining [起始值] 如：10
     * @param  {[float]} c:change [需要变化的量] 如：从 10 到 100，变化量是 90
     * @param  {[float]} d:duration [动画从开始到结束的总时长] 如：0.4s
     * @return {[float]}   [description] 时间轴上对应的过度值
     */
    easeOut(t,b,c,d) {
        return -c *(t/=d)*(t-2) + b;
    }
}

/*
    Math.sin(x)    x 的正玄值。返回值在 -1.0 到 1.0 之间；
    Math.cos(x)    x 的余弦值。返回的是 -1.0 到 1.0 之间的数；
    这两个函数中的X 都是指的“弧度”而非“角度” 　　
    弧度的计算公式为： 角度*（PI/180）；　　（角度转弧度可参考：角度与弧度互转）
    30° 角度 的弧度 = 30 * （PI/180）
 */

//饼状图
export class Pie extends Shape {
    constructor () {

        super()

        //类型
        this.type = 'pie'

        //形状的初始X坐标
        this.originalX = 0

        //形状的初始Y坐标
        this.originalY = 0

        //形状的X坐标
        this.x = 0

        //形状的Y坐标
        this.y = 0

        //填充颜色或图案
        this.pattern = '#ffffff'

        //填充颜色或图案 mouseover
        this.mouseOverPattern = '#ffffff'

        //名称
        this.name = ''

        //值
        this.value = 0

        //半径
        this.radius = 0

        //百分比
        this.precent = 0

        //起始角，以弧度计
        this.sAngle = 0

        //结束角，以弧度计
        this.eAngle = 0

        //名称信息, 决定是否在饼外显示名称
        this.nameText = null

        //值信息, 决定是否在饼上显示值或百分比
        this.valueText = null



        //临时禁用
        this.disable = 0


    }



    //绘制饼形
    paintPie (context) {

        context.beginPath()

        //对于饼状图，xy是圆的中心
        context.moveTo(this.x, this.y)

        context.arc(this.x, this.y, this.radius, this.sAngle,  this.eAngle)


        context.closePath()

        if (context.isPointInPath(this.stage2d.mouseX, this.stage2d.mouseY)) {
            context.fillStyle = this.mouseOverPattern;
            this.eventDetection()
        } else {
            context.fillStyle = this.pattern
        }

        context.stroke()
        context.fill()
    }

    //鼠标事件检测
    eventDetection () {

        let eventList = this.chart2d.eventList

        if (eventList.length > 0) {
            //遍历事件列表，以响应多个事件
            for (let i in eventList) {
                switch (eventList[i].eventType) {
                    case 'click':
                        //检测点击事件
                        let clickEventQueue = this.stage2d.clickEventQueue

                        //如果点击事件队列不为空，执行回调，并消耗一次点击坐标
                        if (!clickEventQueue.isEmpty()) {
                            eventList[i].callback(this.getEventData(clickEventQueue.dequeue()))
                            //先复原，然后播放点击动画,
                            this.chart2d.recoverAnimate()
                            if (this.recoverAnimateIng) {
                                this.recoverAnimateIng = false
                            } else {
                                this.clickAnimate()
                            }
                        }

                        break;

                    case 'mousemove':
                        //检测点击事件
                        let mousemoveEventQueue = this.stage2d.mousemoveEventQueue

                        //如果点击事件队列不为空，执行回调，并消耗一次点击坐标
                        if (!mousemoveEventQueue.isEmpty()) {
                            eventList[i].callback(this.getEventData(mousemoveEventQueue.dequeue()))
                        }

                        break;
                    default:

                }
            }
        }
    }

    getEventData (point) {
        return {
            mouseX: parseInt(this.stage2d.mouseX / this.stage2d.pixelRatio),
            mouseY: parseInt(this.stage2d.mouseY / this.stage2d.pixelRatio),
            pageX: this.stage2d.pageX,
            pageY: this.stage2d.pageY,
            color: this.pattern,
            name: this.name,
            value: this.value,
            precent: this.precent
        }
    }

    //点击动画
    clickAnimate () {

        //计算饼形中线弧度
        let radian = (this.eAngle - this.sAngle) / 2 + this.sAngle  + (0.5 * Math.PI)

        //计算移动后的圆心坐标
        let x = this.x + Math.sin(radian) * 10
        let y = this.y - Math.cos(radian) * 10

        //先记录当前 shape 和圆心坐标，复原时用
        this.chart2d.addRecoverAnimate(this, {
            x: this.x,
            y: this.y
        })

        //开始播放移动动画
        this.animate({
            x,
            y
        })

        this.recoverAnimateIng = true

    }


    paint (context) {

        //保存画布句柄，开始绘制饼形
        context.save()
        this.paintPie(context)
        context.restore()

        //计算饼形中线弧度
        let radian = (this.eAngle - this.sAngle) / 2 + this.sAngle  + (0.5 * Math.PI)

        if (this.chart2d.style.valueStyle && !this.disable) {
            //绘制数据值
            let x = this.x + Math.sin(radian) * (this.radius * .7)
            let y = this.y - Math.cos(radian) * (this.radius * .7)
            context.fillText(this.valueText, x, y)
        }


        if (this.chart2d.style.nameStyle && !this.disable) {
            //开始绘制名称，计算名称指引线开始坐标(sx, xy)和结束(ex, ey)坐标
            let sx = this.originalX + Math.sin(radian) * (this.radius + 4)
            let sy = this.originalY - Math.cos(radian) * (this.radius + 4)
            let ex = this.originalX + Math.sin(radian) * (this.radius + 20)
            let ey = this.originalY - Math.cos(radian) * (this.radius + 20)

            //保存画布句柄，开始画线
            context.save()

            context.strokeStyle = this.pattern
            context.beginPath()
            context.moveTo(sx, sy)
            context.lineTo(ex, ey)
            context.stroke()

            //绘制名称
            context.fillStyle = this.pattern
            if (radian < Math.PI) {
                context.textAlign = "left"
                context.fillText(this.nameText, ex + 3, ey)
            } else {
                context.textAlign = "right"
                context.fillText(this.nameText, ex - 3, ey)
            }
            context.restore()
        }

    }
}

//点
export class Dot extends Shape {
    constructor () {

        super()

        //类型
        this.type = 'dot'

        // //形状的初始X坐标
        // this.originalX = 0
        //
        // //形状的初始Y坐标
        // this.originalY = 0

        //形状的X坐标
        this.x = 0

        //形状的Y坐标
        this.y = 0

        //填充颜色或图案
        this.pattern = '#ffffff'

        //填充颜色或图案 mouseover
        this.mouseOverPattern = '#ffffff'

        //名称
        this.name = ''

        //值
        this.value = 0

        //值信息, 决定是否在饼上显示值或百分比
        this.valueText = null

        //临时禁用
        this.disable = 0


    }



    //绘制饼形
    paintDot (context) {

        context.beginPath()

        //对于饼状图，xy是圆的中心
        context.moveTo(this.x, this.y)

        context.arc(this.x, this.y, this.radius, this.sAngle,  this.eAngle)


        context.closePath()

        if (context.isPointInPath(this.stage2d.mouseX, this.stage2d.mouseY)) {
            context.fillStyle = this.mouseOverPattern;
            this.eventDetection()
        } else {
            context.fillStyle = this.pattern
        }

        context.stroke()
        context.fill()
    }

    //鼠标事件检测
    eventDetection () {

        let eventList = this.chart2d.eventList

        if (eventList.length > 0) {
            //遍历事件列表，以响应多个事件
            for (let i in eventList) {
                switch (eventList[i].eventType) {
                    case 'click':
                        //检测点击事件
                        let clickEventQueue = this.stage2d.clickEventQueue

                        //如果点击事件队列不为空，执行回调，并消耗一次点击坐标
                        if (!clickEventQueue.isEmpty()) {
                            eventList[i].callback(this.getEventData(clickEventQueue.dequeue()))
                            //先复原，然后播放点击动画,
                            this.chart2d.recoverAnimate()
                            if (this.recoverAnimateIng) {
                                this.recoverAnimateIng = false
                            } else {
                                this.clickAnimate()
                            }
                        }

                        break;

                    case 'mousemove':
                        //检测点击事件
                        let mousemoveEventQueue = this.stage2d.mousemoveEventQueue

                        //如果点击事件队列不为空，执行回调，并消耗一次点击坐标
                        if (!mousemoveEventQueue.isEmpty()) {
                            eventList[i].callback(this.getEventData(mousemoveEventQueue.dequeue()))
                        }

                        break;
                    default:

                }
            }
        }
    }

    getEventData (point) {
        return {
            mouseX: parseInt(this.stage2d.mouseX / this.stage2d.pixelRatio),
            mouseY: parseInt(this.stage2d.mouseY / this.stage2d.pixelRatio),
            pageX: this.stage2d.pageX,
            pageY: this.stage2d.pageY,
            color: this.pattern,
            name: this.name,
            value: this.value,
            precent: this.precent
        }
    }

    //点击动画
    clickAnimate () {

        //计算饼形中线弧度
        let radian = (this.eAngle - this.sAngle) / 2 + this.sAngle  + (0.5 * Math.PI)

        //计算移动后的圆心坐标
        let x = this.x + Math.sin(radian) * 10
        let y = this.y - Math.cos(radian) * 10

        //先记录当前 shape 和圆心坐标，复原时用
        this.chart2d.addRecoverAnimate(this, {
            x: this.x,
            y: this.y
        })

        //开始播放移动动画
        this.animate({
            x,
            y
        })

        this.recoverAnimateIng = true

    }


    paint (context) {

        //保存画布句柄，开始绘制饼形
        context.save()
        this.paintPie(context)
        context.restore()

        //计算饼形中线弧度
        let radian = (this.eAngle - this.sAngle) / 2 + this.sAngle  + (0.5 * Math.PI)

        if (this.chart2d.style.valueStyle && !this.disable) {
            //绘制数据值
            let x = this.x + Math.sin(radian) * (this.radius * .7)
            let y = this.y - Math.cos(radian) * (this.radius * .7)
            context.fillText(this.valueText, x, y)
        }


        if (this.chart2d.style.nameStyle && !this.disable) {
            //开始绘制名称，计算名称指引线开始坐标(sx, xy)和结束(ex, ey)坐标
            let sx = this.originalX + Math.sin(radian) * (this.radius + 4)
            let sy = this.originalY - Math.cos(radian) * (this.radius + 4)
            let ex = this.originalX + Math.sin(radian) * (this.radius + 20)
            let ey = this.originalY - Math.cos(radian) * (this.radius + 20)

            //保存画布句柄，开始画线
            context.save()

            context.strokeStyle = this.pattern
            context.beginPath()
            context.moveTo(sx, sy)
            context.lineTo(ex, ey)
            context.stroke()

            //绘制名称
            context.fillStyle = this.pattern
            if (radian < Math.PI) {
                context.textAlign = "left"
                context.fillText(this.nameText, ex + 3, ey)
            } else {
                context.textAlign = "right"
                context.fillText(this.nameText, ex - 3, ey)
            }
            context.restore()
        }

    }
}
