HTMLCanvasElement.prototype.init = function (width = innerWidth, height = innerHeight, left = 0, top = 0, res = 1) {
    this.style.position = "absolute"
    this.originState = [0, 0]
    this.flipState = [false, false]
    this.scaleState = [1, 1]

    this.setSize(width, height, left, top, -1)
    this.ctx = this.getContext("2d", {willReadFrequently: true})
    this.setRes(res)
}
HTMLCanvasElement.prototype.setRes = function (res = 1) {
    this.scale = res

    this.width = this.originalWidth * this.scale
    this.height = this.originalHeight * this.scale
    this.style.width = this.originalWidth + "px"
    this.style.height = this.originalHeight + "px"

    this.clear()
}
HTMLCanvasElement.prototype.getRes = function () {
    return this.scale
}
HTMLCanvasElement.prototype.setSize = function (width = innerWidth, height = innerHeight, left = this.originalLeft, top = this.originalTop, res = 1) {
    this.style.left = left + "px"
    this.style.top = top + "px"

    this.originalWidth = width
    this.originalHeight = height
    this.originalLeft = left
    this.originalTop = top

    this.style.width = width + "px"
    this.style.height = height + "px"

    if (res != -1) this.setRes(res)
}
HTMLCanvasElement.prototype.getSize = function () {
    return {
        actualWidth: this.originalWidth,
        actualHeight: this.originalHeight,
        width: this.width,
        height: this.height,
        left: this.originalLeft,
        top: this.originalTop,
        origin: this.originState,
        flip: this.flipState,
        scale: this.scaleState
    }
}

HTMLCanvasElement.prototype.setOrigin = function (x, y) {
    this.ctx.translate(...this.originState.map(n => 0 - n))
    this.ctx.translate(x, y)

    this.originState = [x, y]
}
HTMLCanvasElement.prototype.setFlip = function (x, y) {
    if (this.flipState[0]) this.ctx.scale(-1, 1)
    if (this.flipState[1]) this.ctx.scale(1, -1)
    
    if (x) this.ctx.scale(-1, 1)
    if (y) this.ctx.scale(1, -1)

    this.flipState = [x, y]
}
HTMLCanvasElement.prototype.setScale = function (x, y) {
    this.ctx.scale(...this.scaleState.map(n => 1 / n))
    this.ctx.scale(x, y)

    this.scaleState = [x, y]
}

