import { ui } from "../../../ui/layaMaxUI";

import Event = Laya.Event;
import Mouse = Laya.Mouse;
export default class UsePanelRT extends ui.uiDemo.page.UsePanelUI {
    constructor() { super(); }

    onEnable(): void {
        if (!(Laya.Browser.onPC)) {
            this.topLab.changeText("背景可拖拽，双指缩放改变大小");
        } else {
            this._panel.on(Event.MOUSE_OVER, this, () => { Mouse.cursor = "move" });
            this._panel.on(Event.MOUSE_OUT, this, () => { Mouse.cursor = "auto" });
        }
    }
}