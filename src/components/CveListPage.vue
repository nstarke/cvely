<template>
    <div>
      <h2>CVE List</h2>
      <div class="controls">
          <input placeholder="New CVE" type="text" v-model="oneOffCve" @blur="check" v-on:keyup="check">
          <input class="btn btn-primary" type="button" @click="add" value="Add" :disabled="!newCveIsValidId">
      </div>
      <div v-if="noCveFound">
        <p>No CVE Found</p>
      </div>
      <ul>
          <li v-for="(item, idx) in cveList" v-bind:key="item.cveId">
              <p>
                {{ idx + 1}} - <router-link :to="'/cve/' + item.cveId">{{ item.cveId }}</router-link> <span v-if="item.terms.length > 0">({{ item.terms.join(', ') }})</span>
              </p>
              <input class="btn btn-danger" type="button" value="Remove CVE" @click="remove(item)">
          </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { getCveList, removeCve, addCve } from '../models/cves'
  import { checkKeywordByTerm, addKeywordCveList } from '../models/keywords'
  import { pullCve } from '../net/cve'
  export default {
    name: 'CveListPage',
    computed: {
      newCveIsValidId() {
        return (this.oneOffCve.startsWith('CVE-') 
        || this.oneOffCve.startsWith('cve-')) 
        && this.oneOffCve.substring(4).split('-').every(function(s){ return /^\d+$/.test(s); });
      }
    },
    data() {
      return {
        oneOffCve: "",
        cveList: [],
        noCveFound: false
      }
    },
    methods: {
      add() {
        const self = this;
        pullCve(this.oneOffCve)
          .then(function (cveData){
            if (cveData) {
              addCve(cveData)
                .then(function() {
                  self.getList()
                })
            } else {
              self.noCveFound = true;
            }
            
          })
      },
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
  