<template>
    <div>
      <label for="start">Show CVEs from this Date:</label>
      <input type="date" id="start" v-model="createdDate">
      <input class="btn btn-secondary" value="Change Date" @click="changeDate">
      <h2>CVE List for {{ createdDate }}</h2>
      <p v-if="cveList.length === 0">No CVEs for this date.</p>
      <ul class="container">
          <li v-for="(item, idx) in cveList" v-bind:key="item.cveId">
              {{ idx + 1}} - {{ item.cveId }} ({{  item.terms.join(', ') }})
              <router-link :to="'/cve/' + item.cveId">See Details</router-link>
          </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { getCveListByDate } from '../models/cves'
  export default {
    name: 'DatePage',
    data() {
      return {
        createdDate: new Date(),
        cveList: []
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
      }
    },
    mounted() {
      this.getCveList(new Date())
    }
  }
  </script>
  
  <style scoped>
 
  </style>
  