/*
* name;
*/
var Label = Laya.Label;
var Handler = Laya.Handler;
var Button = Laya.Button;
var Images = Laya.Image;
var GetResources = (function () {
    function GetResources(fun) {
        this.bigUI = "unpack.json"; //大图
        this.sources = "dataConfig.json"; //图集
        this.progressSource = "res/atlas/comp/common.atlas";
        this.initWorld();
        this.starFun = fun;
    }
    GetResources.prototype.initWorld = function () {
        this.starLb = new Label("游戏启动中。。。。");
        Laya.stage.addChild(this.starLb);
        this.starLb.color = "#ffffff";
        Laya.stage.on(Laya.Event.RESIZE, this, this.resizeWidth);
        this.resizeWidth();
        //加载进度条
        Laya.loader.load(this.progressSource, Handler.create(this, this.firstLoaded));
    };
    GetResources.prototype.firstLoaded = function () {
        this.progress1 = new Laya.ProgressBar(PathManager.compentPath("progress"));
        var stageW = Laya.stage.width;
        var stageH = Laya.stage.height;
        this.progress1.width = stageW - 100;
        this.progress1.height = 8;
        this.progress1.sizeGrid = "4,4,4,4";
        this.progress1.pos((stageW - this.progress1.width) / 2, (stageH - this.progress1.height) / 2 + this.starLb.height + 5);
        Laya.stage.addChild(this.progress1);
        Laya.loader.load([{
                url: this.sources,
                type: Laya.Loader.JSON
            }, {
                url: this.bigUI,
                type: Laya.Loader.JSON
            }], Handler.create(this, this.onLoadedSources), Handler.create(this, this.progreChang));
    };
    /**加载全部资源 */
    GetResources.prototype.onLoadedSources = function () {
        this.starLb.changeText("资源加载中。。。。");
        var arr2d = Laya.loader.getRes(this.sources);
        Laya.loader.load(arr2d, Handler.create(this, this.onLoadBigUI), Handler.create(this, this.progreChang));
    };
    GetResources.prototype.onLoadBigUI = function () {
        this.starLb.changeText("背景加载中。。。。");
        var bigui = Laya.loader.getRes(this.bigUI);
        Laya.loader.load(bigui, Handler.create(this, this.onLoadSuccess), Handler.create(this, this.progreChang));
    };
    GetResources.prototype.onLoadSuccess = function () {
        var _this = this;
        this.starLb.changeText("加载完成！");
        Laya.timer.once(1000, this, function () {
            _this.starLb.removeSelf();
            _this.progress1.removeSelf();
            _this.starLb = null;
            _this.progress1 = null;
            _this.starFun();
        });
    };
    /**重置位置 */
    GetResources.prototype.resizeWidth = function () {
        if (this.starLb) {
            var stageW = Laya.stage.width;
            var stageH = Laya.stage.height;
            this.starLb.pos((stageW - this.starLb.width) / 2, (stageH - this.starLb.height) / 2);
        }
        else {
            Laya.stage.off(Laya.Event.RESIZE, this, function () { });
        }
    };
    /**进度条 */
    GetResources.prototype.progreChang = function (value) {
        this.progress1.value = value;
    };
    return GetResources;
}());
//# sourceMappingURL=GetResources.js.map