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

export {
    pullKeyword
}