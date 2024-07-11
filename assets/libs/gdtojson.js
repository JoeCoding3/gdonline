function gdToJsonConvertKS38 (kS38) {
	let splitKS38 = kS38.split("|").filter(x => x != "")
	let array = []
	
	for (let value of splitKS38) {
		let valueSplit = value.split("_")
		let colorObj = {}

		for (let i = 0; i < valueSplit.length; i += 2) {
			let property = valueSplit[i]
			let theValue = valueSplit[i + 1]

			if (gdToJsonColorProps.values[valueSplit[i]]) {
				property = gdToJsonColorProps.values[valueSplit[i]][0]

				switch (gdToJsonColorProps.values[valueSplit[i]][1]) {
					case "list":
						theValue = gdToJsonColorProps[property + "s"][theValue]
						break
					case "channel":
						theValue = gdToJsonColorProps.channels[theValue] ? gdToJsonColorProps.channels[theValue] : Number(theValue)
						break
					case "number":
						theValue = Number(theValue)
						break
					case "bool":
						theValue = theValue != "0"
						break
					case "hsv":
						let hsv = theValue.split("a")
						hsv = {
							hue: Number(hsv[0]),
							saturation: Number(hsv[1]),
							brightness: Number(hsv[2]),
							saturationMode: Number(hsv[3]) == 1 ? "Additive" : "Multiplicative",
							brightnessMode: Number(hsv[4]) == 1 ? "Additive" : "Multiplicative"
						}
						theValue = hsv
						break
				}

				colorObj[property] = theValue
			}
		}

		array.push(colorObj)
	}

	return array
}
function gdToJsonParseObj (obj, nameArr) {
	let splitObj = obj.split(",")
	let parsedObj = {}

	for (let i = 0; i < splitObj.length; i += 2) {
		let property = splitObj[i]
		let value = splitObj[i + 1]

		if (nameArr.values[splitObj[i]]) {
			property = nameArr.values[splitObj[i]][0]
			
			switch (nameArr.values[splitObj[i]][1]) {
				case "list":
					value = nameArr[property + "s"][value]
					break
				case "number":
					value = Number(value)
					break
				case "channel":
					value = nameArr.channels[value] ? nameArr.channels[value] : Number(value)
					break
				case "font":
					value = Number(value) + 1
					break
				case "bool":
					value = value != "0"
					break
				case "string":
					value = atob(value)
					break
				case "array":
					value = value.split(".").map(x => Number(x))
					break
				case "hsv":
					let hsv = value.split("a")
					hsv = {
						hue: Number(hsv[0]),
						saturation: Number(hsv[1]),
						brightness: Number(hsv[2]),
						saturationMode: Number(hsv[3]) == 1 ? "Additive" : "Multiplicative",
						brightnessMode: Number(hsv[4]) == 1 ? "Additive" : "Multiplicative"
					}
					value = hsv
					break
				case "extra-legacy-color":
					let colorInfo = property.split("-")

					if (colorInfo[2] == "blend") value = value != "0"
					else if (colorInfo[2] == "pcol") value = gdToJsonColorProps.pColors[value]
					else value = Number(value)
					break
				case "legacy-color":
					let colorObj = value.split("_")
					let newColorObj = {}

					for (let j = 0; j < colorObj.length; j += 2) {
						let theProperty = colorObj[j]
						let theValue = colorObj[j + 1]

						if (gdToJsonColorProps.values[colorObj[j]]) {
							theProperty = gdToJsonColorProps.values[colorObj[j]][0]

							switch (gdToJsonColorProps.values[colorObj[j]][1]) {
								case "list":
									theValue = gdToJsonColorProps[theProperty + "s"][theValue]
									break
								case "channel":
									theValue = gdToJsonColorProps.channels[theValue] ? gdToJsonColorProps.channels[theValue] : Number(theValue)
									break
								case "number":
									theValue = Number(theValue)
									break
								case "bool":
									theValue = theValue != "0"
									break
								case "hsv":
									let hsv = theValue.split("a")
									hsv = {
										hue: Number(hsv[0]),
										saturation: Number(hsv[1]),
										brightness: Number(hsv[2]),
										saturationMode: Number(hsv[3]) == 1 ? "Additive" : "Multiplicative",
										brightnessMode: Number(hsv[4]) == 1 ? "Additive" : "Multiplicative"
									}
									theValue = hsv
									break
							}

							newColorObj[theProperty] = theValue
						}
					}

					value = newColorObj
					break
				case "colors":
					value = gdToJsonConvertKS38(value)
					break
			}

			parsedObj[property] = value
		}
	}

	return parsedObj
}

function gdToJson (data) {
	let array = data.split(";").slice(1).filter(x => x != "")
	let objects = []
	for (let object of array) objects.push(gdToJsonParseObj(object, gdToJsonProps))
	
	return objects
}
async function importFromReal (bypassEditor, forceSelect) {
	if (editorEnabled || bypassEditor) {
        if (levelTable == "" || forceSelect) {
			let handle = await fileutil.file.storage.get("gdonline_save")
			if (handle == undefined || forceSelect) {
				[handle] = await fileutil.file.get("dat")
				await handle.store("gdonline_save")
			}
            await importSave(handle)
        }
		let index = prompt(getNames().join("\n"), "0")
		if (index != null) {
			currentCoins = 0

			let levelData = getLevel(index)
			let converted = gdToJson(levelData)

			let newObjs = []
			for (let obj of converted) {
				let id = obj.id
				let objName
				for (let idObj of Object.keys(gdToJsonIds)) {
					let val = gdToJsonIds[idObj]
					if (val.indexOf(id) != -1) {
						objName = idObj
						break
					}
				}
				if (objName != undefined) {
					let imgX = obj.x * editorGridSize / 30
					let imgY = obj.y * editorGridSize / 30
					let moveY = 0
					for (let mv of Object.keys(gdToJsonMoves)) {
						let val = gdToJsonMoves[mv]
						if (val.indexOf(id) != -1 || val.indexOf(objName) != -1) moveY += +mv
					}
					imgY += moveY
					
					let addObj = {
						obj: objName,
						imgX,
						imgY: "innerHeight-128- " + imgY
					}
					if (obj.rotation < 0) obj.rotation += 360
					if (obj.rotation == 90 || obj.rotation == 180 || obj.rotation == 270) addObj.rot = obj.rotation
					else if (obj.flipX || obj.flipY) addObj.rot = 180
					newObjs.push(addObj)

					if (objName == "coin") currentCoins++
				}
			}

			level = newObjs
			resetPlayer(true)
			if (editorEnabled) toggleEditor()
			
			showLevelDescription()
		}
	}
}
function showLevelDescription () {
	if (levelDescription == undefined) alert("No level description.")
	else alert("Level description:\n" + levelDescription)
}
