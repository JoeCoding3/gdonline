let playerOnGround = true
let shipOnCeiling = false
let playerCrashed = false
let playerCoins = 0
let collisionBoxes = []
registerConsts({
    collisionWallOffset: 2
})
function checkCollision () {
    checkHeadCollision()
    checkGroundCollision()
    checkWallCollision()
}
function checkHeadCollision () {
    if (!playerCrashed && !editorEnabled) {
        let colliding
        let cY = playerY - (playerW / 2)
        for (let x = 0; x < playerW; x++) {
            let cX = x + playerX - (playerW / 2)

            for (let index in collisionBoxes) {
                let box = collisionBoxes[index]
                if (box.noRender) continue

                let bX = box.hitX
                let bY = box.hitY
                let bW = box.hitW
                let bH = box.hitH
                let bT = box.type
                let bS = box.special

                let x1 = cX >= bX
                let x2 = cX <= bX + bW
                let y1 = cY >= bY
                let y2 = cY <= bY + bH

                colliding = x1 && x2 && y1 && y2
                
                if (bT == "deco") continue
                if (bT == "ground" || bT == "spike") {
                    if (playerMode == "ship") {
                        if (playerGrav >= 0) {
                            shipOnCeiling = colliding
                            if (colliding) playerY = bY + bH + (playerW / 2) + 1
                        } else {
                            playerOnGround = colliding
                            if (colliding) playerY = bY + bH + (playerW / 2)
                        }
                    } else {
                        if (playerGrav < 0) playerOnGround = colliding
                        if (colliding) {
                            if (playerGrav < 0) playerY = bY + bH + (playerW / 2)
                            else respawnPlayer()
                        }
                    }
                }
                if (bT == "spike" && colliding) respawnPlayer()
                if (bT == "coin" && colliding && !editorEnabled) {
                    collisionBoxes[index].noRender = true
                    playerCoins++
                }
                if (bT == "portal" && colliding) updatePlayerMode(bS.mode)
                if (bT == "pad" && colliding && !box.activated) {
                    collisionBoxes[index].activated = true
                    padBoostPlayer(bS.mode)
                }
                if (bT == "orb" && colliding && pressingUp && !box.activated) {
                    collisionBoxes[index].activated = true
                    orbBoostPlayer(bS.mode)
                }

                if (colliding && (bT == "ground" || bT == "spike")) break
            }

            if (colliding) break
        }
    }
}
function checkGroundCollision () {
    if (!playerCrashed && !editorEnabled) {
        let colliding
        let cY = playerY + (playerW / 2)
        for (let x = 0; x < playerW; x++) {
            let cX = x + playerX - (playerW / 2)

            for (let index in collisionBoxes) {
                let box = collisionBoxes[index]
                if (box.noRender) continue
                
                let bX = box.hitX
                let bY = box.hitY
                let bW = box.hitW
                let bH = box.hitH
                let bT = box.type
                let bS = box.special

                let x1 = cX >= bX
                let x2 = cX <= bX + bW
                let y1 = cY >= bY
                let y2 = cY <= bY + bH

                colliding = x1 && x2 && y1 && y2
                
                if (bT == "deco") continue
                if (bT == "ground" || bT == "spike") {
                    if (playerMode == "ship") {
                        if (playerGrav < 0) {
                            shipOnCeiling = colliding
                            if (colliding) playerY = bY - (playerW / 2) - 1
                        } else {
                            playerOnGround = colliding
                            if (colliding) playerY = bY - (playerW / 2)
                        }
                    } else {
                        if (playerGrav >= 0) playerOnGround = colliding
                        if (colliding) {
                            if (playerGrav >= 0) playerY = bY - (playerW / 2)
                            else respawnPlayer()
                        }
                    }
                }
                if (bT == "spike" && colliding) respawnPlayer()
                if (bT == "coin" && colliding && !editorEnabled) {
                    collisionBoxes[index].noRender = true
                    playerCoins++
                }
                if (bT == "portal" && colliding) updatePlayerMode(bS.mode)
                    if (bT == "pad" && colliding && !box.activated) {
                        collisionBoxes[index].activated = true
                        padBoostPlayer(bS.mode)
                    }
                    if (bT == "orb" && colliding && pressingUp && !box.activated) {
                        collisionBoxes[index].activated = true
                        orbBoostPlayer(bS.mode)
                    }

                if (colliding && (bT == "ground" || bT == "spike")) break
            }

            if (colliding) break
        }
    }
}
function checkWallCollision () {
    if (!playerCrashed && !editorEnabled) {
        let colliding
        let cX = playerX + (playerW / 2)
        for (let y = 0; y < playerW - (collisionWallOffset * 2); y++) {
            let cY = y + playerY - (playerW / 2) + collisionWallOffset

            for (let index in collisionBoxes) {
                let box = collisionBoxes[index]
                if (box.noRender) continue
                
                let bX = box.hitX
                let bY = box.hitY
                let bW = box.hitW
                let bH = box.hitH
                let bT = box.type
                let bS = box.special

                let x1 = cX >= bX
                let x2 = cX <= bX + bW
                let y1 = cY >= bY
                let y2 = cY <= bY + bH

                colliding = x1 && x2 && y1 && y2

                if (bT == "deco") continue
                if ((bT == "ground" || bT == "spike") && colliding) respawnPlayer()
                if (bT == "coin" && colliding && !editorEnabled) {
                    collisionBoxes[index].noRender = true
                    playerCoins++
                }
                if (bT == "portal" && colliding) updatePlayerMode(bS.mode)
                    if (bT == "pad" && colliding && !box.activated) {
                        collisionBoxes[index].activated = true
                        padBoostPlayer(bS.mode)
                    }
                    if (bT == "orb" && colliding && pressingUp && !box.activated) {
                        collisionBoxes[index].activated = true
                        orbBoostPlayer(bS.mode)
                    }

                if (colliding && (bT == "ground" || bT == "spike")) break
            }

            if (colliding) break
        }
    }
}

function respawnPlayer () {
    if (!editorEnabled) {
        playerCrashed = playerOnGround = true
        shipOnCeiling = false
        setTimeout(function () {
            resetPlayer()

            playerCrashed = false
        }, 700)
    }
}
async function resetPlayer (noScript, noLoad) {
    if (!exportLevelSaved && !noLoad) await exportLevel(exportLevelName, true)
    if (!noLoad) loadLevel(noScript)
        
    updatePlayerMode("cube")

    playerX = 0
    playerY = innerHeight - (playerW / 2) - 128
    playerR = 0
    playerGrav = Math.abs(playerGrav)

    calculateStartOffset()
    for (let obj of collisionBoxes) {
        if (obj.obj == "coin") obj.noRender = false
        if (!obj.repeat) {
            obj.imgX -= levelStartOffset
            obj.hitX -= levelStartOffset
        }
    }
    playerCoins = 0
    
    levelEnded = false
    levelEnding = false
}
