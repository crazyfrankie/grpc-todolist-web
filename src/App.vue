<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
@import '@/assets/scss/main.scss';

#app {
  
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  
  /* 隐藏滚动条 */
  overflow-x: hidden;
  overflow-y: auto;
  
  /* Webkit浏览器（Chrome, Safari等） */
  &::-webkit-scrollbar {
    display: none;
  }
  
  /* Firefox */
  scrollbar-width: none;
  
  /* IE和Edge */
  -ms-overflow-style: none;
}
</style>