<template>
  <h1>CVE Feed</h1>
  <div>
    <input type="button" value="Sync" @click="sync">
  </div>
  <router-view></router-view>
  <ul>
    <li><router-link to="/">Home</router-link></li>
    <li><router-link to="/keyword-list">Keywords</router-link></li>
    <li><router-link to="/cve-list">CVE List</router-link></li>
    <li><router-link to="/about">About</router-link></li>
  </ul>
</template>

<script>
import { pullKeyword } from './net/cve'
import { getKeywordList, addKeywordCveList } from './models/keywords'
import { addCveListByKeyword } from './models/cves'
export default {
  name: 'App',
  methods: {
    sync() {
      getKeywordList()
        .then(function(keywordList){
          return Promise.all(keywordList.map(function(i){
            return pullKeyword(i.term)
              .then(function(data){
                return addCveListByKeyword(data, i.term)
              })
              .then(function(cveIds) {
                return addKeywordCveList(i.term, cveIds)
              })
          }))
      });
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
