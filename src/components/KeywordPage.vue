<template>
    <h2>Keyword "{{ currentKeyword }}"</h2>
    <div>
        <div v-if="cveList.length === 0">
            <p>No Results</p>
        </div>
        <div>
           Keyword created: {{ new Date(createdDate) }}
        </div>
        <ul>
            <li v-for="(item, idx) in cveList" v-bind:key="item">
                {{ idx + 1 }} - <router-link :to="'/cve/' + item">{{ item }}</router-link>
            </li>
        </ul>
    </div>
  </template>
  
  <script>
  import { getKeywordById, removeKeyword } from '../models/keywords'
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
        },
        remove(item) {
            const self = this;
            removeKeyword(item.id)
                .then(function() {
                    self.getList()
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
  