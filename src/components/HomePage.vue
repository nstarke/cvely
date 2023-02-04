<template>
    <div>
        <p>CVE Feed is a way for security researchers to manage CVE data.  It works by tracking new CVEs for user-defined keywords.</p>
        <p>After you have defined keywords you are interested in seeing new CVEs for, you can sync those keywords against the NVD CVE database</p>
        <p>You can also match your keywords against any historical date.</p>
        <p>Optionally, you can import CVE Data from a given year (or all years!)</p>
        <p>Historical CVE Data will not match against keywords when imported.</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HomePage',
  }
  </script>
  
  <style scoped>
 
  </style>
  