import { ui } from "../../../ui/layaMaxUI";

export default class PhysicalCollisionRT extends ui.uiDemo.useUI.PhysicalCollisionUI {

    onEnable(): void {
        this.bTop.getComponent(Laya.BoxCollider).width = this.bTop.width;
        this.bBottom.getComponent(Laya.BoxCollider).width = this.bBottom.width;
        this.bRight.getComponent(Laya.BoxCollider).height = this.bRight.height;
        this.bLeft.getComponent(Laya.BoxCollider).height = this.bLeft.height;
    }
}