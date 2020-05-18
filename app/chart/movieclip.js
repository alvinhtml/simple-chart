//影片剪辑
export default class Movieclip {
    constructor (pattern) {


        this.id = undefined

        //动画类名称
        this.name = ''

        //动画的填充图案
        this.pattern = pattern

        //动画类的X坐标
		this.x = 0;

		//动画类的Y坐标
		this.y = 0;

		//动画实际宽度
		this.width = 0;

		//动画实际高度
		this.height = 0;

    }
}
