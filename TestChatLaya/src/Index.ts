export default class Index extends Laya.Script {
    //通过IDE组件属性的方式，将按钮节点绑定到组件的类成员属性上，方便直接使用对应的节点对象
    /** @prop {name:uiBtn, type:Node} */
    private uiBtn: Laya.Button;
    /** @prop {name:phyBtn, type:Node} */
    private phyBtn: Laya.Button;
    /** @prop {name:d3Btn, type:Node} */
    private d3Btn: Laya.Button;

    constructor() { super(); }

    onEnable(): void {

        //侦听ui按钮点击事件
        this.uiBtn.on(Laya.Event.CLICK, this, () => {
            //点击后，打开UI场景示例
            Laya.Scene.open("uiDemo/UiMain.scene");
        });
        //侦听物理按钮点击事件
        this.phyBtn.on(Laya.Event.CLICK, this, () => {
            //点击后，打开物理游戏示例
            Laya.Scene.open("physicsDemo/PhysicsGameMain.scene");
        });
        //侦听3D混合按钮点击事件
        this.d3Btn.on(Laya.Event.CLICK, this, () => {
            //点击后，打开3D混合场景示例
            Laya.Scene.open("d3Demo/D3Main.scene");
        });
    }

    onDisable(): void {
        
    }
}