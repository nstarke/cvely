<template>
    <h2>Keyword {{ currentKeyword }}</h2>
    <div class="hello">
    </div>
  </template>
  
  <script>
  export default {
    name: 'KeywordPage',
    data() {
        return {
            currentKeyword: "",
            cveList: []
        }
    },
    methods: {
        remove() {

        }
    }
  }
  </script>
  
  <style scoped>
 
  </style>
  