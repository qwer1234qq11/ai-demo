export default class OpenScene extends Laya.Script {

    constructor() { super(); }

    onEnable(): void {
        let _window: Laya.Image, closeBtn: Laya.Sprite;
        _window = this.owner.getChildByName("window") as Laya.Image;
        closeBtn = _window.getChildByName("closeBtn") as Laya.Sprite;

        _window.on(Laya.Event.MOUSE_DOWN, this, () => { _window.startDrag(); });
        closeBtn.on(Laya.Event.MOUSE_DOWN, this, () => { (<Laya.View>this.owner).close() });
    }

    onDisable(): void {
    }
}