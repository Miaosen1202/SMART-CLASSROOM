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
  import left from './left.vue'
  import top from './top.vue'
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
    background-color: #f4f4f4;
  }
.left{
  width: 16%;
  height: 89%;
  float: left;
  color: #c3c7d5;
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
  /*height: 8%;
  border: 1px solid #929292;*/
  background-color: white;
}
.right-main{
  width: 98%;
  height: 95%;
  margin-top: 1.8%;
  margin-left: 2%;
  background-color: #fff;

}
</style>
