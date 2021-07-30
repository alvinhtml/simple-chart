// class Animater {
//   //过渡动画
//   animate(props, speed: Number = 400): void {
//
//   }
//
//
//
// }

/*!
 * [easeOut 缓动函数]
 * @param  {[float]} t:timestamp [动画执行到当前帧所经过的时间] 如：0.3s
 * @param  {[float]} b:begining [起始值] 如：10
 * @param  {[float]} c:change [需要变化的量] 如：从 10 到 100，变化量是 90
 * @param  {[float]} d:duration [动画从开始到结束的总时长] 如：0.4s
 * @return {[float]}   [description] 时间轴上对应的过度值
 */
function easeOut(t: number, b: number, c: number, d: number) {
  return -c *(t/=d)*(t-2) + b;
}


export function animater(shape: any, props: any, speed: number = 400) {

  let lastIDOMHighResTimeStamp = 0

  //属性原始值
  const originalValues: any = {}

  //属性变化量
  const changeValues: any = {}


  for (let key in props) {
    if (key === 'eAngle') {
      originalValues[key] = shape[key] * 100
      changeValues[key] = props[key] as number * 100 - originalValues[key] as number
    } else {
      originalValues[key] = shape[key]
      changeValues[key] = props[key] - shape[key]
    }
  }

  let time = 0;

  let durationTime = speed / 1000;


  const step = (iDOMHighResTimeStamp: number) => {

    const interval = iDOMHighResTimeStamp - lastIDOMHighResTimeStamp

    lastIDOMHighResTimeStamp = iDOMHighResTimeStamp

    time = time + interval

    if (time > speed) {
      time = speed
    }

    for (let key in changeValues) {

      if (key === 'eAngle') {
        //通过缓动函数求出某一属性在时间轴上对应的过度值
        shape[key] = easeOut(time / 1000, originalValues[key], changeValues[key], durationTime) / 100
      } else {
        //通过缓动函数求出某一属性在时间轴上对应的过度值
        shape[key] = easeOut(time / 1000, originalValues[key], changeValues[key], durationTime)
      }

      // console.table([
      //     {
      //         time,
      //         originalValue: originalValues[key],
      //         changeValue: changeValues[key],
      //         speed,
      //         value: shape[key],
      //         eAngel: props[key] * 100
      //     }
      // ])

    }

    if (time < speed) {
      requestAnimationFrame(step)
    }
  }

  console.log("requestAnimationFrame", requestAnimationFrame);

  requestAnimationFrame(step)
}
