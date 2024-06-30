let playerOnGround = true
let playerCrashed = false
let playerCoins = 0
let collisionBoxes = []
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
                    playerCoins++
                    collisionBoxes.splice(index, 1)
                }
                if (bT == "portal" && colliding) updatePlayerMode(bS.mode)

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
                    playerOnGround = colliding
                    if (playerOnGround) playerY = bY - (playerW / 2)
                }
                if (bT == "spike" && colliding) respawnPlayer()
                if (bT == "coin" && colliding && !editorEnabled) {
                    playerCoins++
                    collisionBoxes.splice(index, 1)
                }
                if (bT == "portal" && colliding) updatePlayerMode(bS.mode)

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
        for (let y = 0; y < playerW; y++) {
            let cY = y + playerY - (playerW / 2)

            for (let index in collisionBoxes) {
                let box = collisionBoxes[index]
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
                    playerCoins++
                    collisionBoxes.splice(index, 1)
                }
                if (bT == "portal" && colliding) updatePlayerMode(bS.mode)

                if (colliding && (bT == "ground" || bT == "spike")) break
            }

            if (colliding) break
        }
    }
}

function respawnPlayer () {
    if (!editorEnabled) {
        playerCrashed = playerOnGround = true
        setTimeout(function () {
            updatePlayerMode("cube")
            loadLevel()

            playerX = 0
            playerY = innerHeight - (playerW / 2) - 128
            playerR = 0

            playerCrashed = false
        }, 700)
    }
}
