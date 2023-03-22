importScripts("./live2dcubismcore.min.js");

import * as EVENTS from '../Events'
import { LAppDelegate } from '../../utils/lappdelegate';


const controllers = {
    [EVENTS.INIT]({ canvas }) {
        if (LAppDelegate.getInstance().initialize(canvas) == false) {
            return;
        }

        LAppDelegate.getInstance().run();
        console.log('收到init')
    },
    [EVENTS.LOAD_MODEL]() {

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
