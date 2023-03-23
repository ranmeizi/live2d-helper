import * as EVENTS from './Events'

interface IModelHelperInit {
    resourcePath: string // 资源地址
    workerPath: string // worker 地址
}

export default class ModelHelper {
    constructor({
        resourcePath,
        workerPath
    }: IModelHelperInit) {
        this.resourcePath = resourcePath
        this.workerPath = workerPath
    }
    resourcePath: string
    workerPath: string
    worker: Worker

    /**
     * 初始化，创建 canvas 和 worker 线程
     */
    initialize(canvas: HTMLCanvasElement) {
        if (!canvas.transferControlToOffscreen) {
            // 报错 不要用了
            throw new ReferenceError("live2d-helper,make sure your browser support OffscreenCanvas")
        }

        const offscreen = canvas.transferControlToOffscreen()
        this.worker = new Worker(this.workerPath)
        this.worker.postMessage({
            type: EVENTS.INIT,
            canvas: offscreen
        }, [offscreen]);
    }


    /**
     * 加载模型
     * 销毁上一个模型
     * @param name 模型 name
     */
    loadModel(name: string) {
        this.worker.postMessage({
            type: EVENTS.LOAD_MODEL,
            resourcePath: this.resourcePath,
            name: name
        });
    }

    doMotion(name: string) {

    }

    get motions() {
        return ['1', '2']
    }
}