<template>
  <h1>CVE Feed</h1>
  <router-view></router-view>
  <ul>
    <li><router-link to="/">Home</router-link></li>
    <li><router-link to="/keyword-list">Keywords</router-link></li>
    <li><router-link to="/cve-list">CVE List</router-link></li>
    <li><router-link to="/about">About</router-link></li>
  </ul>
</template>

<script>
export default {
  name: 'App'
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
