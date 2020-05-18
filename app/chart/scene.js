//场景
export default class Scene {

    constructor (stage2d, canvas) {

        //场景对应的舞台
        this.stage2d = stage2d

        this.width = stage2d.width

        this.height = stage2d.height

        //场景画布对象
        this.canvas = canvas

        //绘图对象
        this.context = canvas.getContext('2d')

    }

    paint (callback) {
        //清理画面
		this.context.clearRect(0, 0, this.width, this.height)

		//重置画布的透明度
		this.context.globalAlpha = 1

		this.context.save()

        //重新设定画布偏移和缩放
		this.context.translate(this.stage2d.translateX, this.stage2d.translateY)

        // console.log("this.scale", this.scale);
		this.context.scale(this.stage2d.scale, this.stage2d.scale)

        //需要重复绘制的内容
        callback(this.context)


        this.context.restore();
    }

    static init (stage2d, index) {

        //创建 Canvas，并添加到场景
        const canvas = document.createElement('canvas')
        canvas.width = stage2d.width
        canvas.height = stage2d.height
        canvas.style.position = 'absolute'

        stage2d.container.appendChild(canvas)

        return new Scene(stage2d, canvas)
    }
}
