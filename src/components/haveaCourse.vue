<template>
  <div id="left">
    <h1>LOGO</h1>
    <ul>
      <li @click="goToFirst">Prepare a lesson</li>
      <li @click="goToSecond">Manage all lessons</li>
      <li @click="goToThird">Export lessons</li>
    </ul>
  </div>
</template>

<script>
  export default{
    data(){
      return{
        msg:"左部"

      }
    },
    methods:{
      goToFirst(){
        this.$router.push({path:"/goTeach/lesson"});
      },
      goToSecond(){
        this.$router.push({path:"/homePage/second"});
      },
      goToThird(){
        this.$router.push({path:"/homePage/third"});
      }
    }
  }
</script>

<style scoped="">
  #left {
    height: 80%;
  }
  ul {
    height: 100%;
  }
  ul li {
    text-align: center;
    display: block;
    width: 100%;
    height: 18%;
    /*border: 1px solid #ccc;*/
    margin-bottom: 30%;
    background-color: #1d4c9e;
    color: #fff;
  }

</style>
