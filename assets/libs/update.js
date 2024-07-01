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
let editorIcons = []
let levelEnding = false
registerConsts({
    playerGrav: 0.8,
    playerGravShip: 0.4,
    playerJumpVel: 15,
    playerJumpVelShip: 4.5,
    playerRSpd: 4.7,
    playerYSpdCap: 25,
    playerSpdX: 7,
    playerShipPressMul: 0.05,
    playerShipPressCap: 3
})
function tick () {
    let currentFrameTime = performance.now()
    let deltaTime = currentFrameTime - lastFrameTime
    let nextDeltaTime = (2000 / targetFps) - deltaTime
    setTimeout(tick, nextDeltaTime)
    lastFrameTime = currentFrameTime
    fps = Math.floor(1000 / deltaTime)
    if (fps > 999) fps = 999
    
    updateGraphics()
    updatePhysics()
    
    tickIterations++
}
async function updateGraphics () {
    statusEl.innerText = gameStatus
    if (tickIterations % targetFps == targetFps / 2) fpsEl.innerText = fps.toString().padStart(3, "0") + " fps"
    
    playerCanvas.clear()
    if (editorEnabled) {
        calculateEditorOffset()
        for (let x = editorGridX; x <= innerWidth; x += editorGridSize) playerCanvas.rect(x, innerHeight / 2, 2, innerHeight, objTypeHitCols.editor)
        for (let y = editorGridY; y <= innerHeight; y += editorGridSize) playerCanvas.rect(innerWidth / 2, y, innerWidth, 2, objTypeHitCols.editor)
    }
    if (playerImg == undefined) playerImg = await playerCanvas.img(playerX, playerY, playerSrc, playerW, playerW, playerW, playerW, playerR)
    else playerCanvas.img(playerX, playerY, playerImg, playerW, playerW, playerW, playerW, playerR)
    if (showHitboxes) playerCanvas.rect(playerX, playerY, playerW, playerW, objTypeHitCols.player, playerR, 2)

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
}
function updatePhysics () {
    if (!playerCrashed && !pauseEnabled) {
        let isShip = playerMode == "ship"

        if (pressingUp) {
            playerShipFallTime = 0
            playerShipPressTime += playerShipPressMul
            if (playerShipPressTime >= playerShipPressCap) playerShipPressTime = playerShipPressCap

            if (isShip) playerSpdY = -playerJumpVelShip * playerShipPressTime
            else if (playerOnGround || editorEnabled) playerSpdY = -playerJumpVel
        } else {
            playerShipPressTime = 0
            playerShipFallTime += playerShipPressMul
            if (playerShipFallTime >= playerShipPressCap) playerShipFallTime = playerShipPressCap
        }

        if (levelEnding && playerX > innerWidth + (playerW / 2)) endLevel()
        if (playerX < innerWidth / 2 || levelEnding) playerX += playerSpdX
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

        if (playerOnGround) {
            if (isShip || editorEnabled) playerR = 0
            else {
                playerR = Math.round(playerR / 90) * 90
                playerSpdY = 0
            }
        } else {
            if (editorEnabled) playerR = 0
            else if (isShip) {
                if (pressingUp) playerR = 360 - (playerShipPressTime * 20)
                else playerR = -360 + (playerShipFallTime * 20)
            } else playerR += playerRSpd

            if (editorEnabled && !pressingDown) playerSpdY = 0
            else playerSpdY += isShip ? playerGravShip : playerGrav
            if (playerSpdY >= playerYSpdCap) playerSpdY = playerYSpdCap
            if (playerSpdY <= -playerYSpdCap) playerSpdY = -playerYSpdCap
        }

        if (editorEnabled) {
            if (pressingLeft) playerSpdX = -constDefaults.playerSpdX
            else if (pressingRight) playerSpdX = constDefaults.playerSpdX
            else playerSpdX = 0
        }
    }
}

function updatePlayerMode (mode) {
    if (playerMode != mode && mode != null) {
        playerMode = mode
        playerSrc = "./assets/sprites/player/" + mode + ".png"

        let img = new Image()
        img.src = playerSrc
        img.onload = function () {
            playerImg = this
        }
    }
}
