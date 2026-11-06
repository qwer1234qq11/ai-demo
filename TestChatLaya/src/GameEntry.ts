/**
 * 游戏入口场景脚本。
 * 背景、标题、规则说明、装饰和按钮都由场景静态布置，
 * 这里只处理「开始游戏」按钮的点击跳转。
 */
export default class GameEntry extends Laya.Script {
    /** @prop {name:startBtn, type:Node} */
    private startBtn: Laya.Button;

    constructor() { super(); }

    onEnable(): void {
        this.startBtn.on(Laya.Event.CLICK, this, this.onStartClick);
    }

    private onStartClick(): void {
        Laya.Scene.open("physicsDemo/PhysicsGameMain.scene");
    }

    onDisable(): void {
        this.startBtn.off(Laya.Event.CLICK, this, this.onStartClick);
    }
}
