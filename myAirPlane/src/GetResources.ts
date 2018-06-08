/*
* name;
*/
import Label = Laya.Label;
import Handler = Laya.Handler;
import Button = Laya.Button;
import Images = Laya.Image;
class GetResources{
    constructor(fun:Function){
        this.initWorld();
        this.starFun = fun;
    }
    private starFun:Function;
    private starLb:Label;
    private progress1:Laya.ProgressBar;
    private bigUI:string = "unpack.json";//大图
    private sources:string = "dataConfig.json";//图集
    private progressSource:string = "res/atlas/comp/common.atlas";
    private initWorld():void{
        this.starLb = new Label("游戏启动中。。。。");
        Laya.stage.addChild(this.starLb);
        this.starLb.color = "#ffffff";
        Laya.stage.on(Laya.Event.RESIZE,this,this.resizeWidth);
        this.resizeWidth();
        //加载进度条
        Laya.loader.load(this.progressSource,Handler.create(this,this.firstLoaded));
    }
    private firstLoaded():void{
        this.progress1 = new Laya.ProgressBar(PathManager.compentPath("progress"));
        var stageW:number = Laya.stage.width;
        var stageH:number = Laya.stage.height;
        this.progress1.width = stageW - 100;
        this.progress1.height = 8;
        this.progress1.sizeGrid = "4,4,4,4";
        this.progress1.pos((stageW-this.progress1.width)/2,(stageH-this.progress1.height)/2 + this.starLb.height + 5);
        Laya.stage.addChild(this.progress1);
        
        Laya.loader.load([{
            url:this.sources,
            type:Laya.Loader.JSON
        },{
            url:this.bigUI,
            type:Laya.Loader.JSON
        }], Handler.create(this, this.onLoadedSources),Handler.create(this,this.progreChang));
    }
    /**加载全部资源 */
    private onLoadedSources():void{
        this.starLb.changeText("资源加载中。。。。");
        var arr2d:any = Laya.loader.getRes(this.sources);
        Laya.loader.load(arr2d,Handler.create(this,this.onLoadBigUI),Handler.create(this,this.progreChang));
    }
    private onLoadBigUI():void{
        this.starLb.changeText("背景加载中。。。。");
        var bigui:Array<string> = Laya.loader.getRes(this.bigUI);
        Laya.loader.load(bigui, Handler.create(this, this.onLoadSuccess),Handler.create(this,this.progreChang));
    }
    private onLoadSuccess():void{
        this.starLb.changeText("加载完成！");
        Laya.timer.once(1000,this,()=>{
            this.starLb.removeSelf();
            this.progress1.removeSelf();
            this.starLb = null;
            this.progress1 = null;
            this.starFun();
        })
    }
    /**重置位置 */
    private resizeWidth():void{
        if(this.starLb){
            var stageW:number = Laya.stage.width;
            var stageH:number = Laya.stage.height;
            this.starLb.pos((stageW-this.starLb.width)/2,(stageH-this.starLb.height)/2);
        }else{
            Laya.stage.off(Laya.Event.RESIZE,this,()=>{});
        }
    }
    /**进度条 */
    private progreChang(value:number):void{
        this.progress1.value = value;
    }
}