<template>
    <div class="hello">
      <h2>{{ cveId }}</h2>
      <div v-if="!!cve.cve">
        <p>
          {{ cve.cve.descriptions.find(e => e.lang == "en" ).value }}
        </p>
        <p>Published: {{ new Date(cve.cve.published) }}</p>
        <p>Cached in CVE-Feed: {{ new Date(cve.createdAt) }}</p>
        <p>Discovered for Keywords: {{ cve.terms.join(", ") }}</p>
        <a :href="'https://nvd.nist.gov/vuln/detail/' + cve.cveId">NVD Link</a>
      </div>
    </div>
  </template>
  
  <script>
  import { getCveByCveId } from '../models/cves'
  export default {
    name: 'CvePage',
    data() {
      return {
        cve: {}
      }
    },
    props: ['cveId'],
    methods: {
      getCve() {
        const self = this;
        getCveByCveId(this.cveId)
          .then(function(cve){
            self.cve = cve
          })
      }
    },
    mounted() {
      this.getCve()
    }
  }
  </script>
  
  <style scoped>
 
  </style>
  