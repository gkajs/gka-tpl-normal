var gkaUtils = require('gka-utils');

function getConfig(frame, i, frames, key) {
    var {
        width,
        height,
        offX,
        offY,
        file,
        x,
        y,
        w,
        h,
    } = frame;

    var file = './img/' + file;

    return {
        'background-image': `url("${file}")`,
    }
}

function injectAnimationCSS(firstFrame) {
    var {
        width,
        height,
        offX,
        offY,
        file,
        x,
        y,
        w,
        h,
    } = firstFrame;

    return {
        width: `${width + "px"}`,
        height: `${height + "px"}`
    }
}

module.exports = function css(data, opts) {
    var css = gkaUtils.css.getKeyframesCSS(data, opts, {
        getConfig,
        injectAnimationCSS
    });

    return css;
}