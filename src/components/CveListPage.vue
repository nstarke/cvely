<template>
    <div class="hello">
      <h2>CVE List</h2>
      <ul>
          <li v-for="(item, idx) in cveList" v-bind:key="item.cveId">
              {{ idx }} - {{ item.cveId }} found for term {{ item.term }} (Created {{ item.createdAt }})
          </li>
      </ul>
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
    },
    mounted() {
        this.getList();
    }
  }
  </script>
  
  <style scoped>
 
  </style>
  