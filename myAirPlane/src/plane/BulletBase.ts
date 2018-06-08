/*
* name;
*/
class BulletBase extends Laya.Sprite{
    public static BULLET_DOWN:number = 0;
    public static BULLET_UP:number = 1;
    public camp:number = -1;
    public speed:number = 0;
    public readonly hp:number = 1;
    constructor(){
        super();
        this.width = 10;
        this.height = 20;
    }
    public setBulletShape(type:number,camp:number,speed:number,color:string = "#ff0000"):void{
        this.camp = camp;
        this.speed = speed;
        this.graphics.clear();//再次调用被清理
        switch(type){
            case BulletBase.BULLET_DOWN://向下
                this.graphics.drawPoly(0,0,[0,10,5,20,10,10,10,0,0,0],color);
                break;
            case BulletBase.BULLET_UP://向上
                this.graphics.drawPoly(0,0,[0,10,5,0,10,10,10,20,0,20],color);
                break;
        }
    }
}