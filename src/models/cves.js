import Db from '../db/connection'

const addCveListByKeyword = (cveList, keyword) => {
    let cveIds = [];
    return new Promise(function(resolve, reject){
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
                                    return store.put(res)
                                }
                            } else {
                                return store.add({ 
                                    createdAt: new Date(), 
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
                if (cursor && !cursor.value.filtered) {
                    cves.push(cursor.value)
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

export { 
    addCveListByKeyword, 
    removeCve, 
    getCveByCveId,
    getCveList
 }