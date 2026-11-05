import { THEME, roundRect, makeLabel, makeButton, setButtonText } from "./UIUtil";

const COLS: number = 10;
const ROWS: number = 20;
const CELL: number = 32;
const BX: number = 24;
const BY: number = 176;
const PREVIEW_CELL: number = 26;
const SCENE_MENU: string = "test/MenuScene.scene";

interface Tetromino {
    color: string;
    light: string;
    matrix: number[][];
}

const TETROMINOES: Tetromino[] = [
    { color: "#22d3ee", light: "#9af2ff", matrix: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]] }, // I
    { color: "#facc15", light: "#ffe883", matrix: [[1, 1], [1, 1]] },                                             // O
    { color: "#a78bfa", light: "#d4c4ff", matrix: [[0, 1, 0], [1, 1, 1], [0, 0, 0]] },                           // T
    { color: "#4ade80", light: "#a9f5bd", matrix: [[0, 1, 1], [1, 1, 0], [0, 0, 0]] },                           // S
    { color: "#fb7185", light: "#ffb6c0", matrix: [[1, 1, 0], [0, 1, 1], [0, 0, 0]] },                           // Z
    { color: "#60a5fa", light: "#b3d4ff", matrix: [[1, 0, 0], [1, 1, 1], [0, 0, 0]] },                           // J
    { color: "#fb923c", light: "#ffc79a", matrix: [[0, 0, 1], [1, 1, 1], [0, 0, 0]] }                            // L
];

function cloneMatrix(m: number[][]): number[][] {
    let r: number[][] = [];
    for (let i: number = 0; i < m.length; i++) r.push(m[i].slice());
    return r;
}

function rotateMatrix(m: number[][], dir: number): number[][] {
    let n: number = m.length;
    let r: number[][] = [];
    for (let y: number = 0; y < n; y++) {
        r.push([]);
        for (let x: number = 0; x < n; x++) {
            r[y].push(dir > 0 ? m[n - 1 - x][y] : m[x][n - 1 - y]);
        }
    }
    return r;
}

function eachCell(m: number[][], cb: (x: number, y: number) => void): void {
    for (let y: number = 0; y < m.length; y++) {
        for (let x: number = 0; x < m[y].length; x++) {
            if (m[y][x]) cb(x, y);
        }
    }
}

/** 俄罗斯方块：支持键盘与屏幕按钮、7-bag 随机、消行计分、等级加速、暂停与结束 */
export default class TetrisScene extends Laya.Scene {
    private board: number[][];
    private bag: number[];
    private cur: any;
    private nextType: number;
    private score: number;
    private lines: number;
    private level: number;
    private best: number;
    private paused: boolean;
    private gameOver: boolean;
    private dropInterval: number;
    private acc: number;
    private lastTime: number;
    private heldDir: number;
    private holdTime: number;
    private holdDelay: number;

    private gridSp: Laya.Sprite;
    private boardSp: Laya.Sprite;
    private previewSp: Laya.Sprite;
    private scoreLbl: Laya.Text;
    private levelLbl: Laya.Text;
    private linesLbl: Laya.Text;
    private bestLbl: Laya.Text;
    private overlay: Laya.Sprite;
    private overlayTitle: Laya.Text;
    private overlayDesc: Laya.Text;
    private overlayBtn: Laya.Sprite;
    private overlayMode: string;

    constructor() {
        super();
    }

