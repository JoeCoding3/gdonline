let levelTable = []
let levelSongID
let levelOfficialSong
let levelCustomSong
let levelDescription
async function importSave (handle) {
    let file = await handle.file()
    if (file.size / 1024 / 1024 >= 100) return
    let buffer = await handle.read("buffer")
    
    let decoded = decodeSave(buffer, 11)
    if (decoded == undefined) return
    decoded = decoded.replace(/&(?!amp;)/g, "&amp;").replace(/<k>GLM_09<\/k><d>(.|\n)+?<\/d>/g, "").replace(/[^\x00-\x7F]/g, "?").replace(/[\0-\37]/g, "")

    let parser = new DOMParser()
    let saveData = parser.parseFromString(decoded, "text/xml")
    if (!saveData || !saveData.children || !saveData.children.length) return
    saveData = saveData.children[0].children[0]
    
    if (saveData.children[0].innerHTML.startsWith("LLM")) return levelAnalysis(saveData)
    else return
}
function decodeSave (dataArr, xorKey) {
    let utf8Decoder = new TextDecoder("utf-8")
    let data = typeof dataArr == "string" ? dataArr : utf8Decoder.decode(dataArr)
    if (data.startsWith('<?xml version="1.0"?>')) return data
    let decodeStr = xorKey ? xor(data, xorKey) : data
    decodeStr = urlB64(decodeStr, true)
    decodeStr = new Uint8Array(decodeStr.split("").map(x => x.charCodeAt(0)))
    return pako.inflate(decodeStr, {to: "string"})
}
function xor (str, key) {     
    str = String(str).split("").map(letter => letter.charCodeAt())
    let res = ""
    for (let i = 0; i < str.length; i++) res += String.fromCodePoint(str[i] ^ key)
    return res
}
function urlB64 (str) {
    return atob(str.replace(/_/g, "/").replace(/-/g, "+").replace(/[^A-Za-z0-9\+\/]/g, ""))
}
function levelAnalysis (levelSave) {
    let levelXML = levelSave.children[1]
    let levelData = parseXML(levelXML)
    levelData = arrLabelObject(levelData, levelKeys, true).filter(x => x.name)

    levelTable = levelData.sort((a, b) => +a["_key"].slice(2) - +b["_key"].slice(2))
}
function parseXML (data) {
    let raw = {}
    let res = {}

    for (let i = 0; i < data.children.length; i += 2) {
        let keyName = data.children[i].innerHTML
        if (saveKeys[keyName]) keyName = saveKeys[keyName]
        if (keyName == "[unused]") continue
        let valueTag = data.children[i + 1]
        if (valueTag.tagName.charAt(0) != "d") {
            let value = parseValue(valueTag)
            res[keyName] = value
        } else raw[keyName] = valueTag
    }

    for (let x of Object.keys(raw).sort()) res[x] = parseDict(raw[x])
    return res
}
function parseValue (tag) {
    let v = tag.innerHTML
    switch (tag.tagName.charAt(0)) {
        case "r": return parseFloat(v)
        case "i": return parseInt(v)
        case "s": return v
        case "t": return true
        case "f": return false
    }
}
function parseDict (dict) {
    if (!dict || !dict.children || !dict.children.length) return
    let dictObj = {}
    for (let i = 0; i < dict.children.length; i += 2) {
        let keyName = dict.children[i].innerHTML
        let keyValue = dict.children[i + 1]
        if (keyValue && keyValue.children.length) dictObj[keyName] = parseDict(keyValue)
        else if (keyValue) dictObj[keyName] = parseValue(keyValue)
    }
    return dictObj
}
function arrLabelObject (data = {}, keys, includeKey) {
    let newArr = []
    for (let x of Object.keys(data)) {
        let labelled = labelObject(data[x], keys, includeKey ? x : null)
        newArr.push(labelled)
    }
    return newArr
}
function labelObject (data = {}, keys, keyName) {
    let newObj = {}
    if (keyName) newObj["_key"] = keyName
    for (let x of Object.keys(data)) {
        if (x == "kCEK") continue
        else if (typeof keys[x] == "object") {
            let keyStuff = keys[x]
            let keyName = keys[x].name
            if (keyStuff.bump) newObj[keyName] = keyStuff.bump[+data[x] - 1]
            else if (keyStuff.arr) newObj[keyName] = keyStuff.arr[+data[x]]
            else if (keyStuff.b64 && data[x].length >= 4) newObj[keyName] = urlB64(data[x])
        } else newObj[keys[x] || x] = data[x]
    }
    return newObj
}
function getNames () {
    let names = []
    for (let index in levelTable) names.push(index + ": " + levelTable[index].name)
    return names
}
function getLevel (levelKey) {
    let foundLevel = levelTable[levelKey]
    getSongID(foundLevel)
    getDescription(foundLevel)
    let dataStr = decodeSave(foundLevel.levelData)
    return dataStr
}
function getSongID (level) {
    levelOfficialSong = level.officialSongID != undefined
    levelCustomSong = level.customSongID != undefined
    levelSongID = (level.officialSongID + 1) || level.customSongID || 1
}
function getDescription (level) {
    levelDescription = level.description
}
