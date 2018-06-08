/*
* name;
*/
class PlayerAir extends AirPlane{
    public static readonly UP_SHAPE_0:number = 5;
    public static readonly UP_SHAPE_1:number = 6;
    public readonly camp:number = 1;
    //射击类型
    public shootType: number = 0;
    //射击间隔
    public shootInterval: number = 400;
     //血量
    public hp: number = 100;
    //飞行速度
    public speed: number;
    //下次射击时间
    public shootTime: number = Laya.Browser.now() + 100;
    constructor(){
        super();
    }
    public setInfo(type:number,shootType:number,msg:Array<any>):void{
        this.shootType = shootType;
        this.hp = msg[0];
        this.speed = msg[1];
        if(!type)type = PlayerAir.UP_SHAPE_1;
        this.setShape(type,msg[2]);
    }
}