    onOpened(param: any = null): void {
        this.buildUI();
        this.best = this.loadBest();
        Laya.stage.on(Laya.Event.KEY_DOWN, this, this.onKeyDown);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onStageUp);
        Laya.timer.frameLoop(1, this, this.onUpdate);
        this.startGame();
    }

    onClosed(type: string = null): void {
        Laya.timer.clear(this, this.onUpdate);
        Laya.stage.off(Laya.Event.KEY_DOWN, this, this.onKeyDown);
        Laya.stage.off(Laya.Event.MOUSE_UP, this, this.onStageUp);
    }

    private loadBest(): number {
        try {
            let v: string = window.localStorage.getItem("tetris_best");
            return v ? (parseInt(v, 10) || 0) : 0;
        } catch (e) {
            return 0;
        }
    }

    private saveBest(v: number): void {
        try { window.localStorage.setItem("tetris_best", "" + v); } catch (e) { }
    }

    // ---------------------------------------------------------------- UI
    private buildUI(): void {
        this.size(640, 1136);

        let bg: Laya.Sprite = new Laya.Sprite();
        bg.graphics.drawRect(0, 0, 640, 1136, THEME.bg);
        bg.graphics.drawRect(0, 0, 640, 8, THEME.accent);
        this.addChild(bg);

        this.addChild(makeLabel("俄罗斯方块", 24, 20, 330, 58, 38, THEME.text, "left", true));
        this.addChild(makeButton("返回大厅", 468, 24, 148, 56, THEME.panelLight, THEME.text, this, this.goMenu, 24));
        this.addChild(makeLabel("摆满一整行即可消除 · 支持键盘与触屏", 24, 88, 600, 36, 20, THEME.sub, "left"));

        // 棋盘外框与网格
        let frame: Laya.Sprite = new Laya.Sprite();
        roundRect(frame.graphics, BX - 8, BY - 8, COLS * CELL + 16, ROWS * CELL + 16, 12, THEME.panel, THEME.border, 2);
        this.addChild(frame);

        this.gridSp = new Laya.Sprite();
        let gg: Laya.Graphics = this.gridSp.graphics;
        gg.drawRect(BX, BY, COLS * CELL, ROWS * CELL, "#0d1426");
        for (let x: number = 1; x < COLS; x++) gg.drawRect(BX + x * CELL, BY, 1, ROWS * CELL, "#22304e");
        for (let y: number = 1; y < ROWS; y++) gg.drawRect(BX, BY + y * CELL, COLS * CELL, 1, "#22304e");
        this.addChild(this.gridSp);

        this.boardSp = new Laya.Sprite();
        this.addChild(this.boardSp);

        // 右侧：下一个
        let p1: Laya.Sprite = new Laya.Sprite();
        roundRect(p1.graphics, 364, 168, 252, 180, 14, THEME.panel, THEME.border, 2);
        this.addChild(p1);
        this.addChild(makeLabel("下一个", 384, 180, 200, 36, 22, THEME.sub, "left", true));
        this.previewSp = new Laya.Sprite();
        this.addChild(this.previewSp);

        // 右侧：分数
        let p2: Laya.Sprite = new Laya.Sprite();
        roundRect(p2.graphics, 364, 364, 252, 108, 14, THEME.panel, THEME.border, 2);
        this.addChild(p2);
        this.addChild(makeLabel("分数", 384, 374, 200, 30, 20, THEME.sub, "left"));
        this.scoreLbl = makeLabel("0", 384, 402, 212, 58, 40, THEME.gold, "left", true);
        this.addChild(this.scoreLbl);

        // 右侧：等级 / 消行 / 最高分
        let p3: Laya.Sprite = new Laya.Sprite();
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

        // 右侧：操作说明
        let p4: Laya.Sprite = new Laya.Sprite();
        roundRect(p4.graphics, 364, 644, 252, 172, 14, THEME.panel, THEME.border, 2);
        this.addChild(p4);
        this.addChild(makeLabel("键盘操作", 384, 654, 200, 32, 20, THEME.sub, "left", true));
        let helps: string[] = ["←  →   左右移动", "↑ / X   旋转方块", "↓       加速下落", "空格    直接落地", "P       暂停 / 继续"];
        for (let i: number = 0; i < helps.length; i++) {
            this.addChild(makeLabel(helps[i], 384, 690 + i * 25, 220, 26, 18, THEME.text, "left"));
        }

        // 底部操作按钮
        this.addChild(makeButton("左移", 24, 848, 112, 84, THEME.panelLight, THEME.text, this, null, 24, () => this.setHold(1)));
        this.addChild(makeButton("旋转", 146, 848, 112, 84, THEME.panelLight, THEME.text, this, () => this.rotate(1), 24));
        this.addChild(makeButton("右移", 268, 848, 112, 84, THEME.panelLight, THEME.text, this, null, 24, () => this.setHold(2)));
        this.addChild(makeButton("下落", 390, 848, 112, 84, THEME.panelLight, THEME.text, this, null, 24, () => this.setHold(3)));
        this.addChild(makeButton("速降", 512, 848, 104, 84, THEME.primary, "#ffffff", this, this.hardDrop, 24));

        this.addChild(makeButton("暂停 / 继续", 24, 948, 190, 74, THEME.panel, THEME.text, this, this.togglePause, 24));
        this.addChild(makeButton("重新开始", 224, 948, 190, 74, THEME.panel, THEME.text, this, this.startGame, 24));
        this.addChild(makeButton("返回大厅", 424, 948, 192, 74, THEME.panel, THEME.text, this, this.goMenu, 24));
        this.addChild(makeLabel("按住「左移 / 右移 / 下落」可连续操作", 24, 1040, 592, 40, 20, THEME.sub, "center"));

        // 暂停 / 结束遮罩
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

    private updateHUD(): void {
        this.scoreLbl.text = "" + this.score;
        this.levelLbl.text = "" + this.level;
        this.linesLbl.text = "" + this.lines;
        this.bestLbl.text = "" + Math.max(this.best, this.score);
    }

    // ---------------------------------------------------------------- 游戏流程
    private startGame(): void {
        this.board = [];
        for (let y: number = 0; y < ROWS; y++) this.board.push(new Array(COLS).fill(0));
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

    private nextFromBag(): number {
        if (!this.bag.length) {
            this.bag = [0, 1, 2, 3, 4, 5, 6];
            for (let i: number = this.bag.length - 1; i > 0; i--) {
                let j: number = Math.floor(Math.random() * (i + 1));
                let t: number = this.bag[i];
                this.bag[i] = this.bag[j];
                this.bag[j] = t;
            }
        }
        return this.bag.pop();
    }

    private spawn(): void {
        let type: number = this.nextType;
        this.nextType = this.nextFromBag();
        let m: number[][] = cloneMatrix(TETROMINOES[type].matrix);
        this.cur = { shape: type, matrix: m, x: Math.floor((COLS - m.length) / 2), y: 0 };
        this.acc = 0;
        this.renderPreview();
        if (!this.canPlace(m, this.cur.x, 0)) {
            this.renderBoard();
            this.onGameOver();
        } else {
            this.renderBoard();
        }
    }

    private canPlace(m: number[][], px: number, py: number): boolean {
        for (let y: number = 0; y < m.length; y++) {
            for (let x: number = 0; x < m[y].length; x++) {
                if (!m[y][x]) continue;
                let bx: number = px + x;
                let by: number = py + y;
                if (bx < 0 || bx >= COLS || by >= ROWS) return false;
                if (by >= 0 && this.board[by][bx]) return false;
            }
        }
        return true;
    }

    private ghostY(): number {
        let y: number = this.cur.y;
        while (this.canPlace(this.cur.matrix, this.cur.x, y + 1)) y++;
        return y;
    }

    private move(dx: number): void {
        if (!this.cur || this.paused || this.gameOver) return;
        if (this.canPlace(this.cur.matrix, this.cur.x + dx, this.cur.y)) {
            this.cur.x += dx;
            this.renderBoard();
        }
    }

    private rotate(dir: number): void {
        if (!this.cur || this.paused || this.gameOver) return;
        let m: number[][] = rotateMatrix(this.cur.matrix, dir);
        let kicks: number[][] = [[0, 0], [-1, 0], [1, 0], [-2, 0], [2, 0], [0, -1], [-1, -1], [1, -1]];
        for (let i: number = 0; i < kicks.length; i++) {
            let nx: number = this.cur.x + kicks[i][0];
            let ny: number = this.cur.y + kicks[i][1];
            if (this.canPlace(m, nx, ny)) {
                this.cur.matrix = m;
                this.cur.x = nx;
                this.cur.y = ny;
                this.renderBoard();
                return;
            }
        }
    }

    private softDrop(): void {
        if (!this.cur || this.paused || this.gameOver) return;
        this.stepDown(true);
    }

    private hardDrop(): void {
        if (!this.cur || this.paused || this.gameOver) return;
        let gy: number = this.ghostY();
        this.score += (gy - this.cur.y) * 2;
        this.cur.y = gy;
        this.updateHUD();
        this.lockPiece();
    }

    private stepDown(soft: boolean): void {
        if (!this.cur || this.paused || this.gameOver) return;
        if (this.canPlace(this.cur.matrix, this.cur.x, this.cur.y + 1)) {
            this.cur.y++;
            if (soft) {
                this.score += 1;
                this.updateHUD();
            }
        } else {
            this.lockPiece();
        }
        this.acc = 0;
        this.renderBoard();
    }

    private lockPiece(): void {
        let self: TetrisScene = this;
        eachCell(this.cur.matrix, (cx: number, cy: number) => {
            let by: number = self.cur.y + cy;
            let bx: number = self.cur.x + cx;
            if (by >= 0 && by < ROWS && bx >= 0 && bx < COLS) self.board[by][bx] = self.cur.shape + 1;
        });
        this.clearLines();
        this.spawn();
    }

    private clearLines(): void {
        let cleared: number = 0;
        for (let y: number = ROWS - 1; y >= 0; y--) {
            let full: boolean = true;
            for (let x: number = 0; x < COLS; x++) {
                if (!this.board[y][x]) { full = false; break; }
            }
            if (full) {
                this.board.splice(y, 1);
                this.board.unshift(new Array(COLS).fill(0));
                cleared++;
                y++;
            }
        }
        if (cleared > 0) {
            let table: number[] = [0, 100, 300, 500, 800];
            this.score += (table[cleared] || 800) * this.level;
            this.lines += cleared;
            this.level = Math.floor(this.lines / 10) + 1;
            this.dropInterval = Math.max(100, 800 - (this.level - 1) * 65);
        }
        this.updateHUD();
    }

    private onGameOver(): void {
        this.gameOver = true;
        if (this.score > this.best) {
            this.best = this.score;
            this.saveBest(this.best);
        }
        this.updateHUD();
        this.showOverlay("游戏结束", "本局得分  " + this.score + "\n最高分  " + this.best, "再来一局", "over");
    }

    private togglePause(): void {
        if (this.gameOver) return;
        this.paused = !this.paused;
        if (this.paused) {
            this.heldDir = 0;
            this.showOverlay("已暂停", "休息一下，随时回来继续", "继续游戏", "pause");
        } else {
            this.hideOverlay();
        }
    }

    private showOverlay(title: string, desc: string, btnText: string, mode: string): void {
        this.overlayTitle.text = title;
        this.overlayDesc.text = desc;
        setButtonText(this.overlayBtn, btnText);
        this.overlayMode = mode;
        this.overlay.visible = true;
    }

    private hideOverlay(): void {
        this.overlay.visible = false;
    }

    private onOverlayAction(): void {
        if (this.overlayMode === "pause") this.togglePause();
        else this.startGame();
    }

    private goMenu(): void {
        Laya.Scene.open(SCENE_MENU);
    }

    // ---------------------------------------------------------------- 输入与主循环
    private setHold(dir: number): void {
        if (this.paused || this.gameOver) return;
        this.heldDir = dir;
        this.holdTime = 0;
        this.holdDelay = 190;
        this.applyHold(dir);
    }

    private applyHold(dir: number): void {
        if (dir === 1) this.move(-1);
        else if (dir === 2) this.move(1);
        else if (dir === 3) this.softDrop();
    }

    private onStageUp(e: any = null): void {
        this.heldDir = 0;
    }

    private onKeyDown(e: any): void {
        let k: number = e.keyCode;
        if (k === 27) { this.goMenu(); return; }
        if (k === 80) { this.togglePause(); return; }
        if (this.gameOver) {
            if (k === 13 || k === 32) this.startGame();
            return;
        }
        if (this.paused) return;
        switch (k) {
            case 37: this.move(-1); break;
            case 39: this.move(1); break;
            case 40: this.softDrop(); break;
            case 38: case 88: this.rotate(1); break;
            case 90: this.rotate(-1); break;
            case 32: this.hardDrop(); break;
        }
    }

    private onUpdate(): void {
        let now: number = Date.now();
        if (!this.lastTime) this.lastTime = now;
        let dt: number = Math.min(now - this.lastTime, 100);
        this.lastTime = now;
        if (this.paused || this.gameOver) { this.heldDir = 0; return; }

        if (this.heldDir !== 0) {
            this.holdTime += dt;
            if (this.holdTime >= this.holdDelay) {
                this.holdTime = 0;
                this.holdDelay = 70;
                this.applyHold(this.heldDir);
            }
        }

        this.acc += dt;
        if (this.acc >= this.dropInterval) this.stepDown(false);
    }

    // ---------------------------------------------------------------- 绘制
    private drawCell(g: Laya.Graphics, px: number, py: number, size: number, type: number): void {
        let t: Tetromino = TETROMINOES[type - 1];
        g.drawRect(px, py, size, size, t.color, "#0a1020", 1);
        g.drawRect(px + 3, py + 3, size - 6, 4, t.light);
        g.drawRect(px + 3, py + size - 7, size - 6, 4, "#0a1020");
    }

    private renderBoard(): void {
        let g: Laya.Graphics = this.boardSp.graphics;
        g.clear();
        for (let y: number = 0; y < ROWS; y++) {
            for (let x: number = 0; x < COLS; x++) {
                let v: number = this.board[y][x];
                if (v) this.drawCell(g, BX + x * CELL, BY + y * CELL, CELL, v);
            }
        }
        if (!this.cur) return;
        let type: number = this.cur.shape + 1;
        let gy: number = this.ghostY();
        if (gy !== this.cur.y) {
            eachCell(this.cur.matrix, (cx: number, cy: number) => {
                let by: number = gy + cy;
                if (by < 0) return;
                g.drawRect(BX + (this.cur.x + cx) * CELL, BY + by * CELL, CELL, CELL, "#182a48", THEME.primary, 2);
            });
        }
        eachCell(this.cur.matrix, (cx: number, cy: number) => {
            let by: number = this.cur.y + cy;
            if (by < 0) return;
            this.drawCell(g, BX + (this.cur.x + cx) * CELL, BY + by * CELL, CELL, type);
        });
    }

    private renderPreview(): void {
        let g: Laya.Graphics = this.previewSp.graphics;
        g.clear();
        let m: number[][] = TETROMINOES[this.nextType].matrix;
        let minX: number = 99, maxX: number = -1, minY: number = 99, maxY: number = -1;
        eachCell(m, (x: number, y: number) => {
            minX = Math.min(minX, x); maxX = Math.max(maxX, x);
            minY = Math.min(minY, y); maxY = Math.max(maxY, y);
        });
        let w: number = (maxX - minX + 1) * PREVIEW_CELL;
        let h: number = (maxY - minY + 1) * PREVIEW_CELL;
        let ox: number = 364 + (252 - w) / 2 - minX * PREVIEW_CELL;
        let oy: number = 226 + (112 - h) / 2 - minY * PREVIEW_CELL;
        eachCell(m, (x: number, y: number) => {
            this.drawCell(g, ox + x * PREVIEW_CELL, oy + y * PREVIEW_CELL, PREVIEW_CELL, this.nextType + 1);
        });
    }
}
