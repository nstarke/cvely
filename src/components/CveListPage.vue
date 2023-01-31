<template>
    <div class="hello">
      <h2>CVE List</h2>
      <ul>
          <li v-for="(item, idx) in cveList" v-bind:key="item.cveId">
              {{ idx + 1}} - {{ item.cveId }} ({{ item.terms.join(', ') }})
              <router-link :to="'/cve/' + item.cveId">See Details</router-link>
              <input type="button" value="Remove CVE" @click="remove(item)">
          </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { getCveList, removeCve } from '../models/cves'
  import { checkKeywordByTerm, addKeywordCveList } from '../models/keywords'
  export default {
    name: 'CveListPage',
    data() {
      return {
        cveList: [] 
      }
    },
    methods: {
      remove(item) {
        const self = this;
        removeCve(item.cveId)
          .then(function(cve){
            return Promise.all(cve.terms.map((t) => {
              return checkKeywordByTerm(t)
              .then(function(keyword){
                return addKeywordCveList(t, keyword.cveIds.filter(function(i){ return i !== item.cveId }))
              })
            }))
          })
          .then(function(){
            self.getList();
          })
      },
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
  