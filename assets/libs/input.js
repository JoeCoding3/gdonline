let pressingUp = false
let pressingDown = false
let pressingLeft = false
let pressingRight = false
let pressingShift = false
onkeydown = function (ev) {
    if (ev.repeat) return
    let key = ev.key.toLowerCase()

    if (key == (editorEnabled ? "w" : " ") && (editorEnabled || !levelEnding)) pressingUp = true
    else if (key == "s") pressingDown = true
    else if (key == "a") pressingLeft = true
    else if (key == "d") pressingRight = true
    else if (key == "p" && !levelEnded) togglePause()
    else if (key == "e" && !levelEnded) toggleEditor()
    else if (key == "r" && !levelEnded) toggleEditor(true)
    else if (key == "o") startLevelExport(levelEnding, pressingShift)
    else if (key == "i") startLevelImport(levelEnding)
    else if (key == "shift") pressingShift = true
}
onkeyup = function (ev) {
    let key = ev.key.toLowerCase()

    if (key == "w" || key == " ") pressingUp = false
    else if (key == "s") pressingDown = false
    else if (key == "a") pressingLeft = false
    else if (key == "d") pressingRight = false
    else if (key == "shift") pressingShift = false
}

onmousedown = function (ev) {
    if (editorEnabled) {
        let x = ev.clientX
        let y = ev.clientY
        let btn = ev.button
        click(btn, x, y)
    }
}
oncontextmenu = ev => ev.preventDefault()
onwheel = function (ev) {
    if (editorEnabled) {
        let delta = ev.deltaY
        if (delta < 0) editorIconIndex--
        else editorIconIndex++

        if (editorIconIndex < 0) editorIconIndex = 0
        if (editorIconIndex > editorIconMax) editorIconIndex = editorIconMax
        
        wheel()
    }
}
