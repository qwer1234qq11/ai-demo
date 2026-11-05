import { ui } from "../../ui/layaMaxUI";
import IframeElementRT from "./page/IframeElementRT";

export default class UiMainRT extends ui.uiDemo.UiMainUI {

    constructor() {
        super();
        Laya.stage.screenMode = Laya.Stage.SCREEN_HORIZONTAL;
        Laya.stage.alignH = "left";
    }

    onEnable(): void {
        //在开启物理辅助线的情况下，设置默认隐藏
        Laya.PhysicsDebugDraw.I && Laya.PhysicsDebugDraw.I.visible && (Laya.PhysicsDebugDraw.I.visible = false);

        this.tabBindViewStack();
        // this.onClicked();
    }

    /**侦听某些点击事件  */
    onClicked(): void {
        let openSceneBtn: Laya.Button = this.item2Tab.getChildByName("item2") as Laya.Button,
            openSceneBtn2: Laya.Button = this.item2Tab.getChildByName("item3") as Laya.Button,
            openDialogBtn: Laya.Button = this.item2Tab.getChildByName("item4") as Laya.Button;

        openSceneBtn.on(Laya.Event.MOUSE_DOWN, this, () => { Laya.Scene.open("uiDemo/page/OpenMainScene.scene", false) });
        openSceneBtn2.on(Laya.Event.MOUSE_DOWN, this, () => { Laya.Scene.open("uiDemo/page/OpenScene.scene", false) });
        openDialogBtn.on(Laya.Event.MOUSE_DOWN, this, () => { Laya.Scene.open("uiDemo/Dialog.scene", false, { "title": "弹窗的标题", "text": "弹窗的具体文本……" }) });
    }

    /**关联tab与ViewStack的索引关系*/
    tabBindViewStack(): void {
        //关联顶部tab的选项与ViewStack的索引关系
        this.topTab.selectHandler = new Laya.Handler(this, (index: number) => {
            this.tabPage.selectedIndex = index;
            //处理物理辅助线
            Laya.PhysicsDebugDraw.I && Laya.PhysicsDebugDraw.I.visible && (Laya.PhysicsDebugDraw.I.visible = false);
            //处理DOM视频
            !!IframeElementRT.instance.iframeElement && IframeElementRT.instance.closeVideo();
            index == 2 && this.item2Page.selectedIndex == 1 && !IframeElementRT.instance.iframeElement && IframeElementRT.instance.createElementVideo();
        });

        //关联子级tab选项与ViewStack的索引关系
        this.item0Tab.selectHandler = new Laya.Handler(this, (index: number) => {
            this.item0Page.selectedIndex = index
        });
        this.item1Tab.selectHandler = new Laya.Handler(this, (index: number) => {
            this.item1Page.selectedIndex = index;
            if (index !== 4 && Laya.PhysicsDebugDraw.I && Laya.PhysicsDebugDraw.I.visible) Laya.PhysicsDebugDraw.I.visible = false;
            else if (index == 4 && Laya.PhysicsDebugDraw.I && !Laya.PhysicsDebugDraw.I.visible) Laya.PhysicsDebugDraw.I.visible = true;
        });
        this.item2Tab.selectHandler = new Laya.Handler(this, (index: number) => {
            this.item2Page.selectedIndex = index;
            switch (index) {
                case 1:
                    !IframeElementRT.instance.iframeElement && IframeElementRT.instance.createElementVideo();
                    break;
                case 2:
                    Laya.Scene.open("uiDemo/page/OpenMainScene.scene", false);
                    break;
                case 3:
                    Laya.Scene.open("uiDemo/page/OpenScene.scene", false);
                    break;
                case 4:
                    Laya.Scene.open("uiDemo/Dialog.scene", false, { "title": "弹窗的标题", "text": "弹窗的具体文本……" });
                    break;
            }

            index !== 1 && !!IframeElementRT.instance.iframeElement && IframeElementRT.instance.closeVideo();
        });
        this.item3Tab.selectHandler = new Laya.Handler(this, (index: number) => {
            this.item3Page.selectedIndex = index
        });
        this.item4Tab.selectHandler = new Laya.Handler(this, (index: number) => {
            this.item4Page.selectedIndex = index
        });
    }

    onDisable(): void {
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.stage.alignH = "left";
    }
}