<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
    name: 'App'
};
</script>

<style>
#app {
    width: 100%;
    height: 100%;
    position: absolute;
    overflow-y: hidden;
    -webkit-tap-highlight-color: transparent;
    -webkit-font-smoothing: antialiased;
}
</style>
