// 程序入口
class GameMain{
    private setWidth:number = 500;
    private setHeight:number = window.innerHeight;
    constructor(){
        GameWorld.initWorld(this.setWidth,this.setHeight);
        Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;//水平居中
        Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE;//垂直居中
        Laya.stage.screenMode = Laya.Stage.SCREEN_VERTICAL;
        Laya.Stat.show()
    }
}
new GameMain();