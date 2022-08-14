class AssetBucket {
    constructor (fs, ctxManager) {
        this.fs = fs;
        this.manager = ctxManager;
        this.assets = {};
    }
    
    load (type, content, name) {
        return new Promise((resolve, reject) => {
            if (this.assets.hasOwnProperty(name)) resolve();
            
            if (type === 'artboard') {
                this.assets[name] = this.manager.getContext(content).canvas;
                resolve();
            }
            
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                this.assets[name] = img;
                resolve();
            }
            img.onerror = (e) => {
                reject(e);
            }
            if (type === 'md5') img.src = `${this.fs}/${content}`;
            else img.src = content;
        });
    }
    
    unload (name) {
        if (this.assets.hasOwnProperty(name)) {
            delete this.assets[name];
        }
    }
}

export default AssetBucket;
