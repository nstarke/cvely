#!/bin/bash
for YEAR in {2002..2022}
do
    wget "https://nvd.nist.gov/feeds/json/cve/1.1/nvdcve-1.1-$YEAR.json.gz"
done
gunzip *.gz
echo "Creating Self Signed Certificate for local use only."
openssl req -new -x509 -sha256 -keyout server.pem -out server.pem -days 365 -nodes
exit