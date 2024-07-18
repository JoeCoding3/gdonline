let levelScript
async function require (path) {
    return new Promise(function (resolve) {
        path = "./assets/" + path
        let elem
        if (path.endsWith(".js") || path.endsWith(".txt")) {
            elem = document.createElement("script")
            elem.src = path
            
            elem.onload = function () {
                resolve(this)
            }.bind(elem)
        } else if (path.endsWith(".css") || path.endsWith(".png")) {
            elem = document.createElement("link")
            elem.href = path
            elem.rel = path.endsWith(".css") ? "stylesheet" : "icon"

            resolve(elem)
        }

        document.head.append(elem)
    })
}
async function loadAssets () {
    await require("style/icon.png")
    await require("style/style.css")

    await require("libs/errors.js")
    await require("libs/consts.js")
    await require("libs/utils.js")
    await require("libs/canvas.js")
    await require("libs/idb.js")
    await require("libs/fileutil.js")
    await require("libs/info.js")
    await require("libs/load.js")
    await require("libs/input.js")
    await require("libs/collision.js")
    await require("libs/update.js")
    await require("libs/editor.js")
    await require("libs/gdtojsonprops.js")
    await require("libs/gdtojson.js")
    await require("libs/importgdkeys.js")
    await require("libs/importgd.js")
    await require("libs/pako.js")
    
    await require("options.js")
}
async function loadLevelScript () {
    if (levelScript != undefined) levelScript.remove()
    let name
    if (window["levelName"] == undefined) name = constDefaults.levelName
    else name = levelName
    
    levelScript = await require("level/levels/" + name + ".level.txt")
}
