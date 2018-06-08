/*
* 场景、开始键、结束、分数;
*/
import ColorFilter = Laya.ColorFilter;
import Box = Laya.Box;
class UIManager{
    private mapid:number;//初始map
    private starBtn:Button;
    private map1:Images;
    private map2:Images;
    private scores:number = 0;//分数
    private baseBox:Box;//顶部box
    private player:PlayerAir;
    private level:number = 0;
    private gameStage:Sprite;
    private enemyArr:Array<EnemyAir> = [];
    private bulletArr:Array<BulletBase> = [];
    private showTxt:Label;
    //升级等级所需的成绩数量
    private levelUpScore: number = 100;
    private redFilter: ColorFilter;
    constructor(mapId:number,starBtn:Button){
        var stageW:number = Laya.stage.width;
        var stageH:number = Laya.stage.height;
        //初始化地图
        this.mapid = mapId;
        this.map1 = new Images();
        this.map2 = new Images();
        this.map1.width = this.map2.width = Laya.stage.width;
        this.map1.height = this.map2.height = Laya.stage.height;
        this.map2.y = -Laya.stage.height;
        this.setMapMsg(mapId);
        Laya.stage.addChild(this.map1);
        Laya.stage.addChild(this.map2);
        //初始化战斗场景
        this.gameStage = new Sprite();
        this.gameStage.width = stageW;
        this.gameStage.height = stageH;
        Laya.stage.addChild(this.gameStage);
        //初始化开始按钮
        this.starBtn = starBtn;
        this.starBtn.stateNum = 2;
        this.starBtn.scale(0.5,0.5,true);
        this.starBtn.pos((stageW - this.starBtn.width*0.5)/2,(stageH - this.starBtn.height*0.5)/2);
        this.starBtn.on(Laya.Event.CLICK,this,this.startGame);
        Laya.stage.addChild(this.starBtn);
        //头部基础信息
        this.setBaseMsg();
        //初始化英雄
        this.player = new PlayerAir();
        this.gameStage.addChild(this.player);
        this.player.visible = false;
        this.player.on(Laya.Event.MOUSE_DOWN,this,(e:Laya.Event)=>{
            e.stopPropagation();
            this.player.startDrag();//拖动飞机
        });
        //显示、提示用的label
        if(!this.showTxt)this.showTxt = new Label("速度快我卡上");
        this.showTxt.fontSize = 22;
        this.showTxt.color = "#ff0000";
        this.showTxt.width = stageW - 100;
        this.showTxt.align = "center";
        this.showTxt.pos((stageW-this.showTxt.width)/2,(stageH - this.showTxt.height)/2);
        Laya.stage.addChild(this.showTxt);
        this.showTxt.visible = false;
        this.showTxt.leading = 5;
        //初始化 滤镜
        var redMat: Array<number> =
        [
            1, 0, 0, 0, 0, //R
            1, 0, 0, 0, 0, //G
            1, 0, 0, 0, 0, //B
            0, 0, 0, 0, 0, //A
        ];
        //创建一个颜色滤镜对象,红色
        this.redFilter = new ColorFilter(redMat);
    }
    private startGame():void{
        this.resetAllVar();
        //为Player设值
        this.updatePlayer(0);
        this.player.pos((Laya.stage.width-this.player.width)/2,Laya.stage.height - this.player.height - 10);
        this.baseBox.visible = this.player.visible = true;
        this.starBtn.visible = false;
        //初始化场景
        for(let i =0; i < this.baseBox.numChildren - 1;i++){
            this.resetBaseMsg(i);
        }
        Laya.timer.frameLoop(0.5,this,this.gameStartting);
    }
    private updatePlayer(lv:number):void{
        console.log("现在等级：",lv)
        this.player.setInfo(PlayerAir[`UP_SHAPE_${lv}`],lv+1,BattleManager.PLAYER_PLANE[lv]);
    }
    /**游戏中 */
    private gameStartting():void{
        this.mapMoving();//地图移动
        this.handlerBullets(this.player);//主机装弹
        //==============================创建敌机=============================
        //关卡越高，创建敌机间隔越短
        var cutTime: number = this.level < 30 ? this.level * 1 : 60;
        //关卡越高，敌机飞行速度越高
        var speedUp: number = Math.floor(this.level / 6);
        //关卡越高，敌机血量越高
        var hpUp: number = Math.floor(this.level / 8);
        //关卡越高，敌机数量越多
        var numUp: number = Math.floor(this.level / 10);

        //生成小飞机
        if (Laya.timer.currFrame % (80 - cutTime) === 0) {
            this.createEnemy(EnemyAir[`SHAPE_${Math.floor(Math.random()*3)}`], 1, 4 + speedUp, 1,10);
            // this.createEnemy(EnemyAir.SHAPE_1, 1, 4 + speedUp, 1,10); // 测试
        }

        //生成中型飞机
        if (Laya.timer.currFrame % (150 - cutTime * 2) === 0) {
            this.createEnemy(EnemyAir.SHAPE_3, 1 + numUp, 3 + speedUp, 2 + hpUp * 2,50);
        }

        //生成boss
        if (Laya.timer.currFrame % (900 - cutTime * 4) === 0) {
            this.createEnemy(EnemyAir.SHAPE_4, 1, 1 + speedUp, 10 + hpUp * 5,100);
            //播放boss出场声音
            Laya.SoundManager.playSound(PathManager.getSoundPath("enemy3_out"));
        }
        //子弹移动
        for(let i = 0; i < this.bulletArr.length;i++){
            this.bulletMove(this.bulletArr[i],()=>{
                this.bulletArr.splice(i,1);
                i--;
            });
        }
        //敌机移动
        for(let j = 0;j < this.enemyArr.length; j++){
            this.handlerBullets(this.enemyArr[j]);//敌机子弹
            this.bulletMove(this.enemyArr[j],()=>{
                this.enemyArr.splice(j,1);
                j--;
            });
        }
        this.collisionCheck();//碰撞检测
    }
    /**碰撞 */
    private collisionCheck():void{
        for(let i=0;i<this.bulletArr.length;i++){
            var bullet:BulletBase = this.bulletArr[i];
            if(!bullet.visible)continue;
            var point:Laya.Point = bullet.localToGlobal(new Laya.Point(0,0));
            if(bullet.camp != this.player.camp){//主机中弹
                if(this.player.hitTestPoint(point.x+bullet.width/2,point.y + bullet.height)){
                    this.lostHp(bullet);
                    this.lostHp(this.player);
                }
            }else{
                for(let j = 0;j<this.enemyArr.length;j++){
                    var enemy:EnemyAir = this.enemyArr[j];
                    if(!enemy.visible)continue;
                    if(enemy.hitTestPoint(point.x+bullet.width/2,point.y)){//敌机中弹
                        this.lostHp(bullet);
                        this.lostHp(enemy);
                    } 
                    var hitAirX:number = Math.abs(this.player.x - enemy.x) - enemy.width;
                    var hitAirY:number = Math.abs(this.player.y - enemy.y) - enemy.height;
                    if(hitAirX < -5 && hitAirY < -5){//主机与敌机碰撞
                        this.lostHp(this.player);
                        this.lostHp(enemy);
                    }
                }
            }
        }
    }
    /**掉血处理 */
    private lostHp(sp:any):void{
        sp.hp -= 1;
        if(sp.hp<=0){//对象死亡操作
            sp.visible = false;
            if(sp instanceof PlayerAir && sp.camp == this.player.camp){//主机死亡时
                Laya.timer.clear(this, this.gameStartting);
                this.gameStage.mouseEnabled = false;
                this.showTxt.color = "#ff0000";
                this.showTxt.text = `GameOver，本次得分：${this.scores} \n点我重新开始`;
                this.showTxt.visible = true;
                this.showTxt.once(Laya.Event.CLICK,this,this.resetGame);
                this.resetBaseMsg(0);
                Laya.SoundManager.playSound(PathManager.getSoundPath("game_over"));
            }
            if(sp instanceof EnemyAir){
                this.scores += sp.score;
                this.resetBaseMsg(1);
                if(this.scores > this.levelUpScore){//升级处理
                    this.level += 1;
                    this.levelUpScore *= (this.level+1);
                    this.updatePlayer(this.level);//更新主机
                    Laya.SoundManager.playSound(PathManager.getSoundPath("achievement"));
                    this.setMapMsg(this.level);
                }
            }
        }else{
            if(sp instanceof PlayerAir){
                this.resetBaseMsg(0);
                sp.filters = [this.redFilter];
                Laya.timer.frameOnce(5,null,()=>{
                    sp.filters = null;
                })
            }
        }
    }
    /**重启游戏 */
    private resetGame(evt:Laya.Event):void{
        evt.stopPropagation();
        this.showTxt.text = "";
        this.showTxt.visible = false;
        this.gameStage.visible = false;
        this.starBtn.visible = true;
        this.baseBox.visible = false;
        this.setMapMsg(this.mapid);
    }
    /**创建子弹 */
    private handlerBullets(role:any):void{
        if(!role.visible)return;
        //处理发射子弹逻辑
        if (role.shootType > 0) {
            //获取当前时间
            var time: number = Laya.Browser.now();
            //如果当前时间大于下次射击时间
            if (time > role.shootTime) {
                //更新下次射击时间
                role.shootTime = time + role.shootInterval;

                //根据不同子弹类型，设置不同的数量及位置
                if(role.shootType >=　BattleManager.BULLETPOS.length)return;
                var pos: Array<number> = BattleManager.BULLETPOS[role.shootType - 1];
                for (var index: number = 0; index < pos.length; index++) {
                    //从对象池里面创建一个子弹
                    var bullet: BulletBase = Laya.Pool.getItemByClass("bullet", BulletBase);
                    //初始化子弹信息，根据不同子弹类型，设置不同的飞行速度
                    //设置子弹发射初始化位置
                    var posX:number;
                    var posY:number;
                    var state:number;
                    if(role.camp){
                        posX = role.x +(role.width - bullet.width)/2+ pos[index];
                        posY = role.y - bullet.height;
                        state = BulletBase.BULLET_UP;
                    }else{
                        posX = role.x +(role.width - bullet.width)/2;
                        posY = role.y + role.height + bullet.height;
                        state = BulletBase.BULLET_DOWN;
                    }
                    bullet.setBulletShape(state,role.camp,role.speed + 5);
                    bullet.pos(posX, posY);
                    //添加到舞台上
                    this.gameStage.addChild(bullet);
                    this.bulletArr.push(bullet);
                }
                //增加发射子弹声音
                if(role.camp)
                    Laya.SoundManager.playSound(PathManager.getSoundPath("bullet"));
            }
        }
    }
    /**创建敌机 */
    private createEnemy(type: number, num: number, speed: number, hp: number,score:number): void {
        for (var i: number = 0; i < num; i++) {
            //创建敌人，从对象池创建
            var enemy: EnemyAir = Laya.Pool.getItemByClass("enemy", EnemyAir);
            //初始化角色
            enemy.setInfo(type, 1,[hp, speed, this.randomHexColor(),score]);
            //随机位置
            enemy.pos(Math.random() * (Laya.stage.width - enemy.width), -Math.random() * 200 - 100);
            this.gameStage.addChild(enemy); 
            this.enemyArr.push(enemy);
        }
    }
    /**暂停 */
    private stopGame(e:Laya.Event):void{
        e.stopPropagation();
        Laya.timer.clear(this, this.gameStartting);
        this.gameStage.mouseEnabled = false;
        this.showTxt.color = "#00ff00";
        this.showTxt.changeText("游戏已暂停，任意地方恢复游戏");
        this.showTxt.visible = true;
        Laya.stage.once(Laya.Event.CLICK, this, this.onStageClick);
    }
    /**暂停之后的恢复 */
    private onStageClick(e: Laya.Event): void {
        e.stopPropagation();
        this.showTxt.text = "";
        Laya.timer.frameLoop(0.5,this,this.gameStartting);
        this.gameStage.mouseEnabled = true;
        this.showTxt.visible = false;
    }
    //重置基础信息
    private resetBaseMsg(index:number):void{
        var str:string = "";
        switch(index){
            case 0://生命
                str = `生命：${this.player.hp}`;
                break;
            case 1://得分
                str = `得分：${this.scores}`;
                break;
        }
        (this.baseBox.getChildAt(index) as Label).changeText(str);
    }
    //初始化基础信息
    private setBaseMsg():void{
        if(!this.baseBox)this.baseBox = new Box();
        var hpLabel:Label = new Label(`生命：0`);
        var scoreLb:Label = new Label(`得分：0`);
        this.baseBox.addChild(hpLabel);
        this.baseBox.addChild(scoreLb);
        scoreLb.color = "#fff000"
        hpLabel.color = "#00ff00";
        scoreLb.fontSize = hpLabel.fontSize = 20;
        hpLabel.x = 10;
        hpLabel.y = 10;
        scoreLb.x = (Laya.stage.width - scoreLb.width)/2;
        scoreLb.y = 10;
        var stopBtn:Button = new Button(PathManager.compentPath("btn_pause"));
        this.baseBox.addChild(stopBtn);
        stopBtn.stateNum = 1;
        stopBtn.x = Laya.stage.width - stopBtn.width - 10;
        stopBtn.on(Laya.Event.CLICK,this,this.stopGame);//暂停游戏
        Laya.stage.addChild(this.baseBox);
        this.baseBox.visible = false;
    }
    /**获取随机颜色 */
    private randomHexColor():string { //随机生成十六进制颜色
         var hex = Math.floor(Math.random() * 16777216).toString(16); //生成ffffff以内16进制数
         while (hex.length < 6) { //while循环判断hex位数，少于6位前面加0凑够6位
          hex = '0' + hex;
         }
         return '#' + hex; //返回‘#'开头16进制颜色
    }
    /**敌机、子弹的移动 */
    private bulletMove(role:any,split:Function):void{
        var str:string;
        if (role && role.speed) {
            //根据飞机速度更改位置
            role.y += role.speed;
            //如果敌人移动到显示区域以外，则移除
            if (role.y > (Laya.stage.height + role.height) || !role.visible || role.y < -role.height) {
                if(role.shootType >= 0){//敌机
                    if(!(role.y > (Laya.stage.height + role.height))){
                        return;
                    }
                }
                //从舞台移除
                role.removeSelf();
                //回收之前，重置属性信息
                role.visible = true;
                //回收到对象池
                if(role instanceof EnemyAir)
                    str = "enemy";
                else 
                    str = "bullet";
                Laya.Pool.recover(str, role);
                split();
            }
        }
    }
    /**重置所有属性以及变量 */
    private resetAllVar():void{
        this.gameStage.mouseEnabled = true;
        this.gameStage.visible = true;
        var str:string;
        for(let i = 0; i < this.gameStage.numChildren; i++){
            var item:any = this.gameStage.getChildAt(i);
            if(!(item instanceof PlayerAir)){
                item.removeSelf();
                if(item instanceof BulletBase)str = "bullet";
                else str = "enemy";
                Laya.Pool.recover(str, item);
                i--;
            }
        }
        this.bulletArr = [];
        this.enemyArr = [];
        this.scores = 0;
        this.level = 0;
        this.levelUpScore = 100;
    }
    /**控制地图的移动 */
    private mapMoving():void{
        var map:Images;
        for(let i = 1; i < 3;i++){
            map = this[`map${i}`];
            map.y += 3;
            if(map.y > Laya.stage.height){
                map.y = -Laya.stage.height;
            }
        }
    }
    private setMapMsg(mapId:number):void{
        var mapUrl:string = PathManager.getMapByid(mapId);
        this.map1.skin = mapUrl;
        this.map2.skin = mapUrl;
    }
}