HTMLCanvasElement.prototype.clear = function (c = "transparent") {
    let posX = -this.originState[0]
    let posY = -this.originState[1]
    if (c == "transparent") this.ctx.clearRect(posX, posY, this.width, this.height)
    else if (c == "png") {
        let whiteSquare = true
        for (let y = 0; y < this.width; y += 5) {
            for (let x = 0; x < this.height; x += 5) {
                this.rect(posX + x, posY + y, 5, 5, whiteSquare ? "white" : "lightgray")

                whiteSquare = !whiteSquare
            }
            if (Math.ceil(this.width / 5) % 2 == 0) whiteSquare = !whiteSquare
        }
    } else this.rect(posX + this.width / 2, posY + this.height / 2, this.width, this.height, c)
}
HTMLCanvasElement.prototype.circ = function (x, y, w, c, deg = 360, startDeg = 0, lineWidth = -1) {
    this.ctx.fillStyle = this.ctx.strokeStyle = c
    this.ctx.lineWidth = lineWidth
    let scaled = [x, y, (w / 2)].map(n => n * this.scale)

    this.ctx.beginPath()
    this.ctx.arc(...scaled, degToRad(startDeg - 90), degToRad((deg + startDeg) - 90))
    if (deg != 360) {
        this.ctx.lineTo(...scaled)
    }
    if (lineWidth == -1) this.ctx.fill()
    else this.ctx.stroke()
}
HTMLCanvasElement.prototype.line = function (sX, sY, eX, eY, c, h = 1) {
    this.ctx.fillStyle = this.ctx.strokeStyle = c
    this.ctx.lineWidth = h
    let sScaled = [sX, sY].map(n => n * this.scale)
    let eScaled = [eX, eY].map(n => n * this.scale)

    this.ctx.beginPath()
    this.ctx.moveTo(...sScaled)
    this.ctx.lineTo(...eScaled)
    this.ctx.stroke()
}
HTMLCanvasElement.prototype.point = function (x, y, c) {
    this.ctx.fillStyle = this.ctx.strokeStyle = c
    this.ctx.fillRect(x, y, 1, 1)
}
HTMLCanvasElement.prototype.rect = function (x, y, w, h, c, rot = 0, lineWidth = -1) {
    this.ctx.fillStyle = this.ctx.strokeStyle = c
    this.ctx.lineWidth = lineWidth
    x *= this.scale
    y *= this.scale
    w *= this.scale
    h *= this.scale

    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.translate(x, y)
    this.ctx.rotate(degToRad(rot))
    this.ctx.rect(-w / 2, -h / 2, w, h)
    if (lineWidth == -1) this.ctx.fill()
    else this.ctx.stroke()
    this.ctx.restore()
}
HTMLCanvasElement.prototype.poly = function (c, lineWidth = -1, ...pairs) {
    this.ctx.fillStyle = this.ctx.strokeStyle = c
    this.ctx.lineWidth = lineWidth

    this.ctx.beginPath()
    for (let pair of pairs) this.ctx.lineTo(...pair.map(n => n * this.scale))
    if (lineWidth == -1) this.ctx.fill()
    else {
        this.ctx.closePath()
        this.ctx.stroke()
    }
}
HTMLCanvasElement.prototype.text = function (x, y, s, c, text, rot = 0, lineWidth = -1, font = "Arial") {
    this.ctx.fillStyle = this.ctx.strokeStyle = c
    this.ctx.lineWidth = lineWidth
    x *= this.scale
    y *= this.scale
    s *= this.scale
    this.ctx.font = s + "px " + font
    this.ctx.save()
    this.ctx.translate(x, y)
    this.ctx.rotate(degToRad(rot))
    
    let metrics = this.ctx.measureText(text)
    let width = metrics.width
    let height = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent

    let args = [
        text,
        -width / 2,
        s - (height / 2)
    ]
    if (lineWidth == -1) this.ctx.fillText(...args)
    else this.ctx.strokeText(...args)
    this.ctx.restore()
}
HTMLCanvasElement.prototype.img = async function (x, y, src, w = -1, h = -1, imgWidth = -1, imgHeight = -1, rot = 0, repeatOffset = 0) {
    function drawImg () {
        x *= this.scale
        y *= this.scale
        
        this.ctx.save()
        this.ctx.translate(x, y)
        this.ctx.rotate(degToRad(rot))

        let imgW = this.img.width * this.scale
        let imgH = this.img.height * this.scale

        if (w == -1) w = imgW
        if (h == -1) h = imgH

        if (imgWidth == -1) imgWidth = imgW
        if (imgHeight == -1) imgHeight = imgW

        let repeatW = w - imgWidth
        let repeatH = h - imgHeight
        if (repeatW < 0) repeatW = 0
        if (repeatH < 0) repeatH = 0

        for (let dX = 0; dX <= repeatW; dX += imgWidth - repeatOffset) {
            for (let dY = 0; dY <= repeatH; dY += imgHeight - repeatOffset) {
                let aX = dX - (w / 2)
                let aY = dY - (h / 2)
                this.ctx.drawImage(this.img, aX, aY, imgWidth, imgHeight)
            }
        }

        this.ctx.restore()
    }

    if (src instanceof Image) drawImg.call({
        ctx: this.ctx,
        img: src,
        scale: this.scale
    })
    else {
        let img = new Image()
        img.src = src
        return new Promise(function (resolve) {
            img.onload = function () {
                drawImg.call(this)
                resolve(this.img)
            }.bind({
                ctx: this.ctx,
                img,
                scale: this.scale
            })
        }.bind({
            ctx: this.ctx,
            scale: this.scale
        }))
    }
}

HTMLCanvasElement.prototype.getData = function (x, y, w, h) {
    x *= this.scale
    y *= this.scale
    x -= (w / 2)
    y -= (h / 2)

    let rawData = this.ctx.getImageData(x, y, w, h).data
    let data = []
    for (let i = 0; i < rawData.length; i += 4) {
        let r = rawData[i]
        let g = rawData[i + 1]
        let b = rawData[i + 2]
        let a = rawData[i + 3] / 255

        data.push({r, g, b, a})
    }

    return {
        data,
        width: w,
        height: h
    }
}
HTMLCanvasElement.prototype.putData = function (x, y, dataObj, rot = 0) {
    let data = dataObj.data
    let w = dataObj.width
    let h = dataObj.height
    x *= this.scale
    y *= this.scale
    this.ctx.save()
    this.ctx.translate(x, y)
    this.ctx.rotate(degToRad(rot))
    this.ctx.translate(-w / 2, -h / 2)

    for (let index in data) {
        let pixel = data[index]
        let pX = index % w
        let pY = Math.floor(index / w)

        this.rect(pX + 0.5, pY + 0.5, 1, 1, "rgba(" + pixel.r + "," + pixel.g + "," + pixel.b + "," + pixel.a + ")")
    }
    
    this.ctx.restore()
}
HTMLCanvasElement.prototype.applyFilter = function (x, y, w, h, filter) {
    let data = this.getData(x, y, w, h).data
    for (let index in data) {
        let dataObj = data[index]
        let newDataObj = filter(dataObj.r, dataObj.g, dataObj.b, dataObj.a)
        data[index] = newDataObj
    }
    this.putData(x, y, {
        data,
        width: w,
        height: h
    })
}
HTMLCanvasElement.prototype.getDataURL = function () {
    return this.toDataURL()
}

function degToRad (deg) {
    return deg * (Math.PI / 180)
}
