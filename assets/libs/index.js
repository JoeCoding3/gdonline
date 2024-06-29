onload = function () {
    let loader = document.createElement("script")
    loader.src = "./assets/libs/loader.js"
    document.head.append(loader)
    loader.onload = async function () {
        await loadAssets()
        registerConsts({
            playerW: 60
        })
        assignConsts()
    
        updatePlayerMode("cube")
    
        canvas.init()
        playerCanvas.init(innerWidth, innerHeight, 0, 0)
    
        resize()
        playerX = -playerW / 2
        playerY = innerHeight - (playerW / 2) - 128
    
        lastFrameTime = performance.now() - (1000 / targetFps)
        tick()
    }
}

function resize (ev) {
    canvas.setSize(innerWidth, innerHeight)
    playerCanvas.setSize(innerWidth, innerHeight)

    loadLevel()
    if (ev != undefined) updateGraphics()
}
onresize = resize
