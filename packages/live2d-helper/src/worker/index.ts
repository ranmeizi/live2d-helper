importScripts("./live2dcubismcore.min.js");

import * as EVENTS from '../Events'
import { LAppDelegate } from '../../utils/lappdelegate';
import { LAppLive2DManager } from '../../utils/lapplive2dmanager';


const controllers = {
    [EVENTS.INIT]({ canvas }) {
        if (LAppDelegate.getInstance().initialize(canvas) == false) {
            return;
        }

        LAppDelegate.getInstance().run();
        // @ts-ignore
        self.__kankan = LAppDelegate.getInstance()
    },
    [EVENTS.LOAD_MODEL]({
        resourcePath,
        name
    }) {
        LAppLive2DManager.getInstance()._custChangeScene({ name, resourcePath })
    },
    [EVENTS.DO_MOTION]() {
        // TODO
    },
    [EVENTS.CANVAS_EVENT]({ e, rect }) {
        e.target = {
            getBoundingClientRect() {
                return rect
            }
        }
        switch (e.type) {
            case 'touchstart': LAppDelegate.onTouchBegan(e); break;
            case 'touchmove': LAppDelegate.onTouchMoved(e); break;
            case 'touchend': LAppDelegate.onTouchEnded(e); break;
            case 'touchcancel': LAppDelegate.onTouchCancel(e); break;
            case 'mousedown': LAppDelegate.onClickBegan(e); break;
            case 'mousemove': LAppDelegate.onMouseMoved(e); break;
            case 'mouseup': LAppDelegate.onClickEnded(e); break;
        }
    }
}

self.addEventListener('message', function (e) {
    const type = e.data.type

    if (type in controllers) {
        controllers[type].call(this, e.data)
    }
})
