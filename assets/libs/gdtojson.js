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
					value = Buffer.from(value, "base64").toString()
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
async function importFromReal () {
	let [handle] = await fileutil.file.get(".level.txt")
	let levelData = await handle.read()
	let converted = gdToJson(levelData)

	let newObjs = []
	for (let obj of converted) {
		let id = obj.id
		let objName
		for (let idObj of Object.keys(gdToJsonIds)) {
			let val = gdToJsonIds[idObj]
			if (val.indexOf(id.toString()) != -1) {
				objName = idObj
				break
			}
		}
		if (objName != undefined) {
			let imgX = obj.x * 2
			let imgY = "innerHeight - 128 - " + (obj.y * 2)
			let rot
			if (obj.rotation != undefined) rot = obj.rotation
			else if (obj.flipX || obj.flipY) rot = 180

			let addObj = {
				obj: objName,
				imgX,
				imgY
			}
			if (rot != undefined) addObj.rot = rot
			newObjs.push(addObj)
		}
	}

	level = newObjs
	resetPlayer(true)
	if (editorEnabled) toggleEditor()
}