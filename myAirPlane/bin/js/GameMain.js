// 程序入口
var GameMain = (function () {
    function GameMain() {
        this.setWidth = 500;
        this.setHeight = window.innerHeight;
        GameWorld.initWorld(this.setWidth, this.setHeight);
        Laya.stage.alignH = Laya.Stage.ALIGN_CENTER; //水平居中
        Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE; //垂直居中
        Laya.stage.screenMode = Laya.Stage.SCREEN_VERTICAL;
        Laya.Stat.show();
    }
    return GameMain;
}());
new GameMain();
//# sourceMappingURL=GameMain.js.map