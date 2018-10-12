<template>
  <div id="left">
    <!--<img style="cursor: pointer" v-on:click="goback()" class="logo"
         src="../assets/images/u164.png" width="80%" alt="">-->
    <ul>
      <li :class="{active : activeFlag == 'prepare'}" @click="goToFirst('prepare')">
        <el-button type="text" @click="dialogVisible = true">
        <img src="../../static/images/Preparealesson.png"  alt="">
        <p style="color: #fff">{{$t('message.NewLesson')}}</p>
        </el-button>
      </li>
      <li :class="{active : activeFlag == 'second'}" @click="goToSecond('second')">
        <img src="../../static/images/Manangealllessons.png"  alt="">
        <P>{{$t('message.CourseManagement')}}</P>
      </li>
      <li :class="{active : activeFlag == 'goTeach'}" @click="goTeach('goTeach')">
        <img src="../../static/images/toteach.png"  alt="">
        <P>{{$t('message.StartAClass')}}</P>
      </li>
      <li :class="{active : activeFlag == 'ViewHistory'}" @click="viewHistory('ViewHistory')">
        <img src="../../static/images/history.png"  alt="">
        <P>{{$t('message.History')}}</P>
      </li>
    </ul>
    <!--<span>
      <el-button type="primary" @click="gotenching('teachingMaterials')">
        123
      </el-button>
    </span>-->
  </div>
</template>

<script>
  export default{
    data(){
      return{
        msg:"左部",
        activeFlag:'prepare',
        dialogVisible: false
      }
    },
    methods:{
      goToFirst(s){
        this.activeFlag = s;
        this.$router.push({path:"/homePage/prepare"});
      },
      goToSecond(s){
        this.activeFlag = s;
        this.$router.push({path:"/homePage/second"});
      },
      goTeach(s){
        this.activeFlag = s;
        this.$router.push({path:"/homePage/goTeach"});
      },
      viewHistory(s){
        this.activeFlag = s;
        this.$router.push({path:"/homePage/ViewHistory"});
      },
     /* goback: function() {
        this.$router.push({path: "/homePage/prepare"});
      },*/
     /* gotenching(){
        this.$router.push({path:"/homePage/teachingMaterials"});
      }*/
    }
  }
</script>

<style scoped="">
  #left {
    height: 60%;
  }
  img {
   /* padding-left: 10%;*/
    padding-top: 4%;
  }
  ul {
    height: 100%;
  }
  ul li {
    text-align: center;
    display: block;
    width: 100%;
    height: 20%;
    /*border: 1px solid #ccc;*/
    margin-bottom: 10%;
    cursor: pointer;
    color: #c3c7d5;
   /* padding-top: 16%;*/
    margin-top: 16%;
  }
  ul li.active{
    background-color: #144efc;
    color: #fff;

  }
  ul li p.active{

    color: #fff;

  }
  .logo {
    margin-bottom: 16%;
  }
/*p {
  color: #c3c7d5;
}*/

</style>
