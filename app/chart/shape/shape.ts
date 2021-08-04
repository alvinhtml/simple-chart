import Stage from "../stage"
import Chart from "../chart"
import { CLICK, MOUSEUP, MOUSEDOWN, MOUSEMOVE, MOUSESCROLL } from '../../constants'

interface ChartEvent {
  mouseX: number,
  mouseY: number,
  pageX: number,
  pageY: number,
  target: Shape
}

export default class Shape {
  recoverAnimateIng = false
  stage2d: Stage
  chart2d: Chart

  constructor() {

  }

  clickAnimate() {

  }

  easeOut(t: number, b: number, c: number, d: number) {
    return -c * (t /= d) * (t - 2) + b;
  }

  animate<
    K extends keyof this,
    T extends {
      [key in K]: number;
    },
  >(props: Partial<T>, speed: number = 400) {
    //属性原始值
    const initialValues: Partial<T> = {}

    //属性变化量
    const changeValues: Partial<T> = {}

    for (let key in props) {
      if (key === 'eAngle') {
        initialValues[key] = ((this as any)[key] * 100) as T[typeof key]
        changeValues[key] = (props[key] as number * 100 - (initialValues as any)[key]) as T[typeof key]
      } else {
        initialValues[key] = (this as any)[key]
        changeValues[key] = (props[key] as number - (this as any)[key]) as T[typeof key]
      }
    }

    let time = 0;
    let durationTime = speed / 1000


    const step = () => {
      time = time + this.stage2d.interval

      if (time > speed) {
        time = speed
      }

      for (let key in changeValues) {

        if (key === 'eAngle') {
          //通过缓动函数求出某一属性在时间轴上对应的过度值
          (this as any)[key] = this.easeOut(time / 1000, initialValues[key] as number, changeValues[key] as number, durationTime) / 100
        } else {
          //通过缓动函数求出某一属性在时间轴上对应的过度值
          (this as any)[key] = this.easeOut(time / 1000, initialValues[key] as number, changeValues[key] as number, durationTime)
        }

        // console.table([
        //     {
        //         key: key
        //         time,
        //         initialValues: initialValues[key],
        //         changeValue: changeValues[key],
        //         speed,
        //         value: this[key],
        //         eAngle: props[key] * 100
        //     }
        // ])

      }

      if (time < speed) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }

  //鼠标事件检测
  triggerEvent() {
    const events = this.stage2d.events

    if (events.length > 0) {
      //遍历事件列表，以响应多个事件
      events.forEach((event, index) => {
        switch (event.eventType) {
          case CLICK:
            const clickPointQueue = this.stage2d.clickPointQueue

            //如果点击事件队列不为空，执行回调，并消耗一次点击坐标
            if (!clickPointQueue.isEmpty()) {
              clickPointQueue.dequeue()
              event.callback(this.getStageEvent())

              // 先复原，然后播放点击动画,
              this.chart2d.recover()

              if (this.recoverAnimateIng) {
                this.recoverAnimateIng = false
              } else {
                this.clickAnimate()
              }
            }

            break;

          default:
            break;
        }
      })
      // for (let i in eventList) {
      //   switch (event.eventType) {
      //     case 'click':
      //       //检测 click 事件
      //       let clickPointQueue = this.stage2d.clickPointQueue
      //
      //       //如果点击事件队列不为空，执行回调，并消耗一次点击坐标
      //       if (!clickPointQueue.isEmpty()) {
      //         eventList[i].callback(this.getEventData(clickPointQueue.dequeue()))
      //
      //         //先复原，然后播放点击动画,
      //         this.chart2d.recoverAnimate()
      //         if (this.recoverAnimateIng) {
      //           this.recoverAnimateIng = false
      //         } else {
      //           this.clickAnimate()
      //         }
      //       }
      //
      //       break;
      //
      //     case 'mousemove':
      //       //检测 mousemove 事件
      //       let mousemoveEventQueue = this.stage2d.mousemoveEventQueue
      //
      //       //如果点击事件队列不为空，执行回调，并消耗一次点击坐标
      //       if (!mousemoveEventQueue.isEmpty()) {
      //         eventList[i].callback(this.getEventData(mousemoveEventQueue.dequeue()))
      //       }
      //
      //       break;
      //     default:
      //       break;
      //   }
      // }
    }
  }

  getStageEvent(): ChartEvent {
    return {
      mouseX: Math.round(this.stage2d.mouseX / this.stage2d.pixelRatio),
      mouseY: Math.round(this.stage2d.mouseY / this.stage2d.pixelRatio),
      pageX: this.stage2d.pageX,
      pageY: this.stage2d.pageY,
      target: this
    }
  }
}
