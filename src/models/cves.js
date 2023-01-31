import Db from '../db/connection'

const addCveByKeyword = (keyword) => {
    return Db().then(function(db){
        return new Promise((resolve, reject) => {

            let trans = db.transaction(['cves'], 'readwrite');
            trans.oncomplete = () => {
                resolve();
            };
    
            trans.onerror = e => {
                reject(e);
            }
    
            let store = trans.objectStore('cves');
            store.add({ createdAt: new Date(), term: keyword });
        });
    })
    .catch(function(e) {
        console.log('addCve failed');
        console.error(e);
    })
};

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
                if (cursor) {
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
            trans.oncomplete = () => {
                resolve();
            };
    
            trans.onerror = e => {
                reject(e);
            }
    
            let store = trans.objectStore('cves');
            store.delete(id);
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

            let trans = db.transaction(['cves'], 'readwrite');
            trans.oncomplete = () => {
                resolve();
            };
    
            trans.onerror = e => {
                reject(e);
            }
    
            let store = trans.objectStore('cves');
            store.get(cveId);
        });
    })
    .catch(function(e){
        console.log('getCveByCveId failed');
        console.error(e);
    })
}

const checkCveByCveId = (cveId) => {
    return Db().then(function(db){
        return new Promise((resolve, reject) => {

            let trans = db.transaction(['cves'], 'readonly');

            trans.oncomplete = () => {
                resolve();
            };
    
            trans.onerror = e => {
                reject(e);
            }
    
            let store = trans.objectStore('cves');
            const range = IDBKeyRange.only(cveId);
            const index = store.index('cveId');
            const cursorRequest = index.openCursor(range);
            cursorRequest.onsuccess = (e) => {
                const cursor = e.target.result;
                resolve(!!cursor);
            }
        });
    })
    .catch(function(e){
        console.log('checkCveByCveId failed');
        console.error(e);
    })
}

export { 
    addCveByKeyword, 
    removeCve, 
    getCveByCveId,
    checkCveByCveId,
    getCveList
 }