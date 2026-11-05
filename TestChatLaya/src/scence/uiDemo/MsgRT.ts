import { ui } from "../../ui/layaMaxUI";

export default class MsgRT extends ui.uiDemo.MsgUI {
    constructor() { super(); }

    onOpened(param: any): void {
        if (param) {
            this.msgLab.x = param.point && param.point.x ? param.point.x : Laya.stage.mouseX - 50;
            this.msgLab.y = param.point && param.point.y ? param.point.y : Laya.stage.mouseY - 80;
            //传入的文本
            this.msgLab.changeText(param.text);

            Laya.Tween.to(this.msgLab, { y: this.msgLab.y - 100, alpha: 0 }, 1000, Laya.Ease.linearNone);
        }
    }
}