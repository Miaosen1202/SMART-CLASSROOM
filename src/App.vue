<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return{

    }
  },
  components:{
  }
}
</script>

<style>
  *{
    margin:0;
    padding:0
  }
  li{
    list-style:none
  }
  /*img{
    vertical-align:top;
    border:none
  }*/
  #app {
    width: 100%;
    height:100%;
    /*background-color: #2a58ad;*/
  }

</style>
