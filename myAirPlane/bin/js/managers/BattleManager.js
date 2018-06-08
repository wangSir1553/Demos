/*
* 配置数据;
*/
var BattleManager = (function () {
    function BattleManager() {
    }
    return BattleManager;
}());
/**player 基础生命 */
BattleManager.PLAYER_HP = 100;
/**子弹发射偏移位置表*/
BattleManager.BULLETPOS = [[0], [-15, 15], [-30, 0, 30], [-45, -15, 15, 45], [-45, -15, 15, 45], [-45, -15, 15, 45], [-45, -15, 15, 45], [-45, -15, 15, 45]];
/**Player战机信息
 * 生命、速度、颜色
*/
BattleManager.PLAYER_PLANE = [[10, -10, "#949cba"], [20, -20, "#71da08"], [30, -20, "#f8322f"], [40, -20, "#f8a22f"], [50, -30, "#f8j22f"], [60, -30, "#f8382f"], [70, -30, "#f83l2f"], [80, -40, "#f83m2f"], [90, -40, "#f83y2f"], [100, -50, "#f8822f"]];
//# sourceMappingURL=BattleManager.js.map