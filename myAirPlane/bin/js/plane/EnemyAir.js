var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
* name;
*/
var EnemyAir = (function (_super) {
    __extends(EnemyAir, _super);
    function EnemyAir() {
        var _this = _super.call(this) || this;
        _this.camp = 0;
        //射击类型
        _this.shootType = 0;
        //射击间隔
        _this.shootInterval = 1000;
        //血量
        _this.hp = 100;
        //下次射击时间
        _this.shootTime = Laya.Browser.now() + 1000;
        _this.score = 10;
        return _this;
    }
    EnemyAir.prototype.setInfo = function (type, shootType, msg) {
        this.shootType = shootType;
        this.hp = msg[0];
        this.speed = msg[1];
        this.setShape(type, msg[2]);
        this.score = msg[3];
    };
    return EnemyAir;
}(AirPlane));
EnemyAir.SHAPE_0 = 0;
EnemyAir.SHAPE_1 = 1;
EnemyAir.SHAPE_2 = 2;
EnemyAir.SHAPE_3 = 3;
EnemyAir.SHAPE_4 = 4;
//# sourceMappingURL=EnemyAir.js.map