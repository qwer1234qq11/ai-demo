/** 通用界面绘制工具：全部用代码绘制，不需要额外的图片资源 */
export const THEME = {
    bg: "#0b1020",
    panel: "#151d33",
    panelLight: "#1d2842",
    border: "#2b3a5c",
    text: "#e8eefc",
    sub: "#8b9bc4",
    primary: "#4f7cff",
    accent: "#22d3ee",
    danger: "#fb7185",
    gold: "#facc15"
};

/** 画圆角矩形（基于 Graphics.drawPath + arcTo） */
export function roundRect(g: Laya.Graphics, x: number, y: number, w: number, h: number, r: number, fill: string, border: string = null, lineWidth: number = 2): void {
    let paths: any[] = [
        ["moveTo", r, 0],
        ["lineTo", w - r, 0],
        ["arcTo", w, 0, w, r, r],
        ["lineTo", w, h - r],
        ["arcTo", w, h, w - r, h, r],
        ["lineTo", r, h],
        ["arcTo", 0, h, 0, h - r, r],
        ["lineTo", 0, r],
        ["arcTo", 0, 0, r, 0, r],
        ["closePath"]
    ];
    let brush: any = { fillStyle: fill };
    let pen: any = border ? { strokeStyle: border, lineWidth: lineWidth } : null;
    g.drawPath(x, y, paths, brush, pen);
}

/** 创建一行文本 */
export function makeLabel(text: string, x: number, y: number, w: number, h: number, size: number, color: string, align: string = "left", bold: boolean = false): Laya.Text {
    let t: Laya.Text = new Laya.Text();
    t.text = text;
    t.pos(x, y);
    t.size(w, h);
    t.fontSize = size;
    t.color = color;
    t.bold = bold;
    t.align = align;
    t.valign = "middle";
    t.overflow = "visible";
    return t;
}

/**
 * 创建一个按钮。
 * onClick 在抬起时触发；onDown 在按下时触发（用于俄罗斯方块的按住连发）。
 */
export function makeButton(text: string, x: number, y: number, w: number, h: number, fill: string, textColor: string, caller: any, onClick: Function, fontSize: number = 26, onDown: Function = null): Laya.Sprite {
    let btn: Laya.Sprite = new Laya.Sprite();
    btn.pos(x, y);
    btn.size(w, h);
    btn.mouseEnabled = true;
    roundRect(btn.graphics, 0, 0, w, h, 12, fill, THEME.border, 2);
    btn.addChild(makeLabel(text, 0, 0, w, h, fontSize, textColor, "center", true));
    btn.on(Laya.Event.MOUSE_DOWN, caller, (e: any) => {
        btn.alpha = 0.65;
        if (onDown) onDown.call(caller, e);
    });
    btn.on(Laya.Event.MOUSE_UP, caller, (e: any) => {
        btn.alpha = 1;
        if (onClick) onClick.call(caller, e);
    });
    btn.on(Laya.Event.MOUSE_OUT, caller, (e: any) => { btn.alpha = 1; });
    return btn;
}

/** 修改按钮上的文字（按钮的第一个子节点就是文字） */
export function setButtonText(btn: Laya.Sprite, text: string): void {
    let lb: Laya.Text = btn.getChildAt(0) as Laya.Text;
    lb.text = text;
}
