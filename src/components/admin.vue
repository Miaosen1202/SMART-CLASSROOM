<template>
  <div id="all">
    <div class="right-top">
      <top></top>
    </div>
    <div class="left">
      <left></left>
    </div>
    <div class="right">

      <div class="right-main">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import left from './systemManagement/left.vue'
  import top from './systemManagement/top.vue'
  export default {
    name: 'homePage',
    data () {
      return {
        msg: '欢迎'
      }
    },
    methods:{

    },
    components:{
      left,
      top
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #all{
    width:100%;
    height:100%;
    background-color: #ccc;
  }
  .left{
    width: 18%;
    height: 88%;
    float: left;
    background-color: #0138b1;
  }
  .right {
    width: 82%;
    height: 90%;
    /* background-color: blue;*/
    float: left;
  }
  .right-top{
    width: 100%;
    height: 8%;
    border: 1px solid #929292;
    background-color: white;
  }
  .right-main{
    width: 98%;
    height: 96%;
    margin-top: 1%;
    margin-left: 2%;
    background-color: #fff;

  }
</style>

