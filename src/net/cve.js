const pullKeyword = (term) => {
    return new Promise(function(resolve, reject){
        const current = new Date();
        const end = new Date(current);
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