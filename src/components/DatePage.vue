<template>
    <div>
      <h2>CVE List for {{ createdDate }}</h2>
      <div class="controls">
        <label for="start">Show CVEs from this Date:</label>
        <input type="date" id="start" v-model="createdDate">
        <input class="btn btn-secondary" value="Change Date" @click="changeDate">
        <input class="btn btn-primary" value="Synchonize Date" @click="sync" :disabled="syncing">
        <p v-if="cveList.length === 0">No CVEs for this date.</p>
        <p v-if="syncing">Syncing for Date...</p>
      </div>
      <ul>
          <li v-for="(item, idx) in cveList" v-bind:key="item.cveId">
              {{ idx + 1}} - {{ item.cveId }} ({{  item.terms.join(', ') }})
              <router-link :to="'/cve/' + item.cveId">See Details</router-link>
          </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { getKeywordList, addKeywordCveList } from '../models/keywords'
  import { getCveListByDate, addCveListByKeywordForDate } from '../models/cves'
  import { pullKeywordForDate } from '../net/cve'

  export default {
    name: 'DatePage',
    data() {
      return {
        createdDate: new Date(),
        cveList: [],
        syncing: false
      }
    },
    methods: {
      getCveList(currentDate) {
        const self = this;
        self.createdDate = currentDate
        getCveListByDate(currentDate)
            .then(function(cveList){
                self.cveList = cveList;
            })
      },
      changeDate() {
        this.getCveList(new Date(this.createdDate))
      },
      sync() {
        const self = this;
        self.syncing = true;
        self.getCveList(new Date(self.createdDate))
        getKeywordList()
          .then(function(keywordList){
            return Promise.allSettled(keywordList.map(function(i, idx){
              return self.pull(i.term, idx, new Date(self.createdDate))
            }))
            .then(function() {
                self.syncing = false;
                self.getCveList(new Date(self.createdDate))
              })
              .catch(function() {
                self.getCveList(new Date(self.createdDate))
                self.syncing = false;
              })
        });
      },
      pull(term, idx, date) {
        return new Promise(function(resolve){
          setTimeout(function() {
            pullKeywordForDate(term, date)
                .then(function(data){
                  if (data.length === 0) return resolve();
                  return addCveListByKeywordForDate(data, term, date)
                    .then(function(cveIds) {
                      return addKeywordCveList(term, cveIds)
                    })
                    .then(function(){
                      return resolve();
                    })
                })
          },
          idx * 10 * 1000)
        })
      }
    },
    mounted() {
      this.getCveList(new Date())
    }
  }
  </script>
  
  <style scoped>
 
  </style>
  