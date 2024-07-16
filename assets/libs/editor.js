let editorEnabled = false
let pauseEnabled = false
let gameStatus = "Play"
let currentBlock = "block"
let editorIconIndex = 0
let editorIconMax = 0
let editorGridX = 0
let editorGridY = 0
let editorIconNames = []
let levelStartOffset = 0
let currentCoins = 0
let levelLength = "T"
registerConsts({
    editorGridSize: 60,
    maxCoins: 3
})
async function toggleEditor () {
    if (editorEnabled && !exportLevelSaved) await exportLevel(exportLevelName, exportLevelDesc, true)
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
        gameStatus = "Play"
        document.body.style.cursor = "none"
        
        calculateStartOffset()
        let distance = addEndObj() - (editorGridSize / 2) - playerW
        calculateLevelLength(distance)
    }
}
function click (btn, x, y, rot90) {
    exportLevelSaved = false
    calculateStartOffset()
    
    let gridX = snapToGrid(x, editorGridSize, editorGridX)
    let gridY = snapToGrid(y, editorGridSize, editorGridY)
    if (btn == 0) {
        if (currentBlock != "coin" || currentCoins < maxCoins) {
            if (currentBlock == "coin") currentCoins++

            let objInfo = addCollisionBox({obj: currentBlock}, true)
            let y = gridY
            if (!objInfo.noAlign) y = alignObjY(y, objInfo.imgH)
            addCollisionBox({
                obj: currentBlock,
                imgX: gridX,
                imgY: y,
                rot: rot90 ? 270 : 0,
                orig_rot: rot90 ? 270 : 0,
                orig_imgX: gridX - levelStartOffset
            })
        }
    } else if (btn == 1) {
        let index = getCollisionBox(gridX, gridY)
        if (index != undefined) {
            if (collisionBoxes[index].obj == "coin") currentCoins--
            collisionBoxes.splice(index, 1)
        }
    } else if (btn == 2) {
        if (currentBlock != "coin" || currentCoins < maxCoins) {
            if (currentBlock == "coin") currentCoins++

            let objInfo = addCollisionBox({obj: currentBlock}, true)
            let y = gridY
            if (!objInfo.noAlign) y = alignObjY(y, objInfo.imgH, true)
            addCollisionBox({
                obj: currentBlock,
                imgX: gridX,
                imgY: y,
                rot: rot90 ? 90 : 180,
                orig_rot: rot90 ? 90 : 180,
                orig_imgX: gridX - levelStartOffset
            })
        }
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
function calculateLevelLength (distance) {
    let pixelsPerSecond = targetFps * playerSpdX
    let mulDist = distance / pixelsPerSecond
    if (mulDist <= 10) levelLength = "T"
    else if (mulDist <= 30) levelLength = "S"
    else if (mulDist <= 60) levelLength = "M"
    else if (mulDist <= 120) levelLength = "L"
    else levelLength = "X"
}

function togglePause () {
    pauseEnabled = !pauseEnabled
    if (pauseEnabled) {
        if (editorEnabled) toggleEditor()
        gameStatus = "Pause"
        document.body.style.cursor = "default"
    } else {
        gameStatus = "Play"
        document.body.style.cursor = "none"
    }
}
