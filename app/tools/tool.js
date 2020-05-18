//获取元素相对于窗口左边的距离
export function offsetTop(elements) {
    let top = elements.offsetTop
    let parent = elements.offsetParent
    while (parent != null) {
        top += parent.offsetTop
        parent = parent.offsetParent
    }
    return top
}

//获取元素相对于窗口顶端边的距离
export function offsetLeft(elements) {
    let left = elements.offsetLeft
    let parent = elements.offsetParent
    while (parent != null) {
        left += parent.offsetLeft
        parent = parent.offsetParent
    }
    return left
}


//防抖和节流
export class throttler {
    constructor (delay = 100) {
        this.delay = delay
        this.lastTime = new Date().getTime()
    }

    static delay (delay) {
        return new throttler(delay)
    }

    throttle (fn) {
        const currentTime = new Date().getTime()
        if (currentTime - this.lastTime > this.delay) {
            console.log(currentTime-this.lastTime, this.delay);
            this.lastTime = currentTime
            fn()
        }
    }
}


function rgbToHex(r, g, b)
{
    let hex = ((r<<16) | (g<<8) | b).toString(16);
    return "#" + new Array(Math.abs(hex.length-7)).join("0") + hex;
}

function hexToRgb(hex)
{
    let rgb = [];
    for(let i=1; i<7; i+=2){
        rgb.push(parseInt("0x" + hex.slice(i,i+2)));
    }
    return rgb;
}

export function lighten (hex) {
    let rgb = hexToRgb(hex)
    let arr = rgb.map((v) => {
        return Math.min(v + 10, 255)
    })
    return rgbToHex(arr[0], arr[1], arr[2])
}

export function darken (hex) {
    let rgb = hexToRgb(hex)
    let arr = rgb.map((v) => {
        return Math.max(v - 10, 0)
    })
    return rgbToHex(arr[0], arr[1], arr[2])
}
