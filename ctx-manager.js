import StageLayering from './stage-layering';

class CtxManager {
    constructor (runtime) {
        this.runtime = runtime;
        this._drawable = [];
        this._penSkinId = -1;
        this.initialize();
    }

    shouldCreatePenLayer () {
        if (this._penSkinId < 0) return true;
        if (!this.runtime.renderer._allSkins[this._penSkinId]) return true;
        return false;
    }

    get penSkinId () {
        if (this.shouldCreatePenLayer() && this.runtime.renderer) {
            this._penSkinId = this.runtime.renderer.createPenSkin();
            this._penDrawableId = this.runtime.renderer.createDrawable(StageLayering.PEN_LAYER);
            this.runtime.renderer.updateDrawableSkinId(this._penDrawableId, this._penSkinId);
        }
        return this._penSkinId;
    }

    /**
     * 创建画布
     */
    createCanvas () {
        const [w, h] = this.runtime.renderer._allSkins[this.penSkinId].size;
        const canvas = document.createElement("canvas"); // 创建canvas元素
        canvas.width = w;
        canvas.height = h;
        return canvas;
    }

    /**
     * 初始化
     */
    initialize () {
        // 创建初始画布
        this._drawable = [];
        
        const canvas = this.createCanvas();
        if (!canvas) throw new Error("CanvasEngine: Can't create canvas");
        this._drawable[0] = canvas;

        const stampCanvas = this.createCanvas();
        this._stampStuff = {
            skinId: this.runtime.renderer.createBitmapSkin(stampCanvas, 1),
            drawableId: this.runtime.renderer.createDrawable(StageLayering.PEN_LAYER)
        }
        this.runtime.renderer.updateDrawableSkinId(this._stampStuff.drawableId, this._stampStuff.skinId);
        this.runtime.renderer.updateDrawableVisible(this._stampStuff.drawableId, false);
    }

    /**
     * 获取指定id画布
     * 按照规定只应通过此函数获取画布示例
     * @returns {Canvas} 画布
     * @throws {Error} 如果id不存在则抛出异常
     */
    getContext (id) {
        if (!this._drawable[id]) {
            const canvas = this.createCanvas();
            if (!canvas) throw new Error("CanvasEngine: Can't create canvas");
            this._drawable[id] = canvas;
        }
        return this._drawable[id].getContext('2d');
    }

    /**
     * 将指定画布打印至舞台
    */
    stampOnStage (id) {
        if (!this.penSkinId) return;
        const ctx = this.getContext(id);
        if (!ctx) return;

        const imageData = ctx.getImageData(0, 0, 480, 360);
        this.runtime.renderer._allSkins[this.penSkinId]._setTexture(imageData);
        this.runtime.renderer.penStamp(this.penSkinId, this._stampStuff.drawableId);
        this.runtime.requestRedraw();
    }
}

export default CtxManager;
