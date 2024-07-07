function promisifyRequest (request) {
    return new Promise(function (resolve, reject) {
        request.oncomplete = request.onsuccess = () => resolve(request.result)
        request.onabort = request.onerror = () => reject(request.error)
    })
}
function createStore (dbName, storeName) {
    let request = indexedDB.open(dbName)
    request.onupgradeneeded = () => request.result.createObjectStore(storeName)
    let dbp = promisifyRequest(request)
    return (txMode, callback) => dbp.then((db) => callback(db.transaction(storeName, txMode).objectStore(storeName)))
}
let defaultGetStoreFunc
function defaultGetStore () {
    if (!defaultGetStoreFunc) defaultGetStoreFunc = createStore("keyval-store", "keyval")
    return defaultGetStoreFunc
}

async function getIdb (key) {
    return await defaultGetStore()("readonly", (store) => promisifyRequest(store.get(key)))
}
async function setIdb (key, value) {
    return await defaultGetStore()("readwrite", function (store) {
        store.put(value, key)
        return promisifyRequest(store.transaction)
    })
}

async function delIdb (key) {
    return await defaultGetStore()("readwrite", function (store) {
        store.delete(key)
        return promisifyRequest(store.transaction)
    })
}
