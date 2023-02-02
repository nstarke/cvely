const pullKeyword = (term) => {
    return new Promise(function(resolve, reject){
        let current = new Date();
        current = new Date(current - (current % 86400000))
        let end = new Date(current);
        end.setDate(current.getDate() + 1)
        current.setDate(current.getDate() - 1)
        fetch("https://services.nvd.nist.gov/rest/json/cves/2.0?pubStartDate="+ current.toISOString() + "&pubEndDate=" + end.toISOString() + "&keywordSearch=" + term)
            .then(function(res){
                return res.json();
            })
            .then(function (data) {
                resolve(data.vulnerabilities)
            })
            .catch(function(e){
                reject(e);
            })
        })
}

const pullKeywordForDate = (term, day) => {
    return new Promise(function(resolve, reject){
        day = new Date(day - (day % 86400000))
        let end = new Date(day);
        end.setDate(day.getDate() + 1)
        fetch("https://services.nvd.nist.gov/rest/json/cves/2.0?pubStartDate="+ day.toISOString() + "&pubEndDate=" + end.toISOString() + "&keywordSearch=" + term)
            .then(function(res){
                return res.json();
            })
            .then(function (data) {
                resolve(data.vulnerabilities)
            })
            .catch(function(e){
                reject(e);
            })
        })
}

const pullCve = (cveId) => {
    return new Promise(function(resolve, reject){
        return fetch("https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=" + cveId)
            .then(function(res){
                return res.json();
            })
            .then(function (data) {
                resolve(data.vulnerabilities.pop())
            })
            .catch(function(e){
                reject(e);
            })
        })
}

function pullYearFromCveCdn(cdnUrl, year) {
    return new Promise(function(resolve, reject){
        return fetch(cdnUrl + "/nvdcve-1.1-" + year + ".json")
            .then(function(res){
                return res.json();
            })
            .then(function (data) {
                resolve(data.CVE_Items)
            })
            .catch(function(e){
                reject(e);
            })
        })
}

export {
    pullKeyword,
    pullKeywordForDate,
    pullCve,
    pullYearFromCveCdn
}