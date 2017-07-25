module.exports = function css(data, prefix, frameduration) {
    
    var frames = data.frames,
        len = frames.length,
        per = 100 / len; 

    var frame = frames[0],
        width = frame.width,
        height = frame.height; 

    var keyframesStr = frames.reduce(function(str, frame, i, frames){

        var dist = frame.file;
        var percent = (i * (per)).toFixed(2);
        percent = percent == 0? 0: percent; // fix 0.00 to 0;

        str += `
    ${percent}% {
        background-image: url("img/${dist}");
    }
`;
        if (i == len - 1) {
            str += `
    100% {
        background-image: url("img/${dist}");
    }
`;      }

        return str;

    }, "");

    var css = `.gka-base {
    width: ${width + "px"};
    height: ${height + "px"};
    /* background-size: contain;*/

    animation-timing-function: steps(1);
    animation-iteration-count: infinite;

    background-repeat: no-repeat;

    animation-fill-mode: forwards;

    background-position: center center;

    /* Play once*/
    /* animation-iteration-count: 1; */ 
}

`;

    css += `.${prefix}animation {
    animation-name: ${prefix}keyframes;
    animation-duration: ${len * frameduration}s;
}

@-webkit-keyframes ${prefix}keyframes {${keyframesStr}}
`;

    return css;
}