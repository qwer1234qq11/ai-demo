export default class CloseBtn extends Laya.Script {

    constructor() { super(); }

    onEnable(): void {
    }

    onClick(e: Laya.Event): void {
        //当点击按钮时，返回到主场景
        Laya.Scene.open("Index.scene");
    }

    onDisable(): void {
    }
}