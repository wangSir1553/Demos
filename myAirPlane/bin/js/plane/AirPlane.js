var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
* 形状、颜色、生命值、攻击方式;
*/
var Sprite = Laya.Sprite;
var AirPlane = (function (_super) {
    __extends(AirPlane, _super);
    function AirPlane() {
        return _super.call(this) || this;
    }
    AirPlane.prototype.setShape = function (type, color) {
        if (type === void 0) { type = 0; }
        if (color === void 0) { color = "#00ff00"; }
        this.graphics.clear(); //再次调用被清理
        switch (Number(type)) {
            case EnemyAir.SHAPE_0:
                this.graphics.drawPoly(0, 0, [0, 0, 50, 100, 100, 0], color);
                this.width = this.height = 100;
                break;
            case EnemyAir.SHAPE_3:
                var path = [];
                path.push(137, 260); //五角星A点坐标
                path.push(170, 163); //五角星B点坐标
                path.push(274, 163); //五角星C点坐标
                path.push(192, 101); //五角星D点坐标
                path.push(222, 0); //五角星E点坐标
                path.push(137, 57); //五角星F点坐标
                path.push(52, 0); //五角星G点坐标
                path.push(82, 101); //五角星H点坐标
                path.push(0, 163); //五角星I点坐标
                path.push(104, 163); //五角星J点坐标
                this.graphics.drawPoly(0, 0, path, color);
                this.width = 274;
                this.height = 260;
                break;
            case EnemyAir.SHAPE_2:
                var path1 = [
                    ["moveTo", 0, 0],
                    ["arcTo", 50, 0, 50, 5, 10],
                    ["arcTo", 50, 30, 47, 30, 10],
                    ["arcTo", 0, 30, 0, 27, 10],
                    ["arcTo", 0, 0, 30, 0, 10],
                ];
                this.graphics.drawPath(0, 0, path1, { fillStyle: color });
                this.width = 50;
                this.height = 30;
                break;
            case EnemyAir.SHAPE_1:
                this.graphics.drawPie(Math.abs(Math.sin(45) * 50), 50, 50, 225, 315, color);
                this.width = Math.abs(Math.sin(45) * 50) * 2;
                this.height = 50;
                break;
            case EnemyAir.SHAPE_4:
                this.graphics.drawPoly(0, 0, [0, 50, 50, 150, 100, 50, 75, 0, 25, 0], color);
                this.width = 100;
                this.height = 150;
                break;
            case PlayerAir.UP_SHAPE_0:
                this.graphics.drawPoly(0, 0, [0, 100, 50, 0, 100, 100], color);
                this.width = this.height = 100;
                break;
            case PlayerAir.UP_SHAPE_1:
                this.graphics.drawPoly(0, 0, [0, 100, 50, 0, 100, 100, 75, 150, 25, 150], color);
                this.width = 100;
                this.height = 150;
                break;
        }
    };
    return AirPlane;
}(Sprite));
//# sourceMappingURL=AirPlane.js.map