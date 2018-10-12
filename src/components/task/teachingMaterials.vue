<template>
  <div class="teach">
    <div class="no-material" v-show="materialEmpty">
      <p><img src="../../assets/images/u768.png" alt=""></p>
      <p>Empty</p>
      <el-button size="medium" type="primary" @click="goToAddMaterials">
        <img src="../../assets/images/u60.png" alt="">
      </el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        checkedMaterialList: [],
        materialList: [],
        lessonId: this.$route.query.lessonId,
        materialEmpty: true,
        materialNumber: 0
      }
    },
    mounted() {
      this.getMaterialList();
    },
    methods: {
      goToAddMaterials: function() {
        this.$router.push({path:"/homePage/course/addMaterials",query:{"lessonId":this.lessonId}});
      },
      getMaterialList: function () {
        this.$http.get(`${process.env.NODE_ENV}/lessonMaterial/list`, {params: {status: 1, lessonId: this.lessonId}})
          .then((res) => {
            if (res.data.code == 200) {
              this.materialEmpty = res.data.entity.length == 0;
              this.materialNumber = res.data.entity.length;
              this.materialList = res.data.entity;
            } else {
              alert(res.data.message);
            }
          }).catch((err) => {
            alert(err);
          });
      }
    }
  }
</script>

<style scoped="">
  .teach {
    text-align: center;
    margin-top: 4%;
  }
.teach p:first-child {
color: #ccc;
margin-bottom: 3%;
}
.teach p:nth-child(2) {
color: #999;
margin-bottom: 3%;
}
.el-button--medium {
padding: 1% 5%;
}
</style>
