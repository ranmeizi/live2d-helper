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
    },
    [EVENTS.LOAD_MODEL]({
        resourcePath,
        name
    }) {
        LAppLive2DManager.getInstance()._custChangeScene({ name, resourcePath })
    },
    [EVENTS.DO_MOTION]() {

    }
}

self.addEventListener('message', function (e) {
    const type = e.data.type

    if (type in controllers) {
        controllers[type].call(this, e.data)
    }
})
