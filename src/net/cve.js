const pullKeyword = (term) => {
    const current = new Date();
    fetch("https://services.nvd.nist.gov/rest/json/cves/2.0?pubStartDate="+ current.toISOString + "&pubEndDate=" + (current + (24 * 60 * 60 * 1000)).toISOString() + "&keywordSearch=" + term)
        .then(function(res){
            return res.json();
        })
        .then(function (data) {
            console.log(data);
        });
}