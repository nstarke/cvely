import Db from '../db/connection'

const addCveListByKeyword = (cveList, keyword) => {
    return Db()
    .then(function(db){
        return new Promise((resolve, reject) => {

            let trans = db.transaction(['cves'], 'readwrite');
            trans.oncomplete = () => {
                resolve();
            };
    
            trans.onerror = e => {
                reject(e);
            }
    
            let store = trans.objectStore('cves');
            cveList.map(cve => {
                return store.put({ createdAt: new Date(), term: keyword, cveId: cve.cve.id, cve: cve.cve });
            })
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
            trans.oncomplete = (e) => {
                resolve(e.target.result);
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

export { 
    addCveListByKeyword, 
    removeCve, 
    getCveByCveId,
    getCveList
 }