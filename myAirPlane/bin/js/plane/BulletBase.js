var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
* name;
*/
var BulletBase = (function (_super) {
    __extends(BulletBase, _super);
    function BulletBase() {
        var _this = _super.call(this) || this;
        _this.camp = -1;
        _this.speed = 0;
        _this.hp = 1;
        _this.width = 10;
        _this.height = 20;
        return _this;
    }
    BulletBase.prototype.setBulletShape = function (type, camp, speed, color) {
        if (color === void 0) { color = "#ff0000"; }
        this.camp = camp;
        this.speed = speed;
        this.graphics.clear(); //再次调用被清理
        switch (type) {
            case BulletBase.BULLET_DOWN:
                this.graphics.drawPoly(0, 0, [0, 10, 5, 20, 10, 10, 10, 0, 0, 0], color);
                break;
            case BulletBase.BULLET_UP:
                this.graphics.drawPoly(0, 0, [0, 10, 5, 0, 10, 10, 10, 20, 0, 20], color);
                break;
        }
    };
    return BulletBase;
}(Laya.Sprite));
BulletBase.BULLET_DOWN = 0;
BulletBase.BULLET_UP = 1;
//# sourceMappingURL=BulletBase.js.map