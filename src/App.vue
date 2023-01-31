<template>
  <h1>CVE Feed</h1>
  <div>
    <input type="button" value="Sync" @click="sync" :disabled="syncing">
  </div>
  <router-view></router-view>
  <ul>
    <li><router-link to="/">Home</router-link></li>
    <li><router-link to="/keyword-list">Keywords</router-link></li>
    <li><router-link to="/cve-list">CVE List</router-link></li>
    <li><router-link to="/date">CVEs by Date</router-link></li>
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
      syncing: false
    }
  },
  created() {
    if (process.env.NODE_ENV === 'production') this.sync()
  },
  methods: {
    sync() {
      const self = this;
      self.syncing = true;
      getKeywordList()
        .then(function(keywordList){
          return Promise.all(keywordList.map(function(i){
            return pullKeyword(i.term)
              .then(function(data){
                self.syncing = false;
                return addCveListByKeyword(data, i.term)
              })
              .then(function(cveIds) {
                return addKeywordCveList(i.term, cveIds)
              })
              .catch(function() {
                self.syncing = false;
              })
          }))
      });
    }
  }
}
</script>

<style>
ul {
  list-style: none;
}
</style>
