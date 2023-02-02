<template>
    <div>
      <h2>Import CVE Data</h2>
    </div>
    <div class="controls">
        <input type="text" placeholder="CDN URL" v-model="cdnUrl">
        <select v-model="selectedYear">
            <option v-for="year in yearList" v-bind:key="year">{{ year }}</option>
        </select>
        <input @click="pullFromCdn" type="button" class="btn btn-primary" value="Sync from CDN URL" :disabled="syncing">
    </div>
    <div class="status" v-if="syncing">
        <p>Syncing for {{ selectedYear }}</p>
    </div>
  </template>
  
  <script>
  import { addCveList } from '../models/cves'
  import { pullYearFromCveCdn } from '../net/cve'
  export default {
    name: 'ImportPage',
    data() {
        return {
            syncing: false,
            selectedYear: 2022,
            cdnUrl: '',
            yearList: [
               2002,
               2003,
               2004,
               2005,
               2006,
               2007,
               2008,
               2009,
               2010,
               2011,
               2012,
               2013,
               2014,
               2015,
               2016,
               2017,
               2018,
               2019,
               2020,
               2021,
               2022
            ].reverse()
        }
    },
    methods: {
        pullFromCdn() {
            const self = this;
            self.syncing = true;
            pullYearFromCveCdn(self.cdnUrl, self.selectedYear)
                .then(function(cveList){
                    return addCveList(cveList)
                })
                .then(function(){
                    self.syncing = false;
                })
                .catch(function(){
                    self.syncing = false;
                })
        }
    }
  }
  </script>
  
  <style scoped>
  
  </style>
  