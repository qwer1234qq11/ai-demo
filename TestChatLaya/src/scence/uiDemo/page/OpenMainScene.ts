export default class OpenMainScene extends Laya.Script {


    onEnable(): void {
        this.owner.getChildByName("btn").on(Laya.Event.CLICK, this, () => { (<Laya.View>this.owner).close() });
    }

    onDisable(): void {
    }
}