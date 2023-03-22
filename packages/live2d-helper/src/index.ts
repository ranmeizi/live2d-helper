import * as EVENTS from './Events'

export default class ModelHelper {
    constructor(workerPath: string) {
        this.workerPath = workerPath
    }

    workerPath = ''
    worker = null
    controller = null

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
        this.controller = new Controller(this.worker)
        this.worker.postMessage({
            type: EVENTS.INIT,
            canvas: offscreen
        }, [offscreen]);
    }

}

class Controller {
    constructor(worker: Worker) {

    }
    /**
     * 加载模型
     * 销毁上一个模型
     * @param path 模型path
     */
    loadModel(path: string) {

    }

    doMotion(name: string) {

    }

    get motions() {
        return ['1', '2']
    }
}