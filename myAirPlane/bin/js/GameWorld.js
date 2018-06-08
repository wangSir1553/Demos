/*
* name;
*/
var GameWorld = (function () {
    function GameWorld() {
    }
    GameWorld.initWorld = function (stageW, stageH) {
        var _this = this;
        Laya.init(stageW, stageH, true);
        new GetResources(function () {
            _this.gamaStar();
        }); //加载资源
    };
    GameWorld.gamaStar = function () {
        //初始化开始按钮
        var btnUrl = PathManager.compentPath("btn_star");
        var starBtn = new Button(btnUrl);
        new UIManager(this.mapId, starBtn);
    };
    return GameWorld;
}());
GameWorld.mapId = 0;
//# sourceMappingURL=GameWorld.js.map