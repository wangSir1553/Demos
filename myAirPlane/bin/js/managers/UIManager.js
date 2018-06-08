/*
* 场景、开始键、结束、分数;
*/
var ColorFilter = Laya.ColorFilter;
var Box = Laya.Box;
var UIManager = (function () {
    function UIManager(mapId, starBtn) {
        var _this = this;
        this.scores = 0; //分数
        this.level = 0;
        this.enemyArr = [];
        this.bulletArr = [];
        //升级等级所需的成绩数量
        this.levelUpScore = 100;
        var stageW = Laya.stage.width;
        var stageH = Laya.stage.height;
        //初始化地图
        this.mapid = mapId;
        this.map1 = new Images();
        this.map2 = new Images();
        this.map1.width = this.map2.width = Laya.stage.width;
        this.map1.height = this.map2.height = Laya.stage.height;
        this.map2.y = -Laya.stage.height;
        this.setMapMsg(mapId);
        Laya.stage.addChild(this.map1);
        Laya.stage.addChild(this.map2);
        //初始化战斗场景
        this.gameStage = new Sprite();
        this.gameStage.width = stageW;
        this.gameStage.height = stageH;
        Laya.stage.addChild(this.gameStage);
        //初始化开始按钮
        this.starBtn = starBtn;
        this.starBtn.stateNum = 2;
        this.starBtn.scale(0.5, 0.5, true);
        this.starBtn.pos((stageW - this.starBtn.width * 0.5) / 2, (stageH - this.starBtn.height * 0.5) / 2);
        this.starBtn.on(Laya.Event.CLICK, this, this.startGame);
        Laya.stage.addChild(this.starBtn);
        //头部基础信息
        this.setBaseMsg();
        //初始化英雄
        this.player = new PlayerAir();
        this.gameStage.addChild(this.player);
        this.player.visible = false;
        this.player.on(Laya.Event.MOUSE_DOWN, this, function (e) {
            e.stopPropagation();
            _this.player.startDrag(); //拖动飞机
        });
        //显示、提示用的label
        if (!this.showTxt)
            this.showTxt = new Label("速度快我卡上");
        this.showTxt.fontSize = 22;
        this.showTxt.color = "#ff0000";
        this.showTxt.width = stageW - 100;
        this.showTxt.align = "center";
        this.showTxt.pos((stageW - this.showTxt.width) / 2, (stageH - this.showTxt.height) / 2);
        Laya.stage.addChild(this.showTxt);
        this.showTxt.visible = false;
        this.showTxt.leading = 5;
        //初始化 滤镜
        var redMat = [
            1, 0, 0, 0, 0,
            1, 0, 0, 0, 0,
            1, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
        ];
        //创建一个颜色滤镜对象,红色
        this.redFilter = new ColorFilter(redMat);
    }
    UIManager.prototype.startGame = function () {
        this.resetAllVar();
        //为Player设值
        this.updatePlayer(0);
        this.player.pos((Laya.stage.width - this.player.width) / 2, Laya.stage.height - this.player.height - 10);
        this.baseBox.visible = this.player.visible = true;
        this.starBtn.visible = false;
        //初始化场景
        for (var i = 0; i < this.baseBox.numChildren - 1; i++) {
            this.resetBaseMsg(i);
        }
        Laya.timer.frameLoop(0.5, this, this.gameStartting);
    };
    UIManager.prototype.updatePlayer = function (lv) {
        console.log("现在等级：", lv);
        this.player.setInfo(PlayerAir["UP_SHAPE_" + lv], lv + 1, BattleManager.PLAYER_PLANE[lv]);
    };
    /**游戏中 */
    UIManager.prototype.gameStartting = function () {
        var _this = this;
        this.mapMoving(); //地图移动
        this.handlerBullets(this.player); //主机装弹
        //==============================创建敌机=============================
        //关卡越高，创建敌机间隔越短
        var cutTime = this.level < 30 ? this.level * 1 : 60;
        //关卡越高，敌机飞行速度越高
        var speedUp = Math.floor(this.level / 6);
        //关卡越高，敌机血量越高
        var hpUp = Math.floor(this.level / 8);
        //关卡越高，敌机数量越多
        var numUp = Math.floor(this.level / 10);
        //生成小飞机
        if (Laya.timer.currFrame % (80 - cutTime) === 0) {
            this.createEnemy(EnemyAir["SHAPE_" + Math.floor(Math.random() * 3)], 1, 4 + speedUp, 1, 10);
        }
        //生成中型飞机
        if (Laya.timer.currFrame % (150 - cutTime * 2) === 0) {
            this.createEnemy(EnemyAir.SHAPE_3, 1 + numUp, 3 + speedUp, 2 + hpUp * 2, 50);
        }
        //生成boss
        if (Laya.timer.currFrame % (900 - cutTime * 4) === 0) {
            this.createEnemy(EnemyAir.SHAPE_4, 1, 1 + speedUp, 10 + hpUp * 5, 100);
            //播放boss出场声音
            Laya.SoundManager.playSound(PathManager.getSoundPath("enemy3_out"));
        }
        var _loop_1 = function (i) {
            this_1.bulletMove(this_1.bulletArr[i], function () {
                _this.bulletArr.splice(i, 1);
                i--;
            });
            out_i_1 = i;
        };
        var this_1 = this, out_i_1;
        //子弹移动
        for (var i = 0; i < this.bulletArr.length; i++) {
            _loop_1(i);
            i = out_i_1;
        }
        var _loop_2 = function (j) {
            this_2.handlerBullets(this_2.enemyArr[j]); //敌机子弹
            this_2.bulletMove(this_2.enemyArr[j], function () {
                _this.enemyArr.splice(j, 1);
                j--;
            });
            out_j_1 = j;
        };
        var this_2 = this, out_j_1;
        //敌机移动
        for (var j = 0; j < this.enemyArr.length; j++) {
            _loop_2(j);
            j = out_j_1;
        }
        this.collisionCheck(); //碰撞检测
    };
    /**碰撞 */
    UIManager.prototype.collisionCheck = function () {
        for (var i = 0; i < this.bulletArr.length; i++) {
            var bullet = this.bulletArr[i];
            if (!bullet.visible)
                continue;
            var point = bullet.localToGlobal(new Laya.Point(0, 0));
            if (bullet.camp != this.player.camp) {
                if (this.player.hitTestPoint(point.x + bullet.width / 2, point.y + bullet.height)) {
                    this.lostHp(bullet);
                    this.lostHp(this.player);
                }
            }
            else {
                for (var j = 0; j < this.enemyArr.length; j++) {
                    var enemy = this.enemyArr[j];
                    if (!enemy.visible)
                        continue;
                    if (enemy.hitTestPoint(point.x + bullet.width / 2, point.y)) {
                        this.lostHp(bullet);
                        this.lostHp(enemy);
                    }
                    var hitAirX = Math.abs(this.player.x - enemy.x) - enemy.width;
                    var hitAirY = Math.abs(this.player.y - enemy.y) - enemy.height;
                    if (hitAirX < -5 && hitAirY < -5) {
                        this.lostHp(this.player);
                        this.lostHp(enemy);
                    }
                }
            }
        }
    };
    /**掉血处理 */
    UIManager.prototype.lostHp = function (sp) {
        sp.hp -= 1;
        if (sp.hp <= 0) {
            sp.visible = false;
            if (sp instanceof PlayerAir && sp.camp == this.player.camp) {
                Laya.timer.clear(this, this.gameStartting);
                this.gameStage.mouseEnabled = false;
                this.showTxt.color = "#ff0000";
                this.showTxt.text = "GameOver\uFF0C\u672C\u6B21\u5F97\u5206\uFF1A" + this.scores + " \n\u70B9\u6211\u91CD\u65B0\u5F00\u59CB";
                this.showTxt.visible = true;
                this.showTxt.once(Laya.Event.CLICK, this, this.resetGame);
                this.resetBaseMsg(0);
                Laya.SoundManager.playSound(PathManager.getSoundPath("game_over"));
            }
            if (sp instanceof EnemyAir) {
                this.scores += sp.score;
                this.resetBaseMsg(1);
                if (this.scores > this.levelUpScore) {
                    this.level += 1;
                    this.levelUpScore *= (this.level + 1);
                    this.updatePlayer(this.level); //更新主机
                    Laya.SoundManager.playSound(PathManager.getSoundPath("achievement"));
                    this.setMapMsg(this.level);
                }
            }
        }
        else {
            if (sp instanceof PlayerAir) {
                this.resetBaseMsg(0);
                sp.filters = [this.redFilter];
                Laya.timer.frameOnce(5, null, function () {
                    sp.filters = null;
                });
            }
        }
    };
    /**重启游戏 */
    UIManager.prototype.resetGame = function (evt) {
        evt.stopPropagation();
        this.showTxt.text = "";
        this.showTxt.visible = false;
        this.gameStage.visible = false;
        this.starBtn.visible = true;
        this.baseBox.visible = false;
        this.setMapMsg(this.mapid);
    };
    /**创建子弹 */
    UIManager.prototype.handlerBullets = function (role) {
        if (!role.visible)
            return;
        //处理发射子弹逻辑
        if (role.shootType > 0) {
            //获取当前时间
            var time = Laya.Browser.now();
            //如果当前时间大于下次射击时间
            if (time > role.shootTime) {
                //更新下次射击时间
                role.shootTime = time + role.shootInterval;
                //根据不同子弹类型，设置不同的数量及位置
                if (role.shootType >= BattleManager.BULLETPOS.length)
                    return;
                var pos = BattleManager.BULLETPOS[role.shootType - 1];
                for (var index = 0; index < pos.length; index++) {
                    //从对象池里面创建一个子弹
                    var bullet = Laya.Pool.getItemByClass("bullet", BulletBase);
                    //初始化子弹信息，根据不同子弹类型，设置不同的飞行速度
                    //设置子弹发射初始化位置
                    var posX;
                    var posY;
                    var state;
                    if (role.camp) {
                        posX = role.x + (role.width - bullet.width) / 2 + pos[index];
                        posY = role.y - bullet.height;
                        state = BulletBase.BULLET_UP;
                    }
                    else {
                        posX = role.x + (role.width - bullet.width) / 2;
                        posY = role.y + role.height + bullet.height;
                        state = BulletBase.BULLET_DOWN;
                    }
                    bullet.setBulletShape(state, role.camp, role.speed + 5);
                    bullet.pos(posX, posY);
                    //添加到舞台上
                    this.gameStage.addChild(bullet);
                    this.bulletArr.push(bullet);
                }
                //增加发射子弹声音
                if (role.camp)
                    Laya.SoundManager.playSound(PathManager.getSoundPath("bullet"));
            }
        }
    };
    /**创建敌机 */
    UIManager.prototype.createEnemy = function (type, num, speed, hp, score) {
        for (var i = 0; i < num; i++) {
            //创建敌人，从对象池创建
            var enemy = Laya.Pool.getItemByClass("enemy", EnemyAir);
            //初始化角色
            enemy.setInfo(type, 1, [hp, speed, this.randomHexColor(), score]);
            //随机位置
            enemy.pos(Math.random() * (Laya.stage.width - enemy.width), -Math.random() * 200 - 100);
            this.gameStage.addChild(enemy);
            this.enemyArr.push(enemy);
        }
    };
    /**暂停 */
    UIManager.prototype.stopGame = function (e) {
        e.stopPropagation();
        Laya.timer.clear(this, this.gameStartting);
        this.gameStage.mouseEnabled = false;
        this.showTxt.color = "#00ff00";
        this.showTxt.changeText("游戏已暂停，任意地方恢复游戏");
        this.showTxt.visible = true;
        Laya.stage.once(Laya.Event.CLICK, this, this.onStageClick);
    };
    /**暂停之后的恢复 */
    UIManager.prototype.onStageClick = function (e) {
        e.stopPropagation();
        this.showTxt.text = "";
        Laya.timer.frameLoop(0.5, this, this.gameStartting);
        this.gameStage.mouseEnabled = true;
        this.showTxt.visible = false;
    };
    //重置基础信息
    UIManager.prototype.resetBaseMsg = function (index) {
        var str = "";
        switch (index) {
            case 0:
                str = "\u751F\u547D\uFF1A" + this.player.hp;
                break;
            case 1:
                str = "\u5F97\u5206\uFF1A" + this.scores;
                break;
        }
        this.baseBox.getChildAt(index).changeText(str);
    };
    //初始化基础信息
    UIManager.prototype.setBaseMsg = function () {
        if (!this.baseBox)
            this.baseBox = new Box();
        var hpLabel = new Label("\u751F\u547D\uFF1A0");
        var scoreLb = new Label("\u5F97\u5206\uFF1A0");
        this.baseBox.addChild(hpLabel);
        this.baseBox.addChild(scoreLb);
        scoreLb.color = "#fff000";
        hpLabel.color = "#00ff00";
        scoreLb.fontSize = hpLabel.fontSize = 20;
        hpLabel.x = 10;
        hpLabel.y = 10;
        scoreLb.x = (Laya.stage.width - scoreLb.width) / 2;
        scoreLb.y = 10;
        var stopBtn = new Button(PathManager.compentPath("btn_pause"));
        this.baseBox.addChild(stopBtn);
        stopBtn.stateNum = 1;
        stopBtn.x = Laya.stage.width - stopBtn.width - 10;
        stopBtn.on(Laya.Event.CLICK, this, this.stopGame); //暂停游戏
        Laya.stage.addChild(this.baseBox);
        this.baseBox.visible = false;
    };
    /**获取随机颜色 */
    UIManager.prototype.randomHexColor = function () {
        var hex = Math.floor(Math.random() * 16777216).toString(16); //生成ffffff以内16进制数
        while (hex.length < 6) {
            hex = '0' + hex;
        }
        return '#' + hex; //返回‘#'开头16进制颜色
    };
    /**敌机、子弹的移动 */
    UIManager.prototype.bulletMove = function (role, split) {
        var str;
        if (role && role.speed) {
            //根据飞机速度更改位置
            role.y += role.speed;
            //如果敌人移动到显示区域以外，则移除
            if (role.y > (Laya.stage.height + role.height) || !role.visible || role.y < -role.height) {
                if (role.shootType >= 0) {
                    if (!(role.y > (Laya.stage.height + role.height))) {
                        return;
                    }
                }
                //从舞台移除
                role.removeSelf();
                //回收之前，重置属性信息
                role.visible = true;
                //回收到对象池
                if (role instanceof EnemyAir)
                    str = "enemy";
                else
                    str = "bullet";
                Laya.Pool.recover(str, role);
                split();
            }
        }
    };
    /**重置所有属性以及变量 */
    UIManager.prototype.resetAllVar = function () {
        this.gameStage.mouseEnabled = true;
        this.gameStage.visible = true;
        var str;
        for (var i = 0; i < this.gameStage.numChildren; i++) {
            var item = this.gameStage.getChildAt(i);
            if (!(item instanceof PlayerAir)) {
                item.removeSelf();
                if (item instanceof BulletBase)
                    str = "bullet";
                else
                    str = "enemy";
                Laya.Pool.recover(str, item);
                i--;
            }
        }
        this.bulletArr = [];
        this.enemyArr = [];
        this.scores = 0;
        this.level = 0;
        this.levelUpScore = 100;
    };
    /**控制地图的移动 */
    UIManager.prototype.mapMoving = function () {
        var map;
        for (var i = 1; i < 3; i++) {
            map = this["map" + i];
            map.y += 3;
            if (map.y > Laya.stage.height) {
                map.y = -Laya.stage.height;
            }
        }
    };
    UIManager.prototype.setMapMsg = function (mapId) {
        var mapUrl = PathManager.getMapByid(mapId);
        this.map1.skin = mapUrl;
        this.map2.skin = mapUrl;
    };
    return UIManager;
}());
//# sourceMappingURL=UIManager.js.map