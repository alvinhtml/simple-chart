import Stage from './stage';

// 场景<Scene>：元素
export default class Scene {
  stage: Stage
  context: CanvasRenderingContext2D

  constructor(stage: Stage) {
    this.stage = stage

    //创建 Canvas，并添加到场景
    const canvas = document.createElement('canvas')
    canvas.width = stage.width
    canvas.height = stage.height
    canvas.style.position = 'absolute'

    this.stage.container.appendChild(canvas)


    const context = canvas.getContext('2d')

    if (context) {
      this.context = context
    }
  }

  paint(fn: Function) {
    const frame = () => {
      const {width, height, translateX, translateY, scale} = this.stage

      //清理画面
      this.context.clearRect(0, 0, width, height)

      //重置画布的透明度
      this.context.globalAlpha = 1

      this.context.save()

      //重新设定画布偏移和缩放
      this.context.translate(translateX, translateY)

      // console.log("this.scale", this.scale);
      this.context.scale(scale, scale)

      fn(this.context)

      this.context.restore()

      //需要重复绘制的内容
      // requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }
}
