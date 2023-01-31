<template>
    <h2>Keywords</h2>
    <div>
        <p>{{ msg }}</p>
        <div class="controls">
            <input placeholder="New Keyword" type="text" v-model="currentTerm" @blur="check" v-on:keyup="check">
            <input class="btn btn-primary" type="button" @click="add" value="Add" :disabled="currentTerm.length === 0 || alreadyAdded">
        </div>
        <ul>
            <li v-for="(item, idx) in keywordList" v-bind:key="item.id">
                <div>
                    <p>{{ idx + 1 }} - <router-link :to="'/keyword/' + item.id">{{ item.term }}</router-link> <input class="btn btn-danger" type="button" value="Remove Term" @click="remove(item)"></p>
                    <p>{{  item.cveIds.length }} CVEs aggregated for this keyword</p>
                </div>
            </li>
        </ul>
    </div>
  </template>
  
  <script>
  import { getKeywordList, addKeyword, checkKeywordByTerm, removeKeyword } from '../models/keywords'
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
        remove(item) {
            const self = this;
            removeKeyword(item.id)
                .then(function() {
                    self.getList()
                })
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
                self.keywordList = keywordList.filter((i) => { return !i.filtered });
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
  