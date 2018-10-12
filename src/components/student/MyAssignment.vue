<template>
  <div>
    <div class="teach" @click="goToAddMaterials">

      <p style="padding-top: 10%"><img  src="../../assets/images/u1046.png" width="140" height="139" alt=""></p>
      <p>There is no assignment here.</p>

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
      this.$http.get(`${process.env.NODE_ENV}/lessonAssignment/list?lessonId=${this.lessonId}`)
        .then((res) => {
          if (res.data.code == 200) {
            if (res.data.entity.length > 0) {
              this.goToAddMaterials();
            }
          }
        }).catch((err) => {
        console.log(err);
      });
    },

    methods: {
      goToAddMaterials(){
        this.$router.push({path:"/LearningHomework/FinishAssignment",query:{"lessonId":this.lessonId,"lessonCode":this.lessonCode}});
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

