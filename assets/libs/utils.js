function degToRad (deg) {
    return deg * (Math.PI / 180)
}

function snapToGrid (val, unit, offset = 0) {
    let offsetVal = val - offset
    let div = Math.floor(offsetVal / unit)
    return (div * unit) + (unit / 2) + offset
}
function scaleImage (w, h, max) {
    let scaleX = 1
    let scaleY = 1
    let scale

    if (w > max) scaleX = max / w
    if (h > max) scaleY = max / h
    if (scaleX < scaleY) scale = scaleX
    else scale = scaleY
    
    return {
        w: w * scale,
        h: h * scale
    }
}
function alignObjY (origY, imgH, flip) {
    let change = ((editorGridSize - imgH) / 2)
    return flip ? origY - change : origY + change
}

async function downloadFile (data, name, extension, start) {
    let handle = await fileutil.file.download.handle(name, extension, start)
    await writeFile(data, handle)

    return handle
}
async function writeFile (data, handle) {
    await handle.write(data)
}
