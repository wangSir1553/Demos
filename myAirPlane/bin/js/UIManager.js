/*
* 场景、开始键、结束、分数;
*/
var UIManager = (function () {
    function UIManager(mapId, starBtn) {
        var stageW = Laya.stage.width;
        var stageH = Laya.stage.height;
        this.mapID = mapId;
        this.starBtn = starBtn;
        this.starBtn.stateNum = 2;
        var mapUrl = PathManager.getMapByid(mapId);
        this.map = new Images(mapUrl);
        Laya.stage.addChild(this.map);
        this.map.width = stageW;
        this.map.height = stageH;
        Laya.stage.addChild(this.starBtn);
        this.starBtn.pos((stageW - this.starBtn.width) / 2, (stageH - this.starBtn.height) / 2);
    }
    return UIManager;
}());
//# sourceMappingURL=UIManager.js.map