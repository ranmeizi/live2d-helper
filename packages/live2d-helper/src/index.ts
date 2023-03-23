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
        // 监听事件
        this.addEvent(canvas)

        this.worker = new Worker(this.workerPath)
        this.worker.postMessage({
            type: EVENTS.INIT,
            canvas: offscreen
        }, [offscreen]);
    }

    addEvent(canvas: HTMLCanvasElement) {
        // 鼠标事件
        canvas.addEventListener('mousedown', this.TransportEvent)
        canvas.addEventListener('mousemove', this.TransportEvent)
        canvas.addEventListener('mouseup', this.TransportEvent)
        // 触摸事件
        canvas.addEventListener('touchstart', this.TransportEvent)
        canvas.addEventListener('touchmove', this.TransportEvent)
        canvas.addEventListener('touchend', this.TransportEvent)
        canvas.addEventListener('touchcancel', this.TransportEvent)
    }

    removeEvent(canvas: HTMLCanvasElement) {
        // 鼠标事件
        canvas.removeEventListener('mousedown', this.TransportEvent)
        canvas.removeEventListener('mousemove', this.TransportEvent)
        canvas.removeEventListener('mouseup', this.TransportEvent)
        // 触摸事件
        canvas.removeEventListener('touchstart', this.TransportEvent)
        canvas.removeEventListener('touchmove', this.TransportEvent)
        canvas.removeEventListener('touchend', this.TransportEvent)
        canvas.removeEventListener('touchcancel', this.TransportEvent)
    }

    TransportEvent = (e) => {
        const event = {}
        for (let prop in e) {
            if (typeof e[prop] !== 'function' && typeof e[prop] !== 'object') {
                event[prop] = e[prop]
            }
        }
        // 获取 rect
        const rect = (e.target as Element).getBoundingClientRect();

        this.worker.postMessage({
            type: EVENTS.CANVAS_EVENT,
            e: event,
            rect
        })
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