export default () => {
	return new Promise((resolve, reject) => {
        let request = window.indexedDB.open("cve-feed", 1);
        
        request.onerror = e => {
            reject(e);
        };

        request.onsuccess = e => {
            resolve(e.target.result);
        };
        
        request.onupgradeneeded = e => {
            const db = e.target.result;
            let store = db.createObjectStore("cves", { keyPath: "cveId"});
            store = db.createObjectStore("keywords", { autoIncrement: true, keyPath: 'id' });
            store.createIndex('fulltext', 'term', { unique: true });
        };
	});
}