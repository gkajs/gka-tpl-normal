var html = require("./lib/html"),
	css = require("./lib/css");

module.exports = function (data, opts, tool) {
    var prefix = opts.prefix,
        frameduration = opts.frameduration;

    var names = tool.getNames();
    
    tool.writeFile("gka.css", css(data, prefix, frameduration));
    tool.writeFile("gka.html", html(names, prefix));

    // 子目录中每一个文件夹都生成对应html、css
    var frames = data.frames,
        keyMap = data.keyMap,
        cssFileName = '';

    if (!keyMap || Object.keys(keyMap).length === 1) return;

    for (var key in keyMap) {
        cssFileName = key + "-gka.css";
    	tool.writeFile(cssFileName, css({
    		frames: data.frames,
    		keyMap: {
    			[key] : keyMap[key]
    		}
    	}, prefix, frameduration));
    	tool.writeFile(key + "-gka.html", html(names, prefix, cssFileName));
    }
};

