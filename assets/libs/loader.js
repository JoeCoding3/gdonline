let levelScript
async function require (path) {
    return new Promise(function (resolve) {
        path = "./assets/" + path
        let elem
        if (path.endsWith(".js")) {
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
    await require("libs/fileutil.js")
    await require("options.js")
    await require("sprites/info.js")
    await require("level/load.js")
    await require("libs/input.js")
    await require("level/collision.js")
    await require("libs/update.js")
    await require("level/editor.js")
    await require("libs/gdtojsonprops.js")
    await require("libs/gdtojson.js")
    
    await loadLevelScript()
}
async function loadLevelScript () {
    if (levelScript != undefined) levelScript.remove()
    let name
    if (window["levelName"] == undefined) name = constDefaults.levelName
    else name = levelName
    
    levelScript = await require("level/levels/" + name + ".level.js")
}
