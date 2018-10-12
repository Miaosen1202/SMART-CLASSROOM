<template>
  <div class="discussion">
    <p><img src="../../assets/images/u674.png" alt=""></p>
    <p>Empty</p>
    <el-button size="medium" type="primary" @click="goToAddDiscussion">
      <img src="../../assets/images/u60.png" alt="">
    </el-button>
  </div>
</template>

<script>
    export default {
        data() {
            return {
              lessonId:this.$route.query.lessonId,
            }
        },
        methods: {
          goToAddDiscussion(){
            this.$router.push({path:"/homePage/course/addDiscussion",query:{"lessonId":this.lessonId}});
          }
        }
    }
</script>

<style scoped="">
  .discussion {
    text-align: center;
    margin-top: 4%;
  }
  .discussion p:first-child {
    color: #ccc;
    margin-bottom: 3%;
  }
  .discussion p:nth-child(2) {
    color: #999;
    margin-bottom: 3%;
  }
  .el-button--medium {
    padding: 1% 5%;
  }
</style>
