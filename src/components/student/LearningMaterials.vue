<template>
  <div>

  <div class="teach">

    <p style="padding-top: 10%"><img @click="goToAddMaterials" src="../../assets/images/u550.png" alt=""></p>
    <p>No learning materials from your teacher.</p>

    <!--<el-button size="medium" type="primary" @click="goToAddMaterials">
      <img src="../../assets/images/u60.png" alt="">
    </el-button>-->
    <router-view></router-view>
  </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        lessonId:this.$route.query.lessonId,
        lessonCode:this.$route.query.lessonCode
      }
    },

    mounted() {
      this.$http.get(`${process.env.NODE_ENV}/lessonMaterial/list`, {params: {status: 1, lessonId: this.lessonId}})
        .then((res) => {
          if (res.data.code == 200) {
            if (res.data.entity.length > 0) {
              this.goToAddMaterials();
            }
          } else {
            this.$message.error(res.data.message);
          }
        }).catch((err) => {
        this.$message.error(err);
      })
    },

    methods: {
      goToAddMaterials(){
        this.$router.push({path:"/LearningHomework/FinishMaterials",query:{"lessonId":this.lessonId,"lessonCode":this.lessonCode}});
      }
    }
  }
</script>

<style scoped="">
  .teach {
    text-align: center;
  }
  .teach p:first-child {
    color: #ccc;
  }
  .teach p:nth-child(2) {
    color: #999;
  }
  .el-button--medium {
    padding: 1% 5%;
  }
  img {
    cursor: pointer;
  }
</style>

