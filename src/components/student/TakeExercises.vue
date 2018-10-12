<template>
  <div>
    <div class="teach">

      <p style="padding-top: 10%"><img @click="goToAddMaterials" src="../../assets/images/u768.png" alt=""></p>
      <p>There are no exercises here.</p>

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

    mounted () {
      let param = {
        lessonId:this.lessonId,
        pageIndex: 1,
        pageSize: 1
      };

      this.$http.get(`${process.env.NODE_ENV}/choiceQuestion/pageList`, {params:param})
        .then((res) => {
          if (res.data.code == 200) {
            if (res.data.entity.list.length > 0) {
              this.goToAddMaterials();
            }
          }
        }).catch((err) => {
        console.log(err);
      });
    },

    methods: {
      goToAddMaterials(){
        this.$router.push({path:"/LearningHomework/FinishExercise",query:{"lessonId":this.lessonId,"lessonCode":this.lessonCode}});
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

