function loadLevel () {
    collisionBoxes = []
    let defLevel = [...level]
    for (let obj of Object.keys(defaultObjInfo)) if (defaultObjInfo[obj].auto) defLevel.push({obj})
    for (let box of defLevel) addCollisionBox(box)

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
    if (objName != "bg" && objName != "ground") {
        let lObj = {
            obj: objName
        }
        let keys = Object.keys(cBox)
        for (let key of keys) {
            let val = cBox[key]
            let subKey = key.substring(5)
            if (key.startsWith("orig_") && val != defaultObjGlobalInfo[subKey] && val != defaultObjInfo[objName][subKey] && subKey != "obj") lObj[subKey] = val
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
        target["orig_" + sourceKey] = origSourceVal
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

        if (box.img == undefined) {
            let path = "./assets/sprites/" + box.texture + ".png"
            box.img = await canvas.img(x, y, path, w, h, rW, rH, r, o)
        } else canvas.img(x, y, box.img, w, h, rW, rH, r, o)
    }
}

function exportLevel (name) {
    let levelObjs = []
    for (let box of collisionBoxes) {
        let lObj = cBoxToLevelObj(box)
        if (lObj != undefined) levelObjs.push(lObj)
    }

    let strObjs = JSON.stringify(levelObjs)
    let levelStr = "registerConsts({level:" + strObjs + "})"
    downloadFile("text/plain", levelStr, name + ".js")
}
function startLevelExport () {
    if (editorEnabled) {
        let name = prompt("Level name", "level")
        if (name != null) exportLevel(name)
    }
}
