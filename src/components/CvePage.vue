<template>
    <div>
      <h2>{{ cveId }}</h2>
      <div v-if="!!cve.cve">
        <p>
          {{ description }}
        </p>
        <p v-if="published">Published: {{ published }}</p>
        <p>Cached in CVE-Feed: {{ new Date(cve.createdAt) }}</p>
        <p v-if="cve.terms.length > 0">Discovered for Keywords: {{ cve.terms.join(", ") }}</p>
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
        cve: {},
        description: "",
        published: ""
      }
    },
    props: ['cveId'],
    methods: {
      getCve() {
        const self = this;
        getCveByCveId(this.cveId)
          .then(function(cve){
            self.cve = cve
            self.description = cve.cve.descriptions ? cve.cve.descriptions.find(e => e.lang == "en" ).value : cve.cve.description.description_data.find(e => e.lang == "en").value
            self.published = cve.cve.published ? new Date(cve.cve.published) : (cve.cve.publishedDate ? new Date(cve.cve.publishedDate) : "")
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
  