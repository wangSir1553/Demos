/*
* name;
*/
class GameWorld{
    private static mapId:number = 0;
    public static initWorld(stageW:number,stageH:number):void{
        Laya.init(stageW,stageH,true);
        new GetResources(()=>{
            this.gamaStar();
        });//加载资源
    }
    private static gamaStar():void{
        //初始化开始按钮
        var btnUrl:string = PathManager.compentPath("btn_star");
        var starBtn:Button = new Button(btnUrl);
        new UIManager(this.mapId,starBtn);
    }
}