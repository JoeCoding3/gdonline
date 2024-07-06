let exportLevelHandle
let exportLevelName
let exportLevelSaved = true
let level = []
async function loadLevel (noScript) {
    if (!noScript) await loadLevelScript()

    collisionBoxes = []
    let defLevel = [...level]
    for (let obj of Object.keys(defaultObjInfo)) if (defaultObjInfo[obj].auto) defLevel.push({obj})
    for (let box of defLevel) addCollisionBox(box)
    addEndObj()

    renderLevel()
}
function addCollisionBox (levelObj, noAdd) {
    let boxObj = {}
    assignValues(boxObj, defaultObjGlobalInfo)
    assignValues(boxObj, defaultObjInfo[levelObj.obj])
    assignValues(boxObj, structuredClone(levelObj))

    if (boxObj.hitX == undefined) boxObj.hitX = boxObj.hitW / -2
    if (boxObj.hitY == undefined) boxObj.hitY = boxObj.hitH / -2
    if (boxObj.imgX == undefined) boxObj.imgX = boxObj.hitX
    if (boxObj.imgY == undefined) boxObj.imgY = boxObj.hitY
    if (boxObj.imgW == undefined) boxObj.imgW = boxObj.hitW
    if (boxObj.imgH == undefined) boxObj.imgH = boxObj.hitH
    if (boxObj.resizeW == undefined) boxObj.resizeW = boxObj.imgW
    if (boxObj.resizeH == undefined) boxObj.resizeH = boxObj.imgH
    
    if (!boxObj.repeat) {
        if (boxObj.rot == 180) {
            boxObj.hitY *= -1
            boxObj.hitY -= boxObj.hitH
        }
        boxObj.hitX += boxObj.imgX
        boxObj.hitY += boxObj.imgY
    }

    if (noAdd) return boxObj
    else {
        collisionBoxes.push(boxObj)
        collisionBoxes.sort((a, b) => a.zIndex - b.zIndex)
    }
}
function getCollisionBox (x, y) {
    let boxes = []
    for (let index in collisionBoxes) {
        let box = collisionBoxes[index]
        let checkY1 = y
        let checkY2 = y
        if (!box.noAlign) checkY1 = alignObjY(y, box.imgH), checkY2 = alignObjY(y, box.imgH, true)
        if (box.imgX == x && (box.imgY == checkY1 || box.imgY == checkY2)) boxes.push(index)
    }
    boxes.sort((a, b) => b - a)
    return boxes[0]
}
function cBoxToLevelObj (cBox) {
    let objName = cBox.obj
    if (objName != "bg" && objName != "ground" && objName != "fixer" && objName != "ending") {
        let lObj = {
            obj: objName
        }
        let keys = Object.keys(cBox)
        for (let key of keys) {
            let val = cBox[key]
            let subKey = key.substring(5)
            if (key.startsWith("orig_") && val != defaultObjGlobalInfo[subKey] && val != defaultObjInfo[objName][subKey] && subKey != "obj" && subKey != "special") lObj[subKey] = val
        }

        if (lObj.hitX == lObj.hitW / -2) delete lObj.hitX
        if (lObj.hitY == lObj.hitH / -2) delete lObj.hitY
        if (lObj.imgX == lObj.hitX) delete lObj.imgX
        if (lObj.imgY == lObj.hitY) delete lObj.imgY
        if (lObj.imgW == lObj.hitW) delete lObj.imgW
        if (lObj.imgH == lObj.hitH) delete lObj.imgH
        if (lObj.resizeW == lObj.imgW) delete lObj.resizeW
        if (lObj.resizeH == lObj.imgH) delete lObj.resizeH

        return lObj
    }
}
function assignValues (target, source) {
    for (let sourceKey of Object.keys(source)) {
        let sourceVal = source[sourceKey]
        let origSourceVal = sourceVal
        if (sourceKey != "obj" && sourceKey != "type" && sourceKey != "texture") sourceVal = eval(sourceVal)
        target[sourceKey] = sourceVal
        if (target["orig_" + sourceKey] == undefined) target["orig_" + sourceKey] = origSourceVal
    }
}

async function renderLevel () {
    canvas.clear()
    
    for (let box of collisionBoxes) {
        let x = box.imgX
        let y = box.imgY
        let w = box.imgW
        let h = box.imgH
        let rW = box.resizeW
        let rH = box.resizeH
        let r = box.rot
        let o = box.repeat ? 2 : 0

        if (objImgs[box.obj] == undefined) {
            let path = "./assets/sprites/" + box.texture + ".png"
            objImgs[box.obj] = await canvas.img(x, y, path, w, h, rW, rH, r, o)
        } else canvas.img(x, y, objImgs[box.obj], w, h, rW, rH, r, o)
    }
}

function startLevelExport (bypassEditor, saveAs) {
    if (editorEnabled || bypassEditor) {
        let name = saveAs ? undefined : exportLevelName
        if (name == undefined) name = prompt("Level name to export", "level")
        if (name != null) exportLevel(name, false, saveAs)
    }
}
async function exportLevel (name, noPrompt, overrideHandle) {
    if (name == undefined) startLevelExport(true)
    else {
        exportLevelName = name
        
        let levelObjs = []
        for (let box of collisionBoxes) {
            let lObj = cBoxToLevelObj(box)
            if (lObj != undefined) levelObjs.push(lObj)
        }

        let strObjs = JSON.stringify(levelObjs)
        let levelStr = "level=" + strObjs + "\n"

        if (exportLevelHandle == undefined || overrideHandle) exportLevelHandle = await downloadFile(levelStr, name, ".level.txt")
        else await writeFile(levelStr, exportLevelHandle)

        exportLevelSaved = true
        if (!noPrompt) alert("Level saved as " + name + ".level.txt!")
    }
}
async function startLevelImport (bypassEditor, filePicker) {
    let noScript = false

    if (editorEnabled || bypassEditor) {
        if (filePicker) {
            let [handle] = await fileutil.file.get(".level.txt")
            let content = await handle.read()
            level = Function(content + "; return level")()

            noScript = true
        } else {
            let name = prompt("Level name to import", "level")
            if (name == null) return
            levelName = name
        }

        resetPlayer(noScript)
        if (editorEnabled) toggleEditor()
    }
}

function removeEndObj () {
    for (let index in collisionBoxes) {
        let box = collisionBoxes[index]
        if (box.obj == "ending") collisionBoxes.splice(index, 1)
    }
}
function addEndObj () {
    removeEndObj()

    let maxBox = {imgX: 0, imgW: 0}
    for (let box of collisionBoxes) if (box.imgX + (box.imgW / 2) > maxBox.imgX + (maxBox.imgW / 2) && box.obj != "bg" && box.obj != "ground" && box.obj != "fixer" && box.obj != "ending") maxBox = box
    
    let endX = maxBox.imgX + (maxBox.imgW / 2) + defaultObjInfo.ending.special.spacing
    if (endX < innerWidth - (editorGridSize / 2)) endX = innerWidth - (editorGridSize / 2)
    addCollisionBox({
        obj: "ending",
        imgX: endX
    })
}
function endLevel () {
    if (!levelEnded) {
        playerCanvas.text(innerWidth / 2, innerHeight / 2, 100, objTypeHitCols.text, "Level Complete!")
        document.body.style.cursor = "default"
    }
    levelEnded = true
}
