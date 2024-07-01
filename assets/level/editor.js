let editorEnabled = false
let pauseEnabled = false
let gameStatus = ""
let currentBlock = "block"
let editorIconIndex = 0
let editorIconMax = 0
let editorGridX = 0
let editorGridY = 0
let editorIconNames = []
let levelStartOffset = 0
registerConsts({
    editorGridSize: 60
})
async function toggleEditor (restart) {
    if (editorEnabled && !exportLevelSaved) await exportLevel(exportLevelName, true)
    levelEnding = false

    editorEnabled = !editorEnabled
    if (editorEnabled) {
        if (pauseEnabled) togglePause()
        gameStatus = "Editor"
        document.body.style.cursor = "pointer"
        playerOnGround = false

        if (editorIconNames == "") {
            editorIconMax = -1
            let objs = Object.keys(defaultObjInfo)
            for (let index in objs) {
                let objName = objs[index]
                let obj = defaultObjInfo[objName]
                if (!obj.noEditor) {
                    editorIconMax++
                    editorIconNames.push(objName)
                }
            }
        }
        
        removeEndObj()
    } else {
        resetConst("playerSpdX")
        gameStatus = ""
        document.body.style.cursor = "none"
        
        addEndObj()
    }

    if (restart) {
        playerX = -playerW / 2

        calculateStartOffset()
        for (let box of collisionBoxes) {
            if (!box.repeat) {
                box.imgX -= levelStartOffset
                box.hitX -= levelStartOffset
            }
        }
    }
}
function click (btn, x, y) {
    exportLevelSaved = false
    calculateStartOffset()
    
    let gridX = snapToGrid(x, editorGridSize, editorGridX)
    let gridY = snapToGrid(y, editorGridSize, editorGridY)
    if (btn == 0) {
        let objInfo = addCollisionBox({obj: currentBlock}, true)
        let y = gridY
        if (!objInfo.noAlign) y = alignObjY(y, objInfo.imgH)
        addCollisionBox({
            obj: currentBlock,
            imgX: gridX,
            imgY: y,
            orig_imgX: gridX - levelStartOffset
        })
    } else if (btn == 1) {
        let index = getCollisionBox(gridX, gridY)
        if (index != undefined) collisionBoxes.splice(index, 1)
    } else if (btn == 2) {
        let objInfo = addCollisionBox({obj: currentBlock}, true)
        let y = gridY
        if (!objInfo.noAlign) y = alignObjY(y, objInfo.imgH, true)
        addCollisionBox({
            obj: currentBlock,
            imgX: gridX,
            imgY: y,
            rot: 180,
            orig_imgX: gridX - levelStartOffset
        })
    }
}
function wheel () {
    currentBlock = editorIconNames[editorIconIndex]
}
function calculateEditorOffset () {
    let offsetBoxX = collisionBoxes[1]
    editorGridX = ((offsetBoxX.imgX - (offsetBoxX.imgW / 2)) % editorGridSize) + ((offsetBoxX.imgW - editorGridSize) / 2)
    editorGridY = (innerHeight - 128) % editorGridSize
}
function calculateStartOffset () {
    levelStartOffset = collisionBoxes[1].hitX + editorGridSize
}

function togglePause () {
    pauseEnabled = !pauseEnabled
    if (pauseEnabled) {
        if (editorEnabled) toggleEditor()
        gameStatus = "Pause"
        document.body.style.cursor = "default"
    } else {
        gameStatus = ""
        document.body.style.cursor = "none"
    }
}
