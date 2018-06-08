/*
* 形状、颜色、生命值、攻击方式;
*/
import Sprite = Laya.Sprite;
class AirPlane extends Sprite{
    constructor(){
        super();
    }
    protected setShape(type:number = 0,color:string = "#00ff00"):void{
        this.graphics.clear();//再次调用被清理
        switch(Number(type)){
            case EnemyAir.SHAPE_0://三角形
                this.graphics.drawPoly(0, 0, [0, 0, 50, 100, 100, 0], color);
                this.width = this.height = 100;
                break;
            case EnemyAir.SHAPE_3://五角星
                var path: Array<number> = [];
                path.push(137, 260);//五角星A点坐标
                path.push(170, 163);//五角星B点坐标
                path.push(274, 163);//五角星C点坐标
                path.push(192, 101);//五角星D点坐标
                path.push(222, 0);//五角星E点坐标
                path.push(137, 57);//五角星F点坐标
                path.push(52, 0);//五角星G点坐标
                path.push(82, 101);//五角星H点坐标
                path.push(0, 163);//五角星I点坐标
                path.push(104, 163);//五角星J点坐标
                this.graphics.drawPoly(0, 0, path, color);
                this.width = 274;
                this.height = 260;
                break;
            case EnemyAir.SHAPE_2://不规则弧形
                var path1:any[] =  [
                    ["moveTo", 0, 0], //画笔的起始点，
                    ["arcTo", 50, 0, 50, 5, 10], //p1（500,0）为夹角B，（500,30）为端点p2
                    ["arcTo", 50, 30, 47, 30, 10],//p1（500,300）为夹角C，（470,300）为端点p2
                    ["arcTo", 0, 30, 0, 27, 10], //p1(0,300)为夹角D，（0,270）为端点p2
                    ["arcTo", 0, 0, 30, 0, 10],//p1(0,0)为夹角A，（30,0）为端点p2
                ];
                this.graphics.drawPath(0, 0, path1, {fillStyle:color});
                this.width = 50
                this.height = 30;
                break;
            case EnemyAir.SHAPE_1://扇形
                this.graphics.drawPie(Math.abs(Math.sin(45)*50), 50, 50, 225, 315, color);
                this.width = Math.abs(Math.sin(45)*50)*2;
                this.height = 50;
                break;
            case EnemyAir.SHAPE_4://五边形 boss
                this.graphics.drawPoly(0, 0, [0, 50, 50, 150, 100, 50, 75, 0, 25, 0], color);
                this.width = 100;
                this.height = 150;
                break;
            case PlayerAir.UP_SHAPE_0://三角形 Player
                this.graphics.drawPoly(0, 0, [0, 100, 50, 0, 100, 100], color);
                this.width = this.height = 100;
                break;
            case PlayerAir.UP_SHAPE_1://五边形 Player
                this.graphics.drawPoly(0, 0, [0, 100, 50, 0, 100, 100, 75, 150, 25, 150], color);
                this.width = 100;
                this.height = 150;
                break;
        }
    }
}