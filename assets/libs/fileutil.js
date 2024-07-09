let fileutil = {
    file: {
        get: async function (types = [], multiple = false, inHandle, startIn = "documents") {
            let handleList = [inHandle]
            if (!inHandle) {
                if (typeof types == "string") types = [types]
                for (let index in types) {
                    let type = types[index]
                    if (!type.startsWith(".")) types[index] = "." + type
                }
                handleList = await showOpenFilePicker({
                    multiple,
                    excludeAcceptAllOption: true,
                    startIn: typeof startIn == "string" ? startIn : startIn.data.handle,
                    types: [{
                        accept: {
                            "*/*": types
                        },
                        description: ":"
                    }]
                })
            }
            let out = []
            for (let handle of handleList) {
                let obj = {
                    data: {
                        type: "file",
                        name: handle.name,
                        handle: handle,
                        access: false
                    },
                    file: async function () {
                        return await this.data.handle.getFile()
                    },
                    delete: async function () {
                        await this.data.handle.remove()
                    },
                    perms: async function () {
                        let result = await this.data.handle.requestPermission({
                            mode: "readwrite"
                        })
                        let allowed = result == "granted"
                        this.data.access = allowed
                        return allowed
                    },
                    read: async function (type = "text") {
                        if (type == "text") {
                            let file = await this.file()
                            let text = await file.text()
                            return text
                        } else if (type == "buffer") {
                            let reader = new FileReader()
                            let file = await this.file()
                            reader.readAsArrayBuffer(file)
                            return new Promise(function (resolve) {
                                reader.onload = function () {
                                    let buffer = reader.result
                                    resolve(buffer)
                                }
                            })
                        }
                    },
                    write: async function (data, keep = false) {
                        if (keep) {
                            let orig = await this.read()
                            data = orig + data
                        }
                        let writable = await this.data.handle.createWritable()
                        await writable.write(data)
                        await writable.close()
                    },
                    store: async function (id) {
                        await setIdb("file_" + id, this.data.handle)
                    },
                    copy: async function (dir, overwrite = false) {
                        let content = await this.read()
                        let add = await dir.add.file(this.data.name)
                        if (!overwrite && add == null) return false
                        await add.write(content)
                    },
                    rename: async function (name) {
                        await this.data.handle.move(name)
                    },
                    move: async function (dir) {
                        await this.data.handle.move(dir.data.handle)
                    }
                }
                out.push(obj)
            }
            return out
        },
        picker: function (accept, multiple = false) {
            let elem = document.createElement("input")
            elem.type = "file"
            elem.accept = accept
            elem.multiple = multiple
            elem.click()
            return new Promise(function (resolve) {
                elem.onchange = function () {
                    let files = elem.files
                    resolve(files)
                }
            })
        },
        storage: {
            get: async function (id) {
                let handle = await getIdb("file_" + id)
                if (handle) {
                    let arr = await fileutil.file.get(null, null, handle)
                    return arr[0]
                }
            },
            remove: async function (id) {
                await delIdb("file_" + id)
            },
            list: async function () {
                let out = []
                let keys = await storageKeys()
                for (let key of keys) if (key.startsWith("file_")) out.push(await this.get(key.substring(5)))
                return out
            }
        },
        download: {
            instant: function (name, mime, data) {
                let elem = document.createElement("a")
                elem.download = name
                let url = "data:" + mime + ";base64," + btoa(data)
                elem.href = url

                elem.click()
            },
            handle: async function (name = "", types = [], startIn = "documents") {
                if (typeof types == "string") types = [types]
                for (let index in types) {
                    let type = types[index]
                    if (!type.startsWith(".")) types[index] = "." + type
                }
                let handle = await showSaveFilePicker({
                    suggestedName: name + types[0],
                    excludeAcceptAllOption: true,
                    startIn: typeof startIn == "string" ? startIn : startIn.data.handle,
                    types: [{
                        accept: {
                            "*/*": types
                        },
                        description: ":"
                    }]
                })
                let arr = await fileutil.file.get(null, null, handle)
                return arr[0]
            }
        }
    },
    folder: {
        get: async function (edit = true, inHandle, startIn = "documents") {
            let handle = inHandle
            if (!inHandle) handle = await showDirectoryPicker({
                mode: edit ? "readwrite" : "read",
                startIn: typeof startIn == "string" ? startIn : startIn.data.handle
            })
            let obj = {
                data: {
                    type: "folder",
                    name: handle.name,
                    handle: handle,
                    access: edit
                },
                delete: {
                    self: async function () {
                        await obj.data.handle.remove({
                            recursive: true
                        })
                    },
                    item: async function (handle) {
                        await obj.data.handle.removeEntry(handle.data.name, {
                            recursive: true
                        })
                    }
                },
                perms: async function () {
                    let result = await this.data.handle.requestPermission({
                        mode: "readwrite"
                    })
                    let allowed = result == "granted"
                    this.data.access = allowed
                    return allowed
                },
                files: async function (recursive = true) {
                    let list = this.data.handle.values()
                    let out = []
                    let recHandles = []
                    for await (let entry of list) {
                        try {
                            let arr = await fileutil.file.get(null, null, entry)
                            out.push(arr[0])
                            continue
                        } catch (err) {}
                        try {
                            let item = await fileutil.folder.get(null, entry)
                            recHandles.push(item)
                            out.push(item)
                        } catch (err) {}
                    }
                    if (recursive) {
                        let recFiles = []
                        for (let recHandle of recHandles) recFiles.push(...await recHandle.files(true))
                        out.push(...recFiles)
                    }
                    return out
                },
                get: {
                    file: async function (name) {
                        try {
                            let handle = await obj.data.handle.getFileHandle(name)
                            let arr = await fileutil.file.get(null, null, handle)
                            return arr[0]
                        } catch (er) {
                            return null
                        }
                    },
                    folder: async function (name) {
                        try {
                            let handle = await obj.data.handle.getDirectoryHandle(name)
                            let item = await fileutil.folder.get(null, handle)
                            return item
                        } catch (er) {
                            return null
                        }
                    }
                },
                add: {
                    file: async function (name, overwrite = false) {
                        if (!overwrite) {
                            let file = await obj.get.file(name)
                            if (file != null) return null
                        }

                        let handle = await obj.data.handle.getFileHandle(name, {
                            create: true
                        })
                        let arr = await fileutil.file.get(null, null, handle)
                        return arr[0]
                    },
                    folder: async function (name, overwrite = false) {
                        if (!overwrite) {
                            let file = await obj.get.file(name)
                            if (file != null) return null
                        }

                        let handle = await obj.data.handle.getDirectoryHandle(name, {
                            create: true
                        })
                        let item = await fileutil.folder.get(null, handle)
                        return item
                    }
                },
                itemPath: async function (handle, join = false) {
                    let path = await this.data.handle.resolve(handle.data.handle)
                    if (join) path = path.join("/")
                    return path
                },
                store: async function (id) {
                    await setIdb("folder_" + id, this.data.handle)
                }
            }
            return obj
        },
        picker: function () {
            let elem = document.createElement("input")
            elem.type = "file"
            elem.webkitdirectory = true
            elem.click()
            return new Promise(function (resolve) {
                elem.onchange = function () {
                    let files = elem.files
                    resolve(files)
                }
            })
        },
        storage: {
            get: async function (id) {
                let handle = await getIdb("folder_" + id)
                if (handle) return await fileutil.folder.get(null, handle)
            },
            reset: async function (id) {
                await delIdb("folder_" + id)
            },
            list: async function () {
                let out = []
                let keys = await storageKeys()
                for (let key of keys) {
                    if (key.startsWith("folder_")) out.push(await this.query(key.substring(7)))
                }
                return out
            }
        }
    },
    storage: {
        list: async function () {
            let keys = await storageKeys()
            return keys
        }
    }
}
