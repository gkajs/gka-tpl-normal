function isEqualObj(a, b) {
  for (let key in b) if (a[key] !== b[key]) return false;
  return true;
}

function getKeyFrames(key, frames, data) {
    var len = frames.length,
        per = 100 / (len);  // len === 2，0% 50% 100% ，确保播放 0% 和 50%

    var beforeData = {},
        curData = {},
        filepath = "";

    var keyframesStr = frames.reduce(function(str, frame, i, frames){

        var percent = (i * (per)).toFixed(2);
        percent = percent == 0? 0: percent; // fix 0.00 to 0;

        filepath = './img/' + (data.file || frame.file);

        curData = {
            filepath: filepath,
        }

        if (isEqualObj(beforeData, curData)) return str;

        str += `
    ${percent}% {
        background-image: url("${filepath}");
    }`;
        
        if (i == len - 1) {
            str += `
    100% {
        background-image: url("${filepath}");
    }
`;      }

        beforeData = curData;
        return str;
    }, "");

    return {
        keyframesStr: keyframesStr,
        len: len,
        key: key
    };
}

function getDuration(keyframes, frameduration) {
    var arr = [];
    for (var i = 0; i < keyframes.length; i++) {
        arr.push((keyframes[i].len * frameduration) + 's');
    }
    return arr;
}

function getName(keyframes, prefix) {
    var arr = [];

    for (var i = 0, key; i < keyframes.length; i++) {
        key = keyframes[i].key;
        var name = prefix + 'keyframes' + (key !== '' ? '-' + key: '');
        arr.push(name);
    }
    return arr;
}

function getDelay(keyframes, frameduration) {
    var arr = [],
        res = [];
    arr.push(0);
    res.push('0s');

    for (var i = 1, before, current; i < keyframes.length; i++) {
        before = arr[arr.length - 1];
        current = before + (Number(keyframes[i - 1].len * frameduration));
        current = Math.round(current * 100) / 100;
        arr.push(current);
        res.push(current + 's');
    }
    return res;
}

function getStr(len, val) {
    return Array(len).fill(val).join(', ');
}

module.exports = function css(data, prefix, frameduration) {
    var frames = data.frames,
        keyMap = data.keyMap,
        keyframes = [],
        _frames = [];

    for (var key in keyMap) {
        _frames = keyMap[key].map(key => {
            return frames[key]
        });
        keyframes.push(getKeyFrames(key, _frames, data));
    }

    var duration = getDuration(keyframes, frameduration),
        names = getName(keyframes, prefix),
        delays = getDelay(keyframes, frameduration),
        counts = keyframes.length === 1? 'infinite' : getStr(keyframes.length - 1, 1) + ', infinite',
        functions = getStr(keyframes.length, 'steps(1)'),
        modes = getStr(keyframes.length, 'forwards');

    var firstFrame = frames[0],
        width = firstFrame.width,
        height = firstFrame.height;

    var css = `.${prefix}animation {
    width: ${width + "px"};
    height: ${height + "px"};
    
    background-image: url("${'./img/' + (data.file || firstFrame.file)}");
    background-repeat: no-repeat;

    animation-name: ${names.join(', ')};
    animation-duration: ${duration.join(', ')};
    animation-delay: ${delays.join(', ')};
    animation-iteration-count: ${counts};
    
    animation-fill-mode: ${modes};
    animation-timing-function: ${functions};
}

`;

    for(var j = 0; j < names.length; j++) {
        css += `@-webkit-keyframes ${names[j]} {${keyframes[j].keyframesStr}}

`;
    }

    return css;
}