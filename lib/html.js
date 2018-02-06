var pkg = require("../package.json");

module.exports = function html(names, prefix, cssFileName) {

var  str = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"/>
    <title>gka-preview</title>
    <link href="./${cssFileName? cssFileName: 'gka.css'}" rel="stylesheet" type="text/css">
</head>
<body style="text-align: center;">
    <div id="gka" class="gka-base"></div>

    <div style="position: fixed; bottom: 10px;">
        Powered By <a target="_blank" href="https://github.com/gkajs/gka">gka</a> .
        Template By <a target="_blank" href="https://github.com/gkajs/gka-tpl-normal">gka-tpl-normal</a> ${pkg.version}
    </div>
    <script>
    function loadImage(names, cb, prefix){
        window.gkaCache = window.gkaCache || [];
        var n = 0, img;
        names.forEach(function(name) {
            img = new Image();
            window.gkaCache.push(img);
            img.onload = function() {
                (++n === names.length) && cb && cb();
            };
            img.src = (prefix || '') + name;
        });
    }

    var imgNames = ${names};

    loadImage(imgNames, function() {
        document.getElementById('gka').className += " ${prefix}animation"
    }, "img/")
    </script>
</body>
</html>
`;

    return str;
}
