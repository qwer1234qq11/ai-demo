(function () {
    'use strict';

    const THEME = {
        bg: "#0b1020",
        panel: "#151d33",
        panelLight: "#1d2842",
        border: "#2b3a5c",
        text: "#e8eefc",
        sub: "#8b9bc4",
        primary: "#4f7cff",
        accent: "#22d3ee",
        danger: "#fb7185",
        gold: "#facc15"
    };
    function roundRect(g, x, y, w, h, r, fill, border = null, lineWidth = 2) {
        let paths = [
            ["moveTo", r, 0],
            ["lineTo", w - r, 0],
            ["arcTo", w, 0, w, r, r],
            ["lineTo", w, h - r],
            ["arcTo", w, h, w - r, h, r],
            ["lineTo", r, h],
            ["arcTo", 0, h, 0, h - r, r],
            ["lineTo", 0, r],
            ["arcTo", 0, 0, r, 0, r],
            ["closePath"]
        ];
        let brush = { fillStyle: fill };
        let pen = border ? { strokeStyle: border, lineWidth: lineWidth } : null;
        g.drawPath(x, y, paths, brush, pen);
    }
    function makeLabel(text, x, y, w, h, size, color, align = "left", bold = false) {
        let t = new Laya.Text();
        t.text = text;
        t.pos(x, y);
        t.size(w, h);
        t.fontSize = size;
        t.color = color;
        t.bold = bold;
        t.align = align;
        t.valign = "middle";
        t.overflow = "visible";
        return t;
    }
    function makeButton(text, x, y, w, h, fill, textColor, caller, onClick, fontSize = 26, onDown = null) {
        let btn = new Laya.Sprite();
        btn.pos(x, y);
        btn.size(w, h);
        btn.mouseEnabled = true;
        roundRect(btn.graphics, 0, 0, w, h, 12, fill, THEME.border, 2);
        btn.addChild(makeLabel(text, 0, 0, w, h, fontSize, textColor, "center", true));
        btn.on(Laya.Event.MOUSE_DOWN, caller, (e) => {
            btn.alpha = 0.65;
            if (onDown)
                onDown.call(caller, e);
        });
        btn.on(Laya.Event.MOUSE_UP, caller, (e) => {
            btn.alpha = 1;
            if (onClick)
                onClick.call(caller, e);
        });
        btn.on(Laya.Event.MOUSE_OUT, caller, (e) => { btn.alpha = 1; });
        return btn;
    }
    function setButtonText(btn, text) {
        let lb = btn.getChildAt(0);
        lb.text = text;
    }

    const SCENE_BOX = "test/TestScene.scene";
    const SCENE_TETRIS = "test/TetrisScene.scene";
    class MenuScene extends Laya.Scene {
        constructor() {
            super();
        }
        onOpened(param = null) {
            this.size(640, 1136);
            let bg = new Laya.Sprite();
            bg.graphics.drawRect(0, 0, 640, 1136, THEME.bg);
            bg.graphics.drawRect(0, 0, 640, 8, THEME.primary);
            bg.graphics.drawRect(0, 0, 210, 8, THEME.accent);
            bg.graphics.drawRect(0, 780, 640, 1, THEME.border);
            this.addChild(bg);
            this.addChild(makeLabel("游 戏 大 厅", 60, 118, 520, 88, 58, THEME.text, "center", true));
            this.addChild(makeLabel("选择一个游戏，开始挑战", 60, 216, 520, 46, 24, THEME.sub, "center"));
            this.addChild(this.makeCard(310, "别让箱子掉下来", "点击屏幕发射子弹击碎下落的箱子\n别让任何箱子碰到地面", "射击 · 生存", THEME.danger, "#ffb3be", 0, SCENE_BOX));
            this.addChild(this.makeCard(560, "俄罗斯方块", "旋转、平移，摆满整行即可消除\n经典的方块消除挑战", "益智 · 消除", THEME.primary, "#9ab5ff", 1, SCENE_TETRIS));
            this.addChild(makeLabel("点击卡片进入游戏", 60, 840, 520, 48, 26, THEME.text, "center"));
            this.addChild(makeLabel("两个游戏内都可以随时返回大厅", 60, 894, 520, 40, 20, THEME.sub, "center"));
            this.addChild(makeLabel("LayaAir 2.x  ·  双游戏示例", 60, 1050, 520, 40, 20, THEME.sub, "center"));
        }
        makeCard(y, title, desc, tag, color, light, kind, url) {
            let card = new Laya.Sprite();
            card.pos(60, y);
            card.size(520, 220);
            card.mouseEnabled = true;
            roundRect(card.graphics, 0, 0, 520, 220, 20, THEME.panel, THEME.border, 2);
            card.graphics.drawRect(28, 0, 110, 4, color);
            this.drawIcon(card, kind, color, light);
            card.addChild(makeLabel(title, 172, 34, 326, 56, 36, THEME.text, "left", true));
            card.addChild(makeLabel("●  " + tag, 172, 96, 300, 34, 20, color, "left"));
            let d = makeLabel(desc, 172, 138, 326, 72, 21, THEME.sub, "left");
            d.wordWrap = true;
            d.leading = 6;
            d.valign = "top";
            card.addChild(d);
            let arrow = makeLabel(">", 462, 86, 40, 50, 40, THEME.sub, "center", true);
            card.addChild(arrow);
            card.on(Laya.Event.MOUSE_DOWN, this, () => { card.alpha = 0.8; });
            card.on(Laya.Event.MOUSE_UP, this, () => { card.alpha = 1; });
            card.on(Laya.Event.MOUSE_OUT, this, () => { card.alpha = 1; });
            card.on(Laya.Event.CLICK, this, () => { Laya.Scene.open(url); });
            return card;
        }
        drawIcon(sp, kind, color, light) {
            let g = sp.graphics;
            let cells;
            if (kind === 0) {
                cells = [[0, 0], [1, 0], [2, 1], [0, 2], [2, 2], [1, 3]];
            }
            else {
                cells = [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2], [2, 2]];
            }
            roundRect(g, 32, 40, 120, 140, 14, "#0f172b", THEME.border, 2);
            for (let i = 0; i < cells.length; i++) {
                let x = 48 + cells[i][0] * 28;
                let y = 54 + cells[i][1] * 30;
                g.drawRect(x, y, 24, 24, color, "#0b1020", 1);
                g.drawRect(x + 3, y + 3, 18, 3, light);
            }
        }
    }

    var Scene = Laya.Scene;
    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        var test;
        (function (test) {
            class TestSceneUI extends Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("test/TestScene");
                }
            }
            test.TestSceneUI = TestSceneUI;
            REG("ui.test.TestSceneUI", TestSceneUI);
        })(test = ui.test || (ui.test = {}));
    })(ui || (ui = {}));

    class GameControl extends Laya.Script {
        constructor() {
            super();
            this.createBoxInterval = 1000;
            this._time = 0;
            this._started = false;
        }
        onEnable() {
            this._time = Date.now();
            this._gameBox = this.owner.getChildByName("gameBox");
        }
        onUpdate() {
            let now = Date.now();
            if (now - this._time > this.createBoxInterval && this._started) {
                this._time = now;
                this.createBox();
            }
        }
        createBox() {
            let box = Laya.Pool.getItemByCreateFun("dropBox", this.dropBox.create, this.dropBox);
            box.pos(Math.random() * (Laya.stage.width - 100), -100);
            this._gameBox.addChild(box);
        }
        onStageClick(e) {
            e.stopPropagation();
            let flyer = Laya.Pool.getItemByCreateFun("bullet", this.bullet.create, this.bullet);
            flyer.pos(Laya.stage.mouseX, Laya.stage.mouseY);
            this._gameBox.addChild(flyer);
        }
        startGame() {
            if (!this._started) {
                this._started = true;
                this.enabled = true;
            }
        }
        stopGame() {
            this._started = false;
            this.enabled = false;
            this.createBoxInterval = 1000;
            this._gameBox.removeChildren();
        }
    }

    class GameUI extends ui.test.TestSceneUI {
        constructor() {
            super();
            GameUI.instance = this;
            Laya.MouseManager.multiTouchEnabled = false;
        }
        onEnable() {
            this._control = this.getComponent(GameControl);
            this.tipLbll.on(Laya.Event.CLICK, this, this.onTipClick);
            this.addChild(makeButton("返回大厅", 24, 20, 148, 56, "#1d2842", "#e8eefc", this, this.goMenu, 24));
        }
        goMenu() {
            Laya.Scene.open("test/MenuScene.scene");
        }
        onTipClick(e) {
            this.tipLbll.visible = false;
            this._score = 0;
            this.scoreLbl.text = "";
            this._control.startGame();
        }
        addScore(value = 1) {
            this._score += value;
            this.scoreLbl.changeText("分数：" + this._score);
            if (this._control.createBoxInterval > 600 && this._score % 20 == 0)
                this._control.createBoxInterval -= 20;
        }
        stopGame() {
            this.tipLbll.visible = true;
            this.tipLbll.text = "游戏结束了，点击屏幕重新开始";
            this._control.stopGame();
        }
    }

    const COLS = 10;
    const ROWS = 20;
    const CELL = 32;
    const BX = 24;
    const BY = 176;
    const PREVIEW_CELL = 26;
    const SCENE_MENU = "test/MenuScene.scene";
    const TETROMINOES = [
        { color: "#22d3ee", light: "#9af2ff", matrix: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]] },
        { color: "#facc15", light: "#ffe883", matrix: [[1, 1], [1, 1]] },
        { color: "#a78bfa", light: "#d4c4ff", matrix: [[0, 1, 0], [1, 1, 1], [0, 0, 0]] },
        { color: "#4ade80", light: "#a9f5bd", matrix: [[0, 1, 1], [1, 1, 0], [0, 0, 0]] },
        { color: "#fb7185", light: "#ffb6c0", matrix: [[1, 1, 0], [0, 1, 1], [0, 0, 0]] },
        { color: "#60a5fa", light: "#b3d4ff", matrix: [[1, 0, 0], [1, 1, 1], [0, 0, 0]] },
        { color: "#fb923c", light: "#ffc79a", matrix: [[0, 0, 1], [1, 1, 1], [0, 0, 0]] }
    ];
    function cloneMatrix(m) {
        let r = [];
        for (let i = 0; i < m.length; i++)
            r.push(m[i].slice());
        return r;
    }
    function rotateMatrix(m, dir) {
        let n = m.length;
        let r = [];
        for (let y = 0; y < n; y++) {
            r.push([]);
            for (let x = 0; x < n; x++) {
                r[y].push(dir > 0 ? m[n - 1 - x][y] : m[x][n - 1 - y]);
            }
        }
        return r;
    }
    function eachCell(m, cb) {
        for (let y = 0; y < m.length; y++) {
            for (let x = 0; x < m[y].length; x++) {
                if (m[y][x])
                    cb(x, y);
            }
        }
    }
    class TetrisScene extends Laya.Scene {
        constructor() {
            super();
        }
        onOpened(param = null) {
            this.buildUI();
            this.best = this.loadBest();
            Laya.stage.on(Laya.Event.KEY_DOWN, this, this.onKeyDown);
            Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onStageUp);
            Laya.timer.frameLoop(1, this, this.onUpdate);
            this.startGame();
        }
        onClosed(type = null) {
            Laya.timer.clear(this, this.onUpdate);
            Laya.stage.off(Laya.Event.KEY_DOWN, this, this.onKeyDown);
            Laya.stage.off(Laya.Event.MOUSE_UP, this, this.onStageUp);
        }
        loadBest() {
            try {
                let v = window.localStorage.getItem("tetris_best");
                return v ? (parseInt(v, 10) || 0) : 0;
            }
            catch (e) {
                return 0;
            }
        }
        saveBest(v) {
            try {
                window.localStorage.setItem("tetris_best", "" + v);
            }
            catch (e) { }
        }
        buildUI() {
            this.size(640, 1136);
            let bg = new Laya.Sprite();
            bg.graphics.drawRect(0, 0, 640, 1136, THEME.bg);
            bg.graphics.drawRect(0, 0, 640, 8, THEME.accent);
            this.addChild(bg);
            this.addChild(makeLabel("俄罗斯方块", 24, 20, 330, 58, 38, THEME.text, "left", true));
            this.addChild(makeButton("返回大厅", 468, 24, 148, 56, THEME.panelLight, THEME.text, this, this.goMenu, 24));
            this.addChild(makeLabel("摆满一整行即可消除 · 支持键盘与触屏", 24, 88, 600, 36, 20, THEME.sub, "left"));
            let frame = new Laya.Sprite();
            roundRect(frame.graphics, BX - 8, BY - 8, COLS * CELL + 16, ROWS * CELL + 16, 12, THEME.panel, THEME.border, 2);
            this.addChild(frame);
            this.gridSp = new Laya.Sprite();
            let gg = this.gridSp.graphics;
            gg.drawRect(BX, BY, COLS * CELL, ROWS * CELL, "#0d1426");
            for (let x = 1; x < COLS; x++)
                gg.drawRect(BX + x * CELL, BY, 1, ROWS * CELL, "#22304e");
            for (let y = 1; y < ROWS; y++)
                gg.drawRect(BX, BY + y * CELL, COLS * CELL, 1, "#22304e");
            this.addChild(this.gridSp);
            this.boardSp = new Laya.Sprite();
            this.addChild(this.boardSp);
            let p1 = new Laya.Sprite();
            roundRect(p1.graphics, 364, 168, 252, 180, 14, THEME.panel, THEME.border, 2);
            this.addChild(p1);
            this.addChild(makeLabel("下一个", 384, 180, 200, 36, 22, THEME.sub, "left", true));
            this.previewSp = new Laya.Sprite();
            this.addChild(this.previewSp);
            let p2 = new Laya.Sprite();
            roundRect(p2.graphics, 364, 364, 252, 108, 14, THEME.panel, THEME.border, 2);
            this.addChild(p2);
            this.addChild(makeLabel("分数", 384, 374, 200, 30, 20, THEME.sub, "left"));
            this.scoreLbl = makeLabel("0", 384, 402, 212, 58, 40, THEME.gold, "left", true);
            this.addChild(this.scoreLbl);
            let p3 = new Laya.Sprite();
            roundRect(p3.graphics, 364, 488, 252, 140, 14, THEME.panel, THEME.border, 2);
            this.addChild(p3);
            this.addChild(makeLabel("等级", 384, 500, 100, 30, 19, THEME.sub, "left"));
            this.levelLbl = makeLabel("1", 500, 496, 96, 36, 26, THEME.text, "right", true);
            this.addChild(this.levelLbl);
            this.addChild(makeLabel("消行", 384, 542, 100, 30, 19, THEME.sub, "left"));
            this.linesLbl = makeLabel("0", 500, 538, 96, 36, 26, THEME.text, "right", true);
            this.addChild(this.linesLbl);
            this.addChild(makeLabel("最高分", 384, 584, 100, 30, 19, THEME.sub, "left"));
            this.bestLbl = makeLabel("0", 470, 580, 126, 36, 24, THEME.accent, "right", true);
            this.addChild(this.bestLbl);
            let p4 = new Laya.Sprite();
            roundRect(p4.graphics, 364, 644, 252, 172, 14, THEME.panel, THEME.border, 2);
            this.addChild(p4);
            this.addChild(makeLabel("键盘操作", 384, 654, 200, 32, 20, THEME.sub, "left", true));
            let helps = ["←  →   左右移动", "↑ / X   旋转方块", "↓       加速下落", "空格    直接落地", "P       暂停 / 继续"];
            for (let i = 0; i < helps.length; i++) {
                this.addChild(makeLabel(helps[i], 384, 690 + i * 25, 220, 26, 18, THEME.text, "left"));
            }
            this.addChild(makeButton("左移", 24, 848, 112, 84, THEME.panelLight, THEME.text, this, null, 24, () => this.setHold(1)));
            this.addChild(makeButton("旋转", 146, 848, 112, 84, THEME.panelLight, THEME.text, this, () => this.rotate(1), 24));
            this.addChild(makeButton("右移", 268, 848, 112, 84, THEME.panelLight, THEME.text, this, null, 24, () => this.setHold(2)));
            this.addChild(makeButton("下落", 390, 848, 112, 84, THEME.panelLight, THEME.text, this, null, 24, () => this.setHold(3)));
            this.addChild(makeButton("速降", 512, 848, 104, 84, THEME.primary, "#ffffff", this, this.hardDrop, 24));
            this.addChild(makeButton("暂停 / 继续", 24, 948, 190, 74, THEME.panel, THEME.text, this, this.togglePause, 24));
            this.addChild(makeButton("重新开始", 224, 948, 190, 74, THEME.panel, THEME.text, this, this.startGame, 24));
            this.addChild(makeButton("返回大厅", 424, 948, 192, 74, THEME.panel, THEME.text, this, this.goMenu, 24));
            this.addChild(makeLabel("按住「左移 / 右移 / 下落」可连续操作", 24, 1040, 592, 40, 20, THEME.sub, "center"));
            this.overlay = new Laya.Sprite();
            this.overlay.size(640, 1136);
            this.overlay.mouseEnabled = true;
            this.overlay.graphics.drawRect(0, 0, 640, 1136, "#080d1a");
            this.overlayTitle = makeLabel("已暂停", 60, 320, 520, 80, 52, THEME.text, "center", true);
            this.overlay.addChild(this.overlayTitle);
            this.overlayDesc = makeLabel("", 60, 410, 520, 110, 26, THEME.sub, "center");
            this.overlayDesc.wordWrap = true;
            this.overlayDesc.leading = 10;
            this.overlay.addChild(this.overlayDesc);
            this.overlayBtn = makeButton("继续游戏", 160, 570, 320, 80, THEME.primary, "#ffffff", this, () => this.onOverlayAction(), 30);
            this.overlay.addChild(this.overlayBtn);
            this.overlay.addChild(makeButton("返回大厅", 160, 670, 320, 70, THEME.panelLight, THEME.text, this, this.goMenu, 26));
            this.overlay.visible = false;
            this.addChild(this.overlay);
        }
        updateHUD() {
            this.scoreLbl.text = "" + this.score;
            this.levelLbl.text = "" + this.level;
            this.linesLbl.text = "" + this.lines;
            this.bestLbl.text = "" + Math.max(this.best, this.score);
        }
        startGame() {
            this.board = [];
            for (let y = 0; y < ROWS; y++)
                this.board.push(new Array(COLS).fill(0));
            this.bag = [];
            this.score = 0;
            this.lines = 0;
            this.level = 1;
            this.dropInterval = 800;
            this.acc = 0;
            this.lastTime = 0;
            this.heldDir = 0;
            this.paused = false;
            this.gameOver = false;
            this.nextType = this.nextFromBag();
            this.hideOverlay();
            this.spawn();
            this.updateHUD();
        }
        nextFromBag() {
            if (!this.bag.length) {
                this.bag = [0, 1, 2, 3, 4, 5, 6];
                for (let i = this.bag.length - 1; i > 0; i--) {
                    let j = Math.floor(Math.random() * (i + 1));
                    let t = this.bag[i];
                    this.bag[i] = this.bag[j];
                    this.bag[j] = t;
                }
            }
            return this.bag.pop();
        }
        spawn() {
            let type = this.nextType;
            this.nextType = this.nextFromBag();
            let m = cloneMatrix(TETROMINOES[type].matrix);
            this.cur = { shape: type, matrix: m, x: Math.floor((COLS - m.length) / 2), y: 0 };
            this.acc = 0;
            this.renderPreview();
            if (!this.canPlace(m, this.cur.x, 0)) {
                this.renderBoard();
                this.onGameOver();
            }
            else {
                this.renderBoard();
            }
        }
        canPlace(m, px, py) {
            for (let y = 0; y < m.length; y++) {
                for (let x = 0; x < m[y].length; x++) {
                    if (!m[y][x])
                        continue;
                    let bx = px + x;
                    let by = py + y;
                    if (bx < 0 || bx >= COLS || by >= ROWS)
                        return false;
                    if (by >= 0 && this.board[by][bx])
                        return false;
                }
            }
            return true;
        }
        ghostY() {
            let y = this.cur.y;
            while (this.canPlace(this.cur.matrix, this.cur.x, y + 1))
                y++;
            return y;
        }
        move(dx) {
            if (!this.cur || this.paused || this.gameOver)
                return;
            if (this.canPlace(this.cur.matrix, this.cur.x + dx, this.cur.y)) {
                this.cur.x += dx;
                this.renderBoard();
            }
        }
        rotate(dir) {
            if (!this.cur || this.paused || this.gameOver)
                return;
            let m = rotateMatrix(this.cur.matrix, dir);
            let kicks = [[0, 0], [-1, 0], [1, 0], [-2, 0], [2, 0], [0, -1], [-1, -1], [1, -1]];
            for (let i = 0; i < kicks.length; i++) {
                let nx = this.cur.x + kicks[i][0];
                let ny = this.cur.y + kicks[i][1];
                if (this.canPlace(m, nx, ny)) {
                    this.cur.matrix = m;
                    this.cur.x = nx;
                    this.cur.y = ny;
                    this.renderBoard();
                    return;
                }
            }
        }
        softDrop() {
            if (!this.cur || this.paused || this.gameOver)
                return;
            this.stepDown(true);
        }
        hardDrop() {
            if (!this.cur || this.paused || this.gameOver)
                return;
            let gy = this.ghostY();
            this.score += (gy - this.cur.y) * 2;
            this.cur.y = gy;
            this.updateHUD();
            this.lockPiece();
        }
        stepDown(soft) {
            if (!this.cur || this.paused || this.gameOver)
                return;
            if (this.canPlace(this.cur.matrix, this.cur.x, this.cur.y + 1)) {
                this.cur.y++;
                if (soft) {
                    this.score += 1;
                    this.updateHUD();
                }
            }
            else {
                this.lockPiece();
            }
            this.acc = 0;
            this.renderBoard();
        }
        lockPiece() {
            let self = this;
            eachCell(this.cur.matrix, (cx, cy) => {
                let by = self.cur.y + cy;
                let bx = self.cur.x + cx;
                if (by >= 0 && by < ROWS && bx >= 0 && bx < COLS)
                    self.board[by][bx] = self.cur.shape + 1;
            });
            this.clearLines();
            this.spawn();
        }
        clearLines() {
            let cleared = 0;
            for (let y = ROWS - 1; y >= 0; y--) {
                let full = true;
                for (let x = 0; x < COLS; x++) {
                    if (!this.board[y][x]) {
                        full = false;
                        break;
                    }
                }
                if (full) {
                    this.board.splice(y, 1);
                    this.board.unshift(new Array(COLS).fill(0));
                    cleared++;
                    y++;
                }
            }
            if (cleared > 0) {
                let table = [0, 100, 300, 500, 800];
                this.score += (table[cleared] || 800) * this.level;
                this.lines += cleared;
                this.level = Math.floor(this.lines / 10) + 1;
                this.dropInterval = Math.max(100, 800 - (this.level - 1) * 65);
            }
            this.updateHUD();
        }
        onGameOver() {
            this.gameOver = true;
            if (this.score > this.best) {
                this.best = this.score;
                this.saveBest(this.best);
            }
            this.updateHUD();
            this.showOverlay("游戏结束", "本局得分  " + this.score + "\n最高分  " + this.best, "再来一局", "over");
        }
        togglePause() {
            if (this.gameOver)
                return;
            this.paused = !this.paused;
            if (this.paused) {
                this.heldDir = 0;
                this.showOverlay("已暂停", "休息一下，随时回来继续", "继续游戏", "pause");
            }
            else {
                this.hideOverlay();
            }
        }
        showOverlay(title, desc, btnText, mode) {
            this.overlayTitle.text = title;
            this.overlayDesc.text = desc;
            setButtonText(this.overlayBtn, btnText);
            this.overlayMode = mode;
            this.overlay.visible = true;
        }
        hideOverlay() {
            this.overlay.visible = false;
        }
        onOverlayAction() {
            if (this.overlayMode === "pause")
                this.togglePause();
            else
                this.startGame();
        }
        goMenu() {
            Laya.Scene.open(SCENE_MENU);
        }
        setHold(dir) {
            if (this.paused || this.gameOver)
                return;
            this.heldDir = dir;
            this.holdTime = 0;
            this.holdDelay = 190;
            this.applyHold(dir);
        }
        applyHold(dir) {
            if (dir === 1)
                this.move(-1);
            else if (dir === 2)
                this.move(1);
            else if (dir === 3)
                this.softDrop();
        }
        onStageUp(e = null) {
            this.heldDir = 0;
        }
        onKeyDown(e) {
            let k = e.keyCode;
            if (k === 27) {
                this.goMenu();
                return;
            }
            if (k === 80) {
                this.togglePause();
                return;
            }
            if (this.gameOver) {
                if (k === 13 || k === 32)
                    this.startGame();
                return;
            }
            if (this.paused)
                return;
            switch (k) {
                case 37:
                    this.move(-1);
                    break;
                case 39:
                    this.move(1);
                    break;
                case 40:
                    this.softDrop();
                    break;
                case 38:
                case 88:
                    this.rotate(1);
                    break;
                case 90:
                    this.rotate(-1);
                    break;
                case 32:
                    this.hardDrop();
                    break;
            }
        }
        onUpdate() {
            let now = Date.now();
            if (!this.lastTime)
                this.lastTime = now;
            let dt = Math.min(now - this.lastTime, 100);
            this.lastTime = now;
            if (this.paused || this.gameOver) {
                this.heldDir = 0;
                return;
            }
            if (this.heldDir !== 0) {
                this.holdTime += dt;
                if (this.holdTime >= this.holdDelay) {
                    this.holdTime = 0;
                    this.holdDelay = 70;
                    this.applyHold(this.heldDir);
                }
            }
            this.acc += dt;
            if (this.acc >= this.dropInterval)
                this.stepDown(false);
        }
        drawCell(g, px, py, size, type) {
            let t = TETROMINOES[type - 1];
            g.drawRect(px, py, size, size, t.color, "#0a1020", 1);
            g.drawRect(px + 3, py + 3, size - 6, 4, t.light);
            g.drawRect(px + 3, py + size - 7, size - 6, 4, "#0a1020");
        }
        renderBoard() {
            let g = this.boardSp.graphics;
            g.clear();
            for (let y = 0; y < ROWS; y++) {
                for (let x = 0; x < COLS; x++) {
                    let v = this.board[y][x];
                    if (v)
                        this.drawCell(g, BX + x * CELL, BY + y * CELL, CELL, v);
                }
            }
            if (!this.cur)
                return;
            let type = this.cur.shape + 1;
            let gy = this.ghostY();
            if (gy !== this.cur.y) {
                eachCell(this.cur.matrix, (cx, cy) => {
                    let by = gy + cy;
                    if (by < 0)
                        return;
                    g.drawRect(BX + (this.cur.x + cx) * CELL, BY + by * CELL, CELL, CELL, "#182a48", THEME.primary, 2);
                });
            }
            eachCell(this.cur.matrix, (cx, cy) => {
                let by = this.cur.y + cy;
                if (by < 0)
                    return;
                this.drawCell(g, BX + (this.cur.x + cx) * CELL, BY + by * CELL, CELL, type);
            });
        }
        renderPreview() {
            let g = this.previewSp.graphics;
            g.clear();
            let m = TETROMINOES[this.nextType].matrix;
            let minX = 99, maxX = -1, minY = 99, maxY = -1;
            eachCell(m, (x, y) => {
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y);
            });
            let w = (maxX - minX + 1) * PREVIEW_CELL;
            let h = (maxY - minY + 1) * PREVIEW_CELL;
            let ox = 364 + (252 - w) / 2 - minX * PREVIEW_CELL;
            let oy = 226 + (112 - h) / 2 - minY * PREVIEW_CELL;
            eachCell(m, (x, y) => {
                this.drawCell(g, ox + x * PREVIEW_CELL, oy + y * PREVIEW_CELL, PREVIEW_CELL, this.nextType + 1);
            });
        }
    }

    class Bullet extends Laya.Script {
        constructor() { super(); }
        onEnable() {
            var rig = this.owner.getComponent(Laya.RigidBody);
            rig.setVelocity({ x: 0, y: -10 });
        }
        onTriggerEnter(other, self, contact) {
            this.owner.removeSelf();
        }
        onUpdate() {
            if (this.owner.y < -10) {
                this.owner.removeSelf();
            }
        }
        onDisable() {
            Laya.Pool.recover("bullet", this.owner);
        }
    }

    class DropBox extends Laya.Script {
        constructor() {
            super();
            this.level = 1;
        }
        onEnable() {
            this._rig = this.owner.getComponent(Laya.RigidBody);
            this.level = Math.round(Math.random() * 5) + 1;
            this._text = this.owner.getChildByName("levelTxt");
            this._text.text = this.level + "";
        }
        onUpdate() {
            this.owner.rotation++;
        }
        onTriggerEnter(other, self, contact) {
            var owner = this.owner;
            if (other.label === "buttle") {
                if (this.level > 1) {
                    this.level--;
                    this._text.changeText(this.level + "");
                    owner.getComponent(Laya.RigidBody).setVelocity({ x: 0, y: -10 });
                    Laya.SoundManager.playSound("sound/hit.wav");
                }
                else {
                    if (owner.parent) {
                        let effect = Laya.Pool.getItemByCreateFun("effect", this.createEffect, this);
                        effect.pos(owner.x, owner.y);
                        owner.parent.addChild(effect);
                        effect.play(0, true);
                        owner.removeSelf();
                        Laya.SoundManager.playSound("sound/destroy.wav");
                    }
                }
                GameUI.instance.addScore(1);
            }
            else if (other.label === "ground") {
                owner.removeSelf();
                GameUI.instance.stopGame();
            }
        }
        createEffect() {
            let ani = new Laya.Animation();
            ani.loadAnimation("test/TestAni.ani");
            ani.on(Laya.Event.COMPLETE, null, recover);
            function recover() {
                ani.removeSelf();
                Laya.Pool.recover("effect", ani);
            }
            return ani;
        }
        onDisable() {
            Laya.Pool.recover("dropBox", this.owner);
        }
    }

    class GameConfig {
        constructor() { }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("script/MenuScene.ts", MenuScene);
            reg("script/GameUI.ts", GameUI);
            reg("script/GameControl.ts", GameControl);
            reg("script/TetrisScene.ts", TetrisScene);
            reg("script/Bullet.ts", Bullet);
            reg("script/DropBox.ts", DropBox);
        }
    }
    GameConfig.width = 640;
    GameConfig.height = 1136;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "test/MenuScene.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError(true);
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
