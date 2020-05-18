//事件对象
export default class Event2d {

    constructor (event, callback) {
        //事件类型
		this.eventType = event

        //事件回调
        this.callback = callback
    }

}
