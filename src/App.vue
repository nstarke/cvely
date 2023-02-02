<template>
  <h1>CVE Feed</h1>
  <div>
    <input class="btn btn-success" type="button" value="Sync For Present Date" @click="sync" :disabled="syncing">
    <p v-if="commsProblems">
      Problems reaching NVD.
    </p>
    <p v-if="syncing">Syncing now!</p>
  </div>
  <router-view></router-view>
  <ul>
    <li><router-link to="/">Home</router-link></li>
    <li><router-link to="/keyword-list">Keywords</router-link></li>
    <li><router-link to="/cve-list">CVE List</router-link></li>
    <li><router-link to="/date">CVEs by Date</router-link></li>
    <li><router-link to="/import">Import</router-link></li>
    <li><router-link to="/about">About</router-link></li>
  </ul>
</template>

<script>
import { pullKeyword } from './net/cve'
import { getKeywordList, addKeywordCveList } from './models/keywords'
import { addCveListByKeyword } from './models/cves'
export default {
  name: 'App',
  data() {
    return {
      syncing: false,
      commsProblems: false
    }
  },
  methods: {
    sync() {
      const self = this;
      self.syncing = true;
      getKeywordList()
        .then(function(keywordList){
          return Promise.allSettled(keywordList.map(function(i, idx){
            return self.pull(i.term, idx)
              .catch(function(){
                self.commsProblems = true;
              })
          }))
          .then(function() {
              self.syncing = false;
              self.commsProblems = false;
            })
            .catch(function() {
              self.syncing = false;
              self.commsProblems = true;
            })
      });
    },
    pull(term, idx) {
      return new Promise(function(resolve){
        setTimeout(function() {
          pullKeyword(term)
              .then(function(data){
                if (data.length === 0) return resolve();
                return addCveListByKeyword(data, term)
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
  }
}
</script>

<style>
ul {
  list-style: none;
  padding-left: 0 !important;
}
</style>
