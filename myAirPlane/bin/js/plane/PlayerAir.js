var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
* name;
*/
var PlayerAir = (function (_super) {
    __extends(PlayerAir, _super);
    function PlayerAir() {
        var _this = _super.call(this) || this;
        _this.camp = 1;
        //射击类型
        _this.shootType = 0;
        //射击间隔
        _this.shootInterval = 400;
        //血量
        _this.hp = 100;
        //下次射击时间
        _this.shootTime = Laya.Browser.now() + 100;
        return _this;
    }
    PlayerAir.prototype.setInfo = function (type, shootType, msg) {
        this.shootType = shootType;
        this.hp = msg[0];
        this.speed = msg[1];
        if (!type)
            type = PlayerAir.UP_SHAPE_1;
        this.setShape(type, msg[2]);
    };
    return PlayerAir;
}(AirPlane));
PlayerAir.UP_SHAPE_0 = 5;
PlayerAir.UP_SHAPE_1 = 6;
//# sourceMappingURL=PlayerAir.js.map