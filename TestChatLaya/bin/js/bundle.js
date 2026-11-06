(function () {
    'use strict';

    class CloseBtn extends Laya.Script {
        constructor() { super(); }
        onEnable() {
        }
        onClick(e) {
            Laya.Scene.open("Index.scene");
        }
        onDisable() {
        }
    }

    var KeyBoardManager = Laya.KeyBoardManager;
    var Keyboard = Laya.Keyboard;
    var Vector3 = Laya.Vector3;
    class D3Main extends Laya.Script {
        constructor() {
            super(...arguments);
            this.scene3D = new Laya.Scene3D();
            this.turnLeft = true;
            this._rotation = new Vector3(0, 0, 0);
            this.rotationW = new Vector3(0, 0, 0);
            this.rotationS = new Vector3(0, 180, 0);
            this.rotationA = new Vector3(0, 90, 0);
            this.rotationD = new Vector3(0, -90, 0);
            this.sp3Role = new Laya.Sprite3D();
        }
        onEnable() {
            this.spDude = this.owner.getChildByName("spDude");
            this.spFatso = this.owner.getChildByName("spFatso");
            this.spMonkey = this.owner.getChildByName("spMonkey");
            this.spTrail = this.owner.getChildByName("spTrail");
            this.setStage();
            this.sceneInit();
            Laya.timer.frameOnce(1, this, () => {
                this._3Dto2D("d3/dude/dude.lh", this.spDude, 1, true);
                this.spDude.pos(30, 768);
                this._3Dto2D("d3/LayaMonkey2/LayaMonkey.lh", this.spMonkey, 2);
                this.spMonkey.pos(150, 110);
                this._3Dto2D("d3/BoneLinkScene/PangZi.lh", this.spFatso, 3);
                this.spFatso.pos(300, 380);
                this._3Dto2D("d3/trail/Cube.lh", this.spTrail, 5);
                this.spTrail.pos(100, 500);
            });
        }
        setStage() {
            Laya.stage.useRetinalCanvas = false;
            Laya.stage.width = 640;
            Laya.stage.height = 1136;
            Laya.stage.scaleMode = Laya.Stage.SCALE_SHOWALL;
            Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;
            Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE;
        }
        sceneInit() {
            Laya.stage.addChild(this.scene3D);
            let directionLight = new Laya.DirectionLight();
            this.scene3D.addChild(directionLight);
            directionLight.intensity = 0.9;
        }
        _3Dto2D(lh, sp, layer, isRole = false) {
            Laya.Sprite3D.load(lh, Laya.Handler.create(this, (sp3) => {
                this.scene3D.addChild(sp3);
                let _camera = new Laya.Camera(0, 0.1, 1000);
                this.scene3D.addChild(_camera);
                _camera.transform.rotate(new Vector3(-45, 0, 0), false, false);
                _camera.clearColor = new Laya.Vector4(0, 0, 0, 0);
                _camera.orthographic = true;
                _camera.orthographicVerticalSize = 10;
                _camera.removeAllLayers();
                _camera.addLayer(layer);
                sp3.getChildAt(0).getChildAt(0).layer = layer;
                let _tempPos = new Vector3(0, 0, 0);
                _camera.convertScreenCoordToOrthographicCoord(new Vector3(220, 900, 0), _tempPos);
                sp3.transform.position = _tempPos;
                sp3.transform.localScale = new Vector3(1, 1, 1);
                _camera.renderTarget = new Laya.RenderTexture(256, 256, Laya.RenderTextureFormat.R8G8B8A8, Laya.RenderTextureDepthFormat.DEPTHSTENCIL_24_8);
                sp.texture = new Laya.Texture(_camera.renderTarget);
                isRole && (this.sp3Role = sp3);
            }));
        }
        onUpdate() {
            if (this.spTrail.x < 20 && this.turnLeft)
                this.turnLeft = false;
            else if (this.spTrail.x > (Laya.stage.width - 200) && !(this.turnLeft))
                this.turnLeft = true;
            if (this.turnLeft)
                this.spTrail.x -= 1;
            else
                this.spTrail.x += 1;
            if (KeyBoardManager.hasKeyDown(Keyboard.W)) {
                this.spDude.y -= 1;
                this.rotateRole(this.rotationW);
            }
            else if (KeyBoardManager.hasKeyDown(Keyboard.S)) {
                this.spDude.y += 1;
                this.rotateRole(this.rotationS);
            }
            else if (KeyBoardManager.hasKeyDown(Keyboard.A)) {
                this.spDude.x -= 1;
                this.rotateRole(this.rotationA);
            }
            else if (KeyBoardManager.hasKeyDown(Keyboard.D)) {
                this.spDude.x += 1;
                this.rotateRole(this.rotationD);
            }
        }
        rotateRole(r) {
            if (r === this._rotation)
                return;
            this.sp3Role.transform.rotationEuler = r;
            this._rotation = r;
        }
        onDisable() {
            Laya.stage.useRetinalCanvas = true;
            Laya.stage.width = 1334;
            Laya.stage.height = 750;
            Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_WIDTH;
            Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE;
            this.scene3D.destroy();
        }
    }

    class GameEntry extends Laya.Script {
        constructor() { super(); }
        onEnable() {
            this.startBtn.on(Laya.Event.CLICK, this, this.onStartClick);
        }
        onStartClick() {
            Laya.Scene.open("physicsDemo/PhysicsGameMain.scene");
        }
        onDisable() {
            this.startBtn.off(Laya.Event.CLICK, this, this.onStartClick);
        }
    }

    class Index extends Laya.Script {
        constructor() { super(); }
        onEnable() {
            this.uiBtn.on(Laya.Event.CLICK, this, () => {
                Laya.Scene.open("uiDemo/UiMain.scene");
            });
            this.phyBtn.on(Laya.Event.CLICK, this, () => {
                Laya.Scene.open("physicsDemo/PhysicsGameMain.scene");
            });
            this.d3Btn.on(Laya.Event.CLICK, this, () => {
                Laya.Scene.open("d3Demo/D3Main.scene");
            });
        }
        onDisable() {
        }
    }

    var View = Laya.View;
    var Dialog = Laya.Dialog;
    var Scene = Laya.Scene;
    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        var ani;
        (function (ani) {
            class saceToNormalUI extends Laya.EffectAnimation {
                constructor() { super(); this.effectData = saceToNormalUI.uiView; }
            }
            saceToNormalUI.uiView = { "type": "View", "props": {}, "compId": 2, "child": [{ "type": "Sprite", "props": { "y": 0, "x": 0, "texture": "comp/x.png" }, "compId": 3 }], "animations": [{ "nodes": [{ "target": 3, "keyframes": { "scaleY": [{ "value": 0.8, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 0 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 5 }], "scaleX": [{ "value": 0.8, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 0 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 5 }] } }], "name": "ani1", "id": 1, "frameRate": 24, "action": 0 }], "loadList": ["comp/x.png"], "loadList3D": [] };
            ani.saceToNormalUI = saceToNormalUI;
            REG("ui.ani.saceToNormalUI", saceToNormalUI);
            class scaleUI extends Laya.EffectAnimation {
                constructor() { super(); this.effectData = scaleUI.uiView; }
            }
            scaleUI.uiView = { "type": "View", "props": {}, "compId": 2, "child": [{ "type": "Button", "props": { "y": 0, "x": 0, "skin": "comp/button.png", "label": "label", "labelSize": 28, "labelFont": "SimHei", "labelColors": "#fff,#fff,#e7ce4e", "sizeGrid": "14,16,15,19", "width": 160, "labelPadding": "0,0,1,0" }, "compId": 3 }], "animations": [{ "nodes": [{ "target": 3, "keyframes": { "scaleY": [{ "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 0 }, { "value": 1.2, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 12 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 24 }], "scaleX": [{ "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 0 }, { "value": 1.2, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 12 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 24 }] } }], "name": "ani1", "id": 1, "frameRate": 60, "action": 0 }], "loadList": ["comp/button.png"], "loadList3D": [] };
            ani.scaleUI = scaleUI;
            REG("ui.ani.scaleUI", scaleUI);
            class scaleToBigUI extends Laya.EffectAnimation {
                constructor() { super(); this.effectData = scaleToBigUI.uiView; }
            }
            scaleToBigUI.uiView = { "type": "View", "props": {}, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "comp/img_blank.png" }, "compId": 3 }], "animations": [{ "nodes": [{ "target": 3, "keyframes": { "scaleY": [{ "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 0 }, { "value": 1.2, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 6 }], "scaleX": [{ "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 0 }, { "value": 1.2, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 6 }] } }], "name": "ani1", "id": 1, "frameRate": 24, "action": 0 }], "loadList": ["comp/img_blank.png"], "loadList3D": [] };
            ani.scaleToBigUI = scaleToBigUI;
            REG("ui.ani.scaleToBigUI", scaleToBigUI);
            class scaleToSmallUI extends Laya.EffectAnimation {
                constructor() { super(); this.effectData = scaleToSmallUI.uiView; }
            }
            scaleToSmallUI.uiView = { "type": "View", "props": {}, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "comp/img_hd.png" }, "compId": 4 }], "animations": [{ "nodes": [{ "target": 4, "keyframes": { "scaleY": [{ "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "scaleY", "index": 0 }, { "value": 0.8, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "scaleY", "index": 6 }], "scaleX": [{ "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "scaleX", "index": 0 }, { "value": 0.8, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "scaleX", "index": 6 }] } }], "name": "ani1", "id": 1, "frameRate": 24, "action": 0 }], "loadList": ["comp/img_hd.png"], "loadList3D": [] };
            ani.scaleToSmallUI = scaleToSmallUI;
            REG("ui.ani.scaleToSmallUI", scaleToSmallUI);
        })(ani = ui.ani || (ui.ani = {}));
    })(ui || (ui = {}));
    (function (ui) {
        class LoadingUI extends View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.loadScene("Loading");
            }
        }
        ui.LoadingUI = LoadingUI;
        REG("ui.LoadingUI", LoadingUI);
    })(ui || (ui = {}));
    (function (ui) {
        var physicsDemo;
        (function (physicsDemo) {
            class PhysicsGameMainUI extends View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("physicsDemo/PhysicsGameMain");
                }
            }
            physicsDemo.PhysicsGameMainUI = PhysicsGameMainUI;
            REG("ui.physicsDemo.PhysicsGameMainUI", PhysicsGameMainUI);
        })(physicsDemo = ui.physicsDemo || (ui.physicsDemo = {}));
    })(ui || (ui = {}));
    (function (ui) {
        var uiDemo;
        (function (uiDemo) {
            var animation;
            (function (animation) {
                class AniEffectUI extends View {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.loadScene("uiDemo/animation/AniEffect");
                    }
                }
                animation.AniEffectUI = AniEffectUI;
                REG("ui.uiDemo.animation.AniEffectUI", AniEffectUI);
                class AtlasAniUI extends View {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.loadScene("uiDemo/animation/AtlasAni");
                    }
                }
                animation.AtlasAniUI = AtlasAniUI;
                REG("ui.uiDemo.animation.AtlasAniUI", AtlasAniUI);
                class FrameAniUI extends View {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.loadScene("uiDemo/animation/FrameAni");
                    }
                }
                animation.FrameAniUI = FrameAniUI;
                REG("ui.uiDemo.animation.FrameAniUI", FrameAniUI);
                class TimelineAniUI extends View {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.loadScene("uiDemo/animation/TimelineAni");
                    }
                }
                animation.TimelineAniUI = TimelineAniUI;
                REG("ui.uiDemo.animation.TimelineAniUI", TimelineAniUI);
                class TweenAniUI extends View {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.loadScene("uiDemo/animation/TweenAni");
                    }
                }
                animation.TweenAniUI = TweenAniUI;
                REG("ui.uiDemo.animation.TweenAniUI", TweenAniUI);
            })(animation = uiDemo.animation || (uiDemo.animation = {}));
        })(uiDemo = ui.uiDemo || (ui.uiDemo = {}));
    })(ui || (ui = {}));
    (function (ui) {
        var uiDemo;
        (function (uiDemo) {
            class DialogUI extends Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("uiDemo/Dialog");
                }
            }
            uiDemo.DialogUI = DialogUI;
            REG("ui.uiDemo.DialogUI", DialogUI);
            class MsgUI extends View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("uiDemo/Msg");
                }
            }
            uiDemo.MsgUI = MsgUI;
            REG("ui.uiDemo.MsgUI", MsgUI);
            class UiMainUI extends View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("uiDemo/UiMain");
                }
            }
            uiDemo.UiMainUI = UiMainUI;
            REG("ui.uiDemo.UiMainUI", UiMainUI);
        })(uiDemo = ui.uiDemo || (ui.uiDemo = {}));
    })(ui || (ui = {}));
    (function (ui) {
        var uiDemo;
        (function (uiDemo) {
            var interactive;
            (function (interactive) {
                class JoystickUI extends View {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.loadScene("uiDemo/interactive/Joystick");
                    }
                }
                interactive.JoystickUI = JoystickUI;
                REG("ui.uiDemo.interactive.JoystickUI", JoystickUI);
                class ShapeDetectionUI extends View {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.loadScene("uiDemo/interactive/ShapeDetection");
                    }
                }
                interactive.ShapeDetectionUI = ShapeDetectionUI;
                REG("ui.uiDemo.interactive.ShapeDetectionUI", ShapeDetectionUI);
            })(interactive = uiDemo.interactive || (uiDemo.interactive = {}));
        })(uiDemo = ui.uiDemo || (ui.uiDemo = {}));
    })(ui || (ui = {}));
    (function (ui) {
        var uiDemo;
        (function (uiDemo) {
            var list;
            (function (list) {
                class BagListUI extends View {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.loadScene("uiDemo/list/BagList");
                    }
                }
                list.BagListUI = BagListUI;
                REG("ui.uiDemo.list.BagListUI", BagListUI);
                class ComboBoxUI extends View {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.loadScene("uiDemo/list/ComboBox");
                    }
                }
                list.ComboBoxUI = ComboBoxUI;
                REG("ui.uiDemo.list.ComboBoxUI", ComboBoxUI);
                class LoopListUI extends View {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.loadScene("uiDemo/list/LoopList");
                    }
                }
                list.LoopListUI = LoopListUI;
                REG("ui.uiDemo.list.LoopListUI", LoopListUI);
                class MailListUI extends View {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.loadScene("uiDemo/list/MailList");
                    }
                }
                list.MailListUI = MailListUI;
                REG("ui.uiDemo.list.MailListUI", MailListUI);
                class RefreshUI extends View {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.loadScene("uiDemo/list/Refresh");
                    }
                }
                list.RefreshUI = RefreshUI;
                REG("ui.uiDemo.list.RefreshUI", RefreshUI);
                class TreeListUI extends View {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.loadScene("uiDemo/list/TreeList");
                    }
                }
                list.TreeListUI = TreeListUI;
                REG("ui.uiDemo.list.TreeListUI", TreeListUI);
            })(list = uiDemo.list || (uiDemo.list = {}));
        })(uiDemo = ui.uiDemo || (ui.uiDemo = {}));
    })(ui || (ui = {}));
    (function (ui) {
        var uiDemo;
        (function (uiDemo) {
            var page;
            (function (page) {
                class IframeElementUI extends View {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.loadScene("uiDemo/page/IframeElement");
                    }
                }
                page.IframeElementUI = IframeElementUI;
                REG("ui.uiDemo.page.IframeElementUI", IframeElementUI);
                class OpenMainSceneUI extends View {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.loadScene("uiDemo/page/OpenMainScene");
                    }
                }
                page.OpenMainSceneUI = OpenMainSceneUI;
                REG("ui.uiDemo.page.OpenMainSceneUI", OpenMainSceneUI);
                class OpenSceneUI extends View {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.loadScene("uiDemo/page/OpenScene");
                    }
                }
                page.OpenSceneUI = OpenSceneUI;
                REG("ui.uiDemo.page.OpenSceneUI", OpenSceneUI);
                class UsePanelUI extends View {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.loadScene("uiDemo/page/UsePanel");
                    }
                }
                page.UsePanelUI = UsePanelUI;
                REG("ui.uiDemo.page.UsePanelUI", UsePanelUI);
            })(page = uiDemo.page || (uiDemo.page = {}));
        })(uiDemo = ui.uiDemo || (ui.uiDemo = {}));
    })(ui || (ui = {}));
    (function (ui) {
        var uiDemo;
        (function (uiDemo) {
            var useUI;
            (function (useUI) {
                class ChangeTextureUI extends View {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.loadScene("uiDemo/useUI/ChangeTexture");
                    }
                }
                useUI.ChangeTextureUI = ChangeTextureUI;
                REG("ui.uiDemo.useUI.ChangeTextureUI", ChangeTextureUI);
                class MaskUI extends View {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.loadScene("uiDemo/useUI/Mask");
                    }
                }
                useUI.MaskUI = MaskUI;
                REG("ui.uiDemo.useUI.MaskUI", MaskUI);
                class MouseThroughUI extends View {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.loadScene("uiDemo/useUI/MouseThrough");
                    }
                }
                useUI.MouseThroughUI = MouseThroughUI;
                REG("ui.uiDemo.useUI.MouseThroughUI", MouseThroughUI);
                class PhysicalCollisionUI extends View {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.loadScene("uiDemo/useUI/PhysicalCollision");
                    }
                }
                useUI.PhysicalCollisionUI = PhysicalCollisionUI;
                REG("ui.uiDemo.useUI.PhysicalCollisionUI", PhysicalCollisionUI);
                class ProgressUI extends Scene {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.loadScene("uiDemo/useUI/Progress");
                    }
                }
                useUI.ProgressUI = ProgressUI;
                REG("ui.uiDemo.useUI.ProgressUI", ProgressUI);
                class TextShowUI extends Scene {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.loadScene("uiDemo/useUI/TextShow");
                    }
                }
                useUI.TextShowUI = TextShowUI;
                REG("ui.uiDemo.useUI.TextShowUI", TextShowUI);
            })(useUI = uiDemo.useUI || (uiDemo.useUI = {}));
        })(uiDemo = ui.uiDemo || (ui.uiDemo = {}));
    })(ui || (ui = {}));

    class LoadingRT extends ui.LoadingUI {
        onAwake() {
            let resArr = [
                "bg/background.jpg",
                "bg/bg14.png",
                "bg/img_bg4.png",
                "bg/bg.png",
                "demo/fcs.jpg",
                "demo/whs.jpg",
                "res/atlas/bag.atlas",
                "res/atlas/bg.atlas",
                "res/atlas/cd.atlas",
                "res/atlas/comp.atlas",
                "role/atlasAni/139x.atlas",
                "role/spineAni/dragon.sk",
                "role/spineAni/goblins.sk",
                "res/atlas/role/frameAni.atlas",
                "res/atlas/role.atlas",
                "res/atlas/test.atlas",
                "files/layaAir.mp4"
            ];
            Laya.loader.load(resArr, Laya.Handler.create(this, this.load3D));
            Laya.loader.on(Laya.Event.ERROR, this, this.onError);
        }
        load3D() {
            let resArr3d = [
                "d3/dude/dude.lh",
                "d3/LayaMonkey2/LayaMonkey.lh",
                "d3/BoneLinkScene/PangZi.lh",
                "d3/trail/Cube.lh"
            ];
            Laya.loader.create(resArr3d, Laya.Handler.create(this, this.onLoaded), Laya.Handler.create(this, this.onLoading));
        }
        onError(err) {
            console.log("加载失败: " + err);
        }
        onLoading(progress) {
            if (progress > 0.92)
                this.progress.value = 0.95;
            else
                this.progress.value = progress;
            console.log("加载进度: " + progress, this.progress.value);
        }
        onLoaded() {
            this.progress.value = 0.98;
            console.log("加载结束", this.progress.value);
            Laya.timer.once(1000, this, () => {
                Laya.Scene.open("GameEntry.scene");
            });
        }
    }

    class PhysicsGameMain extends Laya.Script {
        constructor() {
            super();
            this.createBoxInterval = 1000;
            this._time = 0;
            this._started = false;
            this.updateStop = false;
        }
        onEnable() {
            this._time = Date.now();
            this._gameBox = this.owner.getChildByName("gameBox");
            Laya.stage.on(Laya.Event.BLUR, this, () => { this.updateStop = true; });
            Laya.stage.on(Laya.Event.FOCUS, this, () => { this.updateStop = false; });
        }
        onStart() {
            let _ground = this.owner.getChildByName("ground").getComponent(Laya.BoxCollider);
            _ground.width = Laya.stage.width;
        }
        onUpdate() {
            if (this.updateStop)
                return;
            let now = Date.now();
            if (now - this._time > this.createBoxInterval && this._started) {
                this._time = now;
                this.createBox();
            }
        }
        createBox() {
            let box = Laya.Pool.getItemByCreateFun("dropBox", this.dropBox.create, this.dropBox);
            box.pos(Math.random() * (Laya.stage.width - 100), -100);
            this._gameBox.addChild(box);
        }
        onStageClick(e) {
            e.stopPropagation();
            let flyer = Laya.Pool.getItemByCreateFun("bullet", this.bullet.create, this.bullet);
            flyer.pos(Laya.stage.mouseX, Laya.stage.mouseY);
            this._gameBox.addChild(flyer);
        }
        startGame() {
            if (!this._started) {
                this._started = true;
                this.enabled = true;
            }
        }
        stopGame() {
            this._started = false;
            this.enabled = false;
            this.createBoxInterval = 1000;
            this._gameBox.removeChildren();
        }
    }

    class PhysicsGameMainRT extends ui.physicsDemo.PhysicsGameMainUI {
        constructor() {
            super();
            PhysicsGameMainRT.instance = this;
            Laya.MouseManager.multiTouchEnabled = false;
        }
        onEnable() {
            this._control = this.getComponent(PhysicsGameMain);
            this.tipLbll.on(Laya.Event.CLICK, this, this.onTipClick);
        }
        onTipClick(e) {
            this.tipLbll.visible = false;
            this._score = 0;
            this.scoreLbl.text = "";
            this._control.startGame();
        }
        addScore(value = 1) {
            this._score += value;
            this.scoreLbl.changeText("分数：" + this._score);
            if (this._control.createBoxInterval > 600 && this._score % 20 == 0)
                this._control.createBoxInterval -= 20;
        }
        stopGame() {
            this.tipLbll.visible = true;
            this.tipLbll.text = "游戏结束了，点击屏幕重新开始";
            this._control.stopGame();
        }
    }

    class AtlasAniRT extends ui.uiDemo.animation.AtlasAniUI {
        constructor() {
            super(...arguments);
            this.isPlay = false;
        }
        onAwake() {
            this.createAniTemplate("moveB");
            this.createAniTemplate("moveC");
            this.createAniTemplate("moveE");
            this.createAniTemplate("moveF");
            this.createAniTemplate("moveH");
            this.createAniTemplate("moveI");
            this.createAniTemplate("moveK");
            this.createAniTemplate("moveL");
        }
        onEnable() {
            this.playAni.on(Laya.Event.MOUSE_DOWN, this, () => {
                this.isPlay = true;
                this.aniSource.play(0, true, this.selectAni.selectedLabel);
            });
            this.stopAni.on(Laya.Event.MOUSE_DOWN, this, () => {
                this.isPlay = false;
                this.aniSource.isPlaying && this.aniSource.stop();
            });
            this.selectAni.selectHandler = new Laya.Handler(this, () => {
                this.isPlay ? this.aniSource.play(0, true, this.selectAni.selectedLabel) : this.aniSource.play(0, false, this.selectAni.selectedLabel);
            });
        }
        createAniTemplate(name, len = 8) {
            let aniFrames = [];
            for (let i = 0; i < len; i++) {
                aniFrames.push("role/atlasAni/139x/" + name + i + ".png");
            }
            Laya.Animation.createFrames(aniFrames, name);
        }
    }

    class FrameAniRT extends ui.uiDemo.animation.FrameAniUI {
        constructor() {
            super(...arguments);
            this.isPlay = false;
        }
        onEnable() {
            this.isPlay = true;
            this.playAnimation(this.selectAni.selectedLabel);
            this.playAni.on(Laya.Event.MOUSE_DOWN, this, () => {
                this.isPlay = true;
                this.playAnimation(this.selectAni.selectedLabel);
            });
            this.stopAni.on(Laya.Event.MOUSE_DOWN, this, () => {
                this.isPlay = false;
                this.aniSource.isPlaying && this.aniSource.stop();
            });
            this.selectAni.selectHandler = new Laya.Handler(this, () => {
                this.isPlay ? this.playAnimation(this.selectAni.selectedLabel) : this.playAnimation(this.selectAni.selectedLabel, false);
            });
        }
        playAnimation(name, loop = true, len = 7) {
            let aniFrames = [];
            for (let i = 0; i < len; i++) {
                aniFrames.push("role/frameAni/" + name + i + ".png");
            }
            this.aniSource.loadImages(aniFrames).play(0, loop);
        }
    }

    var Templet = Laya.Templet;
    var Event = Laya.Event;
    var SpineTemplet = Laya.SpineTemplet;
    class SkeletonAni extends Laya.Script {
        constructor() {
            super(...arguments);
            this.skinArray = ["goblin", "goblingirl"];
            this.skinIndex = 0;
            this.spineAniIndex = 6;
        }
        onEnable() {
            this.createLayaSpine();
            this.createSpine();
        }
        createLayaSpine() {
            this.skeletonTemplet = new Templet();
            this.skeletonTemplet.on(Event.COMPLETE, this, this.parseComplete);
            this.skeletonTemplet.loadAni("role/spineAni/goblins.sk");
            this.skeletonNode = this.owner.getChildByName("skeletonNode");
        }
        createSpine() {
            this.spineTemplet = new SpineTemplet(Laya.SpineVersion.v3_8);
            this.spineTemplet.on(Event.COMPLETE, this, this.spineParseComplete);
            this.spineTemplet.loadAni("role/spineAni/spineboy-pma.skel");
            this.spineNode = this.owner.getChildByName("spineNode");
        }
        spineParseComplete() {
            this.spineAni = this.spineTemplet.buildArmature();
            this.spineNode.addChild(this.spineAni);
            this.spineAni.scale(0.3, 0.3);
            this.spineAni.pos(220, 390);
            this.spineAniNum = this.spineAni.getAnimNum();
            this.spineAni.play(this.spineAniIndex, true);
            this.spineNode.on(Event.CLICK, this, this.changeAni);
        }
        changeAni() {
            ++this.spineAniIndex >= this.spineAniNum && (this.spineAniIndex = 5);
            this.spineAni.play(this.spineAniIndex, true, true);
        }
        parseComplete() {
            this.skeletonAni = this.skeletonTemplet.buildArmature(1);
            this.skeletonNode.addChild(this.skeletonAni);
            this.skeletonAni.x = 128;
            this.skeletonAni.y = 390;
            this.skeletonAni.play(0, true);
            this.changeSkin();
            this.skeletonNode.on(Event.CLICK, this, this.changeSkin);
        }
        changeSkin() {
            this.skeletonAni.showSkinByName(this.skinArray[this.skinIndex]);
            ++this.skinIndex >= this.skinArray.length && (this.skinIndex = 0);
        }
    }

    var Keyboard$1 = Laya.Keyboard;
    var KeyBoardManager$1 = Laya.KeyBoardManager;
    class Role extends Laya.Script {
        constructor() { super(); }
        onEnable() {
            this._owner = this.owner;
            this.roleStand = this._owner.getChildByName("roleStand");
            this.roleRun = this._owner.getChildByName("roleRun");
            this.bg = this.owner.parent;
        }
        playRoleAni(name, type = "stand") {
            if (type == "run") {
                this.roleStand.visible = false;
                this.roleStand.isPlaying && this.roleStand.stop();
                this.roleRun.visible = true;
                this.roleRun.play(0, true, name);
            }
            else {
                this.roleRun.visible = false;
                this.roleRun.isPlaying && this.roleRun.stop();
                this.roleStand.play(0, true, name);
                this.roleStand.visible = true;
            }
        }
        onUpdate() {
            this.lastRoleDirection = this.roleDirection;
            if (KeyBoardManager$1.hasKeyDown(Keyboard$1.UP) || KeyBoardManager$1.hasKeyDown(Keyboard$1.W)) {
                this.roleDirection = "Up";
                this._owner.y -= 2;
                this._owner.y < 80 && (this._owner.y = 80);
            }
            else if (KeyBoardManager$1.hasKeyDown(Keyboard$1.DOWN) || KeyBoardManager$1.hasKeyDown(Keyboard$1.S)) {
                this.roleDirection = "Down";
                this._owner.y += 2;
                this._owner.y > (this.bg.height - 130) && (this._owner.y = this.bg.height - 130);
            }
            else if (KeyBoardManager$1.hasKeyDown(Keyboard$1.LEFT) || KeyBoardManager$1.hasKeyDown(Keyboard$1.A)) {
                this.roleDirection = "Left";
                this._owner.x -= 2;
                this._owner.x < 30 && (this._owner.x = 30);
            }
            else if (KeyBoardManager$1.hasKeyDown(Keyboard$1.RIGHT) || KeyBoardManager$1.hasKeyDown(Keyboard$1.D)) {
                this.roleDirection = "Right";
                this._owner.x += 2;
                this._owner.x > (this.bg.width - 130) && (this._owner.x = (this.bg.width - 130));
            }
            this.lastRoleDirection !== this.roleDirection && this.playRoleAni(this.roleDirection, "run");
        }
        onKeyUp(e) {
            this.playRoleAni(this.roleDirection);
            this.roleDirection = "";
        }
        onDisable() {
        }
    }

    class Folded extends Laya.Script {
        constructor() {
            super();
            this.isOpen = true;
        }
        onEnable() {
            this.toolbarBG = this.owner.parent;
            this._owner = this.owner;
            this.menu = this.owner.parent.getChildByName("menu");
        }
        onMouseDown(e) {
            e.stopPropagation();
            if (this.isOpen) {
                Laya.Tween.to(this.toolbarBG, { width: 106 }, 1000, Laya.Ease.strongOut);
                Laya.Tween.to(this._owner, { x: 52, rotation: 540 }, 1000, Laya.Ease.strongOut, Laya.Handler.create(this, () => {
                    this.isOpen = false;
                }));
                Laya.Tween.to(this.menu, { alpha: 0 }, 300, Laya.Ease.strongOut, Laya.Handler.create(this, () => {
                    this.menu.visible = false;
                }));
            }
            else {
                Laya.Tween.to(this.toolbarBG, { width: 460 }, 1000, Laya.Ease.strongOut);
                Laya.Tween.to(this._owner, { x: 402, rotation: -360 }, 1000, Laya.Ease.strongOut, Laya.Handler.create(this, () => {
                    this.isOpen = true;
                }));
                Laya.Tween.to(this.menu, { alpha: 1 }, 200, Laya.Ease.strongOut, Laya.Handler.create(this, () => {
                    this.menu.visible = true;
                }));
            }
        }
        onDisable() {
        }
    }

    class DialogRT extends ui.uiDemo.DialogUI {
        constructor() { super(); }
        onAwake() {
            this.dialogTitle.text = "";
            this.dialogText.text = "";
            this.closeBtn.on(Laya.Event.CLICK, this, () => {
                this.close();
            });
        }
        onOpened(param = null) {
            if (param) {
                this.dialogTitle.text = param.title;
                this.dialogText.text = param.text;
            }
        }
        onDisable() {
        }
    }

    var Event$1 = Laya.Event;
    var Point = Laya.Point;
    class Joystick extends Laya.Script {
        constructor() {
            super();
            this.runAniName = "Right,Rdown1,Rdown2,Rdown3,Down,Ldown3,Ldown2,Ldown1,Left,Lup1,Lup2,Lup3,Up,Rup3,Rup2,Rup1";
            this.standAniName = "Right,Rdown,Down,Ldown,Left,Lup,Up,Rup";
            this.stageMouse = new Point();
            this.axisPivot = new Point();
            this.angle = 0;
            this.radian = 0;
            this.isMoving = false;
        }
        onEnable() {
            this.joystickBG = this.owner;
            this.joystickAxis = this.owner.getChildByName("joystickAxis");
            this.maxDistance = this.joystickBG.width - this.joystickAxis.width;
            this.axisPivot.x = this.joystickAxis.x;
            this.axisPivot.y = this.joystickAxis.y;
            this.sceneWindow.on(Event$1.MOUSE_DOWN, this, this.mouseDown);
            this.sceneWindow.on(Event$1.MOUSE_MOVE, this, this.mouseMove);
            this.sceneWindow.on(Event$1.MOUSE_UP, this, this.mouseUp);
            this.sceneWindow.on(Event$1.MOUSE_OUT, this, this.mouseUp);
            this.roleAniNode = this.roleAni.create();
            this.sceneWindow.addChild(this.roleAniNode);
            this.roleAniNode.pivot(this.roleAniNode.width / 2, this.roleAniNode.height / 2);
            this.roleAniNode.x = this.sceneWindow.width / 2;
            this.roleAniNode.y = this.sceneWindow.height / 2;
            this.roleStand = this.roleAniNode.getChildByName("roleStand");
            this.roleRun = this.roleAniNode.getChildByName("roleRun");
        }
        mouseDown(e) {
            this.touchId = e.touchId;
            this.isMoving = true;
            this.updateJoystickPoint();
        }
        updateJoystickPoint() {
            this.stageMouse.x = Laya.stage.mouseX;
            this.stageMouse.y = Laya.stage.mouseY;
            let joystickBGMouse = this.joystickBG.globalToLocal(this.stageMouse), mouseX = joystickBGMouse.x - this.joystickAxis.width / 2, mouseY = joystickBGMouse.y - this.joystickAxis.height / 2;
            this.radian = Math.atan2(mouseY - this.axisPivot.y, mouseX - this.axisPivot.x);
            this.lastAngle = this.angle;
            this.angle = Math.round(this.radian * 180 / Math.PI * 10) / 10;
            this.angle < 0 && (this.angle += 360);
            let distance = this.getDistance(this.joystickBG.width / 2, this.joystickBG.height / 2, joystickBGMouse.x, joystickBGMouse.y);
            if (distance > this.maxDistance && this.lastAngle !== this.angle) {
                this.joystickAxis.x = Math.floor(Math.cos(this.radian) * this.maxDistance) + this.axisPivot.x;
                this.joystickAxis.y = Math.floor(Math.sin(this.radian) * this.maxDistance) + this.axisPivot.y;
            }
            else {
                this.joystickAxis.pos(joystickBGMouse.x - this.joystickAxis.width / 2, joystickBGMouse.y - this.joystickAxis.height / 2);
            }
            this.switchAni("run");
        }
        switchAni(aniType) {
            if (aniType == "run") {
                if (this.roleStand.isPlaying) {
                    this.roleStand.stop();
                    this.roleStand.visible = false;
                    this.roleRun.visible = true;
                }
                let _runAniName = this.getOrientation(this.angle, this.runAniName);
                if (_runAniName !== this.lastRunAniName) {
                    this.lastRunAniName = _runAniName;
                    this.roleRun.play(0, true, _runAniName);
                }
            }
            else {
                if (this.roleRun.isPlaying) {
                    this.roleRun.stop();
                    this.roleRun.visible = false;
                    this.roleStand.visible = true;
                }
                this.lastAngle !== this.angle && this.roleStand.play(0, true, this.getOrientation(this.angle, this.standAniName));
            }
        }
        mouseUp(e) {
            if (e.touchId != this.touchId)
                return;
            this.touchId = null;
            this.isMoving = false;
            this.joystickAxis.pos(this.axisPivot.x, this.axisPivot.y);
            this.switchAni("stand");
        }
        mouseMove(e) {
            if (e.touchId != this.touchId)
                return;
            this.updateJoystickPoint();
        }
        getOrientation(angle, aniName) {
            let aniArr = aniName.split(",");
            const angleConditions = 360 / aniArr.length;
            return aniArr[Math.floor(angle / angleConditions)];
        }
        onUpdate() {
            if (!this.isMoving)
                return;
            this.updateRoleMove();
        }
        updateRoleMove() {
            this.switchAni("run");
            let dx = Math.cos(this.radian) * 2;
            let dy = Math.sin(this.radian) * 2;
            ((dx < 0 && this.gameMap.x < 0) || (dx > 0 && this.gameMap.x > this.sceneWindow.width - this.gameMap.width)) && (this.gameMap.x -= dx);
            ((dy < 0 && this.gameMap.y < 0) || (dy > 0 && this.gameMap.y > this.sceneWindow.height - this.gameMap.height)) && (this.gameMap.y -= dy);
        }
        getDistance(centerX, centerY, mouseX, mouseY) {
            let dx = centerX - mouseX, dy = centerY - mouseY;
            return Math.sqrt(dx * dx + dy * dy);
        }
    }

    var Rectangle = Laya.Rectangle;
    class ShapeDetection extends Laya.Script {
        constructor() {
            super(...arguments);
            this._rect1 = Rectangle.TEMP;
            this._rect2 = Rectangle.TEMP;
        }
        rectDetection(self, target) {
            return !(self.x > target.x + target.width ||
                self.x + self.width < target.x ||
                self.y > target.y + target.height ||
                self.y + self.height < target.y);
        }
        collisionWith(self, targets, type) {
            let collisionNodes = [];
            if (type == 0) {
                var p1 = Laya.Point.create(), p1PivotX = self.width / 2, p1PivotY = self.height / 2, p2 = Laya.Point.create(), p1Radius, p2Radius;
                p1.x = self.x + p1PivotX;
                p1.y = self.y + p1PivotY;
                p1Radius = this.rectToRadius(self.width, self.height);
            }
            else if (type == 2) {
                var targetVertices, selfVertices;
                selfVertices = this.arrayToPoint(self);
            }
            for (let i = 0; i < targets.length; i++) {
                if (self.name == targets[i].name)
                    continue;
                switch (type) {
                    case 0:
                        p2.x = targets[i].x + (targets[i].width / 2);
                        p2.y = targets[i].y + (targets[i].height / 2);
                        p2Radius = this.rectToRadius(targets[i].width, targets[i].height);
                        this.circleDetection(p1, p2, p1Radius + p2Radius) && collisionNodes.push(targets[i]);
                        break;
                    case 1:
                        this.rectDetection(self, targets[i]) && collisionNodes.push(targets[i]);
                        break;
                    case 2:
                        if (self.name === "c1") {
                            targetVertices = this.arrayToPoint(targets[i]);
                            this.circleAndPolygonDetection(self, targetVertices, targets[i]) && collisionNodes.push(targets[i]);
                        }
                        else if (targets[i].name === "c1") {
                            this.circleAndPolygonDetection(targets[i], selfVertices, self) && collisionNodes.push(targets[i]);
                        }
                        else {
                            targetVertices = this.arrayToPoint(targets[i]);
                            this.polygonDetection(selfVertices, targetVertices, self, targets[i]) && collisionNodes.push(targets[i]);
                        }
                        break;
                }
            }
            return collisionNodes;
        }
        circleAndPolygonDetection(circel, polygonVertices, polygonNode) {
            let sides = this.getSides(polygonVertices), axises = [], circelCenter = Laya.Point.create(), nearestPoint = Laya.Point.create(), radius = circel.hitArea._hit._one.radius, targetList = this.getNodeCoord(polygonVertices, polygonNode);
            circelCenter.x = circel.x + circel.hitArea._hit._one.x;
            circelCenter.y = circel.y + circel.hitArea._hit._one.y;
            nearestPoint = this.getNearestPoint(circelCenter, targetList);
            axises.push(new Laya.Point(nearestPoint.x - circelCenter.x, nearestPoint.y - circelCenter.y));
            for (let i = 0, len = sides.length; i < len; i++)
                axises.push(this.perpendicular(sides[i]));
            for (let i = 0, len = axises.length; i < len; i++) {
                let axis = axises[i], s = this.getCircleProjection(circelCenter, axis, radius), t = this.getPolygonProjection(targetList, axis);
                if (!this.isOverlap(s, t))
                    return false;
            }
            return true;
        }
        getNearestPoint(circelCenter, list) {
            let nearestPoint = list[0], minDistance = this.getDistance(circelCenter, nearestPoint), nowPoint, nowDistance;
            for (let i = 1; i < list.length; i++) {
                nowPoint = list[i];
                nowDistance = this.getDistance(circelCenter, nowPoint);
                if (nowDistance < minDistance) {
                    minDistance = nowDistance;
                    nearestPoint = nowPoint;
                }
            }
            return nearestPoint;
        }
        polygonDetection(selfVertices, targetVertices, selfNode, targetNode) {
            let sides = this.getSides(selfVertices).concat(this.getSides(targetVertices)), axises = [], selfList = this.getNodeCoord(selfVertices, selfNode), targetList = this.getNodeCoord(targetVertices, targetNode);
            for (let i = 0, len = sides.length; i < len; i++)
                axises.push(this.perpendicular(sides[i]));
            for (let i = 0, len = axises.length; i < len; i++) {
                let axis = axises[i], s = this.getPolygonProjection(selfList, axis), t = this.getPolygonProjection(targetList, axis);
                if (!this.isOverlap(s, t))
                    return false;
            }
            return true;
        }
        isOverlap(self, target) {
            let min, max;
            min = (self.min < target.min) ? self.min : target.min;
            max = (self.max > target.max) ? self.max : target.max;
            return (self.max - self.min) + (target.max - target.min) >= max - min;
        }
        getNodeCoord(vertices, node) {
            let _arr = [];
            for (let i = 0; i < vertices.length; i++) {
                let _point = Laya.Point.create();
                _point.x = vertices[i].x + node.x + node.hitArea._hit._one.x;
                _point.y = vertices[i].y + node.y + node.hitArea._hit._one.y;
                _arr.push(_point);
            }
            return _arr;
        }
        getPolygonProjection(list, axis) {
            let min = null, max = null;
            for (let i = 0; i < list.length; i++) {
                let projection = this.dotProduct(list[i], axis) / this.getLength(axis);
                (min === null || projection < min) && (min = projection);
                (max === null || projection > max) && (max = projection);
            }
            return { min: min, max: max };
        }
        getCircleProjection(circelCenter, axis, circleRadius) {
            let projection = this.dotProduct(circelCenter, axis) / this.getLength(axis);
            return { min: projection - circleRadius, max: projection + circleRadius };
        }
        rectToRadius(width, height) {
            let radius;
            if (width == height) {
                radius = width / 2;
            }
            else {
                radius = Math.sqrt(width * width + height * height) / 2;
            }
            return radius;
        }
        circleDetection(p1, p2, distance) {
            return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)) <= distance;
        }
        circlesCollision(p1, p2, p1Radius, p2Radius) {
            let axis = this.subtract(p1, p2), s = this.getCircleProjection(p1, axis, p1Radius), t = this.getCircleProjection(p2, axis, p2Radius);
            if (this.isOverlap(s, t))
                return true;
            return false;
        }
        arrayToPoint(sp) {
            let points = [], hitPoints = [];
            hitPoints = sp.hitArea._hit._one.points;
            if (hitPoints && hitPoints.length > 3) {
                for (let i = 0; i < hitPoints.length / 2; i++) {
                    points[i] = Laya.Point.create();
                    points[i].x = hitPoints[i * 2];
                    points[i].y = hitPoints[i * 2 + 1];
                }
            }
            return points;
        }
        perpendicular(p) {
            let _temp = Laya.Point.create();
            _temp.x = p.y;
            _temp.y = -p.x;
            return _temp;
        }
        getNormal(p) {
            let sum = Math.sqrt(p.x * p.x + p.y * p.y);
            return new Laya.Point(p.y / sum, (0 - p.x) / sum);
        }
        getSides(vertices) {
            var list = vertices, length = list.length, sides = new Array();
            if (length >= 3) {
                for (var i = 1, lastPoint = list[0]; i < length; i++) {
                    let nowPoint = list[i];
                    sides.push(this.subtract(nowPoint, lastPoint));
                    lastPoint = nowPoint;
                }
                sides.push(this.subtract(list[0], list[length - 1]));
            }
            return sides;
        }
        getLength(p) {
            return Math.sqrt(p.x * p.x + p.y * p.y);
        }
        dotProduct(p1, p2) {
            return p1.x * p2.x + p1.y * p2.y;
        }
        subtract(p2, p1) {
            let _point = Laya.Point.create();
            return _point.setTo(p2.x - p1.x, p2.y - p1.y);
        }
        getDistance(p1, p2) {
            let dx = p1.x - p2.x, dy = p1.y - p2.y;
            return Math.sqrt(dx * dx + dy * dy);
        }
    }

    class ShapeDetectionRT extends ui.uiDemo.interactive.ShapeDetectionUI {
        constructor() {
            super();
            this._detectionType = 0;
            this.collisionNodes = [this.c1, this.p1, this.p2];
            ShapeDetectionRT.i = this;
        }
        onEnable() {
            this._script = this.getComponent(ShapeDetection);
            this.detectionType.selectHandler = new Laya.Handler(this, this.onSelected);
            this.detectionType.selectedIndex = 0;
        }
        onSelected(index) {
            this._detectionType = index;
            switch (index) {
                case 0:
                    this.setCircleLine([this.c11, this.p11, this.p22]);
                    break;
                case 1:
                    this.setRectLine([this.c11, this.p11, this.p22]);
                    break;
                case 2:
                    this.c11.graphics.clear();
                    this.p11.graphics.clear();
                    this.p22.graphics.clear();
                    break;
            }
        }
        collisionWith(self) {
            let nodes;
            nodes = this._script.collisionWith(self, this.collisionNodes, this._detectionType);
            if (nodes.length > 0) {
                nodes.push(self);
                this.setLineWidth(nodes);
            }
            else {
                this.retsetLineWidth();
            }
        }
        setLineWidth(nodes) {
            for (let i = 0; i < nodes.length; i++) {
                nodes[i]._graphics._one.lineWidth = 3;
            }
        }
        retsetLineWidth() {
            for (let i = 0; i < this.collisionNodes.length; i++) {
                this.collisionNodes[i]._graphics._one.lineWidth = 0;
            }
        }
        setCircleLine(nodes, lineWidth = 1, lineColor = "#1e00fb") {
            for (let i = 0; i < nodes.length; i++) {
                nodes[i].graphics.clear();
                let x = nodes[i].width / 2, y = nodes[i].height / 2, radius = this._script.rectToRadius(nodes[i].width, nodes[i].height);
                nodes[i].graphics.drawCircle(x, y, radius, null, lineColor, lineWidth);
            }
        }
        setRectLine(nodes, lineWidth = 1, lineColor = "#1e00fb") {
            for (let i = 0; i < nodes.length; i++) {
                nodes[i].graphics.clear();
                nodes[i].graphics.drawRect(nodes[i].x, nodes[i].y, nodes[i].width, nodes[i].height, null, lineColor, lineWidth);
            }
        }
    }

    class DragAndTips extends Laya.Script {
        constructor() {
            super(...arguments);
            this.tipsText = '';
            this.isDown = false;
        }
        onEnable() {
            this.tipsText.replace(/(^\s*)|(\s*$)/g, '');
        }
        onMouseDown() {
            this.owner.startDrag();
            this.isDown = true;
        }
        onMouseUp() {
            this.isDown = false;
        }
        onMouseMove() {
            this.isDown && ShapeDetectionRT.i.collisionWith(this.owner);
        }
        onMouseOver() {
            Laya.Mouse.cursor = "move";
            this.tipsText !== "" && Laya.Scene.open("uiDemo/Msg.scene", false, { "text": this.tipsText });
        }
        onMouseOut() {
            Laya.Mouse.cursor = "auto";
        }
    }

    class BagListRT extends ui.uiDemo.list.BagListUI {
        constructor() {
            super();
            this.lastIndex = -1;
        }
        onEnable() {
            Laya.loader.create("json/bagList.json", Laya.Handler.create(this, () => {
                let _json = Laya.loader.getRes("json/bagList.json");
                if (_json.bagList && _json.bagList.length > 0) {
                    this.bagList.array = _json.bagList;
                    this.bagList.renderHandler = new Laya.Handler(this, this.onListRender);
                    this.bagList.selectHandler = new Laya.Handler(this, this.onListSelect);
                    this.bagList.mouseHandler = new Laya.Handler(this, this.onListMouse);
                }
            }));
        }
        onListRender(item, index) {
            if (index > this.bagList.array.length || index < 0)
                return;
        }
        onListSelect(index) {
            this.tips.visible = true;
            this.bagList.array[index].listItemBG = { "skin": "bg/bg100-1.png" };
            if (this.lastIndex !== -1) {
                this.bagList.array[this.lastIndex].listItemBG = { "skin": "bg/bg100-0.png" };
            }
            this.lastIndex = index;
            this.itemImg.skin = this.bagList.array[index].listItemImg.skin;
            this.itemNumber.changeText("数量 " + this.bagList.array[index].listItemNumber.text);
            this.itemReadme.text = this.bagList.array[index].readme;
        }
        onListMouse(e, index) {
        }
        onDisable() {
        }
    }

    class ComboBoxRT extends ui.uiDemo.list.ComboBoxUI {
        constructor() { super(); }
        onEnable() {
            var _dataSourece = this.getDataSourece();
            Laya.loader.create("./prefab/comboList.prefab", Laya.Handler.create(this, () => {
                this.comboList = (Laya.loader.getRes("./prefab/comboList.prefab")).create();
                this.comboList.array = _dataSourece;
                this.comboList.repeatY = _dataSourece.length;
                this.combo2.list = this.comboList;
                this.combo2.list.width = this.combo2.width;
                this.combo2.selectHandler = new Laya.Handler(this, this.onSelected2);
            }));
            this.combo1.selectHandler = new Laya.Handler(this, this.onSelected1);
        }
        onSelected1(index) {
            this.selectedText.text = "您选中了：" + this.combo1.selectedLabel;
        }
        onSelected2(index) {
            this.selectedText.text = "您选中了：" + (index < 0 ? "" : this.comboList.array[index].label);
        }
        getDataSourece() {
            for (var _data = [], i = 0; i < 10; i++) {
                _data[i] = { "optText": { "text": "选项" + (i + 1) } };
            }
            return _data;
        }
        onDisable() {
        }
    }

    class LoopListRT extends ui.uiDemo.list.LoopListUI {
        onEnable() {
            this.hList.array = this.getListDataSource();
            this.hList.scrollTo(1);
            let icon = this.hList.cells[1].getChildByName("icon");
            icon.scaleX = icon.scaleY = 2;
            this.hList.disableStopScroll = true;
            this.hList.scrollBar.on(Laya.Event.CHANGE, this, this.onScrollBarChange);
            this.leftLimit = this.getLeftLimit();
            this.rightLimit = this.getRightLimit();
        }
        onScrollBarChange() {
            var sliderValue = this.hList.scrollBar.value;
            var listArr = this.hList.array;
            if (sliderValue > this.leftLimit) {
                var cell = listArr.shift();
                listArr[listArr.length] = cell;
                this.hList.array = listArr;
                this.hList.scrollBar.value = sliderValue - this.hList.cells[0].width - this.hList.spaceX;
                this.iconTweenToLeft();
            }
            else if (sliderValue < this.rightLimit) {
                cell = listArr.pop();
                listArr.unshift(cell);
                this.hList.array = listArr;
                this.hList.scrollBar.value = sliderValue + this.hList.cells[0].width + this.hList.spaceX;
                this.iconTweenToRight();
            }
        }
        iconTweenToLeft(time = 200) {
            let iconOld = this.hList.cells[1].getChildByName("icon");
            iconOld.scaleX = iconOld.scaleY = 2;
            Laya.Tween.to(iconOld, { scaleX: 1, scaleY: 1 }, time);
            let icon = this.hList.cells[2].getChildByName("icon");
            icon.scaleX = icon.scaleY = 1;
            Laya.Tween.to(icon, { scaleX: 2, scaleY: 2 }, time);
        }
        iconTweenToRight(time = 200) {
            let iconOld = this.hList.cells[2].getChildByName("icon");
            iconOld.scaleX = iconOld.scaleY = 2;
            Laya.Tween.to(iconOld, { scaleX: 1, scaleY: 1 }, time);
            let icon = this.hList.cells[1].getChildByName("icon");
            icon.scaleX = icon.scaleY = 1;
            Laya.Tween.to(icon, { scaleX: 2, scaleY: 2 }, time);
        }
        getRightLimit() {
            return this.hList.cells[0].width - this.hList.spaceX;
        }
        getLeftLimit() {
            return (this.hList.cells[0].width * 2) + this.hList.spaceX;
        }
        getListDataSource(length = 5) {
            let _arr = [];
            for (let i = 0; i < length; i++) {
                _arr[i] = {};
                _arr[i].icon = { "skin": `role/r${i}.png` };
            }
            return _arr;
        }
    }

    class MailListRT extends ui.uiDemo.list.MailListUI {
        constructor() {
            super();
            this.optStatus = [];
        }
        onEnable() {
            const jsonPath = "./json/mailList.json";
            Laya.loader.create(jsonPath, Laya.Handler.create(this, () => {
                let jsonData = (Laya.loader.getRes(jsonPath)).mailList;
                if (jsonData && jsonData.length > 0) {
                    this.mailList.array = jsonData;
                    this.mailList.mouseHandler = new Laya.Handler(this, this.onListMouse);
                }
                this.addMail.on(Laya.Event.CLICK, this, this.addMialItem);
                this.selectDel.on(Laya.Event.CLICK, this, this.listSelectDel);
                this.selectFlag.on(Laya.Event.CLICK, this, this.listSelectFlag);
            }));
        }
        listSelectFlag() {
            if (this.optStatus.length > 0) {
                for (let i = 0; i < this.optStatus.length; i++) {
                    let index = this.optStatus[i];
                    this.mailList.array[index].flag = 1;
                    this.mailList.array[index].flagStatus = { "skin": "comp/img_mail_open.png" };
                    this.mailList.array[index].flagBtn = { "label": "标为未读", "labelColors": "#3277f3,#3277f3,#3277f3" };
                }
                this.mailList.refresh();
                Laya.Scene.open("uiDemo/Msg.scene", false, { "text": "已成功标记" });
            }
            else
                Laya.Scene.open("uiDemo/Msg.scene", false, { "text": "没有勾选项，请先勾选" });
        }
        listSelectDel() {
            if (this.optStatus.length > 0) {
                this.optStatus.sort(function (a, b) { return b - a; });
                for (let i = 0; i < this.optStatus.length; i++) {
                    this.mailList.array.splice(this.optStatus[i], 1);
                }
                this.optStatus = [];
                this.mailList.refresh();
                Laya.Scene.open("uiDemo/Msg.scene", false, { "text": "已成功删除" });
            }
            else
                Laya.Scene.open("uiDemo/Msg.scene", false, { "text": "没有勾选项，请先勾选" });
        }
        addMialItem() {
            var index = this.mailList.startIndex + 1;
            let itemData = {
                "mailTitle": {
                    "text": "这里是新增加的邮件" + index
                },
                "mailDateTime": {
                    "text": this.timestampFormat("YYYY-MM-DD hh:mm")
                },
                "opt": {
                    "visible": false
                },
                "flagStatus": {
                    "skin": "comp/img_mail.png"
                },
                "flagBtn": {
                    "label": "标为已读",
                    "labelColors": "#000000,#000000,#000000"
                }
            };
            this.mailList.array.splice(index, 0, itemData);
            if (this.optStatus.length > 0) {
                for (let i = 0; i < this.optStatus.length; i++) {
                    if (this.optStatus[i] >= index) {
                        this.optStatus[i] += 1;
                    }
                }
            }
            this.mailList.refresh();
        }
        timestampFormat(fmt = "YYYY-MM-DD hh:mm:ss", timestamp = 0) {
            Date.prototype["Format"] = function (fmt) {
                var o = {
                    "M+": this.getMonth() + 1,
                    "D+": this.getDate(),
                    "h+": this.getHours(),
                    "m+": this.getMinutes(),
                    "s+": this.getSeconds(),
                };
                if (new RegExp("(Y+)").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt))
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
            };
            if (timestamp == 0)
                return new Date()["Format"](fmt);
            else
                return new Date(timestamp)["Format"](fmt);
        }
        onListMouse(e, index) {
            if (e.type == Laya.Event.CLICK) {
                var optIndex = this.optStatus.indexOf(index);
                switch (e.target.name) {
                    case "optBG":
                        if (optIndex === -1) {
                            this.mailList.array[index].opt = { "visible": true };
                            this.optStatus.push(index);
                        }
                        else {
                            this.mailList.array[index].opt = { "visible": false };
                            this.optStatus.splice(optIndex, 1);
                        }
                        this.mailList.refresh();
                        break;
                    case "mailTitle":
                        Laya.Scene.open("uiDemo/Dialog.scene", false, { "title": this.mailList.array[index].mailTitle.text, "text": "邮件内容，此处省略1000字……………………" });
                        this.mailList.array[index].flag = 1;
                        this.mailList.array[index].flagStatus = { "skin": "comp/img_mail_open.png" };
                        this.mailList.array[index].flagBtn = { "label": "标为未读", "labelColors": "#3277f3,#3277f3,#3277f3" };
                        this.mailList.refresh();
                        break;
                    case "flagBtn":
                        if (this.mailList.array[index].flag === 1) {
                            this.mailList.array[index].flag = 0;
                            this.mailList.array[index].flagStatus = { "skin": "comp/img_mail.png" };
                            this.mailList.array[index].flagBtn = { "label": "标为已读", "labelColors": "#000000,#000000,#000000" };
                        }
                        else {
                            this.mailList.array[index].flag = 1;
                            this.mailList.array[index].flagStatus = { "skin": "comp/img_mail_open.png" };
                            this.mailList.array[index].flagBtn = { "label": "标为未读", "labelColors": "#3277f3,#3277f3,#3277f3" };
                        }
                        this.mailList.refresh();
                        break;
                    case "delBtn":
                        this.mailList.array.splice(index, 1);
                        if (optIndex > -1) {
                            this.optStatus.splice(optIndex, 1);
                            for (let i = optIndex; i < this.optStatus.length; i++) {
                                this.optStatus[i] -= 1;
                            }
                        }
                        this.mailList.refresh();
                        Laya.Scene.open("uiDemo/Msg.scene", false, { "text": "删除成功" });
                        break;
                }
            }
        }
    }

    class RefreshRT extends ui.uiDemo.list.RefreshUI {
        constructor() {
            super();
            this.scrollBarIsStop = false;
            this.msgIdNow = 1;
            this.itemIsOpen = false;
            this.itemOpenId = -1;
            this.redHotStatus = [];
            this.mouseDown = false;
        }
        onEnable() {
            this.refreshList.array = this.createListData(9);
            this.toLine.on(Laya.Event.CLICK, this, this.onToLineBtn);
            this.toTop.on(Laya.Event.CLICK, this, this.onToTopBtn);
            this.toBottom.on(Laya.Event.CLICK, this, this.onToBottomBtn);
            this.refreshList.on(Laya.Event.MOUSE_UP, this, this.stageOnMouseUp);
            this.refreshList.on(Laya.Event.MOUSE_OUT, this, this.stageOnMouseUp);
            this.refreshList.scrollBar.stopMoveLimit = this.scrollBarIsStopBind.bind(this);
            this.refreshLimit("dragTopLimit", 80);
            this.refreshLimit("dragBottomLimit", 80, 20);
            this.refreshList.mouseHandler = new Laya.Handler(this, this.onListMouse);
        }
        stageOnMouseUp() {
            this.mouseDown = false;
        }
        refreshLimit(eventName, moveLimit, distance = 0, time = 2000) {
            if (eventName === "dragTopLimit") {
                this.refreshList.scrollBar.topMoveLimit = moveLimit;
            }
            else if (eventName === "dragBottomLimit") {
                this.refreshList.scrollBar.bottomMoveLimit = moveLimit;
            }
            this.refreshList.scrollBar.on(eventName, this, () => {
                console.log("达到了滚动限制:" + eventName);
                this.refreshLoading.visible = true;
                if (eventName === "dragTopLimit") {
                    this.refreshLoading.bottom = NaN;
                    this.refreshLoading.top = distance;
                    var _arr = this.createListData(5, "顶部新增的标题");
                    _arr = _arr.concat(this.refreshList.array);
                    var index = 0 + 5;
                    var line = 0;
                    if (this.redHotStatus.length > 0) {
                        for (let i = 0; i < this.redHotStatus.length; i++) {
                            this.redHotStatus[i] += 5;
                        }
                    }
                }
                else if (eventName === "dragBottomLimit") {
                    this.refreshList.scrollBar.disableDrag = true;
                    this.refreshLoading.top = NaN;
                    this.refreshLoading.bottom = distance;
                    var _arr = this.createListData(5, "底部新增的标题");
                    _arr = this.refreshList.array.concat(_arr);
                    var index = this.refreshList.array.length - 1;
                    var line = index + 5;
                }
                this.scrollBarIsStop = true;
                Laya.timer.once(time, this, () => {
                    this.refreshList.array = _arr;
                    this.refreshList.scrollTo(line);
                    this.refreshList.selectedIndex = index;
                    this.scrollBarIsStop = false;
                    this.refreshList.scrollBar.backToNormal();
                    this.refreshLoading.visible = false;
                });
            });
        }
        onListMouse(e, index) {
            if (e.type == Laya.Event.MOUSE_DOWN) {
                this.mouseDown = true;
                if (this.itemIsOpen) {
                    this.itemIsOpen = false;
                    this.itemOpenId = -1;
                    Laya.Tween.to(this.openedItem, { "x": 0 }, 500, null, Laya.Handler.create(this, () => {
                        this.refreshList.scrollBar.disableDrag = false;
                    }));
                }
                else {
                    this.moveLastPos = e.target.globalToLocal(new Laya.Point(Laya.stage.mouseX, Laya.stage.mouseY));
                    e.target.on(Laya.Event.MOUSE_MOVE, this, this.onItemBoxMouseMove, [e.target, index]);
                }
            }
            if (e.type == Laya.Event.MOUSE_UP) {
                this.mouseDown = false;
                this.itemOnMouseUp();
            }
            if (e.target.name == "flag" && e.type == Laya.Event.CLICK)
                this.onClickFlag(index);
            if (e.target.name == "del" && e.type == Laya.Event.CLICK)
                this.onClickDel(index);
        }
        itemOnMouseUp() {
            if (this.itemIsOpen) {
                var targetX;
                if (this.openedItem.x < -80) {
                    targetX = -262;
                }
                else {
                    this.itemIsOpen = false;
                    targetX = 0;
                }
                if (targetX !== this.openedItem.x) {
                    Laya.Tween.to(this.openedItem, { "x": targetX }, 500);
                }
                this.refreshList.scrollBar.disableDrag = false;
                if (this.itemOpenId !== -1) {
                    this.openedItem.off(Laya.Event.MOUSE_MOVE, this, this.onItemBoxMouseMove);
                    this.itemOpenId = -1;
                }
            }
        }
        onClickFlag(index) {
            var showRedHot = this.redHotStatus.indexOf(index);
            if (showRedHot == -1) {
                this.refreshList.array[index].avatar = {};
                this.refreshList.array[index].avatar.redHot = { "visible": true };
                this.refreshList.array[index].flag = { "flagText": { "text": "标记已读" } };
                this.redHotStatus.push(index);
            }
            else {
                this.refreshList.array[index].avatar = { "redHot": { "visible": false } };
                this.refreshList.array[index].flag = { "flagText": { "text": "标记未读" } };
                this.redHotStatus.splice(showRedHot, 1);
            }
            this.refreshList.refresh();
        }
        onClickDel(index) {
            this.refreshList.array.splice(index, 1);
            this.itemOpenId = -1;
            var showRedHot = this.redHotStatus.indexOf(index);
            if (showRedHot > -1) {
                this.redHotStatus.splice(index, 1);
            }
            if (this.redHotStatus.length > 0) {
                for (let i = 0; i < this.redHotStatus.length; i++) {
                    (this.redHotStatus[i] > index) && (this.redHotStatus[i] += 1);
                }
            }
            this.refreshList.refresh();
        }
        onItemBoxMouseMove(item, index) {
            if (this.mouseDown) {
                let mousePos = item.globalToLocal(new Laya.Point(Laya.stage.mouseX, Laya.stage.mouseY));
                let moveX = this.moveLastPos.x - mousePos.x;
                let moveY = this.moveLastPos.y - mousePos.y;
                if (Math.abs(moveX) > Math.abs(moveY) && !(this.itemIsOpen)) {
                    this.openedItem = item;
                    this.itemIsOpen = true;
                    this.refreshList.scrollBar.disableDrag = true;
                    this.itemOpenId = index;
                }
                if (this.itemIsOpen) {
                    this.openedItem.x -= moveX;
                    if (this.openedItem.x < -262)
                        this.openedItem.x = -262;
                    else if (this.openedItem.x > 0)
                        this.openedItem.x = 0;
                }
            }
            else {
                this.refreshList.scrollBar.disableDrag = false;
            }
        }
        scrollBarIsStopBind() {
            return this.scrollBarIsStop;
        }
        onToLineBtn() {
            let line = parseInt(this.lineNumber.text) - 1;
            this.refreshList.scrollTo(line);
            (line < this.refreshList.array.length) && (this.refreshList.selectedIndex = line);
        }
        onToTopBtn() {
            this.refreshList.scrollTo(0);
            this.refreshList.selectedIndex = 0;
        }
        onToBottomBtn() {
            let line = this.refreshList.array.length - 1;
            this.refreshList.scrollTo(line);
            this.refreshList.selectedIndex = line;
        }
        createListData(max = 5, msgTitle = "初始测试标题") {
            let _Date = new Date();
            let _hour = (_Date.getHours() < 10) ? "0" + _Date.getHours() : "" + _Date.getHours();
            let _minute = (_Date.getMinutes() < 10) ? "0" + _Date.getMinutes() : "" + _Date.getMinutes();
            var _arr = [];
            for (var i = 0; i < max; i++) {
                let msgTime = { "text": _hour + " : " + _minute };
                _arr[i] = {};
                _arr[i].msgTime = msgTime;
                _arr[i].msgTitle = { "text": msgTitle + (this.msgIdNow + i) };
                _arr[i].avatar = { "redHot": { "visible": false } };
            }
            this.msgIdNow += i;
            return _arr;
        }
        onDisable() {
        }
    }

    class ItemBox extends Laya.Box {
        constructor() { super(); }
        get dataSource() {
            return super.dataSource;
        }
        set dataSource(value) {
            super.dataSource = value;
            if (!value)
                return;
            if (value.avatar) {
                let redHot = this.getChildByName("avatar").getChildByName("redHot");
                redHot.visible = value.avatar.redHot.visible;
            }
            if (value.flag) {
                let flagText = this.getChildByName("flag").getChildByName("flagText");
                flagText.changeText(value.flag.flagText.text);
            }
        }
    }

    class TreeListRT extends ui.uiDemo.list.TreeListUI {
        onEnable() {
            this.tree1.xml = this.getTreeData(true);
            this.tree2.xml = this.getTreeData(false);
        }
        getTreeData(_static) {
            let treeData = "<data>";
            if (_static) {
                treeData +=
                    "<dir itemLabel='一级目录一' isOpen='false'>" +
                    "<file itemLabel='二级子项1 '/>" +
                    "<file itemLabel='二级子项2 '/>" +
                    "<file itemLabel='二级子项3 '/>" +
                    "<file itemLabel='二级子项4 '/>" +
                    "<file itemLabel='二级子项5 '/>" +
                    "</dir>" +
                    "<dir itemLabel='一级目录二' isOpen='true'>" +
                    "<file itemLabel='二级子项1 '/>" +
                    "<file itemLabel='二级子项2 '/>" +
                    "<file itemLabel='二级子项3 '/>" +
                    "</dir>" +
                    "<dir itemLabel='一级目录三' isOpen='false'>" +
                    "<file itemLabel='二级子项1 '/>" +
                    "<file itemLabel='二级子项2 '/>" +
                    "<file itemLabel='二级子项3 '/>" +
                    "<file itemLabel='二级子项4 '/>" +
                    "<file itemLabel='二级子项5 '/>" +
                    "</dir>" +
                    "<file itemLabel='一级子项1 '/>" +
                    "<file itemLabel='一级子项2 '/>";
            }
            else {
                for (let i = 0; i < 5; i++) {
                    treeData += "<item title='目录" + (i + 1) + "' isOpen='true'>";
                    for (let j = 0; j < 5; j++) {
                        treeData += "<subpage title='子项标题" + (j + 1) + "' />";
                    }
                    treeData += "</item>";
                }
            }
            treeData += "</data>";
            return Laya.Utils.parseXMLFromString(treeData);
            ;
        }
    }

    class MsgRT extends ui.uiDemo.MsgUI {
        constructor() { super(); }
        onOpened(param) {
            if (param) {
                this.msgLab.x = param.point && param.point.x ? param.point.x : Laya.stage.mouseX - 50;
                this.msgLab.y = param.point && param.point.y ? param.point.y : Laya.stage.mouseY - 80;
                this.msgLab.changeText(param.text);
                Laya.Tween.to(this.msgLab, { y: this.msgLab.y - 100, alpha: 0 }, 1000, Laya.Ease.linearNone);
            }
        }
    }

    var Browser = Laya.Browser;
    var Render = Laya.Render;
    var Utils = Laya.Utils;
    class IframeElementRT extends ui.uiDemo.page.IframeElementUI {
        constructor() {
            super();
            IframeElementRT.instance = this;
        }
        onEnable() {
            this.videoBtn.on(Laya.Event.MOUSE_DOWN, this, () => { this.createElementVideo(); });
        }
        createElementVideo() {
            Browser.window.IframeElementRT = this;
            this.createScript();
            this.createDiv();
            this.createIframe("./files/video.html?url=layaAir.mp4");
            this.setDOMElementInArea();
            Laya.stage.on(Laya.Event.RESIZE, this, this.setDOMElementInArea);
        }
        setDOMElementInArea() {
            if (this.iframeElement != null && this.divElement != null) {
                Utils.fitDOMElementInArea(this.divElement, this.closeBox, 0, 0, this.closeBox.width, this.closeBox.height);
                Utils.fitDOMElementInArea(this.iframeElement, this.iframeBox, 0, 0, this.iframeBox.width, this.iframeBox.height);
            }
        }
        createScript() {
            this.scriptElement = Browser.document.createElement("script");
            Browser.document.body.appendChild(this.scriptElement);
            this.scriptElement.innerHTML = "function closeVideo(){IframeElementRT.closeVideo() }";
        }
        createIframe(url) {
            this.iframeElement = Browser.createElement("iframe");
            Browser.document.body.appendChild(this.iframeElement);
            this.iframeElement.style.zIndex = Render.canvas.style.zIndex + 998;
            this.iframeElement.src = url;
            this.iframeElement.style.margin = "0";
            this.iframeElement.style.scrolling = "no";
            this.iframeElement.style.frameborder = "0";
            this.iframeElement.style.padding = "0";
            this.iframeElement.style.left = "0";
            this.iframeElement.style.top = "0px";
            this.iframeElement.style.position = "absolute";
        }
        createDiv() {
            this.divElement = Laya.Browser.createElement("div");
            Laya.Browser.document.body.appendChild(this.divElement);
            this.divElement.innerHTML = "<img src='files/x.png' width='60px' height='60px' onclick='closeVideo()'/>";
            this.divElement.style.zIndex = Render.canvas.style.zIndex + 999;
        }
        closeVideo() {
            Laya.Browser.document.body.removeChild(this.scriptElement);
            Laya.Browser.document.body.removeChild(this.iframeElement);
            Laya.Browser.document.body.removeChild(this.divElement);
            this.scriptElement = this.iframeElement = this.divElement = null;
            Laya.stage.off(Laya.Event.RESIZE, this, this.setDOMElementInArea);
        }
    }

    class OpenMainScene extends Laya.Script {
        onEnable() {
            this.owner.getChildByName("btn").on(Laya.Event.CLICK, this, () => { this.owner.close(); });
        }
        onDisable() {
        }
    }

    class OpenScene extends Laya.Script {
        constructor() { super(); }
        onEnable() {
            let _window, closeBtn;
            _window = this.owner.getChildByName("window");
            closeBtn = _window.getChildByName("closeBtn");
            _window.on(Laya.Event.MOUSE_DOWN, this, () => { _window.startDrag(); });
            closeBtn.on(Laya.Event.MOUSE_DOWN, this, () => { this.owner.close(); });
        }
        onDisable() {
        }
    }

    var Event$2 = Laya.Event;
    var Mouse = Laya.Mouse;
    class UsePanelRT extends ui.uiDemo.page.UsePanelUI {
        constructor() { super(); }
        onEnable() {
            if (!(Laya.Browser.onPC)) {
                this.topLab.changeText("背景可拖拽，双指缩放改变大小");
            }
            else {
                this._panel.on(Event$2.MOUSE_OVER, this, () => { Mouse.cursor = "move"; });
                this._panel.on(Event$2.MOUSE_OUT, this, () => { Mouse.cursor = "auto"; });
            }
        }
    }

    class bgImg extends Laya.Script {
        constructor() {
            super(...arguments);
            this.maxX = 0;
            this.minX = -90;
            this.maxY = 0;
            this.minY = -580;
            this.scaleSize = 0.1;
            this.lastDistance = 0;
        }
        onEnable() {
            this._owner = this.owner;
            this.onMouseWheel();
        }
        onMouseWheel() {
            this.owner.on(Laya.Event.MOUSE_WHEEL, this, (e) => {
                let point = this._owner.globalToLocal(new Laya.Point(Laya.stage.mouseX, Laya.stage.mouseY));
                if (e.delta > 0) {
                    this._owner.scaleX += this.scaleSize;
                    this._owner.scaleY += this.scaleSize;
                }
                if (e.delta < 0) {
                    this._owner.scaleX -= this.scaleSize;
                    this._owner.scaleY -= this.scaleSize;
                    (this._owner.scaleX < 1) && (this._owner.scaleX = 1);
                    (this._owner.scaleY < 1) && (this._owner.scaleY = 1);
                }
                let point2 = this._owner.globalToLocal(new Laya.Point(Laya.stage.mouseX, Laya.stage.mouseY));
                let _offsetX = (point2.x - point.x) * this._owner.scaleX;
                let _offsetY = (point2.y - point.y) * this._owner.scaleY;
                _offsetX += this._owner.x;
                _offsetY += this._owner.y;
                this.updateLimit();
                if (_offsetX > this.maxX)
                    this._owner.x = this.maxX;
                else if (_offsetX < this.minX)
                    this._owner.x = this.minX;
                else
                    this._owner.x = _offsetX;
                if (_offsetY > this.maxY)
                    this._owner.y = this.maxY;
                else if (_offsetY < this.minY)
                    this._owner.y = this.minY;
                else
                    this._owner.y = _offsetY;
            });
        }
        onStart() {
            this.updateLimit();
        }
        updateLimit() {
            let _parent = this.owner.parent.parent;
            this.minX = _parent.width - this._owner.width * this._owner.scaleY;
            this.minY = _parent.height - this._owner.height * this._owner.scaleY;
        }
        onMouseDown(e) {
            e.stopPropagation();
            if (e.touches && e.touches.length > 1) {
                let lastPivot = this.setPivot(e.touches);
                if (!(lastPivot.x) || !(lastPivot.y)) {
                    console.log("(((((((((((((((((((((((", this.lastPivot, JSON.parse(JSON.stringify(e.touches)));
                }
                else {
                    this.lastDistance = this.getDistance(e.touches);
                    this.lastPivot = lastPivot;
                    this._owner.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
                }
            }
            else if (Laya.Browser.onPC)
                this._owner.startDrag();
        }
        onMouseUp(e) {
            this._owner.off(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
        }
        getDistance(touches) {
            var distance = 0;
            if (touches && touches.length > 1) {
                let dx = touches[0].stageX - touches[1].stageX;
                let dy = touches[0].stageY - touches[1].stageY;
                distance = Math.sqrt(dx * dx + dy * dy);
            }
            return distance;
        }
        mouseMove(e) {
            let distance = this.getDistance(e.touches);
            this._owner.scaleX += (distance - this.lastDistance) * (this.scaleSize / 10);
            this._owner.scaleY += (distance - this.lastDistance) * (this.scaleSize / 10);
            (this._owner.scaleX < 1) && (this._owner.scaleX = 1);
            (this._owner.scaleY < 1) && (this._owner.scaleY = 1);
            (this._owner.scaleX > 5) && (this._owner.scaleX = 5);
            (this._owner.scaleY > 5) && (this._owner.scaleY = 5);
            let nowPivot = this.setPivot(e.touches);
            if (!(nowPivot.x) || !(nowPivot.y)) {
                console.log("$$$$$$$$$$$", nowPivot, JSON.parse(JSON.stringify(e.touches)));
            }
            else {
                this.updateLimit();
                let _offsetX = (nowPivot.x - this.lastPivot.x) * this._owner.scaleX;
                let _offsetY = (nowPivot.y - this.lastPivot.y) * this._owner.scaleY;
                _offsetX += this._owner.x;
                _offsetY += this._owner.y;
                if (_offsetX > this.maxX)
                    this._owner.x = this.maxX;
                else if (_offsetX < this.minX)
                    this._owner.x = this.minX;
                else
                    this._owner.x = _offsetX;
                if (_offsetY > this.maxY)
                    this._owner.y = this.maxY;
                else if (_offsetY < this.minY)
                    this._owner.y = this.minY;
                else
                    this._owner.y = _offsetY;
                this.lastDistance = distance;
            }
        }
        setPivot(touches) {
            let Point0 = this._owner.globalToLocal(new Laya.Point(touches[0].stageX, touches[0].stageY));
            let Point1 = this._owner.globalToLocal(new Laya.Point(touches[1].stageX, touches[1].stageY));
            return new Laya.Point((Point0.x + Point1.x) / 2, (Point0.y + Point1.y) / 2);
        }
        onUpdate() {
            (this._owner.x > this.maxX) && (this._owner.x = this.maxX);
            (this._owner.x < this.minX) && (this._owner.x = this.minX);
            (this._owner.y > this.maxY) && (this._owner.y = this.maxY);
            (this._owner.y < this.minY) && (this._owner.y = this.minY);
        }
        addTestPoint(point, color = "#ff0000", size = 2) {
            let spTest = new Laya.Sprite();
            spTest.graphics.drawCircle(0, 0, size, color);
            this.owner.addChild(spTest);
            spTest.pos(point.x, point.y);
        }
    }

    class UiMainRT extends ui.uiDemo.UiMainUI {
        constructor() {
            super();
            Laya.stage.screenMode = Laya.Stage.SCREEN_HORIZONTAL;
            Laya.stage.alignH = "left";
        }
        onEnable() {
            Laya.PhysicsDebugDraw.I && Laya.PhysicsDebugDraw.I.visible && (Laya.PhysicsDebugDraw.I.visible = false);
            this.tabBindViewStack();
        }
        onClicked() {
            let openSceneBtn = this.item2Tab.getChildByName("item2"), openSceneBtn2 = this.item2Tab.getChildByName("item3"), openDialogBtn = this.item2Tab.getChildByName("item4");
            openSceneBtn.on(Laya.Event.MOUSE_DOWN, this, () => { Laya.Scene.open("./uiDemo/page/OpenMainScene.scene", false); });
            openSceneBtn2.on(Laya.Event.MOUSE_DOWN, this, () => { Laya.Scene.open("./uiDemo/page/OpenScene.scene", false); });
            openDialogBtn.on(Laya.Event.MOUSE_DOWN, this, () => { Laya.Scene.open("./uiDemo/Dialog.scene", false, { "title": "弹窗的标题", "text": "弹窗的具体文本……" }); });
        }
        tabBindViewStack() {
            this.topTab.selectHandler = new Laya.Handler(this, (index) => {
                this.tabPage.selectedIndex = index;
                Laya.PhysicsDebugDraw.I && Laya.PhysicsDebugDraw.I.visible && (Laya.PhysicsDebugDraw.I.visible = false);
                !!IframeElementRT.instance.iframeElement && IframeElementRT.instance.closeVideo();
                index == 2 && this.item2Page.selectedIndex == 1 && !IframeElementRT.instance.iframeElement && IframeElementRT.instance.createElementVideo();
            });
            this.item0Tab.selectHandler = new Laya.Handler(this, (index) => {
                this.item0Page.selectedIndex = index;
            });
            this.item1Tab.selectHandler = new Laya.Handler(this, (index) => {
                this.item1Page.selectedIndex = index;
                if (index !== 4 && Laya.PhysicsDebugDraw.I && Laya.PhysicsDebugDraw.I.visible)
                    Laya.PhysicsDebugDraw.I.visible = false;
                else if (index == 4 && Laya.PhysicsDebugDraw.I && !Laya.PhysicsDebugDraw.I.visible)
                    Laya.PhysicsDebugDraw.I.visible = true;
            });
            this.item2Tab.selectHandler = new Laya.Handler(this, (index) => {
                this.item2Page.selectedIndex = index;
                switch (index) {
                    case 1:
                        !IframeElementRT.instance.iframeElement && IframeElementRT.instance.createElementVideo();
                        break;
                    case 2:
                        Laya.Scene.open("./uiDemo/page/OpenMainScene.scene", false);
                        break;
                    case 3:
                        Laya.Scene.open("./uiDemo/page/OpenScene.scene", false);
                        break;
                    case 4:
                        Laya.Scene.open("./uiDemo/Dialog.scene", false, { "title": "弹窗的标题", "text": "弹窗的具体文本……" });
                        break;
                }
                index !== 1 && !!IframeElementRT.instance.iframeElement && IframeElementRT.instance.closeVideo();
            });
            this.item3Tab.selectHandler = new Laya.Handler(this, (index) => {
                this.item3Page.selectedIndex = index;
            });
            this.item4Tab.selectHandler = new Laya.Handler(this, (index) => {
                this.item4Page.selectedIndex = index;
            });
        }
        onDisable() {
            Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
            Laya.stage.alignH = "left";
        }
    }

    class ProgressRT extends ui.uiDemo.useUI.ProgressUI {
        onAwake() {
            this.ani1.on(Laya.Event.COMPLETE, this, () => {
                this.ani1.stop();
                Laya.timer.once(3000, this, () => {
                    this.ani1.play();
                });
            });
            this.testProgress();
        }
        testProgress() {
            this.loading2.value = 0.01;
            this.loadText.changeText("资源加载中……");
            Laya.timer.loop(100, this, this.changeProgress);
        }
        changeProgress() {
            this.loading2.value += 0.01;
            if (this.loading2.value == 1) {
                this.loadText.changeText("资源加载完成");
                Laya.timer.clear(this, this.changeProgress);
                Laya.timer.once(3000, this, () => {
                    this.testProgress();
                });
            }
        }
    }

    class TextShowRT extends ui.uiDemo.useUI.TextShowUI {
        onAwake() {
            this.loadBitmapFont();
        }
        loadBitmapFont() {
            let bitmapFont = new Laya.BitmapFont();
            bitmapFont.loadFont("bitmapfont/gongfang.fnt", new Laya.Handler(this, this.onFontLoaded, [bitmapFont]));
        }
        onFontLoaded(bitmapFont) {
            Laya.Text.registerBitmapFont("gongfang", bitmapFont);
            this.btFont.font = "gongfang";
        }
    }

    class ChangeTextureRT extends ui.uiDemo.useUI.ChangeTextureUI {
        constructor() { super(); }
        onEnable() {
            Laya.timer.loop(2000, this, () => {
                this.changeImgSkin();
                this.changeSpriteTexture();
                this.changeFillTexture();
                this.changeTexture();
            });
        }
        changeImgSkin() {
            this.Img.skin = this.randomImg();
        }
        changeSpriteTexture() {
            this.spImg.loadImage(this.randomImg(true, 6, 5));
        }
        changeFillTexture() {
            this.graphics.clear();
            let _texture = Laya.loader.getRes(this.randomImg(true, 4));
            this.graphics.fillTexture(_texture, 10, 325, 132, 306);
        }
        changeTexture() {
            this._textureImg.graphics.clear();
            let _texture = Laya.loader.getRes(this.randomImg(true, 8, 7));
            this._textureImg.graphics.drawTexture(_texture);
        }
        randomImg(isMan = false, max = 8, min = 1) {
            let mum = Math.floor(Math.random() * (max - min + 1)) + min;
            if (isMan)
                return "role/m" + mum + ".png";
            return "role/w" + mum + ".png";
        }
        onDisable() {
        }
    }

    class MouseThroughRT extends ui.uiDemo.useUI.MouseThroughUI {
        constructor() { super(); }
        onEnable() {
            this.changeMouseCursor();
            this.throughTab.selectHandler = new Laya.Handler(this, this.onSwitchTab);
        }
        onSwitchTab(index) {
            switch (index) {
                case 0:
                    this.leftBg.hitTestPrior = true;
                    this.rightBg.hitTestPrior = true;
                    break;
                case 1:
                    this.leftBg.hitTestPrior = false;
                    this.rightBg.hitTestPrior = false;
                    break;
            }
        }
        changeMouseCursor() {
            this.leftBg.on(Laya.Event.MOUSE_OVER, this, () => {
                Laya.Mouse.cursor = "move";
            });
            this.leftBg.on(Laya.Event.MOUSE_OUT, this, () => {
                Laya.Mouse.cursor = "auto";
            });
            this.rightBg.on(Laya.Event.MOUSE_OVER, this, (e) => {
                Laya.Mouse.cursor = "move";
            });
            this.rightBg.on(Laya.Event.MOUSE_OUT, this, () => {
                Laya.Mouse.cursor = "auto";
            });
            this.leftBg.on(Laya.Event.CLICK, this, () => {
                Laya.Scene.open("uiDemo/Msg.scene", false, { "text": "点击了左侧的可点击区域", "point": { x: Laya.stage.mouseX - 100 } });
                console.log("click " + this.leftBg.name);
            });
            this.rightBg.on(Laya.Event.CLICK, this, () => {
                Laya.Scene.open("uiDemo/Msg.scene", false, { "text": "点击了右侧的可点击区域", "point": { x: Laya.stage.mouseX - 120 } });
                console.log("click " + this.rightBg.name);
            });
            this.btn1.on(Laya.Event.CLICK, this, (e) => {
                e.stopPropagation();
                Laya.Scene.open("uiDemo/Msg.scene", false, { "text": "点击了测试按钮1" });
                console.log("click btn1");
            });
            this.btn2.on(Laya.Event.CLICK, this, (e) => {
                e.stopPropagation();
                Laya.Scene.open("uiDemo/Msg.scene", false, { "text": "点击了测试按钮2" });
                console.log("click btn2");
            });
            this.close1.on(Laya.Event.CLICK, this, (e) => {
                e.stopPropagation();
                Laya.Scene.open("uiDemo/Msg.scene", false, { "text": "点击了左侧关闭按钮", "point": { x: Laya.stage.mouseX - 100 } });
                console.log("click " + this.close1.name);
            });
            this.close2.on(Laya.Event.CLICK, this, (e) => {
                e.stopPropagation();
                Laya.Scene.open("uiDemo/Msg.scene", false, { "text": "点击了右侧关闭按钮", "point": { x: Laya.stage.mouseX - 120 } });
                console.log("click " + this.close2.name);
            });
        }
        onDisable() {
        }
    }

    class PhysicalCollisionRT extends ui.uiDemo.useUI.PhysicalCollisionUI {
        onEnable() {
            this.bTop.getComponent(Laya.BoxCollider).width = this.bTop.width;
            this.bBottom.getComponent(Laya.BoxCollider).width = this.bBottom.width;
            this.bRight.getComponent(Laya.BoxCollider).height = this.bRight.height;
            this.bLeft.getComponent(Laya.BoxCollider).height = this.bLeft.height;
        }
    }

    var Event$3 = Laya.Event;
    class MaskRT extends ui.uiDemo.useUI.MaskUI {
        onEnable() {
            this._hitArea.on(Event$3.MOUSE_DOWN, this, () => {
                this._hitArea.off(Event$3.MOUSE_MOVE, this, this.bg3MaskMove);
                this._hitArea.startDrag();
                this._hitArea.on(Event$3.MOUSE_MOVE, this, this.bg3MaskMove);
            });
            this.on(Event$3.MOUSE_MOVE, this, this.maskMove);
        }
        bg3MaskMove(e) {
            e.stopPropagation();
            this.bg3Mask.x = this._hitArea.x;
            this.bg3Mask.y = this._hitArea.y;
        }
        maskMove() {
            let _point = this.globalToLocal(new Laya.Point(Laya.stage.mouseX, Laya.stage.mouseY)), maskX = _point.x - (this._mask.width / this.bg2.scaleX / 2), maskY = _point.y - (this._mask.height / this.bg2.scaleY / 2);
            if (maskX > 80 && maskY > 80) {
                this._mask.x = _point.x - (this._mask.width / this.bg2.scaleX / 2);
                this._mask.y = _point.y - (this._mask.height / this.bg2.scaleY / 2);
                this.bg2.x = (-_point.x - this._mask.width / 2) * (this.bg2.scaleX - 1);
                this.bg2.y = (-_point.y - this._mask.height / 2) * (this.bg2.scaleY - 1);
            }
        }
    }

    class Bullet extends Laya.Script {
        constructor() { super(); }
        onEnable() {
            var rig = this.owner.getComponent(Laya.RigidBody);
            rig.setVelocity({ x: 0, y: -10 });
        }
        onTriggerEnter(other, self, contact) {
            this.owner.removeSelf();
        }
        onUpdate() {
            if (this.owner.y < -10) {
                this.owner.removeSelf();
            }
        }
        onDisable() {
            Laya.Pool.recover("bullet", this.owner);
        }
    }

    class DropBox extends Laya.Script {
        constructor() {
            super();
            this.level = 1;
        }
        onEnable() {
            this._rig = this.owner.getComponent(Laya.RigidBody);
            this.level = Math.round(Math.random() * 5) + 1;
            this._text = this.owner.getChildByName("levelTxt");
            this._text.text = this.level + "";
        }
        onUpdate() {
            this.owner.rotation++;
        }
        onTriggerEnter(other, self, contact) {
            var owner = this.owner;
            if (other.label === "buttle") {
                if (this.level > 1) {
                    this.level--;
                    this._text.changeText(this.level + "");
                    owner.getComponent(Laya.RigidBody).setVelocity({ x: 0, y: -10 });
                    Laya.SoundManager.playSound("sound/hit.wav");
                }
                else {
                    if (owner.parent) {
                        let effect = Laya.Pool.getItemByCreateFun("effect", this.createEffect, this);
                        effect.pos(owner.x, owner.y);
                        owner.parent.addChild(effect);
                        effect.play(0, true);
                        owner.removeSelf();
                        Laya.SoundManager.playSound("sound/destroy.wav");
                    }
                }
                PhysicsGameMainRT.instance.addScore(1);
            }
            else if (other.label === "ground") {
                owner.removeSelf();
                PhysicsGameMainRT.instance.stopGame();
            }
        }
        createEffect() {
            let ani = new Laya.Animation();
            ani.loadAnimation("test/TestAni.ani");
            ani.on(Laya.Event.COMPLETE, null, recover);
            function recover() {
                ani.removeSelf();
                Laya.Pool.recover("effect", ani);
            }
            return ani;
        }
        onDisable() {
            Laya.Pool.recover("dropBox", this.owner);
        }
    }

    class LoopImg extends Laya.Script {
        constructor() { super(); }
        onEnable() {
        }
        onUpdate() {
        }
        onDisable() {
        }
    }

    class GameConfig {
        constructor() { }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("prefab/CloseBtn.ts", CloseBtn);
            reg("scence/d3Demo/D3Main.ts", D3Main);
            reg("Index.ts", Index);
            reg("GameEntry.ts", GameEntry);
            reg("LoadingRT.ts", LoadingRT);
            reg("scence/physicsDemo/PhysicsGameMainRT.ts", PhysicsGameMainRT);
            reg("scence/physicsDemo/PhysicsGameMain.ts", PhysicsGameMain);
            reg("scence/uiDemo/animation/AtlasAniRT.ts", AtlasAniRT);
            reg("scence/uiDemo/animation/FrameAniRT.ts", FrameAniRT);
            reg("scence/uiDemo/animation/SkeletonAni.ts", SkeletonAni);
            reg("prefab/Role.ts", Role);
            reg("script/tween/Folded.ts", Folded);
            reg("scence/uiDemo/DialogRT.ts", DialogRT);
            reg("script/mouse/Joystick.ts", Joystick);
            reg("scence/uiDemo/interactive/ShapeDetectionRT.ts", ShapeDetectionRT);
            reg("script/mouse/DragAndTips.ts", DragAndTips);
            reg("scence/uiDemo/interactive/ShapeDetection.ts", ShapeDetection);
            reg("scence/uiDemo/list/BagListRT.ts", BagListRT);
            reg("scence/uiDemo/list/ComboBoxRT.ts", ComboBoxRT);
            reg("scence/uiDemo/list/LoopListRT.ts", LoopListRT);
            reg("scence/uiDemo/list/MailListRT.ts", MailListRT);
            reg("scence/uiDemo/list/RefreshRT.ts", RefreshRT);
            reg("runtime/box/dataSource/ItemBox.ts", ItemBox);
            reg("scence/uiDemo/list/TreeListRT.ts", TreeListRT);
            reg("scence/uiDemo/MsgRT.ts", MsgRT);
            reg("scence/uiDemo/page/IframeElementRT.ts", IframeElementRT);
            reg("scence/uiDemo/page/OpenMainScene.ts", OpenMainScene);
            reg("scence/uiDemo/page/OpenScene.ts", OpenScene);
            reg("scence/uiDemo/page/UsePanelRT.ts", UsePanelRT);
            reg("script/mouse/BgImg.ts", bgImg);
            reg("scence/uiDemo/UiMainRT.ts", UiMainRT);
            reg("scence/uiDemo/useUI/ProgressRT.ts", ProgressRT);
            reg("scence/uiDemo/useUI/TextShowRT.ts", TextShowRT);
            reg("scence/uiDemo/useUI/ChangeTextureRT.ts", ChangeTextureRT);
            reg("scence/uiDemo/useUI/MouseThroughRT.ts", MouseThroughRT);
            reg("scence/uiDemo/useUI/PhysicalCollisionRT.ts", PhysicalCollisionRT);
            reg("scence/uiDemo/useUI/MaskRT.ts", MaskRT);
            reg("prefab/Bullet.ts", Bullet);
            reg("prefab/DropBox.ts", DropBox);
            reg("prefab/LoopImg.ts", LoopImg);
        }
    }
    GameConfig.width = 1334;
    GameConfig.height = 750;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "middle";
    GameConfig.alignH = "center";
    GameConfig.startScene = "Loading.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = true;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            Config.useRetinalCanvas = true;
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.stage.bgColor = "#efeed7";
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError(true);
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
