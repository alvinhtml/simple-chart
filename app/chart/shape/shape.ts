import Stage from "../stage";


export default class Shape {
  recoverAnimateIng = false
  stage2d: Stage

  constructor () {

  }

  //鼠标事件检测
  eventDetection() {
    // const eventList = this.chart2d.eventList
    //
    // if (eventList.length > 0) {
    //   //遍历事件列表，以响应多个事件
    //   for (let i in eventList) {
    //     switch (eventList[i].eventType) {
    //       case 'click':
    //         //检测 click 事件
    //         let clickEventQueue = this.stage2d.clickEventQueue
    //
    //         //如果点击事件队列不为空，执行回调，并消耗一次点击坐标
    //         if (!clickEventQueue.isEmpty()) {
    //           eventList[i].callback(this.getEventData(clickEventQueue.dequeue()))
    //
    //           //先复原，然后播放点击动画,
    //           this.chart2d.recoverAnimate()
    //           if (this.recoverAnimateIng) {
    //             this.recoverAnimateIng = false
    //           } else {
    //             this.clickAnimate()
    //           }
    //         }
    //
    //         break;
    //
    //       case 'mousemove':
    //         //检测 mousemove 事件
    //         let mousemoveEventQueue = this.stage2d.mousemoveEventQueue
    //
    //         //如果点击事件队列不为空，执行回调，并消耗一次点击坐标
    //         if (!mousemoveEventQueue.isEmpty()) {
    //           eventList[i].callback(this.getEventData(mousemoveEventQueue.dequeue()))
    //         }
    //
    //         break;
    //       default:
    //         break;
    //     }
    //   }
    // }
  }

  getEventData(point: Function) {
    // return {
    //     mouseX: parseInt(this.stage2d.mouseX / this.stage2d.pixelRatio),
    //     mouseY: parseInt(this.stage2d.mouseY / this.stage2d.pixelRatio),
    //     pageX: this.stage2d.pageX,
    //     pageY: this.stage2d.pageY,
    //     color: this.pattern,
    //     name: this.name,
    //     value: this.value,
    //     precent: this.precent
    // }
  }
}
