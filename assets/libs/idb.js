function promisifyRequest(request) {
    return new Promise(function (resolve, reject) {
        request.oncomplete = request.onsuccess = () => resolve(request.result)
        request.onabort = request.onerror = () => reject(request.error)
    });
}
function createStore(dbName, storeName) {
    const request = indexedDB.open(dbName)
    request.onupgradeneeded = () => request.result.createObjectStore(storeName)
    const dbp = promisifyRequest(request)
    return (txMode, callback) => dbp.then((db) => callback(db.transaction(storeName, txMode).objectStore(storeName)))
}
let defaultGetStoreFunc;
function defaultGetStore() {
    if (!defaultGetStoreFunc) defaultGetStoreFunc = createStore('keyval-store', 'keyval')
    return defaultGetStoreFunc
}

function get(key) {
    return defaultGetStore()('readonly', (store) => promisifyRequest(store.get(key)))
}
function set(key, value) {
    return defaultGetStore()('readwrite', function (store) {
        store.put(value, key)
        return promisifyRequest(store.transaction)
    })
}

function del(key) {
    return defaultGetStore()('readwrite', function (store) {
        store.delete(key)
        return promisifyRequest(store.transaction)
    })
}
