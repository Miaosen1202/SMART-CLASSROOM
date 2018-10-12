<template>
  <div class="assignment">
    <p><img src="../../assets/images/u674.png" width="140" height="139" alt=""></p>
    <p>Empty</p>
    <el-button size="medium" type="primary" @click="goToAddAssignment">
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
          goToAddAssignment(){
            this.$router.push({path:"/homePage/course/addAssignment",query:{"lessonId":this.lessonId}});
          }
        }
    }
</script>

<style scoped="">
  .assignment {
    text-align: center;
    margin-top: 4%;
  }
  .assignment p:first-child {
    color: #ccc;
    margin-bottom: 3%;
  }
  .assignment p:nth-child(2) {
    color: #999;
    margin-bottom: 3%;
  }
  .el-button--medium {
    padding: 1% 5%;
  }
  input[type="file"] {
    display: none!important;
  }
</style>
