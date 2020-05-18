export default class Queue {

    constructor (stage2d, canvas) {
        this.items = []
    }

    //向队列尾部添加一个新的项
    enqueue (element) {
        this.items.push(element)
    }

    //从队列中取出一个元素，并返回该元素
    dequeue () {
        return this.items.shift()
    }

    //查看队列最前面的元素
    front () {
        return this.items[0];
    }

    //查看队列是否为空，如果为空，返回true；否则返回false
    isEmpty () {
        return this.items.length == 0;
    }

    //查看队列的长度
    size () {
        return this.items.length;
    }
    
}
