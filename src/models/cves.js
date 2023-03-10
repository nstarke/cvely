import Db from '../db/connection'

const addCve = (cveData) => {
    return new Promise(function(resolve, reject){
        return getCveByCveId(cveData.cve.id)
        .then((res) => {
             return Db().then(function(db){
                 let trans = db.transaction(['cves'], 'readwrite');
                 trans.oncomplete = () => {
                     resolve(cveData);
                 }
         
                 trans.onerror = e => {
                     reject(e);
                 }
         
                 let store = trans.objectStore('cves');
                 if (res) {
                    res.filtered = true;
                    store.put(res)
                 } else {
                    let newCve = {};
                    newCve.createdAt = new Date().getTime()
                    newCve.terms = []
                    newCve.cveId = cveData.cve.id
                    newCve.cve = cveData.cve
                    newCve.filtered = false 
                    store.put(newCve);
                 }
             })
        })
    })
}

const addCveListByKeyword = (cveList, keyword) => {
    let cveIds = [];
    return new Promise(function(resolve, reject){
        if (cveList.length === 0) return resolve(cveIds);
        return Promise.all(cveList.map(cve => {
            if (!cve.filtered) cveIds.push(cve.cve.id);
            return getCveByCveId(cve.cve.id)
                .then(res => {
                    return Db()
                        .then(function(db){
                            let trans = db.transaction(['cves'], 'readwrite');
                            trans.oncomplete = () => {
                                resolve(cveIds);
                            }
                    
                            trans.onerror = e => {
                                reject(e);
                            }
                    
                            let store = trans.objectStore('cves');
                            if (res) {
                                if (!res.terms.includes(keyword)) {
                                    res.terms.push(keyword)
                                    res.filtered = false;
                                    return store.put(res)
                                }
                            } else {
                                return store.add({ 
                                    createdAt: new Date().getTime(), 
                                    terms: [keyword], 
                                    cveId: cve.cve.id, 
                                    cve: cve.cve, 
                                    filtered: false 
                                });
                            }
                        })
                    })
        }))
    })
}

const addCveListByKeywordForDate = (cveList, keyword, date) => {
    let cveIds = [];
    return new Promise(function(resolve, reject){
        if (cveList.length === 0) return resolve(cveIds);
        return Promise.all(cveList.map(cve => {
            if (!cve.filtered) cveIds.push(cve.cve.id);
            return getCveByCveId(cve.cve.id)
                .then(res => {
                    return Db()
                        .then(function(db){
                            let trans = db.transaction(['cves'], 'readwrite');
                            trans.oncomplete = () => {
                                resolve(cveIds);
                            }
                    
                            trans.onerror = e => {
                                reject(e);
                            }
                    
                            let store = trans.objectStore('cves');
                            if (res) {
                                if (!res.terms.includes(keyword)) {
                                    res.terms.push(keyword)
                                    res.filtered = false;
                                    return store.put(res)
                                }
                            } else {
                                return store.add({ 
                                    createdAt: date.getTime(), 
                                    terms: [keyword], 
                                    cveId: cve.cve.id, 
                                    cve: cve.cve, 
                                    filtered: false 
                                });
                            }
                        })
                    })
        }))
    })
}

const getCveList = () => {
    let limit = 50;
	return Db().then(function(db){
        return new Promise((resolve, reject) => {
            let trans = db.transaction(['cves'], 'readonly');
            trans.oncomplete = () => {
                resolve(cves);
            };
            
            trans.onerror = e => {
                reject(e);
            }
            
            let store = trans.objectStore('cves');
            let cves = [];
            
            store.openCursor().onsuccess = e => {
                let cursor = e.target.result;
                if (cursor && limit) {
                    if (!cursor.value.filtered && cursor.value.terms.length) {
                        cves.push(cursor.value)
                        limit--
                    }
                    cursor.continue();
                }
            };
        });
    })
    .catch(function(e){
        console.log('getCveList failed');
        console.error(e);
    })
}

const removeCve = (id) => {
    return Db().then(function(db){
        return new Promise((resolve, reject) => {
            let trans = db.transaction(['cves'], 'readwrite');
            trans.onerror = e => {
                reject(e);
            }
    
            let store = trans.objectStore('cves');
            store.get(id).onsuccess = (e) => {
                const cve = e.target.result;
                if (cve) {
                    cve.filtered = true;
                    store.put(cve)
                }
                resolve(cve);
            }
        });
    })
    .catch(function(e){
        console.log('removeCve failed');
        console.error(e);
    })
}

const getCveByCveId = (cveId) => {
    return Db().then(function(db){
        return new Promise((resolve, reject) => {

            let trans = db.transaction(['cves'], 'readonly');
            trans.onerror = e => {
                reject(e);
            }
    
            let store = trans.objectStore('cves');
            store.get(cveId).onsuccess = function(e){
                resolve(e.target.result);
            }
        });
    })
    .catch(function(e){
        console.log('getCveByCveId failed');
        console.error(e);
    })
}

const getCveListByDate = (currentDate) => {
    return Db().then(function(db){
        return new Promise((resolve, reject) => {

            let trans = db.transaction(['cves'], 'readonly');
            let cveList = [];

            trans.oncomplete = () => {
                resolve(cveList);
            }

            trans.onerror = e => {
                reject(e);
            }
    
            let store = trans.objectStore('cves');
            let start = currentDate.getTime();
            start = start - (start % 86400000)
            const range = IDBKeyRange.bound(start, start + 86400000);
            const index = store.index('dateIdx');
            const cursorRequest = index.openCursor(range);
            cursorRequest.onsuccess = (e) => {
                const cursor = e.target.result;
                if (cursor) {
                    if (!cursor.value.filtered){
                        cveList.push(cursor.value);
                    }
                    cursor.continue();
                } 
            }
        });
    })
    .catch(function(e){
        console.log('removeKeyword failed');
        console.error(e);
    })
}

const addCveList = (cveList) => {
    return new Promise(function(resolve, reject){
        return Promise.all(cveList.map(cve => {
            return getCveByCveId(cve.cve.CVE_data_meta.ID)
                .then(res => {
                    return Db()
                        .then(function(db){
                            let trans = db.transaction(['cves'], 'readwrite');
                            trans.oncomplete = () => {
                                resolve();
                            }
                    
                            trans.onerror = e => {
                                reject(e);
                            }
                    
                            let store = trans.objectStore('cves');
                            if (res) {
                                res.filtered = false;
                                return store.put(res)
                            } else {
                                return store.add({ 
                                    createdAt: (new Date(cve.publishedDate)).getTime(), 
                                    terms: [], 
                                    cveId: cve.cve.CVE_data_meta.ID, 
                                    cve: cve.cve, 
                                    filtered: false 
                                });
                            }
                        })
                    })
        }))
    })
}

export { 
    addCve,
    addCveListByKeyword, 
    addCveListByKeywordForDate,
    removeCve, 
    getCveByCveId,
    getCveList,
    getCveListByDate,
    addCveList
 }