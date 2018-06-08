/*
* name;
*/
class EnemyAir extends AirPlane{
    public static readonly SHAPE_0:number = 0;
    public static readonly SHAPE_1:number = 1;
    public static readonly SHAPE_2:number = 2;
    public static readonly SHAPE_3:number = 3;
    public static readonly SHAPE_4:number = 4;
    public readonly camp:number = 0;
    //射击类型
    public shootType: number = 0;
    //射击间隔
    public shootInterval: number = 1000;
     //血量
    public hp: number = 100;
    //飞行速度
    public speed: number;
    //下次射击时间
    public shootTime: number = Laya.Browser.now() + 1000;
    public score:number = 10;
    constructor(){
        super();
    }
    public setInfo(type:number,shootType:number,msg:Array<any>):void{
        this.shootType = shootType;
        this.hp = msg[0];
        this.speed = msg[1];
        this.setShape(type,msg[2]);
        this.score = msg[3];
    }
}