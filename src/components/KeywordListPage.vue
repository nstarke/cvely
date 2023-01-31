<template>
    <h2>Keywords</h2>
    <div class="hello">
        <p>{{ msg }}</p>
        <input placeholder="New Keyword" type="text" v-model="currentTerm" @blur="check" v-on:keyup="check">
        <input type="button" @click="add" value="Add" :disabled="currentTerm.length === 0 || alreadyAdded">
        <ul>
            <li v-for="(item, idx) in keywordList" v-bind:key="item.id">
                {{ idx }} - {{ item.term }} (Created {{ item.createdAt }})
            </li>
        </ul>
    </div>
  </template>
  
  <script>
  import { getKeywordList, addKeyword, checkKeywordByTerm } from '../models/keywords'
  export default {
    name: 'KeywordListPage',
    data() {
        return {
            msg: "",
            alreadyAdded: false,
            currentTerm: "",
            keywordList: []
        }
    },
    methods: {
        add() {
            const termToAdd = this.currentTerm.trim();
            if (termToAdd) {
                const self = this;
                checkKeywordByTerm(termToAdd)
                .then(function (res) {
                    if (res){
                        self.msg = "Term Already Exists"
                        self.getList(); 
                    } else {
                        addKeyword(termToAdd)
                        .then(function(){
                            self.getList()
                            self.currentTerm = ""
                            self.alreadyAdded = false;
                        })
                    }
                })
            } 
        },
        check() {
            this.alreadyAdded = false;
            const termToCheck = this.currentTerm.trim();
            if (termToCheck) {
                const self = this;
                checkKeywordByTerm(termToCheck)
                .then(function (res) {
                    if (res) {
                        self.alreadyAdded = true;
                        self.msg = "Term Already Exists"
                    } 
                })
            } 
        },
        getList() {
            const self = this;
            return getKeywordList()
            .then(function(keywordList) {
                self.keywordList = keywordList;
            })
        }
    },
    mounted() {
        this.getList();
    }
  }
  </script>
  
  <style scoped>
 
  </style>
  