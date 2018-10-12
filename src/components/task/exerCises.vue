<template>
  <div class="exercises">
    <p><img src="../../assets/images/u768.png" alt=""></p>
    <p>Empty</p>
    <el-button style="background-color: #0e38b1" size="medium" type="primary" @click="goToAddExercises">
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

        mounted() {
          this.$http.get(`${process.env.NODE_ENV}/choiceQuestion/pageList`, {params: {
              lessonId: this.lessonId,
              pageSize: 1
            }}).then((res) => {
              if (res.data.code == 200 && res.data.entity.total > 0) {
                this.goToAddExercises();
              }
          })
        },

        methods: {
          goToAddExercises(){
            this.$router.push({path:"/homePage/course/addExercises",query:{"lessonId":this.lessonId}});
          }
        }
    }
</script>

<style scoped="">
  .exercises {
    text-align: center;
    margin-top: 4%;
  }
  .exercises p:first-child {
    color: #ccc;
    margin-bottom: 3%;
  }
  .exercises p:nth-child(2) {
    color: #999;
    margin-bottom: 3%;
  }
  .el-button--medium {
    padding: 1% 5%;
  }
</style>
