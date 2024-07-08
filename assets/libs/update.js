let playerSpdY = 0
let playerR = 0
let playerShipPressTime = 0
let playerShipFallTime = 0
let tickIterations = 0
let playerX
let playerY
let playerSrc
let playerImg
let lastFrameTime
let playerMode
let fps
let lastFpsStr = ""
let editorIcons = []
let levelEnding = false
let levelEnded = false
registerConsts({
    playerGrav: 0.85,
    playerGravShip: 0.35,
    playerJumpVel: 14.5,
    playerJumpVelShip: 5.5,
    playerRSpd: 4.7,
    playerYSpdCap: 25,
    playerSpdX: 7,
    playerShipPressMul: 0.05,
    playerShipFallMul: 0.04,
    playerShipPressCap: 2.8,
    playerShipRotUp: 320,
    playerShipRotDown: 400,
    playerShipRMulUp: 3.7,
    playerShipRMulDown: 3,
    padYellowJumpVel: 23
})
function tick () {
    let currentFrameTime = performance.now()
    let deltaTime = currentFrameTime - lastFrameTime
    let nextDeltaTime = (2000 / targetFps) - deltaTime
    setTimeout(tick, nextDeltaTime)
    lastFrameTime = currentFrameTime
    fps = Math.floor(1000 / deltaTime)
    if (fps > 999) fps = 999
    
    if (!levelEnded) {
        updateGraphics()
        updatePhysics()
    }
    
    tickIterations++
}
async function updateGraphics () {
    playerCanvas.clear()
    
    if (editorEnabled) {
        calculateEditorOffset()
        for (let x = editorGridX; x <= innerWidth; x += editorGridSize) playerCanvas.rect(x, innerHeight / 2, 2, innerHeight, objTypeHitCols.editor)
        for (let y = editorGridY; y <= innerHeight; y += editorGridSize) playerCanvas.rect(innerWidth / 2, y, innerWidth, 2, objTypeHitCols.editor)
    }
    if (playerImg == undefined) playerImg = await playerCanvas.img(playerX, playerY, playerSrc, playerW, playerW, playerW, playerW, playerR)
    else playerCanvas.img(playerX, playerY, playerImg, playerW, playerW, playerW, playerW, playerR)
    if (showHitboxes) playerCanvas.rect(playerX, playerY, playerW, playerW, objTypeHitCols.player, 0, 2)

    if (!pauseEnabled) {
        renderLevel()

        if (editorEnabled) {
            let objs = Object.keys(defaultObjInfo)
            let imgOffset = 0
            for (let index in objs) {
                let objName = objs[index]
                let obj = defaultObjInfo[objName]
                let boxObj = addCollisionBox({obj: objName}, true)
                if (boxObj.noEditor) imgOffset++
                else {
                    let icon = editorIcons[index]

                    let x = ((index - imgOffset) * (editorGridSize + 20)) + editorGridSize
                    let y = innerHeight - 64

                    let w = boxObj.imgW
                    let h = boxObj.imgH
                    let size = scaleImage(w, h, editorGridSize)
                    w = size.w
                    h = size.h

                    if (icon == undefined) {
                        let path = "./assets/sprites/" + obj.texture + ".png"
                        editorIcons[index] = await playerCanvas.img(x, y, path, w, h, w, h)
                    } else playerCanvas.img(x, y, icon, w, h, w, h)
                }
            }
            playerCanvas.rect((editorIconIndex * (editorGridSize + 20)) + editorGridSize, innerHeight - 64, editorGridSize + 6, editorGridSize + 6, objTypeHitCols.editor, 0, 6)
        }
    }

    if (showHitboxes) {
        for (let box of collisionBoxes) {
            let col = objTypeHitCols[box.type]
            playerCanvas.rect(box.hitX + (box.hitW / 2), box.hitY + (box.hitH / 2), box.hitW, box.hitH, col, 0, 2)
        }
    }

    playerCanvas.text(50, 20, 30, objTypeHitCols.text, gameStatus)
    let endObj = collisionBoxes[collisionBoxes.length - 2]
    if (endObj.obj == "ending") {
        let endPos = endObj.hitX - (playerW / 2)
        let endDistance = endPos - playerX

        calculateStartOffset()
        let totalDistance = -levelStartOffset + endPos

        let playerDistance = totalDistance - endDistance
        let percent = playerDistance / totalDistance * 100
        if (percent < 0) percent = 0
        if (percent > 100) percent = 100

        playerCanvas.rect((innerWidth / 2) - 40, 20, 402, 30, objTypeHitCols.outline, 0, 1.5)
        playerCanvas.rect((innerWidth / 2) - 240 + (percent * 2), 20, percent * 4, 28, objTypeHitCols.text)
        playerCanvas.text((innerWidth / 2) + 205, 17, 30, objTypeHitCols.text, (Math.floor(percent) + "%").padStart(4, "0")) // 85px wide
    }
    if (tickIterations % targetFps == targetFps / 2 || tickIterations == 0) lastFpsStr = fps.toString().padStart(3, "0") + " fps"
    if (showFps) playerCanvas.text(innerWidth - 60, 20, 30, objTypeHitCols.text, lastFpsStr)
}
function updatePhysics () {
    if (!playerCrashed && !pauseEnabled) {
        let endPos = collisionBoxes.length - 2
        if (collisionBoxes[endPos] != undefined && collisionBoxes[endPos].obj == "ending" && collisionBoxes[endPos].imgX - playerX <= defaultObjInfo.ending.special.spacing) levelEnding = true

        let isShip = playerMode == "ship"

        if (levelEnding && !editorEnabled) pressingUp = false
        if (pressingUp) {
            playerShipFallTime = 0
            playerShipPressTime += playerShipPressMul
            if (playerShipPressTime >= playerShipPressCap) playerShipPressTime = playerShipPressCap

            if (isShip) playerSpdY = -playerJumpVelShip * playerShipPressTime
            else if (playerOnGround || editorEnabled) playerSpdY = -playerJumpVel
        } else {
            playerShipPressTime = 0
            playerShipFallTime += playerShipFallMul
            if (playerShipFallTime >= playerShipPressCap) playerShipFallTime = playerShipPressCap
        }

        calculateStartOffset()
        if (editorEnabled && levelStartOffset >= 0 && pressingLeft && playerX > playerW / 2) playerX -= constDefaults.playerSpdX
        else if (levelEnding && playerX > innerWidth + (playerW / 2)) endLevel()
        else if (playerX < innerWidth / 2 || (collisionBoxes[endPos].obj == "ending" && collisionBoxes[endPos].imgX - (editorGridSize / 2) <= innerWidth - editorGridSize)) playerX += playerSpdX
        else if (playerX > innerWidth / 2) playerX = innerWidth / 2
        else {
            for (let index in collisionBoxes) {
                let box = collisionBoxes[index]
                
                let xSpd = playerSpdX * box.spd
                collisionBoxes[index].imgX -= xSpd

                if (box.repeat) {
                    let farLeft = box.imgX - (box.imgW / 2)
                    let farRight = box.imgX + (box.imgW / 2)
                    if (farLeft <= box.repeatL + 2 && playerSpdX > 0) box.imgX = eval(box.orig_imgX) - 2
                    if (farRight >= box.repeatR - 2 && playerSpdX < 0) box.imgX = eval(box.orig_imgX) + 2
                } else collisionBoxes[index].hitX -= xSpd
            }
        }

        playerY += playerSpdY
        checkCollision()

        if (playerOnGround || (shipOnCeiling && pressingUp)) {
            if (isShip || editorEnabled) playerR = 360
            else {
                playerR = Math.round(playerR / 90) * 90
                playerSpdY = 0
            }
        } else {
            if (editorEnabled) playerR = 360
            else if (isShip) {
                if (pressingUp && playerR > playerShipRotUp) playerR -= (playerShipPressTime * playerShipRMulUp)
                else if (!pressingUp && playerR < playerShipRotDown) playerR += (playerShipFallTime * playerShipRMulDown)
            } else playerR += playerRSpd

            if (editorEnabled && !pressingDown) playerSpdY = 0
            else playerSpdY += isShip ? playerGravShip : playerGrav
            if (playerSpdY >= playerYSpdCap) playerSpdY = playerYSpdCap
            if (playerSpdY <= -playerYSpdCap) playerSpdY = -playerYSpdCap
        }

        if (editorEnabled) {
            if (pressingLeft && levelStartOffset < 0) playerSpdX = -constDefaults.playerSpdX
            else if (pressingRight) playerSpdX = constDefaults.playerSpdX
            else playerSpdX = 0
        }
    }
}
function padBoostPlayer (mode) {
    playerOnGround = false
    if (mode == "yellow") playerSpdY = -padYellowJumpVel
}

function updatePlayerMode (mode) {
    if (playerMode != mode && mode != null) {
        playerMode = mode
        playerSrc = "./assets/sprites/player/" + mode + ".png"
        playerR = 360

        let img = new Image()
        img.src = playerSrc
        img.onload = function () {
            playerImg = this
        }
    }
}
