<template>
    <h2>Keyword "{{ currentKeyword }}"</h2>
    <div class="hello">
        <div v-if="cveList.length === 0">
            <p>No Results</p>
        </div>
        <div>
           Keyword created: {{ createdDate }}
        </div>
        <ul>
            <li v-for="(item, idx) in cveList" v-bind:key="item">
                {{ idx + 1 }} - {{ item }} <router-link :to="'/cve/' + item">See Details</router-link>
            </li>
        </ul>
    </div>
  </template>
  
  <script>
  import { getKeywordById } from '../models/keywords'
  export default {
    name: 'KeywordPage',
    props: {
        id: {
            type: [Number]
        }
    },
    data() {
        return {
            currentKeyword: "",
            cveList: [],
            createdDate: ""
        }
    },
    methods: {
        getKeyword() {
            const self = this;
            getKeywordById(Number.parseInt(this.id))
                .then(function(k){
                    self.currentKeyword = k.term
                    self.cveList = k.cveIds
                    self.createdDate = k.createdAt
                })
        }
    },
    mounted() {
        this.getKeyword();
    }
  }
  </script>
  
  <style scoped>
 
  </style>
  