const SCENE_BOX: string = "test/TestScene.scene";
const SCENE_TETRIS: string = "test/TetrisScene.scene";

/**
 * 游戏大厅：所有可见内容都在 MenuScene.scene 里静态布置好，
 * 这里只取出场景中的两张卡片（name=cardBox / cardTetris）绑定进入游戏的事件。
 */
export default class MenuScene extends Laya.Scene {
    constructor() {
        super();
    }

    onOpened(param: any = null): void {
        this.bindCard(this.getChildByName("cardBox") as Laya.Sprite, SCENE_BOX);
        this.bindCard(this.getChildByName("cardTetris") as Laya.Sprite, SCENE_TETRIS);
    }

    private bindCard(card: Laya.Sprite, url: string): void {
        card.on(Laya.Event.MOUSE_DOWN, this, () => { card.alpha = 0.8; });
        card.on(Laya.Event.MOUSE_UP, this, () => { card.alpha = 1; });
        card.on(Laya.Event.MOUSE_OUT, this, () => { card.alpha = 1; });
        card.on(Laya.Event.CLICK, this, () => { Laya.Scene.open(url); });
    }
}
