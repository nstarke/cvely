<template>
    <div class="hello">
      <h2>CVE List</h2>
    </div>
  </template>
  
  <script>
  import { getCveList } from '../models/cves'
  export default {
    name: 'CveListPage',
    data() {
      return {
        cveList: [] 
      }
    },
    methods: {
      getList() {
        const self = this;
        getCveList()
          .then(function(cveList){
              self.cveList = cveList;
          })
      }
    }
  }
  </script>
  
  <style scoped>
 
  </style>
  