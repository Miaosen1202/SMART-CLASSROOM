<template>
  <div id="left">
    <!--<img style="cursor: pointer" v-on:click="goback()" class="logo"
         src="../../../static/images/pc1.png" width="100%" height="40%" alt="">
    <div>
      <img src="../../../static/images/pc2.png" width="16.5%" alt="" style="position: absolute;top: 15%;left: -2px">
    </div>-->
    <ul>
      <li :class="{active : activeFlag == 'myCourse'}" @click="goToteacherManagement('myCourse')">
        <!--<el-button type="text" @click="dialogVisible = true">-->
          <!--<p>-->
            <!--<img src="../../../static/images/Teache.png" alt="">-->
             <!--{{$t('message.MyCourse')}}</p>-->
        <!--</el-button>-->
        <p>
          <img src="../../../static/images/MyCourses-white.png" alt=""><span style="padding-left: 8%">{{$t('message.MyCourse')}}</span>
        </p>
      </li>
      <li :class="{active : activeFlag == 'myResources'}" @click="goToresourceManagement('myResources')">

        <p>
          <img src="../../../static/images/Resource-white.png" alt=""><span style="padding-left: 8%">{{$t('message.MyResources')}}</span>
        </p>
      </li>
      <li :class="{active : activeFlag == 'myOpinion'}" @click="goTostudentManagement('myOpinion')">
        <p>
          <img src="../../../static/images/OpinionManagement.png" alt=""><span style="padding-left: 8%">{{$t('message.MyOpinion')}}</span>
        </p>
      </li>
      <li :class="{active : activeFlag == 'commonsResource'}" @click="goTocommonsResource('commonsResource')">
        <p>
          <img src="../../../static/images/common-white.png" alt=""><span style="padding-left: 8%">{{$t('message.commonsResource')}}</span>
        </p>
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
        activeFlag:'myCourse',
        dialogVisible: false
      }
    },
    mounted() {
      let path = this.$route.path;
      if (path.endsWith("myCourse")) {
        this.activeFlag = "myCourse";
      } else if (path.endsWith("myResources")) {
        this.activeFlag = "myResources";
      } else if (path.endsWith("myOpinion")) {
        this.activeFlag = "myOpinion";
      } else if (path.endsWith("commonsResource")) {
        this.activeFlag = "commonsResource";
      }
    },
    methods:{
      goToteacherManagement(s){
        this.activeFlag = s;
        this.$router.push({path:"/personalCenterManagement/myCourse"});
      },
      goTostudentManagement(s){
        this.activeFlag = s;
        this.$router.push({path:"/personalCenterManagement/myOpinion"});
      },
      goToresourceManagement(s){
        this.activeFlag = s;
        this.$router.push({path:"/personalCenterManagement/myResources"});
      },
      goTocommonsResource(s){
        this.activeFlag = s;
        this.$router.push({path:"/personalCenterManagement/commonsResource"});
      },


    }
  }
</script>

<style scoped="">
  #left {
    height: 60%;
  }
  *{
    margin: 0;
    padding: 0;
  }
  ul {
    height: 100%;/* img {
    padding-left: 10%;
  }*/
  }
  ul li {
    text-align: left;
    display: block;
    width: 100%;
    height: 20%;
    /*border: 1px solid #ccc;*/
    cursor: pointer;
    color: #c3c7d5;
    padding-top: 20%;
    margin-top: 10%;
    padding-left: 10%;

  }
  ul li.active{
    background-color: #144efc;
    color: #fff;

  }
  .logo {
    margin-bottom: 16%;
  }
  /*p {
    color: #fff;
  }
*/
</style>

