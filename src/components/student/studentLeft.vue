<template>
  <div id="left">
    <div>
    <ul>
      <li :class="{active : activeFlag == 'LearningMaterials'}" @click="goToFirst('LearningMaterials')">
        <el-button type="text" @click="dialogVisible = true">
          <img src="../../../static/images/TeachingMaterials-white.png"  alt="">
          <p>Learning Material</p>
        </el-button>
      </li>
      <li :class="{active : activeFlag == 'LetDiscuss'}" @click="goToSecond('LetDiscuss')">
        <img src="../../../static/images/Discussion-white.png"  alt="">
        <P>Discussion</P>
      </li>
      <li :class="{active : activeFlag == 'TakeExercises'}" @click="goToThird('TakeExercises')">
        <img src="../../../static/images/Exericises-white.png"  alt="">
        <P>Exercise</P>
      </li>
      <li :class="{active : activeFlag == 'MyAssignment'}" @click="goToFive('MyAssignment')">
        <img src="../../../static/images/Assignment-white.png"  alt="">
        <P>Assignment</P>
      </li>

    </ul>
    <!--<span>
      <el-button type="primary" @click="gotenching('teachingMaterials')">
        123
      </el-button>
    </span>-->

    </div>
  </div>
</template>

<script>
  export default{
    props:{
      lessonId:{
        default:function(){
          return 0;
        },
      },
      lessonCode:{
        default:function(){
          return "";
        },
      },
    },
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
        this.$router.push({path:"/LearningHomework/LearningMaterials",query:{lessonId:this.lessonId,lessonCode:this.lessonCode}});
      },
      goToSecond(s){
        this.activeFlag = s;
        this.$router.push({path:"/LearningHomework/LetDiscuss",query:{lessonId:this.lessonId,lessonCode:this.lessonCode}});
      },
      goToThird(s){
        this.activeFlag = s;
         this.$router.push({path:"/LearningHomework/TakeExercises",query:{lessonId:this.lessonId,lessonCode:this.lessonCode}});
       },
      goToFive(s){
        this.activeFlag = s;
        this.$router.push({path:"/LearningHomework/MyAssignment",query:{lessonId:this.lessonId,lessonCode:this.lessonCode}});
      }
    }
  }
</script>

<style scoped="">
  #left {
    height: 40%;
  }
  img {
    padding-left: 4%;
  }
 /* ul {
    height: 100%;
  }*/
  ul li {
    text-align: center;
    display: block;
    width: 100%;
    height: 24%;
    /*border: 1px solid #ccc;*/
    /*margin-bottom: 30%;*/
    cursor: pointer;
    color: #fff;
    padding-top: 8%;
    margin-top: 10%;
  }
  ul li.active{
    background-color: #144efc;
    color: #fff;

  }
  p {
    color:#fff;
  }

</style>

