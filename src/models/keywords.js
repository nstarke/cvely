import Db from '../db/connection'

const addKeywordCveList = (keyword, cveList) => {
    return checkKeywordByTerm(keyword)
        .then(function(term){
            return Db().then(function(db){
                return new Promise((resolve, reject) => {
        
                    let trans = db.transaction(['keywords'], 'readwrite');
                    trans.oncomplete = () => {
                        resolve();
                    };
            
                    trans.onerror = e => {
                        reject(e);
                    }
            
                    let store = trans.objectStore('keywords');
                    term.cveIds = cveList
                    store.put(term);
                });
            })
            .catch(function(e) {
                console.log('addKeyword failed');
                console.error(e);
            })
        })
};

const addKeyword = (keyword) => {
    return Db().then(function(db){
        return new Promise((resolve, reject) => {

            let trans = db.transaction(['keywords'], 'readwrite');
            trans.oncomplete = () => {
                resolve();
            };
    
            trans.onerror = e => {
                reject(e);
            }
    
            let store = trans.objectStore('keywords');
            store.add({ createdAt: new Date().getTime(), term: keyword, cveIds: [] });
        });
    })
    .catch(function(e) {
        console.log('addKeyword failed');
        console.error(e);
    })
};

const getKeywordList = () => {
	return Db().then(function(db){
        return new Promise((resolve, reject) => {
            let trans = db.transaction(['keywords'], 'readonly');
            trans.oncomplete = () => {
                resolve(keywords.reverse());
            };
            
            trans.onerror = e => {
                reject(e);
            }
            
            let store = trans.objectStore('keywords');
            let keywords = [];
            
            store.openCursor().onsuccess = e => {
                let cursor = e.target.result;
                if (cursor) {
                    keywords.push(cursor.value)
                    cursor.continue();
                }
            };
        });
    })
    .catch(function(e){
        console.log('getKeyword failed');
        console.error(e);
    })
}

const removeKeyword = (id) => {
    return Db().then(function(db){
        return new Promise((resolve, reject) => {

            let trans = db.transaction(['keywords'], 'readwrite');
            trans.oncomplete = () => {
                resolve();
            };
    
            trans.onerror = e => {
                reject(e);
            }
    
            let store = trans.objectStore('keywords');
            store.delete(id);
        });
    })
    .catch(function(e){
        console.log('removeKeyword failed');
        console.error(e);
    })
}

const getKeywordById = (id) => {
    return Db().then(function(db){
        return new Promise((resolve, reject) => {

            let trans = db.transaction(['keywords'], 'readwrite');
            
            trans.onerror = e => {
                reject(e);
            }
    
            let store = trans.objectStore('keywords');
            store.get(id).onsuccess = function(e) {
                const result = e.target.result
                resolve(result)
            }
        });
    })
    .catch(function(e){
        console.log('removeKeyword failed');
        console.error(e);
    })
}

const checkKeywordByTerm = (term) => {
    return Db().then(function(db){
        return new Promise((resolve, reject) => {

            let trans = db.transaction(['keywords'], 'readonly');

            trans.onerror = e => {
                reject(e);
            }
    
            let store = trans.objectStore('keywords');
            const range = IDBKeyRange.only(term);
            const index = store.index('termIdx');
            const cursorRequest = index.openCursor(range);
            cursorRequest.onsuccess = (e) => {
                const cursor = e.target.result;
                resolve(cursor ? cursor.value : null);
            }
        });
    })
    .catch(function(e){
        console.log('removeKeyword failed');
        console.error(e);
    })
}

export { 
    getKeywordList, 
    addKeyword, 
    removeKeyword, 
    getKeywordById,
    checkKeywordByTerm,
    addKeywordCveList
 }