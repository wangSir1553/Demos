/*
* name;
*/
var PathManager = (function () {
    function PathManager() {
    }
    PathManager.compentPath = function (str) {
        return "" + this._compentPath + str + ".png";
    };
    /**获取场景 */
    PathManager.getMapByid = function (id) {
        return this._mapStr + "map_" + id + ".png";
    };
    PathManager.getSoundPath = function (name) {
        return "" + this._sound + name + ".mp3";
    };
    return PathManager;
}());
PathManager._compentPath = "comp/common/";
PathManager._mapStr = "comp/map/";
PathManager._sound = "res/sound/";
//# sourceMappingURL=PathManager.js.map