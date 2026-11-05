import { THEME, roundRect, makeLabel } from "./UIUtil";

const SCENE_BOX: string = "test/TestScene.scene";
const SCENE_TETRIS: string = "test/TetrisScene.scene";

/** 游戏大厅：选择进入不同的游戏 */
export default class MenuScene extends Laya.Scene {
    constructor() {
        super();
    }

    onOpened(param: any = null): void {
        this.size(640, 1136);

        let bg: Laya.Sprite = new Laya.Sprite();
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

    private makeCard(y: number, title: string, desc: string, tag: string, color: string, light: string, kind: number, url: string): Laya.Sprite {
        let card: Laya.Sprite = new Laya.Sprite();
        card.pos(60, y);
        card.size(520, 220);
        card.mouseEnabled = true;
        roundRect(card.graphics, 0, 0, 520, 220, 20, THEME.panel, THEME.border, 2);
        card.graphics.drawRect(28, 0, 110, 4, color);
        this.drawIcon(card, kind, color, light);

        card.addChild(makeLabel(title, 172, 34, 326, 56, 36, THEME.text, "left", true));
        card.addChild(makeLabel("●  " + tag, 172, 96, 300, 34, 20, color, "left"));

        let d: Laya.Text = makeLabel(desc, 172, 138, 326, 72, 21, THEME.sub, "left");
        d.wordWrap = true;
        d.leading = 6;
        d.valign = "top";
        card.addChild(d);

        let arrow: Laya.Text = makeLabel(">", 462, 86, 40, 50, 40, THEME.sub, "center", true);
        card.addChild(arrow);

        card.on(Laya.Event.MOUSE_DOWN, this, () => { card.alpha = 0.8; });
        card.on(Laya.Event.MOUSE_UP, this, () => { card.alpha = 1; });
        card.on(Laya.Event.MOUSE_OUT, this, () => { card.alpha = 1; });
        card.on(Laya.Event.CLICK, this, () => { Laya.Scene.open(url); });
        return card;
    }

    private drawIcon(sp: Laya.Sprite, kind: number, color: string, light: string): void {
        let g: Laya.Graphics = sp.graphics;
        let cells: number[][];
        if (kind === 0) {
            cells = [[0, 0], [1, 0], [2, 1], [0, 2], [2, 2], [1, 3]];
        } else {
            cells = [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2], [2, 2]];
        }
        roundRect(g, 32, 40, 120, 140, 14, "#0f172b", THEME.border, 2);
        for (let i: number = 0; i < cells.length; i++) {
            let x: number = 48 + cells[i][0] * 28;
            let y: number = 54 + cells[i][1] * 30;
            g.drawRect(x, y, 24, 24, color, "#0b1020", 1);
            g.drawRect(x + 3, y + 3, 18, 3, light);
        }
    }
}
